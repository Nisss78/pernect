import { mutation } from "./_generated/server";

// 診断テスト定義
const LAST_LOVER_TEST = {
  slug: "last-lover",
  title: "恋愛診断",
  description:
    "恋愛における行動パターンや価値観を4つの軸で分析し、16種類の恋愛キャラクタータイプに分類します。あなたの恋愛傾向を発見しよう！",
  category: "love",
  questionCount: 16,
  estimatedMinutes: 5,
  scoringType: "dimension",
  resultField: undefined, // usersテーブルには保存しない（専用テーブルを使用）
  icon: "heart",
  gradientStart: "#a855f7", // Purple
  gradientEnd: "#6366f1", // Indigo
  isActive: true,
  citation: {
    authors: ["Pernect Team"],
    title: "恋愛診断 - 恋愛性格分析",
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

// テストのタイトルと色を更新
export const updateLastLoverTestMeta = mutation({
  args: {},
  handler: async (ctx) => {
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "last-lover"))
      .unique();

    if (!test) {
      return { success: false, message: "恋愛診断が見つかりません" };
    }

    await ctx.db.patch(test._id, {
      title: LAST_LOVER_TEST.title,
      description: LAST_LOVER_TEST.description,
      gradientStart: LAST_LOVER_TEST.gradientStart,
      gradientEnd: LAST_LOVER_TEST.gradientEnd,
    });

    return { success: true, message: "恋愛診断のメタデータを更新しました" };
  },
});

