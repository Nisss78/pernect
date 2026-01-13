# Schwartz価値観診断 要件定義

## 概要

Shalom Schwartzの価値観理論に基づく診断。人生で何を大切にするかを10の普遍的価値で測定し、個人の価値観プロファイルを可視化する。

## 機能要件

### FR-1: 診断実行
- 40問の質問に回答（10価値 × 4問）
- 各質問は6段階評価（1: 全く重要でない 〜 6: 非常に重要）
- 所要時間: 約10分

### FR-2: 結果表示
- 10の価値観のスコアをレーダーチャートで表示
- 上位3つの価値観をハイライト
- 4つの高次価値（自己超越、保守、自己高揚、変化への開放性）の傾向

### FR-3: 結果保存
- testResultsテーブルに保存
- スコアリングタイプ: percentile

## 10の普遍的価値

1. **Self-Direction（自己決定）**: 独立した思考と行動の自由
2. **Stimulation（刺激）**: 興奮、新奇性、人生の挑戦
3. **Hedonism（快楽）**: 自分自身のための喜びと感覚的満足
4. **Achievement（達成）**: 社会的基準に基づく個人的成功
5. **Power（権力）**: 社会的地位、威信、他者への支配
6. **Security（安全）**: 社会と関係性の安全、安定、調和
7. **Conformity（同調）**: 他者を傷つけたり社会規範に反する行動の抑制
8. **Tradition（伝統）**: 文化や宗教の慣習と考え方の尊重
9. **Benevolence（博愛）**: 身近な人々の福祉の保全と向上
10. **Universalism（普遍主義）**: すべての人と自然の福祉の理解と保護

## 4つの高次価値

- **自己超越（Self-Transcendence）**: 博愛 + 普遍主義
- **保守（Conservation）**: 安全 + 同調 + 伝統
- **自己高揚（Self-Enhancement）**: 権力 + 達成
- **変化への開放性（Openness to Change）**: 自己決定 + 刺激

※快楽は「変化への開放性」と「自己高揚」の両方に関連

## 非機能要件

### NFR-1: パフォーマンス
- 質問読み込み: 1秒以内
- 結果計算: 2秒以内

### NFR-2: UX
- 進捗バーで現在位置を表示
- スライダーまたはボタンで直感的に回答

## 引用

Schwartz, S. H. (1992). Universals in the content and structure of values: Theoretical advances and empirical tests in 20 countries. Advances in Experimental Social Psychology, 25, 1-65.
