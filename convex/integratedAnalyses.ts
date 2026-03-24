import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { generateAnalysis as generateAIAnalysis, type AnalysisInput } from "./ai";

// ユーザーをトークンから取得するヘルパー
async function getUserByToken(ctx: any, tokenIdentifier: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", tokenIdentifier))
    .unique();
}

// ユーザーのサブスクリプション状態を確認
async function getUserSubscription(ctx: any, userId: Id<"users">) {
  const subscription = await ctx.db
    .query("subscriptions")
    .withIndex("by_user_status", (q: any) =>
      q.eq("userId", userId).eq("status", "active")
    )
    .first();

  return subscription;
}

// テーマ別の分析テンプレート
interface AnalysisTemplate {
  title: string;
  summaryTemplates: string[];
  insightTemplates: string[];
  strengthTemplates: string[];
  challengeTemplates: string[];
  recommendationTemplates: string[];
}

const THEME_TEMPLATES: Record<string, AnalysisTemplate> = {
  love: {
    title: "あなたの恋愛傾向分析",
    summaryTemplates: [
      "あなたは愛情深く、パートナーとの深い絆を大切にするタイプです。",
      "直感と感情のバランスが取れた恋愛スタイルを持っています。",
      "コミュニケーションを大切にし、相手の気持ちを理解しようとする姿勢があります。",
    ],
    insightTemplates: [
      "恋愛において、相手の感情を敏感に察知する能力があります。",
      "長期的な関係性を築くことに向いています。",
      "信頼関係を最も重要視する傾向があります。",
      "パートナーの成長をサポートすることに喜びを感じます。",
      "感情表現において、言葉よりも行動で示すことを好みます。",
    ],
    strengthTemplates: [
      "相手の気持ちを理解する共感力",
      "安定した関係を築く忍耐力",
      "愛情を惜しみなく与えられる",
      "相手を尊重するコミュニケーション力",
    ],
    challengeTemplates: [
      "自分の気持ちを素直に表現すること",
      "相手に期待しすぎてしまうこと",
      "自分の時間を確保するバランス",
      "意見の相違を建設的に解決すること",
    ],
    recommendationTemplates: [
      "定期的にパートナーと感謝の気持ちを共有しましょう",
      "自分自身の時間も大切にし、健全な関係を維持しましょう",
      "相手の言葉だけでなく、行動にも注目してみましょう",
      "小さな変化を楽しむ心の余裕を持ちましょう",
    ],
  },
  career: {
    title: "あなたのキャリア分析",
    summaryTemplates: [
      "あなたは目標達成に向けて着実に歩みを進めるタイプです。",
      "創造性と論理性のバランスが取れた仕事スタイルを持っています。",
      "チームワークと個人の力の両方を活かせる能力があります。",
    ],
    insightTemplates: [
      "問題解決において、複数の視点から考えることができます。",
      "長期的なキャリアビジョンを描く力があります。",
      "新しいスキルを習得する意欲が高いです。",
      "チーム内での調整役として力を発揮できます。",
      "困難な状況でも冷静に判断できる強さがあります。",
    ],
    strengthTemplates: [
      "計画を立てて実行する力",
      "コミュニケーション能力",
      "問題解決への積極的な姿勢",
      "継続的な学習意欲",
    ],
    challengeTemplates: [
      "完璧を求めすぎず、適切なタイミングで完了すること",
      "優先順位を明確にして集中すること",
      "ワークライフバランスを維持すること",
      "フィードバックを素直に受け入れること",
    ],
    recommendationTemplates: [
      "自分の強みを活かせる役割を積極的に探しましょう",
      "定期的にキャリアの方向性を見直しましょう",
      "ネットワークを広げ、様々な視点を取り入れましょう",
      "失敗を恐れず、新しい挑戦に踏み出しましょう",
    ],
  },
  general: {
    title: "あなたの総合分析",
    summaryTemplates: [
      "あなたは多面的な魅力を持ち、様々な状況に適応できる人です。",
      "バランスの取れた視点で物事を捉えることができます。",
      "自己成長への意欲が高く、常に向上を目指しています。",
    ],
    insightTemplates: [
      "内面の強さと外面の柔軟性を兼ね備えています。",
      "直感と論理の両方を活用して判断することができます。",
      "人間関係において、深さと広さの両方を大切にしています。",
      "変化を恐れず、新しい経験を受け入れる姿勢があります。",
      "自分らしさを保ちながら、周囲との調和を図れます。",
    ],
    strengthTemplates: [
      "適応力と柔軟性",
      "自己認識の深さ",
      "バランス感覚",
      "成長への意欲",
    ],
    challengeTemplates: [
      "多くの選択肢の中から決断すること",
      "全ての面でバランスを取ろうとしすぎること",
      "自分の限界を認めること",
      "優先順位を明確にすること",
    ],
    recommendationTemplates: [
      "自分の価値観に基づいた選択を心がけましょう",
      "小さな成功を積み重ね、自信を育てましょう",
      "他者との違いを個性として受け入れましょう",
      "定期的に振り返りの時間を設けましょう",
    ],
  },
};

