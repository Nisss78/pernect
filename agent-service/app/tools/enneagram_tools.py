"""Enneagram knowledge tools for agents."""

from agents import function_tool

# 9x9 compatibility matrix (457 couple study + Riso-Hudson + 3-center theory)
ENNEAGRAM_MATRIX = [
    [65, 82, 68, 60, 62, 72, 78, 55, 75],  # Type 1
    [82, 70, 75, 80, 55, 78, 85, 62, 72],  # Type 2
    [68, 75, 60, 55, 58, 70, 72, 65, 78],  # Type 3
    [60, 80, 55, 58, 72, 65, 62, 52, 82],  # Type 4
    [62, 55, 58, 72, 65, 68, 70, 60, 75],  # Type 5
    [72, 78, 70, 65, 68, 62, 58, 75, 80],  # Type 6
    [78, 85, 72, 62, 70, 58, 68, 75, 82],  # Type 7
    [55, 62, 65, 52, 60, 75, 75, 58, 72],  # Type 8
    [75, 72, 78, 82, 75, 80, 82, 72, 70],  # Type 9
]

GROWTH_LINES = {1: 7, 2: 4, 3: 6, 4: 1, 5: 8, 6: 9, 7: 5, 8: 2, 9: 3}
STRESS_LINES = {1: 4, 2: 8, 3: 9, 4: 2, 5: 7, 6: 3, 7: 1, 8: 5, 9: 6}

CENTERS = {2: "Heart", 3: "Heart", 4: "Heart", 5: "Head", 6: "Head", 7: "Head", 8: "Body", 9: "Body", 1: "Body"}

TYPE_DESCRIPTIONS = {
    1: ("改革者", "理想主義的で、正しさと改善を追求。内なる批判者を持ち、責任感が強い"),
    2: ("助ける人", "愛情深く、人のニーズに敏感。与えることで自己価値を確認する傾向"),
    3: ("達成者", "目標志向で効率的。成功と承認を追求し、適応力が高い"),
    4: ("個性的な人", "感受性が豊かで独創的。深い感情世界を持ち、本物の自己表現を求める"),
    5: ("観察者", "知的好奇心が強く、分析的。知識の蓄積と内面の独立を重視"),
    6: ("忠実な人", "誠実で責任感があり、安全を重視。不安に向き合い、信頼関係を大切にする"),
    7: ("熱中する人", "楽観的で多才。新しい経験を追求し、苦痛を回避する傾向"),
    8: ("挑戦者", "力強く自信がある。正義感が強く、自己と他者の保護を重視"),
    9: ("平和主義者", "調和を重視し、受容力が高い。内面の平和と安定を求める"),
}


def _parse_type(s: str) -> int:
    import re
    m = re.search(r"(\d)", s)
    return int(m.group(1)) if m else 0


@function_tool
def get_enneagram_type_description(enneagram_type: str) -> str:
    """エニアグラムタイプの詳細説明を返す。enneagram_type: 'タイプ1', 'Type 1', '1' など"""
    t = _parse_type(enneagram_type)
    if t < 1 or t > 9:
        return f"不明なエニアグラムタイプ: {enneagram_type}"

    name, desc = TYPE_DESCRIPTIONS[t]
    center = CENTERS[t]
    growth = GROWTH_LINES[t]
    stress = STRESS_LINES[t]
    center_ja = {"Heart": "感情", "Head": "思考", "Body": "本能"}.get(center, center)

    return (
        f"【タイプ{t} - {name}】\n"
        f"{desc}\n"
        f"センター: {center_ja}センター\n"
        f"成長方向: タイプ{growth}（{TYPE_DESCRIPTIONS[growth][0]}の良さを取り入れる）\n"
        f"ストレス方向: タイプ{stress}（{TYPE_DESCRIPTIONS[stress][0]}の負の面が出やすい）"
    )


@function_tool
def analyze_enneagram_compatibility(type1: str, type2: str) -> str:
    """2つのエニアグラムタイプ間の相性を分析する"""
    t1 = _parse_type(type1)
    t2 = _parse_type(type2)
    if t1 < 1 or t1 > 9 or t2 < 1 or t2 > 9:
        return f"不明なタイプが含まれています: {type1}, {type2}"

    score = ENNEAGRAM_MATRIX[t1 - 1][t2 - 1]

    # Growth/stress line bonuses
    growth_bonus = GROWTH_LINES[t1] == t2 or GROWTH_LINES[t2] == t1
    stress_link = STRESS_LINES[t1] == t2 or STRESS_LINES[t2] == t1
    same_center = CENTERS[t1] == CENTERS[t2] and t1 != t2

    if growth_bonus:
        score += 5
    if stress_link:
        score += 2
    if same_center:
        score -= 3

    score = max(0, min(100, score))

    n1, d1 = TYPE_DESCRIPTIONS[t1]
    n2, d2 = TYPE_DESCRIPTIONS[t2]

    lines = [
        f"タイプ{t1}({n1}) × タイプ{t2}({n2})",
        f"相性スコア: {score}/100",
    ]
    if growth_bonus:
        lines.append("成長ラインで結ばれており、互いの成長を促し合える関係")
    if stress_link:
        lines.append("ストレスラインで繋がり、強い化学反応がある反面、緊張も生まれやすい")
    if same_center:
        center_ja = {"Heart": "感情", "Head": "思考", "Body": "本能"}.get(CENTERS[t1], "")
        lines.append(f"同じ{center_ja}センターのため、似た課題を抱えやすい")

    return "\n".join(lines)
