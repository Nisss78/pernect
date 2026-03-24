/**
 * 相性診断エンジン
 *
 * 科学的研究に基づく包括的な相性計算:
 * - MBTI: ソシオニクス16x16完全マトリクス + Keirsey + 認知機能補完性
 * - BIG5: Malouff 2010メタ分析ベース (N=0.30, A=0.28, C=0.22, E=0.12, O=0.08)
 * - エニアグラム: 457組カップル研究 + Riso-Hudson + 3センター理論
 * - Last Lover: lastLoverCompatibilityテーブルデータ活用
 */

// ============================================================
// 型定義
// ============================================================

export interface UserTestData {
  mbti?: {
    resultType: string;
    scores: Record<string, number>;
    dimensions: string[];
  };
  big5?: { percentiles: Record<string, number> };
  enneagram?: { resultType: string; scores: Record<string, number> };
  lastLover?: { resultType: string };
}

export interface LastLoverCompatEntry {
  compatibilityLevel: string; // "best"|"good"|"neutral"|"challenging"
  reason: string;
  advice?: string;
}

interface CompatibilityResult {
  overallCompatibility: number;
  compatibilityLevel: string;
  title: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  insights: { category: string; description: string; score: number }[];
}

// ============================================================
// 1b. extractTestData
// ============================================================

export function extractTestData(results: any[]): UserTestData {
  const data: UserTestData = {};

  // testSlugでグルーピングし、completedAtが最新のものを使用
  const latestBySlug = new Map<string, any>();
  for (const r of results) {
    const slug = r.aiData?.testSlug || "";
    const existing = latestBySlug.get(slug);
    if (!existing || (r.completedAt || 0) > (existing.completedAt || 0)) {
      latestBySlug.set(slug, r);
    }
  }

  for (const [slug, r] of latestBySlug) {
    if (
      slug === "mbti-evidence" ||
      slug === "mbti-simple" ||
      slug === "mbti"
    ) {
      data.mbti = {
        resultType: r.aiData?.resultType || r.resultType || "",
        scores: r.aiData?.scores || r.scores || {},
        dimensions: r.aiData?.dimensions || [],
      };
    } else if (slug === "big5") {
      data.big5 = {
        percentiles: r.aiData?.percentiles || r.scores || {},
      };
    } else if (slug === "enneagram") {
      data.enneagram = {
        resultType: r.aiData?.resultType || r.resultType || "",
        scores: r.aiData?.scores || r.scores || {},
      };
    } else if (slug === "last-lover") {
      data.lastLover = {
        resultType: r.aiData?.resultType || r.resultType || "",
      };
    }
  }

  return data;
}

// ============================================================
// 1c. MBTI相性 — ソシオニクス16x16完全マトリクス
// ============================================================

const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

type MbtiType = (typeof MBTI_TYPES)[number];

// ソシオニクス型間関係
type RelationType =
  | "Duality"
  | "Identity"
  | "Activity"
  | "Mirror"
  | "SemiDual"
  | "Mirage"
  | "LookALike"
  | "Kindred"
  | "Benefit"
  | "Benefit_r"
  | "Supervision"
  | "Supervision_r"
  | "SuperEgo"
  | "Extinguishment"
  | "QuasiIdentity"
  | "Conflict";

const RELATION_SCORES: Record<RelationType, number> = {
  Duality: 95,
  Identity: 85,
  Activity: 78,
  Mirror: 72,
  SemiDual: 62,
  Mirage: 58,
  LookALike: 52,
  Kindred: 50,
  Benefit: 42,
  Benefit_r: 38,
  Supervision: 32,
  Supervision_r: 28,
  SuperEgo: 22,
  Extinguishment: 20,
  QuasiIdentity: 15,
  Conflict: 10,
};

