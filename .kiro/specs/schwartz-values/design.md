# Schwartz価値観診断 設計ドキュメント

## データモデル設計

### testsテーブル

```typescript
const SCHWARTZ_TEST = {
  slug: "schwartz-values",
  title: "価値観診断",
  description: "10の普遍的価値からあなたの価値観プロファイルを分析。人生で何を大切にしているかを可視化します。",
  category: "values",
  questionCount: 40,
  estimatedMinutes: 10,
  scoringType: "percentile",
  icon: "heart",
  gradientStart: "#ec4899", // Pink
  gradientEnd: "#8b5cf6",   // Purple
  isActive: true,
  citation: {
    authors: ["Shalom H. Schwartz"],
    title: "Universals in the content and structure of values",
    year: 1992,
    url: "https://doi.org/10.1016/S0065-2601(08)60281-6",
  },
};
```

### 質問形式

```typescript
interface SchwartzQuestion {
  testId: Id<"tests">;
  order: number;        // 1-40
  questionText: string;
  questionType: "scale";
  options: [
    { value: "1", label: "全く重要でない", scoreValue: 1 },
    { value: "2", label: "重要でない", scoreValue: 2 },
    { value: "3", label: "あまり重要でない", scoreValue: 3 },
    { value: "4", label: "やや重要", scoreValue: 4 },
    { value: "5", label: "重要", scoreValue: 5 },
    { value: "6", label: "非常に重要", scoreValue: 6 },
  ];
  scoreKey: string; // "SelfDirection", "Stimulation", etc.
}
```

## スコアリング設計

### 計算フロー

```
1. 各価値の平均スコアを計算（4問の平均）
2. 全体の平均を計算
3. 各価値のスコアを相対化（個人内比較）
4. パーセンタイルに変換

scores: {
  SelfDirection: 5.2,
  Stimulation: 4.8,
  Hedonism: 4.5,
  Achievement: 5.0,
  Power: 3.2,
  Security: 4.0,
  Conformity: 3.5,
  Tradition: 3.0,
  Benevolence: 5.5,
  Universalism: 5.3,
}
```

### 高次価値の計算

```typescript
const higherOrderValues = {
  selfTranscendence: (scores.Benevolence + scores.Universalism) / 2,
  conservation: (scores.Security + scores.Conformity + scores.Tradition) / 3,
  selfEnhancement: (scores.Power + scores.Achievement) / 2,
  opennessToChange: (scores.SelfDirection + scores.Stimulation) / 2,
};
```

## UI設計

### グラデーション
- Pink (#ec4899) → Purple (#8b5cf6)

### 結果表示
- レーダーチャート: 10価値の分布
- 高次価値バー: 4つの高次価値の比較
- Top 3価値: 最も高い3つの価値をハイライト

## ファイル構成

```
convex/
├── seedSchwartzTest.ts   # シードデータ
│   ├── SCHWARTZ_TEST     # テスト定義
│   ├── SCHWARTZ_QUESTIONS # 40問の質問
│   └── SCHWARTZ_VALUES   # 10価値の定義
```
