# 強み診断（CliftonStrengths風）設計ドキュメント

## アーキテクチャ概要

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React Native)                   │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │  TestScreen    │  │ TestResultScreen│                     │
│  │  (68問表示)    │  │  (Top 5表示)   │                     │
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
│  │   queries      │  │  single計算    │                     │
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

### testsテーブル

```typescript
const STRENGTHS_TEST = {
  slug: "strengths",
  title: "強み診断",
  description: "34の強みテーマからあなたのTop 5を発見。Gallup社のCliftonStrengthsをベースにした診断です。",
  category: "strength",
  questionCount: 68,
  estimatedMinutes: 20,
  scoringType: "single",
  icon: "star",
  gradientStart: "#f59e0b",
  gradientEnd: "#ef4444",
  isActive: true,
  citation: {
    authors: ["Don Clifton", "Gallup"],
    title: "CliftonStrengths",
    year: 2001,
    url: "https://www.gallup.com/cliftonstrengths",
  },
  resultTypes: { /* 34テーマの定義 */ },
};
```

### testQuestionsテーブル（68件）

```typescript
interface StrengthsQuestion {
  testId: Id<"tests">;
  order: number;        // 1-68
  questionText: string;
  questionType: "multiple";
  options: [
    { value: "A", label: string, scoreKey: string, scoreValue: 1 },
    { value: "B", label: string, scoreKey: string, scoreValue: 1 },
  ];
}
```

### 質問設計

各質問で2つのテーマを比較し、選択された方にスコアを加算：

```typescript
{
  order: 1,
  questionText: "次のうち、どちらがより自分に当てはまりますか？",
  options: [
    {
      value: "A",
      label: "毎日やることリストを作り、すべて完了させると達成感を感じる",
      scoreKey: "Achiever",
      scoreValue: 1
    },
    {
      value: "B",
      label: "複数のことを同時に調整し、最適な形にまとめるのが得意",
      scoreKey: "Arranger",
      scoreValue: 1
    },
  ],
}
```

### 34テーマの結果定義

```typescript
interface StrengthTheme {
  nameJa: string;
  nameEn: string;
  domain: "executing" | "influencing" | "relationship" | "strategic";
  summary: string;
  description: string;
  strengths: string[];
  howToUse: string[];
  watchOut: string[];
}

const STRENGTHS_RESULT_TYPES: Record<string, StrengthTheme> = {
  Achiever: {
    nameJa: "達成欲",
    nameEn: "Achiever",
    domain: "executing",
    summary: "毎日何かを成し遂げないと気が済まない",
    description: "あなたは生産的であることに強い欲求を持っています...",
    strengths: ["継続的な生産性", "努力を惜しまない姿勢"],
    howToUse: ["毎日の小さな目標を設定する", "達成したことを記録する"],
    watchOut: ["燃え尽きないよう休息も大切に"],
  },
  // ... 他33テーマ
};
```

## スコアリング設計

### 計算フロー

```
1. 回答データ取得
   answers: [{ questionOrder: 1, selectedValue: "A" }, ...]

2. スコア集計
   scores: { Achiever: 0, Arranger: 0, ... } // 34テーマ

   for each answer:
     question = findQuestion(answer.questionOrder)
     option = findOption(answer.selectedValue)
     scores[option.scoreKey] += option.scoreValue

3. Top 5決定
   sortedThemes = Object.entries(scores)
     .sort((a, b) => b[1] - a[1])
     .slice(0, 5)

4. 結果保存
   testResults.insert({
     resultType: sortedThemes[0][0], // Top 1のテーマ名
     scores: scores,
     analysis: {
       top5: sortedThemes.map(([theme, score]) => ({ theme, score })),
     },
   })
```

### Top 5表示

```typescript
// aiData.top5
[
  { rank: 1, theme: "Achiever", nameJa: "達成欲", domain: "executing", score: 4 },
  { rank: 2, theme: "Learner", nameJa: "学習欲", domain: "strategic", score: 3 },
  { rank: 3, theme: "Analytical", nameJa: "分析思考", domain: "strategic", score: 3 },
  { rank: 4, theme: "Responsibility", nameJa: "責任感", domain: "executing", score: 2 },
  { rank: 5, theme: "Relator", nameJa: "親密性", domain: "relationship", score: 2 },
]
```

## UI/UX設計

### テスト画面（TestScreen）