// テンプレートからランダムに選択
function selectFromTemplates(templates: string[], count: number): string[] {
  const shuffled = [...templates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 診断結果に基づいて分析をカスタマイズ（テンプレートベースのフォールバック）
function generateAnalysis(
  theme: string,
  selectedResults: Array<{
    resultId: Id<"testResults">;
    testSlug: string;
    resultType: string;
    testTitle?: string;
    scores?: any;
    analysis?: any;
  }>
): {
  title: string;
  summary: string;
  insights: string[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
} {
  const template = THEME_TEMPLATES[theme] || THEME_TEMPLATES.general;

  // 診断結果の数に基づいてインサイトの数を調整
  const insightCount = Math.min(selectedResults.length + 2, 5);

  return {
    title: template.title,
    summary: selectFromTemplates(template.summaryTemplates, 1)[0],
    insights: selectFromTemplates(template.insightTemplates, insightCount),
    strengths: selectFromTemplates(template.strengthTemplates, 3),
    challenges: selectFromTemplates(template.challengeTemplates, 3),
    recommendations: selectFromTemplates(template.recommendationTemplates, 3),
  };
}

// 新規分析を作成（AI API統合版）
export const create = mutation({
  args: {
    selectedResultIds: v.array(v.id("testResults")),
    theme: v.string(),
    useAI: v.optional(v.boolean()), // AIを使用するか（デフォルト: 自動判定）
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    // 選択された結果が最低1つ以上あることを確認
    if (args.selectedResultIds.length === 0) {
      throw new Error("分析する診断結果を選択してください");
    }

    // テーマが有効かチェック
    if (!["love", "career", "general"].includes(args.theme)) {
      throw new Error("無効なテーマです");
    }

    // 選択された結果を取得
    const selectedResultsWithDetails: Array<{
      resultId: Id<"testResults">;
      testSlug: string;
      resultType: string;
      testTitle?: string;
      scores?: any;
      analysis?: any;
    }> = [];

    for (const resultId of args.selectedResultIds) {
      const result = await ctx.db.get(resultId);
      if (!result || result.userId !== user._id) {
        throw new Error("無効な診断結果が含まれています");
      }

      const test = await ctx.db.get(result.testId);
      if (!test) {
        throw new Error("テスト情報が見つかりません");
      }

      selectedResultsWithDetails.push({
        resultId,
        testSlug: test.slug,
        resultType: result.resultType,
        testTitle: test.title,
        scores: result.scores,
        analysis: result.analysis,
      });
    }

    // サブスクリプション状態を確認
    const subscription = await getUserSubscription(ctx, user._id);
    const hasPremium = subscription && subscription.planId !== "free";

    // AI使用の判定
    // - 明示的にuseAI=trueが指定された場合
    // - useAIが未指定で、プレミアムユーザーの場合
    const shouldUseAI = args.useAI ?? hasPremium;

    let analysis;
    if (shouldUseAI) {
      // AI APIを使用して分析を生成（resultIdを除外）
      const aiInput: AnalysisInput = {
        theme: args.theme,
        selectedResults: selectedResultsWithDetails.map((r) => ({
          resultType: r.resultType,
          testSlug: r.testSlug,
          testTitle: r.testTitle,
          scores: r.scores,
          analysis: r.analysis,
        })),
      };

      try {
        analysis = await generateAIAnalysis(aiInput, true);
      } catch (error) {
        console.error("AI分析生成エラー:", error);
        // エラー時はテンプレートにフォールバック
        analysis = generateAnalysis(args.theme, selectedResultsWithDetails);
      }
    } else {
      // テンプレートベースの分析（フォールバック）
      analysis = generateAnalysis(args.theme, selectedResultsWithDetails);
    }

    // 保存用のデータを整形（resultIdのみを保存）
    const selectedResultsForStorage = selectedResultsWithDetails.map((r) => ({
      resultId: r.resultId,
      testSlug: r.testSlug,
      resultType: r.resultType,
    }));

    // 保存
    const analysisId = await ctx.db.insert("integratedAnalyses", {
      userId: user._id,
      selectedResults: selectedResultsForStorage,
      theme: args.theme,
      analysis,
      createdAt: Date.now(),
    });

    return { analysisId, analysis };
  },
});

// ユーザーの分析履歴を取得
export const listByUser = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return [];

    const analyses = await ctx.db
      .query("integratedAnalyses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // 新しい順にソート
    const sortedAnalyses = analyses.sort((a, b) => b.createdAt - a.createdAt);

    // limitが指定されていれば適用
    const limitedAnalyses = args.limit
      ? sortedAnalyses.slice(0, args.limit)
      : sortedAnalyses;

    return limitedAnalyses;
  },
});

// 特定の分析を取得
export const getById = query({
  args: {
    analysisId: v.id("integratedAnalyses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis || analysis.userId !== user._id) return null;

    // 選択された診断結果の詳細も取得
    const resultsWithDetails = await Promise.all(
      analysis.selectedResults.map(async (selected) => {
        const result = await ctx.db.get(selected.resultId);
        const test = result ? await ctx.db.get(result.testId) : null;
        return {
          ...selected,
          testTitle: test?.title || "不明なテスト",
          testIcon: test?.icon,
          testGradientStart: test?.gradientStart,
          testGradientEnd: test?.gradientEnd,
        };
      })
    );

    return {
      ...analysis,
      selectedResults: resultsWithDetails,
    };
  },
});

// 分析を削除
export const remove = mutation({
  args: {
    analysisId: v.id("integratedAnalyses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    const analysis = await ctx.db.get(args.analysisId);
    if (!analysis || analysis.userId !== user._id) {
      throw new Error("この分析を削除する権限がありません");
    }

    await ctx.db.delete(args.analysisId);

    return { success: true };
  },
});

// AI分析が利用可能かチェック
export const isAIAvailable = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { available: false, reason: "not_authenticated" };

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return { available: false, reason: "user_not_found" };

    // 環境変数チェック
    const hasApiKey = !!process.env.OPENROUTER_API_KEY;

    if (!hasApiKey) {
      return { available: false, reason: "no_api_key" };
    }

    // サブスクリプションチェック（AIはプレミアム機能）
    const subscription = await getUserSubscription(ctx, user._id);
    const hasPremium = subscription && subscription.planId !== "free";

    return {
      available: hasPremium,
      reason: hasPremium ? "available" : "premium_required",
      provider: "anthropic",
    };
  },
});

// テーマ別の分析履歴を取得
export const listByTheme = query({
  args: {
    theme: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return [];

    const analyses = await ctx.db
      .query("integratedAnalyses")
      .withIndex("by_user_theme", (q) =>
        q.eq("userId", user._id).eq("theme", args.theme)
      )
      .collect();

    // 新しい順にソート
    const sortedAnalyses = analyses.sort((a, b) => b.createdAt - a.createdAt);

    // limitが指定されていれば適用
    return args.limit ? sortedAnalyses.slice(0, args.limit) : sortedAnalyses;
  },
});
