"""Report formatting tools for agents."""

from agents import function_tool


@function_tool
def format_integrated_analysis(
    title: str,
    summary: str,
    insights: list[str],
    strengths: list[str],
    challenges: list[str],
    recommendations: list[str],
) -> str:
    """統合分析の結果を整形されたレポートテキストに変換する"""
    sections = [
        f"# {title}",
        f"\n{summary}",
        "\n## 主要インサイト",
        *[f"- {i}" for i in insights],
        "\n## 強み",
        *[f"- {s}" for s in strengths],
        "\n## 課題",
        *[f"- {c}" for c in challenges],
        "\n## アドバイス",
        *[f"- {r}" for r in recommendations],
    ]
    return "\n".join(sections)


@function_tool
def format_deep_compatibility(
    title: str,
    overview: str,
    sections_json: str,
    hidden_dynamics: str,
    growth_path: str,
) -> str:
    """深掘り相性分析の結果を整形されたレポートテキストに変換する。
    sections_json: '[{"category": "名前", "insight": "洞察", "advice": "助言"}, ...]' のJSON文字列"""
    import json as _json
    sections = _json.loads(sections_json)
    parts = [
        f"# {title}",
        f"\n{overview}",
    ]
    for s in sections:
        parts.append(f"\n## {s['category']}")
        parts.append(f"洞察: {s['insight']}")
        parts.append(f"アドバイス: {s['advice']}")

    parts.append(f"\n## 隠されたダイナミクス\n{hidden_dynamics}")
    parts.append(f"\n## 成長ロードマップ\n{growth_path}")
    return "\n".join(parts)
