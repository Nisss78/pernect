import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  calculateScores,
  generateAiData,
  type ScoringType,
  type QuestionData,
  type AnswerData,
  type ScoringConfig,
} from "./scoring";

// ユーザーをトークンから取得するヘルパー
async function getUserByToken(ctx: any, tokenIdentifier: string) {
  return await ctx.db
    .query("users")
    .withIndex("by_token", (q: any) => q.eq("tokenIdentifier", tokenIdentifier))
    .unique();
}

// MBTI分析データ
const MBTI_ANALYSIS: Record<
  string,
  {
    summary: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }
> = {
  ENFP: {
    summary: "情熱的なキャンペーナー",
    description:
      "ENFPは創造的で熱意に溢れた性格タイプです。新しいアイデアを探求し、人々とつながることを楽しみます。想像力豊かで、可能性を見出す力に優れています。",
    strengths: [
      "創造性が高い",
      "コミュニケーション能力が高い",
      "適応力がある",
      "エネルギッシュ",
    ],
    weaknesses: [
      "細部を見落としがち",
      "計画性に欠けることがある",
      "感情的になりやすい",
    ],
    recommendations: [
      "ルーティンを作って集中力を維持しましょう",
      "大きなプロジェクトは小さなタスクに分けましょう",
      "定期的に一人の時間を取りましょう",
    ],
  },
  INTJ: {
    summary: "戦略的な設計者",
    description:
      "INTJは分析的で戦略的な思考を持つ性格タイプです。長期的なビジョンを持ち、効率的に目標を達成します。独立心が強く、高い基準を持っています。",
    strengths: ["戦略的思考", "独立心が強い", "高い基準を持つ", "論理的"],
    weaknesses: ["感情表現が苦手", "完璧主義", "他者に厳しい"],
    recommendations: [
      "チームワークの価値を認識しましょう",
      "感情面でのフィードバックも大切にしましょう",
      '時には「十分良い」で満足することも大切です',
    ],
  },
  INFP: {
    summary: "理想主義的な仲介者",
    description:
      "INFPは理想主義的で創造的な性格タイプです。深い価値観を持ち、意味のある人生を追求します。共感力が高く、他者の感情を理解することに長けています。",
    strengths: ["共感力が高い", "創造的", "誠実", "理想を追求する"],
    weaknesses: [
      "現実離れしがち",
      "批判に敏感",
      "決断が遅いことがある",
    ],
    recommendations: [
      "理想と現実のバランスを意識しましょう",
      "建設的な批判を成長の機会と捉えましょう",
      "小さな目標を設定して達成感を味わいましょう",
    ],
  },
  ENTJ: {
    summary: "大胆な指揮官",
    description:
      "ENTJは自信に満ちたリーダータイプです。効率を重視し、目標達成に向けて周囲を導きます。決断力があり、困難な状況でも冷静に対処できます。",
    strengths: ["リーダーシップ", "効率重視", "決断力がある", "自信がある"],
    weaknesses: ["支配的になりがち", "感情を軽視", "せっかち"],
    recommendations: [
      "他者の意見に耳を傾けましょう",
      "感情面でのサポートも忘れずに",
      "プロセスを楽しむことも大切です",
    ],
  },
  INFJ: {
    summary: "洞察力のある提唱者",
    description:
      "INFJは深い洞察力を持つ理想主義者です。他者を助け、世界をより良くすることに情熱を持っています。静かな決意と強い価値観を持っています。",
    strengths: ["洞察力がある", "理想主義", "思いやりがある", "決意が固い"],
    weaknesses: [
      "完璧主義になりがち",
      "批判に敏感",
      "消耗しやすい",
    ],
    recommendations: [
      "自分自身のケアも忘れずに",
      "すべての人を救おうとしないこと",
      "境界線を設定することを学びましょう",
    ],
  },
  ENTP: {
    summary: "革新的な討論者",
    description:
      "ENTPは知的好奇心が強く、議論を楽しむ性格タイプです。既存の概念に挑戦し、新しいアイデアを生み出すことに長けています。",
    strengths: [
      "知的好奇心が強い",
      "機知に富む",
      "適応力がある",
      "革新的",
    ],
    weaknesses: [
      "議論好きすぎる",
      "飽きっぽい",
      "ルールを軽視しがち",
    ],
    recommendations: [
      "プロジェクトを最後まで完遂する習慣をつけましょう",
      "他者の感情にも配慮しましょう",
      "時には既存のルールの価値も認めましょう",
    ],
  },
  ISFJ: {
    summary: "献身的な守護者",
    description:
      "ISFJは思いやりがあり、責任感の強い性格タイプです。周囲の人々をサポートし、調和のとれた環境を作ることに長けています。",
    strengths: ["思いやりがある", "責任感が強い", "信頼できる", "観察力がある"],
    weaknesses: [
      "変化を嫌う",
      "自己主張が苦手",
      "過度に自己犠牲的",
    ],
    recommendations: [
      "自分のニーズも大切にしましょう",
      "変化を成長の機会と捉えましょう",
      "時には「ノー」と言うことも必要です",
    ],
  },
  ESFJ: {
    summary: "社交的な支援者",
    description:
      "ESFJは温かく社交的な性格タイプです。他者の幸福を気にかけ、コミュニティの調和を大切にします。実用的で組織力があります。",
    strengths: ["社交的", "思いやりがある", "組織力がある", "忠実"],
    weaknesses: [
      "承認欲求が強い",
      "批判に敏感",
      "変化への抵抗",
    ],
    recommendations: [
      "自分の価値を他者の評価に依存しないこと",
      "新しい視点を受け入れる柔軟性を持ちましょう",
      "自分の意見を持つことを恐れないで",
    ],
  },
  ISTP: {
    summary: "冷静な職人",
    description:
      "ISTPは論理的で実践的な問題解決者です。手を動かして物事を理解し、危機的状況でも冷静に対処できます。",
    strengths: ["論理的", "実践的", "適応力がある", "冷静"],
    weaknesses: [
      "感情表現が苦手",
      "長期的なコミットメントを避けがち",
      "リスクを取りすぎる",
    ],
    recommendations: [
      "感情を言葉にする練習をしましょう",
      "長期的な関係の価値を認識しましょう",
      "リスク管理も計画に含めましょう",
    ],
  },
  ESTP: {
    summary: "エネルギッシュな起業家",
    description:
      "ESTPは行動力があり、今この瞬間を楽しむ性格タイプです。実践的な問題解決に優れ、社交的で周囲を巻き込む力があります。",
    strengths: ["行動力がある", "社交的", "実践的", "観察力がある"],
    weaknesses: [
      "長期計画が苦手",
      "ルールを無視しがち",
      "飽きっぽい",
    ],
    recommendations: [
      "長期的な目標も設定しましょう",
      "時には立ち止まって考えることも大切です",
      "結果だけでなくプロセスも大切に",
    ],
  },
  ISFP: {
    summary: "穏やかな冒険家",
    description:
      "ISFPは芸術的で感受性豊かな性格タイプです。美しいものを愛し、自分らしく生きることを大切にします。柔軟で優しい心を持っています。",
    strengths: ["芸術的", "感受性豊か", "柔軟", "思いやりがある"],
    weaknesses: [
      "自己表現が苦手",
      "批判に敏感",
      "長期計画が苦手",
    ],
    recommendations: [
      "自分の作品や考えを共有する勇気を持ちましょう",
      "建設的な批判を成長の糧にしましょう",
      "将来のビジョンも描いてみましょう",
    ],
  },
  ESFP: {
    summary: "楽観的なエンターテイナー",
    description:
      "ESFPは陽気で社交的な性格タイプです。今この瞬間を楽しみ、周囲を明るくする力を持っています。実践的で人々とつながることが得意です。",
    strengths: ["社交的", "楽観的", "実践的", "観察力がある"],
    weaknesses: [
      "長期計画が苦手",
      "批判に敏感",
      "衝動的",
    ],
    recommendations: [
      "将来の計画も立てましょう",
      "批判を個人攻撃と捉えないようにしましょう",
      "行動する前に一呼吸置く習慣をつけましょう",
    ],
  },
  ISTJ: {
    summary: "責任感のある管理者",
    description:
      "ISTJは信頼性が高く、責任感の強い性格タイプです。伝統を尊重し、義務を果たすことに誇りを持っています。実践的で効率的です。",
    strengths: ["責任感が強い", "信頼できる", "実践的", "組織力がある"],
    weaknesses: [
      "柔軟性に欠ける",
      "感情表現が苦手",
      "変化への抵抗",
    ],
    recommendations: [
      "新しいアプローチにも挑戦してみましょう",
      "感情を共有することの価値を認識しましょう",
      "変化も成長の機会と捉えましょう",
    ],
  },
  ESTJ: {
    summary: "効率的な幹部",
    description:
      "ESTJは組織力があり、効率を重視する性格タイプです。明確なルールと構造を好み、リーダーシップを発揮して目標を達成します。",
    strengths: ["組織力がある", "効率的", "責任感が強い", "リーダーシップ"],
    weaknesses: [
      "柔軟性に欠ける",
      "感情を軽視しがち",
      "支配的になりがち",
    ],
    recommendations: [
      "他者のやり方も尊重しましょう",
      "感情面でのサポートも大切です",
      "柔軟性を持つことで新しい可能性が開けます",
    ],
  },
  INTP: {
    summary: "論理的な思想家",
    description:
      "INTPは知的好奇心が強く、理論的な思考を好む性格タイプです。複雑な問題を分析し、独創的な解決策を見出すことに長けています。",
    strengths: ["論理的", "独創的", "知的好奇心が強い", "客観的"],
    weaknesses: [
      "感情表現が苦手",
      "社交が苦手",
      "優柔不断になりがち",
    ],
    recommendations: [
      "感情の言語化を練習しましょう",
      "時には人との交流も楽しんでみましょう",
      "完璧でなくても決断を下す練習をしましょう",
    ],
  },
  ENFJ: {
    summary: "カリスマ的な主人公",
    description:
      "ENFJは温かく影響力のあるリーダータイプです。他者の成長を支援し、インスピレーションを与えることに情熱を持っています。",
    strengths: ["カリスマ性がある", "共感力が高い", "リーダーシップ", "利他的"],
    weaknesses: [
      "自己犠牲的になりがち",
      "批判に敏感",
      "他者に依存しすぎる",
    ],
    recommendations: [
      "自分自身のケアも忘れずに",
      "すべての人を満足させる必要はありません",
      "建設的な批判を受け入れる練習をしましょう",
    ],
  },
};

