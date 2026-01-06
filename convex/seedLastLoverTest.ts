import { mutation } from "./_generated/server";

// 診断テスト定義
const LAST_LOVER_TEST = {
  slug: "last-lover",
  title: "最後の恋人診断",
  description:
    "恋愛における行動パターンや価値観を4つの軸で分析し、16種類の恋愛キャラクタータイプに分類します。韓国発の人気恋愛診断！",
  category: "love",
  questionCount: 16,
  estimatedMinutes: 5,
  scoringType: "dimension",
  resultField: undefined, // usersテーブルには保存しない（専用テーブルを使用）
  icon: "heart",
  gradientStart: "#ec4899", // Pink
  gradientEnd: "#a855f7", // Purple
  isActive: true,
  citation: {
    authors: ["Pernect Team"],
    title: "最後の恋人診断 - 恋愛性格分析",
    year: 2024,
    url: "https://pernect.app",
  },
  scoringConfig: {
    dimensions: [
      { positive: "E", negative: "I" },
      { positive: "S", negative: "N" },
      { positive: "T", negative: "F" },
      { positive: "J", negative: "P" },
    ],
  },
};

// 16問のシナリオベース質問（各軸4問ずつ）
const LAST_LOVER_QUESTIONS = [
  // E/I軸 - 外向/内向（4問）
  {
    order: 1,
    questionText: "💕 気になる人ができたとき、あなたはどうする？",
    options: [
      {
        value: "E",
        label: "積極的にアプローチして距離を縮める",
        scoreValue: "E",
      },
      {
        value: "I",
        label: "相手の様子を見ながらゆっくり関係を築く",
        scoreValue: "I",
      },
    ],
  },
  {
    order: 2,
    questionText: "💑 デートの計画を立てるとき、あなたは？",
    options: [
      {
        value: "E",
        label: "友達カップルと一緒のグループデートも楽しい",
        scoreValue: "E",
      },
      {
        value: "I",
        label: "二人きりでゆっくり過ごしたい",
        scoreValue: "I",
      },
    ],
  },
  {
    order: 3,
    questionText: "💬 恋人との連絡頻度は？",
    options: [
      {
        value: "E",
        label: "頻繁に連絡を取り合いたい。会話が途切れると寂しい",
        scoreValue: "E",
      },
      {
        value: "I",
        label: "大事なときに連絡できればOK。一人の時間も大切",
        scoreValue: "I",
      },
    ],
  },
  {
    order: 4,
    questionText: "🎉 恋人の友達との集まりに誘われたら？",
    options: [
      {
        value: "E",
        label: "喜んで参加！新しい人と会うのは楽しい",
        scoreValue: "E",
      },
      {
        value: "I",
        label: "少し緊張する...二人の時間の方が落ち着く",
        scoreValue: "I",
      },
    ],
  },

  // S/N軸 - 現実/直感（4問）
  {
    order: 5,
    questionText: "💍 将来の話をするとき、あなたは？",
    options: [
      {
        value: "S",
        label: "具体的な計画（結婚時期、住む場所、貯金目標など）を話し合いたい",
        scoreValue: "S",
      },
      {
        value: "N",
        label: "夢や理想（どんな家庭を築きたいか、理想の関係など）を語り合いたい",
        scoreValue: "N",
      },
    ],
  },
  {
    order: 6,
    questionText: "🎁 プレゼントを選ぶとき、重視するのは？",
    options: [
      {
        value: "S",
        label: "実用的で普段使いできるもの",
        scoreValue: "S",
      },
      {
        value: "N",
        label: "思い出や意味を込めた特別なもの",
        scoreValue: "N",
      },
    ],
  },
  {
    order: 7,
    questionText: "✨ 理想のデートは？",
    options: [
      {
        value: "S",
        label: "美味しいレストランや話題のスポットなど、具体的な楽しみがある",
        scoreValue: "S",
      },
      {
        value: "N",
        label: "目的地を決めずにふらっと出かける、spontaneousなデート",
        scoreValue: "N",
      },
    ],
  },
  {
    order: 8,
    questionText: "💭 恋人との会話で楽しいのは？",
    options: [
      {
        value: "S",
        label: "今日あったことや共通の趣味について話す",
        scoreValue: "S",
      },
      {
        value: "N",
        label: "将来の夢や「もしも」の想像を語り合う",
        scoreValue: "N",
      },
    ],
  },

  // T/F軸 - 論理/感情（4問）
  {
    order: 9,
    questionText: "😢 恋人が落ち込んでいるとき、あなたは？",
    options: [
      {
        value: "T",
        label: "原因を分析して具体的な解決策を提案する",
        scoreValue: "T",
      },
      {
        value: "F",
        label: "まず気持ちに寄り添い、話を聞いてあげる",
        scoreValue: "F",
      },
    ],
  },
  {
    order: 10,
    questionText: "💔 ケンカになったとき、どう対処する？",
    options: [
      {
        value: "T",
        label: "冷静に話し合い、どちらが正しいか論理的に解決したい",
        scoreValue: "T",
      },
      {
        value: "F",
        label: "お互いの気持ちを確認し合い、仲直りを優先したい",
        scoreValue: "F",
      },
    ],
  },
  {
    order: 11,
    questionText: "💞 恋人への愛情表現で大切にしているのは？",
    options: [
      {
        value: "T",
        label: "約束を守る、困ったときに助けるなど行動で示す",
        scoreValue: "T",
      },
      {
        value: "F",
        label: "「好き」「ありがとう」など言葉で気持ちを伝える",
        scoreValue: "F",
      },
    ],
  },
  {
    order: 12,
    questionText: "🤝 恋人からのアドバイスで嬉しいのは？",
    options: [
      {
        value: "T",
        label: "率直で論理的なフィードバック。遠慮は不要",
        scoreValue: "T",
      },
      {
        value: "F",
        label: "励ましの言葉と一緒に、優しく伝えてくれる",
        scoreValue: "F",
      },
    ],
  },

  // J/P軸 - 計画/柔軟（4問）
  {
    order: 13,
    questionText: "📅 デートの予定は？",
    options: [
      {
        value: "J",
        label: "事前にしっかり計画を立てて、当日はスムーズに動きたい",
        scoreValue: "J",
      },
      {
        value: "P",
        label: "その日の気分で決めて、臨機応変に楽しみたい",
        scoreValue: "P",
      },
    ],
  },
  {
    order: 14,
    questionText: "🏠 恋人との将来を考えるとき？",
    options: [
      {
        value: "J",
        label: "結婚、子供、キャリアなど具体的な人生設計を話し合いたい",
        scoreValue: "J",
      },
      {
        value: "P",
        label: "先のことより今を大切に。流れに身を任せたい",
        scoreValue: "P",
      },
    ],
  },
  {
    order: 15,
    questionText: "⏰ 約束の時間について？",
    options: [
      {
        value: "J",
        label: "時間厳守！遅刻は相手への配慮がないと感じる",
        scoreValue: "J",
      },
      {
        value: "P",
        label: "少しくらいの遅刻は気にしない。臨機応変でいい",
        scoreValue: "P",
      },
    ],
  },
  {
    order: 16,
    questionText: "💝 恋愛において大切にしていることは？",
    options: [
      {
        value: "J",
        label: "安定と信頼。将来を見据えた真剣な関係を築きたい",
        scoreValue: "J",
      },
      {
        value: "P",
        label: "自由と新鮮さ。今この瞬間を一緒に楽しみたい",
        scoreValue: "P",
      },
    ],
  },
];

