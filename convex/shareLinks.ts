import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * シェアリンク管理サービス
 *
 * 診断結果のシェアリンクを作成・管理するAPI
 */

// 8文字の短縮ID生成（英数字のみ）
function generateShareId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * シェアリンクを作成する
 *
 * @param resultId - 共有する診断結果のID
 * @param expiresInDays - 有効期限（日数）。省略時は無期限
 */
export const create = mutation({
  args: {
    resultId: v.id("testResults"),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    // 結果の所有者チェック
    const result = await ctx.db.get(args.resultId);
    if (!result) {
      throw new Error("診断結果が見つかりません");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || result.userId !== user._id) {
      throw new Error("この診断結果へのアクセス権限がありません");
    }

    // 既存のシェアリンクがあれば返す
    const existingLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_result", (q) => q.eq("resultId", args.resultId))
      .filter((q) =>
        q.or(
          q.eq(q.field("expiresAt"), undefined),
          q.gt(q.field("expiresAt"), Date.now())
        )
      )
      .first();

    if (existingLink) {
      return {
        shareId: existingLink.shareId,
        shareUrl: `pernect://share/${existingLink.shareId}`,
        webUrl: `https://pernect.app/share/${existingLink.shareId}`,
      };
    }

    // 新しいシェアIDを生成（重複チェック付き）
    let shareId = generateShareId();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await ctx.db
        .query("shareLinks")
        .withIndex("by_shareId", (q) => q.eq("shareId", shareId))
        .first();
      if (!existing) break;
      shareId = generateShareId();
      attempts++;
    }

    // 有効期限の計算
    const expiresAt = args.expiresInDays
      ? Date.now() + args.expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    // シェアリンクを作成
    await ctx.db.insert("shareLinks", {
      resultId: args.resultId,
      userId: user._id,
      shareId,
      expiresAt,
      accessCount: 0,
      createdAt: Date.now(),
    });

    // 結果のshareSettingsを更新
    await ctx.db.patch(args.resultId, {
      shareSettings: {
        isPublic: true,
        shareId,
      },
    });

    return {
      shareId,
      shareUrl: `pernect://share/${shareId}`,
      webUrl: `https://pernect.app/share/${shareId}`,
    };
  },
});

/**
 * シェアIDから公開結果を取得する
 */
export const getSharedResult = query({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, args) => {
    // シェアリンクを検索
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .first();

    if (!shareLink) {
      return { error: "シェアリンクが見つかりません" };
    }

    // 有効期限チェック
    if (shareLink.expiresAt && shareLink.expiresAt < Date.now()) {
      return { error: "このシェアリンクは有効期限が切れています" };
    }

    // 診断結果を取得
    const result = await ctx.db.get(shareLink.resultId);
    if (!result) {
      return { error: "診断結果が見つかりません" };
    }

    // 非公開設定チェック
    if (result.shareSettings && !result.shareSettings.isPublic) {
      return { error: "この結果は非公開に設定されています" };
    }

    // テスト情報を取得
    const test = await ctx.db.get(result.testId);

    // ユーザー情報を取得（名前のみ）
    const user = await ctx.db.get(result.userId);

    return {
      result: {
        resultType: result.resultType,
        scores: result.scores,
        analysis: result.analysis,
        completedAt: result.completedAt,
      },
      test: test
        ? {
            title: test.title,
            slug: test.slug,
            icon: test.icon,
            gradientStart: test.gradientStart,
            gradientEnd: test.gradientEnd,
            citation: test.citation,
          }
        : null,
      user: user
        ? {
            name: user.name || "匿名ユーザー",
          }
        : null,
      shareLink: {
        accessCount: shareLink.accessCount,
        createdAt: shareLink.createdAt,
      },
    };
  },
});

/**
 * シェアリンクのアクセスカウントを増加させる（閲覧時に呼び出す）
 */
export const incrementAccessCount = mutation({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, args) => {
    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .first();

    if (shareLink) {
      await ctx.db.patch(shareLink._id, {
        accessCount: shareLink.accessCount + 1,
      });
    }
  },
});

/**
 * シェアリンクを削除する
 */
export const deleteLink = mutation({
  args: {
    shareId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const shareLink = await ctx.db
      .query("shareLinks")
      .withIndex("by_shareId", (q) => q.eq("shareId", args.shareId))
      .first();

    if (!shareLink) {
      throw new Error("シェアリンクが見つかりません");
    }

    if (shareLink.userId !== user._id) {
      throw new Error("このシェアリンクを削除する権限がありません");
    }

    // 関連する結果のshareSettingsをリセット
    const result = await ctx.db.get(shareLink.resultId);
    if (result) {
      await ctx.db.patch(shareLink.resultId, {
        shareSettings: {
          isPublic: false,
          shareId: undefined,
        },
      });
    }

    await ctx.db.delete(shareLink._id);

    return { success: true };
  },
});

/**
 * ユーザーの全シェアリンクを取得する
 */
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      return [];
    }

    const links = await ctx.db
      .query("shareLinks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // 各リンクに関連する結果とテスト情報を追加
    const enrichedLinks = await Promise.all(
      links.map(async (link) => {
        const result = await ctx.db.get(link.resultId);
        const test = result ? await ctx.db.get(result.testId) : null;

        return {
          ...link,
          result: result
            ? {
                resultType: result.resultType,
                completedAt: result.completedAt,
              }
            : null,
          test: test
            ? {
                title: test.title,
                slug: test.slug,
              }
            : null,
          isExpired: link.expiresAt ? link.expiresAt < Date.now() : false,
        };
      })
    );

    return enrichedLinks;
  },
});
