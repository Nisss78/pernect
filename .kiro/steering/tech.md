# Technology Stack - Pernect

## Frontend

### Core Framework
- **Expo** (~54.0.25): React Native開発フレームワーク
- **React Native** (0.81.5): クロスプラットフォームモバイルUI
- **TypeScript** (~5.9.2): 型安全な開発

### Navigation & Routing
- **Expo Router** (~6.0.15): ファイルベースルーティング

### Styling
- **NativeWind** (^4.2.1): Tailwind CSS for React Native
- **Expo Linear Gradient**: グラデーション効果

### UI Components
- **@expo/vector-icons**: Ionicons, FontAwesome
- **Lottie React Native**: アニメーション
- **Sonner Native**: トースト通知
- **@react-native-picker/picker**: ドロップダウン選択
- **@react-native-community/datetimepicker**: 日付選択

## Backend

### BaaS (Backend as a Service)
- **Convex** (^1.29.3): リアルタイムデータベース & サーバーレス関数
  - Mutation: データ更新操作
  - Query: データ取得（リアルタイム更新）
  - Schema: 型安全なスキーマ定義

### Authentication
- **Clerk** (^2.19.4): OAuth認証プロバイダー
  - Google/Apple/Email認証対応
  - JWT Token管理
  - Convexとのネイティブ統合

### Storage
- **Expo Secure Store**: トークンキャッシュ

## Internationalization
- **i18next** (^25.6.3): 多言語対応
- **React i18next**: React統合
- **Expo Localization**: デバイス言語検出

## Notifications
- **Expo Notifications**: プッシュ通知

## Development Tools
- **ESLint**: コード品質
- **Prettier**: コードフォーマット

## Architecture Patterns

### Data Flow
```
Component → useQuery/useMutation → Convex Functions → Database
                ↓
         Real-time Updates
```

### Authentication Flow
```
User → Clerk Sign In → JWT Token → Convex Auth → Store User
```

### File Structure
```
app/           - Expo Router pages
components/    - UI components
convex/        - Backend functions & schema
lib/           - Utilities (auth, i18n, notifications)
assets/        - Static resources
```

## Coding Conventions
- Components: PascalCase (e.g., `ProfileScreen.tsx`)
- Functions: camelCase (e.g., `handleSave`)
- Constants: UPPER_SNAKE_CASE
- Styles: NativeWind className (Tailwind CSS)
- Types: Interface prefix with `I` or descriptive names
