"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { generateAnalysis as generateFallbackAI, type AnalysisInput } from "./ai";
import { generateDeepCompatibilityAnalysis, type DeepCompatibilityInput, type DeepCompatibilityOutput } from "./ai";

// ============================================================
// Tier & Rate Limit Configuration
// ============================================================

function getTierFromPlanId(planId: string | undefined): string {
  if (!planId) return "free";
  if (planId.startsWith("premium_")) return "premium";
  return "free";
}

const DAILY_LIMITS: Record<string, number> = {
  free: 0,
  premium: 30,
};

// ============================================================
// Public actions
// ============================================================

export const runIntegratedAnalysis = action({
  args: {
    selectedResultIds: v.array(v.id("testResults")),
    theme: v.string(),
    useAI: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<{ analysisId: string; analysis: any }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user: any = await ctx.runQuery(internal.aiHelpers.getUserByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (!user) throw new Error("ユーザーが見つかりません");

    if (args.selectedResultIds.length === 0) {
      throw new Error("分析する診断結果を選択してください");
    }
    if (!["love", "career", "general"].includes(args.theme)) {
      throw new Error("無効なテーマです");
    }

    // サブスクリプション確認 & tier 判定
    const subscription: any = await ctx.runQuery(internal.aiHelpers.getActiveSubscription, {
      userId: user._id,
    });
    const tier = getTierFromPlanId(subscription?.planId);

    const shouldUseAI = args.useAI ?? (tier !== "free");

    if (shouldUseAI && tier === "free") {
      throw new Error("AI分析にはPremiumプランが必要です。プランをアップグレードしてください。");
    }

    // テスト結果を取得
    const results: any[] = await ctx.runQuery(internal.aiHelpers.getResultsForAnalysis, {
      resultIds: args.selectedResultIds,
      userId: user._id,
    });

    // AI使用時のみレート制限・重複チェック
    if (shouldUseAI) {
      const duplicate: any = await ctx.runQuery(internal.aiHelpers.findRecentDuplicate, {
        userId: user._id,
        theme: args.theme,
        selectedResultIds: args.selectedResultIds,
      });
      if (duplicate) {
        return { analysisId: duplicate._id, analysis: duplicate.analysis };
      }

      const dailyCount: number = await ctx.runQuery(internal.aiHelpers.getDailyAnalysisCount, {
        userId: user._id,
      });
      const dailyLimit = DAILY_LIMITS[tier] ?? 0;
      if (dailyCount >= dailyLimit) {
        throw new Error(`本日のAI分析上限（${dailyLimit}回/日）に達しました。明日再度お試しください。`);
      }
    }

    let analysis;
    if (shouldUseAI) {
      try {
        analysis = await callAgentService("/api/v1/analysis/integrated", {
          theme: args.theme,
          tier,
          selectedResults: results.map((r: any) => ({
            resultType: r.resultType,
            testSlug: r.testSlug,
            testTitle: r.testTitle,
            scores: r.scores,
            analysis: r.analysis,
            dimensions: r.aiData?.dimensions,
            percentiles: r.aiData?.percentiles,
          })),
        });
      } catch (error) {
        console.error("Agent Service error, falling back to direct AI:", error);
        try {
          const aiInput: AnalysisInput = {
            theme: args.theme,
            selectedResults: results.map((r: any) => ({
              resultType: r.resultType,
              testSlug: r.testSlug,
              testTitle: r.testTitle,
              scores: r.scores,
              analysis: r.analysis,
            })),
          };
          analysis = await generateFallbackAI(aiInput, true);
        } catch (fallbackError) {
          console.error("Fallback AI also failed:", fallbackError);
          analysis = generateTemplateAnalysis(args.theme);
        }
      }
    } else {
      analysis = generateTemplateAnalysis(args.theme);
    }

    const analysisId: string = await ctx.runMutation(internal.aiHelpers.saveIntegratedAnalysis, {
      userId: user._id,
      selectedResults: results.map((r: any) => ({
        resultId: r.resultId,
        testSlug: r.testSlug,
        resultType: r.resultType,
      })),
      theme: args.theme,
      analysis,
    });

    return { analysisId, analysis };
  },
});

export const runDeepCompatibility = action({
  args: {
    friendId: v.id("users"),
    analysisId: v.id("friendAnalyses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user: any = await ctx.runQuery(internal.aiHelpers.getUserByToken, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (!user) throw new Error("ユーザーが見つかりません");

    const subscription: any = await ctx.runQuery(internal.aiHelpers.getActiveSubscription, {
      userId: user._id,
    });
    const tier = getTierFromPlanId(subscription?.planId);
    if (tier === "free") {
      throw new Error("この機能にはPremiumプランが必要です");
    }

    const input: any = await ctx.runQuery(internal.aiHelpers.getDeepAnalysisInput, {
      currentUserId: user._id,
      friendId: args.friendId,
      analysisId: args.analysisId,
    });
    if (!input) throw new Error("分析データの取得に失敗しました（既に深掘り分析済みの可能性があります）");

    let deepResult;
    try {
      deepResult = await callAgentService("/api/v1/compatibility/deep", {
        ...input,
        tier,
      });
    } catch (error) {
      console.error("Agent Service error, falling back to direct AI:", error);
      deepResult = await generateDeepCompatibilityAnalysis(input as DeepCompatibilityInput);
    }

    await ctx.runMutation(internal.aiHelpers.saveDeepAnalysis, {
      analysisId: args.analysisId,
      deepAnalysis: {
        ...deepResult,
        generatedAt: Date.now(),
      },
    });

    return { success: true, deepAnalysis: deepResult };
  },
});

// ============================================================
// Helper functions
// ============================================================

async function callAgentService(path: string, body: any): Promise<any> {
  const serviceUrl = process.env.AGENT_SERVICE_URL;
  const serviceToken = process.env.AGENT_SERVICE_TOKEN;

  if (!serviceUrl || !serviceToken) {
    throw new Error("AGENT_SERVICE_URL or AGENT_SERVICE_TOKEN not configured");
  }

  const response = await fetch(`${serviceUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Agent Service error ${response.status}: ${errorText}`);
  }

  return await response.json();
}

function generateTemplateAnalysis(theme: string) {
  const templates: Record<string, any> = {
    love: {
      title: "あなたの恋愛傾向分析",
      summary: "あなたは愛情深く、パートナーとの深い絆を大切にするタイプです。",
      insights: [
        "恋愛において、相手の感情を敏感に察知する能力があります。",
        "長期的な関係性を築くことに向いています。",
        "信頼関係を最も重要視する傾向があります。",
      ],
      strengths: ["相手の気持ちを理解する共感力", "安定した関係を築く忍耐力", "愛情を惜しみなく与えられる"],
      challenges: ["自分の気持ちを素直に表現すること", "相手に期待しすぎてしまうこと", "自分の時間を確保するバランス"],
      recommendations: ["定期的にパートナーと感謝の気持ちを共有しましょう", "自分自身の時間も大切にし、健全な関係を維持しましょう", "相手の言葉だけでなく、行動にも注目してみましょう"],
    },
    career: {
      title: "あなたのキャリア分析",
      summary: "あなたは目標達成に向けて着実に歩みを進めるタイプです。",
      insights: [
        "問題解決において、複数の視点から考えることができます。",
        "長期的なキャリアビジョンを描く力があります。",
        "新しいスキルを習得する意欲が高いです。",
      ],
      strengths: ["計画を立てて実行する力", "コミュニケーション能力", "問題解決への積極的な姿勢"],
      challenges: ["完璧を求めすぎず、適切なタイミングで完了すること", "優先順位を明確にして集中すること", "ワークライフバランスを維持すること"],
      recommendations: ["自分の強みを活かせる役割を積極的に探しましょう", "定期的にキャリアの方向性を見直しましょう", "ネットワークを広げ、様々な視点を取り入れましょう"],
    },
    general: {
      title: "あなたの総合分析",
      summary: "あなたは多面的な魅力を持ち、様々な状況に適応できる人です。",
      insights: [
        "内面の強さと外面の柔軟性を兼ね備えています。",
        "直感と論理の両方を活用して判断することができます。",
        "人間関係において、深さと広さの両方を大切にしています。",
      ],
      strengths: ["適応力と柔軟性", "自己認識の深さ", "バランス感覚"],
      challenges: ["多くの選択肢の中から決断すること", "全ての面でバランスを取ろうとしすぎること", "自分の限界を認めること"],
      recommendations: ["自分の価値観に基づいた選択を心がけましょう", "小さな成功を積み重ね、自信を育てましょう", "他者との違いを個性として受け入れましょう"],
    },
  };
  return templates[theme] || templates.general;
}
