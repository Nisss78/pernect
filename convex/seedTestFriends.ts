import { v } from "convex/values";
import { mutation } from "./_generated/server";

// テスト用の仮ユーザーと友達関係を作成
export const createTestFriends = mutation({
  args: {},
  handler: async (ctx) => {
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

    // テスト用のダミーユーザーデータ
    const testUsers = [
      {
        name: "田中太郎",
        userId: "tanaka_taro",
        mbti: "ENFP",
        bio: "プログラミングと音楽が好きです！",
        image: null,
      },
      {
        name: "佐藤花子",
        userId: "sato_hanako",
        mbti: "INTJ",
        bio: "読書とカフェ巡りが趣味です☕",
        image: null,
      },
      {
        name: "山田健一",
        userId: "yamada_ken",
        mbti: "ESTP",
        bio: "スポーツ全般大好き！特にサッカー⚽",
        image: null,
      },
      {
        name: "鈴木美咲",
        userId: "suzuki_misaki",
        mbti: "INFP",
        bio: "イラストを描いています🎨",
        image: null,
      },
      {
        name: "高橋翔",
        userId: "takahashi_sho",
        mbti: "ENTJ",
        bio: "起業家を目指しています📈",
        image: null,
      },
    ];

    const createdUserIds = [];

    for (const userData of testUsers) {
      // 既存チェック
      const existing = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userData.userId))
        .unique();

      let userId;
      if (existing) {
        userId = existing._id;
      } else {
        // 新規作成（テスト用なのでtokenIdentifierはダミー）
        userId = await ctx.db.insert("users", {
          tokenIdentifier: `test_${userData.userId}_${Date.now()}`,
          name: userData.name,
          userId: userData.userId,
          mbti: userData.mbti,
          bio: userData.bio,
          image: userData.image ?? undefined,
          createdAt: Date.now(),
        });
      }
      createdUserIds.push(userId);
    }

    // 友達関係を作成（全員を友達に）
    let friendshipsCreated = 0;
    for (const friendId of createdUserIds) {
      // 既存の友達関係をチェック
      const existingFriendship1 = await ctx.db
        .query("friendships")
        .withIndex("by_pair", (q) =>
          q.eq("requesterId", currentUser._id).eq("receiverId", friendId)
        )
        .first();

      const existingFriendship2 = await ctx.db
        .query("friendships")
        .withIndex("by_pair", (q) =>
          q.eq("requesterId", friendId).eq("receiverId", currentUser._id)
        )
        .first();

      if (!existingFriendship1 && !existingFriendship2) {
        // 友達関係を作成（すでに承認済みとして）
        await ctx.db.insert("friendships", {
          requesterId: currentUser._id,
          receiverId: friendId,
          status: "accepted",
          requestedAt: Date.now() - 86400000, // 1日前
          respondedAt: Date.now(),
        });
        friendshipsCreated++;
      }
    }

    // テスト用の友達申請も作成（pending状態）
    const pendingRequests = [
      {
        name: "木村優子",
        userId: "kimura_yuko",
        mbti: "ISFJ",
        bio: "料理が得意です🍳",
      },
      {
        name: "渡辺拓也",
        userId: "watanabe_takuya",
        mbti: "ENTP",
        bio: "旅行好き✈️ 47都道府県制覇中",
      },
    ];

    let pendingCreated = 0;
    for (const userData of pendingRequests) {
      // 既存チェック
      let existing = await ctx.db
        .query("users")
        .withIndex("by_userId", (q) => q.eq("userId", userData.userId))
        .unique();

      let senderId;
      if (existing) {
        senderId = existing._id;
      } else {
        senderId = await ctx.db.insert("users", {
          tokenIdentifier: `test_${userData.userId}_${Date.now()}`,
          name: userData.name,
          userId: userData.userId,
          mbti: userData.mbti,
          bio: userData.bio,
          createdAt: Date.now(),
        });
      }

      // 既存の申請をチェック
      const existingRequest = await ctx.db
        .query("friendships")
        .withIndex("by_pair", (q) =>
          q.eq("requesterId", senderId).eq("receiverId", currentUser._id)
        )
        .first();

      if (!existingRequest) {
        // 相手からの友達申請（pending）を作成
        await ctx.db.insert("friendships", {
          requesterId: senderId,
          receiverId: currentUser._id,
          status: "pending",
          requestedAt: Date.now() - 3600000, // 1時間前
        });
        pendingCreated++;
      }
    }

    return {
      success: true,
      friendsCreated: friendshipsCreated,
      pendingRequestsCreated: pendingCreated,
      message: `${friendshipsCreated}人の友達と${pendingCreated}件の友達申請を作成しました`,
    };
  },
});

// テストデータを削除
export const clearTestFriends = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    // テスト用ユーザーを削除（tokenIdentifierが"test_"で始まるもの）
    const testUsers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), undefined))
      .collect();

    // tokenIdentifierがtest_で始まるユーザーを探す
    const allUsers = await ctx.db.query("users").collect();
    const testUserIds = allUsers
      .filter((u) => u.tokenIdentifier.startsWith("test_"))
      .map((u) => u._id);

    // 関連する友達関係を削除
    let deletedFriendships = 0;
    for (const userId of testUserIds) {
      const friendships1 = await ctx.db
        .query("friendships")
        .withIndex("by_requester", (q) => q.eq("requesterId", userId))
        .collect();

      const friendships2 = await ctx.db
        .query("friendships")
        .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
        .collect();

      for (const f of [...friendships1, ...friendships2]) {
        await ctx.db.delete(f._id);
        deletedFriendships++;
      }
    }

    // テストユーザーを削除
    for (const userId of testUserIds) {
      await ctx.db.delete(userId);
    }

    return {
      success: true,
      deletedUsers: testUserIds.length,
      deletedFriendships,
      message: `${testUserIds.length}人のテストユーザーと${deletedFriendships}件の友達関係を削除しました`,
    };
  },
});
