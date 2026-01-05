# Project Structure - Pernect

## Directory Overview

```
pernect/
├── app/                    # Expo Router pages (file-based routing)
├── components/             # React Native UI components
├── convex/                 # Backend functions & database schema
├── lib/                    # Utility libraries
├── hooks/                  # Custom React hooks
├── constants/              # App-wide constants
├── assets/                 # Static assets (images, fonts)
├── scripts/                # Development scripts
├── .kiro/                  # Spec-driven development files
│   ├── steering/           # Project context documents
│   └── specs/              # Feature specifications
└── .claude/                # Claude Code configuration
```

## App Directory (Expo Router)

```
app/
├── _layout.tsx             # Root layout - Providers (Clerk, Convex, i18n)
├── index.tsx               # Main entry - Screen routing & state management
├── +not-found.tsx          # 404 error page
└── (auth)/                 # Authentication group (unauthenticated users)
    ├── sign-in.tsx         # Sign in page
    └── sign-up.tsx         # Sign up page
```

### Navigation Architecture

```
index.tsx manages screen state:
├── home          → HomeScreen
├── profile       → ProfileScreen
├── settings      → SettingsScreen
├── profile-edit  → ProfileEditScreen
├── test-list     → TestListScreen
├── test          → TestScreen (with testSlug)
├── test-result   → TestResultScreen (with resultId)
├── ai-chat       → AIChatScreen (planned)
└── friends-match → FriendsMatchScreen (planned)
```

## Components Directory

```
components/
├── HomeScreen.tsx          # Main dashboard - test cards, search
├── ProfileScreen.tsx       # User profile - MBTI result, stats
├── SettingsScreen.tsx      # Settings - account, logout
├── ProfileEditScreen.tsx   # Profile editing form
├── WelcomeScreen.tsx       # Onboarding (unauthenticated)
├── TestListScreen.tsx      # Test catalog listing
├── TestScreen.tsx          # Test taking UI
├── TestResultScreen.tsx    # Test result display
├── AIChatScreen.tsx        # AI coaching (placeholder)
├── FriendsMatchScreen.tsx  # Matching (placeholder)
├── ActionMenu.tsx          # Floating action menu modal
├── BottomNavigation.tsx    # Tab bar navigation
└── ui/                     # Reusable UI primitives
    ├── Button.tsx          # Button component
    ├── Input.tsx           # Text input component
    └── Typography.tsx      # Text styles
```

### Component Patterns

**Screen Components**: Full-screen views with navigation props
```typescript
interface ScreenProps {
  onNavigate: (screen: string) => void;
  onActionPress?: () => void;
  onBack?: () => void;
}
```

**UI Components**: Stateless, reusable primitives
```typescript
// NativeWind className styling
<Button className="bg-primary rounded-xl" />
```

## Convex Directory (Backend)

```
convex/
├── schema.ts               # Database schema definition
├── auth.config.ts          # Clerk JWT configuration
├── users.ts                # User CRUD operations
├── tests.ts                # Test definitions queries
├── testAnswers.ts          # Answer saving mutations
├── testResults.ts          # Result calculation & storage
├── seedTests.ts            # Seed data for tests
├── tsconfig.json           # Convex TypeScript config
└── _generated/             # Auto-generated types (DO NOT EDIT)
    ├── api.d.ts
    ├── api.js
    ├── dataModel.d.ts
    ├── server.d.ts
    └── server.js
```

### Database Schema