// ソシオニクス16x16関係マッピング (row=type1のインデックス)
// 順序: INTJ,INTP,ENTJ,ENTP,INFJ,INFP,ENFJ,ENFP,ISTJ,ISFJ,ESTJ,ESFJ,ISTP,ISFP,ESTP,ESFP
const SOCIONICS_RELATIONS: RelationType[][] = [
  // INTJ
  [
    "Identity",
    "Mirror",
    "Activity",
    "Duality",
    "LookALike",
    "Kindred",
    "Mirage",
    "SemiDual",
    "Benefit",
    "Supervision",
    "Benefit_r",
    "Supervision_r",
    "SuperEgo",
    "Extinguishment",
    "QuasiIdentity",
    "Conflict",
  ],
  // INTP
  [
    "Mirror",
    "Identity",
    "Duality",
    "Activity",
    "Kindred",
    "LookALike",
    "SemiDual",
    "Mirage",
    "Supervision",
    "Benefit",
    "Supervision_r",
    "Benefit_r",
    "Extinguishment",
    "SuperEgo",
    "Conflict",
    "QuasiIdentity",
  ],
  // ENTJ
  [
    "Activity",
    "Duality",
    "Identity",
    "Mirror",
    "Mirage",
    "SemiDual",
    "LookALike",
    "Kindred",
    "Benefit_r",
    "Supervision_r",
    "Benefit",
    "Supervision",
    "QuasiIdentity",
    "Conflict",
    "SuperEgo",
    "Extinguishment",
  ],
  // ENTP
  [
    "Duality",
    "Activity",
    "Mirror",
    "Identity",
    "SemiDual",
    "Mirage",
    "Kindred",
    "LookALike",
    "Supervision_r",
    "Benefit_r",
    "Supervision",
    "Benefit",
    "Conflict",
    "QuasiIdentity",
    "Extinguishment",
    "SuperEgo",
  ],
  // INFJ
  [
    "LookALike",
    "Kindred",
    "Mirage",
    "SemiDual",
    "Identity",
    "Mirror",
    "Activity",
    "Duality",
    "SuperEgo",
    "Extinguishment",
    "QuasiIdentity",
    "Conflict",
    "Benefit",
    "Supervision",
    "Benefit_r",
    "Supervision_r",
  ],
  // INFP
  [
    "Kindred",
    "LookALike",
    "SemiDual",
    "Mirage",
    "Mirror",
    "Identity",
    "Duality",
    "Activity",
    "Extinguishment",
    "SuperEgo",
    "Conflict",
    "QuasiIdentity",
    "Supervision",
    "Benefit",
    "Supervision_r",
    "Benefit_r",
  ],
  // ENFJ
  [
    "Mirage",
    "SemiDual",
    "LookALike",
    "Kindred",
    "Activity",
    "Duality",
    "Identity",
    "Mirror",
    "QuasiIdentity",
    "Conflict",
    "SuperEgo",
    "Extinguishment",
    "Benefit_r",
    "Supervision_r",
    "Benefit",
    "Supervision",
  ],
  // ENFP
  [
    "SemiDual",
    "Mirage",
    "Kindred",
    "LookALike",
    "Duality",
    "Activity",
    "Mirror",
    "Identity",
    "Conflict",
    "QuasiIdentity",
    "Extinguishment",
    "SuperEgo",
    "Supervision_r",
    "Benefit_r",
    "Supervision",
    "Benefit",
  ],
  // ISTJ
  [
    "Benefit_r",
    "Supervision_r",
    "Benefit",
    "Supervision",
    "SuperEgo",
    "Extinguishment",
    "QuasiIdentity",
    "Conflict",
    "Identity",
    "Mirror",
    "Activity",
    "Duality",
    "LookALike",
    "Kindred",
    "Mirage",
    "SemiDual",
  ],
  // ISFJ
  [
    "Supervision_r",
    "Benefit_r",
    "Supervision",
    "Benefit",
    "Extinguishment",
    "SuperEgo",
    "Conflict",
    "QuasiIdentity",
    "Mirror",
    "Identity",
    "Duality",
    "Activity",
    "Kindred",
    "LookALike",
    "SemiDual",
    "Mirage",
  ],
  // ESTJ
  [
    "Benefit",
    "Supervision",
    "Benefit_r",
    "Supervision_r",
    "QuasiIdentity",
    "Conflict",
    "SuperEgo",
    "Extinguishment",
    "Activity",
    "Duality",
    "Identity",
    "Mirror",
    "Mirage",
    "SemiDual",
    "LookALike",
    "Kindred",
  ],
  // ESFJ
  [
    "Supervision",
    "Benefit",
    "Supervision_r",
    "Benefit_r",
    "Conflict",
    "QuasiIdentity",
    "Extinguishment",
    "SuperEgo",
    "Duality",
    "Activity",
    "Mirror",
    "Identity",
    "SemiDual",
    "Mirage",
    "Kindred",
    "LookALike",
  ],
  // ISTP
  [
    "SuperEgo",
    "Extinguishment",
    "QuasiIdentity",
    "Conflict",
    "Benefit_r",
    "Supervision_r",
    "Benefit",
    "Supervision",
    "LookALike",
    "Kindred",
    "Mirage",
    "SemiDual",
    "Identity",
    "Mirror",
    "Activity",
    "Duality",
  ],
  // ISFP
  [
    "Extinguishment",
    "SuperEgo",
    "Conflict",
    "QuasiIdentity",
    "Supervision_r",
    "Benefit_r",
    "Supervision",
    "Benefit",
    "Kindred",
    "LookALike",
    "SemiDual",
    "Mirage",
    "Mirror",
    "Identity",
    "Duality",
    "Activity",
  ],
  // ESTP
  [
    "QuasiIdentity",
    "Conflict",
    "SuperEgo",
    "Extinguishment",
    "Benefit",
    "Supervision",
    "Benefit_r",
    "Supervision_r",
    "Mirage",
    "SemiDual",
    "LookALike",
    "Kindred",
    "Activity",
    "Duality",
    "Identity",
    "Mirror",
  ],
  // ESFP
  [
    "Conflict",
    "QuasiIdentity",
    "Extinguishment",
    "SuperEgo",
    "Supervision",
    "Benefit",
    "Supervision_r",
    "Benefit_r",
    "SemiDual",
    "Mirage",
    "Kindred",
    "LookALike",
    "Duality",
    "Activity",
    "Mirror",
    "Identity",
  ],
];

// Keirsey気質グループ
function getKeirseyGroup(type: string): string {
  if (["ISTJ", "ISFJ", "ESTJ", "ESFJ"].includes(type)) return "SJ";
  if (["ISTP", "ISFP", "ESTP", "ESFP"].includes(type)) return "SP";
  if (["INFJ", "INFP", "ENFJ", "ENFP"].includes(type)) return "NF";
  if (["INTJ", "INTP", "ENTJ", "ENTP"].includes(type)) return "NT";
  return "";
}

