"""Last Lover character knowledge tools for agents."""

from agents import function_tool

# 16 Last Lover character types
LAST_LOVER_TYPES = {
    "pure-heart": {
        "name": "ピュアハート",
        "traits": "純粋で素直な愛情表現。相手を信じる力が強く、裏表がない",
        "love_style": "一途で献身的。パートナーの幸せを自分の幸せと感じる",
    },
    "romantic-dreamer": {
        "name": "ロマンティックドリーマー",
        "traits": "理想的な恋愛を追い求める。創造的で感受性が豊か",
        "love_style": "ドラマチックな恋愛を好む。特別な瞬間を大切にする",
    },
    "passionate-soul": {
        "name": "パッショネイトソウル",
        "traits": "情熱的で深い感情を持つ。全力で愛する",
        "love_style": "激しく深い愛情。相手との一体感を求める",
    },
    "gentle-protector": {
        "name": "ジェントルプロテクター",
        "traits": "穏やかで包容力がある。相手を守りたいという気持ちが強い",
        "love_style": "安心感を与える存在。静かで確かな愛情表現",
    },
    "free-spirit": {
        "name": "フリースピリット",
        "traits": "自由を愛し、束縛を嫌う。独立心が強い",
        "love_style": "お互いの自由を尊重する関係を好む",
    },
    "intellectual-lover": {
        "name": "インテレクチュアルラバー",
        "traits": "知的な刺激を重視。深い対話を通じて絆を深める",
        "love_style": "精神的なつながりを最も重視する",
    },
    "adventure-seeker": {
        "name": "アドベンチャーシーカー",
        "traits": "冒険心旺盛で、新しい経験を共に楽しみたい",
        "love_style": "刺激的で変化に富んだ関係を求める",
    },
    "loyal-companion": {
        "name": "ロイヤルコンパニオン",
        "traits": "忠実で信頼性が高い。長期的な関係を大切にする",
        "love_style": "安定した、信頼に基づく深い絆を築く",
    },
    "playful-charmer": {
        "name": "プレイフルチャーマー",
        "traits": "ユーモアがあり、楽しい雰囲気を作る。社交的",
        "love_style": "笑いと楽しさに満ちた関係を好む",
    },
    "mysterious-enigma": {
        "name": "ミステリアスエニグマ",
        "traits": "ミステリアスで奥深い。簡単には心を開かない",
        "love_style": "時間をかけて深い信頼関係を築いていく",
    },
    "nurturing-heart": {
        "name": "ナーチャリングハート",
        "traits": "世話好きで思いやりが深い。相手の成長を支える",
        "love_style": "献身的な愛情で相手を育む",
    },
    "bold-leader": {
        "name": "ボールドリーダー",
        "traits": "自信がありリーダーシップがある。頼れる存在",
        "love_style": "積極的にリードしながらも、パートナーを尊重する",
    },
    "artistic-soul": {
        "name": "アーティスティックソウル",
        "traits": "芸術的感性が豊かで、美を重視する",
        "love_style": "感性を共有できる相手との深い結びつきを求める",
    },
    "steady-rock": {
        "name": "ステディロック",
        "traits": "安定感があり、どんな時も頼りになる存在",
        "love_style": "一貫性のある、揺るぎない愛情を提供する",
    },
    "empathic-healer": {
        "name": "エンパシックヒーラー",
        "traits": "高い共感力で相手の感情を理解する。癒しの存在",
        "love_style": "感情面での深い共鳴と相互理解を重視",
    },
    "dynamic-spark": {
        "name": "ダイナミックスパーク",
        "traits": "エネルギッシュで活力がある。周りを明るくする",
        "love_style": "活気に満ちた、刺激的な関係を作る",
    },
}


@function_tool
def get_last_lover_character(character_type: str) -> str:
    """Last Loverキャラクタータイプの恋愛傾向・特性を返す"""
    info = LAST_LOVER_TYPES.get(character_type)
    if not info:
        return f"不明なキャラクタータイプ: {character_type}"

    return (
        f"【{info['name']}（{character_type}）】\n"
        f"特徴: {info['traits']}\n"
        f"恋愛スタイル: {info['love_style']}"
    )


@function_tool
def compare_last_lover_types(type1: str, type2: str) -> str:
    """2つのLast Loverタイプの恋愛スタイルを比較して相性ポイントを返す"""
    info1 = LAST_LOVER_TYPES.get(type1)
    info2 = LAST_LOVER_TYPES.get(type2)

    if not info1 or not info2:
        missing = type1 if not info1 else type2
        return f"不明なタイプ: {missing}"

    return (
        f"【{info1['name']}】× 【{info2['name']}】\n"
        f"タイプ1の恋愛スタイル: {info1['love_style']}\n"
        f"タイプ2の恋愛スタイル: {info2['love_style']}\n"
        f"タイプ1の特徴: {info1['traits']}\n"
        f"タイプ2の特徴: {info2['traits']}"
    )
