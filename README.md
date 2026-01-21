# Pernect

Expo, Convex, Clerk, NativeWind を使用した自己分析AIアプリです。

## 🚀 機能

*   **フレームワーク:** Expo SDK 52 (最新)
*   **言語:** TypeScript
*   **バックエンド & DB:** Convex (リアルタイムデータベース)
*   **認証:** Clerk (Convex と統合済み)
*   **スタイリング:** NativeWind v4 (Tailwind CSS)
*   **UI コンポーネント:** `components/ui` 内のカスタム再利用可能コンポーネント
*   **通知:** Expo Notifications (Push Token を Convex と同期)
*   **国際化 (i18n):** i18next (英語 & 日本語対応済み)
*   **トースト通知:** sonner-native

## 🤖 AI 自動セットアップ

このプロジェクトには、AI エージェント (Claude Code, GitHub Copilot など) に初期設定を任せるためのプロンプトが含まれています。
`AI_SETUP_PROMPT.md` の内容を AI に渡すことで、環境構築をスムーズに行うことができます。

## 🛠 セットアップガイド

### 1. クローン & インストール

```bash
git clone <your-repo-url> my-app
cd my-app
npm install
```

### 2. 環境変数

ルートディレクトリに `.env` ファイルを作成してください:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CONVEX_URL=https://...
```

*   **Clerk:** [Clerk Dashboard](https://dashboard.clerk.com) から Publishable Key を取得してください。
*   **Convex:** `npx convex dev` を実行して Convex URL を生成してください。

### 3. Convex & Clerk 統合 (重要!)

Convex が Clerk の認証を理解できるように、Clerk で JWT テンプレートを設定する必要があります。

1.  **Clerk Dashboard** > **JWT Templates** に移動します。
2.  `convex` という名前で新しいテンプレートを作成します。
3.  **重要:** "Customize session token" セクションで、`"aud": "convex"` を追加してください。

    ```json
    {
      "aud": "convex",
      "email": "{{user.primary_email_address}}",
      "sub": "{{user.id}}"
    }
    ```

4.  テンプレートから **Issuer URL** をコピーします。
5.  `convex/auth.config.ts` に貼り付けます:

    ```typescript
    export default {
      providers: [
        {
          domain: "https://your-issuer-url.clerk.accounts.dev",
          applicationID: "convex",
        },
      ],
    };
    ```

### 4. Googleログインの有効化（オプション）

アプリにはGoogleログイン機能が実装されています。有効化するには、Clerkダッシュボードで以下の設定を行ってください：

1. **Clerk Dashboard** > **User & Authentication** > **Social Connections** に移動します。
2. **Google** を探してクリックします。
3. **Enable for sign-up and sign-in** をオンにします。
4. Google OAuth設定を選択：
   - **Option 1（推奨）:** "Use Clerk's development keys" を選択（テスト用）
   - **Option 2:** 本番環境の場合、Google Cloud Consoleで独自のOAuth認証情報を作成し、Client IDとSecretを設定

**注意事項:**
- Expo Goアプリでテストする場合、Clerkの開発用キーが使えます
- 本番環境（iOS/Android）では、独自のGoogle OAuth認証情報が必要です
- Redirect URLは自動的にClerkが管理します

**ボタンの外観:**
- サインイン画面とサインアップ画面に「Googleでログイン/登録」ボタンが表示されます
- Googleアイコン付きの白いボタンです

### 5. アプリの実行

```bash
# Convex バックエンドを起動 (実行したままにしてください)
npx convex dev