// スコア算出ロジック（MBTI形式 - 次元別）
function calculateDimensionScores(
  questions: any[],
  answers: { questionOrder: number; selectedValue: string }[]
): { resultType: string; scores: Record<string, number> } {
  const scores: Record<string, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const option = question.options.find(
      (o: any) => o.value === answer.selectedValue
    );
    if (!option || !option.scoreValue) continue;

    // scoreValueは "E", "I", "S", "N" などの文字
    const value = option.scoreValue as string;
    if (scores[value] !== undefined) {
      scores[value] += 1;
    }
  }

  // MBTIタイプを決定
  const resultType = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");

  return { resultType, scores };
}

// スコア算出ロジック（単一タイプ - 最高スコア）
function calculateSingleScores(
  questions: any[],
  answers: { questionOrder: number; selectedValue: string }[]
): { resultType: string; scores: Record<string, number> } {
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const option = question.options.find(
      (o: any) => o.value === answer.selectedValue
    );
    if (!option || !option.scoreKey) continue;

    const key = option.scoreKey;
    const value = typeof option.scoreValue === "number" ? option.scoreValue : 1;

    scores[key] = (scores[key] || 0) + value;
  }

  // 最高スコアのタイプを決定
  let maxType = "";
  let maxScore = -1;
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxType = type;
    }
  }

  return { resultType: maxType, scores };
}

