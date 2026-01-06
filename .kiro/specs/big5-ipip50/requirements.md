# Requirements Document

## Project Description (Input)

BIG5診断（IPIP-50）の完全実装

## 概要

科学的に最も検証された性格モデルであるBIG5（ビッグファイブ）診断を、IPIP-NEO-50項目版として完全実装する。Costa & McCraeの5因子モデルに基づき、パブリックドメインのIPIP項目を使用。

## Introduction

BIG5（ビッグファイブ）は、心理学において最も広く認められた性格モデルであり、数十年にわたる研究によって科学的に検証されています。本機能は、International Personality Item Pool (IPIP) が提供する50項目版を日本語で実装し、ユーザーの性格特性を5つの因子（OCEAN）で測定します。

### 5因子（OCEAN）

| 因子 | 英語名 | 略称 | 概要 |
|-----|--------|------|------|
| 開放性 | Openness | O | 知的好奇心、創造性、新しい経験への開放度 |
| 誠実性 | Conscientiousness | C | 自己規律、責任感、目標志向性 |
| 外向性 | Extraversion | E | 社交性、活動性、ポジティブ感情 |
| 協調性 | Agreeableness | A | 思いやり、協力性、信頼性 |
| 神経症傾向 | Neuroticism | N | 情緒不安定性、ストレス反応性 |

### 科学的根拠

- Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual
- Goldberg, L. R. (1999). International Personality Item Pool
- 日本語版IPIP-NEO標準化研究

---

## Requirements

### Requirement 1: IPIP-50質問項目の実装

**Objective:** ユーザーとして、科学的に検証された50の質問に回答することで、正確な性格診断を受けたい。

#### Acceptance Criteria

1. WHEN ユーザーがBIG5診断を開始する THEN システムは50問の質問を順番に表示する SHALL
2. WHEN 質問が表示される THEN 各質問は日本語で明確に表示される SHALL
3. WHILE 診断が進行中 THE システムは各因子につき10問ずつ、計50問を出題する SHALL
4. WHERE 質問の表示順序 THE システムは因子がランダムに混在するよう質問を配置する SHALL

#### IPIP-50質問項目一覧

##### 開放性 (Openness) - 10問

| # | 質問文（日本語） | 原文（英語） | 逆転 |
|---|----------------|--------------|------|
| O1 | 鮮明な想像力を持っている | Have a vivid imagination | - |
| O2 | 抽象的なアイデアに興味がない | Am not interested in abstract ideas | R |
| O3 | 難しい本を読むのが好きだ | Enjoy hearing new ideas | - |
| O4 | 芸術や音楽に感動しにくい | Do not like art | R |
| O5 | 新しいアイデアを聞くのが好きだ | Tend to vote for liberal political candidates | - |
| O6 | 物事を深く考えるのが好きだ | Carry the conversation to a higher level | - |
| O7 | 想像力に乏しい | Do not have a good imagination | R |
| O8 | 美術館に行くのが好きだ | Believe in the importance of art | - |
| O9 | 詩にはあまり興味がない | Do not enjoy going to art museums | R |
| O10 | 新しいことを試すのが好きだ | Enjoy wild flights of fantasy | - |

##### 誠実性 (Conscientiousness) - 10問

| # | 質問文（日本語） | 原文（英語） | 逆転 |
|---|----------------|--------------|------|
| C1 | いつも準備をしている | Am always prepared | - |
| C2 | 物をよくなくす | Leave my belongings around | R |
| C3 | 細部に注意を払う | Pay attention to details | - |
| C4 | 仕事をすぐに始める | Get chores done right away | - |
| C5 | 予定を守るのが苦手だ | Often forget to put things back in their proper place | R |
| C6 | 計画に従って物事を進める | Like order | - |
| C7 | 仕事を途中で投げ出すことがある | Make a mess of things | R |
| C8 | 正確に仕事をこなす | Follow a schedule | - |
| C9 | 約束を守らないことがある | Shirk my duties | R |
| C10 | 目標に向かって努力する | Am exacting in my work | - |

##### 外向性 (Extraversion) - 10問

