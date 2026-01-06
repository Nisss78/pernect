import { mutation } from "./_generated/server";

/**
 * 科学的根拠に基づく診断テストのシードデータ
 *
 * 13種類の診断テストを投入する統合シード関数
 * - Tier 1: MBTI, BIG5, エニアグラム
 * - Tier 2: VIA, グリット, EQ
 * - Tier 3: 愛着スタイル, 愛の言語, DiSC
 * - Tier 4: HSP, マネースクリプト, コーピング, VARK
 */

// =============================================================================
// Tier 1: 性格・自己理解
// =============================================================================

const MBTI_TEST = {
  slug: "mbti-evidence",
  title: "MBTI性格診断",
  description: "ユング心理学に基づく16タイプの性格分類。あなたの心理的傾向を4つの軸で分析します。",
  category: "personality",
  estimatedMinutes: 15,
  questionCount: 20,
  icon: "brain",
  gradientStart: "#8b5cf6",
  gradientEnd: "#2563eb",
  isActive: true,
  scoringType: "dimension",
  scoringConfig: {
    dimensions: [
      { positive: "E", negative: "I" },
      { positive: "S", negative: "N" },
      { positive: "T", negative: "F" },
      { positive: "J", negative: "P" },
    ],
  },
  citation: {
    authors: ["Isabel Briggs Myers", "Katharine Cook Briggs"],
    title: "Myers-Briggs Type Indicator",
    year: 1962,
    url: "https://www.myersbriggs.org/",
  },
  resultTypes: {
    ENFP: {
      summary: "情熱的なキャンペーナー",
      description: "創造的で熱意に溢れた性格。新しいアイデアを探求し、人々とつながることを楽しみます。",
      strengths: ["創造性", "コミュニケーション力", "適応力", "エネルギッシュ"],
      weaknesses: ["細部を見落としがち", "計画性不足", "感情的になりやすい"],
      recommendations: ["ルーティンを作って集中力を維持", "大きなプロジェクトは小さなタスクに分解"],
    },
    INTJ: {
      summary: "戦略的な設計者",
      description: "分析的で戦略的な思考を持つ性格。長期的なビジョンを持ち、効率的に目標を達成します。",
      strengths: ["戦略的思考", "独立心", "高い基準", "論理的"],
      weaknesses: ["感情表現が苦手", "完璧主義", "他者に厳しい"],
      recommendations: ["チームワークの価値を認識", "感情面でのフィードバックも大切に"],
    },
    INFP: {
      summary: "理想主義的な仲介者",
      description: "理想主義的で創造的な性格。深い価値観を持ち、意味のある人生を追求します。",
      strengths: ["共感力", "創造性", "誠実さ", "理想追求"],
      weaknesses: ["現実離れ", "批判に敏感", "決断が遅い"],
      recommendations: ["理想と現実のバランスを意識", "建設的な批判を成長の機会と捉える"],
    },
    ENTJ: {
      summary: "大胆な指揮官",
      description: "自信に満ちたリーダータイプ。効率を重視し、目標達成に向けて周囲を導きます。",
      strengths: ["リーダーシップ", "効率重視", "決断力", "自信"],
      weaknesses: ["支配的", "感情を軽視", "せっかち"],
      recommendations: ["他者の意見に耳を傾ける", "感情面でのサポートも忘れずに"],
    },
    // 他のタイプも追加可能
  },
};

