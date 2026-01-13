import { mutation } from "./_generated/server";

// エニアグラム診断テスト定義
const ENNEAGRAM_TEST = {
  slug: "enneagram",
  title: "エニアグラム診断",
  description:
    "9つの性格タイプから深層の動機パターンを分析。自己理解と成長のための古代からの知恵を現代に活かします。",
  category: "personality",
  questionCount: 45,
  estimatedMinutes: 12,
  scoringType: "single" as const,
  icon: "compass",
  gradientStart: "#14b8a6",
  gradientEnd: "#0ea5e9",
  isActive: true,
  citation: {
    authors: ["Don Richard Riso", "Russ Hudson"],
    title: "The Wisdom of the Enneagram",
    year: 1999,
    url: "https://www.enneagraminstitute.com/",
  },
};

// 9つのエニアグラムタイプ定義
const ENNEAGRAM_TYPES: Record<
  string,
  {
    number: number;
    nameJa: string;
    nameEn: string;
    nickname: string;
    center: "head" | "heart" | "body";
    centerJa: string;
    coreMotivation: string;
    coreFear: string;
    summary: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    growthPath: string;
    stressPath: string;
    recommendations: string[];
  }
> = {
  Type1: {
    number: 1,
    nameJa: "タイプ1",
    nameEn: "Type One",
    nickname: "改革する人",
    center: "body",
    centerJa: "本能センター",
    coreMotivation: "善良で正しくあること、高い基準を持つこと",
    coreFear: "欠陥があること、堕落すること、間違っていること",
    summary: "理想主義的で原則に基づき、目的意識が高い",
    description:
      "あなたは理想と現実のギャップに敏感で、物事をより良くしたいという強い願望を持っています。倫理的で責任感が強く、自分自身と他者に高い基準を求めます。",
    strengths: ["誠実さ", "責任感", "自己規律", "改善への情熱"],
    weaknesses: ["批判的になりすぎる", "完璧主義", "怒りの抑圧"],
    growthPath: "タイプ7（楽しみを受け入れる）",
    stressPath: "タイプ4（自己憐憫に陥る）",
    recommendations: [
      "不完全さを受け入れる練習をする",
      "自分への批判を和らげる",
      "楽しみや遊びの時間を作る",
    ],
  },
  Type2: {
    number: 2,
    nameJa: "タイプ2",
    nameEn: "Type Two",
    nickname: "助ける人",
    center: "heart",
    centerJa: "感情センター",
    coreMotivation: "愛されること、必要とされること",
    coreFear: "愛されないこと、不必要であること",
    summary: "思いやりがあり、対人関係を重視し、寛大",
    description:
      "あなたは他者の感情やニーズに非常に敏感で、助けることで自分の価値を感じます。温かく、寛大で、人間関係を大切にしますが、自分のニーズを無視しがちです。",
    strengths: ["共感力", "寛大さ", "人間関係構築", "思いやり"],
    weaknesses: ["自分のニーズを無視", "過干渉", "見返りを期待"],
    growthPath: "タイプ4（自分の感情に向き合う）",
    stressPath: "タイプ8（攻撃的になる）",
    recommendations: [
      "自分のニーズを認識し、表現する",
      "見返りを期待せず与える",
      "自分自身にも優しくする",
    ],
  },
  Type3: {
    number: 3,
    nameJa: "タイプ3",
    nameEn: "Type Three",
    nickname: "達成する人",
    center: "heart",
    centerJa: "感情センター",
    coreMotivation: "価値があると感じること、成功すること",
    coreFear: "無価値であること、失敗すること",
    summary: "成功志向で、適応力があり、野心的",
    description:
      "あなたは目標達成と成功に強くモチベートされ、効率的で適応力があります。イメージを大切にし、他者からの評価を重視しますが、本当の自分を見失いがちです。",
    strengths: ["目標達成力", "適応力", "効率性", "自信"],
    weaknesses: ["仕事中毒", "イメージへの執着", "感情の抑圧"],
    growthPath: "タイプ6（誠実さと協力）",
    stressPath: "タイプ9（無気力になる）",
    recommendations: [
      "成果以外の自分の価値を認める",
      "本当の感情に向き合う",
      "休息とリフレッシュを大切にする",
    ],
  },
  Type4: {
    number: 4,
    nameJa: "タイプ4",
    nameEn: "Type Four",
    nickname: "個性的な人",
    center: "heart",
    centerJa: "感情センター",
    coreMotivation: "自分のアイデンティティを見つけること、特別であること",
    coreFear: "アイデンティティがないこと、平凡であること",
    summary: "自己認識が高く、感受性豊かで、創造的",
    description:
      "あなたは深い感情と独自のアイデンティティを大切にします。芸術的で創造性に富み、人生の意味を探求しますが、憂鬱や羨望に囚われやすい面もあります。",
    strengths: ["創造性", "深い感受性", "真正性", "美的感覚"],
    weaknesses: ["自己憐憫", "羨望", "気分の変動"],
    growthPath: "タイプ1（規律と行動）",
    stressPath: "タイプ2（過度に依存的になる）",
    recommendations: [
      "今この瞬間に感謝する",
      "行動を通じて感情を表現する",
      "他者との共通点を見つける",
    ],
  },
  Type5: {
    number: 5,
    nameJa: "タイプ5",
    nameEn: "Type Five",
    nickname: "調べる人",
    center: "head",
    centerJa: "思考センター",
    coreMotivation: "有能で知識があること、世界を理解すること",
    coreFear: "無能であること、圧倒されること",
    summary: "知的で洞察力があり、独立的",
    description:
      "あなたは知識と理解を深く追求し、独立性を重視します。観察力と分析力に優れていますが、感情や社会的な関わりから距離を置きがちです。",
    strengths: ["知識の深さ", "独立心", "客観性", "集中力"],
    weaknesses: ["孤立しやすい", "感情の切り離し", "吝嗇"],
    growthPath: "タイプ8（行動力と自信）",
    stressPath: "タイプ7（散漫になる）",
    recommendations: [
      "人との関わりを意識的に増やす",
      "感情を認識し表現する",
      "知識を行動に移す",
    ],
  },
  Type6: {
    number: 6,
    nameJa: "タイプ6",
    nameEn: "Type Six",
    nickname: "忠実な人",
    center: "head",
    centerJa: "思考センター",
    coreMotivation: "安全とサポートを得ること",
    coreFear: "サポートや導きがないこと",
    summary: "献身的で、責任感があり、安全志向",
    description:
      "あなたは安全と安定を求め、信頼できる人やシステムに忠実です。責任感が強く、最悪の事態に備える傾向がありますが、不安や疑念に囚われやすい面もあります。",
    strengths: ["忠誠心", "責任感", "危機管理能力", "協調性"],
    weaknesses: ["不安", "疑念", "権威との葛藤"],
    growthPath: "タイプ9（内なる平和）",
    stressPath: "タイプ3（虚勢を張る）",
    recommendations: [
      "自分自身を信頼する",
      "不安を認識しつつ行動する",
      "内なる力を信じる",
    ],
  },
  Type7: {
    number: 7,
    nameJa: "タイプ7",
    nameEn: "Type Seven",
    nickname: "熱中する人",
    center: "head",
    centerJa: "思考センター",
    coreMotivation: "幸せで満足していること、苦痛を避けること",
    coreFear: "苦痛に囚われること、満たされないこと",
    summary: "楽観的で、多才で、自発的",
    description:
      "あなたは新しい経験と可能性に興奮し、人生を楽しむことを大切にします。楽観的でエネルギッシュですが、深い感情や苦痛を避ける傾向があります。",
    strengths: ["楽観性", "多才さ", "エネルギー", "創造性"],
    weaknesses: ["逃避傾向", "散漫", "コミットメントの欠如"],
    growthPath: "タイプ5（深さと集中）",
    stressPath: "タイプ1（批判的になる）",
    recommendations: [
      "一つのことに深くコミットする",
      "困難な感情にも向き合う",
      "今この瞬間に留まる",
    ],
  },
  Type8: {
    number: 8,
    nameJa: "タイプ8",
    nameEn: "Type Eight",
    nickname: "挑戦する人",
    center: "body",
    centerJa: "本能センター",
    coreMotivation: "自分自身を守ること、コントロールを維持すること",
    coreFear: "コントロールされること、傷つくこと",
    summary: "自信があり、決断力があり、支配的",
    description:
      "あなたは力強く、直接的で、自分と大切な人を守ることを重視します。リーダーシップがあり、正義感が強いですが、支配的になりすぎる傾向があります。",
    strengths: ["リーダーシップ", "決断力", "保護者的", "正義感"],
    weaknesses: ["支配的", "対立的", "脆弱さを見せない"],
    growthPath: "タイプ2（思いやりと柔らかさ）",
    stressPath: "タイプ5（引きこもる）",
    recommendations: [
      "脆弱さを見せることを恐れない",
      "他者の視点を受け入れる",
      "力を建設的に使う",
    ],
  },
  Type9: {
    number: 9,
    nameJa: "タイプ9",
    nameEn: "Type Nine",
    nickname: "平和をもたらす人",
    center: "body",
    centerJa: "本能センター",
    coreMotivation: "内なる平和と調和を保つこと",
    coreFear: "喪失と分離、対立",
    summary: "穏やかで、協調的で、受容的",
    description:
      "あなたは平和と調和を大切にし、対立を避ける傾向があります。寛容で受容的ですが、自分の意見や欲求を抑圧し、現状に甘んじやすい面もあります。",
    strengths: ["調和を作る力", "寛容さ", "傾聴力", "安定感"],
    weaknesses: ["自己無視", "惰性", "対立回避"],
    growthPath: "タイプ3（行動力と自己主張）",
    stressPath: "タイプ6（不安になる）",
    recommendations: [
      "自分の意見を表現する",
      "怒りを認識し、健全に表現する",
      "目標を設定し、行動する",
    ],
  },
};

