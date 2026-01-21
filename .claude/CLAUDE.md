# Pernect - 自己分析AIアプリ プロジェクトガイド

## 🎯 プロジェクト概要

**Pernect（パーネクト）**は、AI分析による自己発見プラットフォームです。MBTI診断、キャリアパス分析、愛の言語、学習スタイルなど、多様な心理テストと自己分析ツールを提供するモバイルアプリです。

### ビジョン
ユーザーが自分自身を深く理解し、より良い人生の選択をサポートすることを目的としています。

---

## 📚 技術スタック

### フロントエンド
| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Expo** | ~54.0.25 | モバイルアプリフレームワーク |
| **React Native** | 0.81.5 | UIレンダリング |
| **TypeScript** | ~5.9.2 | 型安全な開発 |
| **Expo Router** | ~6.0.15 | ファイルベースルーティング |
| **NativeWind** | ^4.2.1 | Tailwind CSSスタイリング |

### バックエンド & データベース
| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Convex** | ^1.29.3 | リアルタイムBaaS & データベース |
| **Convex Functions** | - | サーバーレス関数（mutation/query） |

### 認証
| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Clerk** | ^2.19.4 | OAuth認証プロバイダー |
| **Expo Secure Store** | ^15.0.7 | セキュアなトークンキャッシュ |
| **Expo Auth Session** | ^7.0.9 | 認証フロー管理 |

### UI & UX
| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Expo Vector Icons** | ^15.0.3 | アイコンライブラリ |
| **Expo Linear Gradient** | ~15.0.7 | グラデーション効果 |
| **Lottie React Native** | ^7.3.4 | アニメーション |
| **Sonner Native** | ^0.21.1 | トースト通知 |

### 国際化 & 通知
| 技術 | バージョン | 用途 |
|------|-----------|------|
| **i18next** | ^25.6.3 | 国際化（i18n） |
| **React i18next** | ^16.3.5 | React統合 |
| **Expo Notifications** | ^0.32.13 | プッシュ通知 |

---

## 🏗️ アーキテクチャ

### 全体構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Application (Expo)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Home       │  │ Profile    │  │ Settings   │            │
│  │ Screen     │  │ Screen     │  │ Screen     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                         │                                     │
│              ┌──────────▼──────────┐                         │
│              │   Expo Router       │                         │
│              │   (Navigation)      │                         │
│              └──────────┬──────────┘                         │
│                         │                                     │
│         ┌───────────────┴───────────────┐                   │
│         │                                 │                   │
│  ┌──────▼──────┐                  ┌─────▼─────┐            │
│  │   Clerk     │                  │  Convex   │            │
│  │   Auth      │◄─────JWT────────►│  Provider │            │
│  └─────────────┘                  └───────────┘            │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Convex Backend (BaaS)                      │
│  ┌────────────────┐  ┌────────────────┐                     │
│  │   Functions    │  │   Database     │                     │
│  │  - users.ts    │  │   - users      │                     │
│  │  - queries     │  │   - (future)   │                     │
│  │  - mutations   │  │                │                     │
│  └────────────────┘  └────────────────┘                     │
│           │                    │                              │
│           └────────────────────┘                              │
│                    │                                          │
│            ┌───────▼────────┐                                │
│            │  auth.config   │                                │
│            │  (Clerk JWT)   │                                │
│            └────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│               Clerk Authentication Service                   │
│  - OAuth Providers (Google, Apple, etc.)                    │
│  - JWT Token Management                                      │
│  - User Session Management                                   │
└─────────────────────────────────────────────────────────────┘
```

### データフロー

#### 1. **認証フロー**
```
User → Clerk Sign In → JWT Token → Convex Auth → Store User
                                        ↓
                              Secure Store (Token Cache)