const BIG5_TEST = {
  slug: "big5",
  title: "ビッグファイブ性格診断",
  description: "心理学で最も科学的に検証された5因子モデル。開放性・誠実性・外向性・協調性・神経症傾向を測定します。",
  category: "personality",
  estimatedMinutes: 20,
  questionCount: 50,
  icon: "star",
  gradientStart: "#06b6d4",
  gradientEnd: "#3b82f6",
  isActive: true,
  scoringType: "percentile",
  scoringConfig: {
    percentileBase: 100,
  },
  citation: {
    authors: ["Paul T. Costa Jr.", "Robert R. McCrae"],
    title: "Revised NEO Personality Inventory (NEO-PI-R)",
    year: 1992,
    doi: "10.1037/t03907-000",
    url: "https://www.parinc.com/Products/Pkey/275",
  },
  resultTypes: {
    "High-O": {
      summary: "開放性が高い",
      description: "新しい経験や抽象的な概念に対してオープンで、創造的・知的好奇心が強い傾向があります。",
      strengths: ["創造性", "知的好奇心", "芸術的感性", "想像力"],
      weaknesses: ["現実離れ", "伝統軽視"],
      recommendations: ["創造的な活動に時間を割く", "新しい学びを続ける"],
    },
    "High-C": {
      summary: "誠実性が高い",
      description: "自己規律があり、目標に向かって計画的に行動する傾向があります。責任感が強く、信頼性が高いです。",
      strengths: ["計画性", "責任感", "自己規律", "信頼性"],
      weaknesses: ["柔軟性不足", "完璧主義"],
      recommendations: ["時には計画から外れることも許容", "休息も重要な計画の一部"],
    },
    "High-E": {
      summary: "外向性が高い",
      description: "社交的でエネルギッシュ。人との交流からエネルギーを得て、活動的な生活を好みます。",
      strengths: ["社交性", "積極性", "活力", "楽観性"],
      weaknesses: ["注意散漫", "一人の時間が苦手"],
      recommendations: ["内省の時間も確保", "深い人間関係も大切に"],
    },
    "High-A": {
      summary: "協調性が高い",
      description: "協力的で思いやりがあり、他者との調和を重視します。信頼を置かれやすい性格です。",
      strengths: ["思いやり", "協力性", "信頼性", "謙虚さ"],
      weaknesses: ["自己主張の弱さ", "他者への依存"],
      recommendations: ["自分のニーズも大切に", "時には意見を主張する練習を"],
    },
    "High-N": {
      summary: "神経症傾向が高い",
      description: "感情的に敏感で、ストレスや不安を感じやすい傾向があります。深い感受性を持っています。",
      strengths: ["感受性", "注意深さ", "危機察知能力"],
      weaknesses: ["不安傾向", "ストレス耐性"],
      recommendations: ["ストレス管理法を学ぶ", "マインドフルネスを取り入れる"],
    },
  },
};

const ENNEAGRAM_TEST = {
  slug: "enneagram",
  title: "エニアグラム診断",
  description: "古代から伝わる9タイプの性格論。あなたの基本的な動機と成長の方向性を探ります。",
  category: "personality",
  estimatedMinutes: 15,
  questionCount: 36,
  icon: "shapes",
  gradientStart: "#f59e0b",
  gradientEnd: "#ef4444",
  isActive: true,
  scoringType: "single",
  citation: {
    authors: ["Don Richard Riso", "Russ Hudson"],
    title: "The Wisdom of the Enneagram",
    year: 1999,
    url: "https://www.enneagraminstitute.com/",
  },
  resultTypes: {
    "1": {
      summary: "改革者（タイプ1）",
      description: "理想主義的で、正しいことをすることに強い動機を持ちます。高い基準と倫理観を持っています。",
      strengths: ["誠実さ", "高い理想", "責任感", "改善意欲"],
      weaknesses: ["完璧主義", "批判的", "怒りの抑圧"],
      recommendations: ["自分にも他人にも寛容になる", "完璧でなくても良いと認める"],
    },
    "2": {
      summary: "助ける人（タイプ2）",
      description: "思いやりがあり、他者を助けることに喜びを感じます。愛され必要とされることを望みます。",
      strengths: ["共感力", "寛大さ", "サポート力", "温かさ"],
      weaknesses: ["他者依存", "自己犠牲", "見返りへの期待"],
      recommendations: ["自分自身のニーズも大切に", "無条件の愛を学ぶ"],
    },
    "3": {
      summary: "達成者（タイプ3）",
      description: "成功志向で、目標達成に強いモチベーションを持ちます。効率的で適応力があります。",
      strengths: ["目標志向", "効率性", "適応力", "自信"],
      weaknesses: ["イメージへの執着", "感情の抑圧", "ワーカホリック"],
      recommendations: ["本当の自分の価値を認める", "失敗も成長の一部"],
    },
    "4": {
      summary: "個性派（タイプ4）",
      description: "感受性が豊かで、自分らしさと独自性を大切にします。深い感情と創造性を持っています。",
      strengths: ["創造性", "感受性", "独自性", "誠実さ"],
      weaknesses: ["気分の波", "嫉妬", "自己陶酔"],
      recommendations: ["今ある良いことに感謝する", "感情に振り回されない練習"],
    },
    "5": {
      summary: "観察者（タイプ5）",
      description: "知識を求め、世界を理解しようとします。独立心が強く、自分の時間と空間を大切にします。",
      strengths: ["知性", "洞察力", "独立性", "客観性"],
      weaknesses: ["孤立", "感情の抑制", "行動への躊躇"],
      recommendations: ["知識を実践に活かす", "人との繋がりを大切に"],
    },
    "6": {
      summary: "忠実な人（タイプ6）",
      description: "安全と安定を求め、信頼できる人や組織に忠実です。責任感があり、よく準備します。",
      strengths: ["忠実さ", "責任感", "洞察力", "勤勉さ"],
      weaknesses: ["不安", "疑い深さ", "優柔不断"],
      recommendations: ["自分の直感を信じる", "不安を行動で解消する"],
    },
    "7": {
      summary: "熱中する人（タイプ7）",
      description: "楽観的で冒険心があり、人生を楽しむことを大切にします。多くの選択肢と可能性を求めます。",
      strengths: ["楽観性", "創造性", "適応力", "エネルギー"],
      weaknesses: ["注意散漫", "逃避", "浅い関係"],
      recommendations: ["一つのことに集中する練習", "困難に向き合う勇気を持つ"],
    },
    "8": {
      summary: "挑戦する人（タイプ8）",
      description: "力強く自信があり、状況をコントロールしようとします。正義感が強く、弱者を守ります。",
      strengths: ["リーダーシップ", "決断力", "正義感", "保護本能"],
      weaknesses: ["支配的", "攻撃性", "弱さの隠蔽"],
      recommendations: ["弱さを見せる勇気を持つ", "他者の意見を尊重する"],
    },
    "9": {
      summary: "平和を好む人（タイプ9）",
      description: "平和と調和を求め、対立を避けます。穏やかで受容的、他者の視点を理解する力があります。",
      strengths: ["平和志向", "受容性", "安定感", "仲介力"],
      weaknesses: ["自己主張の欠如", "怠惰", "自己忘却"],
      recommendations: ["自分の意見を持ち表現する", "自分の重要性を認識する"],
    },
  },
};

