# 強み診断（CliftonStrengths風）実装タスク

## Phase 1: データ投入

### Task 1.1: テスト定義作成 [P0]
**ファイル**: `convex/seedStrengthsTest.ts`

- [ ] STRENGTHS_TEST定数を定義
  - slug: "strengths"
  - title: "強み診断"
  - category: "strength"
  - scoringType: "single"

### Task 1.2: 68問の質問データ作成 [P0]
**ファイル**: `convex/seedStrengthsTest.ts`

- [ ] 34テーマ × 2問 = 68問を作成
- [ ] 各質問で2つのテーマを比較する形式
- [ ] scoreKeyとscoreValueを設定

質問ペアの設計方針：
- 同じドメイン内のテーマを比較（混乱を防ぐ）
- 各テーマが2回登場するように調整

### Task 1.3: 34テーマの結果定義作成 [P0]
**ファイル**: `convex/seedStrengthsTest.ts`

**実行力（Executing）- 9テーマ**
- [ ] Achiever（達成欲）
- [ ] Arranger（アレンジ）
- [ ] Belief（信念）
- [ ] Consistency（公平性）
- [ ] Deliberative（慎重さ）
- [ ] Discipline（規律性）
- [ ] Focus（目標志向）
- [ ] Responsibility（責任感）
- [ ] Restorative（回復志向）

**影響力（Influencing）- 8テーマ**
- [ ] Activator（活発性）
- [ ] Command（指令性）
- [ ] Communication（コミュニケーション）
- [ ] Competition（競争性）
- [ ] Maximizer（最上志向）
- [ ] Self-Assurance（自己確信）
- [ ] Significance（自我）
- [ ] Woo（社交性）

**人間関係構築力（Relationship Building）- 9テーマ**
- [ ] Adaptability（適応性）
- [ ] Connectedness（運命思考）
- [ ] Developer（成長促進）
- [ ] Empathy（共感性）
- [ ] Harmony（調和性）
- [ ] Includer（包含）
- [ ] Individualization（個別化）
- [ ] Positivity（ポジティブ）
- [ ] Relator（親密性）

**戦略的思考力（Strategic Thinking）- 8テーマ**
- [ ] Analytical（分析思考）
- [ ] Context（原点思考）
- [ ] Futuristic（未来志向）
- [ ] Ideation（着想）
- [ ] Input（収集心）
- [ ] Intellection（内省）
- [ ] Learner（学習欲）
- [ ] Strategic（戦略性）

### Task 1.4: シードMutation作成 [P0]
**ファイル**: `convex/seedStrengthsTest.ts`

- [ ] seedStrengthsTest mutation実装
- [ ] resetStrengthsTest mutation実装（開発用）

## Phase 2: UI拡張

### Task 2.1: Top 5表示コンポーネント [P1]
**ファイル**: `features/tests/screens/TestResultScreen.tsx`

- [ ] scoringType="single"の場合のTop 5表示対応
- [ ] 順位（🥇🥈🥉）とテーマ名の表示
- [ ] ドメインのラベル表示

### Task 2.2: ドメイン分布表示 [P2]
**ファイル**: `features/tests/screens/TestResultScreen.tsx`

- [ ] 4ドメインの分布をバーグラフで表示
- [ ] Top 5のドメイン偏りを可視化

## Phase 3: 検証

### Task 3.1: シードデータ実行 [P0]
- [ ] npx convex run seedStrengthsTest:seedStrengthsTest を実行
- [ ] testsテーブルに強み診断が追加されていることを確認
- [ ] testQuestionsテーブルに68問が追加されていることを確認

### Task 3.2: E2Eテスト [P1]
- [ ] テスト一覧に強み診断が表示されることを確認
- [ ] 68問すべて回答できることを確認
- [ ] Top 5が正しく表示されることを確認

### Task 3.3: スコアリング検証 [P1]
- [ ] 各テーマのスコアが正しく集計されることを確認
- [ ] Top 5が正しく判定されることを確認
- [ ] testResultsに正しく保存されることを確認

### Task 3.4: 既存診断への影響確認 [P1]
- [ ] MBTI診断が正常に動作することを確認
- [ ] Last Lover診断が正常に動作することを確認
- [ ] BIG5診断が正常に動作することを確認

## 完了条件

- [ ] 強み診断がテスト一覧に表示される
- [ ] 68問すべて回答できる
- [ ] Top 5テーマが正しく表示される
- [ ] 各テーマの詳細説明が表示される
- [ ] 既存の診断に影響がない
