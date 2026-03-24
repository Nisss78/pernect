import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
import { extractTestData, computeCompatibility } from "./compatibilityEngine";
import type { LastLoverCompatEntry } from "./compatibilityEngine";
import { generateDeepCompatibilityAnalysis } from "./ai";
import type { DeepCompatibilityInput } from "./ai";

// 友達申請を送る
export const sendRequest = mutation({
  args: {
    receiverUserId: v.string(), // @userId形式
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    // 現在のユーザーを取得
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    // 受信者を検索
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.receiverUserId))
      .unique();

    if (!receiver) {
      throw new Error("指定されたユーザーが見つかりません");
    }

    if (receiver._id === currentUser._id) {
      throw new Error("自分自身には申請できません");
    }

    // 既存の関係をチェック
    const existingRequest = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", currentUser._id).eq("receiverId", receiver._id)
      )
      .first();

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        throw new Error("既に申請中です");
      }
      if (existingRequest.status === "accepted") {
        throw new Error("既に友達です");
      }
    }

    // 逆方向の申請もチェック
    const reverseRequest = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", receiver._id).eq("receiverId", currentUser._id)
      )
      .first();

    if (reverseRequest) {
      if (reverseRequest.status === "pending") {
        // 相手からの申請があれば自動承認
        await ctx.db.patch(reverseRequest._id, {
          status: "accepted",
          respondedAt: Date.now(),
        });
        return { status: "auto_accepted", friendshipId: reverseRequest._id };
      }
      if (reverseRequest.status === "accepted") {
        throw new Error("既に友達です");
      }
    }

    // 新規申請を作成
    const friendshipId = await ctx.db.insert("friendships", {
      requesterId: currentUser._id,
      receiverId: receiver._id,
      status: "pending",
      requestedAt: Date.now(),
    });

    // 通知を送信
    if (receiver.tokenIdentifier) {
      await ctx.runMutation(api.notifications.sendFriendRequestNotification, {
        receiverUserId: receiver.tokenIdentifier,
        requesterName: currentUser.name ?? "誰か",
        friendshipId,
      });
    }

    return { status: "pending", friendshipId };
  },
});

// 友達申請を承認
export const acceptRequest = mutation({
  args: {
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("申請が見つかりません");
    }

    if (friendship.receiverId !== currentUser._id) {
      throw new Error("この申請を承認する権限がありません");
    }

    if (friendship.status !== "pending") {
      throw new Error("この申請は既に処理されています");
    }

    await ctx.db.patch(args.friendshipId, {
      status: "accepted",
      respondedAt: Date.now(),
    });

    // 申請者に通知を送信
    const requester = await ctx.db.get(friendship.requesterId);
    if (requester?.tokenIdentifier) {
      await ctx.runMutation(api.notifications.sendFriendAcceptedNotification, {
        requesterUserId: requester.tokenIdentifier,
        accepterName: currentUser.name ?? "誰か",
        friendshipId: args.friendshipId,
      });
    }

    return { success: true };
  },
});

// 友達申請を拒否
export const rejectRequest = mutation({
  args: {
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("申請が見つかりません");
    }

    if (friendship.receiverId !== currentUser._id) {
      throw new Error("この申請を拒否する権限がありません");
    }

    if (friendship.status !== "pending") {
      throw new Error("この申請は既に処理されています");
    }

    await ctx.db.patch(args.friendshipId, {
      status: "rejected",
      respondedAt: Date.now(),
    });

    return { success: true };
  },
});

// 友達申請をキャンセル（送信者側）
export const cancelRequest = mutation({
  args: {
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("申請が見つかりません");
    }

    if (friendship.requesterId !== currentUser._id) {
      throw new Error("この申請をキャンセルする権限がありません");
    }

    if (friendship.status !== "pending") {
      throw new Error("この申請は既に処理されています");
    }

    await ctx.db.patch(args.friendshipId, {
      status: "cancelled",
      respondedAt: Date.now(),
    });

    return { success: true };
  },
});

// 友達を解除
export const removeFriend = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    // 双方向で友達関係を検索
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

    const friendship = friendship1 || friendship2;
    if (!friendship) {
      throw new Error("友達関係が見つかりません");
    }

    // 友達関係を削除
    await ctx.db.delete(friendship._id);

    return { success: true };
  },
});

