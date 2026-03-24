"""MBTI knowledge tools for agents."""

from agents import function_tool

# Cognitive function stacks
COGNITIVE_FUNCTIONS: dict[str, list[str]] = {
    "INTJ": ["Ni", "Te", "Fi", "Se"],
    "INTP": ["Ti", "Ne", "Si", "Fe"],
    "ENTJ": ["Te", "Ni", "Se", "Fi"],
    "ENTP": ["Ne", "Ti", "Fe", "Si"],
    "INFJ": ["Ni", "Fe", "Ti", "Se"],
    "INFP": ["Fi", "Ne", "Si", "Te"],
    "ENFJ": ["Fe", "Ni", "Se", "Ti"],
    "ENFP": ["Ne", "Fi", "Te", "Si"],
    "ISTJ": ["Si", "Te", "Fi", "Ne"],
    "ISFJ": ["Si", "Fe", "Ti", "Ne"],
    "ESTJ": ["Te", "Si", "Ne", "Fi"],
    "ESFJ": ["Fe", "Si", "Ne", "Ti"],
    "ISTP": ["Ti", "Se", "Ni", "Fe"],
    "ISFP": ["Fi", "Se", "Ni", "Te"],
    "ESTP": ["Se", "Ti", "Fe", "Ni"],
    "ESFP": ["Se", "Fi", "Te", "Ni"],
}

# Socionics relation types with scores
MBTI_TYPES = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP",
]

RELATION_NAMES = {
    "Duality": ("双対関係", 95),
    "Identity": ("同一関係", 85),
    "Activity": ("活性化関係", 78),
    "Mirror": ("鏡像関係", 72),
    "SemiDual": ("準双対関係", 62),
    "Mirage": ("幻影関係", 58),
    "LookALike": ("類似関係", 52),
    "Kindred": ("同族関係", 50),
    "Benefit": ("恩恵関係", 42),
    "Benefit_r": ("被恩恵関係", 38),
    "Supervision": ("監督関係", 32),
    "Supervision_r": ("被監督関係", 28),
    "SuperEgo": ("超自我関係", 22),
    "Extinguishment": ("消滅関係", 20),
    "QuasiIdentity": ("準同一関係", 15),
    "Conflict": ("衝突関係", 10),
}

# 16x16 socionics relation matrix (same order as MBTI_TYPES)
SOCIONICS_RELATIONS = [
    ["Identity","Mirror","Activity","Duality","LookALike","Kindred","Mirage","SemiDual","Benefit","Supervision","Benefit_r","Supervision_r","SuperEgo","Extinguishment","QuasiIdentity","Conflict"],
    ["Mirror","Identity","Duality","Activity","Kindred","LookALike","SemiDual","Mirage","Supervision","Benefit","Supervision_r","Benefit_r","Extinguishment","SuperEgo","Conflict","QuasiIdentity"],
    ["Activity","Duality","Identity","Mirror","Mirage","SemiDual","LookALike","Kindred","Benefit_r","Supervision_r","Benefit","Supervision","QuasiIdentity","Conflict","SuperEgo","Extinguishment"],
    ["Duality","Activity","Mirror","Identity","SemiDual","Mirage","Kindred","LookALike","Supervision_r","Benefit_r","Supervision","Benefit","Conflict","QuasiIdentity","Extinguishment","SuperEgo"],
    ["LookALike","Kindred","Mirage","SemiDual","Identity","Mirror","Activity","Duality","SuperEgo","Extinguishment","QuasiIdentity","Conflict","Benefit","Supervision","Benefit_r","Supervision_r"],
    ["Kindred","LookALike","SemiDual","Mirage","Mirror","Identity","Duality","Activity","Extinguishment","SuperEgo","Conflict","QuasiIdentity","Supervision","Benefit","Supervision_r","Benefit_r"],
    ["Mirage","SemiDual","LookALike","Kindred","Activity","Duality","Identity","Mirror","QuasiIdentity","Conflict","SuperEgo","Extinguishment","Benefit_r","Supervision_r","Benefit","Supervision"],
    ["SemiDual","Mirage","Kindred","LookALike","Duality","Activity","Mirror","Identity","Conflict","QuasiIdentity","Extinguishment","SuperEgo","Supervision_r","Benefit_r","Supervision","Benefit"],
    ["Benefit_r","Supervision_r","Benefit","Supervision","SuperEgo","Extinguishment","QuasiIdentity","Conflict","Identity","Mirror","Activity","Duality","LookALike","Kindred","Mirage","SemiDual"],
    ["Supervision_r","Benefit_r","Supervision","Benefit","Extinguishment","SuperEgo","Conflict","QuasiIdentity","Mirror","Identity","Duality","Activity","Kindred","LookALike","SemiDual","Mirage"],
    ["Benefit","Supervision","Benefit_r","Supervision_r","QuasiIdentity","Conflict","SuperEgo","Extinguishment","Activity","Duality","Identity","Mirror","Mirage","SemiDual","LookALike","Kindred"],
    ["Supervision","Benefit","Supervision_r","Benefit_r","Conflict","QuasiIdentity","Extinguishment","SuperEgo","Duality","Activity","Mirror","Identity","SemiDual","Mirage","Kindred","LookALike"],
    ["SuperEgo","Extinguishment","QuasiIdentity","Conflict","Benefit_r","Supervision_r","Benefit","Supervision","LookALike","Kindred","Mirage","SemiDual","Identity","Mirror","Activity","Duality"],
    ["Extinguishment","SuperEgo","Conflict","QuasiIdentity","Supervision_r","Benefit_r","Supervision","Benefit","Kindred","LookALike","SemiDual","Mirage","Mirror","Identity","Duality","Activity"],
    ["QuasiIdentity","Conflict","SuperEgo","Extinguishment","Benefit","Supervision","Benefit_r","Supervision_r","Mirage","SemiDual","LookALike","Kindred","Activity","Duality","Identity","Mirror"],
    ["Conflict","QuasiIdentity","Extinguishment","SuperEgo","Supervision","Benefit","Supervision_r","Benefit_r","SemiDual","Mirage","Kindred","LookALike","Duality","Activity","Mirror","Identity"],
]

