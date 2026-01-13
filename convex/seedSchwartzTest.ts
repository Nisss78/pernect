import { mutation } from "./_generated/server";

// Schwartz価値観診断テスト定義
const SCHWARTZ_TEST = {
  slug: "schwartz-values",
  title: "価値観診断",
  description:
    "10の普遍的価値からあなたの価値観プロファイルを分析。人生で何を大切にしているかを可視化します。",
  category: "values",
  questionCount: 40,
  estimatedMinutes: 10,
  scoringType: "percentile" as const,
  icon: "heart",
  gradientStart: "#ec4899",
  gradientEnd: "#8b5cf6",
  isActive: true,
  citation: {
    authors: ["Shalom H. Schwartz"],
    title: "Universals in the content and structure of values",
    year: 1992,
    url: "https://doi.org/10.1016/S0065-2601(08)60281-6",
  },
};

// 10の価値観定義
const SCHWARTZ_VALUES: Record<
  string,
  {
    nameJa: string;
    higherOrder: string;
    higherOrderJa: string;
    summary: string;
    description: string;
    keywords: string[];
    strengths: string[];
    recommendations: string[];
  }
> = {
  SelfDirection: {
    nameJa: "自己決定",
    higherOrder: "opennessToChange",
    higherOrderJa: "変化への開放性",
    summary: "独立した思考と行動の自由を大切にする",
    description:
      "あなたは自分自身で考え、決断し、行動することを重視しています。創造性、自由、独立心が強く、他者に依存せず自分の道を切り開くことに価値を見出します。",
    keywords: ["自由", "創造性", "独立", "好奇心", "自律"],
    strengths: ["独創的な発想", "自立した行動力", "柔軟な思考"],
    recommendations: [
      "自分で決める機会を積極的に作る",
      "新しいアイデアを試す時間を確保する",
      "創造性を発揮できる環境を選ぶ",
    ],
  },
  Stimulation: {
    nameJa: "刺激",
    higherOrder: "opennessToChange",
    higherOrderJa: "変化への開放性",
    summary: "興奮と新奇性、人生の挑戦を求める",
    description:
      "あなたは変化と刺激を求め、退屈を嫌います。新しい経験、冒険、挑戦が人生を豊かにすると考え、安定よりも多様性を好みます。",
    keywords: ["挑戦", "冒険", "多様性", "興奮", "新奇性"],
    strengths: ["変化への適応力", "チャレンジ精神", "行動力"],
    recommendations: [
      "定期的に新しいことに挑戦する",
      "ルーティンを意図的に変えてみる",
      "冒険的な趣味や活動を取り入れる",
    ],
  },
  Hedonism: {
    nameJa: "快楽",
    higherOrder: "selfEnhancement",
    higherOrderJa: "自己高揚",
    summary: "自分自身のための喜びと感覚的満足を追求する",
    description:
      "あなたは人生を楽しむこと、感覚的な喜びを大切にしています。自分自身の幸福と満足感を重視し、人生の快適さと楽しさを追求します。",
    keywords: ["喜び", "楽しみ", "快適さ", "満足", "自己満足"],
    strengths: ["人生を楽しむ力", "ポジティブさ", "自己ケア能力"],
    recommendations: [
      "自分を喜ばせる時間を意識的に作る",
      "五感を満たす体験を大切にする",
      "罪悪感なく楽しみを受け入れる",
    ],
  },
  Achievement: {
    nameJa: "達成",
    higherOrder: "selfEnhancement",
    higherOrderJa: "自己高揚",
    summary: "社会的基準に基づく個人的成功を追求する",
    description:
      "あなたは能力を発揮し、社会的に認められる成功を収めることを重視しています。目標達成、野心、影響力が重要な価値観です。",
    keywords: ["成功", "野心", "能力", "影響力", "認められること"],
    strengths: ["目標達成力", "向上心", "結果へのコミットメント"],
    recommendations: [
      "明確な目標を設定し、進捗を追跡する",
      "自分の成果を適切に評価し認める",
      "成長できる環境に身を置く",
    ],
  },
  Power: {
    nameJa: "権力",
    higherOrder: "selfEnhancement",
    higherOrderJa: "自己高揚",
    summary: "社会的地位、威信、他者への影響力を重視する",
    description:
      "あなたは社会的な地位や影響力、リソースのコントロールを重視しています。リーダーシップを発揮し、他者や状況に影響を与えることに価値を見出します。",
    keywords: ["地位", "威信", "支配", "リソース", "影響力"],
    strengths: ["リーダーシップ", "決断力", "影響力の行使"],
    recommendations: [
      "リーダーシップを発揮できる場を求める",
      "影響力を建設的に使う方法を学ぶ",
      "権力と責任のバランスを意識する",
    ],
  },
  Security: {
    nameJa: "安全",
    higherOrder: "conservation",
    higherOrderJa: "保守",
    summary: "社会と関係性の安全、安定、調和を求める",
    description:
      "あなたは安全、安定、秩序を重視しています。予測可能な環境、家族や社会の安全、健康への関心が強く、リスクを最小化することを好みます。",
    keywords: ["安全", "安定", "秩序", "健康", "所属"],
    strengths: ["リスク管理能力", "安定した関係構築", "計画性"],
    recommendations: [
      "安心感を得られる環境を整える",
      "長期的な計画を立てる",
      "信頼できる人間関係を育む",
    ],
  },
  Conformity: {
    nameJa: "同調",
    higherOrder: "conservation",
    higherOrderJa: "保守",
    summary: "社会規範を尊重し、他者を傷つけない行動を心がける",
    description:
      "あなたは社会のルールや期待に沿うこと、他者との調和を大切にしています。礼儀正しさ、自己抑制、責任感が重要な価値観です。",
    keywords: ["礼儀", "従順", "自己抑制", "責任", "調和"],
    strengths: ["協調性", "信頼性", "社会的適応力"],
    recommendations: [
      "自分の意見と調和のバランスを取る",
      "健全な境界線を設定する",
      "本当の自分を失わない範囲で協調する",
    ],
  },
  Tradition: {
    nameJa: "伝統",
    higherOrder: "conservation",
    higherOrderJa: "保守",
    summary: "文化や宗教の慣習と考え方を尊重する",
    description:
      "あなたは伝統、文化、慣習を尊重し、過去から受け継がれてきた価値観を大切にしています。謙虚さ、敬意、継承への責任感があります。",
    keywords: ["伝統", "謙虚さ", "敬意", "信仰", "継承"],
    strengths: ["文化的知識", "継続性の維持", "コミュニティへの貢献"],
    recommendations: [
      "自分のルーツや文化を学ぶ",
      "伝統と革新のバランスを見つける",
      "次世代に価値を伝える方法を考える",
    ],
  },
  Benevolence: {
    nameJa: "博愛",
    higherOrder: "selfTranscendence",
    higherOrderJa: "自己超越",
    summary: "身近な人々の福祉の保全と向上を大切にする",
    description:
      "あなたは家族、友人、身近な人々の幸福を深く気にかけています。忠誠心、誠実さ、助け合いの精神が強く、信頼関係を築くことを重視します。",
    keywords: ["助け合い", "忠誠", "誠実", "責任", "友情"],
    strengths: ["共感力", "人間関係構築", "信頼される存在"],
    recommendations: [
      "大切な人との時間を優先する",
      "助けを求められたら応える",
      "感謝を言葉で伝える習慣を持つ",
    ],
  },
  Universalism: {
    nameJa: "普遍主義",
    higherOrder: "selfTranscendence",
    higherOrderJa: "自己超越",
    summary: "すべての人と自然の福祉の理解と保護を目指す",
    description:
      "あなたはすべての人々の平等、社会正義、自然環境の保護を重視しています。広い視野を持ち、世界全体の福祉に関心を寄せています。",
    keywords: ["平等", "正義", "環境保護", "平和", "寛容"],
    strengths: ["広い視野", "社会貢献意識", "多様性の尊重"],
    recommendations: [
      "社会問題に関心を持ち、学ぶ",
      "環境に配慮した選択をする",
      "異なる文化や価値観を理解する努力をする",
    ],
  },
};