// =============================================================================
// Tier 2: 強み・能力
// =============================================================================

const VIA_TEST = {
  slug: "via-strengths",
  title: "VIA強み診断",
  description: "ポジティブ心理学に基づく24の性格強みを測定。あなたの代表的な強みを発見します。",
  category: "strength",
  estimatedMinutes: 25,
  questionCount: 48,
  icon: "trophy",
  gradientStart: "#10b981",
  gradientEnd: "#059669",
  isActive: true,
  scoringType: "percentile",
  scoringConfig: {
    percentileBase: 100,
  },
  citation: {
    authors: ["Martin E. P. Seligman", "Christopher Peterson"],
    title: "Character Strengths and Virtues: A Handbook and Classification",
    year: 2004,
    url: "https://www.viacharacter.org/",
  },
  resultTypes: {
    creativity: {
      summary: "創造性",
      description: "新しい、生産的なやり方で物事を考え、行う能力があります。",
      strengths: ["独創性", "想像力", "問題解決"],
      weaknesses: [],
      recommendations: ["創造的なプロジェクトに時間を割く"],
    },
    curiosity: {
      summary: "好奇心",
      description: "さまざまな経験に興味を持ち、新しいことを探求する姿勢があります。",
      strengths: ["探求心", "開放性", "学習意欲"],
      weaknesses: [],
      recommendations: ["新しい分野を積極的に学ぶ"],
    },
    judgment: {
      summary: "判断力",
      description: "物事を多角的に考え、証拠に基づいて決断する能力があります。",
      strengths: ["批判的思考", "客観性", "公平性"],
      weaknesses: [],
      recommendations: ["重要な決定では多様な視点を集める"],
    },
    love_of_learning: {
      summary: "学習への愛",
      description: "新しいスキルや知識を習得することに喜びを感じます。",
      strengths: ["向上心", "知的好奇心", "粘り強さ"],
      weaknesses: [],
      recommendations: ["生涯学習を続ける習慣を持つ"],
    },
    perspective: {
      summary: "大局観",
      description: "世界と自分自身について賢明な見方ができます。",
      strengths: ["洞察力", "賢明さ", "助言力"],
      weaknesses: [],
      recommendations: ["メンターとしての役割を引き受ける"],
    },
  },
};

const GRIT_TEST = {
  slug: "grit",
  title: "グリット診断",
  description: "やり抜く力（Grit）を測定。長期目標に向けた情熱と粘り強さを評価します。",
  category: "strength",
  estimatedMinutes: 5,
  questionCount: 12,
  icon: "fitness",
  gradientStart: "#f97316",
  gradientEnd: "#dc2626",
  isActive: true,
  scoringType: "scale",
  scoringConfig: {
    thresholds: [
      { min: 0, max: 24, label: "低い" },
      { min: 25, max: 36, label: "やや低い" },
      { min: 37, max: 48, label: "中程度" },
      { min: 49, max: 60, label: "高い" },
    ],
  },
  citation: {
    authors: ["Angela Lee Duckworth"],
    title: "Grit: The Power of Passion and Perseverance",
    year: 2016,
    doi: "10.1037/a0026969",
    url: "https://angeladuckworth.com/grit-scale/",
  },
  resultTypes: {
    "高い": {
      summary: "グリットが高い",
      description: "長期目標に向けた強い情熱と粘り強さを持っています。困難に直面しても諦めずに努力を続けます。",
      strengths: ["粘り強さ", "情熱", "長期的視野", "回復力"],
      weaknesses: [],
      recommendations: ["大きな目標を設定し続ける", "短期的な挫折に惑わされない"],
    },
    "中程度": {
      summary: "グリットは中程度",
      description: "目標に向けて努力する力がありますが、時に迷いや挫折を感じることもあります。",
      strengths: ["適度な粘り強さ", "バランス感覚"],
      weaknesses: ["目標の明確化が必要", "モチベーション維持"],
      recommendations: ["興味と目標を結びつける", "小さな成功体験を積み重ねる"],
    },
    "やや低い": {
      summary: "グリットがやや低い",
      description: "興味や目標が変わりやすく、長期的な努力を続けることに課題があります。",
      strengths: ["柔軟性", "多様な興味"],
      weaknesses: ["継続性", "目標設定"],
      recommendations: ["本当に興味あることを見つける", "習慣化の仕組みを作る"],
    },
    "低い": {
      summary: "グリットを伸ばす余地あり",
      description: "目標への粘り強さを高めることで、より大きな成果を得られる可能性があります。",
      strengths: ["成長の可能性"],
      weaknesses: ["継続性", "情熱の維持"],
      recommendations: ["まず小さな目標から始める", "サポートシステムを構築する"],
    },
  },
};