const KEIRSEY_ADJUSTMENT: Record<string, number> = {
  "SJ+SJ": 5,
  "NF+NF": 3,
  "NT+NT": 2,
  "SP+SP": 1,
  "NF+NT": 4,
  "NT+NF": 4,
  "SJ+SP": 2,
  "SP+SJ": 2,
  "NF+SP": -1,
  "SP+NF": -1,
  "NT+SJ": -2,
  "SJ+NT": -2,
};

// 認知機能スタック (dominant, auxiliary, tertiary, inferior)
const COGNITIVE_FUNCTIONS: Record<string, string[]> = {
  INTJ: ["Ni", "Te", "Fi", "Se"],
  INTP: ["Ti", "Ne", "Si", "Fe"],
  ENTJ: ["Te", "Ni", "Se", "Fi"],
  ENTP: ["Ne", "Ti", "Fe", "Si"],
  INFJ: ["Ni", "Fe", "Ti", "Se"],
  INFP: ["Fi", "Ne", "Si", "Te"],
  ENFJ: ["Fe", "Ni", "Se", "Ti"],
  ENFP: ["Ne", "Fi", "Te", "Si"],
  ISTJ: ["Si", "Te", "Fi", "Ne"],
  ISFJ: ["Si", "Fe", "Ti", "Ne"],
  ESTJ: ["Te", "Si", "Ne", "Fi"],
  ESFJ: ["Fe", "Si", "Ne", "Ti"],
  ISTP: ["Ti", "Se", "Ni", "Fe"],
  ISFP: ["Fi", "Se", "Ni", "Te"],
  ESTP: ["Se", "Ti", "Fe", "Ni"],
  ESFP: ["Se", "Fi", "Te", "Ni"],
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateMbtiScore(type1: string, type2: string): number {
  const idx1 = MBTI_TYPES.indexOf(type1 as MbtiType);
  const idx2 = MBTI_TYPES.indexOf(type2 as MbtiType);

  if (idx1 === -1 || idx2 === -1) return 65; // 不明タイプのデフォルト

  // ソシオニクス関係から基本スコア
  const relation = SOCIONICS_RELATIONS[idx1][idx2];
  let score = RELATION_SCORES[relation];

  // Keirsey気質調整
  const g1 = getKeirseyGroup(type1);
  const g2 = getKeirseyGroup(type2);
  const keirseyKey = `${g1}+${g2}`;
  score += KEIRSEY_ADJUSTMENT[keirseyKey] || 0;

  // 認知機能補完性: dominant ↔ inferior の補完ボーナス
  const f1 = COGNITIVE_FUNCTIONS[type1];
  const f2 = COGNITIVE_FUNCTIONS[type2];
  if (f1 && f2) {
    // dominant が相手の inferior と同じ機能（方向は異なる場合も）
    const fn1Dom = f1[0].replace(/[ie]/i, "");
    const fn2Inf = f2[3].replace(/[ie]/i, "");
    const fn2Dom = f2[0].replace(/[ie]/i, "");
    const fn1Inf = f1[3].replace(/[ie]/i, "");
    if (fn1Dom === fn2Inf || fn2Dom === fn1Inf) {
      score += 3;
    }
  }

  return clamp(score, 5, 98);
}

// ============================================================
// 1d. BIG5相性 — Malouff 2010メタ分析ベース
// ============================================================

const BIG5_WEIGHTS = {
  N: 0.3,
  A: 0.28,
  C: 0.22,
  E: 0.12,
  O: 0.08,
};

// BIG5因子キー正規化（大文字1文字に統一）
function normalizeBig5Key(key: string): string {
  const map: Record<string, string> = {
    neuroticism: "N",
    agreeableness: "A",
    conscientiousness: "C",
    extraversion: "E",
    openness: "O",
    n: "N",
    a: "A",
    c: "C",
    e: "E",
    o: "O",
  };
  return map[key.toLowerCase()] || key.toUpperCase();
}

function normalizePercentiles(
  raw: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(raw)) {
    result[normalizeBig5Key(k)] = v;
  }
  return result;
}

