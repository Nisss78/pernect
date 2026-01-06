import { v } from "convex/values";
import { query } from "./_generated/server";

// タイプコードからキャラクター情報を取得
export const getTypeByCode = query({
  args: {
    typeCode: v.string(),
  },
  handler: async (ctx, args) => {
    const type = await ctx.db
      .query("lastLoverTypes")
      .withIndex("by_type_code", (q) => q.eq("typeCode", args.typeCode))
      .unique();

    return type;
  },
});

// 全タイプの一覧を取得
export const listAllTypes = query({
  args: {},
  handler: async (ctx) => {
    const types = await ctx.db.query("lastLoverTypes").collect();

    // タイプコード順にソート
    return types.sort((a, b) => a.typeCode.localeCompare(b.typeCode));
  },
});

// タイプコードから相性情報を取得
export const getCompatibilityForType = query({
  args: {
    typeCode: v.string(),
  },
  handler: async (ctx, args) => {
    const compatibilities = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_type", (q) => q.eq("typeCode", args.typeCode))
      .collect();

    // 相性レベルでソート（best → good → neutral → challenging）
    const levelOrder: Record<string, number> = {
      best: 0,
      good: 1,
      neutral: 2,
      challenging: 3,
    };

    const sorted = compatibilities.sort(
      (a, b) =>
        (levelOrder[a.compatibilityLevel] || 4) -
        (levelOrder[b.compatibilityLevel] || 4)
    );

    // 相手タイプのキャラクター情報も取得
    const withTypeInfo = await Promise.all(
      sorted.map(async (compat) => {
        const compatibleTypeInfo = await ctx.db
          .query("lastLoverTypes")
          .withIndex("by_type_code", (q) =>
            q.eq("typeCode", compat.compatibleType)
          )
          .unique();

        return {
          ...compat,
          compatibleTypeInfo: compatibleTypeInfo
            ? {
                characterName: compatibleTypeInfo.characterName,
                emoji: compatibleTypeInfo.emoji,
                summary: compatibleTypeInfo.summary,
              }
            : null,
        };
      })
    );

    return withTypeInfo;
  },
});

// 相性の良いタイプのみ取得（best, good）
export const getBestCompatibilities = query({
  args: {
    typeCode: v.string(),
  },
  handler: async (ctx, args) => {
    const compatibilities = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_type", (q) => q.eq("typeCode", args.typeCode))
      .collect();

    // best, goodのみフィルター
    const bestMatches = compatibilities.filter(
      (c) => c.compatibilityLevel === "best" || c.compatibilityLevel === "good"
    );

    // 相性レベルでソート
    const sorted = bestMatches.sort((a, b) =>
      a.compatibilityLevel === "best" ? -1 : 1
    );

    // 相手タイプのキャラクター情報も取得
    const withTypeInfo = await Promise.all(
      sorted.map(async (compat) => {
        const compatibleTypeInfo = await ctx.db
          .query("lastLoverTypes")
          .withIndex("by_type_code", (q) =>
            q.eq("typeCode", compat.compatibleType)
          )
          .unique();

        return {
          ...compat,
          compatibleTypeInfo: compatibleTypeInfo
            ? {
                characterName: compatibleTypeInfo.characterName,
                emoji: compatibleTypeInfo.emoji,
                summary: compatibleTypeInfo.summary,
              }
            : null,
        };
      })
    );

    return withTypeInfo;
  },
});

// 注意が必要なタイプのみ取得（challenging）
export const getChallengingCompatibilities = query({
  args: {
    typeCode: v.string(),
  },
  handler: async (ctx, args) => {
    const compatibilities = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_type", (q) => q.eq("typeCode", args.typeCode))
      .collect();

    // challengingのみフィルター
    const challenging = compatibilities.filter(
      (c) => c.compatibilityLevel === "challenging"
    );

    // 相手タイプのキャラクター情報も取得
    const withTypeInfo = await Promise.all(
      challenging.map(async (compat) => {
        const compatibleTypeInfo = await ctx.db
          .query("lastLoverTypes")
          .withIndex("by_type_code", (q) =>
            q.eq("typeCode", compat.compatibleType)
          )
          .unique();

        return {
          ...compat,
          compatibleTypeInfo: compatibleTypeInfo
            ? {
                characterName: compatibleTypeInfo.characterName,
                emoji: compatibleTypeInfo.emoji,
                summary: compatibleTypeInfo.summary,
              }
            : null,
        };
      })
    );

    return withTypeInfo;
  },
});

// 2つのタイプ間の相性を取得
export const getCompatibilityBetween = query({
  args: {
    typeCode1: v.string(),
    typeCode2: v.string(),
  },
  handler: async (ctx, args) => {
    // 双方向の相性を取得
    const compat1to2 = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_pair", (q) =>
        q.eq("typeCode", args.typeCode1).eq("compatibleType", args.typeCode2)
      )
      .unique();

    const compat2to1 = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_pair", (q) =>
        q.eq("typeCode", args.typeCode2).eq("compatibleType", args.typeCode1)
      )
      .unique();

    // タイプ情報も取得
    const type1Info = await ctx.db
      .query("lastLoverTypes")
      .withIndex("by_type_code", (q) => q.eq("typeCode", args.typeCode1))
      .unique();

    const type2Info = await ctx.db
      .query("lastLoverTypes")
      .withIndex("by_type_code", (q) => q.eq("typeCode", args.typeCode2))
      .unique();

    return {
      type1: type1Info,
      type2: type2Info,
      compatibility1to2: compat1to2,
      compatibility2to1: compat2to1,
    };
  },
});

// 結果詳細取得（タイプ情報 + 相性情報を含む）
export const getResultDetails = query({
  args: {
    typeCode: v.string(),
  },
  handler: async (ctx, args) => {
    // タイプ情報を取得
    const typeInfo = await ctx.db
      .query("lastLoverTypes")
      .withIndex("by_type_code", (q) => q.eq("typeCode", args.typeCode))
      .unique();

    if (!typeInfo) {
      return null;
    }

    // 相性情報を取得
    const compatibilities = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_type", (q) => q.eq("typeCode", args.typeCode))
      .collect();

    // 相性レベルでグループ化
    const best = compatibilities.filter((c) => c.compatibilityLevel === "best");
    const good = compatibilities.filter((c) => c.compatibilityLevel === "good");
    const challenging = compatibilities.filter(
      (c) => c.compatibilityLevel === "challenging"
    );

    // 各カテゴリのタイプ情報を取得
    const enrichWithTypeInfo = async (
      items: typeof compatibilities
    ) => {
      return Promise.all(
        items.map(async (compat) => {
          const info = await ctx.db
            .query("lastLoverTypes")
            .withIndex("by_type_code", (q) =>
              q.eq("typeCode", compat.compatibleType)
            )
            .unique();

          return {
            ...compat,
            compatibleTypeInfo: info
              ? {
                  characterName: info.characterName,
                  emoji: info.emoji,
                  summary: info.summary,
                }
              : null,
          };
        })
      );
    };

    return {
      typeInfo,
      compatibilities: {
        best: await enrichWithTypeInfo(best),
        good: await enrichWithTypeInfo(good),
        challenging: await enrichWithTypeInfo(challenging),
      },
    };
  },
});