const EQ_TEST = {
  slug: "eq",
  title: "EQ（感情知能）診断",
  description: "感情を認識し、管理し、活用する能力を測定。5つのEQ能力を評価します。",
  category: "strength",
  estimatedMinutes: 15,
  questionCount: 30,
  icon: "heart",
  gradientStart: "#ec4899",
  gradientEnd: "#8b5cf6",
  isActive: true,
  scoringType: "percentile",
  scoringConfig: {
    percentileBase: 100,
  },
  citation: {
    authors: ["Daniel Goleman"],
    title: "Emotional Intelligence: Why It Can Matter More Than IQ",
    year: 1995,
    url: "https://www.danielgoleman.info/",
  },
  resultTypes: {
    self_awareness: {
      summary: "自己認識",
      description: "自分の感情を正確に認識し、それが行動や思考に与える影響を理解する能力です。",
      strengths: ["感情の認識", "自己理解", "直感力"],
      weaknesses: [],
      recommendations: ["感情日記をつける", "マインドフルネスを実践する"],
    },
    self_regulation: {
      summary: "自己管理",
      description: "衝動的な感情や行動をコントロールし、適切に表現する能力です。",
      strengths: ["感情のコントロール", "適応力", "誠実さ"],
      weaknesses: [],
      recommendations: ["ストレス管理法を学ぶ", "一呼吸置く習慣を持つ"],
    },
    motivation: {
      summary: "動機づけ",
      description: "目標達成に向けて自分自身を駆り立てる内発的な動機を持つ能力です。",
      strengths: ["達成志向", "楽観性", "コミットメント"],
      weaknesses: [],
      recommendations: ["意味のある目標を設定する", "進捗を可視化する"],
    },
    empathy: {
      summary: "共感",
      description: "他者の感情を理解し、それに適切に対応する能力です。",
      strengths: ["他者理解", "傾聴力", "多様性への感受性"],
      weaknesses: [],
      recommendations: ["積極的に傾聴する", "異なる視点を想像する"],
    },
    social_skills: {
      summary: "社会的スキル",
      description: "良好な人間関係を構築し、他者に影響を与える能力です。",
      strengths: ["影響力", "チームワーク", "紛争解決"],
      weaknesses: [],
      recommendations: ["ネットワークを広げる", "建設的なフィードバックを実践する"],
    },
  },
};

// =============================================================================
// Tier 3: 対人関係
// =============================================================================

const ATTACHMENT_TEST = {
  slug: "attachment-style",
  title: "愛着スタイル診断",
  description: "ボウルビィの愛着理論に基づく4タイプの愛着パターン。対人関係の基盤となる愛着スタイルを発見します。",
  category: "relationship",
  estimatedMinutes: 10,
  questionCount: 20,
  icon: "link",
  gradientStart: "#f472b6",
  gradientEnd: "#ec4899",
  isActive: true,
  scoringType: "single",
  citation: {
    authors: ["John Bowlby", "Mary Ainsworth"],
    title: "Attachment Theory",
    year: 1969,
    url: "https://www.simplypsychology.org/attachment.html",
  },
  resultTypes: {
    secure: {
      summary: "安定型愛着",
      description: "他者との親密さに心地よさを感じ、信頼関係を築くことができます。自分の感情を適切に表現できます。",
      strengths: ["信頼構築", "感情表現", "健全な境界線", "自己肯定感"],
      weaknesses: [],
      recommendations: ["現在の健全な関係性を維持する", "他者の愛着スタイルを理解する"],
    },
    anxious: {
      summary: "不安型愛着",
      description: "親密さを求める一方で、拒絶や見捨てられることへの不安を感じやすい傾向があります。",
      strengths: ["共感力", "関係への献身", "感受性"],
      weaknesses: ["過度な承認欲求", "不安傾向", "依存的になりやすい"],
      recommendations: ["自己価値の内在化を練習", "マインドフルネスで不安を管理"],
    },
    avoidant: {
      summary: "回避型愛着",
      description: "独立性を重視し、感情的な親密さに距離を置く傾向があります。自己完結を好みます。",
      strengths: ["独立性", "自己完結", "冷静さ"],
      weaknesses: ["感情表現の回避", "親密さへの恐怖", "孤立傾向"],
      recommendations: ["少しずつ感情を開示する練習", "安全な関係で親密さを経験"],
    },
    disorganized: {
      summary: "混乱型愛着",
      description: "親密さへの欲求と恐怖が混在し、関係性において矛盾した行動パターンを示すことがあります。",
      strengths: ["複雑な感情の理解", "自己認識の深さ"],
      weaknesses: ["感情の混乱", "関係の不安定さ"],
      recommendations: ["専門家のサポートを検討", "安全な環境で感情を整理"],
    },
  },
};

