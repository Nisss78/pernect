# Implementation Tasks: BIG5-IPIP-50

## Overview

このドキュメントは、BIG5診断（IPIP-50）機能の実装タスクを定義します。タスクは要件とデザインドキュメントに基づき、依存関係を考慮して優先順位付けされています。

---

## Phase 1: データベーススキーマ拡張

### Task 1.1: testQuestionsテーブルにreverseScoredフィールドを追加
**Priority:** High | **Estimate:** 15min | **Requirements:** 3.1-3.4

- [x] `convex/schema.ts`を編集
- [x] `testQuestions`テーブルに`reverseScored: v.optional(v.boolean())`を追加
- [x] 既存の質問データとの後方互換性を確認

**Acceptance Criteria:**
- スキーマにreverseScoredフィールドが追加されている
- 既存のMBTI、エニアグラム、キャリア診断に影響がない
- `npx convex dev`でスキーマが正常にデプロイされる

---

## Phase 2: 質問データのシーディング

### Task 2.1: seedBig5Questions mutation の作成
**Priority:** High | **Estimate:** 2h | **Requirements:** 1.1-1.4, 10.1-10.2 | **Depends on:** 1.1

- [x] `convex/seedBig5Questions.ts`を新規作成
- [x] 50問すべてのIPIP項目を定義（requirements.mdの質問一覧を参照）
- [x] 各質問に以下のフィールドを設定:
  - `order`: 1-50（因子が混在する順序）
  - `questionText`: 日本語質問文
  - `questionType`: "likert"
  - `scoreKey`: "O" | "C" | "E" | "A" | "N"
  - `reverseScored`: 逆転項目はtrue
  - `typeConfig`: `{ likertMin: 1, likertMax: 5, likertLabels: { min: "全く当てはまらない", max: "非常に当てはまる" } }`
- [x] 既存の質問を削除してから再投入する冪等性を実装
- [x] 正常完了時に`{ success: true, message: string, questionCount: 50 }`を返却

**Acceptance Criteria:**
- 50問すべてが正しい因子コードで登録される
- 逆転項目（21問）にreverseScoredフラグが設定される
- 質問順序が因子混在パターン（E1,A1,C1,N1,O1,E2...）に従う
- 再実行しても重複が発生しない

### Task 2.2: 質問データの投入とデータ検証
**Priority:** High | **Estimate:** 30min | **Depends on:** 2.1

- [x] `npx convex run seedBig5Questions:seedBig5Questions`を実行
- [x] Convex Dashboardで50問が登録されていることを確認
- [x] 各因子に10問ずつ割り当てられていることを確認
- [x] 逆転項目の数を検証:
  - O: 4問 (O2, O4, O7, O9)
  - C: 4問 (C2, C5, C7, C9)
  - E: 5問 (E2, E4, E6, E8, E10)
  - A: 5問 (A2, A4, A6, A9, A10)
  - N: 3問 (N2, N4, N10)

**Acceptance Criteria:**
- testQuestionsテーブルにbig5テストに紐づく50件のレコードが存在
- すべての質問にtypeConfigが正しく設定されている

---

## Phase 3: スコアリングエンジンの拡張

### Task 3.1: calculatePercentileScoresの逆転項目処理を追加
**Priority:** High | **Estimate:** 1h | **Requirements:** 3.1-3.4, 4.1-4.3 | **Depends on:** 1.1

- [x] `convex/scoring.ts`を編集
- [x] `calculatePercentileScores`関数内で質問データの`reverseScored`フラグをチェック
- [x] 逆転項目の場合、スコアを反転: `(likertMax + likertMin) - rawValue`
- [x] リッカートスケールの設定値（min/max）を動的に取得
- [x] 既存のスコアリングロジックに影響を与えないことを確認

**Contract:**
```typescript
// 逆転処理ロジック
if (question.reverseScored) {
  const { likertMin = 1, likertMax = 5 } = question.typeConfig || {};
  processedValue = (likertMax + likertMin) - rawValue;
}
```