// 6段階評価の選択肢
const SCALE_OPTIONS = [
  { value: "1", label: "全く重要でない", scoreValue: 1 },
  { value: "2", label: "重要でない", scoreValue: 2 },
  { value: "3", label: "あまり重要でない", scoreValue: 3 },
  { value: "4", label: "やや重要", scoreValue: 4 },
  { value: "5", label: "重要", scoreValue: 5 },
  { value: "6", label: "非常に重要", scoreValue: 6 },
];

// 40問の質問データ（10価値 × 4問）
const SCHWARTZ_QUESTIONS = [
  // ===== 自己決定（SelfDirection）=====
  {
    order: 1,
    questionText: "自分自身のアイデアを考え出し、独自の方法で物事を行うこと",
    scoreKey: "SelfDirection",
  },
  {
    order: 2,
    questionText: "自分で計画を立て、自分の行動を自由に選ぶこと",
    scoreKey: "SelfDirection",
  },
  {
    order: 3,
    questionText: "好奇心を持ち、様々なことを理解しようとすること",
    scoreKey: "SelfDirection",
  },
  {
    order: 4,
    questionText: "創造的で独創的であること",
    scoreKey: "SelfDirection",
  },

  // ===== 刺激（Stimulation）=====
  {
    order: 5,
    questionText: "人生に刺激と興奮があること",
    scoreKey: "Stimulation",
  },
  {
    order: 6,
    questionText: "新しいことに挑戦し、リスクを取ること",
    scoreKey: "Stimulation",
  },
  {
    order: 7,
    questionText: "多様な経験をし、変化に富んだ人生を送ること",
    scoreKey: "Stimulation",
  },
  {
    order: 8,
    questionText: "冒険的で、予測不可能な状況を楽しむこと",
    scoreKey: "Stimulation",
  },

  // ===== 快楽（Hedonism）=====
  {
    order: 9,
    questionText: "人生を楽しみ、自分を甘やかすこと",
    scoreKey: "Hedonism",
  },
  {
    order: 10,
    questionText: "喜びと感覚的な満足を追求すること",
    scoreKey: "Hedonism",
  },
  {
    order: 11,
    questionText: "楽しい時間を過ごし、人生の良いことを味わうこと",
    scoreKey: "Hedonism",
  },
  {
    order: 12,
    questionText: "快適さと身体的な幸福を大切にすること",
    scoreKey: "Hedonism",
  },

  // ===== 達成（Achievement）=====
  {
    order: 13,
    questionText: "野心を持ち、懸命に働いて成功を収めること",
    scoreKey: "Achievement",
  },
  {
    order: 14,
    questionText: "自分の能力を示し、他者から認められること",
    scoreKey: "Achievement",
  },
  {
    order: 15,
    questionText: "目標を達成し、有能であることを証明すること",
    scoreKey: "Achievement",
  },
  {
    order: 16,
    questionText: "社会的な成功を収め、影響力を持つこと",
    scoreKey: "Achievement",
  },

  // ===== 権力（Power）=====
  {
    order: 17,
    questionText: "富を持ち、高価なものを所有すること",
    scoreKey: "Power",
  },
  {
    order: 18,
    questionText: "社会的な地位と威信を持つこと",
    scoreKey: "Power",
  },
  {
    order: 19,
    questionText: "人や資源を支配し、コントロールすること",
    scoreKey: "Power",
  },
  {
    order: 20,
    questionText: "リーダーとして他者を導き、決定を下すこと",
    scoreKey: "Power",
  },

  // ===== 安全（Security）=====
  {
    order: 21,
    questionText: "安全な環境に住み、危険を避けること",
    scoreKey: "Security",
  },
  {
    order: 22,
    questionText: "国や地域社会の安定と秩序",
    scoreKey: "Security",
  },
  {
    order: 23,
    questionText: "家族の安全と健康を守ること",
    scoreKey: "Security",
  },
  {
    order: 24,
    questionText: "安定した生活と予測可能な未来",
    scoreKey: "Security",
  },

  // ===== 同調（Conformity）=====
  {
    order: 25,
    questionText: "礼儀正しく、社会のルールに従うこと",
    scoreKey: "Conformity",
  },
  {
    order: 26,
    questionText: "他者を傷つけたり、怒らせたりしないこと",
    scoreKey: "Conformity",
  },
  {
    order: 27,
    questionText: "自分の衝動や欲求を抑制すること",
    scoreKey: "Conformity",
  },
  {
    order: 28,
    questionText: "年上の人や権威ある人を尊重すること",
    scoreKey: "Conformity",
  },

  // ===== 伝統（Tradition）=====
  {
    order: 29,
    questionText: "文化や家族の伝統を守り、継承すること",
    scoreKey: "Tradition",
  },
  {
    order: 30,
    questionText: "謙虚であり、自分を誇示しないこと",
    scoreKey: "Tradition",
  },
  {
    order: 31,
    questionText: "宗教的な信仰や精神的な価値観を大切にすること",
    scoreKey: "Tradition",
  },
  {
    order: 32,
    questionText: "人生における自分の役割を受け入れること",
    scoreKey: "Tradition",
  },

  // ===== 博愛（Benevolence）=====
  {
    order: 33,
    questionText: "身近な人々の幸福を気にかけ、助けること",
    scoreKey: "Benevolence",
  },
  {
    order: 34,
    questionText: "信頼でき、頼りになる友人であること",
    scoreKey: "Benevolence",
  },
  {
    order: 35,
    questionText: "誠実で、正直であること",
    scoreKey: "Benevolence",
  },
  {
    order: 36,
    questionText: "過ちを許し、人を許容すること",
    scoreKey: "Benevolence",
  },

  // ===== 普遍主義（Universalism）=====
  {
    order: 37,
    questionText: "すべての人が平等に扱われ、機会を得ること",
    scoreKey: "Universalism",
  },
  {
    order: 38,
    questionText: "自然環境を保護し、資源を大切にすること",
    scoreKey: "Universalism",
  },
  {
    order: 39,
    questionText: "世界の平和と調和を願うこと",
    scoreKey: "Universalism",
  },
  {
    order: 40,
    questionText: "異なる文化や考え方を理解し、尊重すること",
    scoreKey: "Universalism",
  },
];

// シード実行用のmutation
export const seedSchwartzTest = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), SCHWARTZ_TEST.slug))
      .first();

    if (existingTest) {
      console.log("価値観診断は既に存在します。スキップします。");
      return { success: false, message: "Test already exists" };
    }

    const testId = await ctx.db.insert("tests", {
      ...SCHWARTZ_TEST,
      resultTypes: SCHWARTZ_VALUES,
      createdAt: Date.now(),
    });

    for (const question of SCHWARTZ_QUESTIONS) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: question.order,
        questionText: question.questionText,
        questionType: "scale",
        options: SCALE_OPTIONS,
        scoreKey: question.scoreKey,
      });
    }

    console.log(`価値観診断を作成しました: ${testId}`);
    return { success: true, testId, questionCount: SCHWARTZ_QUESTIONS.length };
  },
});

export const resetSchwartzTest = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), SCHWARTZ_TEST.slug))
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
    console.log("価値観診断をリセットしました");
    return { success: true, deletedQuestions: questions.length };
  },
});