function calculateBig5Score(
  p1Raw: Record<string, number>,
  p2Raw: Record<string, number>
): number {
  const p1 = normalizePercentiles(p1Raw);
  const p2 = normalizePercentiles(p2Raw);

  let totalScore = 0;
  let totalWeight = 0;

  // N (Neuroticism): 両者低い方が良い + 類似性
  if (p1.N !== undefined && p2.N !== undefined) {
    const avgN = (p1.N + p2.N) / 2;
    const levelScore = 100 - avgN; // 低いほど良い
    const similarity = 100 - Math.abs(p1.N - p2.N);
    const nScore = levelScore * 0.6 + similarity * 0.4;
    totalScore += nScore * BIG5_WEIGHTS.N;
    totalWeight += BIG5_WEIGHTS.N;
  }

  // A (Agreeableness): 類似性 + 高い方が良い
  if (p1.A !== undefined && p2.A !== undefined) {
    const avgA = (p1.A + p2.A) / 2;
    const similarity = 100 - Math.abs(p1.A - p2.A);
    const aScore = avgA * 0.5 + similarity * 0.5;
    totalScore += aScore * BIG5_WEIGHTS.A;
    totalWeight += BIG5_WEIGHTS.A;
  }

  // C (Conscientiousness): 類似性が最も重要
  if (p1.C !== undefined && p2.C !== undefined) {
    const similarity = 100 - Math.abs(p1.C - p2.C);
    const avgC = (p1.C + p2.C) / 2;
    const cScore = similarity * 0.7 + avgC * 0.3;
    totalScore += cScore * BIG5_WEIGHTS.C;
    totalWeight += BIG5_WEIGHTS.C;
  }

  // E (Extraversion): 適度な補完性が理想 (差15-40がベスト)
  if (p1.E !== undefined && p2.E !== undefined) {
    const diff = Math.abs(p1.E - p2.E);
    let eScore: number;
    if (diff >= 15 && diff <= 40) {
      eScore = 90 + (25 - Math.abs(diff - 27.5)) * 0.4; // 差27.5が最適
    } else if (diff < 15) {
      eScore = 70 + diff * (20 / 15); // 類似も悪くない
    } else {
      eScore = Math.max(30, 90 - (diff - 40) * 1.5); // 差が大きすぎる
    }
    totalScore += eScore * BIG5_WEIGHTS.E;
    totalWeight += BIG5_WEIGHTS.E;
  }

  // O (Openness): 類似性
  if (p1.O !== undefined && p2.O !== undefined) {
    const similarity = 100 - Math.abs(p1.O - p2.O);
    const avgO = (p1.O + p2.O) / 2;
    const oScore = similarity * 0.8 + avgO * 0.2;
    totalScore += oScore * BIG5_WEIGHTS.O;
    totalWeight += BIG5_WEIGHTS.O;
  }

  if (totalWeight === 0) return 65;
  return clamp(Math.round(totalScore / totalWeight), 0, 100);
}

// ============================================================
// 1e. エニアグラム相性 — 9x9マトリクス
// ============================================================

// 457組カップル研究 + Riso-Hudson + 3センター理論
// [type1][type2] のスコア (0-100)
const ENNEAGRAM_MATRIX: number[][] = [
  // 1    2    3    4    5    6    7    8    9
  [65, 82, 68, 60, 62, 72, 78, 55, 75], // Type 1
  [82, 70, 75, 80, 55, 78, 85, 62, 72], // Type 2
  [68, 75, 60, 55, 58, 70, 72, 65, 78], // Type 3
  [60, 80, 55, 58, 72, 65, 62, 52, 82], // Type 4
  [62, 55, 58, 72, 65, 68, 70, 60, 75], // Type 5
  [72, 78, 70, 65, 68, 62, 58, 75, 80], // Type 6
  [78, 85, 72, 62, 70, 58, 68, 75, 82], // Type 7
  [55, 62, 65, 52, 60, 75, 75, 58, 72], // Type 8
  [75, 72, 78, 82, 75, 80, 82, 72, 70], // Type 9
];

// 成長ライン (integration)
const GROWTH_LINES: Record<number, number> = {
  1: 7,
  2: 4,
  3: 6,
  4: 1,
  5: 8,
  6: 9,
  7: 5,
  8: 2,
  9: 3,
};

// ストレスライン (disintegration)
const STRESS_LINES: Record<number, number> = {
  1: 4,
  2: 8,
  3: 9,
  4: 2,
  5: 7,
  6: 3,
  7: 1,
  8: 5,
  9: 6,
};

// 3センター
function getEnneagramCenter(type: number): string {
  if ([2, 3, 4].includes(type)) return "Heart";
  if ([5, 6, 7].includes(type)) return "Head";
  if ([8, 9, 1].includes(type)) return "Body";
  return "";
}

function parseEnneagramType(resultType: string): number {
  // "タイプ1", "Type 1", "1", "type1" などからタイプ番号を抽出
  const match = resultType.match(/(\d)/);
  return match ? parseInt(match[1]) : 0;
}

function calculateEnneagramScore(type1Str: string, type2Str: string): number {
  const t1 = parseEnneagramType(type1Str);
  const t2 = parseEnneagramType(type2Str);

  if (t1 < 1 || t1 > 9 || t2 < 1 || t2 > 9) return 65;

  let score = ENNEAGRAM_MATRIX[t1 - 1][t2 - 1];

  // 成長ラインボーナス
  if (GROWTH_LINES[t1] === t2 || GROWTH_LINES[t2] === t1) {
    score += 5;
  }

  // ストレスラインボーナス（化学反応は強い）
  if (STRESS_LINES[t1] === t2 || STRESS_LINES[t2] === t1) {
    score += 2;
  }

  // 同センターペナルティ
  if (getEnneagramCenter(t1) === getEnneagramCenter(t2) && t1 !== t2) {
    score -= 3;
  }

  return clamp(score, 0, 100);
}

// ============================================================
// 1f. Last Lover相性 — DBデータ活用
// ============================================================

const COMPAT_LEVEL_SCORES: Record<string, number> = {
  best: 92,
  good: 78,
  neutral: 62,
  challenging: 45,
};

function calculateLastLoverScore(
  compat: LastLoverCompatEntry | null
): number {
  if (!compat) return 65;
  return COMPAT_LEVEL_SCORES[compat.compatibilityLevel] || 65;
}

// ============================================================
// 1g. 動的重み付け統合
// ============================================================

