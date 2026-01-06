import { mutation } from "./_generated/server";

/**
 * BIG5診断（IPIP-50）の質問データをシードする
 *
 * 科学的根拠:
 * - Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual
 * - Goldberg, L. R. (1999). International Personality Item Pool
 *
 * 質問配置順序:
 * 因子が均等に混在するパターン（E1, A1, C1, N1, O1, E2, A2, ...）
 */

// 因子定義
type Factor = "O" | "C" | "E" | "A" | "N";

// 質問データ型
interface Big5QuestionData {
  id: string; // "E1", "A1", etc.
  factor: Factor;
  questionText: string;
  reverseScored: boolean;
}

// IPIP-50 質問データ（日本語）
const QUESTIONS: Big5QuestionData[] = [
  // 外向性 (Extraversion) - 10問
  { id: "E1", factor: "E", questionText: "パーティーの中心的存在だ", reverseScored: false },
  { id: "E2", factor: "E", questionText: "あまり話さない方だ", reverseScored: true },
  { id: "E3", factor: "E", questionText: "人と話すのが心地よい", reverseScored: false },
  { id: "E4", factor: "E", questionText: "目立たないようにしている", reverseScored: true },
  { id: "E5", factor: "E", questionText: "知らない人に話しかけることができる", reverseScored: false },
  { id: "E6", factor: "E", questionText: "人前で話すことが苦手だ", reverseScored: true },
  { id: "E7", factor: "E", questionText: "社交的な場で自分を表現できる", reverseScored: false },
  { id: "E8", factor: "E", questionText: "注目されるのが好きではない", reverseScored: true },
  { id: "E9", factor: "E", questionText: "初対面の人とも気軽に話せる", reverseScored: false },
  { id: "E10", factor: "E", questionText: "静かな性格だ", reverseScored: true },

  // 協調性 (Agreeableness) - 10問
  { id: "A1", factor: "A", questionText: "他人の気持ちに共感できる", reverseScored: false },
  { id: "A2", factor: "A", questionText: "他人の問題にあまり興味がない", reverseScored: true },
  { id: "A3", factor: "A", questionText: "困っている人を助けたい", reverseScored: false },
  { id: "A4", factor: "A", questionText: "他人を侮辱することがある", reverseScored: true },
  { id: "A5", factor: "A", questionText: "他人の幸せを気にかける", reverseScored: false },
  { id: "A6", factor: "A", questionText: "他人に冷たい態度をとることがある", reverseScored: true },
  { id: "A7", factor: "A", questionText: "優しい心を持っている", reverseScored: false },
  { id: "A8", factor: "A", questionText: "他人のために時間を割くことができる", reverseScored: false },
  { id: "A9", factor: "A", questionText: "他人の感情にあまり関心がない", reverseScored: true },
  { id: "A10", factor: "A", questionText: "人を和ませることができる", reverseScored: true },

  // 誠実性 (Conscientiousness) - 10問
  { id: "C1", factor: "C", questionText: "いつも準備をしている", reverseScored: false },
  { id: "C2", factor: "C", questionText: "物をよくなくす", reverseScored: true },
  { id: "C3", factor: "C", questionText: "細部に注意を払う", reverseScored: false },
  { id: "C4", factor: "C", questionText: "仕事をすぐに始める", reverseScored: false },
  { id: "C5", factor: "C", questionText: "予定を守るのが苦手だ", reverseScored: true },
  { id: "C6", factor: "C", questionText: "計画に従って物事を進める", reverseScored: false },
  { id: "C7", factor: "C", questionText: "仕事を途中で投げ出すことがある", reverseScored: true },
  { id: "C8", factor: "C", questionText: "正確に仕事をこなす", reverseScored: false },
  { id: "C9", factor: "C", questionText: "約束を守らないことがある", reverseScored: true },
  { id: "C10", factor: "C", questionText: "目標に向かって努力する", reverseScored: false },

  // 神経症傾向 (Neuroticism) - 10問
  { id: "N1", factor: "N", questionText: "ストレスを感じやすい", reverseScored: false },
  { id: "N2", factor: "N", questionText: "ほとんどの時間リラックスしている", reverseScored: true },
  { id: "N3", factor: "N", questionText: "物事を心配しすぎる", reverseScored: false },
  { id: "N4", factor: "N", questionText: "めったに落ち込まない", reverseScored: true },
  { id: "N5", factor: "N", questionText: "すぐに動揺する", reverseScored: false },
  { id: "N6", factor: "N", questionText: "気分の浮き沈みが激しい", reverseScored: false },
  { id: "N7", factor: "N", questionText: "気分が頻繁に変わる", reverseScored: false },
  { id: "N8", factor: "N", questionText: "すぐにイライラする", reverseScored: false },
  { id: "N9", factor: "N", questionText: "よく悲しい気持ちになる", reverseScored: false },
  { id: "N10", factor: "N", questionText: "感情が安定している", reverseScored: true },

  // 開放性 (Openness) - 10問
  { id: "O1", factor: "O", questionText: "鮮明な想像力を持っている", reverseScored: false },
  { id: "O2", factor: "O", questionText: "抽象的なアイデアに興味がない", reverseScored: true },
  { id: "O3", factor: "O", questionText: "難しい本を読むのが好きだ", reverseScored: false },
  { id: "O4", factor: "O", questionText: "芸術や音楽に感動しにくい", reverseScored: true },
  { id: "O5", factor: "O", questionText: "新しいアイデアを聞くのが好きだ", reverseScored: false },
  { id: "O6", factor: "O", questionText: "物事を深く考えるのが好きだ", reverseScored: false },
  { id: "O7", factor: "O", questionText: "想像力に乏しい", reverseScored: true },
  { id: "O8", factor: "O", questionText: "美術館に行くのが好きだ", reverseScored: false },
  { id: "O9", factor: "O", questionText: "詩にはあまり興味がない", reverseScored: true },
  { id: "O10", factor: "O", questionText: "新しいことを試すのが好きだ", reverseScored: false },
];