// 結果を算出・保存
export const calculate = mutation({
  args: {
    testId: v.id("tests"),
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

    // テストを取得
    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error("テストが見つかりません");
    }

    // 質問を取得
    const questions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .collect();

    // 回答を取得
    const progress = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();

    if (!progress) {
      throw new Error("回答が見つかりません");
    }

    // スコアリング設定を取得
    const scoringConfig: ScoringConfig | undefined = test.scoringConfig as ScoringConfig | undefined;

    // 新しい統一スコアリングエンジンでスコア計算
    const scoringType = (test.scoringType || "single") as ScoringType;
    const result = calculateScores(
      scoringType,
      questions as QuestionData[],
      progress.answers as AnswerData[],
      scoringConfig
    );

    const { resultType, scores, percentiles, dimensions } = result;

    // 分析データを取得
    // 1. まずtestのresultTypesから取得を試みる
    // 2. 次に既存のMBTI_ANALYSISからフォールバック
    let analysis: {
      summary: string;
      description: string;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
    } | null = null;

    if (test.resultTypes && typeof test.resultTypes === "object") {
      const resultTypesMap = test.resultTypes as Record<string, {
        summary?: string;
        description?: string;
        strengths?: string[];
        weaknesses?: string[];
        recommendations?: string[];
      }>;
      const typeData = resultTypesMap[resultType];
      if (typeData) {
        analysis = {
          summary: typeData.summary || resultType,
          description: typeData.description || "",
          strengths: typeData.strengths || [],
          weaknesses: typeData.weaknesses || [],
          recommendations: typeData.recommendations || [],
        };
      }
    }

    // フォールバック: 既存のMBTI_ANALYSIS
    if (!analysis && MBTI_ANALYSIS[resultType]) {
      analysis = MBTI_ANALYSIS[resultType];
    }

    // AI分析用データを生成
    const aiData = generateAiData(test.slug, result);

    // 結果を保存
    const resultId = await ctx.db.insert("testResults", {
      userId: user._id,
      testId: args.testId,
      resultType,
      scores,
      analysis: analysis || undefined,
      completedAt: Date.now(),
      aiData,
    });

    // ユーザーのプロフィールに反映
    if (test.resultField) {
      const updateData: Record<string, any> = {
        updatedAt: Date.now(),
      };
      updateData[test.resultField] = resultType;
      await ctx.db.patch(user._id, updateData);
    }

    // 進行中データを削除
    await ctx.db.delete(progress._id);

    return { resultId, resultType, scores, percentiles, dimensions, analysis };
  },
});