```

#### 2. **データ取得フロー**
```
Component → useQuery(Convex) → Convex Function → Database → Real-time Update
```

#### 3. **データ更新フロー**
```
Component → useMutation(Convex) → Convex Function → Database → Auto-Revalidation
```

#### 4. **プッシュ通知フロー**
```
App Start → Request Permission → Get Expo Token → Store in Convex → Enable Notifications
```

---

## 📂 プロジェクト構造

```
pernect/
├── app/                          # Expo Router ページ
│   ├── (auth)/                   # 認証グループ
│   │   ├── sign-in.tsx          # サインイン画面
│   │   └── sign-up.tsx          # サインアップ画面
│   ├── _layout.tsx              # ルートレイアウト（プロバイダー設定）
│   ├── index.tsx                # メイン画面（タブ管理）
│   └── +not-found.tsx           # 404画面
│
├── components/                   # UIコンポーネント
│   ├── HomeScreen.tsx           # ホーム画面コンポーネント
│   ├── ProfileScreen.tsx        # プロフィール画面コンポーネント
│   ├── SettingsScreen.tsx       # 設定画面コンポーネント
│   ├── WelcomeScreen.tsx        # ウェルカム画面
│   └── ActionMenu.tsx           # アクションメニュー
│
├── convex/                       # Convexバックエンド
│   ├── schema.ts                # データベーススキーマ定義
│   ├── users.ts                 # ユーザー関連の関数
│   ├── auth.config.ts           # 認証設定（Clerk統合）
│   └── _generated/              # 自動生成ファイル
│
├── lib/                          # ユーティリティ
│   ├── auth.ts                  # トークンキャッシュ実装
│   ├── i18n.ts                  # 国際化設定
│   └── notifications.ts         # プッシュ通知ロジック
│
├── assets/                       # 静的リソース
│   └── images/                  # 画像ファイル
│
├── .env                          # 環境変数（ローカル）
├── app.json                      # Expo設定
├── package.json                  # 依存関係
├── tailwind.config.js            # Tailwind CSS設定
└── tsconfig.json                 # TypeScript設定
```

---

## 🔧 主要ライブラリの使用方法

### 1. **Convex（バックエンド & データベース）**

#### 目的
リアルタイムデータベースとサーバーレス関数を提供するBaaS（Backend as a Service）

#### 使用方法

**データベーススキーマ定義（`convex/schema.ts`）**
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),      // Clerk JWT識別子
    email: v.optional(v.string()),    // メールアドレス
    name: v.optional(v.string()),     // ユーザー名
    image: v.optional(v.string()),    // プロフィール画像
    pushToken: v.optional(v.string()) // プッシュ通知トークン
  }).index("by_token", ["tokenIdentifier"]),

  // 今後追加予定のテーブル：
  // - tests: 心理テスト定義
  // - testResults: テスト結果
  // - userProgress: ユーザー進捗
  // - analytics: 分析データ
});
```

**Mutation（データ更新）の定義（`convex/users.ts`）**
```typescript
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ユーザー情報を保存・更新
export const store = mutation({
  args: {
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authentication required");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      // 既存ユーザーの更新
      await ctx.db.patch(user._id, {
        name: identity.name,
        pushToken: args.pushToken
      });
      return user._id;
    }

    // 新規ユーザーの作成
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name,
      email: identity.email,
      image: identity.pictureUrl,
      pushToken: args.pushToken,
    });
  },
});
```

**Query（データ取得）の定義**
```typescript
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
  },
});
```

**フロントエンドでの使用**
```typescript
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Mutation（更新）
const storeUser = useMutation(api.users.store);
await storeUser({ pushToken: "expo-token-123" });

// Query（取得）- リアルタイム更新
const currentUser = useQuery(api.users.current);
```

#### 今後の拡張計画
```typescript
// テスト定義テーブル
tests: defineTable({
  title: v.string(),
  description: v.string(),
  category: v.string(), // "personality", "career", "love", etc.
  duration: v.number(), // 分単位
  questions: v.array(v.object({
    id: v.string(),
    text: v.string(),
    type: v.string(), // "multiple", "scale", "text"
    options: v.optional(v.array(v.string()))
  })),
  gradient: v.object({
    start: v.string(),
    end: v.string()
  }),
  icon: v.string(),
  rating: v.number()
}),

// テスト結果テーブル
testResults: defineTable({
  userId: v.id("users"),
  testId: v.id("tests"),
  answers: v.array(v.any()),
  score: v.optional(v.number()),
  analysis: v.object({
    type: v.string(),       // "ENFP", "キャリア適性", etc.
    description: v.string(),
    strengths: v.array(v.string()),
    recommendations: v.array(v.string())
  }),
  completedAt: v.number()
}).index("by_user", ["userId"])
  .index("by_test", ["testId"]),
```

