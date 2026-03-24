# Implementation Plan

## Phase 1: SDK統合・スキーマ・バックエンド基盤

- [x] 1. Convexスキーマ移行とバックエンド基盤
- [x] 1.1 subscriptionsテーブルをRevenueCat対応に変更する
  - Stripeフィールド（stripeSubscriptionId, stripeCustomerId）を削除する
  - RevenueCatフィールド（revenuecatAppUserId, revenuecatProductId, revenuecatEntitlementId）を追加する
  - by_stripeCustomerIdインデックスを削除し、by_revenuecatAppUserIdインデックスを追加する
  - by_user, by_status, by_user_statusインデックスは維持する
  - _Requirements: 8.1, 8.2_

- [x] 1.2 subscriptionPlansテーブルをRevenueCat対応に変更する
  - stripePriceIdフィールドを削除する
  - revenuecatProductId, revenuecatEntitlementIdフィールドを追加する
  - seedPlansのデータを新しい価格体系（Plus ¥480, Pro ¥980, Max ¥1,980）に更新する
  - 各プランにRevenueCat product IDとentitlement IDを設定する
  - _Requirements: 8.3, 2_

- [x] 1.3 サブスクリプション同期用のConvex mutationを実装する
  - クライアント側から呼ぶ同期用mutation: planId, status, revenuecatAppUserId, currentPeriodEndを受け取り、既存レコードがあれば更新、なければ作成する
  - Webhook用のinternal mutation: revenuecatAppUserIdからユーザーを検索し、イベントタイプに応じてstatusを更新する
  - 既存のStripe Webhook handler（handleStripeWebhook）を削除する
  - createSubscription, cancelSubscriptionのStripe引数を撤去し、RevenueCat対応に書き換える
  - getTierFromPlanId()との互換を確認（plus_*, pro_*, max_*パターン維持）
  - _Requirements: 4.2, 4.3, 4.4, 4.5, 8.1, 8.2_

- [x] 2. RevenueCat Webhook受信エンドポイントを構築する
- [x] 2.1 Convex HTTPルーターとWebhookハンドラーを作成する
  - convex/http.tsにhttpRouterを定義し、POST /revenuecat-webhookエンドポイントを作成する
  - Authorizationヘッダーを環境変数（REVENUECAT_WEBHOOK_SECRET）と照合して検証する
  - 不正なリクエストには401を返す
  - _Requirements: 9.2_

- [x] 2.2 Webhookイベントタイプごとの処理ロジックを実装する
  - INITIAL_PURCHASE / RENEWAL: サブスクリプションをactiveに設定、planIdをproduct_idからマッピング
  - CANCELLATION: cancelAtPeriodEndをtrueに設定（即時解約ではなく期間終了時）
  - UNCANCELLATION: cancelAtPeriodEndをfalseに戻す
  - EXPIRATION: statusをexpiredに変更
  - BILLING_ISSUE: statusをbilling_issueに変更
  - PRODUCT_CHANGE: 新しいproduct_idに基づきplanIdを更新
  - TESTイベントはログのみで200返却
  - ユーザーが見つからない場合はエラーログ＋200返却（RevenueCatのリトライ防止）
  - 本番環境ではSANDBOXイベントを無視する
  - _Requirements: 9.1, 9.3, 9.4, 4.2, 4.5_

## Phase 2: クライアント側SDK統合

- [x] 3. RevenueCat SDKのインストールと初期化
- [x] 3.1 依存パッケージをインストールし設定する
  - react-native-purchasesとexpo-dev-clientをインストールする
  - 環境変数にRevenueCat APIキー（EXPO_PUBLIC_REVENUECAT_API_KEY_IOS, EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID）を追加する
  - _Requirements: 1.1_

- [x] 3.2 RevenueCat product_idとConvex planIdのマッピング設定を作成する
  - 6つのproduct_id（pernect_plus_monthly等）からConvex planId（plus_monthly等）への変換マップを定義する
  - entitlement ID（plus, pro, max）からtierへの変換マップを定義する
  - entitlement優先順位（max > pro > plus）に基づきアクティブなtierを判定するユーティリティ関数を作成する
  - _Requirements: 4.3, 8.2_

- [x] 3.3 SubscriptionProviderコンテキストを実装する
  - アプリ起動時にRevenueCat SDKを初期化する（Platform.OSに応じてiOS/Android APIキーを切り替え）
  - Clerk認証済みユーザーのConvex IDでRevenueCat logIn()を呼び出し、ユーザーを紐付ける
  - ログアウト時にRevenueCat logOut()で匿名ユーザーに戻す
  - CustomerInfoからentitlementを参照し、現在のtier（free/plus/pro/max）を導出する
  - addCustomerInfoUpdateListenerでentitlement変更をリアルタイム反映する
  - getOfferings()でcurrent offeringのパッケージ一覧を取得・保持する
  - SDK初期化失敗時はエラーログを記録し、tier=freeとして通常機能を提供する
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 10.1_

- [x] 3.4 SubscriptionProviderをアプリのプロバイダー階層に組み込む
  - app/_layout.tsxでClerkProvider/ConvexProvider内にSubscriptionProviderを配置する
  - 認証済みの場合のみlogIn()を実行し、未認証時はlogOut()する
  - フォアグラウンド復帰時にgetCustomerInfo()で最新状態を取得し、Convexと同期する
  - _Requirements: 4.1, 4.4_

## Phase 3: 購入フローUI