const BASE_WEIGHTS: Record<string, number> = {
  big5: 0.35,
  mbti: 0.25,
  enneagram: 0.15,
  lastLover: 0.1,
  context: 0.15,
};

interface ScoredComponents {
  mbti?: number;
  big5?: number;
  enneagram?: number;
  lastLover?: number;
}

function integrateScores(components: ScoredComponents): number {
  const available: { key: string; score: number; weight: number }[] = [];

  if (components.mbti !== undefined) {
    available.push({ key: "mbti", score: components.mbti, weight: BASE_WEIGHTS.mbti });
  }
  if (components.big5 !== undefined) {
    available.push({ key: "big5", score: components.big5, weight: BASE_WEIGHTS.big5 });
  }
  if (components.enneagram !== undefined) {
    available.push({
      key: "enneagram",
      score: components.enneagram,
      weight: BASE_WEIGHTS.enneagram,
    });
  }
  if (components.lastLover !== undefined) {
    available.push({
      key: "lastLover",
      score: components.lastLover,
      weight: BASE_WEIGHTS.lastLover,
    });
  }

  if (available.length === 0) return 65; // テストなし

  // 利用可能テストの重みを正規化
  const totalWeight = available.reduce((sum, a) => sum + a.weight, 0);
  let score = available.reduce(
    (sum, a) => sum + a.score * (a.weight / totalWeight),
    0
  );

  // 2テスト以上: 一貫性ボーナス（分散が小さいほど +最大5点）
  if (available.length >= 2) {
    const mean =
      available.reduce((s, a) => s + a.score, 0) / available.length;
    const variance =
      available.reduce((s, a) => s + (a.score - mean) ** 2, 0) /
      available.length;
    const stdDev = Math.sqrt(variance);
    // stdDev 0→+5, stdDev 20+→+0
    const consistencyBonus = Math.max(0, 5 * (1 - stdDev / 20));
    score += consistencyBonus;
  }

  return clamp(Math.round(score), 0, 100);
}

// ============================================================
// 1h. 5次元分析
// ============================================================

function calculateDimensions(
  u1: UserTestData,
  u2: UserTestData
): { category: string; description: string; score: number }[] {
  const dimensions: { category: string; description: string; score: number }[] =
    [];

  const p1 = u1.big5
    ? normalizePercentiles(u1.big5.percentiles)
    : ({} as Record<string, number>);
  const p2 = u2.big5
    ? normalizePercentiles(u2.big5.percentiles)
    : ({} as Record<string, number>);

  const hasBig5 = u1.big5 && u2.big5;
  const hasMbti = u1.mbti && u2.mbti;

  // コミュニケーション: BIG5(E,A), MBTI(T/F)
  {
    let score = 50;
    let factors = 0;
    if (hasBig5 && p1.E !== undefined && p2.E !== undefined) {
      const eDiff = Math.abs(p1.E - p2.E);
      score += eDiff <= 30 ? 15 : eDiff <= 50 ? 5 : -10;
      factors++;
    }
    if (
      hasBig5 &&
      p1.A !== undefined &&
      p2.A !== undefined
    ) {
      const avgA = (p1.A + p2.A) / 2;
      score += avgA > 60 ? 15 : avgA > 40 ? 5 : -5;
      factors++;
    }
    if (hasMbti) {
      const tf1 = u1.mbti!.resultType[2]; // T or F
      const tf2 = u2.mbti!.resultType[2];
      score += tf1 === tf2 ? 10 : -5;
      factors++;
    }
    if (factors > 0) {
      dimensions.push({
        category: "コミュニケーション",
        description: "日常的な会話や意思疎通のしやすさ",
        score: clamp(score, 0, 100),
      });
    }
  }

  // 感情的つながり: BIG5(N,A), Enneagram
  {
    let score = 50;
    let factors = 0;
    if (
      hasBig5 &&
      p1.N !== undefined &&
      p2.N !== undefined
    ) {
      const avgN = (p1.N + p2.N) / 2;
      score += (100 - avgN) * 0.3 - 15; // 低N = 良い
      factors++;
    }
    if (
      hasBig5 &&
      p1.A !== undefined &&
      p2.A !== undefined
    ) {
      const avgA = (p1.A + p2.A) / 2;
      score += avgA * 0.3 - 15;
      factors++;
    }
    if (u1.enneagram && u2.enneagram) {
      const eScore = calculateEnneagramScore(
        u1.enneagram.resultType,
        u2.enneagram.resultType
      );
      score += (eScore - 65) * 0.3;
      factors++;
    }
    if (factors > 0) {
      dimensions.push({
        category: "感情的つながり",
        description: "共感力と感情面での絆の深さ",
        score: clamp(Math.round(score), 0, 100),
      });
    }
  }

  // 成長可能性: MBTI認知機能, BIG5(O)
  {
    let score = 50;
    let factors = 0;
    if (hasMbti) {
      const f1 = COGNITIVE_FUNCTIONS[u1.mbti!.resultType];
      const f2 = COGNITIVE_FUNCTIONS[u2.mbti!.resultType];
      if (f1 && f2) {
        // 異なる dominant = 補完 = 高い成長可能性
        if (f1[0] !== f2[0]) score += 12;
        // auxiliary の共有 = 共通基盤
        if (f1[1] === f2[1]) score += 8;
        factors++;
      }
    }
    if (
      hasBig5 &&
      p1.O !== undefined &&
      p2.O !== undefined
    ) {
      const similarity = 100 - Math.abs(p1.O - p2.O);
      score += (similarity - 50) * 0.3;
      factors++;
    }
    if (factors > 0) {
      dimensions.push({
        category: "成長可能性",
        description: "互いに刺激し合い成長できる度合い",
        score: clamp(Math.round(score), 0, 100),
      });
    }
  }

  // 衝突対応: BIG5(A,N,C)
  {
    if (
      hasBig5 &&
      p1.A !== undefined &&
      p2.A !== undefined &&
      p1.N !== undefined &&
      p2.N !== undefined &&
      p1.C !== undefined &&
      p2.C !== undefined
    ) {
      const minA = Math.min(p1.A, p2.A);
      const maxN = Math.max(p1.N, p2.N);
      const cSimilarity = 100 - Math.abs(p1.C - p2.C);
      const score =
        minA * 0.5 + (100 - maxN) * 0.3 + cSimilarity * 0.2;
      dimensions.push({
        category: "衝突対応",
        description: "意見の対立時の解決力と協調性",
        score: clamp(Math.round(score), 0, 100),
      });
    }
  }

  // ライフスタイル: BIG5(C,O), MBTI(J/P)
  {
    let score = 50;
    let factors = 0;
    if (
      hasBig5 &&
      p1.C !== undefined &&
      p2.C !== undefined
    ) {
      const cDiffInv = 100 - Math.abs(p1.C - p2.C);
      score += (cDiffInv - 50) * 0.3;
      factors++;
    }
    if (
      hasBig5 &&
      p1.O !== undefined &&
      p2.O !== undefined
    ) {
      const oDiffInv = 100 - Math.abs(p1.O - p2.O);
      score += (oDiffInv - 50) * 0.2;
      factors++;
    }
    if (hasMbti) {
      const jp1 = u1.mbti!.resultType[3]; // J or P
      const jp2 = u2.mbti!.resultType[3];
      score += jp1 === jp2 ? 10 : -3;
      factors++;
    }
    if (factors > 0) {
      dimensions.push({
        category: "ライフスタイル",
        description: "生活リズムや価値観の一致度",
        score: clamp(Math.round(score), 0, 100),
      });
    }
  }

  // データ不足分を中立値で補完
  const requiredCategories = [
    "コミュニケーション",
    "感情的つながり",
    "成長可能性",
    "衝突対応",
    "ライフスタイル",
  ];
  const existingCategories = new Set(dimensions.map((d) => d.category));
  for (const cat of requiredCategories) {
    if (!existingCategories.has(cat)) {
      dimensions.push({
        category: cat,
        description: getDefaultDescription(cat),
        score: 50,
      });
    }
  }

  return dimensions;
}

