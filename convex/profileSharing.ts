import { v } from "convex/values";
import { query } from "./_generated/server";

// プロフィール共有用URLの情報を取得
export const getProfileShareInfo = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user || !user.userId) {
      return null;
    }

    // QRコード/ディープリンク用のURL
    const profileUrl = `pernect://profile/${user.userId}`;
    const webUrl = `https://pernect.app/profile/${user.userId}`;

    return {
      userId: user.userId,
      profileUrl,
      webUrl,
      name: user.name,
      image: user.image,
    };
  },
});

// 公開プロフィール情報を取得（QRコードスキャン後）
export const getPublicProfile = query({
  args: {
    userId: v.string(), // @username形式
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) {
      return null;
    }

    // 公開情報のみ返す
    return {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      image: user.image,
      mbti: user.mbti,
      bio: user.bio,
    };
  },
});

// 友達のプロフィール詳細を取得（友達関係がある場合のみ詳細情報）
export const getFriendProfile = query({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      return null;
    }

    // 友達関係を確認
    const friendship1 = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", currentUser._id).eq("receiverId", args.friendId)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    const friendship2 = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", args.friendId).eq("receiverId", currentUser._id)
      )
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .first();

    const isFriend = !!friendship1 || !!friendship2;

    const friend = await ctx.db.get(args.friendId);
    if (!friend) {
      return null;
    }

    // 基本情報
    const baseProfile = {
      _id: friend._id,
      userId: friend.userId,
      name: friend.name,
      image: friend.image,
      mbti: friend.mbti,
      bio: friend.bio,
      isFriend,
    };

    // 友達でない場合は基本情報のみ
    if (!isFriend) {
      return baseProfile;
    }

    // 友達の場合は診断結果も取得
    const testResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", args.friendId))
      .order("desc")
      .take(10);

    // 結果の概要を作成
    const resultsOverview = testResults.map((result) => ({
      _id: result._id,
      testSlug: result.aiData?.testSlug,
      resultType: result.resultType,
      completedAt: result.completedAt,
    }));

    return {
      ...baseProfile,
      testResults: resultsOverview,
    };
  },
});
