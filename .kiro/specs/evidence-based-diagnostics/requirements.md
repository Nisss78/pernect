# Requirements Document

## Introduction

本仕様書は、Pernectアプリにおける「科学的根拠に基づく診断システム」の要件を定義します。

心理学研究や学術論文に基づいた信頼性の高い診断テストを提供し、ユーザーが自己理解を深められるプラットフォームを構築します。診断の追加が容易なアーキテクチャ、結果履歴の管理、シェア機能、AI分析連携を通じて、継続的な自己発見をサポートします。

---

## Requirements

### Requirement 1: 拡張可能な診断スキーマ設計

**Objective:** 開発者として、新しい診断テストを容易に追加できるスキーマ設計がほしい。これにより、コードの大幅な変更なしに診断ラインナップを拡充できる。

#### Acceptance Criteria

1. WHEN 新しい診断テストを追加する THEN 診断システム SHALL シードデータの投入のみで新診断を有効化できる
2. WHEN 診断定義を作成する THEN 診断システム SHALL 以下のメタデータを保存できる：
   - タイトル、説明文、カテゴリ
   - 所要時間（分）
   - アイコン、グラデーションカラー
   - 出典情報（著者、論文、年、DOI/URL）
   - スコアリングタイプ（dimension/single/scale）
3. WHEN 質問を定義する THEN 診断システム SHALL 複数の質問タイプをサポートする：
   - 選択式（multiple choice）
   - リッカートスケール（1-5, 1-7等）
   - ペア比較式（forced choice）
   - スライダー式（0-100）
4. WHERE 診断に複数の次元がある THEN 診断システム SHALL 各質問を特定の次元・スコアキーに紐付けできる
5. WHILE 診断定義を管理する THE 診断システム SHALL isActiveフラグで公開/非公開を制御できる

---

### Requirement 2: 科学的根拠情報の管理

**Objective:** ユーザーとして、各診断の科学的根拠を確認したい。これにより、診断結果への信頼性が高まる。

#### Acceptance Criteria

1. WHEN 診断詳細を表示する THEN 診断システム SHALL 出典情報（著者名、論文タイトル、出版年）を表示できる
2. IF 診断に参考文献URLがある THEN 診断システム SHALL ユーザーがタップして外部リンクを開けるようにする
3. WHEN 診断一覧を表示する THEN 診断システム SHALL 各診断の信頼性指標（研究ベース/実証済み等）をバッジで表示できる
4. WHERE カテゴリ別にフィルタする THEN 診断システム SHALL 以下のカテゴリで分類できる：
   - 性格・自己理解（personality）
   - 強み・能力（strength）
   - 対人関係（relationship）
   - ライフスタイル（lifestyle）

---

### Requirement 3: 初期診断セットの提供

**Objective:** ユーザーとして、アプリ起動時から充実した診断ラインナップにアクセスしたい。これにより、すぐに自己分析を始められる。

#### Acceptance Criteria

1. WHEN シードデータを実行する THEN 診断システム SHALL 以下の13診断を投入する：
   - **Tier 1 性格**: MBTI、BIG5（ビッグファイブ）、エニアグラム
   - **Tier 2 強み**: VIA強み診断、グリット診断、EQ診断
   - **Tier 3 対人**: 愛着スタイル、5つの愛の言語、DiSCスタイル
   - **Tier 4 ライフ**: HSP診断、マネースクリプト、ストレスコーピング、VARK学習スタイル
2. WHEN 各診断を投入する THEN 診断システム SHALL 完全な質問セット（10-50問）を含める
3. WHEN 診断結果タイプを定義する THEN 診断システム SHALL 各タイプの詳細分析テンプレート（説明、強み、弱み、推奨事項）を含める
4. IF MBTI診断が既に存在する THEN 診断システム SHALL 既存データを保持しつつ出典情報を追加する

---

### Requirement 4: 診断結果の履歴管理

**Objective:** ユーザーとして、過去の診断結果を履歴として保存・閲覧したい。これにより、自分の変化を追跡できる。

#### Acceptance Criteria

