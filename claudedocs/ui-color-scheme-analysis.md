# Pernect UI カラースキーム改善計画

## 1. リサーチ結果サマリー

### 参考サービス・記事

#### 16Personalities
- **カラーパレット**: `#95637e`(モーブ), `#9ac262`(セージ), `#72cccd`(シアン), `#e5c727`(ゴールド), `#eed3c2`(ベージュ)
- **特徴**: 各性格タイプに色を割り当て、統一感のある5色パレット
- **参考**: [16personalities Color Palette](https://www.color-hex.com/color-palette/1006687)

#### Headspace
- **メインカラー**: オレンジ（シグネチャーカラー）
- **サポートカラー**: Soft Yellow, Pale Blue, Light Green, Light Lavender
- **特徴**: パステルカラーの多用、明るく元気なイメージ、でも落ち着きもある
- **参考**: [Headspace Brand Overhaul](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)

#### Calm
- **メインカラー**: 深いブルー
- **特徴**: 青→紫のグラデーション、静寂と安定をイメージ
- **参考**: [Big Human - Mindfulness App Design Trends](https://www.bighuman.com/blog/trends-in-mindfulness-app-design)

#### メンタルヘルスUI ベストプラクティス
- **Studiovolia**: 深いオレンジ/イエロー + パステルブルー/グリーン（若い世代向け）
- **Ginger**: フォレストグリーン + ネイビー + ゴールド（幅広い年齢層）
- **Mindbloom**: ダークイエロー + ブルー + オレンジ（グラデーション活用）
- **参考**: [Fuzzy Math - Mental Healthcare UI Color Palettes](https://fuzzymath.com/blog/the-color-palettes-of-mental-healthcare-ui/)

---

## 2. 現状の問題点

### 現在使用している色（カオス状態）

| カテゴリ | 現在の色 | 問題点 |
|---------|---------|--------|
| MBTIカード | `#8b5cf6` → `#db2777` (紫→ピンク) | 強いコントラスト |
| キャリアカード | `#2563eb` → `#7c3aed` (青→紫) | 別の紫系 |
| 愛の言語カード | `#10b981` → `#059669` (緑→緑) | 全く違う系統 |
| 学習スタイル | `#f97316` → `#ea580c` (オレンジ) | また別の色 |
| 色彩心理学 | `#06b6d4` → `#0891b2` (シアン) | また別の色 |
| エニアグラム | `#8b5cf6` → `#e11d48` (紫→赤) | 派手すぎ |
| 星座 | `#2563eb` → `#4f46e5` (青→インディゴ) | MBTIと被る |
| 認知スタイル | `#10b981` → `#0d9488` (緑→ティール) | また緑系 |
| 感情知能 | `#f97316` → `#d97706` (オレンジ→アンバー) | 学習スタイルと被る |

### 問題まとめ
1. **色が多すぎる**: 9種類以上のグラデーションが乱立
2. **統一感がない**: 各カードがバラバラで視覚的にうるさい
3. **ブランドカラーが不明確**: 何がpernectの色なのかわからない
4. **認知負荷が高い**: 目がチカチカする

---

## 3. カラースキーム提案

### Option A: Calm & Sophisticated（落ち着きと洗練）

**コンセプト**: 自己発見は落ち着いた環境で。Calmアプリのような深みのある色調

```
プライマリ:     #5B6EC7 (Muted Indigo)    - メインアクション、ブランドカラー
セカンダリ:     #8B9DC3 (Soft Periwinkle) - サブ要素、アクセント
アクセント:     #C9B8E8 (Lavender Mist)   - ハイライト、特別な要素
サポート1:      #7DCEA0 (Sage Green)      - ポジティブ、成功
サポート2:      #E8B87D (Warm Sand)       - 暖かみ、人間味
背景:           #F8F9FC (Cool White)      - 清潔感
テキスト:       #2D3748 (Charcoal)        - 読みやすさ
```

**カードへの適用例**:
- 人気テスト3枚: 同じプライマリカラーベース、アイコンで差別化
- おすすめ4枚: 白背景+アイコン色のみで差別化
- グラデーション使用は最小限に

---

### Option B: Soft & Friendly（柔らかくフレンドリー）

**コンセプト**: Headspaceのような明るさと親しみやすさ

```
プライマリ:     #6366F1 (Soft Purple)     - メインアクション
セカンダリ:     #F9A8D4 (Pink)            - 柔らかさ、感情
アクセント:     #FCD34D (Warm Yellow)     - 注目、ハイライト
サポート1:      #6EE7B7 (Mint)            - 新鮮さ、成長
サポート2:      #93C5FD (Sky Blue)        - 信頼、安心
背景:           #FFFBF5 (Warm White)      - 温かみ
テキスト:       #374151 (Gray 700)        - 読みやすさ
```

**特徴**:
- パステル調で目に優しい
- 16personalities風のカラフルさを維持しつつ統一感

---

### Option C: Nature & Balance（自然とバランス）

**コンセプト**: 自己発見は自然体で。アースカラーベース

```
プライマリ:     #059669 (Emerald)         - メインアクション、成長
セカンダリ:     #0891B2 (Cyan)            - バランス、調和
アクセント:     #D97706 (Amber)           - 暖かみ、活力
サポート1:      #7C3AED (Violet)          - 直感、深み
サポート2:      #475569 (Slate)           - 安定、信頼
背景:           #F8FAFC (Slate 50)        - ニュートラル
テキスト:       #1E293B (Slate 800)       - 高コントラスト
```

**特徴**:
- Ginger風の落ち着いた大人っぽさ
- 幅広い年齢層に対応

---

## 4. 推奨: Option A（Calm & Sophisticated）

### 理由
1. **自己発見アプリとの相性**: 内省的な活動に適した落ち着いたトーン
2. **差別化**: 派手な競合アプリとの差別化
3. **長時間使用に適切**: 目が疲れにくい
4. **プレミアム感**: 高品質なイメージを醸成

### 具体的な適用計画

#### Phase 1: 基本色の統一
```javascript
// tailwind.config.js
colors: {
  background: '#F8F9FC',
  foreground: '#2D3748',
  primary: '#5B6EC7',
  secondary: '#F1F4F9',
  accent: '#C9B8E8',
  muted: {
    DEFAULT: '#E2E8F0',
    foreground: '#64748B',
  },
  card: '#FFFFFF',
  border: '#E2E8F0',

  // カテゴリ別（控えめに）
  personality: '#5B6EC7',  // MBTI, エニアグラム
  career: '#7DCEA0',       // キャリア、学習
  emotion: '#E8B87D',      // 愛の言語、感情知能
  cognition: '#8B9DC3',    // 認知、色彩
}
```

#### Phase 2: カードデザインの統一
- グラデーション → 単色またはソフトグラデーション
- アイコン色で差別化
- 白背景+左端にカラーバー

#### Phase 3: アクセントの最小化
- 「新着」「人気」バッジは同じ色
- 星評価は単色
- 時間表示は全て同じグレー

---

## 5. 参考リンク

### 公式・記事
- [16Personalities](https://www.16personalities.com/)
- [16personalities Color Palette](https://www.color-hex.com/color-palette/1006687)
- [UXmatters - Color Psychology in Health Apps](https://www.uxmatters.com/mt/archives/2024/07/leveraging-the-psychology-of-color-in-ux-design-for-health-and-wellness-apps.php)
- [Fuzzy Math - Mental Healthcare UI](https://fuzzymath.com/blog/the-color-palettes-of-mental-healthcare-ui/)
- [Headspace Brand Overhaul](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- [UXPin - Color Schemes for Apps](https://www.uxpin.com/studio/blog/color-schemes-for-apps/)
- [MockFlow - Color Psychology 2025](https://mockflow.com/blog/color-psychology-in-ui-design)

### デザインリソース
- [Dribbble - Mental Health App](https://dribbble.com/tags/mental-health-app)
- [Figma - Mental Wellness UI Kit](https://www.figma.com/community/file/1379207519852717015/mental-wellness-mobile-app-free-ui-ux-design)

---

## 6. 次のステップ

1. **カラーオプションの確定**: A/B/Cから選択
2. **tailwind.config.js更新**: 新しいカラーパレット適用
3. **HomeScreen.tsx修正**: カードのグラデーション→統一色
4. **ProfileScreen.tsx修正**: 同様に統一
5. **WelcomeScreen.tsx修正**: ブランドカラー強調
6. **全体テスト**: 視覚的な統一感確認
