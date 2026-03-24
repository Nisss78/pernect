import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ユニークなユーザーIDを生成する関数
async function generateUniqueUserId(
  ctx: any,
  baseName: string | undefined
): Promise<string> {
  // ベース名から英数字のみ抽出（なければ"user"を使用）
  let base = "user";
  if (baseName) {
    // 英数字のみ抽出して小文字に変換
    const alphanumeric = baseName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (alphanumeric.length >= 3) {
      base = alphanumeric.slice(0, 10); // 最大10文字
    }
  }

  // ランダムな4桁の数字を追加
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  let candidateId = `${base}${randomSuffix}`;

  // 重複チェック（最大5回試行）
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q: any) => q.eq("userId", candidateId))
      .unique();

    if (!existing) {
      return candidateId;
    }

    // 重複していた場合は新しいランダム数字で再試行
    const newSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    candidateId = `${base}${newSuffix}`;
  }

  // 5回試行しても重複していた場合はタイムスタンプベースのIDを生成
  const timestamp = Date.now().toString(36);
  return `${base}${timestamp}`;
}

export const store = mutation({
  args: {
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      // Also update push token if provided
      const patchData: any = {};
      if (user.name !== identity.name) {
        patchData.name = identity.name;
      }
      if (args.pushToken && user.pushToken !== args.pushToken) {
        patchData.pushToken = args.pushToken;
      }

      // userIdが未設定の場合は自動生成
      if (!user.userId) {
        patchData.userId = await generateUniqueUserId(ctx, identity.name);
      }

      if (Object.keys(patchData).length > 0) {
        await ctx.db.patch(user._id, patchData);
      }
      return user._id;
    }

    // 新規ユーザー用のuserIdを自動生成
    const newUserId = await generateUniqueUserId(ctx, identity.name);

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
      image: identity.pictureUrl,
      pushToken: args.pushToken,
      userId: newUserId,
      createdAt: Date.now(),
      onboardingCompleted: false,
    });
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});

// オンボーディング完了
export const completeOnboarding = mutation({
  args: {
    name: v.string(),
    birthday: v.string(), // ISO形式: "YYYY-MM-DD"
    mbti: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    image: v.optional(v.string()),
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

    await ctx.db.patch(user._id, {
      name: args.name,
      birthday: args.birthday,
      mbti: args.mbti,
      referralSource: args.referralSource,
      image: args.image ?? user.image,
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// プロフィール更新
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    userId: v.optional(v.string()),
    mbti: v.optional(v.string()),
    image: v.optional(v.string()),
    birthday: v.optional(v.string()),
    gender: v.optional(v.string()),
    bio: v.optional(v.string()),
    occupation: v.optional(v.string()),
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

    // userIdの重複チェック
    if (args.userId && args.userId !== user.userId) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .unique();
      if (existingUser) {
        throw new Error("このユーザーIDは既に使用されています");
      }
    }

    const updateData: Record<string, string | number | undefined> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updateData.name = args.name;
    if (args.userId !== undefined) updateData.userId = args.userId;
    if (args.mbti !== undefined) updateData.mbti = args.mbti;
    if (args.image !== undefined) updateData.image = args.image;
    if (args.birthday !== undefined) updateData.birthday = args.birthday;
    if (args.gender !== undefined) updateData.gender = args.gender;
    if (args.bio !== undefined) updateData.bio = args.bio;
    if (args.occupation !== undefined) updateData.occupation = args.occupation;

    await ctx.db.patch(user._id, updateData);
    return user._id;
  },
});

// ユーザーIDで検索
export const getByUserId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) {
      return null;
    }

    // プロフィール公開設定を確認
    if (user.profileVisibility === "private") {
      return null;
    }

    return user;
  },
});

// 公開プロフィール情報を取得（診断結果を含む）
export const getPublicProfile = query({
  args: {
    userId: v.string(),
    requesterId: v.optional(v.id("users")), // リクエストユーザーのID（友達チェック用）
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) {
      return { error: "ユーザーが見つかりません" };
    }

    // プライベートプロフィールは非表示
    if (user.profileVisibility === "private") {
      return { error: "非公開プロフィールです" };
    }

    // 友達のみの場合、友達チェック
    if (user.profileVisibility === "friends_only" && args.requesterId) {
      const requesterId = args.requesterId; // 型 narrowing用
      const friendship = await ctx.db
        .query("friendships")
        .withIndex("by_pair", (q) =>
          q
            .eq("requesterId", requesterId)
            .eq("receiverId", user._id)
        )
        .first();

      if (!friendship || friendship.status !== "accepted") {
        // 逆方向もチェック
        const reverseFriendship = await ctx.db
          .query("friendships")
          .withIndex("by_pair", (q) =>
            q
              .eq("requesterId", user._id)
              .eq("receiverId", requesterId)
          )
          .first();

        if (!reverseFriendship || reverseFriendship.status !== "accepted") {
          return { error: "友達のみ閲覧可能です" };
        }
      }
    }

    // 診断結果を取得（公開設定に応じて）
    const testResults: {
      _id: any;
      testId: any;
      resultType: string;
      completedAt: number;
    }[] = [];

    if (user.showTestResults !== false) {
      const results = await ctx.db
        .query("testResults")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();

      testResults.push(...results);
    }

    return {
      user: {
        userId: user.userId,
        name: user.name,
        image: user.image,
        bio: user.bio,
        mbti: user.mbti,
        occupation: user.occupation,
        profileVisibility: user.profileVisibility,
      },
      testResults: user.showTestResults !== false ? testResults : [],
    };
  },
});

