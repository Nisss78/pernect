/**
 * スコアリングエンジン
 *
 * 4つのスコアリングタイプに対応した汎用スコアリングシステム：
 * - dimension: 対立次元間のスコア比較（MBTI, DiSC, 愛着スタイル）
 * - single: 最高スコアの次元を結果とする（エニアグラム, 愛の言語, マネースクリプト, VARK）
 * - scale: 合計スコアを閾値判定（HSP, グリット）
 * - percentile: 各次元のパーセンタイル計算（BIG5, VIA, EQ, ストレスコーピング）
 */

// 型定義
export interface CalculationResult {
  resultType: string;
  scores: Record<string, number>;
  percentiles?: Record<string, number>;
  dimensions?: string[];
}

export interface QuestionData {
  order: number;
  questionType?: string;
  scoreKey?: string;
  reverseScored?: boolean; // 逆転項目フラグ（BIG5等で使用）
  options?: {
    value: string;
    label: string;
    scoreKey?: string;
    scoreValue?: string | number;
  }[];
  typeConfig?: {
    likertMin?: number;
    likertMax?: number;
    sliderMin?: number;
    sliderMax?: number;
  };
}

export interface AnswerData {
  questionOrder: number;
  selectedValue: string;
}

export interface DimensionConfig {
  positive: string;
  negative: string;
}

export interface ThresholdConfig {
  min: number;
  max: number;
  label: string;
}

export interface ScoringConfig {
  dimensions?: DimensionConfig[];
  thresholds?: ThresholdConfig[];
  percentileBase?: number;
  customCalculator?: string;
}

export type ScoringType = "dimension" | "single" | "scale" | "percentile";

/**
 * 対立次元型スコアリング (MBTI, DiSC, 愛着スタイル)
 *
 * 各質問の回答が特定の次元（E/I, S/N等）にスコアを加算し、
 * 対立する次元間でスコアを比較して勝者を決定する
 */
export function calculateDimensionScores(
  questions: QuestionData[],
  answers: AnswerData[],
  config?: ScoringConfig
): CalculationResult {
  const scores: Record<string, number> = {};

  // 設定された次元ペアから初期化
  if (config?.dimensions) {
    for (const dim of config.dimensions) {
      scores[dim.positive] = 0;
      scores[dim.negative] = 0;
    }
  }

  // 回答からスコアを集計
  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const questionType = question.questionType || "multiple";

    if (questionType === "multiple" || questionType === "forced_choice") {
      // 選択式: options から scoreValue を取得
      if (!question.options) continue;

      const option = question.options.find(
        (o) => o.value === answer.selectedValue
      );
      if (!option || !option.scoreValue) continue;

      const value = String(option.scoreValue);
      if (scores[value] === undefined) {
        scores[value] = 0;
      }
      scores[value] += 1;
    } else if (questionType === "likert" || questionType === "slider") {
      // リッカート/スライダー: scoreKey を使用
      const scoreKey = question.scoreKey;
      if (!scoreKey) continue;

      const numericValue = parseInt(answer.selectedValue, 10);
      if (isNaN(numericValue)) continue;

      if (scores[scoreKey] === undefined) {
        scores[scoreKey] = 0;
      }
      scores[scoreKey] += numericValue;
    }
  }

  // 次元ペアから結果タイプを決定
  const dimensions: string[] = [];

  if (config?.dimensions) {
    for (const dim of config.dimensions) {
      const positiveScore = scores[dim.positive] || 0;
      const negativeScore = scores[dim.negative] || 0;
      // 同点の場合は positive を選択
      dimensions.push(positiveScore >= negativeScore ? dim.positive : dim.negative);
    }
  } else {
    // 設定がない場合は旧来のMBTI形式にフォールバック
    const mbtiDimensions: DimensionConfig[] = [
      { positive: "E", negative: "I" },
      { positive: "S", negative: "N" },
      { positive: "T", negative: "F" },
      { positive: "J", negative: "P" },
    ];

    // MBTI用のスコアを初期化
    for (const dim of mbtiDimensions) {
      if (scores[dim.positive] === undefined) scores[dim.positive] = 0;
      if (scores[dim.negative] === undefined) scores[dim.negative] = 0;
    }

    for (const dim of mbtiDimensions) {
      const positiveScore = scores[dim.positive] || 0;
      const negativeScore = scores[dim.negative] || 0;
      dimensions.push(positiveScore >= negativeScore ? dim.positive : dim.negative);
    }
  }

  const resultType = dimensions.join("");

  return { resultType, scores, dimensions };
}

