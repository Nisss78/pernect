# MBTI性格診断（本格版60問）設計ドキュメント

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React Native)                   │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  TestScreen    │  │ TestResultScreen│                     │
│  │  (60問表示)    │  │  (結果表示)    │                     │
│  └───────┬────────┘  └───────┬────────┘                     │
│          │                    │                               │
│          └────────┬───────────┘                               │
│                   │                                           │
│          ┌───────▼────────┐                                  │
│          │    Hooks       │                                  │
│          │ useTestScreen  │                                  │
│          │ useTestResult  │                                  │
│          └───────┬────────┘                                  │
└──────────────────┼───────────────────────────────────────────┘
                   │
                   │ Convex Client
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Convex)                          │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │   tests.ts     │  │  scoring.ts    │                     │
│  │   queries      │  │  dimension計算  │                     │
│  └───────┬────────┘  └───────┬────────┘                     │
│          │                    │                               │
│          └────────┬───────────┘                               │
│                   │                                           │
│          ┌───────▼────────┐                                  │
│          │   Database     │                                  │
│          │ tests          │                                  │
│          │ testQuestions  │                                  │
│          │ testResults    │                                  │
│          └────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

## データモデル設計

### testsテーブル（既存スキーマ使用）

```typescript
const MBTI_TEST = {
  slug: "mbti",
  title: "MBTI性格診断",
  description: "60問の質問であなたの性格タイプを詳細に分析。日常生活、仕事、対人関係のパターンから16タイプに分類します。",
  category: "personality",
  questionCount: 60,
  estimatedMinutes: 15,
  scoringType: "dimension",
  resultField: "mbti",
  icon: "brain",
  gradientStart: "#6366f1",
  gradientEnd: "#8b5cf6",
  isActive: true,
  citation: {
    authors: ["Isabel Briggs Myers", "Katharine Cook Briggs"],
    title: "Myers-Briggs Type Indicator",
    year: 1962,
    url: "https://www.myersbriggs.org",
  },
  scoringConfig: {
    dimensions: [
      { positive: "E", negative: "I" },
      { positive: "S", negative: "N" },
      { positive: "T", negative: "F" },
      { positive: "J", negative: "P" },
    ],
  },
  resultTypes: { /* 16タイプの定義 */ },
};
```

### testQuestionsテーブル（60件）

```typescript
interface MbtiQuestion {
  testId: Id<"tests">;
  order: number;        // 1-60
  questionText: string;
  questionType: "multiple";
  options: [
    { value: "A", label: string, scoreValue: string },
    { value: "B", label: string, scoreValue: string },
  ];
}
```

### 質問配置アルゴリズム

4軸が混在する順序で配置（偏りを防ぐため）：

```
Round 1:  E1, S1, T1, J1  (order 1-4)
Round 2:  E2, S2, T2, J2  (order 5-8)
Round 3:  E3, S3, T3, J3  (order 9-12)
...
Round 15: E15, S15, T15, J15 (order 57-60)
```

### 質問カテゴリ設計

各軸15問を以下のカテゴリで設計：

**E/I軸（外向/内向）**
| カテゴリ | 質問数 | 内容 |
|---------|--------|------|
| エネルギー源 | 4問 | エネルギーをどこから得るか |
| 社交スタイル | 4問 | 人との関わり方 |
| コミュニケーション | 4問 | 話し方・聞き方の傾向 |
| 休息方法 | 3問 | リフレッシュの仕方 |

**S/N軸（感覚/直感）**
| カテゴリ | 質問数 | 内容 |
|---------|--------|------|
| 情報収集 | 4問 | 情報をどう取り入れるか |
| 注意の焦点 | 4問 | 何に注目するか |
| 学習スタイル | 4問 | 学び方の傾向 |
| 問題解決 | 3問 | 問題へのアプローチ |

