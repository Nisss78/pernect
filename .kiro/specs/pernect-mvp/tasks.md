# Implementation Tasks: Pernect MVP

## Overview
このドキュメントはPernect MVPの実装タスクを定義します。
requirements.mdとdesign.mdに基づいて、具体的な実装ステップを記述します。

---

## Phase 1: Core MVP（MBTI診断システム）

### Task 1.1: データベーススキーマ拡張
**Priority**: 🔴 High
**Estimate**: 2時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.1.1: `convex/schema.ts` に `tests` テーブル追加
- [ ] 1.1.2: `convex/schema.ts` に `testQuestions` テーブル追加
- [ ] 1.1.3: `convex/schema.ts` に `testAnswers` テーブル追加
- [ ] 1.1.4: `convex/schema.ts` に `testResults` テーブル追加
- [ ] 1.1.5: `npx convex dev` でスキーマ適用確認

#### Acceptance Criteria
- [ ] すべてのテーブルが正常に作成される
- [ ] インデックスが正しく設定される
- [ ] Convex型が自動生成される

---

### Task 1.2: テスト管理機能（Backend）
**Priority**: 🔴 High
**Estimate**: 3時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.2.1: `convex/tests.ts` 作成 - テスト一覧取得クエリ
- [ ] 1.2.2: `convex/tests.ts` - テスト詳細取得クエリ
- [ ] 1.2.3: `convex/tests.ts` - 質問一覧取得クエリ
- [ ] 1.2.4: MBTIテストの初期データ投入スクリプト作成
- [ ] 1.2.5: 質問データの作成（約50問）

#### Acceptance Criteria
- [ ] テスト一覧がカテゴリ別に取得できる
- [ ] 質問が順序通りに取得できる
- [ ] MBTIテストの全質問データが登録される

---

### Task 1.3: 回答・結果機能（Backend）
**Priority**: 🔴 High
**Estimate**: 4時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.3.1: `convex/testAnswers.ts` 作成 - 回答保存ミューテーション
- [ ] 1.3.2: `convex/testAnswers.ts` - 進捗取得クエリ
- [ ] 1.3.3: `convex/testResults.ts` 作成 - MBTI算出ロジック
- [ ] 1.3.4: `convex/testResults.ts` - 結果保存ミューテーション
- [ ] 1.3.5: `convex/testResults.ts` - 結果一覧/詳細取得クエリ
- [ ] 1.3.6: ユーザーのMBTIフィールド自動更新処理

#### Acceptance Criteria
- [ ] 回答が正しく保存される
- [ ] 中断した場合に進捗が保持される
- [ ] MBTI結果が正しく算出される
- [ ] 結果がユーザープロフィールに反映される

---

### Task 1.4: テスト一覧画面（Frontend）
**Priority**: 🔴 High
**Estimate**: 3時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.4.1: `components/TestListScreen.tsx` 作成
- [ ] 1.4.2: テストカードコンポーネント作成
- [ ] 1.4.3: カテゴリタブ実装
- [ ] 1.4.4: 進捗バッジ表示（未開始/進行中/完了）
- [ ] 1.4.5: HomeScreenからの導線追加

#### Acceptance Criteria
- [ ] テスト一覧が表示される
- [ ] カテゴリでフィルタリングできる
- [ ] 各テストの進捗状態が分かる
- [ ] テストカードタップで診断画面へ遷移

---

### Task 1.5: 診断実行画面（Frontend）
**Priority**: 🔴 High
**Estimate**: 5時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.5.1: `components/TestScreen.tsx` 作成
- [ ] 1.5.2: 質問カードコンポーネント作成
- [ ] 1.5.3: 回答選択UI（スケール/選択肢）
- [ ] 1.5.4: 進捗バー実装
- [ ] 1.5.5: 前へ/次へナビゲーション
- [ ] 1.5.6: 中断確認ダイアログ
- [ ] 1.5.7: 回答の自動保存処理
- [ ] 1.5.8: 完了時の結果算出リクエスト