// ユーザー検索（部分一致）
export const searchUsers = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      return [];
    }

    const limit = args.limit ?? 20;

    // 全ユーザーを取得してフィルタリング（小規模アプリ用）
    const allUsers = await ctx.db
      .query("users")
      .collect();

    // 検索クエリに一致するユーザーを抽出
    const searchQuery = args.query.toLowerCase().replace("@", "");
    const filtered = allUsers
      .filter((u) => {
        // 自分は除外
        if (u._id === currentUser._id) return false;

        // 非公開ユーザーは除外
        if (u.profileVisibility === "private") return false;

        // userIdまたはnameで部分一致検索
        return (
          (u.userId && u.userId.toLowerCase().includes(searchQuery)) ||
          (u.name && u.name.toLowerCase().includes(searchQuery))
        );
      })
      .slice(0, limit);

    return filtered.map((u) => ({
      _id: u._id,
      userId: u.userId,
      name: u.name,
      image: u.image,
      bio: u.bio,
      profileVisibility: u.profileVisibility,
    }));
  },
});

// プロフィール公開設定を更新
// デバッグ用: 全ユーザー一覧（開発環境のみ使用）
export const debugListAll = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      email: u.email,
      name: u.name,
      userId: u.userId,
    }));
  },
});

// 一括マイグレーション: userId未設定のユーザーに自動付与
export const migrateUserIds = mutation({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    const usersWithoutId = allUsers.filter((u) => !u.userId);

    let migrated = 0;
    for (const user of usersWithoutId) {
      const userId = await generateUniqueUserId(ctx, user.name);
      await ctx.db.patch(user._id, { userId });
      migrated++;
    }

    return { total: allUsers.length, migrated };
  },
});

export const updateProfileVisibility = mutation({
  args: {
    profileVisibility: v.optional(v.string()), // "public" | "friends_only" | "private"
    showEmail: v.optional(v.boolean()),
    showTestResults: v.optional(v.boolean()),
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

    const updateData: Record<string, string | boolean | number | undefined> = {
      updatedAt: Date.now(),
    };

    if (args.profileVisibility !== undefined) {
      updateData.profileVisibility = args.profileVisibility;
    }
    if (args.showEmail !== undefined) {
      updateData.showEmail = args.showEmail;
    }
    if (args.showTestResults !== undefined) {
      updateData.showTestResults = args.showTestResults;
    }

    await ctx.db.patch(user._id, updateData);
    return { success: true };
  },
});

// フレンドへの診断公開設定をトグル
export const toggleFriendDiagnosticVisibility = mutation({
  args: {
    testSlug: v.string(),
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

    const current = user.friendVisibleDiagnostics ?? [];
    const isVisible = current.includes(args.testSlug);

    const updated = isVisible
      ? current.filter((slug: string) => slug !== args.testSlug)
      : [...current, args.testSlug];

    await ctx.db.patch(user._id, {
      friendVisibleDiagnostics: updated,
      updatedAt: Date.now(),
    });

    return { success: true, isVisible: !isVisible };
  },
});

// アカウント削除（App Store要件）
export const deleteAccount = mutation({
  args: {},
  handler: async (ctx) => {
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

    const userId = user._id;

    // テスト結果を削除
    const testResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const r of testResults) {
      await ctx.db.delete(r._id);
    }

    // テスト回答を削除
    const testAnswers = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) => q.eq("userId", userId))
      .collect();
    for (const a of testAnswers) {
      await ctx.db.delete(a._id);
    }

    // シェアリンクを削除
    const shareLinks = await ctx.db
      .query("shareLinks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const s of shareLinks) {
      await ctx.db.delete(s._id);
    }

    // 友達関係を削除（申請者側）
    const sentFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_requester", (q) => q.eq("requesterId", userId))
      .collect();
    for (const f of sentFriendships) {
      await ctx.db.delete(f._id);
    }

    // 友達関係を削除（受信者側）
    const receivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
      .collect();
    for (const f of receivedFriendships) {
      await ctx.db.delete(f._id);
    }

    // 統合分析を削除
    const analyses = await ctx.db
      .query("integratedAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const a of analyses) {
      await ctx.db.delete(a._id);
    }

    // 通知を削除
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const n of notifications) {
      await ctx.db.delete(n._id);
    }

    // サブスクリプションを削除
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const s of subscriptions) {
      await ctx.db.delete(s._id);
    }

    // ユーザー本体を削除
    await ctx.db.delete(userId);

    return { success: true };
  },
});

// フレンド公開診断設定を取得
export const getFriendVisibleDiagnostics = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    return user?.friendVisibleDiagnostics ?? [];
  },
});