function getDefaultDescription(category: string): string {
  const descriptions: Record<string, string> = {
    コミュニケーション: "日常的な会話や意思疎通のしやすさ",
    感情的つながり: "共感力と感情面での絆の深さ",
    成長可能性: "互いに刺激し合い成長できる度合い",
    衝突対応: "意見の対立時の解決力と協調性",
    ライフスタイル: "生活リズムや価値観の一致度",
  };
  return descriptions[category] || "";
}

// ============================================================
// 1i. パーソナライズドテキスト生成
// ============================================================

interface TextTemplate {
  condition: (u1: UserTestData, u2: UserTestData, compat: LastLoverCompatEntry | null) => boolean;
  text: (u1: UserTestData, u2: UserTestData, compat: LastLoverCompatEntry | null) => string;
}

const STRENGTH_TEMPLATES: TextTemplate[] = [
  // BIG5 A両方高い
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      return (p1.A || 0) > 65 && (p2.A || 0) > 65;
    },
    text: () => "協調性が高く、衝突を自然に回避できる関係です",
  },
  // MBTI N/N同士
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[1] === "N" &&
      u2.mbti.resultType[1] === "N",
    text: () => "抽象的なビジョンや将来の可能性を共有しやすい直感型同士です",
  },
  // MBTI S/S同士
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[1] === "S" &&
      u2.mbti.resultType[1] === "S",
    text: () => "現実的で実用的なアプローチを共有できる感覚型同士です",
  },
  // BIG5 E差15-40
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      if (p1.E === undefined || p2.E === undefined) return false;
      const diff = Math.abs(p1.E - p2.E);
      return diff >= 15 && diff <= 40;
    },
    text: () => "外向性のバランスが取れており、会話リズムが心地よいペアです",
  },
  // エニアグラム成長ライン
  {
    condition: (u1, u2) => {
      if (!u1.enneagram || !u2.enneagram) return false;
      const t1 = parseEnneagramType(u1.enneagram.resultType);
      const t2 = parseEnneagramType(u2.enneagram.resultType);
      return GROWTH_LINES[t1] === t2 || GROWTH_LINES[t2] === t1;
    },
    text: (u1, u2) => {
      const t1 = u1.enneagram ? parseEnneagramType(u1.enneagram.resultType) : 0;
      const t2 = u2.enneagram ? parseEnneagramType(u2.enneagram.resultType) : 0;
      return `エニアグラムの成長ライン（タイプ${t1}↔タイプ${t2}）で結ばれた関係で、互いの成長を自然に促し合えます`;
    },
  },
  // Last Lover best/good
  {
    condition: (_, __, compat) =>
      compat !== null &&
      (compat.compatibilityLevel === "best" ||
        compat.compatibilityLevel === "good"),
    text: (_, __, compat) =>
      compat?.reason || "恋愛診断から見ても相性の良い組み合わせです",
  },
  // BIG5 C両方高い
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      return (p1.C || 0) > 65 && (p2.C || 0) > 65;
    },
    text: () => "計画性と責任感を共有しており、信頼関係を築きやすい組み合わせです",
  },
  // BIG5 O両方高い
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      return (p1.O || 0) > 65 && (p2.O || 0) > 65;
    },
    text: () => "知的好奇心が旺盛で、新しい体験を一緒に楽しめるペアです",
  },
  // MBTI F/F同士
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[2] === "F" &&
      u2.mbti.resultType[2] === "F",
    text: () => "感情面での共感力が高く、お互いの気持ちを自然に理解できます",
  },
  // BIG5 N両方低い
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      return (p1.N || 50) < 35 && (p2.N || 50) < 35;
    },
    text: () => "感情的に安定しており、穏やかな関係を維持しやすいペアです",
  },
];