// 5段階評価の選択肢
const SCALE_OPTIONS = [
  { value: "1", label: "全く当てはまらない", scoreValue: 1 },
  { value: "2", label: "あまり当てはまらない", scoreValue: 2 },
  { value: "3", label: "どちらとも言えない", scoreValue: 3 },
  { value: "4", label: "やや当てはまる", scoreValue: 4 },
  { value: "5", label: "とても当てはまる", scoreValue: 5 },
];

// 45問の質問データ（9タイプ × 5問）
const ENNEAGRAM_QUESTIONS = [
  // ===== タイプ1: 改革する人 =====
  {
    order: 1,
    questionText: "物事には正しいやり方と間違ったやり方があると考える",
    scoreKey: "Type1",
  },
  {
    order: 2,
    questionText: "自分自身と他者に高い基準を求める",
    scoreKey: "Type1",
  },
  {
    order: 3,
    questionText: "間違いや不正を見つけると、指摘せずにはいられない",
    scoreKey: "Type1",
  },
  {
    order: 4,
    questionText: "自分の行動が正しいかどうか、常に考えている",
    scoreKey: "Type1",
  },
  {
    order: 5,
    questionText: "世の中をより良くするために努力することが大切だ",
    scoreKey: "Type1",
  },

  // ===== タイプ2: 助ける人 =====
  {
    order: 6,
    questionText: "人を助けることで、自分の存在価値を感じる",
    scoreKey: "Type2",
  },
  {
    order: 7,
    questionText: "他者のニーズに敏感で、求められる前に手を差し伸べる",
    scoreKey: "Type2",
  },
  {
    order: 8,
    questionText: "人から必要とされることが嬉しい",
    scoreKey: "Type2",
  },
  {
    order: 9,
    questionText: "自分のことより、他者の幸せを優先することが多い",
    scoreKey: "Type2",
  },
  {
    order: 10,
    questionText: "人間関係が良好であることが、人生で最も重要だ",
    scoreKey: "Type2",
  },

  // ===== タイプ3: 達成する人 =====
  {
    order: 11,
    questionText: "成功と達成がモチベーションの源だ",
    scoreKey: "Type3",
  },
  {
    order: 12,
    questionText: "他者からどう見られるかを意識している",
    scoreKey: "Type3",
  },
  {
    order: 13,
    questionText: "目標を設定し、効率的に達成することが得意だ",
    scoreKey: "Type3",
  },
  {
    order: 14,
    questionText: "状況に応じて自分を適応させることができる",
    scoreKey: "Type3",
  },
  {
    order: 15,
    questionText: "認められ、賞賛されることが重要だ",
    scoreKey: "Type3",
  },

  // ===== タイプ4: 個性的な人 =====
  {
    order: 16,
    questionText: "自分は他の人とは違う、特別な存在だと感じる",
    scoreKey: "Type4",
  },
  {
    order: 17,
    questionText: "深い感情を経験し、それを表現することが大切だ",
    scoreKey: "Type4",
  },
  {
    order: 18,
    questionText: "他者が持っているものを羨ましく感じることがある",
    scoreKey: "Type4",
  },
  {
    order: 19,
    questionText: "美しいものや芸術に強く惹かれる",
    scoreKey: "Type4",
  },
  {
    order: 20,
    questionText: "自分のアイデンティティや意味を探求することが多い",
    scoreKey: "Type4",
  },

  // ===== タイプ5: 調べる人 =====
  {
    order: 21,
    questionText: "知識を深め、物事を理解することに喜びを感じる",
    scoreKey: "Type5",
  },
  {
    order: 22,
    questionText: "一人で考える時間が必要だ",
    scoreKey: "Type5",
  },
  {
    order: 23,
    questionText: "感情よりも論理と分析を重視する",
    scoreKey: "Type5",
  },
  {
    order: 24,
    questionText: "自分のエネルギーと資源を大切に使いたい",
    scoreKey: "Type5",
  },
  {
    order: 25,
    questionText: "人との関わりは必要最低限で十分だと思うことがある",
    scoreKey: "Type5",
  },

  // ===== タイプ6: 忠実な人 =====
  {
    order: 26,
    questionText: "最悪の事態に備えて計画することが多い",
    scoreKey: "Type6",
  },
  {
    order: 27,
    questionText: "信頼できる人やグループへの忠誠心が強い",
    scoreKey: "Type6",
  },
  {
    order: 28,
    questionText: "決断を下す前に、様々な可能性を検討する",
    scoreKey: "Type6",
  },
  {
    order: 29,
    questionText: "安全と安定が重要だと感じる",
    scoreKey: "Type6",
  },
  {
    order: 30,
    questionText: "権威に対して疑念を持つことがある",
    scoreKey: "Type6",
  },

  // ===== タイプ7: 熱中する人 =====
  {
    order: 31,
    questionText: "新しい経験と可能性にワクワクする",
    scoreKey: "Type7",
  },
  {
    order: 32,
    questionText: "ネガティブな感情や苦痛を避けたい",
    scoreKey: "Type7",
  },
  {
    order: 33,
    questionText: "多くのプロジェクトや興味を同時に持っている",
    scoreKey: "Type7",
  },
  {
    order: 34,
    questionText: "楽観的で、未来に対してポジティブだ",
    scoreKey: "Type7",
  },
  {
    order: 35,
    questionText: "退屈が苦手で、常に刺激を求める",
    scoreKey: "Type7",
  },

  // ===== タイプ8: 挑戦する人 =====
  {
    order: 36,
    questionText: "自分と大切な人を守ることが重要だ",
    scoreKey: "Type8",
  },
  {
    order: 37,
    questionText: "直接的で率直なコミュニケーションを好む",
    scoreKey: "Type8",
  },
  {
    order: 38,
    questionText: "弱みを見せることに抵抗がある",
    scoreKey: "Type8",
  },
  {
    order: 39,
    questionText: "状況をコントロールしたい",
    scoreKey: "Type8",
  },
  {
    order: 40,
    questionText: "不正や弱者への虐待に対して強く反応する",
    scoreKey: "Type8",
  },

  // ===== タイプ9: 平和をもたらす人 =====
  {
    order: 41,
    questionText: "対立や争いを避けたい",
    scoreKey: "Type9",
  },
  {
    order: 42,
    questionText: "周囲の人と調和することが大切だ",
    scoreKey: "Type9",
  },
  {
    order: 43,
    questionText: "自分の意見より、他者の意見を尊重することが多い",
    scoreKey: "Type9",
  },
  {
    order: 44,
    questionText: "決断を先延ばしにすることがある",
    scoreKey: "Type9",
  },
  {
    order: 45,
    questionText: "平穏で穏やかな環境を好む",
    scoreKey: "Type9",
  },
];