# Expo アプリを起動 (新しいターミナルで)
npx expo start
```

---

## 🚀 TestFlightへのデプロイ

### 前提条件

1. **Apple Developer Program**のアカウント（年間$99）
2. **Expo アカウント**（無料で作成可能）
3. **EAS CLI**がインストール済み

```bash
npm install -g eas-cli
eas login
```

### ステップ1: プロジェクトの準備

プロジェクトをEASにリンクします（初回のみ）：

```bash
eas build:configure
```

### ステップ2: iOSビルドの実行

**オプションA: 本番ビルド（TestFlight用）**

```bash
npm run build:ios
# または
eas build --platform ios --profile production
```

**オプションB: プレビュービルド（内部テスト用）**

```bash
npm run build:ios:preview
# または
eas build --platform ios --profile preview
```

### ステップ3: Apple Developer設定

初回ビルド時、以下の情報を求められます：

1. **Apple ID**: Apple Developerアカウントのメールアドレス
2. **Apple Team ID**: Apple Developer Programのチーム識別子
3. **App Store Connect App ID**: アプリの一意識別子（自動生成可能）
4. **Bundle Identifier**: `com.pernect.app`（app.jsonで設定済み）

**ビルドプロセス:**
- ビルドはEASクラウド上で実行されます（15〜30分）
- ビルド完了後、`.ipa`ファイルがダウンロード可能になります

### ステップ4: App Store Connectへの提出

**方法1: EAS Submit（推奨・自動）**

```bash
npm run submit:ios
# または
eas submit --platform ios
```

EASが自動的に以下を実行します：
- App Store Connectにアプリをアップロード
- TestFlightで利用可能になるまで処理

**方法2: 手動アップロード**

1. ビルド完了後、`.ipa`ファイルをダウンロード
2. **Transporter**アプリを使用してApp Store Connectにアップロード
3. App Store Connectでアプリを承認

### ステップ5: TestFlightでのテスト

1. **App Store Connect**にログイン
2. **My Apps** > **pernect** を選択
3. **TestFlight**タブに移動
4. **内部テスター**または**外部テスター**を追加
5. テスターにメール招待が送信されます

**テスター追加:**
- **内部テスター**: チームメンバー（最大100人、即座に利用可能）
- **外部テスター**: 一般ユーザー（最大10,000人、Appleの審査が必要）

### トラブルシューティング

**ビルドエラー:**
```bash
# キャッシュをクリアして再ビルド
eas build --platform ios --clear-cache
```

**証明書の問題:**
```bash
# 証明書を再生成
eas credentials
```

**ログの確認:**
```bash
# ビルドログを表示
eas build:list
eas build:view [build-id]
```

### 便利なコマンド

```bash
# ビルド一覧を表示
eas build:list

# 最新ビルドのステータスを確認
eas build:view

# ビルドをキャンセル
eas build:cancel [build-id]

# 証明書を管理
eas credentials

# デバイスを登録（AdHoc/Development用）
eas device:create
```

### 注意事項

1. **ビルド時間**: 初回ビルドは15〜30分かかります
2. **ビルド制限**: Expoの無料プランでは月30ビルドまで
3. **App Store審査**: 外部テスター向けには、Appleの審査（1〜2日）が必要
4. **バージョン管理**: `app.json`の`version`と`buildNumber`を更新してビルドを区別

### アップデート手順

1. コードを変更
2. `app.json`の`buildNumber`を増加（例: `1.0.0` → `1.0.1`）
3. ビルドを実行: `npm run build:ios`
4. 提出: `npm run submit:ios`
5. TestFlightで新バージョンが利用可能

---

## 📂 プロジェクト構造

```
/app                # Expo Router ページ
  /(auth)           # サインイン / サインアップページ
  index.tsx         # ホームページ
  _layout.tsx       # ルートレイアウト (プロバイダー設定)
/components
  /ui               # 再利用可能な UI コンポーネント (Button, Input, Typography)
/convex             # バックエンド関数 & スキーマ
  schema.ts         # データベーススキーマ
  users.ts          # ユーザーミューテーション
  auth.config.ts    # 認証設定
/lib
  auth.ts           # トークンキャッシュ
  i18n.ts           # 多言語化設定
  notifications.ts  # プッシュ通知ロジック
```

## 🔔 プッシュ通知

アプリはログイン時に自動的に通知許可をリクエストし、Expo Push Token を Convex の `users` テーブルに同期します。

## 🌍 国際化 (Localization)

`lib/i18n.ts` を編集して、言語を追加したりテキストを変更したりできます。

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('welcome')}</Text>
```