const CHALLENGE_TEMPLATES: TextTemplate[] = [
  // BIG5 N両方高い
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      return (p1.N || 0) > 65 && (p2.N || 0) > 65;
    },
    text: () =>
      "感情の波が重なりやすく、ストレスが増幅されることがあるかもしれません",
  },
  // MBTI T/F不一致
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[2] !== u2.mbti.resultType[2],
    text: (u1, u2) => {
      const t1 = u1.mbti!.resultType[2] === "T" ? "論理" : "感情";
      const t2 = u2.mbti!.resultType[2] === "T" ? "論理" : "感情";
      return `${t1}型と${t2}型の判断基準の違いから、すれ違いが生まれることがあります`;
    },
  },
  // BIG5 C差大
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      if (p1.C === undefined || p2.C === undefined) return false;
      return Math.abs(p1.C - p2.C) > 40;
    },
    text: () => "計画性のギャップがあり、段取りや準備についてストレスを感じることも",
  },
  // Last Lover challenging
  {
    condition: (_, __, compat) =>
      compat !== null && compat.compatibilityLevel === "challenging",
    text: (_, __, compat) =>
      compat?.reason || "恋愛スタイルの違いからチャレンジがあるかもしれません",
  },
  // MBTI J/P不一致
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[3] !== u2.mbti.resultType[3],
    text: () =>
      "計画重視と柔軟重視のスタイル差から、生活リズムの調整が必要です",
  },
  // BIG5 E差大
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      if (p1.E === undefined || p2.E === undefined) return false;
      return Math.abs(p1.E - p2.E) > 50;
    },
    text: () =>
      "社交性の大きな差があり、交友関係や休日の過ごし方でズレが生じやすいです",
  },
  // エニアグラム ストレスライン
  {
    condition: (u1, u2) => {
      if (!u1.enneagram || !u2.enneagram) return false;
      const t1 = parseEnneagramType(u1.enneagram.resultType);
      const t2 = parseEnneagramType(u2.enneagram.resultType);
      return STRESS_LINES[t1] === t2 || STRESS_LINES[t2] === t1;
    },
    text: () =>
      "ストレスラインで繋がった関係は強い化学反応がある反面、緊張も生まれやすいです",
  },
];

const RECOMMENDATION_TEMPLATES: TextTemplate[] = [
  // BIG5 N高い時の対処
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      return (p1.N || 0) > 60 || (p2.N || 0) > 60;
    },
    text: () =>
      "感情的になった時は一度距離を置き、落ち着いてから話し合うことを心がけましょう",
  },
  // MBTI T/F不一致時
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[2] !== u2.mbti.resultType[2],
    text: () =>
      "意思決定の際は、論理面と感情面の両方を意識的に確認し合いましょう",
  },
  // BIG5 C差大時
  {
    condition: (u1, u2) => {
      if (!u1.big5 || !u2.big5) return false;
      const p1 = normalizePercentiles(u1.big5.percentiles);
      const p2 = normalizePercentiles(u2.big5.percentiles);
      if (p1.C === undefined || p2.C === undefined) return false;
      return Math.abs(p1.C - p2.C) > 30;
    },
    text: () =>
      "大切な予定や目標については事前にすり合わせ、お互いのペースを尊重しましょう",
  },
  // Last Lover advice
  {
    condition: (_, __, compat) =>
      compat !== null && compat.advice !== undefined && compat.advice !== "",
    text: (_, __, compat) => compat!.advice!,
  },
  // エニアグラム成長方向アドバイス
  {
    condition: (u1, u2) => !!u1.enneagram && !!u2.enneagram,
    text: (u1, u2) => {
      const t1 = parseEnneagramType(u1.enneagram!.resultType);
      const t2 = parseEnneagramType(u2.enneagram!.resultType);
      const growth1 = GROWTH_LINES[t1];
      const growth2 = GROWTH_LINES[t2];
      return `タイプ${t1}はタイプ${growth1}の良さを、タイプ${t2}はタイプ${growth2}の良さを取り入れることで、関係がさらに深まります`;
    },
  },
  // MBTI E/I不一致
  {
    condition: (u1, u2) =>
      !!u1.mbti &&
      !!u2.mbti &&
      u1.mbti.resultType[0] !== u2.mbti.resultType[0],
    text: () =>
      "一人の時間と一緒の時間のバランスを話し合い、お互いのエネルギー充電方法を尊重しましょう",
  },
  // デフォルト
  {
    condition: () => true,
    text: () => "定期的にお互いの気持ちや考えを共有する時間を作りましょう",
  },
  {
    condition: () => true,
    text: () => "違いを「欠点」ではなく「補い合える強み」として捉えることが大切です",
  },
];