1. WHEN 診断を完了する THEN 診断システム SHALL 結果をtestResultsテーブルに永続的に保存する
2. WHEN 結果を保存する THEN 診断システム SHALL 以下の情報を構造化して保存する：
   - 診断ID、ユーザーID
   - 結果タイプ（ENFP、Type4等）
   - 各次元のスコア（JSON形式）
   - 分析テキスト（summary, strengths[], weaknesses[], recommendations[]）
   - 完了日時
3. WHEN プロフィール画面を表示する THEN 診断システム SHALL 過去の診断結果一覧を新しい順に表示する
4. WHEN 結果履歴を表示する THEN 診断システム SHALL 診断名、結果タイプ、完了日を一覧表示する
5. IF 同じ診断を複数回受験している THEN 診断システム SHALL 結果の推移を時系列で確認できる
6. WHEN 履歴詳細を開く THEN 診断システム SHALL 当時の完全な分析レポートを再表示できる

---

### Requirement 5: 診断結果のシェア機能

**Objective:** ユーザーとして、診断結果を友達やSNSでシェアしたい。これにより、友達との会話のきっかけや自己紹介に使える。

#### Acceptance Criteria

1. WHEN 結果画面で「シェア」ボタンをタップする THEN 診断システム SHALL OSのシェアシートを表示する
2. WHEN シェアを実行する THEN 診断システム SHALL 以下の形式でシェアできる：
   - テキスト（結果サマリー + アプリリンク）
   - 画像（シェアカード）
3. WHEN シェアカードを生成する THEN 診断システム SHALL 以下を含むビジュアルを作成する：
   - 診断名
   - 結果タイプ（例: ENFP - 広報運動家）
   - 主要スコアのビジュアライゼーション
   - Pernectロゴとダウンロードリンク
4. IF ディープリンクからアプリを開く THEN 診断システム SHALL シェア元の診断ページに直接遷移できる
5. WHEN シェア設定を管理する THEN 診断システム SHALL ユーザーが結果の公開/非公開を選択できる

---

### Requirement 6: AI分析連携のためのデータ構造

**Objective:** 開発者として、診断結果をAI分析に適した形式で保存したい。これにより、将来のAIコーチング機能で活用できる。

#### Acceptance Criteria

1. WHEN 結果を保存する THEN 診断システム SHALL AI処理に適したJSON構造で保存する：
   ```json
   {
     "testSlug": "mbti",
     "resultType": "ENFP",
     "scores": { "E": 7, "I": 3, "N": 8, "S": 2, ... },
     "dimensions": ["E", "N", "F", "P"],
     "percentiles": { "E_I": 70, "N_S": 80, ... },
     "completedAt": "2026-01-05T12:00:00Z"
   }
   ```
2. WHEN ユーザーの全診断結果を取得する THEN 診断システム SHALL 一括で構造化データを返すAPIを提供する
3. WHERE AI分析を実行する THEN 診断システム SHALL 複数診断の結果を横断的に参照できる
4. WHEN 診断サマリーを生成する THEN 診断システム SHALL ユーザーの全診断結果から統合プロファイルを作成できる
5. IF 新しい診断結果が追加される THEN 診断システム SHALL AI分析用のキャッシュを自動更新する

---

### Requirement 7: スコアリングエンジンの汎用化

**Objective:** 開発者として、診断タイプに応じた柔軟なスコア計算ロジックがほしい。これにより、多様な診断方式に対応できる。

#### Acceptance Criteria

1. WHEN スコアリングタイプが「dimension」の場合 THEN 診断システム SHALL 対立する次元間のスコア比較で結果タイプを決定する（例: E vs I → E勝ちならE）
2. WHEN スコアリングタイプが「single」の場合 THEN 診断システム SHALL 最高スコアの次元を結果タイプとする（例: Type1-9の最大値）
3. WHEN スコアリングタイプが「scale」の場合 THEN 診断システム SHALL 合計スコアを算出し閾値判定する（例: HSP 60点以上 → 高感受性）
4. WHEN スコアリングタイプが「percentile」の場合 THEN 診断システム SHALL 各次元のパーセンタイルを計算する（例: BIG5の5因子それぞれ）
5. WHERE 複雑な計算ロジックが必要な場合 THEN 診断システム SHALL カスタム計算関数を診断定義で指定できる