const LOVE_LANGUAGE_TEST = {
  slug: "love-language",
  title: "5つの愛の言語診断",
  description: "ゲイリー・チャップマンの理論に基づく愛の表現方法。あなたが愛を感じる方法を発見します。",
  category: "relationship",
  estimatedMinutes: 10,
  questionCount: 30,
  icon: "heart",
  gradientStart: "#ef4444",
  gradientEnd: "#f97316",
  isActive: true,
  scoringType: "single",
  citation: {
    authors: ["Gary Chapman"],
    title: "The 5 Love Languages: The Secret to Love that Lasts",
    year: 1992,
    url: "https://www.5lovelanguages.com/",
  },
  resultTypes: {
    words_of_affirmation: {
      summary: "肯定的な言葉",
      description: "言葉による愛情表現を最も大切にします。褒め言葉、感謝、励ましの言葉で愛を感じます。",
      strengths: ["言語表現", "感謝の表現", "励まし"],
      weaknesses: [],
      recommendations: ["パートナーに感謝を言葉で伝える", "自分への肯定的な言葉も大切に"],
    },
    acts_of_service: {
      summary: "奉仕行為",
      description: "行動で示される愛を最も大切にします。相手のために何かをしてもらうことで愛を感じます。",
      strengths: ["実践的サポート", "思いやりの行動", "信頼性"],
      weaknesses: [],
      recommendations: ["小さな親切を日常に", "相手の負担を減らすことを意識"],
    },
    receiving_gifts: {
      summary: "贈り物",
      description: "心のこもった贈り物を通じて愛を感じます。プレゼントそのものより、その思いやりを大切にします。",
      strengths: ["シンボルの理解", "思い出の大切さ", "感謝の心"],
      weaknesses: [],
      recommendations: ["小さなサプライズを楽しむ", "物質的価値より心の価値を重視"],
    },
    quality_time: {
      summary: "クオリティタイム",
      description: "一緒に過ごす質の高い時間を最も大切にします。集中した注目と存在感で愛を感じます。",
      strengths: ["集中力", "傾聴力", "現在への意識"],
      weaknesses: [],
      recommendations: ["デジタルデトックスの時間を設ける", "アクティブリスニングを実践"],
    },
    physical_touch: {
      summary: "スキンシップ",
      description: "身体的な接触を通じて愛を感じます。ハグ、手を繋ぐなどのスキンシップを大切にします。",
      strengths: ["非言語コミュニケーション", "温かさ", "安心感の提供"],
      weaknesses: [],
      recommendations: ["日常的なスキンシップを意識", "相手の境界線を尊重"],
    },
  },
};

