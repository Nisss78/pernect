# Pernect（パーネクト）アプリ概要書

## 1. アプリコンセプト

### 1.1 ビジョン
**「AI分析で自分自身を発見する」** - ユーザーが様々な心理テスト・診断を通じて自己理解を深め、より良い人生の選択をサポートするモバイルアプリ

### 1.2 アプリ名の由来
**Pernect** = **Per**sonality + Co**nnect**
- 性格（Personality）を理解し、自分や他者と繋がる（Connect）

### 1.3 ターゲットユーザー
- **主要ターゲット**: 20〜35歳の自己成長に関心のある層
- **サブターゲット**:
  - キャリアに悩む社会人
  - 人間関係を改善したい人
  - 自分の強み・弱みを知りたい人

### 1.4 競合との差別化ポイント
| 項目 | 競合（16Personalities等） | Pernect |
|------|--------------------------|---------|
| テスト種類 | 単一（MBTIのみ等） | 複数診断を統合 |
| 結果の活用 | 結果表示のみ | AI会話、相性診断、履歴蓄積 |
| UX | Web中心 | モバイルネイティブ |
| データ連携 | なし | 診断結果をプロフィールに反映、変数として活用 |

---

## 2. 技術スタック

### 2.1 フロントエンド
| 技術 | 用途 |
|------|------|
| **Expo (SDK 54)** | React Nativeフレームワーク |
| **TypeScript** | 型安全な開発 |
| **Expo Router** | ファイルベースルーティング |
| **NativeWind** | Tailwind CSSスタイリング |

### 2.2 バックエンド
| 技術 | 用途 |
|------|------|
| **Convex** | リアルタイムBaaS、サーバーレス関数 |
| **Clerk** | OAuth認証（Google, Apple等） |

### 2.3 その他
- **i18next**: 多言語対応（日本語/英語）
- **Expo Notifications**: プッシュ通知
- **Lottie**: アニメーション

---

## 3. 現在の実装状況

### 3.1 実装済み機能 ✅

#### 認証・ユーザー管理
- [x] Clerk OAuth認証（Google, Apple）
- [x] ユーザープロフィール保存
- [x] セッション管理

#### 画面・ナビゲーション
- [x] ウェルカム画面（未認証時）
- [x] ホーム画面（テスト一覧カード）
- [x] プロフィール画面（基本情報）
- [x] 設定画面
- [x] プロフィール編集画面
- [x] ボトムナビゲーション
- [x] アクションメニュー（モーダル）

#### 診断テストシステム（コア機能）
- [x] テスト一覧画面（TestListScreen）
- [x] テスト実行画面（TestScreen）
  - 質問表示、選択肢タップ
  - プログレスバー
  - 前へ/次へナビゲーション
  - 進捗自動保存（中断再開対応）
- [x] 結果表示画面（TestResultScreen）
  - スコア表示（次元別/単一）
  - 強み・弱み・アドバイス表示
- [x] 2種類のスコアリングロジック
  - dimension型（MBTI: E/I, S/N, T/F, J/P）
  - single型（エニアグラム: 最高スコアのタイプ）
- [x] 結果履歴の蓄積

#### サンプルデータ
- [x] MBTI診断（簡易版・5問）
- [x] エニアグラム診断（簡易版・5問）
- [x] キャリアタイプ診断（5問）

#### その他
- [x] AIチャット画面（UI実装、バックエンド未接続）
- [x] 友達マッチ画面（UI実装）

### 3.2 未実装・部分実装 🚧

#### 診断テスト関連
- [ ] 本格的な診断テスト（20〜50問の完全版）
- [ ] テスト結果のシェア機能
- [ ] テスト結果の比較・分析機能
- [ ] テスト結果に基づくレコメンデーション

#### AI機能
- [ ] AIチャットのバックエンド接続（OpenAI/Anthropic API）
- [ ] 診断結果を踏まえたパーソナライズ会話
- [ ] AI分析レポート生成

#### ソーシャル機能
- [ ] 友達追加・検索
- [ ] 相性診断（友達間）
- [ ] 診断結果のシェア
- [ ] コミュニティ・フィード

#### プロフィール
- [ ] 診断結果のプロフィール反映
- [ ] アバター設定
- [ ] 詳細なパーソナリティサマリー

#### その他
- [ ] プッシュ通知の活用
- [ ] ダークモード
- [ ] オフライン対応
- [ ] アナリティクス統合

---

## 4. データベース設計

### 4.1 現在のスキーマ