// 友達一覧を取得
export const listFriends = query({
  args: {},
  handler: async (ctx) => {
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

    // 自分が申請者の友達関係
    const asRequester = await ctx.db
      .query("friendships")
      .withIndex("by_requester", (q) => q.eq("requesterId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // 自分が受信者の友達関係
    const asReceiver = await ctx.db
      .query("friendships")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // 友達のユーザーIDを収集
    const friendIds = [
      ...asRequester.map((f) => f.receiverId),
      ...asReceiver.map((f) => f.requesterId),
    ];

    // 友達のプロフィール情報を取得
    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const user = await ctx.db.get(friendId);
        if (!user) return null;

        // 最新の診断結果を1つ取得
        const latestResult = await ctx.db
          .query("testResults")
          .withIndex("by_user", (q) => q.eq("userId", friendId))
          .order("desc")
          .first();

        return {
          _id: user._id,
          name: user.name,
          userId: user.userId,
          image: user.image,
          mbti: user.mbti,
          latestResult: latestResult
            ? {
                testSlug: latestResult.aiData?.testSlug,
                resultType: latestResult.resultType,
              }
            : null,
        };
      })
    );

    return friends.filter((f) => f !== null);
  },
});

// 受信した友達申請一覧を取得
export const listPendingRequests = query({
  args: {},
  handler: async (ctx) => {
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

    const requests = await ctx.db
      .query("friendships")
      .withIndex("by_receiver_status", (q) =>
        q.eq("receiverId", currentUser._id).eq("status", "pending")
      )
      .order("desc")
      .collect();

    // 申請者のプロフィール情報を取得
    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const requester = await ctx.db.get(request.requesterId);
        return {
          ...request,
          requester: requester
            ? {
                _id: requester._id,
                name: requester.name,
                userId: requester.userId,
                image: requester.image,
                mbti: requester.mbti,
              }
            : null,
        };
      })
    );

    return requestsWithProfiles.filter((r) => r.requester !== null);
  },
});

// 送信した友達申請一覧を取得
export const listSentRequests = query({
  args: {},
  handler: async (ctx) => {
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

    const requests = await ctx.db
      .query("friendships")
      .withIndex("by_requester", (q) => q.eq("requesterId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();

    // 受信者のプロフィール情報を取得
    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const receiver = await ctx.db.get(request.receiverId);
        return {
          ...request,
          receiver: receiver
            ? {
                _id: receiver._id,
                name: receiver.name,
                userId: receiver.userId,
                image: receiver.image,
                mbti: receiver.mbti,
              }
            : null,
        };
      })
    );

    return requestsWithProfiles.filter((r) => r.receiver !== null);
  },
});

// 特定のユーザーとの友達関係ステータスを取得
export const getFriendshipStatus = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { status: "none" };
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      return { status: "none" };
    }

    if (currentUser._id === args.userId) {
      return { status: "self" };
    }

    // 自分→相手
    const sent = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", currentUser._id).eq("receiverId", args.userId)
      )
      .first();

    if (sent) {
      return {
        status: sent.status,
        direction: "sent" as const,
        friendshipId: sent._id,
      };
    }

    // 相手→自分
    const received = await ctx.db
      .query("friendships")
      .withIndex("by_pair", (q) =>
        q.eq("requesterId", args.userId).eq("receiverId", currentUser._id)
      )
      .first();

    if (received) {
      return {
        status: received.status,
        direction: "received" as const,
        friendshipId: received._id,
      };
    }

    return { status: "none" };
  },
});

// 友達数を取得
export const getFriendsCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { friendsCount: 0, pendingCount: 0 };
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      return { friendsCount: 0, pendingCount: 0 };
    }

    // 友達数
    const asRequester = await ctx.db
      .query("friendships")
      .withIndex("by_requester", (q) => q.eq("requesterId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const asReceiver = await ctx.db
      .query("friendships")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // 未処理の受信申請数
    const pendingRequests = await ctx.db
      .query("friendships")
      .withIndex("by_receiver_status", (q) =>
        q.eq("receiverId", currentUser._id).eq("status", "pending")
      )
      .collect();

    return {
      friendsCount: asRequester.length + asReceiver.length,
      pendingCount: pendingRequests.length,
    };
  },
});

