# Expo iOS SDK Starter Kit

Expo, Convex, Clerk, NativeWind を使用した iOS (およびクロスプラットフォーム) アプリ開発のための、本番環境対応スターターキットです。

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

### 4. アプリの実行

```bash
# Convex バックエンドを起動 (実行したままにしてください)
npx convex dev

# Expo アプリを起動 (新しいターミナルで)
npx expo start
```

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
