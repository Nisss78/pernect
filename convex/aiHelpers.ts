import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// ============================================================
// Internal helpers for aiActions (queries & mutations)
// "use node" なしファイル - Convex ランタイムで実行
// ============================================================

// テスト結果をIDリストから取得
export const getResultsForAnalysis = internalQuery({
  args: {
    resultIds: v.array(v.id("testResults")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const results = [];
    for (const resultId of args.resultIds) {
      const result = await ctx.db.get(resultId);
      if (!result || result.userId !== args.userId) continue;

      const test = await ctx.db.get(result.testId);
      results.push({
        resultId,
        testSlug: test?.slug ?? "unknown",
        resultType: result.resultType,
        testTitle: test?.title,
        scores: result.scores,
        analysis: result.analysis,
        aiData: result.aiData,
      });
    }
    return results;
  },
});

// ユーザーをトークンから取得
export const getUserByToken = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
  },
});

// アクティブなサブスクリプションを取得
export const getActiveSubscription = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q: any) =>
        q.eq("userId", args.userId).eq("status", "active")
      )
      .first();
  },
});

// 統合分析結果を保存
export const saveIntegratedAnalysis = internalMutation({
  args: {
    userId: v.id("users"),
    selectedResults: v.array(v.object({
      resultId: v.id("testResults"),
      testSlug: v.string(),
      resultType: v.string(),
    })),
    theme: v.string(),
    analysis: v.object({
      title: v.string(),
      summary: v.string(),
      insights: v.array(v.string()),
      strengths: v.array(v.string()),
      challenges: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("integratedAnalyses", {
      userId: args.userId,
      selectedResults: args.selectedResults,
      theme: args.theme,
      analysis: args.analysis,
      createdAt: Date.now(),
    });
  },
});

// 重複チェック: 同じ selectedResultIds + theme の分析が24時間以内に存在するか
export const findRecentDuplicate = internalQuery({
  args: {
    userId: v.id("users"),
    theme: v.string(),
    selectedResultIds: v.array(v.id("testResults")),
  },
  handler: async (ctx, args) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const recent = await ctx.db
      .query("integratedAnalyses")
      .withIndex("by_user_theme", (q: any) =>
        q.eq("userId", args.userId).eq("theme", args.theme)
      )
      .order("desc")
      .take(10);

    const sortedInput = [...args.selectedResultIds].sort();
    for (const analysis of recent) {
      if (analysis.createdAt < oneDayAgo) continue;
      const sortedExisting = analysis.selectedResults
        .map((r: any) => r.resultId)
        .sort();
      if (
        sortedInput.length === sortedExisting.length &&
        sortedInput.every((id: string, i: number) => id === sortedExisting[i])
      ) {
        return analysis;
      }
    }
    return null;
  },
});

// 日次AI分析回数を取得
export const getDailyAnalysisCount = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const analyses = await ctx.db
      .query("integratedAnalyses")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .order("desc")
      .take(50);

    return analyses.filter((a: any) => a.createdAt >= todayStart.getTime()).length;
  },
});

// 深掘り相性分析の入力データを取得
export const getDeepAnalysisInput = internalQuery({
  args: {
    currentUserId: v.id("users"),
    friendId: v.id("users"),
    analysisId: v.id("friendAnalyses"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db.get(args.currentUserId);
    const friend = await ctx.db.get(args.friendId);
    const existingAnalysis = await ctx.db.get(args.analysisId);

    if (!currentUser || !friend || !existingAnalysis) return null;
    if (existingAnalysis.deepAnalysis) return null;

    const myResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q: any) => q.eq("userId", args.currentUserId))
      .collect();

    const friendResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q: any) => q.eq("userId", args.friendId))
      .collect();

    return {
      user1Name: currentUser.name || "あなた",
      user2Name: friend.name || "友達",
      user1Tests: myResults.map((r: any) => ({
        testSlug: r.aiData?.testSlug || "unknown",
        resultType: r.resultType,
        scores: r.scores,
      })),
      user2Tests: friendResults.map((r: any) => ({
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
  },
});

// 深掘り分析結果を保存
export const saveDeepAnalysis = internalMutation({
  args: {
    analysisId: v.id("friendAnalyses"),
    deepAnalysis: v.object({
      title: v.string(),
      overview: v.string(),
      sections: v.array(v.object({
        category: v.string(),
        insight: v.string(),
        advice: v.string(),
      })),
      hiddenDynamics: v.string(),
      growthPath: v.string(),
      generatedAt: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.analysisId, {
      deepAnalysis: args.deepAnalysis,
      usedAiApi: true,
    });
  },
});
