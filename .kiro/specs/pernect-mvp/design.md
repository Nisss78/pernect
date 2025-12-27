# Technical Design: Pernect MVP

## Overview
このドキュメントはPernect MVPの技術設計を定義します。
requirements.mdで定義された要件を実現するためのアーキテクチャ、データモデル、API設計を記述します。

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Application (Expo)                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Screens    │  │  Components  │  │    Hooks     │      │
│  │              │  │              │  │              │      │
│  │ - Home       │  │ - TestCard   │  │ - useTest    │      │
│  │ - Profile    │  │ - Question   │  │ - useResult  │      │
│  │ - Test       │  │ - Result     │  │ - useChat    │      │
│  │ - AIChat     │  │ - Chat       │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │   Convex    │                          │
│                    │   React     │                          │
│                    │   Hooks     │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTPS (Real-time WebSocket)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Convex Backend (BaaS)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Queries    │  │  Mutations   │  │   Actions    │      │
│  │              │  │              │  │              │      │
│  │ - getTests   │  │ - saveAnswer │  │ - analyzeAI  │      │
│  │ - getResults │  │ - submitTest │  │ - sendChat   │      │
│  │ - getHistory │  │ - updateUser │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  Database   │                          │
│                    │  (Tables)   │                          │
│                    └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Clerk   │  │  OpenAI  │  │  Stripe  │                  │
│  │  (Auth)  │  │  (AI)    │  │(Payment) │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Database Design

### Schema Definition

```typescript
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ユーザーテーブル（既存）
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    pushToken: v.optional(v.string()),
    userId: v.optional(v.string()),
    mbti: v.optional(v.string()),
    birthday: v.optional(v.string()),
    gender: v.optional(v.string()),
    bio: v.optional(v.string()),
    occupation: v.optional(v.string()),
    subscriptionPlan: v.optional(v.string()), // "free" | "plus" | "pro" | "max"
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_userId", ["userId"]),

  // 診断テスト定義テーブル（新規）
  tests: defineTable({
    slug: v.string(),                    // URLスラグ "mbti-test"
    title: v.string(),                   // "MBTI性格診断"
    description: v.string(),             // テストの説明
    category: v.string(),                // "personality" | "career" | "love" | "learning"
    duration: v.number(),                // 推定所要時間（分）
    questionCount: v.number(),           // 質問数
    isPremium: v.boolean(),              // プレミアム限定か
    gradientColors: v.array(v.string()), // グラデーション色
    icon: v.string(),                    // アイコン名
    rating: v.number(),                  // 評価（5点満点）
    completedCount: v.number(),          // 完了者数
    isActive: v.boolean(),               // 有効/無効
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]),

  // 診断質問テーブル（新規）
  testQuestions: defineTable({
    testId: v.id("tests"),
    order: v.number(),                   // 質問順序
    questionText: v.string(),            // 質問文
    questionType: v.string(),            // "scale" | "choice" | "multiple"
    options: v.optional(v.array(v.object({
      value: v.string(),
      label: v.string(),
      score: v.optional(v.object({       // MBTIスコア加算
        dimension: v.string(),           // "EI" | "SN" | "TF" | "JP"
        direction: v.string(),           // "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"
        weight: v.number(),              // スコア重み
      })),
    }))),
  })
    .index("by_test", ["testId"])
    .index("by_test_order", ["testId", "order"]),

  // ユーザー回答テーブル（新規）
  testAnswers: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    questionId: v.id("testQuestions"),
    answer: v.string(),                  // 選択した回答
    answeredAt: v.number(),
  })
    .index("by_user_test", ["userId", "testId"])
    .index("by_user_test_question", ["userId", "testId", "questionId"]),

  // 診断結果テーブル（新規）
  testResults: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    resultType: v.string(),              // "ENFP", "キャリアタイプA" など
    scores: v.object({                   // スコア詳細
      raw: v.any(),                      // 生スコア
      percentages: v.optional(v.any()),  // パーセンテージ
    }),
    analysis: v.object({
      summary: v.string(),               // 結果サマリー
      description: v.string(),           // 詳細説明
      strengths: v.array(v.string()),    // 強み
      weaknesses: v.array(v.string()),   // 弱み
      recommendations: v.array(v.string()), // アドバイス
    }),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_test", ["userId", "testId"])
    .index("by_completed", ["completedAt"]),

  // AIチャット履歴テーブル（新規）
  chatMessages: defineTable({
    userId: v.id("users"),
    role: v.string(),                    // "user" | "assistant"
    content: v.string(),
    metadata: v.optional(v.object({
      testResultId: v.optional(v.id("testResults")),
      topic: v.optional(v.string()),
    })),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  // 友達関係テーブル（新規）
  friendships: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
    status: v.string(),                  // "pending" | "accepted" | "blocked"
    compatibilityScore: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_friend", ["friendId"])
    .index("by_user_status", ["userId", "status"]),
});
```

### Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐
│     users     │       │     tests     │
├───────────────┤       ├───────────────┤
│ _id           │       │ _id           │
│ tokenIdentifier│      │ slug          │
│ email         │       │ title         │
│ name          │       │ category      │
│ userId        │       │ questionCount │
│ mbti          │       │ ...           │
│ ...           │       └───────┬───────┘
└───────┬───────┘               │
        │                       │ 1:N
        │                       ▼
        │               ┌───────────────┐
        │               │ testQuestions │
        │               ├───────────────┤
        │               │ _id           │
        │               │ testId        │
        │               │ order         │
        │               │ questionText  │
        │               │ options       │
        │               └───────────────┘
        │
        │ 1:N
        ▼
┌───────────────┐       ┌───────────────┐
│  testAnswers  │       │  testResults  │
├───────────────┤       ├───────────────┤
│ userId        │       │ userId        │
│ testId        │       │ testId        │
│ questionId    │       │ resultType    │
│ answer        │       │ scores        │
│ answeredAt    │       │ analysis      │
└───────────────┘       └───────────────┘
        │
        │ N:1
        ▼
┌───────────────┐       ┌───────────────┐
│ chatMessages  │       │  friendships  │
├───────────────┤       ├───────────────┤
│ userId        │       │ userId        │
│ role          │       │ friendId      │
│ content       │       │ status        │
│ metadata      │       │ compatibility │
└───────────────┘       └───────────────┘
```

---

## API Design

### Convex Functions

#### Tests Module (`convex/tests.ts`)

```typescript
// Query: テスト一覧取得
export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => { ... }
});

// Query: テスト詳細取得
export const get = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => { ... }
});

// Query: テストの質問取得
export const getQuestions = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => { ... }
});
```

#### TestAnswers Module (`convex/testAnswers.ts`)

```typescript
// Mutation: 回答を保存
export const save = mutation({
  args: {
    testId: v.id("tests"),
    questionId: v.id("testQuestions"),
    answer: v.string(),
  },
  handler: async (ctx, args) => { ... }
});

// Query: 進捗状況取得
export const getProgress = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => { ... }
});
```

#### TestResults Module (`convex/testResults.ts`)

```typescript
// Mutation: テスト結果を算出・保存
export const submit = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => { ... }
});

// Query: 結果一覧取得
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => { ... }
});

// Query: 結果詳細取得
export const get = query({
  args: { resultId: v.id("testResults") },
  handler: async (ctx, args) => { ... }
});
```

#### Chat Module (`convex/chat.ts`)

```typescript
// Action: AIにメッセージ送信（OpenAI連携）
export const sendMessage = action({
  args: { content: v.string() },
  handler: async (ctx, args) => { ... }
});

// Query: チャット履歴取得
export const getHistory = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => { ... }
});
```

---

## Component Design

### Screen Components

#### TestScreen (`components/TestScreen.tsx`)
テスト実行画面

```typescript
interface TestScreenProps {
  testSlug: string;
  onBack: () => void;
  onComplete: (resultId: string) => void;
}

