# Requirements Document

## Introduction

PernectアプリにRevenueCat SDKを使用したアプリ内課金（サブスクリプション）を統合する。現在Stripe前提で構築されたプラン選択画面・管理画面・Convexスキーマを、RevenueCat（react-native-purchases）ベースに置き換え、iOS App Store / Google Play Storeのネイティブ課金と連携させる。

既存のtier判定ロジック（`aiActions.ts`の`getTierFromPlanId()`）およびCloud Run Agent Serviceのモデルティア制御との整合性を維持する。

## Requirements

### Requirement 1: RevenueCat SDK初期化と構成

**Objective:** 開発者として、RevenueCat SDKをExpo managed workflowで正しく初期化し、アプリ起動時にストア接続を確立したい。課金処理の基盤を整えるため。

#### Acceptance Criteria

1. WHEN アプリが起動した THEN Pernectアプリ SHALL RevenueCat SDKを`app_user_id`なし（匿名）で初期化する
2. WHEN ユーザーがClerk認証でログインした THEN Pernectアプリ SHALL RevenueCatの`logIn()`を呼び出し、ConvexユーザーIDをRevenueCatのapp_user_idとして紐付ける
3. WHEN ユーザーがログアウトした THEN Pernectアプリ SHALL RevenueCatの`logOut()`を呼び出して匿名ユーザーに戻す
4. IF RevenueCat SDKの初期化に失敗した THEN Pernectアプリ SHALL エラーをログに記録し、課金関連UIを無効化した状態で通常機能を提供する

### Requirement 2: プラン構成とOfferings

**Objective:** プロダクトマネージャーとして、Plus/Pro/Maxの3段階プランを月次・年次で提供し、RevenueCatのOfferings機能で動的に管理したい。価格変更をアプリアップデートなしで反映するため。

#### Acceptance Criteria

1. WHEN ユーザーがプラン選択画面を開いた THEN Pernectアプリ SHALL RevenueCatのcurrent offeringから利用可能なパッケージ一覧を取得して表示する
2. WHEN RevenueCatからOfferingsを取得した THEN Pernectアプリ SHALL 各パッケージのストア価格（ローカライズ済み）を表示する
3. IF Offeringsの取得に失敗した THEN Pernectアプリ SHALL ローカルにキャッシュされたプラン情報をフォールバックとして表示する
4. WHILE プラン情報が読み込み中 THE Pernectアプリ SHALL スケルトンUIを表示する

プラン構成:
| プラン | 月額 | 年額 | AI分析 | 日次上限 |
|--------|------|------|--------|---------|
| Plus | ¥480 | ¥4,800 | Haiku 3.5 | 10回/日 |
| Pro | ¥980 | ¥9,800 | Sonnet 4 + 深掘り相性分析 | 30回/日 |
| Max | ¥1,980 | ¥19,800 | Sonnet 4 + 全機能 | 30回/日 |

### Requirement 3: 購入フロー

**Objective:** ユーザーとして、プラン選択画面からワンタップでサブスクリプションを購入したい。スムーズに有料機能を利用開始するため。

#### Acceptance Criteria

1. WHEN ユーザーがプランの「購入」ボタンをタップした THEN Pernectアプリ SHALL RevenueCatの`purchasePackage()`を呼び出してネイティブの購入ダイアログを表示する
2. WHEN 購入が成功した THEN Pernectアプリ SHALL Convexの`subscriptions`テーブルにサブスクリプションレコードを作成し、即座にプレミアム機能を有効化する
3. WHEN 購入が成功した THEN Pernectアプリ SHALL 成功トーストを表示し、プラン選択画面を閉じる
4. IF ユーザーが購入をキャンセルした THEN Pernectアプリ SHALL 購入前の状態に戻し、エラーメッセージを表示しない
5. IF 購入処理中にネットワークエラーが発生した THEN Pernectアプリ SHALL 「購入処理に問題が発生しました。しばらくしてからもう一度お試しください」と表示する
6. IF ユーザーが既にアクティブなサブスクリプションを持っている THEN Pernectアプリ SHALL ストアのプラン変更（アップグレード/ダウングレード）フローを使用する

### Requirement 4: サブスクリプション状態の同期

**Objective:** システムとして、RevenueCatとConvexデータベース間でサブスクリプション状態をリアルタイムに同期したい。正確なtier判定とアクセス制御を維持するため。

#### Acceptance Criteria

1. WHEN アプリがフォアグラウンドに復帰した THEN Pernectアプリ SHALL RevenueCatの`getCustomerInfo()`で最新のサブスクリプション状態を確認し、Convexと同期する
2. WHEN RevenueCatからWebhookイベントを受信した THEN Convexバックエンド SHALL サブスクリプションステータスを更新する（`active` / `cancelled` / `expired`）
3. WHEN サブスクリプションの`planId`が更新された THEN `getTierFromPlanId()`関数 SHALL 正しいtier（`plus` / `pro` / `max`）を返す
4. IF RevenueCatのentitlementが`active`で AND Convexの`subscriptions`レコードが存在しない THEN Pernectアプリ SHALL 新しいサブスクリプションレコードを自動作成する（リストア対応）
5. WHEN サブスクリプションが期限切れになった THEN Convexバックエンド SHALL ステータスを`expired`に変更し、AI分析機能へのアクセスを即座に制限する

### Requirement 5: サブスクリプション管理

