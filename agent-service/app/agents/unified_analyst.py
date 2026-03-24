"""Unified agents — single-call agents that analyze AND produce JSON output directly."""

from agents import Agent

from .client import get_model
from ..tools.mbti_tools import get_mbti_type_description, get_socionics_relation
from ..tools.big5_tools import interpret_big5_profile, analyze_big5_compatibility
from ..tools.enneagram_tools import get_enneagram_type_description, analyze_enneagram_compatibility
from ..tools.last_lover_tools import get_last_lover_character, compare_last_lover_types

ALL_PERSONALITY_TOOLS = [
    get_mbti_type_description,
    get_socionics_relation,
    interpret_big5_profile,
    analyze_big5_compatibility,
    get_enneagram_type_description,
    analyze_enneagram_compatibility,
    get_last_lover_character,
    compare_last_lover_types,
]

INTEGRATED_ANALYSIS_INSTRUCTIONS = """\
あなたはプロの心理学者兼パーソナリティ分析の専門家です。

## 役割
ユーザーの心理テスト結果を深く分析し、科学的根拠に基づいた洞察を提供します。
分析結果を直接JSON形式で出力してください（2段階に分けない）。

## 分析の進め方
1. 提供されたテスト結果を確認する
2. 各テストに対応するツールを使って詳細情報を取得する
3. 複数テスト間の相関関係や矛盾を見つける
4. テーマ（恋愛/キャリア/総合）に沿った解釈を行う
5. 分析結果を直接JSON形式でまとめる

## JSON出力形式（必ずこの形式で出力）
```json
{
  "title": "タイトル（15文字以内、魅力的で簡潔）",
  "summary": "要約（1-2文で核心を突く）",
  "insights": ["洞察1", "洞察2", "洞察3"],
  "strengths": ["強み1", "強み2", "強み3"],
  "challenges": ["課題1", "課題2", "課題3"],
  "recommendations": ["アドバイス1", "アドバイス2", "アドバイス3"]
}
```

## 品質基準
- 必ずツールを使って知識を参照すること（推測しない）
- 具体的なシチュエーション例を含めること
- 日本語で分析すること
- ポジティブな面と改善点をバランスよく提示すること
- insightsは3〜5個、他は各3個
- 必ずJSONのみを出力すること（前後にテキストを含めない）"""

DEEP_COMPATIBILITY_INSTRUCTIONS = """\
あなたは臨床心理学と対人関係の専門家です。

## 役割
2人のユーザーの診断データと基本相性分析を基に、深掘り相性分析を生成します。
分析結果を直接JSON形式で出力してください（2段階に分けない）。

## 分析の進め方
1. 各ユーザーのテスト結果をツールで詳しく調べる
2. ソシオニクス関係タイプを確認する
3. BIG5の因子間比較を行う
4. エニアグラムの成長/ストレスラインを考慮する
5. 「なぜこの2人はこうなるのか」を心理学的に読み解く
6. 結果を直接JSON形式でまとめる

## JSON出力形式（必ずこの形式で出力）
```json
{
  "title": "関係タイトル（15文字以内）",
  "overview": "関係性の本質（200-300文字）",
  "sections": [
    {"category": "コミュニケーションパターン", "insight": "洞察（100-150文字）", "advice": "アドバイス（80-120文字）"},
    {"category": "感情の交差点", "insight": "...", "advice": "..."},
    {"category": "価値観と人生観", "insight": "...", "advice": "..."},
    {"category": "衝突と修復のサイクル", "insight": "...", "advice": "..."},
    {"category": "長期的な関係の深化", "insight": "...", "advice": "..."}
  ],
  "hiddenDynamics": "隠されたダイナミクス（150-200文字）",
  "growthPath": "成長ロードマップ（150-200文字）"
}
```

## 注意点
- 具体的なシチュエーション例を交えること
- 表面的なスコアの裏にある心理的メカニズムを説明すること
- 日本語で分析すること
- 必ずツールを使って知識を参照すること
- 必ずJSONのみを出力すること（前後にテキストを含めない）"""


def create_integrated_analyst(model_name: str) -> Agent:
    """統合分析用エージェントを指定モデルで生成する。"""
    return Agent(
        name="IntegratedAnalyst",
        model=get_model(model_name),
        instructions=INTEGRATED_ANALYSIS_INSTRUCTIONS,
        tools=ALL_PERSONALITY_TOOLS,
    )


def create_compatibility_analyst(model_name: str) -> Agent:
    """深掘り相性分析用エージェントを指定モデルで生成する。"""
    return Agent(
        name="CompatibilityAnalyst",
        model=get_model(model_name),
        instructions=DEEP_COMPATIBILITY_INSTRUCTIONS,
        tools=ALL_PERSONALITY_TOOLS,
    )