// States:
// - loading: テスト/質問読み込み中
// - answering: 回答中
// - submitting: 結果算出中
// - completed: 完了
```

#### TestResultScreen (`components/TestResultScreen.tsx`)
テスト結果画面

```typescript
interface TestResultScreenProps {
  resultId: string;
  onBack: () => void;
  onShare: () => void;
}
```

### UI Components

#### QuestionCard (`components/QuestionCard.tsx`)
質問表示カード

```typescript
interface QuestionCardProps {
  question: Question;
  currentAnswer?: string;
  onAnswer: (answer: string) => void;
  progress: number; // 0-100
}
```

#### ProgressBar (`components/ProgressBar.tsx`)
進捗バー

```typescript
interface ProgressBarProps {
  current: number;
  total: number;
  colors?: [string, string];
}
```

---

## MBTI Calculation Algorithm

### Score Dimensions

```typescript
interface MBTIScores {
  EI: { E: number; I: number };  // Extraversion vs Introversion
  SN: { S: number; N: number };  // Sensing vs Intuition
  TF: { T: number; F: number };  // Thinking vs Feeling
  JP: { J: number; P: number };  // Judging vs Perceiving
}
```

### Calculation Flow

```
1. 各質問の回答からスコアを加算
2. 各次元で比較してパーセンテージ算出
3. 優勢な特性を組み合わせてタイプ決定
4. 結果をtestResultsに保存
5. usersテーブルのmbtiフィールドを更新
```

### Example

```typescript
function calculateMBTI(answers: Answer[]): MBTIResult {
  const scores: MBTIScores = { ... };

  // 回答からスコア集計
  for (const answer of answers) {
    const { dimension, direction, weight } = answer.score;
    scores[dimension][direction] += weight;
  }

  // パーセンテージ算出
  const percentages = {
    E: scores.EI.E / (scores.EI.E + scores.EI.I) * 100,
    // ... other dimensions
  };

  // タイプ決定
  const type = [
    percentages.E > 50 ? 'E' : 'I',
    percentages.S > 50 ? 'S' : 'N',
    percentages.T > 50 ? 'T' : 'F',
    percentages.J > 50 ? 'J' : 'P',
  ].join('');

  return { type, scores, percentages };
}
```

---

## Security Considerations

### Authentication
- すべてのConvex関数で`ctx.auth.getUserIdentity()`による認証チェック
- 未認証ユーザーはpublicデータのみアクセス可能

### Data Access Control
- ユーザーは自分のデータのみ読み書き可能
- 他ユーザーのデータは公開設定されたもののみ参照可能

### API Rate Limiting
- AIチャット: 1分あたり10リクエスト制限
- テスト回答: 1秒あたり5リクエスト制限

---

## Error Handling

### Error Types

```typescript
// カスタムエラークラス
class PernectError extends Error {
  code: string;
  statusCode: number;
}

// エラーコード
const ErrorCodes = {
  AUTH_REQUIRED: "認証が必要です",
  USER_NOT_FOUND: "ユーザーが見つかりません",
  TEST_NOT_FOUND: "テストが見つかりません",
  ALREADY_COMPLETED: "このテストは既に完了しています",
  PREMIUM_REQUIRED: "プレミアム会員限定の機能です",
  RATE_LIMIT_EXCEEDED: "リクエスト制限を超えました",
};
```

### Client-Side Error Handling

```typescript
try {
  await mutation(...);
} catch (error) {
  if (error.message.includes("AUTH_REQUIRED")) {
    // 認証画面へリダイレクト
  } else if (error.message.includes("PREMIUM_REQUIRED")) {
    // アップグレード案内を表示
  } else {
    // 一般的なエラーメッセージ
    Alert.alert("エラー", "問題が発生しました");
  }
}
```

---

## Testing Strategy

### Unit Tests
- MBTI算出アルゴリズム
- スコア計算ロジック
- ユーティリティ関数

### Integration Tests
- Convex関数の動作検証
- 認証フローのテスト

### E2E Tests
- テスト実行フロー
- 結果表示フロー
- プロフィール更新フロー

---

## Performance Optimization

### Database
- 適切なインデックス設定
- クエリの最適化（必要なフィールドのみ取得）

### Frontend
- React.memoによるコンポーネントの最適化
- 画像の遅延読み込み
- リストの仮想化（FlatList）

### Caching
- Convexの自動キャッシュ活用
- 静的データのローカルキャッシュ

---

## Deployment

### Environment Variables

```env
# Clerk
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...

# Convex
EXPO_PUBLIC_CONVEX_URL=https://...convex.cloud

# OpenAI (Convex環境変数)
OPENAI_API_KEY=sk-...
```

### Release Process

1. 開発環境でテスト
2. ステージング環境でQA
3. App Store / Google Play審査提出
4. 本番リリース
5. モニタリング開始