// 友達との相性分析用データを取得
export const getAnalysisData = query({
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

    const friend = await ctx.db.get(args.friendId);
    if (!friend) {
      return null;
    }

    // 自分の診断結果を取得
    const myResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .take(10);

    // 友達の診断結果を取得
    const friendResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", args.friendId))
      .order("desc")
      .take(10);

    // 既存の相性分析結果があるか確認
    const [id1, id2] =
      currentUser._id < args.friendId
        ? [currentUser._id, args.friendId]
        : [args.friendId, currentUser._id];

    const existingAnalysis = await ctx.db
      .query("friendAnalyses")
      .withIndex("by_user_pair", (q) => q.eq("user1Id", id1).eq("user2Id", id2))
      .order("desc")
      .first();

    return {
      currentUser: {
        _id: currentUser._id,
        name: currentUser.name,
        userId: currentUser.userId,
        image: currentUser.image,
        mbti: currentUser.mbti,
      },
      friend: {
        _id: friend._id,
        name: friend.name,
        userId: friend.userId,
        image: friend.image,
        mbti: friend.mbti,
      },
      myResults: myResults.map((r) => ({
        _id: r._id,
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
        completedAt: r.completedAt,
      })),
      friendResults: friendResults.map((r) => ({
        _id: r._id,
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
        completedAt: r.completedAt,
      })),
      existingAnalysis,
    };
  },
});

// 友達との相性分析を生成・保存
export const generateCompatibilityAnalysis = mutation({
  args: {
    friendId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
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

    if (!friendship1 && !friendship2) {
      throw new Error("友達関係がありません");
    }

    const friend = await ctx.db.get(args.friendId);
    if (!friend) {
      throw new Error("友達が見つかりません");
    }

    // 自動的に全ての診断結果を取得
    const myResultsData = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const friendResultsData = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", args.friendId))
      .collect();

    // 使用した診断結果情報を構築
    const usedResults = [
      ...myResultsData.map((r) => ({
        userId: currentUser._id,
        resultId: r._id,
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
      })),
      ...friendResultsData.map((r) => ({
        userId: args.friendId,
        resultId: r._id,
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
      })),
    ];

    // 新エンジンでテストデータを抽出
    const user1Data = extractTestData(myResultsData);
    const user2Data = extractTestData(friendResultsData);

    // Last Lover のDB相性データを取得（双方向チェック）
    let lastLoverCompat: LastLoverCompatEntry | null = null;
    if (user1Data.lastLover && user2Data.lastLover) {
      const entry = await ctx.db
        .query("lastLoverCompatibility")
        .withIndex("by_pair", (q) =>
          q
            .eq("typeCode", user1Data.lastLover!.resultType)
            .eq("compatibleType", user2Data.lastLover!.resultType)
        )
        .unique();
      if (entry) {
        lastLoverCompat = {
          compatibilityLevel: entry.compatibilityLevel,
          reason: entry.reason,
          advice: entry.advice,
        };
      } else {
        // 逆方向も試行
        const reverseEntry = await ctx.db
          .query("lastLoverCompatibility")
          .withIndex("by_pair", (q) =>
            q
              .eq("typeCode", user2Data.lastLover!.resultType)
              .eq("compatibleType", user1Data.lastLover!.resultType)
          )
          .unique();
        if (reverseEntry) {
          lastLoverCompat = {
            compatibilityLevel: reverseEntry.compatibilityLevel,
            reason: reverseEntry.reason,
            advice: reverseEntry.advice,
          };
        }
      }
    }

    // 相性分析ロジック（新エンジン）
    const analysis = computeCompatibility(
      currentUser.name || "あなた",
      friend.name || "友達",
      user1Data,
      user2Data,
      lastLoverCompat
    );

    // ID順序を統一して保存
    const [id1, id2] =
      currentUser._id < args.friendId
        ? [currentUser._id, args.friendId]
        : [args.friendId, currentUser._id];

    const analysisId = await ctx.db.insert("friendAnalyses", {
      user1Id: id1,
      user2Id: id2,
      usedResults,
      analysis,
      usedAiApi: false,
      createdAt: Date.now(),
    });

    // 友達に通知を送信（自分以外）
    const friendIdToNotify = currentUser._id === id1 ? id2 : id1;
    const friendToNotify = await ctx.db.get(friendIdToNotify);
    if (friendToNotify?.tokenIdentifier) {
      await ctx.runMutation(api.notifications.sendAnalysisCompleteNotification, {
        userId: friendToNotify.tokenIdentifier,
        friendName: currentUser.name ?? "友達",
        analysisId,
        compatibilityScore: analysis.overallCompatibility,
      });
    }

    return { analysisId, analysis };
  },
});