TYPE_DESCRIPTIONS: dict[str, dict] = {
    "INTJ": {
        "name": "建築家",
        "traits": "独立的・戦略的・高い基準を持つ",
        "strengths": ["戦略的思考", "独立性", "決断力", "知的好奇心"],
        "weaknesses": ["感情表現が苦手", "完璧主義", "社交的場面でのストレス"],
        "cognitive_summary": "Ni(内向的直観)で未来のビジョンを描き、Te(外向的思考)で効率的に実行する",
    },
    "INTP": {
        "name": "論理学者",
        "traits": "分析的・独創的・理論好き",
        "strengths": ["論理的分析力", "創造性", "客観性", "問題解決力"],
        "weaknesses": ["実行力の不足", "感情への鈍感さ", "細部の見落とし"],
        "cognitive_summary": "Ti(内向的思考)で深い分析を行い、Ne(外向的直観)で可能性を探求する",
    },
    "ENTJ": {
        "name": "指揮官",
        "traits": "リーダー的・効率重視・目標志向",
        "strengths": ["リーダーシップ", "戦略的計画", "効率性", "自信"],
        "weaknesses": ["支配的になりがち", "感情の軽視", "忍耐力の不足"],
        "cognitive_summary": "Te(外向的思考)で組織を統率し、Ni(内向的直観)で長期ビジョンを見据える",
    },
    "ENTP": {
        "name": "討論者",
        "traits": "革新的・知的・挑戦好き",
        "strengths": ["創造的思考", "適応力", "議論力", "問題の本質把握"],
        "weaknesses": ["集中力の分散", "ルーティンへの苦手意識", "議論の過熱"],
        "cognitive_summary": "Ne(外向的直観)で新しい可能性を探り、Ti(内向的思考)で論理的に分析する",
    },
    "INFJ": {
        "name": "提唱者",
        "traits": "洞察力が深い・理想主義・共感的",
        "strengths": ["深い洞察力", "共感力", "ビジョン", "献身性"],
        "weaknesses": ["理想主義すぎる", "燃え尽き", "対立回避"],
        "cognitive_summary": "Ni(内向的直観)で深い洞察を得て、Fe(外向的感情)で人々を導く",
    },
    "INFP": {
        "name": "仲介者",
        "traits": "理想主義・創造的・共感的",
        "strengths": ["創造性", "共感力", "価値観の一貫性", "適応力"],
        "weaknesses": ["決断の遅さ", "批判への過敏さ", "現実逃避"],
        "cognitive_summary": "Fi(内向的感情)で深い価値観を持ち、Ne(外向的直観)で可能性を想像する",
    },
    "ENFJ": {
        "name": "主人公",
        "traits": "カリスマ的・利他的・外交的",
        "strengths": ["人の動機づけ", "コミュニケーション", "リーダーシップ", "共感力"],
        "weaknesses": ["自己犠牲", "過干渉", "批判への過敏さ"],
        "cognitive_summary": "Fe(外向的感情)で人々のニーズを察知し、Ni(内向的直観)でビジョンを描く",
    },
    "ENFP": {
        "name": "広報運動家",
        "traits": "情熱的・創造的・社交的",
        "strengths": ["熱意", "創造性", "社交性", "適応力"],
        "weaknesses": ["集中力の分散", "実行力の不足", "感情の起伏"],
        "cognitive_summary": "Ne(外向的直観)で無限の可能性を探り、Fi(内向的感情)で深い価値観を持つ",
    },
    "ISTJ": {
        "name": "管理者",
        "traits": "責任感が強い・実直・体系的",
        "strengths": ["信頼性", "組織力", "責任感", "忍耐力"],
        "weaknesses": ["柔軟性の不足", "変化への抵抗", "感情表現の控えめさ"],
        "cognitive_summary": "Si(内向的感覚)で経験を蓄積し、Te(外向的思考)で効率的に実行する",
    },
    "ISFJ": {
        "name": "擁護者",
        "traits": "献身的・温かい・実務的",
        "strengths": ["献身性", "観察力", "信頼性", "思いやり"],
        "weaknesses": ["自己主張の弱さ", "変化への不安", "過度な自己犠牲"],
        "cognitive_summary": "Si(内向的感覚)で細部に気を配り、Fe(外向的感情)で人を支える",
    },
    "ESTJ": {
        "name": "幹部",
        "traits": "組織的・決断力がある・伝統的",
        "strengths": ["組織力", "実行力", "リーダーシップ", "論理性"],
        "weaknesses": ["柔軟性の不足", "感情への鈍感さ", "支配的"],
        "cognitive_summary": "Te(外向的思考)で効率を追求し、Si(内向的感覚)で秩序を維持する",
    },
    "ESFJ": {
        "name": "領事官",
        "traits": "社交的・協調的・思いやりがある",
        "strengths": ["社交性", "協調性", "実務力", "忠誠心"],
        "weaknesses": ["批判への過敏さ", "承認欲求", "変化への抵抗"],
        "cognitive_summary": "Fe(外向的感情)で調和を作り、Si(内向的感覚)で安定を提供する",
    },
    "ISTP": {
        "name": "巨匠",
        "traits": "実践的・分析的・適応力がある",
        "strengths": ["問題解決力", "適応力", "冷静さ", "実践力"],
        "weaknesses": ["長期計画の苦手さ", "感情表現の乏しさ", "コミットメントの回避"],
        "cognitive_summary": "Ti(内向的思考)で原理を分析し、Se(外向的感覚)で即座に行動する",
    },
    "ISFP": {
        "name": "冒険家",
        "traits": "芸術的・感受性豊か・自由",
        "strengths": ["芸術的感性", "共感力", "柔軟性", "現在を楽しむ力"],
        "weaknesses": ["計画性の不足", "対立回避", "自己主張の弱さ"],
        "cognitive_summary": "Fi(内向的感情)で深い価値観を持ち、Se(外向的感覚)で美を体感する",
    },
    "ESTP": {
        "name": "起業家",
        "traits": "行動的・社交的・現実的",
        "strengths": ["行動力", "観察力", "社交性", "危機対応力"],
        "weaknesses": ["衝動性", "長期思考の苦手さ", "感情面の未熟さ"],
        "cognitive_summary": "Se(外向的感覚)で機会を捉え、Ti(内向的思考)で瞬時に分析する",
    },
    "ESFP": {
        "name": "エンターテイナー",
        "traits": "陽気・自発的・人好き",
        "strengths": ["社交性", "楽観性", "実践力", "適応力"],
        "weaknesses": ["計画性の不足", "長期的思考の弱さ", "批判への過敏さ"],
        "cognitive_summary": "Se(外向的感覚)で今を楽しみ、Fi(内向的感情)で人の気持ちに寄り添う",
    },
}


