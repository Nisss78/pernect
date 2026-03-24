import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * 通知履歴を作成する
 */
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      data: args.data,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

/**
 * ユーザーの通知一覧を取得する
 */
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(50);

    return notifications;
  },
});

/**
 * 未読通知を取得する
 */
export const listUnread = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", user._id).eq("isRead", false))
      .collect();

    return notifications;
  },
});

/**
 * 通知を既読にする
 */
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("通知が見つかりません");
    }

    // ユーザー確認
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || notification.userId !== user._id) {
      throw new Error("この通知へのアクセス権限がありません");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
  },
});

/**
 * すべての通知を既読にする
 */
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", user._id).eq("isRead", false))
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, { isRead: true });
    }
  },
});

/**
 * 通知を削除する
 */
export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("通知が見つかりません");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || notification.userId !== user._id) {
      throw new Error("この通知を削除する権限がありません");
    }

    await ctx.db.delete(args.notificationId);
  },
});

/**
 * 通知件数を取得する
 */
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return 0;

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_unread", (q) => q.eq("userId", user._id).eq("isRead", false))
      .collect();

    return unreadNotifications.length;
  },
});

// フレンドリクエスト通知を送信（プッシュ通知 + 履歴保存）
export const sendFriendRequestNotification = mutation({
  args: {
    receiverUserId: v.string(), // tokenIdentifier
    requesterName: v.string(),
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    // ユーザーのpushTokenを取得
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.receiverUserId))
      .unique();

    if (!user) {
      console.log("User not found:", args.receiverUserId);
      return;
    }

    // 通知履歴を保存
    await ctx.db.insert("notifications", {
      userId: user._id,
      type: "friend_request",
      title: "新しい友達申請",
      message: `${args.requesterName}さんが友達リクエストを送りました`,
      data: {
        friendshipId: args.friendshipId,
        requesterName: args.requesterName,
      },
      isRead: false,
      createdAt: Date.now(),
    });

    if (!user.pushToken) {
      console.log("No push token found for user:", args.receiverUserId);
      return;
    }

    // Expo SDKでプッシュ通知送信
    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.pushToken,
          sound: "default",
          title: "新しい友達申請",
          body: `${args.requesterName}さんが友達リクエストを送りました`,
          data: { type: "friend_request", id: args.friendshipId },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Push notification failed:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  },
});

// 友達リクエスト承認通知（プッシュ通知 + 履歴保存）
export const sendFriendAcceptedNotification = mutation({
  args: {
    requesterUserId: v.string(), // tokenIdentifier
    accepterName: v.string(),
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.requesterUserId))
      .unique();

    if (!user) return;

    // 通知履歴を保存
    await ctx.db.insert("notifications", {
      userId: user._id,
      type: "friend_accepted",
      title: "友達リクエストが承認されました",
      message: `${args.accepterName}さんと友達になりました！`,
      data: {
        friendshipId: args.friendshipId,
        accepterName: args.accepterName,
      },
      isRead: false,
      createdAt: Date.now(),
    });

    if (!user.pushToken) return;

    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.pushToken,
          sound: "default",
          title: "友達リクエストが承認されました",
          body: `${args.accepterName}さんと友達になりました！`,
          data: { type: "friend_accepted", id: args.friendshipId },
        }),
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  },
});

// 相性分析完了通知（プッシュ通知 + 履歴保存）
export const sendAnalysisCompleteNotification = mutation({
  args: {
    userId: v.string(), // tokenIdentifier
    friendName: v.string(),
    analysisId: v.id("friendAnalyses"),
    compatibilityScore: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.userId))
      .unique();

    if (!user) return;

    // 通知履歴を保存
    await ctx.db.insert("notifications", {
      userId: user._id,
      type: "analysis_complete",
      title: "相性分析が完了しました",
      message: `${args.friendName}さんとの相性は${args.compatibilityScore}%です`,
      data: {
        analysisId: args.analysisId,
        friendName: args.friendName,
        compatibilityScore: args.compatibilityScore,
      },
      isRead: false,
      createdAt: Date.now(),
    });

    if (!user.pushToken) return;

    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.pushToken,
          sound: "default",
          title: "相性分析が完了しました",
          body: `${args.friendName}さんとの相性は${args.compatibilityScore}%です`,
          data: { type: "analysis_complete", id: args.analysisId },
        }),
      });
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  },
});
