# Implementation Tasks: 診断テストシステム

## Overview
診断テストシステムの実装タスク。
シンプルな構造で、MVPとして素早くリリースできることを重視。

---

## Task 1: データベーススキーマ拡張
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 1.1: `convex/schema.ts` に `tests` テーブル追加
- [ ] 1.2: `convex/schema.ts` に `testQuestions` テーブル追加
- [ ] 1.3: `convex/schema.ts` に `testAnswers` テーブル追加
- [ ] 1.4: `convex/schema.ts` に `testResults` テーブル追加
- [ ] 1.5: `npx convex dev` でスキーマ適用確認

### Acceptance Criteria
- [ ] すべてのテーブルが正常に作成される
- [ ] インデックスが正しく設定される
- [ ] Convex型が自動生成される

---

## Task 2: テスト管理Backend
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 2.1: `convex/tests.ts` 作成
- [ ] 2.2: `tests.list` クエリ実装（カテゴリフィルタ対応）
- [ ] 2.3: `tests.getBySlug` クエリ実装
- [ ] 2.4: `tests.getWithQuestions` クエリ実装

### Acceptance Criteria
- [ ] テスト一覧が取得できる
- [ ] カテゴリ別フィルタリングが動作する
- [ ] テスト詳細と質問が取得できる

---

## Task 3: 回答管理Backend
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 3.1: `convex/testAnswers.ts` 作成
- [ ] 3.2: `testAnswers.saveProgress` ミューテーション実装
- [ ] 3.3: `testAnswers.getProgress` クエリ実装
- [ ] 3.4: `testAnswers.clearProgress` ミューテーション実装

### Acceptance Criteria
- [ ] 回答が保存される
- [ ] 進行中の回答が取得できる
- [ ] 完了後に進行データが削除される

---

## Task 4: 結果算出Backend
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 4.1: `convex/testResults.ts` 作成
- [ ] 4.2: `testResults.calculate` ミューテーション実装
- [ ] 4.3: 次元スコア算出ロジック（MBTI用）
- [ ] 4.4: 単一スコア算出ロジック（エニアグラム用）
- [ ] 4.5: `testResults.listByUser` クエリ実装
- [ ] 4.6: `testResults.getLatest` クエリ実装
- [ ] 4.7: usersテーブルへの結果反映処理

### Acceptance Criteria
- [ ] MBTIタイプが正しく算出される
- [ ] 結果がデータベースに保存される
- [ ] ユーザーのプロフィールに反映される
- [ ] 履歴が取得できる

---

## Task 5: 分析データ作成
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 5.1: MBTI 16タイプの分析データ作成
- [ ] 5.2: `getAnalysis` ヘルパー関数作成
- [ ] 5.3: 結果算出時に分析データを付与

### Acceptance Criteria
- [ ] 全16タイプの分析データがある
- [ ] 結果に分析データが含まれる

---

## Task 6: サンプルテストデータ作成
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 6.1: MBTI簡易版テストデータ作成（5問）
- [ ] 6.2: `convex/seedTests.ts` シードスクリプト作成
- [ ] 6.3: シードデータの投入確認

### MBTI質問例（5問）
```
Q1: 新しい人と会うとき、あなたは...
- 多くの人と積極的に話す → E
- 少人数と深く話すことを好む → I

Q2: 情報を得るとき、あなたは...
- 具体的な事実やデータを重視する → S
- 可能性やパターンを重視する → N

Q3: 決断をするとき、あなたは...
- 論理的な分析を重視する → T
- 人の気持ちや価値観を重視する → F

Q4: 仕事の進め方で、あなたは...
- 計画を立てて進めることを好む → J
- 柔軟に対応することを好む → P

Q5: ストレス解消法として、あなたは...
- 人と会って話す → E
- 一人で過ごす → I
```

### Acceptance Criteria
- [ ] MBTIテストがデータベースに存在する
- [ ] 5問の質問がテストに紐づいている
- [ ] フロントエンドから取得できる

---

## Task 7: テスト一覧画面
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 7.1: `components/TestListScreen.tsx` 作成
- [ ] 7.2: テストカードコンポーネント作成
- [ ] 7.3: グラデーションカード実装
- [ ] 7.4: 進捗状態表示（未開始/進行中/完了）
- [ ] 7.5: HomeScreenからの導線追加

### Acceptance Criteria
- [ ] テスト一覧が表示される
- [ ] 各テストの進捗状態が分かる
- [ ] テストカードタップで診断画面へ遷移

---

## Task 8: 診断実行画面
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 8.1: `components/TestScreen.tsx` 作成
- [ ] 8.2: 質問カードコンポーネント作成
- [ ] 8.3: 選択肢ボタン実装
- [ ] 8.4: 進捗バー実装（例: 3/5）
- [ ] 8.5: 前へ/次へナビゲーション
- [ ] 8.6: 回答の自動保存処理
- [ ] 8.7: 完了ボタンと結果算出リクエスト
- [ ] 8.8: 中断確認ダイアログ