**Objective:** ユーザーとして、現在のプラン情報を確認し、プラン変更やキャンセルを行いたい。サブスクリプションを自分でコントロールするため。

#### Acceptance Criteria

1. WHEN ユーザーがサブスクリプション管理画面を開いた THEN Pernectアプリ SHALL 現在のプラン名、料金、次回更新日、利用可能な機能一覧を表示する
2. WHEN ユーザーが「プランを変更」をタップした THEN Pernectアプリ SHALL プラン選択画面に遷移し、現在のプランをハイライトする
3. WHEN ユーザーが「キャンセル」をタップした THEN Pernectアプリ SHALL 確認ダイアログを表示し、承認後にストアのサブスクリプション管理画面に遷移する
4. WHEN ユーザーがサブスクリプション管理画面を開いた AND サブスクリプションが未購入 THEN Pernectアプリ SHALL プレミアムプランの訴求UIとプラン選択への導線を表示する
5. WHERE 設定画面 THE Pernectアプリ SHALL 「サブスクリプション管理」メニュー項目を表示し、現在のプラン名バッジを併記する

### Requirement 6: 購入復元

**Objective:** ユーザーとして、デバイス変更やアプリ再インストール後に購入済みサブスクリプションを復元したい。再度支払いすることなく有料機能を使うため。

#### Acceptance Criteria

1. WHEN ユーザーが「購入を復元」ボタンをタップした THEN Pernectアプリ SHALL RevenueCatの`restorePurchases()`を呼び出す
2. WHEN 復元が成功し AND アクティブなサブスクリプションが見つかった THEN Pernectアプリ SHALL Convexのサブスクリプションレコードを更新し、成功メッセージを表示する
3. IF 復元したが AND アクティブなサブスクリプションが見つからなかった THEN Pernectアプリ SHALL 「有効なサブスクリプションが見つかりませんでした」と表示する

### Requirement 7: 機能ゲーティングとアップグレード誘導

**Objective:** プロダクトマネージャーとして、無料ユーザーがプレミアム機能にアクセスしようとした時にアップグレードを促したい。コンバージョンを向上させるため。

#### Acceptance Criteria

1. WHEN Freeユーザーが統合AI分析を実行しようとした THEN Pernectアプリ SHALL アップグレード誘導モーダルを表示し、Plus以上のプランを案内する
2. WHEN Plus以下のユーザーが深掘り相性分析を実行しようとした THEN Pernectアプリ SHALL アップグレード誘導モーダルを表示し、Pro以上のプランを案内する
3. WHEN アップグレード誘導モーダルが表示された THEN Pernectアプリ SHALL 「プランを見る」ボタンでプラン選択画面に直接遷移できる
4. IF ユーザーがモーダルを閉じた THEN Pernectアプリ SHALL 元の画面に戻り、制限された操作は実行しない

### Requirement 8: Convexスキーマの移行

**Objective:** 開発者として、既存のStripe前提のスキーマをRevenueCat対応に変更したい。決済プロバイダーの切り替えを完了するため。

#### Acceptance Criteria

1. WHEN サブスクリプションが作成・更新された THEN Convexバックエンド SHALL RevenueCatの識別子（`revenuecatId`、`entitlementId`）を保存する
2. WHEN `planId`が保存される THEN Convexバックエンド SHALL 既存の命名規則（`plus_monthly`, `pro_yearly`等）を維持し、`getTierFromPlanId()`との互換性を保つ
3. WHEN サブスクリプションプラン情報を取得する THEN Convexバックエンド SHALL `subscriptionPlans`テーブルから`revenuecatProductId`を参照できる

### Requirement 9: Webhook連携

**Objective:** システムとして、RevenueCat Server-to-Server Webhookを受信し、サブスクリプション状態をサーバーサイドで同期したい。クライアント側の操作に依存せず正確な状態を維持するため。

#### Acceptance Criteria

1. WHEN RevenueCatからWebhookイベント（`INITIAL_PURCHASE`, `RENEWAL`, `CANCELLATION`, `EXPIRATION`）を受信した THEN Convex HTTPエンドポイント SHALL サブスクリプションステータスを適切に更新する
2. WHEN Webhookを受信した THEN Convex HTTPエンドポイント SHALL RevenueCatの`Authorization`ヘッダーでリクエストを検証する
3. IF Webhookイベントに該当するユーザーが見つからない THEN Convex HTTPエンドポイント SHALL エラーをログに記録し、200レスポンスを返す（リトライ防止）
4. WHEN `CANCELLATION`イベントを受信した THEN Convexバックエンド SHALL `cancelAtPeriodEnd`を`true`に設定し、現在の期間終了までサービスを継続する

### Requirement 10: エラーハンドリングとエッジケース

**Objective:** ユーザーとして、決済に関するエラーや予期しない状態でも安全にアプリを使い続けたい。課金関連の問題でアプリ全体が使えなくなることを防ぐため。

#### Acceptance Criteria

1. IF RevenueCatサービスが利用不可の場合 THEN Pernectアプリ SHALL 直近のキャッシュされたサブスクリプション状態を使用し、通常機能を提供し続ける
2. WHEN ユーザーが同じプランを重複購入しようとした THEN Pernectアプリ SHALL 「既にこのプランに加入しています」と表示し、購入処理を開始しない
3. IF Convexとの同期に失敗した AND ストア購入は成功した THEN Pernectアプリ SHALL ローカルのRevenueCat状態に基づいて一時的にプレミアム機能を有効化し、バックグラウンドで同期をリトライする