const DISC_TEST = {
  slug: "disc-communication",
  title: "DiSCコミュニケーション診断",
  description: "ウィリアム・マーストンの理論に基づく4つのコミュニケーションスタイル。対人関係の傾向を分析します。",
  category: "relationship",
  estimatedMinutes: 12,
  questionCount: 28,
  icon: "chatbubbles",
  gradientStart: "#3b82f6",
  gradientEnd: "#6366f1",
  isActive: true,
  scoringType: "dimension",
  scoringConfig: {
    dimensions: [
      { positive: "D", negative: "S" },
      { positive: "I", negative: "C" },
    ],
  },
  citation: {
    authors: ["William Moulton Marston"],
    title: "Emotions of Normal People",
    year: 1928,
    url: "https://www.discprofile.com/",
  },
  resultTypes: {
    D: {
      summary: "主導型（Dominance）",
      description: "結果志向で決断力があり、挑戦を好みます。直接的なコミュニケーションを好みます。",
      strengths: ["決断力", "結果志向", "自信", "効率性"],
      weaknesses: ["せっかち", "支配的", "細部の見落とし"],
      recommendations: ["他者の意見に耳を傾ける", "プロセスの重要性を認識"],
    },
    I: {
      summary: "感化型（Influence）",
      description: "楽観的で社交的、人を巻き込む力があります。熱意とエネルギーで周囲を動かします。",
      strengths: ["社交性", "楽観性", "影響力", "創造性"],
      weaknesses: ["集中力の欠如", "詳細への無関心", "感情的"],
      recommendations: ["具体的な計画を立てる", "フォローアップを忘れずに"],
    },
    S: {
      summary: "安定型（Steadiness）",
      description: "協調性があり、安定を好みます。サポーティブで忍耐強く、チームの調和を大切にします。",
      strengths: ["忍耐力", "傾聴力", "チームワーク", "信頼性"],
      weaknesses: ["変化への抵抗", "自己主張の弱さ", "決断の遅さ"],
      recommendations: ["変化をチャンスと捉える", "自分の意見を表現する練習"],
    },
    C: {
      summary: "慎重型（Conscientiousness）",
      description: "正確さと品質を重視し、分析的思考を持ちます。論理的で体系的なアプローチを好みます。",
      strengths: ["分析力", "正確性", "体系的思考", "品質意識"],
      weaknesses: ["批判的", "完璧主義", "決断の遅れ"],
      recommendations: ["時には直感を信じる", "完璧を求めすぎない"],
    },
  },
};

// =============================================================================
// Tier 4: ライフスタイル
// =============================================================================

const HSP_TEST = {
  slug: "hsp",
  title: "HSP（繊細さ）診断",
  description: "エレイン・アーロン博士の研究に基づく高感受性パーソナリティ診断。繊細さの度合いを測定します。",
  category: "lifestyle",
  estimatedMinutes: 8,
  questionCount: 27,
  icon: "leaf",
  gradientStart: "#84cc16",
  gradientEnd: "#22c55e",
  isActive: true,
  scoringType: "scale",
  scoringConfig: {
    thresholds: [
      { min: 0, max: 13, label: "低感受性" },
      { min: 14, max: 18, label: "中程度の感受性" },
      { min: 19, max: 27, label: "高感受性（HSP）" },
    ],
  },
  citation: {
    authors: ["Elaine N. Aron"],
    title: "The Highly Sensitive Person",
    year: 1996,
    url: "https://hsperson.com/",
  },
  resultTypes: {
    "高感受性（HSP）": {
      summary: "高感受性パーソナリティ",
      description: "繊細で深く処理する傾向があります。刺激に敏感で、豊かな内面世界を持っています。",
      strengths: ["深い洞察力", "共感力", "創造性", "直感力"],
      weaknesses: ["過剰刺激への脆弱性", "疲れやすさ"],
      recommendations: ["十分な休息とダウンタイムを確保", "刺激をコントロールできる環境を作る"],
    },
    "中程度の感受性": {
      summary: "中程度の感受性",
      description: "状況に応じて感受性を発揮します。バランスの取れた感覚処理ができます。",
      strengths: ["柔軟性", "適応力", "バランス感覚"],
      weaknesses: [],
      recommendations: ["自分の限界を知っておく", "必要に応じて休息を取る"],
    },
    "低感受性": {
      summary: "刺激を求めるタイプ",
      description: "刺激に対する耐性が高く、活動的な環境を好みます。",
      strengths: ["ストレス耐性", "活動性", "大胆さ"],
      weaknesses: ["繊細なニュアンスを見落とす可能性"],
      recommendations: ["HSPの人への配慮を学ぶ", "静かな時間の価値も認識"],
    },
  },
};

const MONEY_SCRIPT_TEST = {
  slug: "money-script",
  title: "マネースクリプト診断",
  description: "ブラッド・クロンツ博士の研究に基づく金銭心理診断。お金に対する無意識の信念を発見します。",
  category: "lifestyle",
  estimatedMinutes: 10,
  questionCount: 24,
  icon: "cash",
  gradientStart: "#fbbf24",
  gradientEnd: "#f59e0b",
  isActive: true,
  scoringType: "single",
  citation: {
    authors: ["Brad Klontz", "Ted Klontz"],
    title: "Mind Over Money",
    year: 2009,
    url: "https://www.yourmentalwealthadvisors.com/",
  },
  resultTypes: {
    money_avoidance: {
      summary: "回避スクリプト",
      description: "お金は悪いもの、または自分には縁がないと無意識に信じる傾向があります。",
      strengths: ["物質主義への抵抗", "精神的価値の重視"],
      weaknesses: ["金銭管理の回避", "自己破壊的な金銭行動"],
      recommendations: ["お金は中立的なツールと認識", "財務知識を身につける"],
    },
    money_worship: {
      summary: "崇拝スクリプト",
      description: "より多くのお金があれば幸せになれると信じる傾向があります。",
      strengths: ["野心", "達成志向"],
      weaknesses: ["決して満足できない", "仕事中毒"],
      recommendations: ["お金以外の幸福の源を見つける", "感謝の実践"],
    },
    money_status: {
      summary: "ステータススクリプト",
      description: "自己価値をお金や所有物と結びつける傾向があります。",
      strengths: ["成功への動機", "外見への意識"],
      weaknesses: ["見栄のための消費", "内面的価値の軽視"],
      recommendations: ["内面的な自己価値を育てる", "本当の価値とは何かを問う"],
    },
    money_vigilance: {
      summary: "警戒スクリプト",
      description: "お金について慎重で、秘密にする傾向があります。堅実な金銭管理をします。",
      strengths: ["倹約", "財務計画", "自制心"],
      weaknesses: ["過度の不安", "人生を楽しむことへの罪悪感"],
      recommendations: ["適度な消費も許容する", "お金について信頼できる人と話す"],
    },
  },
};