@function_tool
def get_mbti_type_description(mbti_type: str) -> str:
    """MBTIタイプの認知機能スタック・強み・弱みを返す。mbti_typeは4文字（例: ENFP）"""
    t = mbti_type.upper().strip()
    desc = TYPE_DESCRIPTIONS.get(t)
    if not desc:
        return f"不明なMBTIタイプ: {t}"

    funcs = COGNITIVE_FUNCTIONS.get(t, [])
    return (
        f"【{t} - {desc['name']}】\n"
        f"特徴: {desc['traits']}\n"
        f"認知機能: {' > '.join(funcs)}\n"
        f"{desc['cognitive_summary']}\n"
        f"強み: {', '.join(desc['strengths'])}\n"
        f"弱み: {', '.join(desc['weaknesses'])}"
    )


@function_tool
def get_socionics_relation(type1: str, type2: str) -> str:
    """2つのMBTIタイプ間のソシオニクス関係タイプ・相性スコア・解説を返す"""
    t1, t2 = type1.upper().strip(), type2.upper().strip()
    try:
        i1 = MBTI_TYPES.index(t1)
        i2 = MBTI_TYPES.index(t2)
    except ValueError:
        return f"不明なタイプが含まれています: {t1}, {t2}"

    rel = SOCIONICS_RELATIONS[i1][i2]
    ja_name, score = RELATION_NAMES[rel]

    f1 = COGNITIVE_FUNCTIONS.get(t1, [])
    f2 = COGNITIVE_FUNCTIONS.get(t2, [])
    complement = ""
    if f1 and f2:
        dom1 = f1[0].rstrip("ie")
        inf2 = f2[3].rstrip("ie")
        if dom1 == inf2:
            complement = "（主機能↔劣等機能の補完あり）"

    return (
        f"{t1} × {t2}: {ja_name}（{rel}）\n"
        f"相性スコア: {score}/100\n"
        f"認知機能: {' > '.join(f1)} vs {' > '.join(f2)}{complement}"
    )