/**
 * 因子混在順序で質問を配置する
 * パターン: E1, A1, C1, N1, O1, E2, A2, C2, N2, O2, ...
 */
function getOrderedQuestions(): Big5QuestionData[] {
  const factorOrder: Factor[] = ["E", "A", "C", "N", "O"];
  const result: Big5QuestionData[] = [];

  for (let i = 1; i <= 10; i++) {
    for (const factor of factorOrder) {
      const question = QUESTIONS.find((q) => q.id === `${factor}${i}`);
      if (question) {
        result.push(question);
      }
    }
  }

  return result;
}

/**
 * BIG5診断の50問をシードするmutation
 *
 * 冪等性:
 * - 既存のBIG5質問を削除してから再投入
 * - 再実行しても重複は発生しない
 */
export const seedBig5Questions = mutation({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    message: string;
    questionCount: number;
  }> => {
    // 1. BIG5テストを取得
    const big5Test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "big5"))
      .unique();

    if (!big5Test) {
      return {
        success: false,
        message: "BIG5テストが見つかりません。先にseedEvidenceBasedTestsを実行してください。",
        questionCount: 0,
      };
    }

    // 2. 既存のBIG5質問を削除（冪等性確保）
    const existingQuestions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", big5Test._id))
      .collect();

    for (const question of existingQuestions) {
      await ctx.db.delete(question._id);
    }

    // 3. 質問を因子混在順序で配置
    const orderedQuestions = getOrderedQuestions();

    // 4. 質問を投入
    const typeConfig = {
      likertMin: 1,
      likertMax: 5,
      likertLabels: {
        min: "全く当てはまらない",
        max: "非常に当てはまる",
      },
    };

    let insertedCount = 0;
    for (let i = 0; i < orderedQuestions.length; i++) {
      const q = orderedQuestions[i];

      await ctx.db.insert("testQuestions", {
        testId: big5Test._id,
        order: i + 1,
        questionText: q.questionText,
        questionType: "likert",
        scoreKey: q.factor,
        reverseScored: q.reverseScored,
        typeConfig,
      });

      insertedCount++;
    }

    // 5. 検証
    if (insertedCount !== 50) {
      return {
        success: false,
        message: `質問数が不正です。期待: 50, 実際: ${insertedCount}`,
        questionCount: insertedCount,
      };
    }

    // 逆転項目数の検証
    const reversedCount = orderedQuestions.filter((q) => q.reverseScored).length;
    const expectedReversed = 21; // O:4, C:4, E:5, A:5, N:3 = 21
    if (reversedCount !== expectedReversed) {
      return {
        success: false,
        message: `逆転項目数が不正です。期待: ${expectedReversed}, 実際: ${reversedCount}`,
        questionCount: insertedCount,
      };
    }

    return {
      success: true,
      message: `BIG5診断の質問データを登録しました（${insertedCount}問、逆転項目: ${reversedCount}問）`,
      questionCount: insertedCount,
    };
  },
});

/**
 * BIG5質問データの検証用query
 */
export const verifyBig5Questions = mutation({
  args: {},
  handler: async (ctx): Promise<{
    success: boolean;
    totalQuestions: number;
    factorCounts: Record<string, number>;
    reversedCounts: Record<string, number>;
  }> => {
    const big5Test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "big5"))
      .unique();

    if (!big5Test) {
      return {
        success: false,
        totalQuestions: 0,
        factorCounts: {},
        reversedCounts: {},
      };
    }

    const questions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", big5Test._id))
      .collect();

    const factorCounts: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    const reversedCounts: Record<string, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };

    for (const q of questions) {
      const factor = q.scoreKey as string;
      if (factor && factorCounts[factor] !== undefined) {
        factorCounts[factor]++;
        if (q.reverseScored) {
          reversedCounts[factor]++;
        }
      }
    }

    // 検証: 各因子10問
    const isValid =
      questions.length === 50 &&
      Object.values(factorCounts).every((count) => count === 10);

    return {
      success: isValid,
      totalQuestions: questions.length,
      factorCounts,
      reversedCounts,
    };
  },
});
