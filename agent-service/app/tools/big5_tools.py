"""BIG5 personality knowledge tools for agents."""

from agents import function_tool

# Malouff 2010 meta-analysis weights
BIG5_WEIGHTS = {"N": 0.30, "A": 0.28, "C": 0.22, "E": 0.12, "O": 0.08}

FACTOR_NAMES = {
    "N": ("神経症的傾向", "Neuroticism"),
    "A": ("協調性", "Agreeableness"),
    "C": ("誠実性", "Conscientiousness"),
    "E": ("外向性", "Extraversion"),
    "O": ("開放性", "Openness"),
}

FACTOR_DESCRIPTIONS = {
    "N": {
        "high": "感情の起伏が大きく、ストレスに敏感。繊細で共感力が高い反面、不安を感じやすい",
        "mid": "感情的に比較的安定。適度な感受性を持ちながらもバランスが取れている",
        "low": "感情的に安定しており、ストレス耐性が高い。冷静に物事に対処できる",
    },
    "A": {
        "high": "協力的で思いやりがあり、人間関係を大切にする。チームワークに優れる",
        "mid": "状況に応じて協調的にも競争的にもなれる。バランスの取れた対人スタイル",
        "low": "独立的で自己主張が強い。論理的で客観的な判断を重視する",
    },
    "C": {
        "high": "計画的で責任感が強く、目標達成に向けて着実に努力する。自己規律がある",
        "mid": "適度に計画的で、柔軟性も持ち合わせている",
        "low": "柔軟で自発的。ルーティンより即興を好み、型にはまらない発想ができる",
    },
    "E": {
        "high": "社交的でエネルギッシュ。人との交流からエネルギーを得る",
        "mid": "社交性と内省性のバランスが取れている。状況に応じて切り替えられる",
        "low": "内省的で一人の時間を大切にする。深い思考と集中力に優れる",
    },
    "O": {
        "high": "知的好奇心が旺盛で、新しい経験や芸術に対して開放的",
        "mid": "伝統と革新のバランスが取れている。必要に応じて新しいことも取り入れる",
        "low": "現実的で実践的。既知の方法を好み、安定性を重視する",
    },
}


def _normalize_key(key: str) -> str:
    mapping = {
        "neuroticism": "N", "agreeableness": "A", "conscientiousness": "C",
        "extraversion": "E", "openness": "O",
        "n": "N", "a": "A", "c": "C", "e": "E", "o": "O",
    }
    return mapping.get(key.lower(), key.upper())


def _level(score: float) -> str:
    if score >= 65:
        return "high"
    if score >= 35:
        return "mid"
    return "low"


@function_tool
def interpret_big5_profile(percentiles_json: str) -> str:
    """BIG5パーセンタイルスコアを解釈して特性プロファイルを返す。
    percentiles_json: '{"N": 65, "A": 45, "C": 72, "E": 38, "O": 80}' のようなJSON文字列"""
    import json as _json
    percentiles = _json.loads(percentiles_json)
    normed = {_normalize_key(k): v for k, v in percentiles.items()}
    lines: list[str] = ["【BIG5パーソナリティプロファイル】"]

    for factor in ["N", "A", "C", "E", "O"]:
        score = normed.get(factor)
        if score is None:
            continue
        ja, en = FACTOR_NAMES[factor]
        lvl = _level(score)
        desc = FACTOR_DESCRIPTIONS[factor][lvl]
        lines.append(f"- {ja}({en}): {score}% → {desc}")

    return "\n".join(lines)


@function_tool
def analyze_big5_compatibility(
    user1_percentiles_json: str,
    user2_percentiles_json: str,
) -> str:
    """2人のBIG5パーセンタイルから相性分析を返す（Malouff 2010メタ分析ベース）。
    各引数はJSON文字列: '{"N": 65, "A": 45, "C": 72, "E": 38, "O": 80}'"""
    import json as _json
    user1_percentiles = _json.loads(user1_percentiles_json)
    user2_percentiles = _json.loads(user2_percentiles_json)
    p1 = {_normalize_key(k): v for k, v in user1_percentiles.items()}
    p2 = {_normalize_key(k): v for k, v in user2_percentiles.items()}

    details: list[str] = []
    total_score = 0.0
    total_weight = 0.0

    # N: both low is better
    if "N" in p1 and "N" in p2:
        avg_n = (p1["N"] + p2["N"]) / 2
        sim = 100 - abs(p1["N"] - p2["N"])
        n_score = (100 - avg_n) * 0.6 + sim * 0.4
        total_score += n_score * BIG5_WEIGHTS["N"]
        total_weight += BIG5_WEIGHTS["N"]
        details.append(f"N(神経症的傾向): {p1['N']}% vs {p2['N']}% → 低いほど安定的な関係")

    # A: similarity + high is better
    if "A" in p1 and "A" in p2:
        avg_a = (p1["A"] + p2["A"]) / 2
        sim = 100 - abs(p1["A"] - p2["A"])
        a_score = avg_a * 0.5 + sim * 0.5
        total_score += a_score * BIG5_WEIGHTS["A"]
        total_weight += BIG5_WEIGHTS["A"]
        details.append(f"A(協調性): {p1['A']}% vs {p2['A']}% → 高さと類似性が重要")

    # C: similarity is most important
    if "C" in p1 and "C" in p2:
        sim = 100 - abs(p1["C"] - p2["C"])
        avg_c = (p1["C"] + p2["C"]) / 2
        c_score = sim * 0.7 + avg_c * 0.3
        total_score += c_score * BIG5_WEIGHTS["C"]
        total_weight += BIG5_WEIGHTS["C"]
        details.append(f"C(誠実性): {p1['C']}% vs {p2['C']}% → 類似性が最も重要")

    # E: moderate difference (15-40) is ideal
    if "E" in p1 and "E" in p2:
        diff = abs(p1["E"] - p2["E"])
        if 15 <= diff <= 40:
            e_score = 90.0
        elif diff < 15:
            e_score = 70 + diff * (20 / 15)
        else:
            e_score = max(30, 90 - (diff - 40) * 1.5)
        total_score += e_score * BIG5_WEIGHTS["E"]
        total_weight += BIG5_WEIGHTS["E"]
        details.append(f"E(外向性): {p1['E']}% vs {p2['E']}% → 適度な差(15-40)が理想")

    # O: similarity
    if "O" in p1 and "O" in p2:
        sim = 100 - abs(p1["O"] - p2["O"])
        avg_o = (p1["O"] + p2["O"]) / 2
        o_score = sim * 0.8 + avg_o * 0.2
        total_score += o_score * BIG5_WEIGHTS["O"]
        total_weight += BIG5_WEIGHTS["O"]
        details.append(f"O(開放性): {p1['O']}% vs {p2['O']}% → 類似性が重要")

    overall = round(total_score / total_weight) if total_weight > 0 else 65
    return f"BIG5相性スコア: {overall}/100\n" + "\n".join(details)