---

### 2. **Clerk（認証）**

#### 目的
OAuth認証、ユーザー管理、セッション管理を提供

#### 使用方法

**プロバイダー設定（`app/_layout.tsx`）**
```typescript
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache} // セキュアストア連携
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <RootLayoutNav />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

**トークンキャッシュ（`lib/auth.ts`）**
```typescript
import * as SecureStore from 'expo-secure-store';

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};
```

**Convex統合設定（`convex/auth.config.ts`）**
```typescript
export default {
  providers: [
    {
      domain: "https://great-bluegill-77.clerk.accounts.dev",
      applicationID: "convex", // JWTテンプレート名と一致
    },
  ],
};
```

**認証状態の使用**
```typescript
import { useAuth } from '@clerk/clerk-expo';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

function App() {
  return (
    <>
      <AuthLoading>
        <LoadingScreen />
      </AuthLoading>

      <Authenticated>
        <MainApp />
      </Authenticated>

      <Unauthenticated>
        <WelcomeScreen />
      </Unauthenticated>
    </>
  );
}

// サインアウト
const { signOut } = useAuth();
await signOut();
```

#### セットアップ手順
1. **Clerk Dashboard**でJWTテンプレート「convex」を作成
2. テンプレートに`"aud": "convex"`を追加
3. Issuer URLをコピーして`convex/auth.config.ts`に設定
4. Publishable Keyを`.env`に設定

#### Googleログインの有効化（実装済み）

アプリには既にGoogleログイン機能が実装されています。有効化するには：

**Clerkダッシュボードでの設定:**
1. **Clerk Dashboard** > **User & Authentication** > **Social Connections**
2. **Google**を選択して有効化
3. OAuth設定を選択：
   - **テスト用**: "Use Clerk's development keys"（Expo Goで動作）
   - **本番用**: Google Cloud Consoleで独自のOAuth認証情報を作成

**実装済みの機能:**
- `app/(auth)/sign-in.tsx`: Googleログインボタンとフロー
- `app/(auth)/sign-up.tsx`: Google登録ボタンとフロー
- `useOAuth`フック: ClerkのOAuth統合
- `expo-web-browser`: OAuth高速化のためのウォームアップ

**UI:**
- メール/パスワード入力フォームの下に「または」区切り線
- Googleアイコン付きの白いボタン「Googleでログイン/登録」
- エラーハンドリング: アクセス拒否、セッション存在、その他のエラー

**注意事項:**
- Expo Goでのテストには、Clerkの開発用キーが必要
- 本番環境（iOS/Android）では、独自のGoogle OAuth認証情報が必要
- Redirect URLは自動的にClerkが管理

---

### 3. **NativeWind（スタイリング）**

#### 目的
Tailwind CSSをReact Nativeで使用可能にするライブラリ

#### 使用方法

**基本的な使用**
```typescript
import { View, Text } from 'react-native';

// TailwindクラスをclassName属性で使用
<View className="flex-1 bg-background px-6 pt-14">
  <Text className="text-3xl font-bold text-primary">
    pernect
  </Text>
  <Text className="text-sm text-muted-foreground">
    AI分析であなた自身を発見しよう
  </Text>
</View>
```

**グラデーション（LinearGradient）との組み合わせ**
```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#8b5cf6', '#2563eb']}
  className="w-16 h-16 rounded-full items-center justify-center"
  style={{ borderRadius: 32 }}
>
  <Ionicons name="add" size={36} color="white" />
</LinearGradient>
```

**カラーシステム（`tailwind.config.js`）**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 100%)',      // #ffffff
        foreground: 'hsl(222.2, 84%, 4.9%)', // テキスト
        primary: 'hsl(221.2, 83.2%, 53.3%)', // #2563eb (青)
        accent: 'hsl(280, 89%, 61%)',         // #8b5cf6 (紫)
        muted: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)',
        },
        // ... その他のカラー定義
      }
    }
  }
}
```