#### Acceptance Criteria
- [ ] 質問が順番に表示される
- [ ] 回答がリアルタイムで保存される
- [ ] 進捗が視覚的に分かる
- [ ] 中断して戻っても続きから再開できる
- [ ] 全問回答後に結果画面へ遷移

---

### Task 1.6: 結果表示画面（Frontend）
**Priority**: 🔴 High
**Estimate**: 4時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.6.1: `components/TestResultScreen.tsx` 作成
- [ ] 1.6.2: MBTIタイプ表示カード
- [ ] 1.6.3: スコア詳細グラフ（4次元）
- [ ] 1.6.4: 特性説明セクション
- [ ] 1.6.5: 強み/弱みリスト
- [ ] 1.6.6: アドバイスセクション
- [ ] 1.6.7: シェアボタン実装
- [ ] 1.6.8: 履歴一覧への導線

#### Acceptance Criteria
- [ ] MBTIタイプが大きく表示される
- [ ] 各次元のスコアがグラフで分かる
- [ ] 詳細な性格説明が読める
- [ ] SNSシェアができる

---

### Task 1.7: 診断履歴画面（Frontend）
**Priority**: 🟡 Medium
**Estimate**: 2時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 1.7.1: `components/TestHistoryScreen.tsx` 作成
- [ ] 1.7.2: 履歴リストコンポーネント
- [ ] 1.7.3: 時系列フィルタリング
- [ ] 1.7.4: ProfileScreenからの導線追加

#### Acceptance Criteria
- [ ] 過去の診断結果一覧が表示される
- [ ] 各結果をタップで詳細表示
- [ ] 日付でソート/フィルタできる

---

## Phase 2: Enhanced MVP（AIチャット・相性診断）

### Task 2.1: AIチャット機能（Backend）
**Priority**: 🟡 Medium
**Estimate**: 4時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 2.1.1: `convex/chat.ts` 作成
- [ ] 2.1.2: OpenAI API連携（Convex Action）
- [ ] 2.1.3: チャット履歴保存/取得
- [ ] 2.1.4: ユーザーのMBTI情報をコンテキストに含める
- [ ] 2.1.5: レート制限実装

#### Acceptance Criteria
- [ ] AIからの応答が返ってくる
- [ ] ユーザーの性格タイプを考慮した応答になる
- [ ] 履歴が保存される

---

### Task 2.2: AIチャット画面（Frontend）
**Priority**: 🟡 Medium
**Estimate**: 4時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 2.2.1: `components/AIChatScreen.tsx` 更新
- [ ] 2.2.2: メッセージバブルコンポーネント
- [ ] 2.2.3: 入力フォーム（送信ボタン付き）
- [ ] 2.2.4: タイピングインジケーター
- [ ] 2.2.5: 履歴読み込み処理
- [ ] 2.2.6: エラーハンドリング

#### Acceptance Criteria
- [ ] メッセージを送信できる
- [ ] AIの応答が表示される
- [ ] 過去の会話が表示される
- [ ] ローディング状態が分かる

---

### Task 2.3: 相性診断機能
**Priority**: 🟡 Medium
**Estimate**: 3時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 2.3.1: `convex/compatibility.ts` 作成
- [ ] 2.3.2: MBTI相性マトリクスデータ作成
- [ ] 2.3.3: 相性スコア算出ロジック
- [ ] 2.3.4: 相性の詳細説明データ作成

#### Acceptance Criteria
- [ ] 任意の2つのMBTIタイプで相性スコアが算出される
- [ ] 相性の説明が表示される

---

### Task 2.4: 相性診断画面（Frontend）
**Priority**: 🟡 Medium
**Estimate**: 3時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 2.4.1: `components/CompatibilityScreen.tsx` 作成
- [ ] 2.4.2: MBTIタイプ選択UI
- [ ] 2.4.3: 相性スコア表示
- [ ] 2.4.4: 相性説明カード
- [ ] 2.4.5: 相性の良いタイプ推薦リスト