| # | 質問文（日本語） | 原文（英語） | 逆転 |
|---|----------------|--------------|------|
| E1 | パーティーの中心的存在だ | Am the life of the party | - |
| E2 | あまり話さない方だ | Don't talk a lot | R |
| E3 | 人と話すのが心地よい | Feel comfortable around people | - |
| E4 | 目立たないようにしている | Keep in the background | R |
| E5 | 知らない人に話しかけることができる | Start conversations | - |
| E6 | 人前で話すことが苦手だ | Have little to say | R |
| E7 | 社交的な場で自分を表現できる | Talk to a lot of different people at parties | - |
| E8 | 注目されるのが好きではない | Don't like to draw attention to myself | R |
| E9 | 初対面の人とも気軽に話せる | Don't mind being the center of attention | - |
| E10 | 静かな性格だ | Am quiet around strangers | R |

##### 協調性 (Agreeableness) - 10問

| # | 質問文（日本語） | 原文（英語） | 逆転 |
|---|----------------|--------------|------|
| A1 | 他人の気持ちに共感できる | Feel others' emotions | - |
| A2 | 他人の問題にあまり興味がない | Am not really interested in others | R |
| A3 | 困っている人を助けたい | Take time out for others | - |
| A4 | 他人を侮辱することがある | Insult people | R |
| A5 | 他人の幸せを気にかける | Sympathize with others' feelings | - |
| A6 | 他人に冷たい態度をとることがある | Am not interested in other people's problems | R |
| A7 | 優しい心を持っている | Have a soft heart | - |
| A8 | 他人のために時間を割くことができる | Make people feel at ease | - |
| A9 | 他人の感情にあまり関心がない | Feel little concern for others | R |
| A10 | 人を和ませることができる | Am hard to get to know | R |

##### 神経症傾向 (Neuroticism) - 10問

| # | 質問文（日本語） | 原文（英語） | 逆転 |
|---|----------------|--------------|------|
| N1 | ストレスを感じやすい | Get stressed out easily | - |
| N2 | ほとんどの時間リラックスしている | Am relaxed most of the time | R |
| N3 | 物事を心配しすぎる | Worry about things | - |
| N4 | めったに落ち込まない | Seldom feel blue | R |
| N5 | すぐに動揺する | Am easily disturbed | - |
| N6 | 気分の浮き沈みが激しい | Get upset easily | - |
| N7 | 気分が頻繁に変わる | Have frequent mood swings | - |
| N8 | すぐにイライラする | Get irritated easily | - |
| N9 | よく悲しい気持ちになる | Often feel blue | - |
| N10 | 感情が安定している | Rarely get irritated | R |

---

### Requirement 2: 5段階リッカートスケール回答システム

**Objective:** ユーザーとして、直感的に理解できる5段階の選択肢で回答したい。

#### Acceptance Criteria

1. WHEN 質問が表示される THEN システムは5つの回答選択肢を表示する SHALL
2. WHERE 回答選択肢 THE システムは以下のラベルを使用する SHALL:
   - 1: 全く当てはまらない
   - 2: あまり当てはまらない
   - 3: どちらともいえない
   - 4: やや当てはまる
   - 5: 非常に当てはまる
3. WHEN ユーザーが選択肢をタップする THEN システムは視覚的フィードバックを即座に表示する SHALL
4. WHEN 回答が選択される THEN システムは自動的に次の質問へ進む SHALL
5. IF ユーザーが回答を変更したい場合 THEN システムは前の質問に戻る機能を提供する SHALL

---

### Requirement 3: 逆転項目のスコアリング処理

**Objective:** システムとして、逆転項目を正しく処理し、正確なスコアを算出したい。

#### Acceptance Criteria

1. WHEN 逆転項目（R）の回答を処理する THEN システムはスコアを反転する SHALL (6 - 回答値)
2. WHERE 通常項目のスコアリング THE システムは回答値をそのまま使用する SHALL
3. WHILE スコア計算中 THE システムは各因子ごとに10問のスコアを合計する SHALL
4. WHEN 全50問が完了する THEN システムは各因子の合計スコア（10-50点）を算出する SHALL

#### 逆転項目一覧