---

### Requirement 8: 診断カテゴリとフィルタリング

**Objective:** ユーザーとして、興味のあるカテゴリの診断を簡単に見つけたい。これにより、目的に合った診断をすぐに開始できる。

#### Acceptance Criteria

1. WHEN テスト一覧画面を表示する THEN 診断システム SHALL カテゴリタブでフィルタリングできる
2. WHEN カテゴリを選択する THEN 診断システム SHALL 該当カテゴリの診断のみを表示する
3. WHEN 検索を実行する THEN 診断システム SHALL タイトル、説明文、タグで診断を検索できる
4. WHEN ホーム画面を表示する THEN 診断システム SHALL 以下のセクションを表示する：
   - 人気の診断（受験数順）
   - おすすめ（未受験かつカテゴリマッチ）
   - 新着（最近追加された診断）
5. IF ユーザーが特定の診断を完了している THEN 診断システム SHALL その診断に「受験済み」バッジを表示する

---

### Requirement 9: 診断結果の比較・推移表示

**Objective:** ユーザーとして、同じ診断の過去結果と比較したい。これにより、自分の成長や変化を実感できる。

#### Acceptance Criteria

1. WHEN 同じ診断を2回以上受験している THEN 診断システム SHALL 「過去の結果と比較」ボタンを表示する
2. WHEN 比較画面を表示する THEN 診断システム SHALL 各次元のスコア変化をグラフで可視化する
3. WHEN 推移を表示する THEN 診断システム SHALL 日付ごとの結果タイプの変化を時系列で表示する
4. IF スコアが大きく変化している THEN 診断システム SHALL 変化のハイライトとコメントを表示する
5. WHEN 比較結果を表示する THEN 診断システム SHALL 「成長ポイント」として改善された次元を強調する

---

### Requirement 10: プライバシーとデータ管理

**Objective:** ユーザーとして、自分の診断データを安全に管理したい。これにより、安心してサービスを利用できる。

#### Acceptance Criteria

1. WHEN 診断結果を保存する THEN 診断システム SHALL 認証済みユーザーのみデータにアクセスできる
2. WHEN 設定画面で「診断履歴を削除」をタップする THEN 診断システム SHALL 確認ダイアログ後に全履歴を削除できる
3. WHEN 個別の結果を削除する THEN 診断システム SHALL 特定の診断結果のみを削除できる
4. WHERE データをエクスポートする THEN 診断システム SHALL 全診断結果をJSON形式でダウンロードできる
5. WHILE アプリを使用する THE 診断システム SHALL 診断データを第三者と共有しない（ユーザー同意のシェア機能を除く）

---

## 対象診断一覧（科学的根拠）

| 診断名 | 理論/著者 | カテゴリ | スコアリング |
|--------|-----------|----------|--------------|
| MBTI | ユング/マイヤーズ・ブリッグス | personality | dimension |
| BIG5 | Costa & McCrae | personality | percentile |
| エニアグラム | Riso & Hudson | personality | single |
| VIA強み | セリグマン & ピーターソン | strength | percentile |
| グリット | アンジェラ・ダックワース | strength | scale |
| EQ診断 | ダニエル・ゴールマン | strength | percentile |
| 愛着スタイル | ボウルビィ | relationship | dimension |
| 5つの愛の言語 | ゲイリー・チャップマン | relationship | single |
| DiSCスタイル | ウィリアム・マーストン | relationship | dimension |
| HSP診断 | エレイン・アーロン | lifestyle | scale |
| マネースクリプト | ブラッド・クロンツ | lifestyle | single |
| ストレスコーピング | ラザルス & フォルクマン | lifestyle | percentile |
| VARK学習スタイル | ニール・フレミング | lifestyle | single |

---

## 技術的制約

- Convexスキーマに準拠したデータ構造
- 既存のtests, testQuestions, testResultsテーブルとの互換性維持
- React Native + Expoでのシェア機能実装
- リアルタイム同期によるデータ更新