### Acceptance Criteria
- [ ] 質問が順番に表示される
- [ ] 選択肢を選べる
- [ ] 進捗が視覚的に分かる
- [ ] 中断して戻っても続きから再開できる
- [ ] 全問回答後に結果画面へ遷移

---

## Task 9: 結果表示画面
**Priority**: 🔴 High
**Status**: 🔲 Not Started

### Subtasks
- [ ] 9.1: `components/TestResultScreen.tsx` 作成
- [ ] 9.2: 結果タイプ表示カード
- [ ] 9.3: スコア詳細表示（4次元バー）
- [ ] 9.4: 特性説明セクション
- [ ] 9.5: 強み/弱みリスト
- [ ] 9.6: アドバイスセクション
- [ ] 9.7: 履歴一覧への導線

### Acceptance Criteria
- [ ] MBTIタイプが大きく表示される
- [ ] 各次元のスコアがバーで分かる
- [ ] 詳細な性格説明が読める
- [ ] 強み・弱み・アドバイスが表示される

---

## Task 10: 診断履歴画面
**Priority**: 🟡 Medium
**Status**: 🔲 Not Started

### Subtasks
- [ ] 10.1: `components/TestHistoryScreen.tsx` 作成
- [ ] 10.2: 履歴リストコンポーネント
- [ ] 10.3: 日付/テスト名/結果表示
- [ ] 10.4: タップで詳細表示
- [ ] 10.5: ProfileScreenからの導線追加

### Acceptance Criteria
- [ ] 過去の診断結果一覧が表示される
- [ ] 各結果をタップで詳細表示
- [ ] 日付順にソートされている

---

## Task 11: ナビゲーション統合
**Priority**: 🟡 Medium
**Status**: 🔲 Not Started

### Subtasks
- [ ] 11.1: `app/index.tsx` のScreen型拡張
- [ ] 11.2: 新画面（test-list, test, test-result, test-history）追加
- [ ] 11.3: HomeScreenの「診断テスト」セクション更新
- [ ] 11.4: ProfileScreenに履歴リンク追加

### Acceptance Criteria
- [ ] 全画面間の遷移が正常に動作する
- [ ] 戻るボタンが適切に機能する

---

## Task 12: 変数活用API
**Priority**: 🟡 Medium
**Status**: 🔲 Not Started

### Subtasks
- [ ] 12.1: `users.ts` に最新診断結果を含めるクエリ追加
- [ ] 12.2: 特定テストの結果を取得するヘルパー関数

### Acceptance Criteria
- [ ] `user.mbti` でMBTI結果を参照できる
- [ ] AIチャット等で診断結果を文脈として使える準備完了

---

## Summary

| Task | Priority | Status |
|------|----------|--------|
| 1. スキーマ拡張 | 🔴 High | 🔲 |
| 2. テスト管理Backend | 🔴 High | 🔲 |
| 3. 回答管理Backend | 🔴 High | 🔲 |
| 4. 結果算出Backend | 🔴 High | 🔲 |
| 5. 分析データ作成 | 🔴 High | 🔲 |
| 6. サンプルテストデータ | 🔴 High | 🔲 |
| 7. テスト一覧画面 | 🔴 High | 🔲 |
| 8. 診断実行画面 | 🔴 High | 🔲 |
| 9. 結果表示画面 | 🔴 High | 🔲 |
| 10. 診断履歴画面 | 🟡 Medium | 🔲 |
| 11. ナビゲーション統合 | 🟡 Medium | 🔲 |
| 12. 変数活用API | 🟡 Medium | 🔲 |

---

## Implementation Order

```
Phase 1: Backend基盤
├── Task 1: スキーマ拡張
├── Task 2: テスト管理Backend
├── Task 3: 回答管理Backend
├── Task 4: 結果算出Backend
├── Task 5: 分析データ作成
└── Task 6: サンプルテストデータ

Phase 2: Frontend実装
├── Task 7: テスト一覧画面
├── Task 8: 診断実行画面
├── Task 9: 結果表示画面
└── Task 11: ナビゲーション統合

Phase 3: 追加機能
├── Task 10: 診断履歴画面
└── Task 12: 変数活用API
```

---

## Dependencies

- Task 2, 3, 4 → Task 1（スキーマが必要）
- Task 6 → Task 2（テスト管理が必要）
- Task 8 → Task 3, 6（回答管理とテストデータが必要）
- Task 9 → Task 4, 5（結果算出と分析データが必要）
- Task 7, 8, 9 → Task 11（画面をナビゲーションに統合）

---

## Notes

### 今後の拡張
- エニアグラム診断の追加
- キャリアタイプ診断の追加
- 質問のランダム化オプション
- 結果のシェア機能
- 相性診断との連携