| 因子 | 逆転項目番号 |
|-----|-------------|
| O (開放性) | O2, O4, O7, O9 |
| C (誠実性) | C2, C5, C7, C9 |
| E (外向性) | E2, E4, E6, E8, E10 |
| A (協調性) | A2, A4, A6, A9, A10 |
| N (神経症傾向) | N2, N4, N10 |

---

### Requirement 4: パーセンタイルスコアの計算

**Objective:** ユーザーとして、自分のスコアが一般的な分布の中でどの位置にあるか知りたい。

#### Acceptance Criteria

1. WHEN 因子スコアが算出される THEN システムは各因子のパーセンタイルを計算する SHALL
2. WHERE パーセンタイル計算 THE システムは以下の変換を適用する SHALL:
   - 合計スコア範囲: 10-50点
   - パーセンタイル範囲: 0-100%
3. WHEN パーセンタイルを計算する THEN システムは正規分布に基づく変換を使用する SHALL
4. WHERE 結果表示 THE システムは各因子のパーセンタイルを視覚的なグラフで表示する SHALL

#### パーセンタイル変換テーブル（参考値）

| 合計スコア | パーセンタイル目安 |
|-----------|------------------|
| 10-15 | 1-10% (非常に低い) |
| 16-20 | 11-25% (低い) |
| 21-25 | 26-40% (やや低い) |
| 26-30 | 41-60% (平均) |
| 31-35 | 61-75% (やや高い) |
| 36-40 | 76-90% (高い) |
| 41-50 | 91-100% (非常に高い) |

---

### Requirement 5: 診断結果の表示

**Objective:** ユーザーとして、自分の性格特性を理解しやすい形式で確認したい。

#### Acceptance Criteria

1. WHEN 診断が完了する THEN システムは5因子すべてのスコアを一覧表示する SHALL
2. WHERE 結果画面 THE システムは以下の情報を表示する SHALL:
   - 各因子のパーセンタイルスコア
   - レーダーチャート形式の視覚化
   - 各因子の解説テキスト
   - 強みと成長領域の提案
3. WHEN 特定の因子が高い場合 THEN システムはその因子の詳細な解説を表示する SHALL
4. IF パーセンタイルが75%以上 THEN システムは「高い」として強調表示する SHALL
5. IF パーセンタイルが25%以下 THEN システムは「低い」として表示する SHALL
6. WHERE 科学的根拠 THE システムは出典情報（Costa & McCrae, 1992）を表示する SHALL

---

### Requirement 6: 結果の保存と履歴

**Objective:** ユーザーとして、過去の診断結果を確認し、変化を追跡したい。

#### Acceptance Criteria

1. WHEN 診断が完了する THEN システムは結果をConvexデータベースに保存する SHALL
2. WHERE 保存データ THE システムは以下を記録する SHALL:
   - ユーザーID
   - 各質問への回答
   - 各因子の合計スコア
   - 各因子のパーセンタイル
   - 診断完了日時
3. WHEN ユーザーがプロフィール画面を表示する THEN システムは過去の診断結果一覧を表示する SHALL
4. IF 複数の診断結果がある THEN システムはスコアの変化をグラフで表示する SHALL

---

### Requirement 7: 診断進行状況の管理

**Objective:** ユーザーとして、診断を中断しても後で続きから再開したい。

#### Acceptance Criteria

1. WHEN ユーザーが診断を中断する THEN システムは進行状況を保存する SHALL
2. WHERE 進行状況の保存 THE システムは以下を記録する SHALL:
   - 現在の質問番号
   - これまでの回答
   - 開始日時
3. WHEN ユーザーが診断画面に戻る AND 未完了の診断がある THEN システムは続きから再開するオプションを表示する SHALL
4. IF ユーザーが「最初から」を選択する THEN システムは新しい診断セッションを開始する SHALL

---

### Requirement 8: UIデザイン仕様

**Objective:** ユーザーとして、美しく使いやすいインターフェースで診断を受けたい。

#### Acceptance Criteria

1. WHERE 診断画面のデザイン THE システムは以下のスタイルを適用する SHALL:
   - グラデーション: `#06b6d4` → `#3b82f6` (シアン→青)
   - アイコン: `star`
   - 角丸: `rounded-3xl`