#### Acceptance Criteria
- [ ] 2つのMBTIタイプを選択できる
- [ ] 相性スコアが表示される
- [ ] 詳細な相性説明が読める

---

## Phase 3: Monetization（サブスクリプション）

### Task 3.1: サブスクリプション基盤
**Priority**: 🟢 Low
**Estimate**: 6時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 3.1.1: `convex/subscriptions.ts` 作成
- [ ] 3.1.2: プラン定義データ
- [ ] 3.1.3: ユーザーのプラン状態管理
- [ ] 3.1.4: プレミアム機能のアクセス制御

---

### Task 3.2: 決済連携
**Priority**: 🟢 Low
**Estimate**: 8時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 3.2.1: RevenueCat SDK導入
- [ ] 3.2.2: App Store課金設定
- [ ] 3.2.3: Google Play課金設定
- [ ] 3.2.4: 購入フロー実装
- [ ] 3.2.5: 復元処理実装

---

### Task 3.3: サブスクリプション画面
**Priority**: 🟢 Low
**Estimate**: 4時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] 3.3.1: `components/SubscriptionScreen.tsx` 作成
- [ ] 3.3.2: プラン比較表
- [ ] 3.3.3: 購入ボタン
- [ ] 3.3.4: 現在のプラン表示

---

## Utility Tasks

### Task U.1: ナビゲーション整理
**Priority**: 🟡 Medium
**Estimate**: 2時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] U.1.1: `app/index.tsx` のScreen型拡張
- [ ] U.1.2: 新画面へのルーティング追加
- [ ] U.1.3: BottomNavigation更新

---

### Task U.2: エラーハンドリング強化
**Priority**: 🟡 Medium
**Estimate**: 2時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] U.2.1: グローバルエラーバウンダリ
- [ ] U.2.2: Convexエラーのユーザーフレンドリーなメッセージ変換
- [ ] U.2.3: オフライン状態の検知と表示

---

### Task U.3: ローディング状態の統一
**Priority**: 🟢 Low
**Estimate**: 1時間
**Status**: 🔲 Not Started

#### Subtasks
- [ ] U.3.1: 共通ローディングコンポーネント作成
- [ ] U.3.2: スケルトンローディング実装

---

## Summary

| Phase | Tasks | Estimated Hours |
|-------|-------|-----------------|
| Phase 1 | 7 tasks | 23 hours |
| Phase 2 | 4 tasks | 14 hours |
| Phase 3 | 3 tasks | 18 hours |
| Utility | 3 tasks | 5 hours |
| **Total** | **17 tasks** | **60 hours** |

---

## Recommended Implementation Order

```
Week 1:
├── Task 1.1: スキーマ拡張
├── Task 1.2: テスト管理（Backend）
└── Task 1.3: 回答・結果（Backend）

Week 2:
├── Task 1.4: テスト一覧画面
├── Task 1.5: 診断実行画面
└── Task U.1: ナビゲーション整理

Week 3:
├── Task 1.6: 結果表示画面
├── Task 1.7: 診断履歴画面
└── Task U.2: エラーハンドリング

Week 4:
├── Task 2.1: AIチャット（Backend）
├── Task 2.2: AIチャット画面
└── Task 2.3: 相性診断機能

Week 5:
├── Task 2.4: 相性診断画面
└── QA・バグ修正

Week 6+:
├── Task 3.x: サブスクリプション
└── Task U.3: UI改善
```

---

## Notes

### Dependencies
- Task 1.2 → Task 1.3（テストデータが必要）
- Task 1.3 → Task 1.5, 1.6（結果算出ロジックが必要）
- Task 1.1 → すべてのBackendタスク

### Risks
- MBTI質問データの作成に時間がかかる可能性
- OpenAI APIの料金管理が必要
- App Store/Google Play審査の時間を考慮

### Definition of Done
- [ ] コードがマージされている
- [ ] 関連するテストが通っている
- [ ] UIが設計通りに実装されている
- [ ] エラーハンドリングが実装されている
- [ ] 日本語化されている