// 16タイプの分析データ（resultTypes用）
const LAST_LOVER_RESULT_TYPES: Record<
  string,
  {
    summary: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }
> = {
  ESFJ: {
    summary: "献身的な世話焼きさん",
    description:
      "あなたは恋人のために全力を尽くすタイプ。相手の幸せが自分の幸せであり、細やかな気配りと温かいサポートで愛を表現します。",
    strengths: [
      "相手の気持ちを敏感に察知できる",
      "安定した愛情表現ができる",
      "困ったときに頼りになる存在",
    ],
    weaknesses: ["自分のことを後回しにしがち", "相手に尽くしすぎて疲れることも"],
    recommendations: [
      "自分自身のケアも忘れずに",
      "相手からの見返りを期待しすぎないこと",
    ],
  },
  ESFP: {
    summary: "キラキラ輝く太陽タイプ",
    description:
      "あなたは恋愛を全力で楽しむタイプ。今この瞬間を大切にし、恋人と一緒に新しい体験をすることが大好き。",
    strengths: [
      "一緒にいると元気になれる存在",
      "新しいことに挑戦する勇気がある",
      "素直で裏表がない",
    ],
    weaknesses: ["長期的な計画が苦手", "飽きっぽいところがある"],
    recommendations: [
      "時には落ち着いて将来のことも考えて",
      "マンネリ防止の工夫を",
    ],
  },
  ESTJ: {
    summary: "頼れるリーダー恋人",
    description:
      "あなたは恋愛においても誠実さと責任感を大切にするタイプ。将来を見据えた真剣な交際を好みます。",
    strengths: [
      "経済的・精神的に安定している",
      "約束を守る信頼性",
      "将来設計がしっかりしている",
    ],
    weaknesses: ["融通が利かないことがある", "感情表現が苦手"],
    recommendations: ["柔軟性を持つことも大切", "感情を言葉にする練習を"],
  },
  ESTP: {
    summary: "スリル好きな冒険家",
    description:
      "あなたは退屈な恋愛より刺激的な恋愛を求めるタイプ。行動力があり、恋人とスリリングな体験を共有することで絆を深めます。",
    strengths: [
      "行動力があり頼りがいがある",
      "困難な状況でも冷静に対処",
      "一緒にいると退屈しない",
    ],
    weaknesses: ["感情的な話し合いが苦手", "長期的なコミットメントに慎重"],
    recommendations: [
      "時には立ち止まって深い話も",
      "安定の価値も認識して",
    ],
  },
  ENFJ: {
    summary: "情熱的な守護者",
    description:
      "あなたは恋人の成長と幸せを心から願うタイプ。相手の潜在能力を見抜き、それを引き出すサポートをします。",
    strengths: [
      "相手の気持ちを深く理解できる",
      "モチベーションを高める力がある",
      "献身的で愛情深い",
    ],
    weaknesses: ["相手に期待しすぎることがある", "自分のニーズを後回しにしがち"],
    recommendations: [
      "完璧な関係を求めすぎないで",
      "自分の気持ちも大切にして",
    ],
  },
  ENFP: {
    summary: "ロマンチックな夢見る人",
    description:
      "あなたは恋愛にロマンスと深いつながりを求めるタイプ。運命の相手との出会いを信じ、全身全霊で愛します。",
    strengths: [
      "恋人を特別な存在として扱える",
      "創造的で飽きさせない",
      "深い感情的つながりを築ける",
    ],
    weaknesses: ["理想が高すぎることがある", "気分の波が激しい"],
    recommendations: [
      "現実も見つめながら夢を追って",
      "安定した関係の価値も認識して",
    ],
  },
  ENTJ: {
    summary: "リードする情熱タイプ",
    description:
      "あなたは恋愛においてもリーダーシップを発揮するタイプ。目標を持って関係を築き、パートナーと一緒に成長していきます。",
    strengths: ["頼りがいがある", "決断力がある", "将来設計能力が高い"],
    weaknesses: ["支配的に見えることがある", "感情表現が控えめ"],
    recommendations: [
      "相手の意見も尊重して",
      "時には感情を言葉にして伝えて",
    ],
  },
  ENTP: {
    summary: "知的な遊び人",
    description:
      "あなたは恋愛に知的な刺激とユーモアを求めるタイプ。討論や議論を楽しみ、型にはまらない関係を好みます。",
    strengths: [
      "会話が面白く飽きさせない",
      "柔軟な発想ができる",
      "新しい体験を提案できる",
    ],
    weaknesses: ["約束を守るのが苦手なことも", "議論が好きすぎて喧嘩になることも"],
    recommendations: [
      "感情的なサポートも忘れずに",
      "コミットメントの大切さを意識して",
    ],
  },
  ISFJ: {
    summary: "静かな献身者",
    description:
      "あなたは静かで控えめながら、深い愛情を持つタイプ。裏方として恋人をサポートし、思い出を大切にします。",
    strengths: [
      "細やかな気配りができる",
      "忠実で一途",
      "安定した愛情を与えられる",
    ],
    weaknesses: ["自分の気持ちを伝えるのが苦手", "変化を嫌う傾向"],
    recommendations: [
      "自分の気持ちを言葉にする練習を",
      "新しい体験にも挑戦してみて",
    ],
  },
  ISFP: {
    summary: "控えめな癒し系",
    description:
      "あなたは穏やかで感性豊かなタイプ。静かに寄り添うことで愛を示し、美しいものを恋人と共有することを好みます。",
    strengths: [
      "癒しの存在になれる",
      "美的センスが高い",
      "相手を尊重する",
    ],
    weaknesses: ["自分の意見を主張するのが苦手", "計画を立てるのが不得意"],
    recommendations: [
      "自分の考えも伝えてみて",
      "時には積極的にリードしてみよう",
    ],
  },
  ISTJ: {
    summary: "誠実な守り人",
    description:
      "あなたは誠実さと信頼性を最も大切にするタイプ。約束を守り、着実に関係を築いていきます。",
    strengths: [
      "信頼性が高い",
      "責任感がある",
      "約束を必ず守る",
    ],
    weaknesses: ["感情表現が苦手", "変化に対応するのが苦手"],
    recommendations: [
      "感情を言葉にする努力を",
      "サプライズや変化も楽しんでみて",
    ],
  },
  ISTP: {
    summary: "クールな職人気質",
    description:
      "あなたは独立心が強く、言葉より行動で愛を示すタイプ。クールに見えますが、必要なときには頼りになる存在です。",
    strengths: [
      "困ったときに頼りになる",
      "冷静な判断ができる",
      "束縛しない",
    ],
    weaknesses: ["感情表現が控えめ", "コミュニケーション不足になりがち"],
    recommendations: [
      "定期的にコミュニケーションを",
      "感情を共有する努力も大切",
    ],
  },
  INFJ: {
    summary: "神秘的な魂の伴侶",
    description:
      "あなたは恋愛において深い精神的なつながりを求めるタイプ。魂のレベルで理解し合えるパートナーを探しています。",
    strengths: [
      "深い共感力がある",
      "相手の本質を見抜ける",
      "精神的なサポートが得意",
    ],
    weaknesses: ["理想が高すぎることがある", "傷つきやすい"],
    recommendations: [
      "完璧を求めすぎないで",
      "自分を守ることも大切",
    ],
  },
  INFP: {
    summary: "夢見る詩人",
    description:
      "あなたは恋愛に深い意味と美しさを求めるタイプ。理想の愛を夢見て、感受性豊かに愛情を表現します。",
    strengths: [
      "深い感情的つながりを築ける",
      "創造的な愛情表現ができる",
      "一途で忠実",
    ],
    weaknesses: ["理想と現実のギャップに苦しむ", "批判に敏感"],
    recommendations: [
      "現実も受け入れる柔軟性を",
      "自分の価値を信じて",
    ],
  },
  INTJ: {
    summary: "戦略的な恋愛マスター",
    description:
      "あなたは恋愛にも戦略的なアプローチを取るタイプ。論理的に相手との相性を判断し、長期的な視野で関係を築きます。",
    strengths: [
      "将来設計能力が高い",
      "知的な刺激を与えられる",
      "独立心があり束縛しない",
    ],
    weaknesses: ["感情表現が苦手", "批判的に見えることがある"],
    recommendations: [
      "感情を言葉にする努力を",
      "相手の感情面にも配慮して",
    ],
  },
  INTP: {
    summary: "知的な夢想家",
    description:
      "あなたは恋愛においても知的なつながりを重視するタイプ。自分の世界観を理解してくれるパートナーを求めます。",
    strengths: [
      "知的な刺激を与えられる",
      "独自の視点を持っている",
      "束縛しない",
    ],
    weaknesses: ["感情を読み取るのが苦手", "コミュニケーション不足になりがち"],
    recommendations: [
      "感情面でのコミュニケーションを意識して",
      "一緒にいる時間も大切に",
    ],
  },
};