2. WHEN 質問が表示される THEN システムは進行状況バーを上部に表示する SHALL
3. WHERE 進行状況バー THE システムは「X/50問完了」形式で表示する SHALL
4. WHEN 回答選択肢をタップする THEN システムは選択状態をアニメーションで表示する SHALL
5. WHERE 結果画面 THE システムはレーダーチャートを中央に配置する SHALL

---

### Requirement 9: 既存システムとの統合

**Objective:** システムとして、既存の診断フレームワークと一貫した方法で統合したい。

#### Acceptance Criteria

1. WHERE データベーススキーマ THE システムは既存の`evidenceBasedTests`テーブルを使用する SHALL
2. WHERE スコアリング THE システムは既存の`calculatePercentileScores`関数を活用する SHALL
3. WHEN 質問データを登録する THEN システムは`seedEvidenceBasedQuestions`形式に従う SHALL
4. WHERE 結果タイプ THE システムは以下のキーを使用する SHALL:
   - `High-O`: 開放性が高い
   - `High-C`: 誠実性が高い
   - `High-E`: 外向性が高い
   - `High-A`: 協調性が高い
   - `High-N`: 神経症傾向が高い

---

### Requirement 10: 科学的正確性の担保

**Objective:** ユーザーとして、信頼できる科学的根拠に基づいた診断を受けたい。

#### Acceptance Criteria

1. WHERE 質問項目 THE システムはIPIP公式の50項目を忠実に実装する SHALL
2. WHERE スコアリング方法 THE システムはNEO-PI-Rの標準手順に従う SHALL
3. WHERE 結果解説 THE システムは心理学的に正確な記述を使用する SHALL
4. WHEN 出典情報を表示する THEN システムは`CitationInfo`コンポーネントを使用する SHALL
5. WHERE 出典データ THE システムは以下を表示する SHALL:
   - 著者: Paul T. Costa Jr., Robert R. McCrae
   - タイトル: Revised NEO Personality Inventory (NEO-PI-R)
   - 年: 1992
   - DOI: 10.1037/t03907-000

---

## Non-Functional Requirements

### パフォーマンス
- 質問の読み込み: 1秒以内
- 回答の保存: 500ms以内
- 結果計算: 2秒以内

### アクセシビリティ
- 質問文のフォントサイズ: 16px以上
- タップターゲット: 44px以上
- 色のコントラスト比: 4.5:1以上

### セキュリティ
- 認証済みユーザーのみ診断可能
- 診断結果はユーザー本人のみ閲覧可能

---

## Data Schema

### 質問データ構造

```typescript
interface BIG5Question {
  id: string;           // "O1", "C2", etc.
  order: number;        // 1-50
  text: string;         // 日本語質問文
  textEn: string;       // 英語原文
  factor: "O" | "C" | "E" | "A" | "N";
  isReversed: boolean;  // 逆転項目フラグ
  questionType: "likert";
  options: LikertOption[];
}

interface LikertOption {
  value: string;        // "1" - "5"
  label: string;        // 回答ラベル
  scoreValue: number;   // スコア値
  scoreKey: string;     // 因子キー ("O", "C", etc.)
}
```

### 結果データ構造

```typescript
interface BIG5Result {
  userId: Id<"users">;
  testId: Id<"evidenceBasedTests">;
  answers: Answer[];
  scores: {
    O: number;  // 10-50
    C: number;
    E: number;
    A: number;
    N: number;
  };
  percentiles: {
    O: number;  // 0-100
    C: number;
    E: number;
    A: number;
    N: number;
  };
  resultType: string;   // "High-O", "High-C", etc.
  completedAt: number;
}
```

---

## Appendix: 質問の配置順序（推奨）

因子が均等に混在するよう、以下の順序で質問を配置:

```
1:E1, 2:A1, 3:C1, 4:N1, 5:O1,
6:E2, 7:A2, 8:C2, 9:N2, 10:O2,
11:E3, 12:A3, 13:C3, 14:N3, 15:O3,
... (以降同様のパターン)
```

これにより、ユーザーは特定の因子に偏った回答パターンを意識しにくくなり、より自然な回答が得られる。
