import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ユーザーをトークンから取得するヘルパー
async function getUserByToken(ctx: any, tokenIdentifier: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", tokenIdentifier))
    .unique();
}

// 回答を保存（中断再開対応）
export const saveProgress = mutation({
  args: {
    testId: v.id("tests"),
    answers: v.array(
      v.object({
        questionOrder: v.number(),
        selectedValue: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const existing = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();

    const now = Date.now();

    if (existing) {
      // 既存の進行データを更新
      await ctx.db.patch(existing._id, {
        answers: args.answers,
        updatedAt: now,
      });
      return existing._id;
    }

    // 新規の進行データを作成
    return await ctx.db.insert("testAnswers", {
      userId: user._id,
      testId: args.testId,
      answers: args.answers,
      startedAt: now,
      updatedAt: now,
    });
  },
});

// 進行中の回答を取得
export const getProgress = query({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    return await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();
  },
});

// 回答を削除（診断完了後または手動リセット）
export const clearProgress = mutation({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const progress = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();

    if (progress) {
      await ctx.db.delete(progress._id);
    }
  },
});

// ユーザーの全進行中テストを取得
export const listInProgress = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return [];

    const progressList = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) => q.eq("userId", user._id))
      .collect();

    // テスト情報も含めて返す
    return Promise.all(
      progressList.map(async (progress) => {
        const test = await ctx.db.get(progress.testId);
        return { ...progress, test };
      })
    );
  },
});
