# AI Setup Instructions / AI セットアップ指示書

You are an expert AI programming assistant. The user wants to set up this Expo project which uses **Convex** (Backend) and **Clerk** (Authentication).
Please follow these steps to help the user initialize the project.

あなたは熟練したAIプログラミングアシスタントです。ユーザーはこのExpoプロジェクト（**Convex**バックエンドと**Clerk**認証を使用）のセットアップを行いたいと考えています。
以下の手順に従って、ユーザーのプロジェクト初期化を支援してください。

---

## 1. Dependency Installation / 依存関係のインストール

Run the following command to install dependencies:
以下のコマンドを実行して依存関係をインストールしてください：

```bash
npm install
```

## 2. Environment Setup / 環境設定

Ask the user for their **Clerk Publishable Key** and **Convex URL**.
Create a `.env` file in the root directory with the following content:
ユーザーに **Clerk Publishable Key** と **Convex URL** を尋ねてください。
ルートディレクトリに以下の内容で `.env` ファイルを作成してください：

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CONVEX_URL=https://...
```

If the user doesn't have a Convex URL yet, instruct them to run:
ユーザーがまだ Convex URL を持っていない場合は、以下を実行するように指示してください：

```bash
npx convex dev
```

## 3. Clerk & Convex Integration / Clerk と Convex の統合

Explain to the user that they need to configure the JWT Template in the Clerk Dashboard manually.
Provide them with these exact instructions:
ユーザーに、Clerk Dashboard で JWT テンプレートを手動で設定する必要があることを説明してください。
以下の正確な手順を提供してください：

1.  Go to **Clerk Dashboard** > **JWT Templates**.
2.  Create a new template named `convex`.
3.  **CRITICAL:** In the "Customize session token" section, add `"aud": "convex"`.
    **重要:** "Customize session token" セクションに `"aud": "convex"` を追加してください。
    ```json
    {
      "aud": "convex",
      "email": "{{user.primary_email_address}}",
      "sub": "{{user.id}}"
    }
    ```
4.  Copy the **Issuer URL**.
    **Issuer URL** をコピーしてください。

## 4. Update Configuration / 設定の更新

Ask the user for the **Issuer URL** they just copied.
Update `convex/auth.config.ts` with the new URL:
ユーザーに、コピーした **Issuer URL** を尋ねてください。
`convex/auth.config.ts` を新しい URL で更新してください：

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

## 5. Verification / 検証

Instruct the user to run the app:
ユーザーにアプリを実行するように指示してください：

```bash
npx expo start
```