// シード実行用のmutation
export const seedEnneagramTest = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), ENNEAGRAM_TEST.slug))
      .first();

    if (existingTest) {
      console.log("エニアグラム診断は既に存在します。スキップします。");
      return { success: false, message: "Test already exists" };
    }

    const testId = await ctx.db.insert("tests", {
      ...ENNEAGRAM_TEST,
      resultTypes: ENNEAGRAM_TYPES,
      createdAt: Date.now(),
    });

    for (const question of ENNEAGRAM_QUESTIONS) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: question.order,
        questionText: question.questionText,
        questionType: "scale",
        options: SCALE_OPTIONS,
        scoreKey: question.scoreKey,
      });
    }

    console.log(`エニアグラム診断を作成しました: ${testId}`);
    return { success: true, testId, questionCount: ENNEAGRAM_QUESTIONS.length };
  },
});

export const resetEnneagramTest = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), ENNEAGRAM_TEST.slug))
      .first();

    if (!existingTest) {
      return { success: false, message: "Test not found" };
    }

    const questions = await ctx.db
      .query("testQuestions")
      .filter((q) => q.eq(q.field("testId"), existingTest._id))
      .collect();

    for (const question of questions) {
      await ctx.db.delete(question._id);
    }

    await ctx.db.delete(existingTest._id);
    console.log("エニアグラム診断をリセットしました");
    return { success: true, deletedQuestions: questions.length };
  },
});
