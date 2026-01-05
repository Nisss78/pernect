# Technology Stack - Pernect

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Application (Expo)                 │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Screen     │  │ Screen     │  │ Screen     │            │
│  │ Components │  │ Components │  │ Components │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        └───────────────┴───────────────┘                    │
│                        │                                     │
│         ┌──────────────┴──────────────┐                     │
│         │                              │                     │
│  ┌──────▼──────┐                ┌─────▼─────┐              │
│  │   Clerk     │◄───JWT Token──►│  Convex   │              │
│  │   Auth      │                │  Client   │              │
│  └─────────────┘                └───────────┘              │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS (Real-time)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Convex Backend (BaaS)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Functions (mutations, queries)                       │   │
│  │ - users.ts      - tests.ts       - testAnswers.ts   │   │
│  │ - testResults.ts - seedTests.ts                      │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Database Tables                                       │   │
│  │ - users         - tests          - testQuestions    │   │
│  │ - testAnswers   - testResults                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | ~54.0.25 | React Native開発フレームワーク、ビルド・配信 |
| **React Native** | 0.81.5 | クロスプラットフォームモバイルUI |
| **React** | 19.1.0 | UIコンポーネントライブラリ |
| **TypeScript** | ~5.9.2 | 型安全な開発、コード品質向上 |

### Navigation & Routing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo Router** | ~6.0.15 | ファイルベースルーティング |
| **@react-navigation/native** | ^7.1.8 | ナビゲーション基盤 |
| **@react-navigation/bottom-tabs** | ^7.4.0 | タブナビゲーション |

### Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **NativeWind** | ^4.2.1 | Tailwind CSS for React Native |
| **Tailwind CSS** | ^3.4.1 | ユーティリティファーストCSS |
| **expo-linear-gradient** | ~15.0.7 | グラデーション効果 |

### UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| **@expo/vector-icons** | ^15.0.3 | Ionicons, FontAwesome等 |
| **lottie-react-native** | ^7.3.4 | アニメーション |
| **sonner-native** | ^0.21.1 | トースト通知 |
| **@react-native-picker/picker** | ^2.11.4 | ドロップダウン選択 |
| **@react-native-community/datetimepicker** | ^8.5.1 | 日付選択 |

## Backend Stack

### BaaS (Backend as a Service)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Convex** | ^1.29.3 | リアルタイムDB、サーバーレス関数 |

**Convex Features:**
- **Mutations**: データ更新（トランザクション保証）
- **Queries**: リアルタイムデータ取得（自動再取得）
- **Schema**: 型安全なスキーマ定義
- **Indexes**: 高速クエリ用インデックス

### Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **@clerk/clerk-expo** | ^2.19.4 | OAuth認証（Google, Apple, Email） |
| **convex/react-clerk** | - | Clerk-Convex統合 |
| **expo-secure-store** | ^15.0.7 | トークンキャッシュ（暗号化） |
| **expo-auth-session** | ^7.0.9 | OAuth認証フロー |

**Auth Flow:**
```
User → Clerk Sign In → JWT Token → Convex Auth → User Record Created/Updated
                                        ↓
                              expo-secure-store (Token Cache)
```

## Platform Features

### Internationalization

| Technology | Version | Purpose |
|------------|---------|---------|
| **i18next** | ^25.6.3 | 国際化フレームワーク |
| **react-i18next** | ^16.3.5 | React統合 |
| **expo-localization** | ^17.0.7 | デバイス言語検出 |

**対応言語:** 日本語 (ja), 英語 (en)

### Notifications

| Technology | Version | Purpose |
|------------|---------|---------|
| **expo-notifications** | ^0.32.13 | プッシュ通知 |
| **expo-device** | ^8.0.9 | デバイス情報取得 |

### Haptics & Feedback

| Technology | Version | Purpose |
|------------|---------|---------|
| **expo-haptics** | ~15.0.7 | 触覚フィードバック |

## Development Tools

### Code Quality

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | ^9.25.0 | コードリンティング |
| **eslint-config-expo** | ~10.0.0 | Expo推奨ルール |
| **TypeScript** | ~5.9.2 | 型チェック |

### Development Commands

```bash
# 開発サーバー起動
npm start              # Expo開発サーバー
npm run convex         # Convexバックエンド（別ターミナル）

# プラットフォーム別起動
npm run ios            # iOS Simulator
npm run android        # Android Emulator
npm run web            # Web Browser

# コード品質
npm run lint           # ESLint実行

# ユーティリティ
npm run reset-project  # プロジェクトリセット
```

## Environment Variables

```env
# Required
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...  # Clerk Publishable Key
EXPO_PUBLIC_CONVEX_URL=https://...convex.cloud  # Convex Deployment URL
```

**Clerk JWT Template設定（必須）:**
```json
{
  "aud": "convex",
  "email": "{{user.primary_email_address}}",
  "sub": "{{user.id}}"
}
```

## Data Flow Patterns

### Query Pattern (リアルタイム読み取り)

```typescript
// コンポーネント内
const tests = useQuery(api.tests.list, { category: "personality" });

// Convex関数
export const list = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});
```

### Mutation Pattern (データ更新)

```typescript
// コンポーネント内
const saveAnswer = useMutation(api.testAnswers.saveAnswer);
await saveAnswer({ testId, questionOrder, selectedValue });

// Convex関数
export const saveAnswer = mutation({
  args: { testId: v.id("tests"), questionOrder: v.number(), selectedValue: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("認証が必要です");
    // ... データ処理
  },
});
```

## Coding Conventions

### Naming

- **Components**: PascalCase (`ProfileScreen.tsx`, `Button.tsx`)
- **Functions**: camelCase (`handleSave`, `calculateScore`)
- **Constants**: UPPER_SNAKE_CASE (`MBTI_ANALYSIS`)
- **Files**: PascalCase (components), camelCase (utilities)

### Styling

- NativeWind className使用（Tailwind CSS記法）
- インラインスタイルは必要最小限
- テーマカラーは `constants/theme.ts` で定義

### TypeScript

- `strict: true` モード
- `any` 使用は最小限
- Convex生成型を活用（`Id<"users">` 等）

### Import Order

```typescript
// 1. External libraries
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';

// 2. Internal modules
import { api } from '../convex/_generated/api';

// 3. Components
import { Button } from '../components/ui/Button';

// 4. Utilities/Constants
import { theme } from '../constants/theme';
```