// 診断テストと質問を投入
export const seedLastLoverTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存のテストがあるか確認
    const existingTest = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "last-lover"))
      .unique();

    if (existingTest) {
      return {
        message: "最後の恋人診断は既に存在します",
        testId: existingTest._id,
      };
    }

    // テスト定義を作成
    const testId = await ctx.db.insert("tests", {
      ...LAST_LOVER_TEST,
      resultTypes: LAST_LOVER_RESULT_TYPES,
      createdAt: Date.now(),
    });

    // 質問を作成
    for (const question of LAST_LOVER_QUESTIONS) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: question.order,
        questionText: question.questionText,
        questionType: "multiple",
        options: question.options,
      });
    }

    return {
      message: "最後の恋人診断を作成しました",
      testId,
      questionCount: LAST_LOVER_QUESTIONS.length,
    };
  },
});

// テストをリセット（開発用）
export const resetLastLoverTest = mutation({
  args: {},
  handler: async (ctx) => {
    // テストを取得
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "last-lover"))
      .unique();

    if (!test) {
      return { message: "最後の恋人診断が見つかりません" };
    }

    // 関連する質問を削除
    const questions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", test._id))
      .collect();

    for (const question of questions) {
      await ctx.db.delete(question._id);
    }

    // テストを削除
    await ctx.db.delete(test._id);

    return {
      message: "最後の恋人診断をリセットしました",
      deletedQuestions: questions.length,
    };
  },
});