---

### 4. **i18next（国際化）**

#### 目的
多言語対応（英語・日本語）

#### 使用方法

**設定（`lib/i18n.ts`）**
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Expo SDK',
      signIn: 'Sign In',
      // ...
    },
  },
  ja: {
    translation: {
      welcome: 'Expo SDKへようこそ',
      signIn: 'ログイン',
      // ...
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0].languageCode ?? 'en', // デバイスの言語を検出
  fallbackLng: 'en',
});
```

**コンポーネントでの使用**
```typescript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();

  return <Text>{t('welcome')}</Text>;
}
```

#### 拡張計画
```typescript
// 心理テスト用の翻訳キー
const resources = {
  en: {
    translation: {
      tests: {
        mbti: {
          title: 'MBTI Personality Test',
          description: 'Discover your personality type',
        },
        career: {
          title: 'Career Path AI',
          description: 'Find your ideal career',
        }
      }
    }
  },
  ja: {
    translation: {
      tests: {
        mbti: {
          title: 'MBTI診断',
          description: 'あなたの性格タイプを発見',
        },
        career: {
          title: 'キャリアパスAI',
          description: '理想的なキャリアを見つける',
        }
      }
    }
  }
};
```

---

### 5. **Expo Notifications（プッシュ通知）**

#### 目的
プッシュ通知の送受信

#### 使用方法

**通知ハンドラー設定（`lib/notifications.ts`）**
```typescript
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  // パーミッション要求
  const { status } = await Notifications.requestPermissionsAsync();

  if (status === 'granted') {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  }
}
```

**アプリ起動時の登録（`app/_layout.tsx`）**
```typescript
function RootLayoutNav() {
  const { isAuthenticated } = useConvexAuth();
  const storeUser = useMutation(api.users.store);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync().then((token) => {
        storeUser({ pushToken: token }); // Convexに保存
      });
    }
  }, [isAuthenticated]);

  return <Stack />;
}
```

---

## 🎨 UIデザインシステム

### カラーパレット

```typescript
// Primary Colors (ブランドカラー)
primary: '#2563eb'      // 青 - メインアクション
accent: '#8b5cf6'       // 紫 - 強調要素

// Semantic Colors
success: '#10b981'      // 緑 - 成功
warning: '#f97316'      // オレンジ - 警告
error: '#ef4444'        // 赤 - エラー

// Neutral Colors
background: '#ffffff'   // 背景
foreground: '#0f172a'   // テキスト
muted: '#f1f5f9'       // サブ背景
border: '#e2e8f0'      // ボーダー

// Chart Colors (グラフ・カード用)
chart-1: '#2563eb'     // 青
chart-2: '#8b5cf6'     // 紫
chart-3: '#10b981'     // 緑
chart-4: '#f97316'     // オレンジ
chart-5: '#06b6d4'     // シアン
```

### タイポグラフィ

```typescript
// 見出し
<Text className="text-3xl font-bold text-primary">
  大見出し
</Text>

<Text className="text-xl font-bold text-foreground">
  中見出し
</Text>

// 本文
<Text className="text-base text-foreground">
  通常テキスト
</Text>

<Text className="text-sm text-muted-foreground">
  サブテキスト
</Text>

<Text className="text-xs text-muted-foreground">
  キャプション
</Text>
```

### コンポーネントスタイル

**カード**
```typescript
<View className="bg-card rounded-3xl p-5 border border-border">
  {/* カードコンテンツ */}
</View>
```

**ボタン（グラデーション）**
```typescript
<TouchableOpacity>
  <LinearGradient
    colors={['#8b5cf6', '#2563eb']}
    className="w-16 h-16 rounded-full items-center justify-center"
    style={{ borderRadius: 32 }}
  >
    <Ionicons name="add" size={36} color="white" />
  </LinearGradient>