**Acceptance Criteria:**
- 逆転項目のスコアが正しく反転される（例: 回答5 → スコア1）
- 通常項目は影響を受けない
- 既存のMBTI/エニアグラム/キャリア診断が正常に動作する

### Task 3.2: 因子別スコア集計の検証
**Priority:** High | **Estimate:** 30min | **Depends on:** 3.1

- [x] 各因子（O, C, E, A, N）のスコアが10問の合計として計算されることを確認
- [x] スコア範囲が10-50になることを検証
- [x] パーセンタイル変換（0-100）が正しく適用されることを確認
- [x] 最高スコアの因子が`resultType`に設定されることを検証（例: "High-O"）

**Acceptance Criteria:**
- テストデータで全因子のスコアが正しく計算される
- resultTypeが最高パーセンタイルの因子に設定される

---

## Phase 4: 結果タイプ定義の確認

### Task 4.1: BIG5_TEST定義の結果タイプを確認
**Priority:** Medium | **Estimate:** 15min | **Requirements:** 9.1-9.4

- [x] `convex/seedEvidenceBasedTests.ts`のBIG5_TEST定義を確認
- [x] resultTypesに以下が含まれていることを確認:
  - `High-O`: 開放性が高い
  - `High-C`: 誠実性が高い
  - `High-E`: 外向性が高い
  - `High-A`: 協調性が高い
  - `High-N`: 神経症傾向が高い
- [x] 各resultTypeのtitle, description, strengths, weaknessesを確認
- [x] 必要に応じて解説文を心理学的に正確な内容に更新

**Acceptance Criteria:**
- 5つのresultTypeがすべて定義されている
- 解説文がCosta & McCraeの5因子モデルに準拠している

---

## Phase 5: 統合テスト

### Task 5.1: BIG5診断フローのE2Eテスト
**Priority:** High | **Estimate:** 1h | **Depends on:** 2.2, 3.2, 4.1

- [x] アプリでBIG5診断を開始
- [x] 50問すべてに回答（各因子の逆転・通常項目を混在させる）
- [x] スコア計算が正しく行われることを確認
- [x] 結果画面で5因子のパーセンタイルが表示されることを確認
- [x] resultTypeが最高因子に基づいて設定されることを確認

**テストケース:**
1. すべて5で回答 → 逆転項目を考慮した正しいスコア ✅ (N=38,O=34,C=34,A=30,E=30 → High-N)
2. すべて1で回答 → 逆転項目を考慮した正しいスコア ✅ (E=30,A=30,O=26,C=26,N=22 → High-E)
3. ランダム回答 → 各因子のスコアが10-50の範囲内 ✅ (すべて3で回答→全因子30点)

**Acceptance Criteria:**
- 診断開始から結果表示までのフルフローが完了する
- スコアとパーセンタイルが期待値と一致する
- 結果がConvexデータベースに保存される

### Task 5.2: 進捗保存・復元テスト
**Priority:** Medium | **Estimate:** 30min | **Requirements:** 7.1-7.4 | **Depends on:** 5.1

- [x] 診断を25問で中断
- [x] アプリを再起動
- [x] 診断画面に戻り、続きから再開できることを確認
- [x] 26問目から開始されることを確認
- [x] 最終結果が正しく計算されることを確認

**コードレビュー検証:**
- `testAnswers.getProgress`: 既存進捗を取得
- `testAnswers.saveProgress`: 回答ごとに進捗保存
- TestScreen: `existingProgress`から回答復元、最後の質問+1へ移動
- BIG5の50問も既存メカニズムで進捗管理される

**Acceptance Criteria:**
- 中断した位置から正確に再開できる ✅
- 既に回答した質問の内容が保持されている ✅

### Task 5.3: 既存診断への影響テスト
**Priority:** High | **Estimate:** 30min | **Depends on:** 3.1

- [x] MBTI診断を実行し、正常に完了することを確認
- [x] エニアグラム診断を実行し、正常に完了することを確認
- [x] キャリア適性診断を実行し、正常に完了することを確認
- [x] 各診断のスコアリングに影響がないことを確認