/**
 * 単一タイプスコアリング (エニアグラム, 愛の言語, マネースクリプト, VARK)
 *
 * 各次元の合計スコアを計算し、最高スコアの次元を結果タイプとする
 */
export function calculateSingleScores(
  questions: QuestionData[],
  answers: AnswerData[]
): CalculationResult {
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const questionType = question.questionType || "multiple";

    if (questionType === "multiple" || questionType === "forced_choice") {
      if (!question.options) continue;

      const option = question.options.find(
        (o) => o.value === answer.selectedValue
      );
      if (!option || !option.scoreKey) continue;

      const key = option.scoreKey;
      const value = typeof option.scoreValue === "number" ? option.scoreValue : 1;

      scores[key] = (scores[key] || 0) + value;
    } else if (questionType === "likert" || questionType === "slider") {
      const scoreKey = question.scoreKey;
      if (!scoreKey) continue;

      const numericValue = parseInt(answer.selectedValue, 10);
      if (isNaN(numericValue)) continue;

      scores[scoreKey] = (scores[scoreKey] || 0) + numericValue;
    }
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

/**
 * スケール型スコアリング (HSP, グリット)
 *
 * 合計スコアを算出し、閾値設定に基づいて結果タイプを判定する
 */
export function calculateScaleScores(
  questions: QuestionData[],
  answers: AnswerData[],
  config?: ScoringConfig
): CalculationResult {
  let totalScore = 0;
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const questionType = question.questionType || "multiple";

    if (questionType === "multiple" || questionType === "forced_choice") {
      if (!question.options) continue;

      const option = question.options.find(
        (o) => o.value === answer.selectedValue
      );
      if (!option) continue;

      const value = typeof option.scoreValue === "number" ? option.scoreValue : 0;
      totalScore += value;

      // 個別スコアキーがあれば記録
      if (option.scoreKey) {
        scores[option.scoreKey] = (scores[option.scoreKey] || 0) + value;
      }
    } else if (questionType === "likert" || questionType === "slider") {
      const numericValue = parseInt(answer.selectedValue, 10);
      if (isNaN(numericValue)) continue;

      totalScore += numericValue;

      // スコアキーがあれば記録
      if (question.scoreKey) {
        scores[question.scoreKey] = (scores[question.scoreKey] || 0) + numericValue;
      }
    }
  }

  scores["total"] = totalScore;

  // 閾値から結果タイプを決定
  let resultType = "unknown";

  if (config?.thresholds && config.thresholds.length > 0) {
    // ソートされた閾値で判定
    const sortedThresholds = [...config.thresholds].sort((a, b) => a.min - b.min);

    for (const threshold of sortedThresholds) {
      if (totalScore >= threshold.min && totalScore <= threshold.max) {
        resultType = threshold.label;
        break;
      }
    }

    // どの閾値にも該当しない場合は最も近い閾値を使用
    if (resultType === "unknown") {
      const lastThreshold = sortedThresholds[sortedThresholds.length - 1];
      if (totalScore > lastThreshold.max) {
        resultType = lastThreshold.label;
      } else {
        resultType = sortedThresholds[0].label;
      }
    }
  } else {
    // 閾値設定がない場合はスコアを文字列化
    resultType = `score_${totalScore}`;
  }

  return { resultType, scores };
}

/**
 * パーセンタイル型スコアリング (BIG5, VIA, EQ, ストレスコーピング)
 *
 * 各次元のスコアをパーセンタイルに変換する
 */