</TouchableOpacity>
```

**入力フィールド**
```typescript
<TextInput
  className="w-full px-4 py-4 rounded-2xl bg-input text-foreground"
  placeholder="プレースホルダー"
  placeholderTextColor="#94a3b8"
/>
```

---

## 📱 画面構成

### 1. **WelcomeScreen（未認証）**
- 初回訪問者向けのウェルカム画面
- サインイン/サインアップへの導線

### 2. **HomeScreen**
- **人気のテスト**: 横スクロールカード（MBTI、キャリアパス、愛の言語）
- **あなたへのおすすめ**: 2カラムグリッド（学習スタイル、色彩心理学、エニアグラム、星座）
- **最近追加されたテスト**: リスト形式（認知スタイル、感情知能）
- **検索バー**: テスト検索機能

### 3. **ProfileScreen**
- **プロフィールカード**: MBTI結果、性格特性スコア
- **統計**: 受けた診断数、平均スコア、完了率
- **アナリティクス**: 性格特性グラフ、診断活動チャート
- **相性インサイト**: 他の性格タイプとの相性

### 4. **SettingsScreen**
- アカウント設定（プロフィール編集、通知設定）
- アプリ情報（運営会社、利用規約、プライバシーポリシー）
- ログアウト

### 5. **ActionMenu（モーダル）**
- 中央のプラスボタンから開くアクションメニュー
- （将来的に）新しいテスト開始、結果シェアなど

---

## 🚀 開発ワークフロー

### セットアップ

```bash
# 依存関係のインストール
npm install

# Convexバックエンドの起動（別ターミナル）
npx convex dev

# Expoアプリの起動
npx expo start
```

### 開発コマンド

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web
npm run web

# Linter
npm run lint

# プロジェクトリセット
npm run reset-project
```

### 環境変数（`.env`）

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_CONVEX_URL=https://...convex.cloud
```

---

## 🔮 今後の開発計画

### Phase 1: コア機能（現在）
- [x] 認証フロー（Clerk）
- [x] ユーザープロフィール
- [x] 基本UI/UX
- [x] プッシュ通知統合
- [ ] テストデータベース設計
- [ ] テスト実行フロー

### Phase 2: テスト機能
- [ ] MBTI診断の実装
- [ ] キャリアパスAI診断
- [ ] 愛の言語診断
- [ ] 学習スタイル診断
- [ ] テスト結果の保存・表示
- [ ] AI分析エンジン統合

### Phase 3: 分析・レポート
- [ ] 詳細な分析レポート
- [ ] グラフ・チャート表示
- [ ] 過去の結果履歴
- [ ] 進捗トラッキング
- [ ] パーソナライズされた推奨

### Phase 4: ソーシャル機能
- [ ] 結果シェア機能
- [ ] 友達との比較
- [ ] コミュニティフィード
- [ ] ランキング・リーダーボード

### Phase 5: プレミアム機能
- [ ] サブスクリプション（Plus/Pro/Max）
- [ ] プレミアムテスト
- [ ] 詳細分析レポート
- [ ] パーソナルコーチング

### Phase 6: エンゲージメント
- [ ] デイリーチャレンジ
- [ ] アチーブメント・バッジ
- [ ] ストリーク機能
- [ ] リマインダー通知

---

## 💾 データベース設計（今後の拡張）

### テーブル構造

```typescript
// 既存
users {
  _id: Id<"users">
  tokenIdentifier: string
  email?: string
  name?: string
  image?: string
  pushToken?: string
}

// 追加予定
tests {
  _id: Id<"tests">
  title: string
  description: string
  category: "personality" | "career" | "love" | "learning" | "other"
  duration: number // 分
  questions: Question[]
  gradient: { start: string, end: string }
  icon: string
  rating: number
  isPremium: boolean
  createdAt: number
}

