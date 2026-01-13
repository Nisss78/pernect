import { mutation } from "./_generated/server";

// キャリアアンカー診断テスト定義
const CAREER_ANCHORS_TEST = {
  slug: "career-anchors",
  title: "キャリアアンカー診断",
  description:
    "仕事で絶対に譲れない価値観を8つのアンカーから分析。自分らしいキャリアを築くための指針を見つけましょう。",
  category: "career",
  questionCount: 40,
  estimatedMinutes: 10,
  scoringType: "percentile" as const,
  icon: "briefcase",
  gradientStart: "#0ea5e9",
  gradientEnd: "#6366f1",
  isActive: true,
  citation: {
    authors: ["Edgar H. Schein"],
    title: "Career Anchors: Discovering Your Real Values",
    year: 1990,
    url: "https://www.scheinocli.com/",
  },
};

// 8つのキャリアアンカー定義
const CAREER_ANCHORS: Record<
  string,
  {
    nameJa: string;
    nameEn: string;
    summary: string;
    description: string;
    keywords: string[];
    idealJobs: string[];
    strengths: string[];
    recommendations: string[];
  }
> = {
  TF: {
    nameJa: "専門・職能別能力",
    nameEn: "Technical/Functional Competence",
    summary: "特定分野のエキスパートとして能力を発揮したい",
    description:
      "あなたは特定の専門分野で卓越した能力を持つことに価値を見出しています。管理職になるよりも、技術や専門性を極めることに喜びを感じます。",
    keywords: ["専門性", "技術", "スキル", "エキスパート", "深い知識"],
    idealJobs: ["エンジニア", "研究者", "専門コンサルタント", "職人", "アナリスト"],
    strengths: ["深い専門知識", "問題解決能力", "継続的な学習意欲"],
    recommendations: [
      "専門性を深められる環境を選ぶ",
      "最新の知識やスキルを常にアップデートする",
      "専門家コミュニティに参加する",
    ],
  },
  GM: {
    nameJa: "全般管理能力",
    nameEn: "General Managerial Competence",
    summary: "組織全体を統括し、経営に携わりたい",
    description:
      "あなたは組織を率い、人々を導くことに価値を見出しています。経営判断、組織運営、リーダーシップの発揮が重要な動機です。",
    keywords: ["経営", "リーダーシップ", "統括", "意思決定", "組織運営"],
    idealJobs: ["経営者", "事業部長", "マネージャー", "起業家", "COO"],
    strengths: ["統合的思考", "人材育成", "戦略的判断"],
    recommendations: [
      "マネジメント経験を積極的に積む",
      "異なる部門や機能を経験する",
      "経営視点で物事を考える習慣をつける",
    ],
  },
  AU: {
    nameJa: "自律・独立",
    nameEn: "Autonomy/Independence",
    summary: "自分のやり方で、自由に働きたい",
    description:
      "あなたは自分自身のルールで働くこと、組織の制約から自由であることを重視しています。自分のペースで、自分の方法で仕事を進めることが重要です。",
    keywords: ["自由", "独立", "自律", "自分のペース", "制約からの解放"],
    idealJobs: ["フリーランス", "コンサルタント", "独立開業", "リモートワーカー", "作家"],
    strengths: ["自己管理能力", "独立した判断", "柔軟な働き方"],
    recommendations: [
      "裁量の大きい仕事を選ぶ",
      "独立の可能性を探る",
      "自分なりの働き方を確立する",
    ],
  },
  SE: {
    nameJa: "安定・保障",
    nameEn: "Security/Stability",
    summary: "安定した雇用と将来の保障を求める",
    description:
      "あなたは長期的な雇用安定、福利厚生、予測可能なキャリアパスを重視しています。安心して働ける環境が最も重要な動機です。",
    keywords: ["安定", "保障", "長期雇用", "福利厚生", "予測可能性"],
    idealJobs: ["公務員", "大企業社員", "教員", "医療従事者", "金融機関"],
    strengths: ["長期的視点", "継続性", "組織への忠誠心"],
    recommendations: [
      "安定した組織を選ぶ",
      "長期的なキャリアパスを描く",
      "専門性を高めて市場価値を上げる",
    ],
  },
  EC: {
    nameJa: "起業家的創造性",
    nameEn: "Entrepreneurial Creativity",
    summary: "新しいビジネスや製品を生み出したい",
    description:
      "あなたは新しいものを創造し、自分のビジネスや製品を世に送り出すことに価値を見出しています。起業家精神とイノベーションが重要な動機です。",
    keywords: ["創造", "起業", "イノベーション", "新規事業", "リスクテイク"],
    idealJobs: ["起業家", "新規事業開発", "プロダクトマネージャー", "発明家", "投資家"],
    strengths: ["創造力", "リスクを取る勇気", "機会を見つける目"],
    recommendations: [
      "アイデアを形にする経験を積む",
      "起業や新規事業に挑戦する",
      "失敗を恐れず挑戦し続ける",
    ],
  },
  SV: {
    nameJa: "奉仕・社会貢献",
    nameEn: "Service/Dedication to a Cause",
    summary: "社会や他者のために貢献したい",
    description:
      "あなたは自分の仕事を通じて社会に貢献すること、他者を助けることに価値を見出しています。意義のある仕事が最も重要な動機です。",
    keywords: ["貢献", "奉仕", "社会的意義", "他者支援", "使命感"],
    idealJobs: ["医療従事者", "教育者", "NPO職員", "ソーシャルワーカー", "環境活動家"],
    strengths: ["使命感", "共感力", "持続的なモチベーション"],
    recommendations: [
      "社会的インパクトのある仕事を選ぶ",
      "ボランティアや社会活動に参加する",
      "自分の貢献を可視化する",
    ],
  },
  CH: {
    nameJa: "純粋な挑戦",
    nameEn: "Pure Challenge",
    summary: "困難な問題を解決し、競争に勝ちたい",
    description:
      "あなたは困難な課題に挑戦し、それを克服することに価値を見出しています。競争、問題解決、不可能を可能にすることが重要な動機です。",
    keywords: ["挑戦", "競争", "問題解決", "困難の克服", "勝利"],
    idealJobs: ["コンサルタント", "トレーダー", "弁護士", "スポーツ選手", "研究者"],
    strengths: ["問題解決力", "競争心", "粘り強さ"],
    recommendations: [
      "難易度の高いプロジェクトに参加する",
      "競争的な環境に身を置く",
      "常に新しい挑戦を求める",
    ],
  },
  LS: {
    nameJa: "ライフスタイル",
    nameEn: "Lifestyle",
    summary: "仕事と私生活のバランスを大切にしたい",
    description:
      "あなたは仕事と個人生活、家族との時間のバランスを重視しています。キャリアだけでなく、人生全体の充実が重要な動機です。",
    keywords: ["ワークライフバランス", "家族", "私生活", "柔軟性", "人生の質"],
    idealJobs: ["リモートワーク", "フレックス勤務", "パートタイム専門職", "地方移住", "複業"],
    strengths: ["バランス感覚", "優先順位の明確さ", "持続可能な働き方"],
    recommendations: [
      "柔軟な働き方ができる環境を選ぶ",
      "境界線を明確に設定する",
      "仕事以外の時間を大切にする",
    ],
  },
};

