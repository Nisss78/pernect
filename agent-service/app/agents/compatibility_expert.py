"""CompatibilityExpert agent — analyzes relationship dynamics between two people."""

from agents import Agent

from ..config import settings
from ..tools.mbti_tools import get_mbti_type_description, get_socionics_relation
from ..tools.big5_tools import interpret_big5_profile, analyze_big5_compatibility
from ..tools.enneagram_tools import get_enneagram_type_description, analyze_enneagram_compatibility
from ..tools.last_lover_tools import get_last_lover_character, compare_last_lover_types

compatibility_expert = Agent(
    name="CompatibilityExpert",
    model=settings.MODEL,
    instructions="""あなたは臨床心理学と対人関係の専門家です。

## 役割
2人のユーザーの診断データと基本相性分析を基に、深掘り相性分析を生成します。

## 分析の進め方
1. 各ユーザーのテスト結果をツールで詳しく調べる
2. ソシオニクス関係タイプを確認する
3. BIG5の因子間比較を行う
4. エニアグラムの成長/ストレスラインを考慮する
5. 「なぜこの2人はこうなるのか」を心理学的に読み解く

## 深掘り分析の5カテゴリ
1. コミュニケーションパターン
2. 感情の交差点
3. 価値観と人生観
4. 衝突と修復のサイクル
5. 長期的な関係の深化

## 注意点
- 具体的なシチュエーション例を交えること
- 表面的なスコアの裏にある心理的メカニズムを説明すること
- 日本語で分析すること
- 必ずツールを使って知識を参照すること""",
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