**T/F軸（思考/感情）**
| カテゴリ | 質問数 | 内容 |
|---------|--------|------|
| 意思決定 | 4問 | 決断の仕方 |
| 価値観 | 4問 | 重視する基準 |
| 対人関係 | 4問 | 人との接し方 |
| フィードバック | 3問 | 評価の受け方・与え方 |

**J/P軸（判断/知覚）**
| カテゴリ | 質問数 | 内容 |
|---------|--------|------|
| 計画性 | 4問 | 計画の立て方 |
| 時間管理 | 4問 | 時間の使い方 |
| 仕事スタイル | 4問 | 作業の進め方 |
| 生活習慣 | 3問 | 日常の過ごし方 |

## 16タイプの結果定義

```typescript
const MBTI_RESULT_TYPES: Record<string, {
  summary: string;
  nickname: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}> = {
  ISTJ: {
    nickname: "管理者",
    summary: "誠実で責任感が強く、伝統を重んじる",
    description: "...",
    strengths: ["責任感", "誠実さ", "計画性"],
    weaknesses: ["柔軟性の欠如", "感情表現が苦手"],
    recommendations: ["変化を受け入れる練習を"],
  },
  // ... 他15タイプ
};
```

## スコアリング設計

### 計算フロー

```
1. 回答データ取得
   answers: [{ questionOrder: 1, selectedValue: "A" }, ...]

2. スコア集計
   scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

   for each answer:
     question = findQuestion(answer.questionOrder)
     option = findOption(answer.selectedValue)
     scores[option.scoreValue] += 1

3. 結果タイプ決定
   dimensions = []
   for each [positive, negative] in config.dimensions:
     dimensions.push(scores[positive] >= scores[negative] ? positive : negative)

   resultType = dimensions.join("")  // "ENFP"

4. 結果保存
   testResults.insert({
     resultType: "ENFP",
     scores: { E: 10, I: 5, S: 7, N: 8, T: 6, F: 9, J: 4, P: 11 },
     analysis: resultTypes["ENFP"],
   })
```

### パーセンテージ計算（将来対応）

```typescript
// aiData.percentiles
{
  E_I: Math.round((scores.I / (scores.E + scores.I)) * 100), // I傾向の%
  S_N: Math.round((scores.N / (scores.S + scores.N)) * 100), // N傾向の%
  T_F: Math.round((scores.F / (scores.T + scores.F)) * 100), // F傾向の%
  J_P: Math.round((scores.P / (scores.J + scores.P)) * 100), // P傾向の%
}
```

## UI/UX設計

### テスト画面（TestScreen）

- **グラデーション**: #6366f1 → #8b5cf6（Indigo→Purple）
- **進捗バー**: 同じグラデーションカラー
- **質問表示**: 2択ボタン（A/B）
- **アニメーション**: 選択後300msでフェードして次の質問へ

### 結果画面（TestResultScreen）

既存のコンポーネントをそのまま使用：
- タイプ表示（例: "ENFP - 広報運動家"）
- 4軸のスコアバー
- 詳細分析（強み、弱み、アドバイス）

## ファイル構成

```
convex/
├── seedMbtiTest.ts       # 新規作成
│   ├── MBTI_TEST         # テスト定義
│   ├── MBTI_QUESTIONS    # 60問の質問
│   ├── MBTI_RESULT_TYPES # 16タイプの結果定義
│   └── seedMbtiTest()    # シードmutation
│
├── scoring.ts            # 既存（変更なし）
├── tests.ts              # 既存（変更なし）
└── schema.ts             # 既存（変更なし）

features/tests/
├── screens/
│   ├── TestScreen.tsx       # 既存（変更なし）
│   └── TestResultScreen.tsx # 既存（変更なし）
└── hooks/                   # 既存（変更なし）
```

## 参考実装

- [convex/seedLastLoverTest.ts](convex/seedLastLoverTest.ts) - シードパターンの参考
- [convex/scoring.ts:69](convex/scoring.ts#L69) - calculateDimensionScores()