- **グラデーション**: #f59e0b → #ef4444（Amber→Red）
- **進捗バー**: 同じグラデーションカラー
- **質問表示**: 2択ボタン（A/B）
- **アニメーション**: 選択後300msでフェードして次の質問へ

### 結果画面（TestResultScreen）- 拡張必要

**Top 5表示セクション**
```
🥇 #1 達成欲 (Achiever) - 実行力
🥈 #2 学習欲 (Learner) - 戦略的思考力
🥉 #3 分析思考 (Analytical) - 戦略的思考力
#4 責任感 (Responsibility) - 実行力
#5 親密性 (Relator) - 人間関係構築力
```

**ドメイン分布表示**
```
実行力:           ██████████ 2/5
影響力:           ░░░░░░░░░░ 0/5
人間関係構築力:   ██████░░░░ 1/5
戦略的思考力:     ████████░░ 2/5
```

## ファイル構成

```
convex/
├── seedStrengthsTest.ts      # 新規作成
│   ├── STRENGTHS_TEST        # テスト定義
│   ├── STRENGTHS_QUESTIONS   # 68問の質問
│   ├── STRENGTHS_RESULT_TYPES # 34テーマの結果定義
│   └── seedStrengthsTest()   # シードmutation
│
├── scoring.ts                # 既存（変更なし）
├── tests.ts                  # 既存（変更なし）
└── schema.ts                 # 既存（変更なし）

features/tests/
├── screens/
│   ├── TestScreen.tsx           # 既存（変更なし）
│   └── TestResultScreen.tsx     # 変更: Top 5表示対応
└── hooks/                       # 既存（変更なし）
```

## 34テーマ一覧

### 実行力（Executing）- 9テーマ
| 英語名 | 日本語名 | 概要 |
|--------|---------|------|
| Achiever | 達成欲 | 毎日何かを成し遂げる |
| Arranger | アレンジ | 複数の要素を最適に調整 |
| Belief | 信念 | 核となる価値観に従う |
| Consistency | 公平性 | 公平なルールを重視 |
| Deliberative | 慎重さ | リスクを慎重に検討 |
| Discipline | 規律性 | 秩序とルーティンを好む |
| Focus | 目標志向 | 目標に集中して進む |
| Responsibility | 責任感 | 約束を必ず守る |
| Restorative | 回復志向 | 問題を見つけて解決 |

### 影響力（Influencing）- 8テーマ
| 英語名 | 日本語名 | 概要 |
|--------|---------|------|
| Activator | 活発性 | 行動を起こさせる |
| Command | 指令性 | 主導権を握る |
| Communication | コミュニケーション | 言葉で影響を与える |
| Competition | 競争性 | 競争で力を発揮 |
| Maximizer | 最上志向 | 良いものを最高に |
| Self-Assurance | 自己確信 | 自分の判断を信じる |
| Significance | 自我 | 重要な存在でありたい |
| Woo | 社交性 | 新しい人を惹きつける |

### 人間関係構築力（Relationship Building）- 9テーマ
| 英語名 | 日本語名 | 概要 |
|--------|---------|------|
| Adaptability | 適応性 | 流れに身を任せる |
| Connectedness | 運命思考 | すべては繋がっている |
| Developer | 成長促進 | 他者の成長を促す |
| Empathy | 共感性 | 感情を感じ取る |
| Harmony | 調和性 | 合意点を見つける |
| Includer | 包含 | 誰もが受け入れられる |
| Individualization | 個別化 | 個人の違いを見抜く |
| Positivity | ポジティブ | 熱意で周囲を明るく |
| Relator | 親密性 | 深い関係を築く |

### 戦略的思考力（Strategic Thinking）- 8テーマ
| 英語名 | 日本語名 | 概要 |
|--------|---------|------|
| Analytical | 分析思考 | データと論理で判断 |
| Context | 原点思考 | 過去から学ぶ |
| Futuristic | 未来志向 | 未来のビジョンを描く |
| Ideation | 着想 | 新しいアイデアを生む |
| Input | 収集心 | 情報を集め続ける |
| Intellection | 内省 | 深く考えることを好む |
| Learner | 学習欲 | 学び続けることが喜び |
| Strategic | 戦略性 | 最適な道を見つける |

## 参考実装

- [convex/seedLastLoverTest.ts](convex/seedLastLoverTest.ts) - シードパターンの参考
- [convex/scoring.ts:162](convex/scoring.ts#L162) - calculateSingleScores()