```
users
├── tokenIdentifier (Clerk JWT)
├── email
├── name
├── image
├── pushToken
├── mbtiType (診断結果反映用)
├── enneagramType
└── careerType

tests
├── slug (URL用識別子)
├── title
├── description
├── category
├── questionCount
├── estimatedMinutes
├── scoringType ("dimension" | "single")
├── resultField (usersのどのフィールドに反映するか)
├── icon, gradientStart, gradientEnd
└── isActive

testQuestions
├── testId
├── order
├── questionText
└── options[] (value, label, scoreKey, scoreValue)

testAnswers (進行中の回答)
├── userId
├── testId
├── answers[] (questionOrder, selectedValue)
├── startedAt
└── updatedAt

testResults (完了した結果)
├── userId
├── testId
├── resultType ("ENFP", "タイプ1" など)
├── scores (各軸のスコア)
├── analysis (summary, description, strengths, weaknesses, recommendations)
└── completedAt
```

### 4.2 今後追加予定のテーブル
```
# 友達関係
friendships
├── userId
├── friendId
├── status ("pending" | "accepted")
└── createdAt

# AIチャット履歴
chatMessages
├── userId
├── role ("user" | "assistant")
├── content
└── createdAt

# 通知
notifications
├── userId
├── type
├── title, body
├── isRead
└── createdAt
```

---

## 5. 画面フロー

```
[未認証]
WelcomeScreen → Sign In/Up → [認証済み]

[認証済み]
HomeScreen (ホーム)
├── テストカードタップ → TestScreen → TestResultScreen
├── 「すべて見る」→ TestListScreen
├── プロフィールタブ → ProfileScreen → ProfileEditScreen
├── 設定タブ → SettingsScreen
└── 中央+ボタン → ActionMenu
    ├── AIチャット → AIChatScreen
    └── 友達マッチ → FriendsMatchScreen
```

---

## 6. 今後の開発方針案

### Option A: 診断コンテンツ充実路線
**優先順位**: 診断テストの質と量を高める
1. 本格的なMBTI診断（93問）の実装
2. 他の診断テスト追加（ストレングスファインダー風、愛の言語等）
3. 診断結果の詳細分析・レポート
4. AIによる診断解説

**メリット**: コア価値の強化、SEO/ASO効果
**デメリット**: 時間がかかる、コンテンツ制作コスト

### Option B: AI機能強化路線
**優先順位**: AIとの対話機能を磨く
1. AIチャットのバックエンド実装
2. 診断結果を踏まえたパーソナライズ
3. AIによる深掘り質問
4. 日記・振り返り機能とAI分析

**メリット**: 差別化、リテンション向上
**デメリット**: API費用、技術的複雑さ

### Option C: ソーシャル機能強化路線
**優先順位**: 友達・相性機能を優先
1. 友達追加・検索機能
2. 相性診断機能
3. 結果シェア機能
4. コミュニティ機能

**メリット**: バイラル効果、エンゲージメント
**デメリット**: モデレーション必要、複雑性増加

### Option D: MVP完成優先路線
**優先順位**: 最小限の機能でリリース可能な状態に
1. 既存機能のバグ修正・UI改善
2. 3つの診断テストの完成度向上
3. 基本的なシェア機能
4. App Store/Google Play申請準備

**メリット**: 早期リリース、実ユーザーフィードバック
**デメリット**: 機能が限定的

---

## 7. 推奨される次のステップ

### 短期（1-2週間）
1. 既存の診断テストの問題数を増やす（5問→15問程度）
2. UIの細かい調整・バグ修正
3. エラーハンドリングの強化

### 中期（1ヶ月）
4. AIチャット機能のバックエンド実装
5. 診断結果のシェア機能
6. プロフィールへの診断結果反映

### 長期（2-3ヶ月）
7. 友達・相性機能
8. 追加診断テスト
9. アプリストア申請

---

## 8. 相談したいポイント

1. **機能の優先順位**: A〜Dのどの路線が最適か？
2. **マネタイズ**: 無料/フリーミアム/サブスク、どれが適切か？
3. **診断コンテンツ**: オリジナル vs 既存フレームワーク（MBTI等）の著作権問題
4. **AI活用**: どこまでAIに任せるべきか？
5. **差別化**: 競合と比べて何を強みにすべきか？

---

## 9. 補足資料

### 9.1 ファイル構成
```
pernect/
├── app/                    # Expo Router ページ
│   ├── (auth)/            # 認証画面
│   ├── _layout.tsx        # プロバイダー設定
│   └── index.tsx          # メインルーター
├── components/            # UIコンポーネント (15ファイル)
├── convex/                # バックエンド
│   ├── schema.ts          # DBスキーマ
│   ├── users.ts           # ユーザー管理
│   ├── tests.ts           # テスト管理
│   ├── testAnswers.ts     # 回答管理
│   ├── testResults.ts     # 結果管理
│   └── seedTests.ts       # シードデータ
├── lib/                   # ユーティリティ
└── assets/                # 静的リソース
```

### 9.2 現在のテストデータ
| テスト名 | 問題数 | スコアリング | カテゴリ |
|---------|--------|-------------|---------|
| MBTI診断（簡易版） | 5問 | dimension | personality |
| エニアグラム診断 | 5問 | single | personality |
| キャリアタイプ診断 | 5問 | single | career |

---

*最終更新: 2025年1月*
*作成者: Claude Code*