// ユーザーの結果履歴取得
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return [];

    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // 新しい順にソート
    const sortedResults = results.sort((a, b) => b.completedAt - a.completedAt);

    // テスト情報も含めて返す
    return Promise.all(
      sortedResults.map(async (result) => {
        const test = await ctx.db.get(result.testId);
        return { ...result, test };
      })
    );
  },
});

// 特定テストの最新結果取得
export const getLatest = query({
  args: {
    testSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.testSlug))
      .unique();

    if (!test) return null;

    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", test._id)
      )
      .collect();

    if (results.length === 0) return null;

    // 最新を返す
    return results.sort((a, b) => b.completedAt - a.completedAt)[0];
  },
});

// 結果詳細取得（出典情報を含む）
export const getById = query({
  args: {
    resultId: v.id("testResults"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    const result = await ctx.db.get(args.resultId);
    if (!result || result.userId !== user._id) return null;

    const test = await ctx.db.get(result.testId);
    return { ...result, test };
  },
});

// 診断別結果履歴取得（比較用）
export const getByTestAndUser = query({
  args: {
    testSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { results: [], scoreDiffs: null };

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return { results: [], scoreDiffs: null };

    // テストを取得
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.testSlug))
      .unique();

    if (!test) return { results: [], scoreDiffs: null };

    // 結果を取得
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", test._id)
      )
      .collect();

    if (results.length === 0) return { results: [], scoreDiffs: null };

    // 時系列ソート（古い順）
    const sortedResults = results.sort((a, b) => a.completedAt - b.completedAt);

    // スコア差分計算（最新と最古の比較）
    let scoreDiffs: Record<string, number> | null = null;
    if (sortedResults.length >= 2) {
      const oldest = sortedResults[0];
      const newest = sortedResults[sortedResults.length - 1];

      scoreDiffs = {};
      const oldScores = oldest.scores as Record<string, number>;
      const newScores = newest.scores as Record<string, number>;

      for (const key of Object.keys(newScores)) {
        const oldValue = oldScores[key] || 0;
        const newValue = newScores[key] || 0;
        scoreDiffs[key] = newValue - oldValue;
      }
    }

    // テスト情報を含めて返す
    const resultsWithTest = sortedResults.map((result) => ({
      ...result,
      test,
    }));

    return {
      results: resultsWithTest,
      scoreDiffs,
      test,
    };
  },
});

