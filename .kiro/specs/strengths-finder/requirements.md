# 強み診断（CliftonStrengths風）要件定義

## 概要

Gallup社のCliftonStrengthsの34テーマをベースにした強み診断テスト。68問の質問でユーザーのTop 5の強みを特定し、キャリアや自己理解に活用できるようにする。

## 機能要件

### FR-1: 診断テスト実行

**FR-1.1: テスト開始**
- ユーザーがテスト一覧から「強み診断」を選択して開始できる
- 開始前にテストの説明（68問、約20分）を表示する

**FR-1.2: 質問表示**
- 68問の質問を1問ずつ順番に表示する
- 各質問は2択の強制選択形式（どちらが自分に当てはまるか）
- 進捗バー（例: 25/68）を表示する

**FR-1.3: 回答保存**
- 各回答をリアルタイムで一時保存（中断対応）
- 診断を中断した場合、再開時に続きから回答可能

**FR-1.4: 結果計算**
- 68問の回答から34テーマのスコアを集計（single scoring）
- スコア上位5テーマをTop 5として結果表示

### FR-2: 結果表示

**FR-2.1: Top 5表示**
- 上位5つの強みテーマを順位付きで表示
- 各テーマの日本語名と英語名を表示
- 各テーマの所属ドメインを表示

**FR-2.2: 詳細分析**
- 各テーマの説明を表示
- 強みの活かし方を表示
- 注意点やアドバイスを表示

**FR-2.3: ドメイン分布**
- 4つのドメイン（実行力/影響力/人間関係構築力/戦略的思考力）の分布を表示
- Top 5がどのドメインに偏っているかを可視化

### FR-3: データ保存

**FR-3.1: 結果保存**
- 診断結果をtestResultsテーブルに保存
- Top 5テーマと全34テーマのスコアを保存

**FR-3.2: 履歴管理**
- 過去の診断結果を履歴として保持

## 非機能要件

### NFR-1: パフォーマンス
- 質問切り替えは300ms以内で完了
- 結果計算は1秒以内で完了

### NFR-2: ユーザビリティ
- 質問選択後に自動で次の質問へ進む（300ms待機後）
- 戻るボタンで前の質問に戻れる

### NFR-3: 信頼性
- 回答の一時保存により中断しても再開可能

## 受け入れ基準

### AC-1: テスト実行
- [ ] 68問すべて回答できる
- [ ] 進捗バーが正しく表示される
- [ ] 中断後に再開できる

### AC-2: 結果表示
- [ ] Top 5テーマが正しく表示される
- [ ] 各テーマの説明が表示される
- [ ] ドメイン分布が表示される

### AC-3: データ整合性
- [ ] testResultsに正しく保存される
- [ ] 既存の診断に影響がない

## 技術仕様

### スコアリング
- **タイプ**: single
- **テーマ数**: 34テーマ
- **各テーマの質問数**: 2問
- **計算方法**: calculateSingleScores()を使用

### 34テーマの4ドメイン分類

**実行力（Executing）- 9テーマ**
- Achiever, Arranger, Belief, Consistency, Deliberative, Discipline, Focus, Responsibility, Restorative

**影響力（Influencing）- 8テーマ**
- Activator, Command, Communication, Competition, Maximizer, Self-Assurance, Significance, Woo

**人間関係構築力（Relationship Building）- 9テーマ**
- Adaptability, Connectedness, Developer, Empathy, Harmony, Includer, Individualization, Positivity, Relator

**戦略的思考力（Strategic Thinking）- 8テーマ**
- Analytical, Context, Futuristic, Ideation, Input, Intellection, Learner, Strategic

### UI
- **グラデーション**: #f59e0b → #ef4444（Amber→Red）
- **アイコン**: star
