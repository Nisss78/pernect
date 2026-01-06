import { mutation } from "./_generated/server";

// タイプ間の相性定義
// compatibilityLevel: "best" | "good" | "neutral" | "challenging"
const COMPATIBILITY_DATA = [
  // ESFJ の相性
  {
    typeCode: "ESFJ",
    compatibleType: "ISFP",
    compatibilityLevel: "best",
    reason: "あなたの世話好きな性格とISFPの穏やかさが絶妙にマッチ。お互いの違いを尊重し合える理想的な組み合わせ。",
    advice: "ISFPには自分の空間も必要。適度な距離感を保つと関係が長続きします。",
  },
  {
    typeCode: "ESFJ",
    compatibleType: "ESTP",
    compatibilityLevel: "best",
    reason: "行動的なESTPがあなたに刺激を与え、あなたの温かさがESTPを支える相互補完の関係。",
  },
  {
    typeCode: "ESFJ",
    compatibleType: "ESFP",
    compatibilityLevel: "good",
    reason: "同じ外向型感覚タイプとして、社交的で楽しい時間を共有できます。",
  },
  {
    typeCode: "ESFJ",
    compatibleType: "ISTJ",
    compatibilityLevel: "good",
    reason: "伝統と安定を重視する価値観が共通。信頼性の高い関係を築けます。",
  },
  {
    typeCode: "ESFJ",
    compatibleType: "INTP",
    compatibilityLevel: "challenging",
    reason: "コミュニケーションスタイルの違いから、お互いを理解するのに時間がかかることも。",
    advice: "INTPの論理的なアプローチを尊重し、感情を押し付けすぎないようにしましょう。",
  },
  {
    typeCode: "ESFJ",
    compatibleType: "INTJ",
    compatibilityLevel: "challenging",
    reason: "感情表現の違いで衝突することも。お互いの価値観を理解する努力が必要。",
    advice: "INTJは感情表現が苦手なだけで、愛情がないわけではありません。行動に注目して。",
  },

  // ESFP の相性
  {
    typeCode: "ESFP",
    compatibleType: "ISTJ",
    compatibilityLevel: "best",
    reason: "正反対のタイプが引き合う典型的なパターン。ISTJの安定感があなたの冒険心を支えます。",
    advice: "ISTJのルーティンも大切に。たまには計画的なデートも楽しんで。",
  },
  {
    typeCode: "ESFP",
    compatibleType: "ISFJ",
    compatibilityLevel: "best",
    reason: "あなたの明るさがISFJに刺激を与え、ISFJの献身性があなたを支える好相性。",
  },
  {
    typeCode: "ESFP",
    compatibleType: "ESTP",
    compatibilityLevel: "good",
    reason: "同じ外向型感覚タイプとして、アクティブで楽しい時間を共有できます。",
  },
  {
    typeCode: "ESFP",
    compatibleType: "ESFJ",
    compatibilityLevel: "good",
    reason: "社交的で温かい関係を築けます。お互いの感情を大切にできる相性。",
  },
  {
    typeCode: "ESFP",
    compatibleType: "INTJ",
    compatibilityLevel: "challenging",
    reason: "楽しみ方や優先順位が大きく異なる可能性。お互いの違いを認め合うことが大切。",
    advice: "INTJの計画性を尊重し、時には真剣な将来の話も聞いてあげて。",
  },

  // ESTJ の相性
  {
    typeCode: "ESTJ",
    compatibleType: "ISFP",
    compatibilityLevel: "best",
    reason: "あなたのリーダーシップとISFPの柔軟性が補完し合う関係。バランスの取れたカップル。",
    advice: "ISFPの感性も尊重して。効率だけでなく、心地よさも大切に。",
  },
  {
    typeCode: "ESTJ",
    compatibleType: "ISTP",
    compatibilityLevel: "best",
    reason: "実践的で論理的な価値観を共有。お互いの独立性を尊重し合える関係。",
  },
  {
    typeCode: "ESTJ",
    compatibleType: "ESFJ",
    compatibilityLevel: "good",
    reason: "伝統と家族を大切にする価値観が共通。安定した家庭を築けます。",
  },
  {
    typeCode: "ESTJ",
    compatibleType: "ISTJ",
    compatibilityLevel: "good",
    reason: "責任感と信頼性を重視する同じ価値観。堅実な関係を築けます。",
  },
  {
    typeCode: "ESTJ",
    compatibleType: "INFP",
    compatibilityLevel: "challenging",
    reason: "コミュニケーションスタイルが大きく異なります。感情への配慮が必要。",
    advice: "INFPは繊細です。正論より共感を示すことで関係が改善します。",
  },

  // ESTP の相性
  {
    typeCode: "ESTP",
    compatibleType: "ISFJ",
    compatibilityLevel: "best",
    reason: "あなたの行動力とISFJの安定感が絶妙にマッチ。刺激と安心のバランスが取れた関係。",
    advice: "ISFJの穏やかな日常も大切にして。たまにはゆっくり過ごす時間も。",
  },
  {
    typeCode: "ESTP",
    compatibleType: "ISTJ",
    compatibilityLevel: "good",
    reason: "実践的で現実的な価値観を共有。信頼できるパートナーシップ。",
  },
  {
    typeCode: "ESTP",
    compatibleType: "ESFJ",
    compatibilityLevel: "good",
    reason: "社交的で活発な関係を楽しめます。ESFJの温かさがあなたを包み込みます。",
  },
  {
    typeCode: "ESTP",
    compatibleType: "INFJ",
    compatibilityLevel: "challenging",
    reason: "深い感情的つながりを求めるINFJとは温度差を感じることも。",
    advice: "INFJには深い会話も必要。時には立ち止まって気持ちを話し合って。",
  },

  // ENFJ の相性
  {
    typeCode: "ENFJ",
    compatibleType: "INFP",
    compatibilityLevel: "best",
    reason: "あなたの情熱とINFPの感受性が深く共鳴。精神的に深いつながりを築けます。",
    advice: "INFPには自分のペースも必要。見守る愛情も大切に。",
  },
  {
    typeCode: "ENFJ",
    compatibleType: "ISFP",
    compatibilityLevel: "best",
    reason: "あなたの導きとISFPの穏やかさが調和。お互いを高め合える関係。",
  },
  {
    typeCode: "ENFJ",
    compatibleType: "INFJ",
    compatibilityLevel: "good",
    reason: "同じ理想主義者として深い価値観を共有。意味のある関係を築けます。",
  },
  {
    typeCode: "ENFJ",
    compatibleType: "ENFP",
    compatibilityLevel: "good",
    reason: "情熱的で創造的な関係。お互いの夢を応援し合えます。",
  },
  {
    typeCode: "ENFJ",
    compatibleType: "ISTP",
    compatibilityLevel: "challenging",
    reason: "感情表現の違いで摩擦が生じることも。ISTの独立性を尊重して。",
    advice: "ISTPは言葉より行動で愛を示します。その愛し方を理解してあげて。",
  },

  // ENFP の相性
  {
    typeCode: "ENFP",
    compatibleType: "INTJ",
    compatibilityLevel: "best",
    reason: "あなたの創造性とINTJの戦略性が絶妙にマッチ。知的で刺激的な関係。",
    advice: "INTJには計画や構造も必要。時には現実的な話も受け入れて。",
  },
  {
    typeCode: "ENFP",
    compatibleType: "INFJ",
    compatibilityLevel: "best",
    reason: "深い精神的つながりを共有できる理想的なパートナー。夢を語り合える関係。",
  },
  {
    typeCode: "ENFP",
    compatibleType: "ENFJ",
    compatibilityLevel: "good",
    reason: "情熱的で活発な関係。お互いの成長を応援し合えます。",
  },
  {
    typeCode: "ENFP",
    compatibleType: "ENTJ",
    compatibilityLevel: "good",
    reason: "ビジョンを共有し、一緒に目標に向かえる刺激的なパートナーシップ。",
  },
  {
    typeCode: "ENFP",
    compatibleType: "ISTJ",
    compatibilityLevel: "challenging",
    reason: "自由を求めるあなたとルーティンを重視するISTJは衝突することも。",
    advice: "ISTJの安定性は長期的には強みになります。違いを価値として見て。",
  },

  // ENTJ の相性
  {
    typeCode: "ENTJ",
    compatibleType: "INTP",
    compatibilityLevel: "best",
    reason: "知的で戦略的な関係。お互いの独立性を尊重しながら目標を共有できます。",
    advice: "INTPには考える時間が必要。急かさず待つことも大切。",
  },
  {
    typeCode: "ENTJ",
    compatibleType: "ENFP",
    compatibilityLevel: "best",
    reason: "あなたの決断力とENFPの創造性が相乗効果を生む刺激的な関係。",
  },
  {
    typeCode: "ENTJ",
    compatibleType: "INTJ",
    compatibilityLevel: "good",
    reason: "同じビジョナリーとして戦略的な関係を築けます。",
  },
  {
    typeCode: "ENTJ",
    compatibleType: "ENTP",
    compatibilityLevel: "good",
    reason: "知的な議論を楽しめる刺激的なパートナーシップ。",
  },
  {
    typeCode: "ENTJ",
    compatibleType: "ISFP",
    compatibilityLevel: "challenging",
    reason: "価値観やペースの違いから摩擦が生じることも。",
    advice: "ISFPの感性を尊重し、効率だけでなく心地よさも大切にして。",
  },

  // ENTP の相性
  {
    typeCode: "ENTP",
    compatibleType: "INFJ",
    compatibilityLevel: "best",
    reason: "あなたの知的好奇心とINFJの洞察力が深い絆を生む。完璧な会話パートナー。",
    advice: "INFJには深い感情的つながりも必要。議論だけでなく共感も示して。",
  },
  {
    typeCode: "ENTP",
    compatibleType: "INTJ",
    compatibilityLevel: "best",
    reason: "知的で刺激的な関係。お互いの知性を認め合える最高のパートナー。",
  },
  {
    typeCode: "ENTP",
    compatibleType: "ENFP",
    compatibilityLevel: "good",
    reason: "創造的で楽しい関係。新しいアイデアを一緒に探求できます。",
  },
  {
    typeCode: "ENTP",
    compatibleType: "ENTJ",
    compatibilityLevel: "good",
    reason: "野心的で知的なパートナーシップ。お互いに高め合えます。",
  },
  {
    typeCode: "ENTP",
    compatibleType: "ISFJ",
    compatibilityLevel: "challenging",
    reason: "コミュニケーションスタイルが大きく異なります。ISFJの感情に配慮を。",
    advice: "ISFJは安定を求めます。刺激より安心感を提供することも大切。",
  },

  // ISFJ の相性
  {
    typeCode: "ISFJ",
    compatibleType: "ESTP",
    compatibilityLevel: "best",
    reason: "あなたの安定感とESTPの行動力が補完し合う関係。刺激と安心のバランス。",
    advice: "ESTPの自由さも認めて。時には一緒に冒険を楽しんで。",
  },
  {
    typeCode: "ISFJ",
    compatibleType: "ESFP",
    compatibilityLevel: "best",
    reason: "あなたの献身性とESFPの明るさが調和。楽しく温かい関係を築けます。",
  },
  {
    typeCode: "ISFJ",
    compatibleType: "ESFJ",
    compatibilityLevel: "good",
    reason: "同じ価値観を持つ者同士、安定した関係を築けます。",
  },
  {
    typeCode: "ISFJ",
    compatibleType: "ISTJ",
    compatibilityLevel: "good",
    reason: "伝統と安定を重視する共通の価値観。信頼性の高い関係。",
  },
  {
    typeCode: "ISFJ",
    compatibleType: "ENTP",
    compatibilityLevel: "challenging",
    reason: "価値観やコミュニケーションスタイルの違いが大きいかも。",
    advice: "ENTPの議論好きは攻撃ではありません。知的な刺激として受け止めて。",
  },

  // ISFP の相性
  {
    typeCode: "ISFP",
    compatibleType: "ESFJ",
    compatibilityLevel: "best",
    reason: "ESFJの温かさがあなたを包み、あなたの穏やかさがESFJを癒す理想的な関係。",
    advice: "ESFJには言葉での愛情表現も大切。時には気持ちを言葉にして。",
  },
  {
    typeCode: "ISFP",
    compatibleType: "ESTJ",
    compatibilityLevel: "best",
    reason: "あなたの柔軟性とESTJの安定感が補完し合うバランスの良い関係。",
  },
  {
    typeCode: "ISFP",
    compatibleType: "ENFJ",
    compatibilityLevel: "good",
    reason: "ENFJの情熱があなたを導き、あなたの感性がENFJを癒します。",
  },
  {
    typeCode: "ISFP",
    compatibleType: "ISTP",
    compatibilityLevel: "good",
    reason: "穏やかで静かな関係。お互いの空間を尊重し合えます。",
  },
  {
    typeCode: "ISFP",
    compatibleType: "ENTJ",
    compatibilityLevel: "challenging",
    reason: "ペースや価値観の違いが大きいかも。お互いの違いを認める努力が必要。",
    advice: "ENTJの効率重視は愛情表現の一つ。行動に注目して。",
  },

  // ISTJ の相性
  {
    typeCode: "ISTJ",
    compatibleType: "ESFP",
    compatibilityLevel: "best",
    reason: "正反対のタイプが引き合う典型的なパターン。ESFPの明るさがあなたの日常に彩りを。",
    advice: "ESFPの自由さを認めて。たまには一緒に楽しむことも大切。",
  },
  {
    typeCode: "ISTJ",
    compatibleType: "ESTP",
    compatibilityLevel: "good",
    reason: "実践的で現実的な価値観を共有。行動で愛を示す者同士。",
  },
  {
    typeCode: "ISTJ",
    compatibleType: "ISFJ",
    compatibilityLevel: "good",
    reason: "伝統と安定を重視する同じ価値観。堅実で信頼性の高い関係。",
  },
  {
    typeCode: "ISTJ",
    compatibleType: "ESTJ",
    compatibilityLevel: "good",
    reason: "責任感と誠実さを共有。安定した関係を築けます。",
  },
  {
    typeCode: "ISTJ",
    compatibleType: "ENFP",
    compatibilityLevel: "challenging",
    reason: "生活スタイルや価値観が大きく異なることも。お互いの違いを尊重して。",
    advice: "ENFPの自由さは創造性の源。違いを楽しむ余裕を持って。",
  },

  // ISTP の相性
  {
    typeCode: "ISTP",
    compatibleType: "ESTJ",
    compatibilityLevel: "best",
    reason: "実践的で論理的な価値観を共有。お互いの独立性を尊重し合える関係。",
    advice: "ESTJには定期的なコミュニケーションも大切。気持ちを時々伝えて。",
  },
  {
    typeCode: "ISTP",
    compatibleType: "ESFJ",
    compatibilityLevel: "good",
    reason: "ESFJの温かさがあなたを包み込みます。バランスの取れた関係。",
  },
  {
    typeCode: "ISTP",
    compatibleType: "ISFP",
    compatibilityLevel: "good",
    reason: "静かで穏やかな関係。お互いの空間を大切にできます。",
  },
  {
    typeCode: "ISTP",
    compatibleType: "ESTP",
    compatibilityLevel: "good",
    reason: "同じ実践的なタイプとして、活動を共有できます。",
  },
  {
    typeCode: "ISTP",
    compatibleType: "ENFJ",
    compatibilityLevel: "challenging",
    reason: "感情表現の違いで摩擦が生じることも。",
    advice: "ENFJには言葉での確認も必要。時には気持ちを言葉にして。",
  },

  // INFJ の相性
  {
    typeCode: "INFJ",
    compatibleType: "ENTP",
    compatibilityLevel: "best",
    reason: "あなたの洞察力とENTPの知的好奇心が深い絆を生む理想的なパートナー。",
    advice: "ENTPは議論を楽しむタイプ。感情的にならず知的な会話として楽しんで。",
  },
  {
    typeCode: "INFJ",
    compatibleType: "ENFP",
    compatibilityLevel: "best",
    reason: "深い精神的つながりを共有できる魂の伴侶。夢と理想を語り合えます。",
  },
  {
    typeCode: "INFJ",
    compatibleType: "INTJ",
    compatibilityLevel: "good",
    reason: "同じ内向型直感タイプとして深い理解を共有できます。",
  },
  {
    typeCode: "INFJ",
    compatibleType: "ENFJ",
    compatibilityLevel: "good",
    reason: "理想主義的な価値観を共有。意味のある関係を築けます。",
  },
  {
    typeCode: "INFJ",
    compatibleType: "ESTP",
    compatibilityLevel: "challenging",
    reason: "価値観やコミュニケーションスタイルが大きく異なります。",
    advice: "ESTPは行動で愛を示します。言葉より行動に注目して。",
  },

  // INFP の相性
  {
    typeCode: "INFP",
    compatibleType: "ENFJ",
    compatibilityLevel: "best",
    reason: "ENFJの情熱とあなたの感受性が深く共鳴。精神的に深い絆を築けます。",
    advice: "ENFJには感謝の言葉も大切。思っていることを時々伝えて。",
  },
  {
    typeCode: "INFP",
    compatibleType: "ENTJ",
    compatibilityLevel: "best",
    reason: "正反対のタイプが引き合う典型的なパターン。お互いの弱点を補い合える関係。",
  },
  {
    typeCode: "INFP",
    compatibleType: "INFJ",
    compatibilityLevel: "good",
    reason: "深い精神的つながりを共有できる者同士。静かで意味のある関係。",
  },
  {
    typeCode: "INFP",
    compatibleType: "ENFP",
    compatibilityLevel: "good",
    reason: "創造性と理想主義を共有。夢を語り合える関係。",
  },
  {
    typeCode: "INFP",
    compatibleType: "ESTJ",
    compatibilityLevel: "challenging",
    reason: "価値観やコミュニケーションスタイルが大きく異なることも。",
    advice: "ESTJの直接的な表現は攻撃ではありません。効率重視の愛し方として理解して。",
  },

  // INTJ の相性
  {
    typeCode: "INTJ",
    compatibleType: "ENFP",
    compatibilityLevel: "best",
    reason: "あなたの戦略性とENFPの創造性が絶妙にマッチ。知的で刺激的な関係。",
    advice: "ENFPには感情的なつながりも大切。時には感情を共有して。",
  },
  {
    typeCode: "INTJ",
    compatibleType: "ENTP",
    compatibilityLevel: "best",
    reason: "知的で刺激的な関係。深い議論を楽しめる最高のパートナー。",
  },
  {
    typeCode: "INTJ",
    compatibleType: "ENTJ",
    compatibilityLevel: "good",
    reason: "同じビジョナリーとして戦略的な関係を築けます。",
  },
  {
    typeCode: "INTJ",
    compatibleType: "INFJ",
    compatibilityLevel: "good",
    reason: "内向型直感タイプとして深い理解を共有できます。",
  },
  {
    typeCode: "INTJ",
    compatibleType: "ESFP",
    compatibilityLevel: "challenging",
    reason: "価値観や優先順位が大きく異なることも。",
    advice: "ESFPの楽観性は強みです。時には一緒に楽しむことも大切。",
  },
  {
    typeCode: "INTJ",
    compatibleType: "ESFJ",
    compatibilityLevel: "challenging",
    reason: "感情表現の違いで摩擦が生じることも。",
    advice: "ESFJには言葉での愛情確認が大切。時には気持ちを伝えて。",
  },

  // INTP の相性
  {
    typeCode: "INTP",
    compatibleType: "ENTJ",
    compatibilityLevel: "best",
    reason: "知的で戦略的な関係。お互いの独立性を尊重しながら目標を共有できます。",
    advice: "ENTJには決断も必要。考えすぎず時には一緒に行動して。",
  },
  {
    typeCode: "INTP",
    compatibleType: "ENFJ",
    compatibilityLevel: "best",
    reason: "ENFJの情熱があなたを外の世界に導き、新しい経験を与えてくれます。",
  },
  {
    typeCode: "INTP",
    compatibleType: "INTJ",
    compatibilityLevel: "good",
    reason: "知的な会話を楽しめる者同士。お互いの空間を尊重できます。",
  },
  {
    typeCode: "INTP",
    compatibleType: "ENTP",
    compatibilityLevel: "good",
    reason: "知的好奇心を共有。新しいアイデアについて議論を楽しめます。",
  },
  {
    typeCode: "INTP",
    compatibleType: "ESFJ",
    compatibilityLevel: "challenging",
    reason: "コミュニケーションスタイルが大きく異なります。",
    advice: "ESFJの感情的なサポートは愛情表現。論理だけでなく感謝も伝えて。",
  },
];

// 相性データを投入
export const seedLastLoverCompatibility = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存のデータがあるか確認
    const existingData = await ctx.db
      .query("lastLoverCompatibility")
      .withIndex("by_type", (q) => q.eq("typeCode", "ESFJ"))
      .first();

    if (existingData) {
      return {
        message: "最後の恋人相性データは既に存在します",
        count: COMPATIBILITY_DATA.length,
      };
    }

    // 全相性データを挿入
    const insertedIds = [];
    for (const compat of COMPATIBILITY_DATA) {
      const id = await ctx.db.insert("lastLoverCompatibility", compat);
      insertedIds.push(id);
    }

    return {
      message: "相性データを作成しました",
      count: insertedIds.length,
    };
  },
});

// 特定タイプの相性を取得（デバッグ用）
export const getCompatibilityForType = mutation({
  args: {},
  handler: async (ctx) => {
    const data = await ctx.db.query("lastLoverCompatibility").collect();
    return data;
  },
});
