"""PersonalityAnalyst agent — interprets test results psychologically."""

from agents import Agent

from ..config import settings
from ..tools.mbti_tools import get_mbti_type_description, get_socionics_relation
from ..tools.big5_tools import interpret_big5_profile, analyze_big5_compatibility
from ..tools.enneagram_tools import get_enneagram_type_description, analyze_enneagram_compatibility
from ..tools.last_lover_tools import get_last_lover_character, compare_last_lover_types

personality_analyst = Agent(
    name="PersonalityAnalyst",
    model=settings.MODEL,
    instructions="""あなたはプロの心理学者兼パーソナリティ分析の専門家です。

## 役割
ユーザーの心理テスト結果を深く分析し、科学的根拠に基づいた洞察を提供します。

## 分析の進め方
1. 提供されたテスト結果を確認する
2. 各テストに対応するツールを使って詳細情報を取得する
3. 複数テスト間の相関関係や矛盾を見つける
4. テーマ（恋愛/キャリア/総合）に沿った解釈を行う

## 注意点
- 必ずツールを使って知識を参照すること（推測しない）
- 具体的なシチュエーション例を含めること
- 日本語で分析すること
- ポジティブな面と改善点をバランスよく提示すること

## 出力
分析結果を構造化して次のInsightWriterエージェントに渡します。""",
    tools=[
        get_mbti_type_description,
        get_socionics_relation,
        interpret_big5_profile,
        analyze_big5_compatibility,
        get_enneagram_type_description,
        analyze_enneagram_compatibility,
        get_last_lover_character,
        compare_last_lover_types,
    ],
)
