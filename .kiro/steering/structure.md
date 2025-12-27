# Project Structure - Pernect

## Directory Layout

```
pernect/
├── app/                          # Expo Router ページ
│   ├── (auth)/                   # 認証グループ
│   │   ├── sign-in.tsx          # サインイン画面
│   │   └── sign-up.tsx          # サインアップ画面
│   ├── _layout.tsx              # ルートレイアウト（プロバイダー設定）
│   ├── index.tsx                # メイン画面（画面ルーティング）
│   └── +not-found.tsx           # 404画面
│
├── components/                   # UIコンポーネント
│   ├── HomeScreen.tsx           # ホーム画面
│   ├── ProfileScreen.tsx        # プロフィール画面
│   ├── ProfileEditScreen.tsx    # プロフィール編集画面
│   ├── SettingsScreen.tsx       # 設定画面
│   ├── WelcomeScreen.tsx        # ウェルカム画面
│   ├── ActionMenu.tsx           # アクションメニュー
│   ├── BottomNavigation.tsx     # 下部ナビゲーション
│   ├── AIChatScreen.tsx         # AIチャット画面
│   └── FriendsMatchScreen.tsx   # 友達マッチング画面
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
├── .kiro/                        # Kiro仕様書
│   ├── steering/                # プロジェクトガイドライン
│   │   ├── product.md          # プロダクト概要
│   │   ├── tech.md             # 技術スタック
│   │   └── structure.md        # ファイル構造
│   └── specs/                   # 機能仕様書
│       └── [feature-name]/     # 機能ごとのディレクトリ
│           ├── requirements.md # 要件定義
│           ├── design.md       # 技術設計
│           └── tasks.md        # 実装タスク
│
└── Configuration Files
    ├── .env                      # 環境変数
    ├── app.json                  # Expo設定
    ├── package.json              # 依存関係
    ├── tailwind.config.js        # Tailwind CSS設定
    └── tsconfig.json             # TypeScript設定
```

## Navigation Structure

```
Root (_layout.tsx)
├── AuthLoading     → ローディング画面
├── Authenticated   → メインアプリ
│   ├── home        → HomeScreen
│   ├── profile     → ProfileScreen
│   ├── settings    → SettingsScreen
│   ├── profile-edit→ ProfileEditScreen
│   ├── ai-chat     → AIChatScreen
│   └── friends-match→ FriendsMatchScreen
└── Unauthenticated → WelcomeScreen
    ├── sign-in     → サインイン
    └── sign-up     → サインアップ
```

## Database Schema (Convex)

### Current Tables
- **users**: ユーザー情報
  - tokenIdentifier, email, name, image, pushToken
  - userId, mbti, birthday, gender, bio, occupation
  - createdAt, updatedAt

### Planned Tables
- **tests**: 診断テスト定義
- **testResults**: テスト結果
- **userProgress**: 進捗トラッキング
- **subscriptions**: サブスクリプション管理

## Component Patterns

### Screen Components
- 画面全体を管理するコンテナコンポーネント
- `onNavigate`, `onBack` などのナビゲーション props
- Convex hooks でデータ取得/更新

### UI Components
- 再利用可能な小さなコンポーネント
- NativeWind でスタイリング
- props で設定可能

### Layout Components
- BottomNavigation: 下部タブナビゲーション
- ActionMenu: 中央のフローティングアクション
