import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

      if (Object.keys(patchData).length > 0) {
        await ctx.db.patch(user._id, patchData);
      }
      return user._id;
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
      image: identity.pictureUrl,
      pushToken: args.pushToken,
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