# Technical Design: 診断テストシステム

## Overview
汎用的な診断テストの基盤システムの技術設計。
シンプルな構造で、様々なタイプ診断を統一的に扱えるアーキテクチャ。

---

## Architecture

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile App (Expo)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ TestList     │  │ TestScreen   │  │ TestResult   │      │
│  │ Screen       │→ │ (診断実行)   │→ │ Screen       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                 │                │
│         └─────────────────┴─────────────────┘                │
│                           │                                  │
│                    Convex Hooks                              │
│              (useQuery, useMutation)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Convex Backend                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │                    Functions                        │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │    │
│  │  │ tests.ts │  │answers.ts│  │ results.ts   │     │    │
│  │  │ - list   │  │ - save   │  │ - calculate  │     │    │
│  │  │ - get    │  │ - get    │  │ - save       │     │    │
│  │  │          │  │ - clear  │  │ - list       │     │    │
│  │  └──────────┘  └──────────┘  └──────────────┘     │    │
│  └────────────────────────────────────────────────────┘    │
│                           │                                  │
│  ┌────────────────────────▼───────────────────────────┐    │
│  │                   Database                          │    │
│  │  ┌─────────┐  ┌────────────┐  ┌──────────────┐    │    │
│  │  │  tests  │  │testAnswers │  │ testResults  │    │    │
│  │  └─────────┘  └────────────┘  └──────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Convex Schema定義

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 既存のusersテーブル
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    userId: v.optional(v.string()),
    mbti: v.optional(v.string()),
    birthday: v.optional(v.string()),
    gender: v.optional(v.string()),
    bio: v.optional(v.string()),
    occupation: v.optional(v.string()),
    pushToken: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"])
    .index("by_user_id", ["userId"]),

  // テスト定義テーブル
  tests: defineTable({
    slug: v.string(),                    // "mbti-simple"
    title: v.string(),                   // "MBTI診断（簡易版）"
    description: v.string(),             // "5問で分かるあなたの性格タイプ"
    category: v.string(),                // "personality" | "career" | "relationship"
    questionCount: v.number(),           // 5
    estimatedMinutes: v.number(),        // 3
    scoringType: v.string(),             // "dimension" | "single"
    resultField: v.optional(v.string()), // "mbti" - usersテーブルの保存先
    icon: v.string(),                    // "brain" | "briefcase" | "heart"
    gradientStart: v.string(),           // "#8b5cf6"
    gradientEnd: v.string(),             // "#2563eb"
    isActive: v.boolean(),               // true
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // 質問テーブル（テストに紐づく）
  testQuestions: defineTable({
    testId: v.id("tests"),
    order: v.number(),                   // 1, 2, 3...
    questionText: v.string(),            // "あなたはパーティーで..."
    options: v.array(v.object({
      value: v.string(),                 // "A" | "B" | "E" | "I"
      label: v.string(),                 // "多くの人と話す"
      // スコア加算情報
      scoreKey: v.optional(v.string()),  // "EI" (dimension) or "type1" (single)
      scoreValue: v.optional(v.union(v.string(), v.number())),
      // dimension: "E" or "I"
      // single: 1 (加算値)
    })),
  })
    .index("by_test", ["testId"])
    .index("by_test_order", ["testId", "order"]),

  // 回答一時保存テーブル（進行中の診断）
  testAnswers: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    answers: v.array(v.object({
      questionOrder: v.number(),
      selectedValue: v.string(),
    })),
    startedAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_test", ["userId", "testId"]),

  // 診断結果テーブル
  testResults: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    resultType: v.string(),              // "ENFP" | "タイプ1" | "リーダー型"
    scores: v.any(),                     // { E: 3, I: 2, ... } or { type1: 5, type2: 3, ... }
    analysis: v.optional(v.object({
      summary: v.string(),               // 一行説明
      description: v.string(),           // 詳細説明
      strengths: v.array(v.string()),    // 強み
      weaknesses: v.array(v.string()),   // 弱み
      recommendations: v.array(v.string()), // アドバイス
    })),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_test", ["userId", "testId"])
    .index("by_completed", ["completedAt"]),
});
```

---

## API Design

### Tests API (`convex/tests.ts`)

```typescript
// テスト一覧取得
export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("tests").withIndex("by_active");
    const tests = await q.filter((q) => q.eq(q.field("isActive"), true)).collect();

    if (args.category) {
      return tests.filter((t) => t.category === args.category);
    }
    return tests;
  },
});