```typescript
// convex/schema.ts
tables:
├── users              # User profiles
│   ├── tokenIdentifier (indexed)
│   ├── email, name, image, pushToken
│   ├── userId (indexed) - @username形式
│   ├── mbti - MBTIタイプ (ENFP等)
│   ├── birthday, gender, bio, occupation
│   └── createdAt, updatedAt
├── tests              # Test definitions
│   ├── slug (indexed, unique)
│   ├── title, description, category
│   ├── questionCount, estimatedMinutes
│   ├── scoringType - "dimension" | "single"
│   ├── resultField - users保存先フィールド
│   ├── gradientStart, gradientEnd, icon
│   └── isActive (indexed)
├── testQuestions      # Questions per test
│   ├── testId (indexed)
│   ├── order (indexed), questionText
│   └── options[] { value, label, scoreKey, scoreValue }
├── testAnswers        # In-progress answers
│   ├── userId + testId (indexed)
│   ├── answers[] { questionOrder, selectedValue }
│   └── startedAt, updatedAt
└── testResults        # Calculated results
    ├── userId (indexed)
    ├── testId, resultType
    ├── scores - { E: 3, I: 2 } or { type1: 5 }
    ├── analysis { summary, description, strengths[], weaknesses[], recommendations[] }
    └── completedAt (indexed)
```

### Convex Function Organization

| File | Functions | Purpose |
|------|-----------|---------|
| users.ts | `store`, `current`, `update` | User profile management |
| tests.ts | `list`, `getBySlug`, `getQuestions` | Test data retrieval |
| testAnswers.ts | `saveAnswer`, `getUserAnswers`, `clearAnswers` | Answer persistence |
| testResults.ts | `calculateAndSave`, `getLatest`, `getUserResults` | Result calculation |
| seedTests.ts | `seedAllTests` | Development data seeding |

## Lib Directory

```
lib/
├── auth.ts                 # Clerk token cache (SecureStore)
├── i18n.ts                 # i18next configuration (ja/en)
└── notifications.ts        # Push notification registration
```

## Hooks Directory

```
hooks/
├── use-color-scheme.ts     # Native color scheme detection
├── use-color-scheme.web.ts # Web-specific implementation
└── use-theme-color.ts      # Theme color accessor
```

## Constants Directory

```
constants/
└── theme.ts                # Color palette, spacing, typography
```

## Key Architectural Patterns

### State Management

**Screen State**: `useState` in `app/index.tsx`
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('home');
const [currentTestSlug, setCurrentTestSlug] = useState<string | null>(null);
const [currentResultId, setCurrentResultId] = useState<Id<"testResults"> | null>(null);
```

**Server State**: Convex reactive queries
```typescript
const tests = useQuery(api.tests.list, { category: "personality" });
const user = useQuery(api.users.current);
```

### Authentication Flow

```
1. ClerkProvider wraps app
2. ConvexProviderWithClerk syncs auth state
3. <Authenticated>/<Unauthenticated> components route
4. Convex functions verify ctx.auth.getUserIdentity()
```

### Data Flow

```
Component → useMutation(api.x.y) → Convex Function → Database
                                          ↓
Component ← useQuery(api.x.z) ← Real-time subscription
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Screen Components | PascalCase | `HomeScreen.tsx` |
| UI Components | PascalCase | `Button.tsx` |
| Convex Functions | camelCase | `testResults.ts` |
| Hooks | kebab-case | `use-color-scheme.ts` |
| Utilities | camelCase | `auth.ts` |
| Constants | camelCase | `theme.ts` |

## Import Organization

```typescript
// 1. React/React Native
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. External packages
import { useAuth } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// 3. Internal - Convex API
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

// 4. Internal - Components
import { Button } from '../components/ui/Button';
import { BottomNavigation } from '../components/BottomNavigation';

// 5. Internal - Utilities
import { theme } from '../constants/theme';
```

## Critical Files Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| `app/_layout.tsx` | Provider setup | `RootLayout` |
| `app/index.tsx` | Main navigation | `IndexPage` |
| `convex/schema.ts` | Database types | Schema definition |
| `convex/testResults.ts` | MBTI logic | `MBTI_ANALYSIS`, `calculateAndSave` |
| `lib/i18n.ts` | Translations | i18n instance |
| `lib/auth.ts` | Token storage | `tokenCache` |

## Development Files

```
Root Config:
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind/NativeWind config
├── babel.config.js         # Babel configuration
├── metro.config.js         # Metro bundler config
├── eslint.config.js        # ESLint rules
├── app.json                # Expo app configuration
└── global.css              # Global Tailwind styles
```