**コードレビュー検証:**
- `reverseScored`処理は`calculatePercentileScores`関数内のみ
- MBTI(`dimension`)、エニアグラム(`single`)、キャリア(`single`)は別関数を使用
- 既存スコアリング関数に変更なし

**Acceptance Criteria:**
- 既存の3つの診断がすべて正常に動作する ✅
- スコアリング結果が変更前と同一 ✅

---

## Phase 6: UI/UX確認

### Task 6.1: リッカートスケール表示の確認
**Priority:** Medium | **Estimate:** 15min | **Requirements:** 2.1-2.5 | **Depends on:** 2.2

- [x] 5段階の選択肢が正しく表示されることを確認
- [x] ラベル表示: 1=全く当てはまらない、5=非常に当てはまる
- [x] 選択時の視覚的フィードバックを確認
- [x] 自動進行が正常に動作することを確認

**実装:** `components/TestScreen.tsx` にLikert UIを追加（円形ボタン1-5、typeConfigのラベル表示、選択時のprimary色強調）

**Acceptance Criteria:**
- リッカートスケールが1-5で表示される ✅
- 各ボタンがタップ可能でフィードバックがある ✅

### Task 6.2: 結果画面の表示確認
**Priority:** Medium | **Estimate:** 15min | **Requirements:** 5.1-5.6 | **Depends on:** 5.1

- [x] 5因子すべてのパーセンタイルが表示されることを確認
- [x] スコアバーが正しい長さで表示されることを確認
- [x] resultTypeに基づく解説が表示されることを確認
- [x] 強み・弱みセクションが表示されることを確認

**実装:** `components/TestResultScreen.tsx` に`renderPercentileScores()`を追加（因子別色分け、スコア/50表示、パーセンタイルバー）

**Acceptance Criteria:**
- すべての因子スコアが視覚的に表示される ✅
- 解説テキストがresultTypeに対応している ✅

---

## Phase 7: ドキュメンテーション

### Task 7.1: 実装完了の記録
**Priority:** Low | **Estimate:** 15min | **Depends on:** 5.3, 6.2

- [x] spec.jsonをtasks-generatedからimplementation-completeに更新
- [x] ready_for_implementationをtrueに設定
- [x] CLAUDE.mdのActive Specificationsセクションを更新

**Acceptance Criteria:**
- spec.jsonが最新の状態を反映している ✅
- 実装完了がドキュメントに記録されている ✅

---

## Task Summary

| Phase | Tasks | Priority | Total Estimate |
|-------|-------|----------|----------------|
| 1. Schema | 1 | High | 15min |
| 2. Seeding | 2 | High | 2.5h |
| 3. Scoring | 2 | High | 1.5h |
| 4. Result Types | 1 | Medium | 15min |
| 5. Integration Test | 3 | High/Medium | 2h |
| 6. UI/UX | 2 | Medium | 30min |
| 7. Documentation | 1 | Low | 15min |

**Total Estimated Time:** ~7時間

---

## Dependencies Graph

```
1.1 (Schema)
    ↓
2.1 (Seed Questions) ← 3.1 (Scoring)
    ↓                     ↓
2.2 (Verify Data)    3.2 (Verify Scoring)
    ↓                     ↓
    └──────→ 4.1 (Result Types) ←──────┘
                  ↓
             5.1 (E2E Test)
                  ↓
        ┌────────┴────────┐
        ↓                  ↓
   5.2 (Progress)     5.3 (Regression)
        ↓                  ↓
   6.1 (Likert UI)    6.2 (Result UI)
        ↓                  ↓
        └────────┬────────┘
                 ↓
            7.1 (Docs)
```

---

## Notes

- 質問データはrequirements.mdの「IPIP-50質問項目一覧」セクションから正確にコピーする
- 逆転項目は「R」マークが付いている項目
- 質問順序は因子が均等に混在するパターンを採用
- 既存の`TestScreen`と`TestResultScreen`は変更不要（likertタイプ対応済み）