// 旧generateCompatibilityResult関数は compatibilityEngine.ts に移行済み

// 既存の相性分析結果を取得
export const getExistingAnalysis = query({
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

    const [id1, id2] =
      currentUser._id < args.friendId
        ? [currentUser._id, args.friendId]
        : [args.friendId, currentUser._id];

    return await ctx.db
      .query("friendAnalyses")
      .withIndex("by_user_pair", (q) => q.eq("user1Id", id1).eq("user2Id", id2))
      .order("desc")
      .first();
  },
});

// ユーザーIDで検索
export const searchByUserId = query({
  args: {
    userId: v.string(),
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

    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user || user._id === currentUser._id) {
      return null;
    }

    return {
      _id: user._id,
      name: user.name,
      userId: user.userId,
      image: user.image,
      mbti: user.mbti,
    };
  },
});

// AI深掘り分析のアクセス権チェック
export const checkDeepAnalysisAccess = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { hasAccess: false, reason: "not_authenticated" };
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      return { hasAccess: false, reason: "user_not_found" };
    }

    // APIキーチェック
    const hasApiKey = !!process.env.OPENROUTER_API_KEY;
    if (!hasApiKey) {
      return { hasAccess: false, reason: "no_api_key" };
    }

    // サブスクリプションチェック（Pro/Max）
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", currentUser._id).eq("status", "active")
      )
      .first();

    const premiumPlans = ["pro_monthly", "pro_yearly", "max_monthly", "max_yearly"];
    const hasPremium = subscription && premiumPlans.includes(subscription.planId);

    return {
      hasAccess: !!hasPremium,
      reason: hasPremium ? "available" : "premium_required",
      currentPlan: subscription?.planId || "free",
    };
  },
});

// AI深掘り相性分析を生成（プレミアム機能）
export const generateDeepAnalysis = mutation({
  args: {
    friendId: v.id("users"),
    analysisId: v.id("friendAnalyses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!currentUser) {
      throw new Error("ユーザーが見つかりません");
    }

    // プレミアムチェック
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", currentUser._id).eq("status", "active")
      )
      .first();

    const premiumPlans = ["pro_monthly", "pro_yearly", "max_monthly", "max_yearly"];
    if (!subscription || !premiumPlans.includes(subscription.planId)) {
      throw new Error("この機能にはProプラン以上が必要です");
    }

    // 既存の基本分析を取得
    const existingAnalysis = await ctx.db.get(args.analysisId);
    if (!existingAnalysis) {
      throw new Error("基本分析が見つかりません");
    }

    // 既に深掘り分析がある場合はエラー
    if (existingAnalysis.deepAnalysis) {
      throw new Error("この分析には既に深掘り分析があります");
    }

    const friend = await ctx.db.get(args.friendId);
    if (!friend) {
      throw new Error("友達が見つかりません");
    }

    // 2人の診断結果を取得
    const myResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .collect();

    const friendResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", args.friendId))
      .collect();

    // AI深掘り分析を生成
    const input: DeepCompatibilityInput = {
      user1Name: currentUser.name || "あなた",
      user2Name: friend.name || "友達",
      user1Tests: myResults.map((r) => ({
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
        scores: r.scores,
      })),
      user2Tests: friendResults.map((r) => ({
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
        scores: r.scores,
      })),
      basicAnalysis: {
        overallCompatibility: existingAnalysis.analysis.overallCompatibility,
        strengths: existingAnalysis.analysis.strengths,
        challenges: existingAnalysis.analysis.challenges,
        insights: existingAnalysis.analysis.insights,
      },
    };

    const deepResult = await generateDeepCompatibilityAnalysis(input);

    // 既存の分析に深掘り結果を追加
    await ctx.db.patch(args.analysisId, {
      deepAnalysis: {
        ...deepResult,
        generatedAt: Date.now(),
      },
      usedAiApi: true,
    });

    return { success: true, deepAnalysis: deepResult };
  },
});