export function calculatePercentileScores(
  questions: QuestionData[],
  answers: AnswerData[],
  config?: ScoringConfig
): CalculationResult {
  const scores: Record<string, number> = {};
  const questionCounts: Record<string, number> = {};

  // 質問からスコアを集計
  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const questionType = question.questionType || "multiple";

    let scoreKey: string | undefined;
    let scoreValue: number;

    if (questionType === "multiple" || questionType === "forced_choice") {
      if (!question.options) continue;

      const option = question.options.find(
        (o) => o.value === answer.selectedValue
      );
      if (!option) continue;

      scoreKey = option.scoreKey || question.scoreKey;
      scoreValue = typeof option.scoreValue === "number" ? option.scoreValue : 0;
    } else if (questionType === "likert" || questionType === "slider") {
      scoreKey = question.scoreKey;
      scoreValue = parseInt(answer.selectedValue, 10);
      if (isNaN(scoreValue)) continue;

      // 逆転項目の処理（BIG5等で使用）
      // 逆転処理: (likertMax + likertMin) - rawValue
      // 例: 5段階スケール(1-5)で回答5の場合 → (5 + 1) - 5 = 1
      if (question.reverseScored) {
        const likertMin = question.typeConfig?.likertMin ?? 1;
        const likertMax = question.typeConfig?.likertMax ?? 5;
        scoreValue = likertMax + likertMin - scoreValue;
      }
    } else {
      continue;
    }

    if (!scoreKey) continue;

    scores[scoreKey] = (scores[scoreKey] || 0) + scoreValue;
    questionCounts[scoreKey] = (questionCounts[scoreKey] || 0) + 1;
  }

  // パーセンタイルを計算
  const percentiles: Record<string, number> = {};
  const percentileBase = config?.percentileBase || 100;

  // 質問からリッカートスケールの範囲を取得（最初の質問から推定）
  let likertMin = 1;
  let likertMax = 5; // デフォルトは5段階スケール

  for (const question of questions) {
    if (question.typeConfig?.likertMin !== undefined) {
      likertMin = question.typeConfig.likertMin;
    }
    if (question.typeConfig?.likertMax !== undefined) {
      likertMax = question.typeConfig.likertMax;
    }
    // 最初の有効な設定を使用
    if (question.typeConfig?.likertMin !== undefined || question.typeConfig?.likertMax !== undefined) {
      break;
    }
  }

  for (const [key, totalScore] of Object.entries(scores)) {
    const questionCount = questionCounts[key] || 1;

    // 最小・最大スコアを動的に計算
    // 例: 5段階スケール(1-5) × 10問 → min=10, max=50
    const minPossibleScore = questionCount * likertMin;
    const maxPossibleScore = questionCount * likertMax;

    // パーセンタイルを計算（min-maxの範囲を0-100に正規化）
    // 公式: (score - min) / (max - min) * 100
    const range = maxPossibleScore - minPossibleScore;
    const rawPercentile = range > 0
      ? ((totalScore - minPossibleScore) / range) * percentileBase
      : 0;
    percentiles[key] = Math.round(Math.min(percentileBase, Math.max(0, rawPercentile)));
  }

  // 結果タイプは最高パーセンタイルの次元
  let maxKey = "";
  let maxPercentile = -1;

  for (const [key, percentile] of Object.entries(percentiles)) {
    if (percentile > maxPercentile) {
      maxPercentile = percentile;
      maxKey = key;
    }
  }

  // BIG5等の場合は「High-O」形式、それ以外は「O:80-C:65...」形式
  // BIG5の因子キー（O, C, E, A, N）を検出
  const big5Factors = ["O", "C", "E", "A", "N"];
  const isBig5 = Object.keys(scores).every((key) => big5Factors.includes(key));

  let resultType: string;
  if (isBig5 && maxKey) {
    // BIG5の場合は「High-O」形式
    resultType = `High-${maxKey}`;
  } else if (maxKey) {
    resultType = maxKey;
  } else {
    // フォールバック: プロファイル形式
    resultType = Object.entries(percentiles)
      .map(([key, value]) => `${key}:${value}`)
      .join("-");
  }

  return {
    resultType,
    scores,
    percentiles,
    dimensions: Object.keys(scores),
  };
}

/**
 * 統一スコアリングエンジン
 *
 * scoringTypeに基づいて適切な計算関数を呼び出す
 */
export function calculateScores(
  scoringType: ScoringType,
  questions: QuestionData[],
  answers: AnswerData[],
  config?: ScoringConfig
): CalculationResult {
  switch (scoringType) {
    case "dimension":
      return calculateDimensionScores(questions, answers, config);

    case "single":
      return calculateSingleScores(questions, answers);

    case "scale":
      return calculateScaleScores(questions, answers, config);

    case "percentile":
      return calculatePercentileScores(questions, answers, config);

    default:
      // 未知のスコアリングタイプの場合はsingleにフォールバック
      console.warn(`Unknown scoring type: ${scoringType}, falling back to single`);
      return calculateSingleScores(questions, answers);
  }
}

/**
 * AI分析用データ構造を生成
 */
export function generateAiData(
  testSlug: string,
  result: CalculationResult
): {
  testSlug: string;
  resultType: string;
  scores: Record<string, number>;
  dimensions?: string[];
  percentiles?: Record<string, number>;
  completedAt: string;
} {
  return {
    testSlug,
    resultType: result.resultType,
    scores: result.scores,
    dimensions: result.dimensions,
    percentiles: result.percentiles,
    completedAt: new Date().toISOString(),
  };
}
