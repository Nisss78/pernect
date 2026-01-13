import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

    // 相性分析ロジック（MBTI, 最後の恋人診断などを考慮）
    const analysis = generateCompatibilityResult(
      currentUser,
      friend,
      myResultsData,
      friendResultsData
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

    return { analysisId, analysis };
  },
});

// 相性分析結果を生成するヘルパー関数
function generateCompatibilityResult(
  user1: any,
  user2: any,
  user1Results: any[],
  user2Results: any[]
) {
  // MBTI相性マトリクス
  const mbtiCompatibility: Record<string, Record<string, number>> = {
    ENFP: { INFJ: 95, INTJ: 90, ENFJ: 85, ENTP: 80, INFP: 75 },
    INFJ: { ENFP: 95, ENTP: 90, INTJ: 85, INFP: 80, ENFJ: 75 },
    INTJ: { ENFP: 90, ENTP: 85, INFJ: 85, ENTJ: 80, INTP: 75 },
    ENTP: { INFJ: 90, INTJ: 85, ENFP: 80, INTP: 75, ENTJ: 70 },
    INFP: { ENFJ: 95, ENTJ: 90, INFJ: 85, ENFP: 80, ISFJ: 75 },
    ENFJ: { INFP: 95, ISFP: 90, INFJ: 85, ENFP: 80, ESFJ: 75 },
    ENTJ: { INFP: 90, INTP: 85, ENFP: 80, INTJ: 80, ENTP: 75 },
    INTP: { ENTJ: 85, ESTJ: 80, INTJ: 75, ENTP: 75, INFJ: 70 },
    ISFJ: { ESFP: 90, ESTP: 85, INFP: 80, ISFP: 75, ISTJ: 70 },
    ESFJ: { ISFP: 90, ISTP: 85, ENFJ: 80, ESFP: 75, ISFJ: 70 },
    ISTJ: { ESFP: 85, ESTP: 80, ISFJ: 75, ESTJ: 70, ISTP: 65 },
    ESTJ: { ISFP: 85, ISTP: 80, INTP: 80, ISTJ: 75, ESFJ: 70 },
    ISFP: { ENFJ: 90, ESFJ: 90, ESTJ: 85, ENTJ: 80, ISFJ: 75 },
    ESFP: { ISFJ: 90, ISTJ: 85, ESFJ: 80, ESTP: 75, ENFP: 70 },
    ISTP: { ESFJ: 85, ESTJ: 80, ESTP: 75, ISFP: 70, INTP: 65 },
    ESTP: { ISFJ: 85, ISTJ: 80, ISTP: 75, ESFP: 75, ENTP: 70 },
  };

  let overallCompatibility = 70; // デフォルト
  const insights: { category: string; description: string; score: number }[] = [];
  const strengths: string[] = [];
  const challenges: string[] = [];
  const recommendations: string[] = [];

  // MBTI相性計算
  if (user1.mbti && user2.mbti) {
    const mbtiScore =
      mbtiCompatibility[user1.mbti]?.[user2.mbti] ||
      mbtiCompatibility[user2.mbti]?.[user1.mbti] ||
      65;
    overallCompatibility = mbtiScore;

    insights.push({
      category: "性格タイプ",
      description: `${user1.mbti}と${user2.mbti}の組み合わせ`,
      score: mbtiScore,
    });

    // MBTI相性に基づく強みと課題
    if (mbtiScore >= 85) {
      strengths.push("自然な相性で、お互いを深く理解できる関係");
      strengths.push("コミュニケーションがスムーズに取りやすい");
    } else if (mbtiScore >= 70) {
      strengths.push("異なる視点から刺激を受け合える関係");
      challenges.push("考え方の違いで意見が分かれることも");
    } else {
      challenges.push("価値観の違いを理解する努力が必要");
      recommendations.push("お互いの違いを尊重することが大切");
    }
  }

  // 最後の恋人診断の結果を考慮
  const user1LoverResult = user1Results.find(
    (r) => r?.aiData?.testSlug === "last-lover"
  );
  const user2LoverResult = user2Results.find(
    (r) => r?.aiData?.testSlug === "last-lover"
  );

  if (user1LoverResult && user2LoverResult) {
    insights.push({
      category: "恋愛スタイル",
      description: `${user1LoverResult.resultType}と${user2LoverResult.resultType}の恋愛相性`,
      score: 75,
    });
    strengths.push("恋愛診断から見ると、お互いの恋愛スタイルを理解しやすい");
  }

  // 総合スコアの調整
  if (insights.length > 1) {
    overallCompatibility = Math.round(
      insights.reduce((sum, i) => sum + i.score, 0) / insights.length
    );
  }

  // 相性レベルの判定
  let compatibilityLevel: string;
  let title: string;
  if (overallCompatibility >= 85) {
    compatibilityLevel = "best";
    title = "✨ 最高の相性！";
    strengths.push("お互いを高め合える素晴らしいパートナー");
  } else if (overallCompatibility >= 70) {
    compatibilityLevel = "good";
    title = "💫 良い相性";
    strengths.push("バランスの取れた良好な関係を築ける");
  } else if (overallCompatibility >= 55) {
    compatibilityLevel = "neutral";
    title = "🌟 普通の相性";
    recommendations.push("お互いの違いを理解し合う姿勢が大切");
  } else {
    compatibilityLevel = "challenging";
    title = "💪 挑戦的な相性";
    recommendations.push("違いを乗り越えることで大きく成長できる");
  }

  // デフォルトの推奨事項
  if (recommendations.length === 0) {
    recommendations.push("定期的なコミュニケーションを心がけましょう");
    recommendations.push("お互いの強みを活かした協力関係を築きましょう");
  }

  return {
    overallCompatibility,
    compatibilityLevel,
    title,
    summary: `${user1.name || "あなた"}と${user2.name || "友達"}の相性は${overallCompatibility}%です`,
    strengths,
    challenges,
    recommendations,
    insights,
  };
}

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