- [x] 4. プラン選択・購入画面を実装する
- [x] 4.1 PaywallScreenを作成する（既存PlanSelectionScreenを置き換え）
  - SubscriptionProviderのofferingsからパッケージ一覧を取得して表示する
  - 月次/年次の切り替えトグルを実装する
  - 各プランにストアのローカライズ済み価格（priceString）を表示する
  - Plus/Pro/Maxの機能比較を分かりやすく表示する
  - 年次プランの割引率を算出して表示する
  - 現在のプランをハイライト表示し、ボタンラベルを「現在のプラン」にする
  - Offerings読み込み中はスケルトンUIを表示する
  - Offerings取得失敗時はフォールバックとしてConvex subscriptionPlansから表示する
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.2_

- [x] 4.2 購入処理を実装する
  - 「購入」ボタンタップでSubscriptionProviderのpurchase()を呼び出す
  - 購入成功時にConvexのサブスクリプションレコードを即時作成/更新し、成功トーストを表示して画面を閉じる
  - ユーザーキャンセル時は何も表示せず元の状態に戻す
  - ネットワークエラー時は「購入処理に問題が発生しました」トーストを表示する
  - 重複購入時は「既にこのプランに加入しています」を表示する
  - 既存サブスクリプション保有者にはアップグレード/ダウングレードフローを使用する
  - 購入処理中はローディングインジケーターを表示し、二重タップを防ぐ
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 10.2, 10.3_

- [x] 4.3 購入復元機能を実装する
  - PaywallScreenの下部に「購入を復元」ボタンを配置する
  - SubscriptionProviderのrestorePurchases()を呼び出す
  - 復元成功＋アクティブなサブスクリプション発見時はConvexを更新し成功メッセージを表示する
  - 復元してもアクティブなサブスクリプションがない場合は「有効なサブスクリプションが見つかりませんでした」を表示する
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 5. サブスクリプション管理画面を実装する
- [x] 5.1 SubscriptionManageScreenを作成する（既存SubscriptionManagementScreenを置き換え）
  - 現在のプラン名、料金、次回更新日をRevenueCat CustomerInfoから取得して表示する
  - 利用可能な機能一覧を現在のtierに応じて表示する
  - 「プランを変更」ボタンでPaywallScreenに遷移する（現在のプランをhighlightTierとして渡す）
  - 「キャンセル」ボタンで確認ダイアログを表示し、承認後にストアのサブスクリプション管理画面をLinking.openURLで開く
  - キャンセル予約済みの場合はその旨を表示し、キャンセルボタンを無効化する
  - サブスクリプション未購入時はプレミアムプランの訴求UIを表示し、プラン選択画面への導線を提供する
  - _Requirements: 5.1, 5.3, 5.4_

- [x] 5.2 設定画面にサブスクリプション管理への導線を追加する
  - SettingsScreenに「サブスクリプション管理」メニュー項目を追加する
  - 現在のプラン名バッジ（Free/Plus/Pro/Max）をメニュー項目の右側に表示する
  - タップでSubscriptionManageScreenに遷移する
  - Expo Routerのルーティングを設定する（app/settings/subscription.tsxの追加）
  - _Requirements: 5.5_

## Phase 4: 機能ゲーティングと統合

- [x] 6. アップグレード誘導システムを実装する
- [x] 6.1 アップグレード誘導モーダルを作成する
  - 必要なtierと制限された機能名を表示するモーダルコンポーネントを作成する
  - 「プランを見る」ボタンでPaywallScreenに遷移できるようにする
  - モーダルを閉じた場合は元の画面に戻り、制限操作は実行しない
  - tierに応じた訴求メッセージを動的に表示する（Plus向け/Pro向け/Max向け）
  - _Requirements: 7.3, 7.4_

- [x] 6.2 機能ゲーティングフックを実装する
  - 指定tierが必要な機能をガードするカスタムフックを作成する
  - SubscriptionProviderのtierと要求tierを比較し、アクセス可否を判定する
  - アクセス不可の場合はアップグレード誘導モーダルの表示状態を制御する
  - _Requirements: 7.1, 7.2_

- [x] 6.3 既存のAI分析画面にゲーティングを統合する
  - 統合分析画面でFreeユーザーがAI分析実行時にアップグレードモーダル（Plus以上案内）を表示する
  - 深掘り相性分析画面でPlus以下のユーザーにアップグレードモーダル（Pro以上案内）を表示する
  - 既存のサーバーサイドtierチェック（aiActions.ts）は維持し、クライアント側は事前ガードとして機能する
  - _Requirements: 7.1, 7.2_

## Phase 5: クリーンアップと最終統合

- [x] 7. 既存Stripeコードの削除と最終整理
- [x] 7.1 Stripe関連コードを削除する
  - subscriptions.tsからhandleStripeWebhookを削除する
  - createSubscriptionからStripe引数（stripeSubscriptionId, stripeCustomerId等）を削除する
  - 旧PlanSelectionScreenと旧SubscriptionManagementScreenファイルを削除する
  - _Requirements: 8_

- [x] 7.2 エラーハンドリングとエッジケースを最終確認する
  - RevenueCatサービス不可時にキャッシュされたサブスクリプション状態で通常機能が提供されることを確認する
  - Convex同期失敗時にローカルのRevenueCat状態で一時的にプレミアム機能が有効化されることを確認する
  - 全購入エラーパターン（キャンセル、ネットワーク、重複、端末制限）の処理を確認する
  - _Requirements: 10.1, 10.2, 10.3_