const COPING_TEST = {
  slug: "stress-coping",
  title: "ストレスコーピング診断",
  description: "ラザルス＆フォルクマンの理論に基づくストレス対処スタイル診断。あなたのコーピング傾向を分析します。",
  category: "lifestyle",
  estimatedMinutes: 12,
  questionCount: 28,
  icon: "shield",
  gradientStart: "#14b8a6",
  gradientEnd: "#06b6d4",
  isActive: true,
  scoringType: "percentile",
  scoringConfig: {
    percentileBase: 100,
  },
  citation: {
    authors: ["Richard S. Lazarus", "Susan Folkman"],
    title: "Stress, Appraisal, and Coping",
    year: 1984,
    doi: "10.1007/978-1-4419-1005-9_215",
    url: "https://www.springer.com/gp/book/9780826141910",
  },
  resultTypes: {
    problem_focused: {
      summary: "問題焦点型コーピング",
      description: "ストレスの原因に直接働きかけて解決しようとするスタイルです。",
      strengths: ["解決志向", "積極性", "自己効力感"],
      weaknesses: [],
      recommendations: ["コントロール不可能な状況では感情コーピングも活用"],
    },
    emotion_focused: {
      summary: "情動焦点型コーピング",
      description: "ストレスによる感情的な苦痛を軽減しようとするスタイルです。",
      strengths: ["感情調整", "自己ケア", "レジリエンス"],
      weaknesses: [],
      recommendations: ["問題解決が可能な場合は積極的アプローチも試す"],
    },
    avoidance: {
      summary: "回避型コーピング",
      description: "ストレス状況から距離を置こうとするスタイルです。",
      strengths: ["一時的な休息", "感情の保護"],
      weaknesses: ["問題の先送り", "長期的には逆効果の可能性"],
      recommendations: ["回避を一時的な戦略として使い、根本対処も計画"],
    },
    social_support: {
      summary: "社会的支援型コーピング",
      description: "周囲のサポートを求めてストレスに対処するスタイルです。",
      strengths: ["人間関係の活用", "共感の獲得", "視野の拡大"],
      weaknesses: [],
      recommendations: ["自立的な対処法も併用するとより効果的"],
    },
  },
};

const VARK_TEST = {
  slug: "vark-learning",
  title: "VARK学習スタイル診断",
  description: "ニール・フレミングの理論に基づく学習スタイル診断。最適な学習方法を発見します。",
  category: "lifestyle",
  estimatedMinutes: 8,
  questionCount: 16,
  icon: "book",
  gradientStart: "#a855f7",
  gradientEnd: "#6366f1",
  isActive: true,
  scoringType: "single",
  citation: {
    authors: ["Neil D. Fleming"],
    title: "Teaching and Learning Styles: VARK Strategies",
    year: 2001,
    url: "https://vark-learn.com/",
  },
  resultTypes: {
    visual: {
      summary: "視覚型学習者",
      description: "図、グラフ、チャート、マップなど視覚的な情報から最もよく学びます。",
      strengths: ["空間認識", "パターン認識", "視覚記憶"],
      weaknesses: [],
      recommendations: ["マインドマップを活用", "色分けしたノートを作成", "図解で理解を深める"],
    },
    auditory: {
      summary: "聴覚型学習者",
      description: "講義、ディスカッション、音声コンテンツなど聴覚的な情報から最もよく学びます。",
      strengths: ["傾聴力", "言語理解", "音声記憶"],
      weaknesses: [],
      recommendations: ["音声教材を活用", "声に出して学習", "ディスカッションに参加"],
    },
    read_write: {
      summary: "読み書き型学習者",
      description: "テキスト、リスト、ノートなど書かれた情報から最もよく学びます。",
      strengths: ["読解力", "文章理解", "ノート作成"],
      weaknesses: [],
      recommendations: ["詳細なノートを取る", "要約を書く", "リストを作成して整理"],
    },
    kinesthetic: {
      summary: "体感型学習者",
      description: "実践、体験、シミュレーションなど身体を使った活動から最もよく学びます。",
      strengths: ["実践力", "体験記憶", "直感的理解"],
      weaknesses: [],
      recommendations: ["実際にやってみる", "ロールプレイを活用", "動きながら学習"],
    },
    multimodal: {
      summary: "マルチモーダル型学習者",
      description: "複数の学習スタイルを状況に応じて柔軟に使い分けることができます。",
      strengths: ["柔軟性", "適応力", "多様な学習法"],
      weaknesses: [],
      recommendations: ["状況に応じて最適な方法を選択", "複数のアプローチを組み合わせる"],
    },
  },
};