// テスト詳細取得（質問含む）
export const getWithQuestions = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!test) return null;

    const questions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test_order", (q) => q.eq("testId", test._id))
      .collect();

    return { test, questions: questions.sort((a, b) => a.order - b.order) };
  },
});
```

### Answers API (`convex/testAnswers.ts`)

```typescript
// 回答を保存（中断再開対応）
export const saveProgress = mutation({
  args: {
    testId: v.id("tests"),
    answers: v.array(v.object({
      questionOrder: v.number(),
      selectedValue: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) throw new Error("ユーザーが見つかりません");

    const existing = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        answers: args.answers,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("testAnswers", {
      userId: user._id,
      testId: args.testId,
      answers: args.answers,
      startedAt: now,
      updatedAt: now,
    });
  },
});

// 進行中の回答を取得
export const getProgress = query({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return null;

    return await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();
  },
});

// 回答を削除（診断完了後）
export const clearProgress = mutation({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) return;

    const progress = await ctx.db
      .query("testAnswers")
      .withIndex("by_user_test", (q) =>
        q.eq("userId", user._id).eq("testId", args.testId)
      )
      .unique();

    if (progress) {
      await ctx.db.delete(progress._id);
    }
  },
});
```

### Results API (`convex/testResults.ts`)

```typescript
// 結果を算出・保存
export const calculate = mutation({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");

    const user = await getUserByToken(ctx, identity.tokenIdentifier);
    if (!user) throw new Error("ユーザーが見つかりません");

    // テストと質問を取得
    const test = await ctx.db.get(args.testId);
    if (!test) throw new Error("テストが見つかりません");

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

    if (!progress) throw new Error("回答が見つかりません");

    // スコア計算
    const { resultType, scores } = calculateScores(
      test.scoringType,
      questions,
      progress.answers
    );

    // 結果を保存
    const resultId = await ctx.db.insert("testResults", {
      userId: user._id,
      testId: args.testId,
      resultType,
      scores,
      analysis: getAnalysis(test.slug, resultType),
      completedAt: Date.now(),
    });

    // ユーザーのプロフィールに反映
    if (test.resultField) {
      await ctx.db.patch(user._id, {
        [test.resultField]: resultType,
        updatedAt: Date.now(),
      });
    }

    // 進行中データを削除
    await ctx.db.delete(progress._id);

    return resultId;
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

    // テスト情報も含めて返す
    return Promise.all(
      results.map(async (result) => {
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
```

---

## Score Calculation

### スコア算出ロジック

```typescript
// lib/scoreCalculation.ts

interface Question {
  order: number;
  options: Array<{
    value: string;
    scoreKey?: string;
    scoreValue?: string | number;
  }>;
}

interface Answer {
  questionOrder: number;
  selectedValue: string;
}

export function calculateScores(
  scoringType: string,
  questions: Question[],
  answers: Answer[]
): { resultType: string; scores: Record<string, any> } {

  if (scoringType === "dimension") {
    return calculateDimensionScores(questions, answers);
  } else {
    return calculateSingleScores(questions, answers);
  }
}

// MBTI形式（次元別スコア）
function calculateDimensionScores(
  questions: Question[],
  answers: Answer[]
): { resultType: string; scores: Record<string, number> } {
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const option = question.options.find((o) => o.value === answer.selectedValue);
    if (!option || !option.scoreKey || !option.scoreValue) continue;

    const key = option.scoreKey; // e.g., "EI"
    const value = option.scoreValue as string; // e.g., "E" or "I"

    scores[value] = (scores[value] || 0) + 1;
  }

  // MBTIの場合: E/I, S/N, T/F, J/Pの勝者を決定
  const resultType = [
    scores["E"] >= (scores["I"] || 0) ? "E" : "I",
    scores["S"] >= (scores["N"] || 0) ? "S" : "N",
    scores["T"] >= (scores["F"] || 0) ? "T" : "F",
    scores["J"] >= (scores["P"] || 0) ? "J" : "P",
  ].join("");

  return { resultType, scores };
}

// エニアグラム形式（最高スコアタイプ）
function calculateSingleScores(
  questions: Question[],
  answers: Answer[]
): { resultType: string; scores: Record<string, number> } {
  const scores: Record<string, number> = {};

  for (const answer of answers) {
    const question = questions.find((q) => q.order === answer.questionOrder);
    if (!question) continue;

    const option = question.options.find((o) => o.value === answer.selectedValue);
    if (!option || !option.scoreKey) continue;

    const key = option.scoreKey; // e.g., "type1"
    const value = (option.scoreValue as number) || 1;

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
```

---

## Analysis Data

### 結果分析データ構造

```typescript
// data/testAnalysis.ts

export const MBTI_ANALYSIS: Record<string, Analysis> = {
  ENFP: {
    summary: "情熱的なキャンペーナー",
    description: "ENFPは創造的で熱意に溢れた性格タイプです。新しいアイデアを探求し、人々とつながることを楽しみます。",
    strengths: ["創造性が高い", "コミュニケーション能力", "適応力がある", "エネルギッシュ"],
    weaknesses: ["細部を見落としがち", "計画性に欠ける", "感情的になりやすい"],
    recommendations: [
      "ルーティンを作って集中力を維持しましょう",
      "大きなプロジェクトは小さなタスクに分けましょう",
      "定期的に一人の時間を取りましょう"
    ],
  },
  INTJ: {
    summary: "戦略的な設計者",
    description: "INTJは分析的で戦略的な思考を持つ性格タイプです。長期的なビジョンを持ち、効率的に目標を達成します。",
    strengths: ["戦略的思考", "独立心が強い", "高い基準を持つ", "論理的"],
    weaknesses: ["感情表現が苦手", "完璧主義", "他者に厳しい"],
    recommendations: [
      "チームワークの価値を認識しましょう",
      "感情面でのフィードバックも大切にしましょう",
      "時には「十分良い」で満足することも大切です"
    ],
  },
  // ... 他の16タイプ
};

export const ENNEAGRAM_ANALYSIS: Record<string, Analysis> = {
  type1: {
    summary: "改革者",
    description: "タイプ1は原理原則を重んじ、物事を正しく行うことに情熱を持っています。",
    strengths: ["誠実", "責任感が強い", "向上心がある"],
    weaknesses: ["批判的になりがち", "自分に厳しすぎる"],
    recommendations: ["自分を許すことを学びましょう"],
  },
  // ... 他の9タイプ
};

export const CAREER_ANALYSIS: Record<string, Analysis> = {
  leader: {
    summary: "リーダー型",
    description: "チームを率いて目標を達成することに長けています。",
    strengths: ["決断力", "ビジョン構築", "人を動かす力"],
    weaknesses: ["細部を任せがち", "ワンマンになりやすい"],
    recommendations: ["メンバーの意見も取り入れましょう"],
  },
  // ... 他のタイプ
};
```

---

## UI Components

### 画面フロー

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  TestList    │────▶│  TestScreen  │────▶│ TestResult   │
│  Screen      │     │  (質問表示)   │     │  Screen      │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       │                    │                    ▼
       │                    │            ┌──────────────┐
       │                    │            │  TestHistory │
       │                    │            │  Screen      │
       │                    │            └──────────────┘
       │                    │
       ▼                    ▼
  テスト選択         進捗バー表示
  カテゴリフィルタ   前へ/次へ
  進捗表示          中断確認
```

### コンポーネント構成

```typescript
// components/TestListScreen.tsx
// - テスト一覧表示
// - カテゴリタブ
// - 各テストの進捗状態

// components/TestScreen.tsx
// - 質問カード表示
// - 選択肢ボタン
// - 進捗バー
// - ナビゲーション（前へ/次へ）

// components/TestResultScreen.tsx
// - 結果タイプ表示
// - スコアグラフ
// - 詳細説明
// - シェア/保存ボタン

// components/TestHistoryScreen.tsx
// - 過去の診断履歴
// - フィルタリング
// - 詳細への導線
```

---

## Security

### 認証・認可

```typescript
// すべてのmutation/queryで認証チェック
const identity = await ctx.auth.getUserIdentity();
if (!identity) {
  throw new Error("認証が必要です");
}

// ユーザーは自分のデータのみアクセス可能
const user = await getUserByToken(ctx, identity.tokenIdentifier);
if (!user) {
  throw new Error("ユーザーが見つかりません");
}
```

### データアクセス制限

- ユーザーは自分の回答・結果のみ参照可能
- テスト定義は全ユーザーが参照可能（読み取り専用）
- 管理者のみテスト定義の作成・更新可能（将来実装）

---

## Error Handling

### エラーパターン

```typescript
// エラータイプ
type DiagnosisError =
  | "AUTHENTICATION_REQUIRED"
  | "USER_NOT_FOUND"
  | "TEST_NOT_FOUND"
  | "QUESTION_NOT_FOUND"
  | "ANSWER_NOT_FOUND"
  | "INCOMPLETE_ANSWERS";

// フロントエンドでのハンドリング
try {
  await calculateResult({ testId });
} catch (error) {
  if (error.message.includes("認証")) {
    // ログイン画面へ
  } else if (error.message.includes("回答")) {
    // 診断画面へ戻る
  }
  toast.error("エラーが発生しました");
}
```

---

## Performance

### 最適化ポイント

1. **インデックス活用**: `by_user_test`等のコンポジットインデックス
2. **クエリ最適化**: 必要なフィールドのみ取得
3. **キャッシュ**: Convexの自動キャッシュ活用
4. **リアルタイム更新**: useQueryでの自動再取得

### 想定データ量

- テスト定義: 10-50件（静的）
- 質問: 50-500件（テスト×質問数）
- ユーザー回答: ユーザー数×進行中診断（通常1件）
- 結果: ユーザー数×診断履歴（無制限）

---

## Migration Strategy

### Phase 1: スキーマ追加
```bash
npx convex dev  # 新テーブル自動作成
```

### Phase 2: 初期データ投入
```typescript
// convex/seedData.ts - 開発用
// MBTIテストと5問の質問を投入
```

### Phase 3: UI実装
- TestListScreen
- TestScreen
- TestResultScreen

### Phase 4: 統合テスト
- 診断フロー完走確認
- 結果保存確認
- 履歴表示確認