// 追加の16問を投入して32問に拡張（既存テストを安全にアップグレード）
export const extendLastLoverQuestions = mutation({
  args: {},
  handler: async (ctx) => {
    // テストを取得
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "last-lover"))
      .unique();

    if (!test) {
      return { success: false, message: "最後の恋人診断が見つかりません" };
    }

    // 既存の質問数を確認
    const existing = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", test._id))
      .collect();

    if (existing.length >= 32) {
      return { success: true, message: "すでに32問に拡張済み", questionCount: existing.length };
    }

    // 追加する質問（17〜32）: 各次元4問ずつ
    const EXTRA_QUESTIONS: Array<{
      order: number;
      questionText: string;
      options: { value: string; label: string; scoreValue: string }[];
    }> = [
      // E/I 追加
      { order: 17, questionText: "📣 恋人へのサプライズ", options: [
        { value: "E", label: "友達も巻き込んで盛大に企画する", scoreValue: "E" },
        { value: "I", label: "二人だけで静かに喜びを分かち合う", scoreValue: "I" },
      ]},
      { order: 18, questionText: "🕺 デートの雰囲気", options: [
        { value: "E", label: "にぎやかな場所やイベントが好き", scoreValue: "E" },
        { value: "I", label: "静かなカフェやお家デートが好き", scoreValue: "I" },
      ]},
      { order: 19, questionText: "☎️ 連絡スタイル", options: [
        { value: "E", label: "電話やビデオ通話が多い", scoreValue: "E" },
        { value: "I", label: "テキスト中心で必要なときに連絡", scoreValue: "I" },
      ]},
      { order: 20, questionText: "👥 交友関係の共有", options: [
        { value: "E", label: "お互いの友人を紹介して輪を広げたい", scoreValue: "E" },
        { value: "I", label: "プライベートは分けておきたい", scoreValue: "I" },
      ]},

      // S/N 追加
      { order: 21, questionText: "🧭 記念日の過ごし方", options: [
        { value: "S", label: "定番のプランで確実に楽しみたい", scoreValue: "S" },
        { value: "N", label: "新しい体験で思い出をアップデートしたい", scoreValue: "N" },
      ]},
      { order: 22, questionText: "📝 約束の捉え方", options: [
        { value: "S", label: "言ったことは具体的に実行するもの", scoreValue: "S" },
        { value: "N", label: "状況に応じて意味が変わることもある", scoreValue: "N" },
      ]},
      { order: 23, questionText: "🎯 関係のゴール", options: [
        { value: "S", label: "段階的に目標を決めて前進したい", scoreValue: "S" },
        { value: "N", label: "二人だけの物語が自然に形になるのが理想", scoreValue: "N" },
      ]},
      { order: 24, questionText: "🗺️ 将来の選択", options: [
        { value: "S", label: "現実的な条件を優先して決める", scoreValue: "S" },
        { value: "N", label: "ビジョンや可能性を優先して決める", scoreValue: "N" },
      ]},

      // T/F 追加
      { order: 25, questionText: "🧠 意見の違い", options: [
        { value: "T", label: "論点を整理して最適解を探す", scoreValue: "T" },
        { value: "F", label: "気持ちを確認して納得感を大切にする", scoreValue: "F" },
      ]},
      { order: 26, questionText: "💬 フィードバック", options: [
        { value: "T", label: "率直さを重視。事実ベースで話す", scoreValue: "T" },
        { value: "F", label: "言い方やタイミングに配慮する", scoreValue: "F" },
      ]},
      { order: 27, questionText: "❤️ 愛情の感じ方", options: [
        { value: "T", label: "問題が解決されると愛を感じる", scoreValue: "T" },
        { value: "F", label: "共感や寄り添いで愛を感じる", scoreValue: "F" },
      ]},
      { order: 28, questionText: "🫶 サポートの形", options: [
        { value: "T", label: "アドバイスや情報提供で支える", scoreValue: "T" },
        { value: "F", label: "そばにいて励ますことで支える", scoreValue: "F" },
      ]},

      // J/P 追加
      { order: 29, questionText: "🧭 旅行の計画", options: [
        { value: "J", label: "事前に日程や行程を固めておく", scoreValue: "J" },
        { value: "P", label: "現地で気分に合わせて決める", scoreValue: "P" },
      ]},
      { order: 30, questionText: "🕰️ 時間の使い方", options: [
        { value: "J", label: "予定通りに動けると安心する", scoreValue: "J" },
        { value: "P", label: "柔軟に動けると楽しく感じる", scoreValue: "P" },
      ]},
      { order: 31, questionText: "🔁 日常のルーティン", options: [
        { value: "J", label: "安定した習慣を二人で作りたい", scoreValue: "J" },
        { value: "P", label: "毎日違う楽しさを見つけたい", scoreValue: "P" },
      ]},
      { order: 32, questionText: "🎯 重要な決断", options: [
        { value: "J", label: "準備を整えて計画的に実行する", scoreValue: "J" },
        { value: "P", label: "流れやタイミングを大切にして決める", scoreValue: "P" },
      ]},
    ];

    // 既存orderのセット
    const existingOrders = new Set(existing.map((q) => q.order));
    let inserted = 0;
    for (const q of EXTRA_QUESTIONS) {
      if (existingOrders.has(q.order)) continue;
      await ctx.db.insert("testQuestions", {
        testId: test._id,
        order: q.order,
        questionText: q.questionText,
        questionType: "multiple",
        options: q.options,
      });
      inserted++;
    }

    // テスト定義のquestionCount/estimatedMinutesを更新
    const newCount = existing.length + inserted;
    await ctx.db.patch(test._id, {
      questionCount: Math.max(32, newCount),
      estimatedMinutes: 8,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: `質問を追加しました（+${inserted}）`,
      questionCount: Math.max(32, newCount),
    };
  },
});