// =============================================================================
// シード投入関数
// =============================================================================

export const seedTier1 = mutation({
  args: {},
  handler: async (ctx) => {
    const tests = [MBTI_TEST, BIG5_TEST, ENNEAGRAM_TEST];
    const results: string[] = [];

    for (const test of tests) {
      // 既存チェック
      const existing = await ctx.db
        .query("tests")
        .withIndex("by_slug", (q) => q.eq("slug", test.slug))
        .first();

      if (existing) {
        results.push(`Skip: ${test.slug} (already exists)`);
        continue;
      }

      // テスト投入
      await ctx.db.insert("tests", {
        ...test,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      results.push(`Added: ${test.slug}`);
    }

    return { success: true, results };
  },
});

export const seedTier2 = mutation({
  args: {},
  handler: async (ctx) => {
    const tests = [VIA_TEST, GRIT_TEST, EQ_TEST];
    const results: string[] = [];

    for (const test of tests) {
      const existing = await ctx.db
        .query("tests")
        .withIndex("by_slug", (q) => q.eq("slug", test.slug))
        .first();

      if (existing) {
        results.push(`Skip: ${test.slug} (already exists)`);
        continue;
      }

      await ctx.db.insert("tests", {
        ...test,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      results.push(`Added: ${test.slug}`);
    }

    return { success: true, results };
  },
});

export const seedTier3 = mutation({
  args: {},
  handler: async (ctx) => {
    const tests = [ATTACHMENT_TEST, LOVE_LANGUAGE_TEST, DISC_TEST];
    const results: string[] = [];

    for (const test of tests) {
      const existing = await ctx.db
        .query("tests")
        .withIndex("by_slug", (q) => q.eq("slug", test.slug))
        .first();

      if (existing) {
        results.push(`Skip: ${test.slug} (already exists)`);
        continue;
      }

      await ctx.db.insert("tests", {
        ...test,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      results.push(`Added: ${test.slug}`);
    }

    return { success: true, results };
  },
});

export const seedTier4 = mutation({
  args: {},
  handler: async (ctx) => {
    const tests = [HSP_TEST, MONEY_SCRIPT_TEST, COPING_TEST, VARK_TEST];
    const results: string[] = [];

    for (const test of tests) {
      const existing = await ctx.db
        .query("tests")
        .withIndex("by_slug", (q) => q.eq("slug", test.slug))
        .first();

      if (existing) {
        results.push(`Skip: ${test.slug} (already exists)`);
        continue;
      }

      await ctx.db.insert("tests", {
        ...test,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      results.push(`Added: ${test.slug}`);
    }

    return { success: true, results };
  },
});

// 全Tierを一括投入
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const allTests = [
      // Tier 1: 性格・自己理解
      MBTI_TEST,
      BIG5_TEST,
      ENNEAGRAM_TEST,
      // Tier 2: 強み・能力
      VIA_TEST,
      GRIT_TEST,
      EQ_TEST,
      // Tier 3: 対人関係
      ATTACHMENT_TEST,
      LOVE_LANGUAGE_TEST,
      DISC_TEST,
      // Tier 4: ライフスタイル
      HSP_TEST,
      MONEY_SCRIPT_TEST,
      COPING_TEST,
      VARK_TEST,
    ];
    const results: string[] = [];

    for (const test of allTests) {
      const existing = await ctx.db
        .query("tests")
        .withIndex("by_slug", (q) => q.eq("slug", test.slug))
        .first();

      if (existing) {
        results.push(`Skip: ${test.slug} (already exists)`);
        continue;
      }

      await ctx.db.insert("tests", {
        ...test,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      results.push(`Added: ${test.slug}`);
    }

    return {
      success: true,
      totalAdded: results.filter((r) => r.startsWith("Added")).length,
      totalSkipped: results.filter((r) => r.startsWith("Skip")).length,
      results,
    };
  },
});