function generateTexts(
  u1: UserTestData,
  u2: UserTestData,
  compat: LastLoverCompatEntry | null
): { strengths: string[]; challenges: string[]; recommendations: string[] } {
  const strengths = STRENGTH_TEMPLATES.filter((t) =>
    t.condition(u1, u2, compat)
  )
    .map((t) => t.text(u1, u2, compat))
    .slice(0, 5);

  const challenges = CHALLENGE_TEMPLATES.filter((t) =>
    t.condition(u1, u2, compat)
  )
    .map((t) => t.text(u1, u2, compat))
    .slice(0, 4);

  const recommendations = RECOMMENDATION_TEMPLATES.filter((t) =>
    t.condition(u1, u2, compat)
  )
    .map((t) => t.text(u1, u2, compat))
    .slice(0, 5);

  // 最低1件は確保
  if (strengths.length === 0) {
    strengths.push("お互いの個性を尊重し合える関係を築けます");
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "定期的にお互いの気持ちや考えを共有する時間を作りましょう"
    );
  }

  return { strengths, challenges, recommendations };
}

// ============================================================
// 1j. メイン統合関数
// ============================================================

export function computeCompatibility(
  user1Name: string,
  user2Name: string,
  user1Data: UserTestData,
  user2Data: UserTestData,
  lastLoverCompat: LastLoverCompatEntry | null
): CompatibilityResult {
  const components: ScoredComponents = {};
  const detailInsights: { category: string; description: string; score: number }[] = [];

  // テスト数カウント
  let testCount = 0;

  // MBTI
  if (user1Data.mbti && user2Data.mbti) {
    const mbtiScore = calculateMbtiScore(
      user1Data.mbti.resultType,
      user2Data.mbti.resultType
    );
    components.mbti = mbtiScore;
    detailInsights.push({
      category: "性格タイプ (MBTI)",
      description: `${user1Data.mbti.resultType} × ${user2Data.mbti.resultType}`,
      score: mbtiScore,
    });
    testCount++;
  }

  // BIG5
  if (user1Data.big5 && user2Data.big5) {
    const big5Score = calculateBig5Score(
      user1Data.big5.percentiles,
      user2Data.big5.percentiles
    );
    components.big5 = big5Score;
    detailInsights.push({
      category: "パーソナリティ (BIG5)",
      description: "5因子パーソナリティの相性",
      score: big5Score,
    });
    testCount++;
  }

  // エニアグラム
  if (user1Data.enneagram && user2Data.enneagram) {
    const enneaScore = calculateEnneagramScore(
      user1Data.enneagram.resultType,
      user2Data.enneagram.resultType
    );
    components.enneagram = enneaScore;
    detailInsights.push({
      category: "エニアグラム",
      description: `${user1Data.enneagram.resultType} × ${user2Data.enneagram.resultType}`,
      score: enneaScore,
    });
    testCount++;
  }

  // Last Lover
  if (user1Data.lastLover && user2Data.lastLover) {
    const llScore = calculateLastLoverScore(lastLoverCompat);
    components.lastLover = llScore;
    detailInsights.push({
      category: "恋愛スタイル",
      description: `${user1Data.lastLover.resultType} × ${user2Data.lastLover.resultType}`,
      score: llScore,
    });
    testCount++;
  }

  // 総合スコア
  const overallCompatibility = integrateScores(components);

  // 5次元分析
  const dimensionInsights = calculateDimensions(user1Data, user2Data);

  // 全insightsを統合
  const insights = [...detailInsights, ...dimensionInsights];

  // パーソナライズドテキスト
  const texts = generateTexts(user1Data, user2Data, lastLoverCompat);

  // テスト不足時のフォールバック
  if (testCount === 0) {
    texts.recommendations.unshift(
      "診断テストを受けると、より正確な相性分析ができます"
    );
  }

  // 相性レベルと表示タイトル
  let compatibilityLevel: string;
  let title: string;
  if (overallCompatibility >= 85) {
    compatibilityLevel = "best";
    title = "✨ 最高の相性！";
  } else if (overallCompatibility >= 70) {
    compatibilityLevel = "good";
    title = "💫 良い相性";
  } else if (overallCompatibility >= 55) {
    compatibilityLevel = "neutral";
    title = "🌟 普通の相性";
  } else {
    compatibilityLevel = "challenging";
    title = "💪 挑戦的な相性";
  }

  const name1 = user1Name || "あなた";
  const name2 = user2Name || "友達";

  return {
    overallCompatibility,
    compatibilityLevel,
    title,
    summary: `${name1}と${name2}の相性は${overallCompatibility}%です`,
    strengths: texts.strengths,
    challenges: texts.challenges,
    recommendations: texts.recommendations,
    insights,
  };
}
