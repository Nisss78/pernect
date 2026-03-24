import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// ============================================================
// RevenueCat product_id → Convex planId マッピング
// ============================================================

const PRODUCT_TO_PLAN_MAP: Record<string, string> = {
  pernect_premium_monthly: "premium_monthly",
  pernect_premium_yearly: "premium_yearly",
};

function mapProductIdToPlanId(productId: string): string {
  return PRODUCT_TO_PLAN_MAP[productId] ?? productId;
}

// ============================================================
// Queries
// ============================================================

/**
 * サブスクリプションプラン一覧を取得する
 */
export const listPlans = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("subscriptionPlans")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();
  },
});

/**
 * 現在のユーザーサブスクリプションを取得する
 */
export const getCurrentSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return null;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "active")
      )
      .first();
    if (!subscription) return null;

    const plan = await ctx.db
      .query("subscriptionPlans")
      .withIndex("by_planId", (q) => q.eq("planId", subscription.planId))
      .unique();

    return { ...subscription, plan };
  },
});

// ============================================================
// Client-side sync mutation (購入成功後・アプリ復帰時)
// ============================================================

/**
 * RevenueCat購入成功後にクライアントからサブスクリプションを同期する
 */
export const syncSubscription = mutation({
  args: {
    planId: v.string(),
    status: v.string(),
    revenuecatAppUserId: v.optional(v.string()),
    revenuecatProductId: v.optional(v.string()),
    revenuecatEntitlementId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new Error("ユーザーが見つかりません");

    const now = Date.now();

    // 既存のアクティブなサブスクリプションをチェック
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", user._id).eq("status", "active")
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        planId: args.planId,
        status: args.status,
        revenuecatAppUserId: args.revenuecatAppUserId,
        revenuecatProductId: args.revenuecatProductId,
        revenuecatEntitlementId: args.revenuecatEntitlementId,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: now,
      });
      return existing._id;
    }

    // 新規作成
    return await ctx.db.insert("subscriptions", {
      userId: user._id,
      planId: args.planId,
      status: args.status,
      startDate: now,
      revenuecatAppUserId: args.revenuecatAppUserId,
      revenuecatProductId: args.revenuecatProductId,
      revenuecatEntitlementId: args.revenuecatEntitlementId,
      currentPeriodEnd: args.currentPeriodEnd,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// ============================================================
// Webhook internal mutation (RevenueCat S2S)
// ============================================================

/**
 * RevenueCat Webhookからサブスクリプションを更新する（internal）
 */
export const handleWebhookEvent = internalMutation({
  args: {
    revenuecatAppUserId: v.string(),
    eventType: v.string(),
    productId: v.string(),
    expirationAtMs: v.optional(v.number()),
    purchasedAtMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const planId = mapProductIdToPlanId(args.productId);
    const now = Date.now();

    // revenuecatAppUserIdでサブスクリプションを検索
    let subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_revenuecatAppUserId", (q) =>
        q.eq("revenuecatAppUserId", args.revenuecatAppUserId)
      )
      .first();

    // サブスクリプションが見つからない場合、app_user_idをConvex userIdとして検索
    if (!subscription) {
      try {
        const userId = ctx.db.normalizeId("users", args.revenuecatAppUserId);
        if (userId) {
          subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();
        }
      } catch {
        // 無効なIDフォーマットの場合は無視
      }
    }

    switch (args.eventType) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "UNCANCELLATION": {
        if (subscription) {
          await ctx.db.patch(subscription._id, {
            planId,
            status: "active",
            cancelAtPeriodEnd: false,
            revenuecatProductId: args.productId,
            currentPeriodEnd: args.expirationAtMs,
            updatedAt: now,
          });
        } else {
          console.warn(`Webhook: User not found for app_user_id=${args.revenuecatAppUserId}`);
        }
        break;
      }

      case "CANCELLATION": {
        if (subscription) {
          await ctx.db.patch(subscription._id, {
            cancelAtPeriodEnd: true,
            updatedAt: now,
          });
        }
        break;
      }

      case "EXPIRATION": {
        if (subscription) {
          await ctx.db.patch(subscription._id, {
            status: "expired",
            cancelAtPeriodEnd: false,
            updatedAt: now,
          });
        }
        break;
      }

      case "BILLING_ISSUE": {
        if (subscription) {
          await ctx.db.patch(subscription._id, {
            status: "billing_issue",
            updatedAt: now,
          });
        }
        break;
      }

      case "PRODUCT_CHANGE": {
        if (subscription) {
          await ctx.db.patch(subscription._id, {
            planId,
            revenuecatProductId: args.productId,
            currentPeriodEnd: args.expirationAtMs,
            updatedAt: now,
          });
        }
        break;
      }

      case "TEST":
        console.log("RevenueCat TEST webhook received");
        break;

      default:
        console.log("Unhandled RevenueCat event:", args.eventType);
    }
  },
});

// ============================================================
// Seed data
// ============================================================

/**
 * プランの初期データを作成する（開発用）
 */
export const seedPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const existingPlans = await ctx.db.query("subscriptionPlans").collect();
    if (existingPlans.length > 0) {
      // 既存プランを削除して再作成
      for (const plan of existingPlans) {
        await ctx.db.delete(plan._id);
      }
    }

    const now = Date.now();

    const plans = [
      {
        planId: "premium_monthly",
        name: "Premium",
        description: "全機能フルアクセス",
        billingPeriod: "monthly",
        price: 580,
        currency: "JPY",
        features: [
          "AI統合分析（30回/日）",
          "深掘り相性分析",
          "全診断テスト解放",
          "無制限の結果保存",
          "フレンド機能",
        ],
        isActive: true,
        sortOrder: 1,
        revenuecatProductId: "pernect_premium_monthly",
        revenuecatEntitlementId: "premium",
      },
      {
        planId: "premium_yearly",
        name: "Premium",
        description: "年次プラン（17%お得）",
        billingPeriod: "yearly",
        price: 5800,
        currency: "JPY",
        features: [
          "AI統合分析（30回/日）",
          "深掘り相性分析",
          "全診断テスト解放",
          "無制限の結果保存",
          "フレンド機能",
        ],
        isActive: true,
        sortOrder: 2,
        revenuecatProductId: "pernect_premium_yearly",
        revenuecatEntitlementId: "premium",
      },
    ];

    for (const plan of plans) {
      await ctx.db.insert("subscriptionPlans", {
        ...plan,
        createdAt: now,
      });
    }

    return { success: true, seeded: plans.length };
  },
});