// 6段階評価の選択肢
const SCALE_OPTIONS = [
  { value: "1", label: "全く当てはまらない", scoreValue: 1 },
  { value: "2", label: "当てはまらない", scoreValue: 2 },
  { value: "3", label: "あまり当てはまらない", scoreValue: 3 },
  { value: "4", label: "やや当てはまる", scoreValue: 4 },
  { value: "5", label: "当てはまる", scoreValue: 5 },
  { value: "6", label: "非常に当てはまる", scoreValue: 6 },
];

// 40問の質問データ（8アンカー × 5問）
const CAREER_ANCHORS_QUESTIONS = [
  // ===== 専門・職能別能力（TF）=====
  {
    order: 1,
    questionText: "特定の分野で専門家として認められることが重要だ",
    scoreKey: "TF",
  },
  {
    order: 2,
    questionText: "管理職になるより、専門性を極めたい",
    scoreKey: "TF",
  },
  {
    order: 3,
    questionText: "自分の専門分野で最高のスキルを持つことに喜びを感じる",
    scoreKey: "TF",
  },
  {
    order: 4,
    questionText: "技術的な問題を解決することにやりがいを感じる",
    scoreKey: "TF",
  },
  {
    order: 5,
    questionText: "専門知識を深め続けることが大切だと思う",
    scoreKey: "TF",
  },

  // ===== 全般管理能力（GM）=====
  {
    order: 6,
    questionText: "組織全体を見渡し、統括する立場に就きたい",
    scoreKey: "GM",
  },
  {
    order: 7,
    questionText: "人々を導き、チームをまとめることにやりがいを感じる",
    scoreKey: "GM",
  },
  {
    order: 8,
    questionText: "経営判断や戦略的な意思決定に携わりたい",
    scoreKey: "GM",
  },
  {
    order: 9,
    questionText: "組織の成功に責任を持つポジションに魅力を感じる",
    scoreKey: "GM",
  },
  {
    order: 10,
    questionText: "様々な部門や機能を統合する仕事がしたい",
    scoreKey: "GM",
  },

  // ===== 自律・独立（AU）=====
  {
    order: 11,
    questionText: "自分のペースで、自分のやり方で働きたい",
    scoreKey: "AU",
  },
  {
    order: 12,
    questionText: "組織のルールや制約に縛られるのは苦手だ",
    scoreKey: "AU",
  },
  {
    order: 13,
    questionText: "いつかは独立して自分のビジネスを持ちたい",
    scoreKey: "AU",
  },
  {
    order: 14,
    questionText: "仕事の進め方を自分で決められることが重要だ",
    scoreKey: "AU",
  },
  {
    order: 15,
    questionText: "自由度の高い仕事環境を求める",
    scoreKey: "AU",
  },

  // ===== 安定・保障（SE）=====
  {
    order: 16,
    questionText: "長期的な雇用の安定が重要だ",
    scoreKey: "SE",
  },
  {
    order: 17,
    questionText: "福利厚生や退職金制度がしっかりした会社で働きたい",
    scoreKey: "SE",
  },
  {
    order: 18,
    questionText: "予測可能なキャリアパスがある方が安心する",
    scoreKey: "SE",
  },
  {
    order: 19,
    questionText: "経済的な安定は仕事選びの最重要要素だ",
    scoreKey: "SE",
  },
  {
    order: 20,
    questionText: "リスクの高い仕事よりも安定した仕事を選ぶ",
    scoreKey: "SE",
  },

  // ===== 起業家的創造性（EC）=====
  {
    order: 21,
    questionText: "新しいビジネスや製品を生み出すことに興奮する",
    scoreKey: "EC",
  },
  {
    order: 22,
    questionText: "自分のアイデアを形にして世に出したい",
    scoreKey: "EC",
  },
  {
    order: 23,
    questionText: "起業して自分の会社を作ることに憧れる",
    scoreKey: "EC",
  },
  {
    order: 24,
    questionText: "新規事業の立ち上げに参加したい",
    scoreKey: "EC",
  },
  {
    order: 25,
    questionText: "リスクを取ってでも新しいことに挑戦したい",
    scoreKey: "EC",
  },

  // ===== 奉仕・社会貢献（SV）=====
  {
    order: 26,
    questionText: "社会に貢献できる仕事がしたい",
    scoreKey: "SV",
  },
  {
    order: 27,
    questionText: "他者を助けることにやりがいを感じる",
    scoreKey: "SV",
  },
  {
    order: 28,
    questionText: "仕事を通じて世界をより良くしたい",
    scoreKey: "SV",
  },
  {
    order: 29,
    questionText: "給料よりも仕事の社会的意義が重要だ",
    scoreKey: "SV",
  },
  {
    order: 30,
    questionText: "人々の生活を向上させる仕事に魅力を感じる",
    scoreKey: "SV",
  },

  // ===== 純粋な挑戦（CH）=====
  {
    order: 31,
    questionText: "困難な問題を解決することが好きだ",
    scoreKey: "CH",
  },
  {
    order: 32,
    questionText: "競争に勝つことにモチベーションを感じる",
    scoreKey: "CH",
  },
  {
    order: 33,
    questionText: "不可能と言われることに挑戦したい",
    scoreKey: "CH",
  },
  {
    order: 34,
    questionText: "ルーティンワークよりも難題に取り組みたい",
    scoreKey: "CH",
  },
  {
    order: 35,
    questionText: "高い目標を設定し、それを達成することが重要だ",
    scoreKey: "CH",
  },

  // ===== ライフスタイル（LS）=====
  {
    order: 36,
    questionText: "仕事と私生活のバランスが最も重要だ",
    scoreKey: "LS",
  },
  {
    order: 37,
    questionText: "家族との時間を犠牲にしてまでキャリアを追求しない",
    scoreKey: "LS",
  },
  {
    order: 38,
    questionText: "柔軟な働き方ができる環境を求める",
    scoreKey: "LS",
  },
  {
    order: 39,
    questionText: "人生全体の充実がキャリアの成功より大切だ",
    scoreKey: "LS",
  },
  {
    order: 40,
    questionText: "仕事以外の趣味や活動も大切にしたい",
    scoreKey: "LS",
  },
];

// シード実行用のmutation
export const seedCareerAnchorsTest = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), CAREER_ANCHORS_TEST.slug))
      .first();

    if (existingTest) {
      console.log("キャリアアンカー診断は既に存在します。スキップします。");
      return { success: false, message: "Test already exists" };
    }

    const testId = await ctx.db.insert("tests", {
      ...CAREER_ANCHORS_TEST,
      resultTypes: CAREER_ANCHORS,
      createdAt: Date.now(),
    });

    for (const question of CAREER_ANCHORS_QUESTIONS) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: question.order,
        questionText: question.questionText,
        questionType: "scale",
        options: SCALE_OPTIONS,
        scoreKey: question.scoreKey,
      });
    }

    console.log(`キャリアアンカー診断を作成しました: ${testId}`);
    return { success: true, testId, questionCount: CAREER_ANCHORS_QUESTIONS.length };
  },
});

export const resetCareerAnchorsTest = mutation({
  args: {},
  handler: async (ctx) => {
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), CAREER_ANCHORS_TEST.slug))
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
    console.log("キャリアアンカー診断をリセットしました");
    return { success: true, deletedQuestions: questions.length };
  },
});