// さらに32問追加して計64問へ（論理性を高めた強制選択形式）
export const extendLastLoverQuestions64 = mutation({
  args: {},
  handler: async (ctx) => {
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "last-lover"))
      .unique();

    if (!test) {
      return { success: false, message: "最後の恋人診断が見つかりません" };
    }

    // 現在の質問数を確認
    const existing = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", test._id))
      .collect();

    if (existing.length >= 64) {
      return { success: true, message: "すでに64問に拡張済み", questionCount: existing.length };
    }

    const EXTRA_33_64: Array<{
      order: number;
      questionText: string;
      options: { value: string; label: string; scoreValue: string }[];
    }> = [
      // E/I 追加（33-40）
      { order: 33, questionText: "👫 週末の過ごし方", options: [
        { value: "E", label: "誰かを誘って賑やかに過ごしたい", scoreValue: "E" },
        { value: "I", label: "二人だけで落ち着いて過ごしたい", scoreValue: "I" },
      ]},
      { order: 34, questionText: "🗣️ 気持ちの共有", options: [
        { value: "E", label: "その場で率直に言葉にして伝える", scoreValue: "E" },
        { value: "I", label: "少し時間をおいて整理してから伝える", scoreValue: "I" },
      ]},
      { order: 35, questionText: "🏟️ 記念日のプラン", options: [
        { value: "E", label: "イベントやスポットで思い出を作る", scoreValue: "E" },
        { value: "I", label: "自宅や静かな場所で丁寧に過ごす", scoreValue: "I" },
      ]},
      { order: 36, questionText: "🤳 SNSとの向き合い方", options: [
        { value: "E", label: "二人の写真をよく共有したい", scoreValue: "E" },
        { value: "I", label: "思い出は二人の間に留めたい", scoreValue: "I" },
      ]},
      { order: 37, questionText: "🧩 新しいコミュニティ", options: [
        { value: "E", label: "恋人と一緒に広げていきたい", scoreValue: "E" },
        { value: "I", label: "無理に広げず心地よい範囲で", scoreValue: "I" },
      ]},
      { order: 38, questionText: "🏙️ 外出と内向", options: [
        { value: "E", label: "外で刺激を受ける時間が大事", scoreValue: "E" },
        { value: "I", label: "家で落ち着いて回復する時間が大事", scoreValue: "I" },
      ]},
      { order: 39, questionText: "📞 連絡のリズム", options: [
        { value: "E", label: "短い間隔でこまめに取りたい", scoreValue: "E" },
        { value: "I", label: "必要なときに十分な長さで", scoreValue: "I" },
      ]},
      { order: 40, questionText: "🗓️ 予定の共有", options: [
        { value: "E", label: "思いついたらすぐ共有したい", scoreValue: "E" },
        { value: "I", label: "まとまってから必要分だけ共有", scoreValue: "I" },
      ]},

      // S/N 追加（41-48）
      { order: 41, questionText: "🧱 トラブル対応", options: [
        { value: "S", label: "現実的な手順で一つずつ解決", scoreValue: "S" },
        { value: "N", label: "背景や意味を捉えて根本から見直す", scoreValue: "N" },
      ]},
      { order: 42, questionText: "📔 思い出の残し方", options: [
        { value: "S", label: "写真・チケットなど具体的な形に残す", scoreValue: "S" },
        { value: "N", label: "ストーリーや象徴的な出来事を語り継ぐ", scoreValue: "N" },
      ]},
      { order: 43, questionText: "🧩 デートの選び方", options: [
        { value: "S", label: "レビューや実用性を重視する", scoreValue: "S" },
        { value: "N", label: "直感やワクワク感を重視する", scoreValue: "N" },
      ]},
      { order: 44, questionText: "🪄 サプライズの基準", options: [
        { value: "S", label: "相手が確実に使える・喜ぶもの", scoreValue: "S" },
        { value: "N", label: "物語性や意外性があるもの", scoreValue: "N" },
      ]},
      { order: 45, questionText: "🧭 将来像の描き方", options: [
        { value: "S", label: "時期・資金・手順など現実計画から", scoreValue: "S" },
        { value: "N", label: "理想像から逆算して可能性を探る", scoreValue: "N" },
      ]},
      { order: 46, questionText: "🪟 視野の広げ方", options: [
        { value: "S", label: "確かなデータ・事実を重ねる", scoreValue: "S" },
        { value: "N", label: "新しい比喩や仮説で発想する", scoreValue: "N" },
      ]},
      { order: 47, questionText: "🧪 新しい挑戦", options: [
        { value: "S", label: "まず小さく試して様子を見る", scoreValue: "S" },
        { value: "N", label: "大胆にやってみて学びながら調整", scoreValue: "N" },
      ]},
      { order: 48, questionText: "🧠 話題の好み", options: [
        { value: "S", label: "具体的体験・事実・共通タスク", scoreValue: "S" },
        { value: "N", label: "未来・可能性・意味づけ", scoreValue: "N" },
      ]},

      // T/F 追加（49-56）
      { order: 49, questionText: "🧩 価値観のすり合わせ", options: [
        { value: "T", label: "論点を明確化し合意を形成", scoreValue: "T" },
        { value: "F", label: "感情に寄り添い納得感を重視", scoreValue: "F" },
      ]},
      { order: 50, questionText: "🧯 衝突の火消し", options: [
        { value: "T", label: "事実とルールで再発防止策を作る", scoreValue: "T" },
        { value: "F", label: "気持ちのケアと関係修復を優先", scoreValue: "F" },
      ]},
      { order: 51, questionText: "🎙️ フィードバックの姿勢", options: [
        { value: "T", label: "率直・簡潔に本質だけ伝える", scoreValue: "T" },
        { value: "F", label: "相手の心情を配慮して丁寧に伝える", scoreValue: "F" },
      ]},
      { order: 52, questionText: "🫂 支え方", options: [
        { value: "T", label: "代替案・解決策の提示で支援", scoreValue: "T" },
        { value: "F", label: "共感・傾聴・寄り添いで支援", scoreValue: "F" },
      ]},
      { order: 53, questionText: "💞 表現の好み", options: [
        { value: "T", label: "行動や実績で示されると嬉しい", scoreValue: "T" },
        { value: "F", label: "言葉や態度で伝えられると嬉しい", scoreValue: "F" },
      ]},
      { order: 54, questionText: "🧭 判断基準", options: [
        { value: "T", label: "公平性・合理性を優先", scoreValue: "T" },
        { value: "F", label: "関係性・気持ちを優先", scoreValue: "F" },
      ]},
      { order: 55, questionText: "🧩 役割分担", options: [
        { value: "T", label: "適材適所で効率よく決めたい", scoreValue: "T" },
        { value: "F", label: "気持ちの負担も考慮して調整", scoreValue: "F" },
      ]},
      { order: 56, questionText: "🧷 優先順位の衝突", options: [
        { value: "T", label: "目的・手段を整理し最短解を選ぶ", scoreValue: "T" },
        { value: "F", label: "お互いの満足度が高い折衷を探す", scoreValue: "F" },
      ]},

      // J/P 追加（57-64）
      { order: 57, questionText: "🧾 家事・タスク管理", options: [
        { value: "J", label: "役割・頻度を決めて維持する", scoreValue: "J" },
        { value: "P", label: "臨機応変に都度分担する", scoreValue: "P" },
      ]},
      { order: 58, questionText: "🎁 予定外の出来事", options: [
        { value: "J", label: "予定に戻す方法を優先して考える", scoreValue: "J" },
        { value: "P", label: "流れに乗って新しい楽しみを探す", scoreValue: "P" },
      ]},
      { order: 59, questionText: "🗂️ 情報の整理", options: [
        { value: "J", label: "カテゴリ・ルールで整えると安心", scoreValue: "J" },
        { value: "P", label: "必要になったら検索・探索でOK", scoreValue: "P" },
      ]},
      { order: 60, questionText: "🏃 デートの移動", options: [
        { value: "J", label: "時間厳守・最短経路で進めたい", scoreValue: "J" },
        { value: "P", label: "気分で寄り道も楽しみたい", scoreValue: "P" },
      ]},
      { order: 61, questionText: "🛠️ 予算の組み方", options: [
        { value: "J", label: "毎月の枠を決めて運用", scoreValue: "J" },
        { value: "P", label: "都度話し合いで柔軟に対応", scoreValue: "P" },
      ]},
      { order: 62, questionText: "📅 年間イベント", options: [
        { value: "J", label: "毎年のパターンを作って安定させたい", scoreValue: "J" },
        { value: "P", label: "その年の気分で変化を楽しみたい", scoreValue: "P" },
      ]},
      { order: 63, questionText: "🧭 優先の切替", options: [
        { value: "J", label: "事前合意を優先・遵守が基本", scoreValue: "J" },
        { value: "P", label: "状況に合わせて柔軟に再調整", scoreValue: "P" },
      ]},
      { order: 64, questionText: "🎬 一日の締め方", options: [
        { value: "J", label: "ルーティンで心地よく締めたい", scoreValue: "J" },
        { value: "P", label: "その日のベストで自由に締めたい", scoreValue: "P" },
      ]},
    ];

    const existingOrders = new Set(existing.map((q) => q.order));
    let inserted = 0;
    for (const q of EXTRA_33_64) {
      if (existingOrders.has(q.order)) continue;
      await ctx.db.insert("testQuestions", {
        testId: test._id,
        order: q.order,
        questionText: q.questionText,
        questionType: "multiple",
        options: q.options,
      });
      inserted++;
    }

    const newCount = existing.length + inserted;
    await ctx.db.patch(test._id, {
      questionCount: Math.max(64, newCount),
      estimatedMinutes: 12,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: `質問を追加しました（+${inserted}）`,
      questionCount: Math.max(64, newCount),
    };
  },
});
