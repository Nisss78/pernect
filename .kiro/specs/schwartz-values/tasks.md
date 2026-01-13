# Schwartz価値観診断 実装タスク

## Phase 1: データ投入

### Task 1.1: テスト定義作成 [P0]
- [ ] SCHWARTZ_TEST定数を定義
- [ ] scoringType: "percentile"

### Task 1.2: 40問の質問データ作成 [P0]
- [ ] 10価値 × 4問 = 40問を作成
- [ ] 6段階評価の選択肢
- [ ] scoreKeyを各価値に設定

### Task 1.3: 10価値の結果定義作成 [P0]
- [ ] SelfDirection（自己決定）
- [ ] Stimulation（刺激）
- [ ] Hedonism（快楽）
- [ ] Achievement（達成）
- [ ] Power（権力）
- [ ] Security（安全）
- [ ] Conformity（同調）
- [ ] Tradition（伝統）
- [ ] Benevolence（博愛）
- [ ] Universalism（普遍主義）

### Task 1.4: シードMutation作成 [P0]
- [ ] seedSchwartzTest mutation実装
- [ ] resetSchwartzTest mutation実装

## Phase 2: 検証

### Task 2.1: シードデータ実行 [P0]
- [ ] npx convex run seedSchwartzTest:seedSchwartzTest

### Task 2.2: E2Eテスト [P1]
- [ ] 40問すべて回答できることを確認
- [ ] 結果が正しく表示されることを確認

## 完了条件

- [ ] 価値観診断がテスト一覧に表示される
- [ ] 40問すべて回答できる
- [ ] 10価値のスコアが正しく表示される