testResults {
  _id: Id<"testResults">
  userId: Id<"users">
  testId: Id<"tests">
  answers: any[]
  score?: number
  analysis: {
    type: string
    description: string
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  completedAt: number
}

userProgress {
  _id: Id<"userProgress">
  userId: Id<"users">
  testId: Id<"tests">
  currentQuestion: number
  answers: any[]
  startedAt: number
  lastUpdatedAt: number
}

subscriptions {
  _id: Id<"subscriptions">
  userId: Id<"users">
  plan: "free" | "plus" | "pro" | "max"
  status: "active" | "cancelled" | "expired"
  startDate: number
  endDate: number
  paymentProvider: string
}
```

---

## 🔐 セキュリティ

### 認証
- **Clerk**: OAuth 2.0、JWT認証
- **Expo Secure Store**: 暗号化されたトークンストレージ
- **Convex Auth**: サーバーサイド認証検証

### データ保護
- すべてのConvex関数で`ctx.auth.getUserIdentity()`による認証チェック
- ユーザーデータは`tokenIdentifier`でスコープ化
- HTTPSによる通信の暗号化

### プライバシー
- プッシュトークンはオプトイン
- ユーザーデータの削除機能（今後実装）
- GDPR準拠（今後実装）

---

## 🧪 テスト戦略（今後）

### ユニットテスト
- Convex関数のテスト
- ユーティリティ関数のテスト

### E2Eテスト
- 認証フロー
- テスト実行フロー
- プロフィール更新

### パフォーマンステスト
- データベースクエリの最適化
- 画像読み込みの最適化
- アニメーションのパフォーマンス

---

## 📊 モニタリング & 分析（今後）

### アプリ分析
- ユーザーエンゲージメント
- テスト完了率
- リテンション率

### エラートラッキング
- Sentry統合
- クラッシュレポート
- パフォーマンス監視

---

## 🤝 コントリビューション

### コーディング規約

**TypeScript**
- 厳格な型定義を使用
- `any`の使用は最小限に
- インターフェースとタイプの明確な定義

**React Native**
- 関数コンポーネントを優先
- Hooksを活用
- パフォーマンスの最適化（useMemo、useCallback）

**スタイリング**
- NativeWindのクラス名を使用
- インラインスタイルは必要最小限
- 一貫したカラーシステムの使用

**命名規則**
- コンポーネント: PascalCase（例: `HomeScreen.tsx`）
- 関数: camelCase（例: `registerForPushNotifications`）
- 定数: UPPER_SNAKE_CASE（例: `API_URL`）
- ファイル: kebab-case または PascalCase

---

## 📝 よくある質問

### Q1: Convexとは何ですか？
A: Convexは、リアルタイムデータベースとサーバーレス関数を提供するBaaS（Backend as a Service）です。Firebase+Supabaseのような機能を持ち、TypeScript-firstでリアクティブなデータ更新が特徴です。

### Q2: なぜClerkを使っているのですか？
A: ClerkはOAuth認証を簡単に実装でき、Convexとのネイティブ統合が可能です。ユーザー管理、セッション管理、MFAなどの機能が組み込まれています。

### Q3: NativeWindのメリットは？
A: Tailwind CSSの記法をReact Nativeで使えるため、Webとモバイルで一貫したスタイリング体験が得られます。開発速度が向上し、デザインの一貫性も保たれます。

### Q4: プッシュ通知の実装方法は？
A: Expo Notificationsを使用し、アプリ起動時にパーミッションを要求してトークンを取得、Convexに保存します。通知の送信はConvex関数経由で行います。

### Q5: テストデータはどこに保存されますか？
A: 将来的に`testResults`テーブルに保存され、ユーザーごとにスコープ化されます。リアルタイムでConvexから取得できます。

---

## 🎓 学習リソース

### 公式ドキュメント
- [Expo Documentation](https://docs.expo.dev/)
- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [i18next Documentation](https://www.i18next.com/)

### チュートリアル
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [Convex + Clerk Tutorial](https://docs.convex.dev/auth/clerk)
- [React Native Animations](https://reactnative.dev/docs/animations)

---

## 📞 サポート

### 開発チーム
- プロジェクトオーナー: [連絡先]
- 技術リード: [連絡先]

### 問題報告
- GitHub Issues: [リポジトリURL]
- メール: [サポートメール]

---

**最終更新:** 2025年1月
**バージョン:** 1.0.0
**ステータス:** アクティブ開発中
