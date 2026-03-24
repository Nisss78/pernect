# AI機能開発ガイド

このプロジェクトのAI機能を開発・修正する際のリファレンスです。

## アーキテクチャ

### AI呼び出しの仕組み
- **場所**: `convex/ai.ts` — OpenRouter API経由のraw fetchラッパー
- **呼び出し元**: Convex mutation/action内から `generateAnalysis()` や `generateDeepCompatibilityAnalysis()` を呼ぶ
- **プロバイダー**: OpenRouter（`OPENROUTER_API_KEY`）→ 複数LLMプロバイダーに統一アクセス

### 使用モデル
| 用途 | モデル | 備考 |
|------|--------|------|
| デフォルト | `anthropic/claude-sonnet-4` | コスト効率が良い |
| 高品質が必要な場合 | `anthropic/claude-opus-4` | callOpenRouterのmodel引数で変更可能 |
| コスト重視 | `anthropic/claude-haiku-4` | 軽量タスク向け |

### OpenRouter APIの使い方（このプロジェクト）

`callOpenRouter()` 共通関数で全AI呼び出しを統一しています。

```typescript
const content = await callOpenRouter(
  [
    { role: "system", content: "システムプロンプト" },
    { role: "user", content: "ユーザーメッセージ" },
  ],
  { model: "anthropic/claude-sonnet-4", maxTokens: 2000, temperature: 0.7 }
);
```

OpenAI互換フォーマットなので、モデル名を変えるだけで他のLLMも使えます。

### レスポンスパース戦略
1. ` ```json ``` ` ブロック内のJSONを抽出
2. 直接JSONパース
3. フォールバック: テキストからセクション抽出

## 主要ファイル

| ファイル | 役割 |
|---------|------|
| `convex/ai.ts` | AI APIラッパー（プロンプト構築・レスポンスパース） |
| `convex/friendships.ts` | `generateDeepAnalysis` mutation（プレミアムゲート付き） |
| `convex/integratedAnalyses.ts` | 統合分析のmutation/query |
| `convex/compatibilityEngine.ts` | ルールベース相性エンジン（AI不要） |
| `convex/schema.ts` | `deepAnalysis` フィールド定義 |

## プレミアムゲーティング

AI機能はプレミアムユーザー（Pro/Max）のみアクセス可能:
```typescript
const subscription = await getUserSubscription(ctx, userId);
const isPremium = subscription?.plan === "pro" || subscription?.plan === "max";
if (!isPremium) {
  throw new Error("この機能にはProプラン以上が必要です");
}
```

## 新しいAI機能を追加する手順

1. **プロンプト関数を作成** — `convex/ai.ts` に `buildXxxPrompt(input)` を追加
2. **パーサーを作成** — `parseXxxResponse(content)` を追加（フォールバック付き）
3. **エクスポート関数を作成** — `generateXxx(input)` をエクスポート
4. **Convex mutation/actionを作成** — プレミアムゲート付きで呼び出し元を実装
5. **フロントエンド** — 3段階UI（無料CTA → プレミアムボタン → 結果表示）

## 環境変数

Convex環境変数（`npx convex env set`で設定）:
- `OPENROUTER_API_KEY` — OpenRouterのAPIキー（唯一必要な環境変数）

## モデル選定の基準（OpenRouterモデルID）

- **コスト重視**: `anthropic/claude-haiku-4` — 簡単な分類・要約
- **バランス**: `anthropic/claude-sonnet-4` — 現在のデフォルト
- **最高品質**: `anthropic/claude-opus-4` — 複雑な推論が必要な場合
- **他プロバイダー**: `openai/gpt-4o`, `google/gemini-2.0-flash` なども利用可能

$user_input の内容に基づいて、このプロジェクトのAI機能について回答してください。
コードの修正が必要な場合は、上記のアーキテクチャに従って実装してください。