// AI分析用統合プロファイル取得
export const getIntegratedProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    // 全結果を取得
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    if (results.length === 0) return null;

    // 各テストの最新結果のみを抽出
    const latestByTest: Map<string, typeof results[0]> = new Map();
    for (const result of results) {
      const existing = latestByTest.get(result.testId.toString());
      if (!existing || result.completedAt > existing.completedAt) {
        latestByTest.set(result.testId.toString(), result);
      }
    }

    // AI分析用データを収集
    const aiProfiles: Array<{
      testSlug: string;
      resultType: string;
      scores: Record<string, number>;
      dimensions?: string[];
      percentiles?: Record<string, number>;
      completedAt: string;
    }> = [];

    for (const result of latestByTest.values()) {
      if (result.aiData) {
        aiProfiles.push(result.aiData as {
          testSlug: string;
          resultType: string;
          scores: Record<string, number>;
          dimensions?: string[];
          percentiles?: Record<string, number>;
          completedAt: string;
        });
      } else {
        // aiDataがない古いデータの場合はresultTypeとscoresから生成
        const test = await ctx.db.get(result.testId);
        if (test) {
          aiProfiles.push({
            testSlug: test.slug,
            resultType: result.resultType,
            scores: result.scores as Record<string, number>,
            completedAt: new Date(result.completedAt).toISOString(),
          });
        }
      }
    }

    // 統合サマリーを生成
    const summary = {
      userId: user._id,
      totalTests: aiProfiles.length,
      profiles: aiProfiles,
      generatedAt: new Date().toISOString(),
    };

    return summary;
  },
});

// シェア設定の更新
export const updateShareSettings = mutation({
  args: {
    resultId: v.id("testResults"),
    isPublic: v.boolean(),
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

    const result = await ctx.db.get(args.resultId);
    if (!result || result.userId !== user._id) {
      throw new Error("この結果を更新する権限がありません");
    }

    // shareSettingsを更新
    const currentSettings = (result.shareSettings || {}) as {
      isPublic?: boolean;
      shareId?: string;
    };
    await ctx.db.patch(args.resultId, {
      shareSettings: {
        ...currentSettings,
        isPublic: args.isPublic,
      },
    });

    // 非公開にする場合、関連するシェアリンクを無効化
    if (!args.isPublic && currentSettings.shareId) {
      const shareIdToDelete = currentSettings.shareId;
      const shareLink = await ctx.db
        .query("shareLinks")
        .withIndex("by_shareId", (q) => q.eq("shareId", shareIdToDelete))
        .first();

      if (shareLink) {
        await ctx.db.delete(shareLink._id);
      }
    }

    return { success: true };
  },
});

// 結果を削除（単一）
export const deleteResult = mutation({
  args: {
    resultId: v.id("testResults"),
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

    const result = await ctx.db.get(args.resultId);
    if (!result || result.userId !== user._id) {
      throw new Error("この結果を削除する権限がありません");
    }

    // 関連するシェアリンクも削除
    const shareLinks = await ctx.db
      .query("shareLinks")
      .withIndex("by_result", (q) => q.eq("resultId", args.resultId))
      .collect();

    for (const link of shareLinks) {
      await ctx.db.delete(link._id);
    }

    // 結果を削除
    await ctx.db.delete(args.resultId);

    return { success: true };
  },
});

// 全結果を削除
export const deleteAllResults = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("認証が必要です");
    }

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    // ユーザーの全結果を取得
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // 関連するシェアリンクを削除
    const shareLinks = await ctx.db
      .query("shareLinks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const link of shareLinks) {
      await ctx.db.delete(link._id);
    }

    // 全結果を削除
    for (const result of results) {
      await ctx.db.delete(result._id);
    }

    // ユーザーのプロフィールからテスト結果フィールドをクリア
    await ctx.db.patch(user._id, {
      mbti: undefined,
      updatedAt: Date.now(),
    });

    return { success: true, deletedCount: results.length };
  },
});

// データエクスポート（JSON形式）
export const exportData = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    // 全結果を取得
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // テスト情報を含めてエクスポート用データを構築
    const exportData = await Promise.all(
      results.map(async (result) => {
        const test = await ctx.db.get(result.testId);
        return {
          testTitle: test?.title || "不明なテスト",
          testSlug: test?.slug || "unknown",
          testCategory: test?.category || "unknown",
          resultType: result.resultType,
          scores: result.scores,
          analysis: result.analysis,
          completedAt: new Date(result.completedAt).toISOString(),
          // 出典情報
          citation: test?.citation || null,
        };
      })
    );

    // ソート（新しい順）
    exportData.sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return {
      user: {
        name: user.name,
        email: user.email,
        mbti: user.mbti,
      },
      results: exportData,
      exportedAt: new Date().toISOString(),
      totalResults: exportData.length,
    };
  },
});
