import { mutation } from "./_generated/server";

// MBTI診断テスト定義
const MBTI_TEST = {
  slug: "mbti",
  title: "MBTI性格診断",
  description:
    "60問の質問であなたの性格タイプを詳細に分析。日常生活、仕事、対人関係のパターンから16タイプに分類します。",
  category: "personality",
  questionCount: 60,
  estimatedMinutes: 15,
  scoringType: "dimension",
  resultField: "mbti",
  icon: "brain",
  gradientStart: "#6366f1", // Indigo
  gradientEnd: "#8b5cf6", // Purple
  isActive: true,
  citation: {
    authors: ["Isabel Briggs Myers", "Katharine Cook Briggs"],
    title: "Myers-Briggs Type Indicator",
    year: 1962,
    url: "https://www.myersbriggs.org",
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

// 60問の質問データ（各軸15問×4軸）
// 質問順序は軸混在形式: E1,S1,T1,J1,E2,S2,T2,J2,...
const MBTI_QUESTIONS: Array<{
  axis: "EI" | "SN" | "TF" | "JP";
  questionText: string;
  optionA: { label: string; scoreValue: string };
  optionB: { label: string; scoreValue: string };
}> = [
  // ===== E/I軸（外向/内向）15問 =====
  // エネルギー源（4問）
  {
    axis: "EI",
    questionText: "エネルギーを回復させるのに最も効果的なのは？",
    optionA: { label: "友人との食事や集まりに参加する", scoreValue: "E" },
    optionB: { label: "一人で静かな時間を過ごす", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "長時間の作業の後、リフレッシュするには？",
    optionA: { label: "誰かと話したり、外出したりする", scoreValue: "E" },
    optionB: { label: "静かに読書や趣味に没頭する", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "休日の過ごし方として理想的なのは？",
    optionA: { label: "友人と出かけたり、イベントに参加する", scoreValue: "E" },
    optionB: { label: "家でゆっくり過ごす", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "疲れを感じたとき、どうリフレッシュする？",
    optionA: { label: "人と会って話すことで元気になる", scoreValue: "E" },
    optionB: { label: "一人の時間を確保して回復する", scoreValue: "I" },
  },
  // 社交スタイル（4問）
  {
    axis: "EI",
    questionText: "新しい環境に入ったとき、あなたは？",
    optionA: { label: "積極的に周囲の人に話しかける", scoreValue: "E" },
    optionB: { label: "まず様子を観察してから行動する", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "パーティーや交流会では？",
    optionA: { label: "多くの人と幅広く交流する", scoreValue: "E" },
    optionB: { label: "少数の人と深い会話を楽しむ", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "初対面の人と会うとき、どう感じる？",
    optionA: { label: "新しい出会いにワクワクする", scoreValue: "E" },
    optionB: { label: "少し緊張するが、慣れれば大丈夫", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "友人関係について、あなたは？",
    optionA: { label: "広い交友関係を持っている", scoreValue: "E" },
    optionB: { label: "少数の親しい友人を大切にする", scoreValue: "I" },
  },
  // コミュニケーション（4問）
  {
    axis: "EI",
    questionText: "考えをまとめるとき、どうする？",
    optionA: { label: "人に話しながら整理する", scoreValue: "E" },
    optionB: { label: "一人で考えてから話す", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "会議やディスカッションでは？",
    optionA: { label: "積極的に発言する", scoreValue: "E" },
    optionB: { label: "よく考えてから発言する", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "電話とメール、どちらが好き？",
    optionA: { label: "電話で直接話す方が好き", scoreValue: "E" },
    optionB: { label: "メールやテキストの方が好き", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "プレゼンテーションをするとき、どう感じる？",
    optionA: { label: "人前で話すのは得意", scoreValue: "E" },
    optionB: { label: "準備は好きだが、発表は緊張する", scoreValue: "I" },
  },
  // 休息方法（3問）
  {
    axis: "EI",
    questionText: "一日の終わりに？",
    optionA: { label: "誰かと一日を振り返りたい", scoreValue: "E" },
    optionB: { label: "静かに一人で過ごしたい", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "仕事や勉強の合間の休憩は？",
    optionA: { label: "同僚や友人と雑談する", scoreValue: "E" },
    optionB: { label: "一人で静かに過ごす", scoreValue: "I" },
  },
  {
    axis: "EI",
    questionText: "旅行するなら？",
    optionA: { label: "グループツアーや友人との旅行", scoreValue: "E" },
    optionB: { label: "一人旅や少人数での旅行", scoreValue: "I" },
  },

  // ===== S/N軸（感覚/直感）15問 =====
  // 情報収集（4問）
  {
    axis: "SN",
    questionText: "何かを学ぶとき、あなたは？",
    optionA: { label: "具体的な例や実践を通じて理解する", scoreValue: "S" },
    optionB: { label: "全体像や理論から入って理解する", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "説明を聞くとき、どちらを好む？",
    optionA: { label: "具体的な手順や詳細", scoreValue: "S" },
    optionB: { label: "概念や背景にある考え方", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "本を読むとき、どちらが好き？",
    optionA: { label: "事実に基づいたノンフィクション", scoreValue: "S" },
    optionB: { label: "想像力を刺激するフィクション", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "新しいことを始めるとき、重視するのは？",
    optionA: { label: "実績や成功事例", scoreValue: "S" },
    optionB: { label: "革新性や将来の可能性", scoreValue: "N" },
  },
  // 注意の焦点（4問）
  {
    axis: "SN",
    questionText: "新製品を見たとき、最初に気になるのは？",
    optionA: { label: "機能や仕様などの詳細情報", scoreValue: "S" },
    optionB: { label: "これで何ができるかの可能性", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "日常生活で注目するのは？",
    optionA: { label: "目の前の具体的な事実や出来事", scoreValue: "S" },
    optionB: { label: "パターンや意味、つながり", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "会話で興味を持つのは？",
    optionA: { label: "実際に起きた出来事や経験談", scoreValue: "S" },
    optionB: { label: "アイデアや可能性についての話", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "仕事で重視するのは？",
    optionA: { label: "確実に成果を出せる方法", scoreValue: "S" },
    optionB: { label: "新しいアプローチや改善の可能性", scoreValue: "N" },
  },
  // 学習スタイル（4問）
  {
    axis: "SN",
    questionText: "マニュアルや説明書を読むとき？",
    optionA: { label: "最初から順番に読む", scoreValue: "S" },
    optionB: { label: "必要な部分だけ拾い読みする", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "新しいスキルを習得するとき？",
    optionA: { label: "基本を一つずつ確実に身につける", scoreValue: "S" },
    optionB: { label: "全体像を把握してから細部に入る", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "問題の説明を聞くとき、どう感じる？",
    optionA: { label: "詳細な説明があると安心する", scoreValue: "S" },
    optionB: { label: "要点だけ聞いて後は自分で考えたい", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "試験勉強をするなら？",
    optionA: { label: "教科書を丁寧に読み込む", scoreValue: "S" },
    optionB: { label: "要点をまとめて全体を把握する", scoreValue: "N" },
  },
  // 問題解決（3問）
  {
    axis: "SN",
    questionText: "問題に直面したとき、まず考えるのは？",
    optionA: { label: "過去の経験や実績のある方法", scoreValue: "S" },
    optionB: { label: "新しい解決策や創造的なアプローチ", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "プロジェクトを計画するとき？",
    optionA: { label: "詳細なステップを一つずつ決める", scoreValue: "S" },
    optionB: { label: "大きなビジョンを描いてから詳細へ", scoreValue: "N" },
  },
  {
    axis: "SN",
    questionText: "将来について考えるとき？",
    optionA: { label: "現実的で達成可能な目標を設定", scoreValue: "S" },
    optionB: { label: "大きな夢や理想を描く", scoreValue: "N" },
  },

  // ===== T/F軸（思考/感情）15問 =====
  // 意思決定（4問）
  {
    axis: "TF",
    questionText: "重要な決断をするとき、より重視するのは？",
    optionA: { label: "論理的な分析と客観的な事実", scoreValue: "T" },
    optionB: { label: "関係者の気持ちと影響", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "何かを選ぶとき、基準にするのは？",
    optionA: { label: "合理的なメリット・デメリット", scoreValue: "T" },
    optionB: { label: "自分や周りの人の気持ち", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "難しい選択を迫られたとき？",
    optionA: { label: "頭で考えて最善の答えを出す", scoreValue: "T" },
    optionB: { label: "心の声に従って決める", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "ビジネスの判断において重視するのは？",
    optionA: { label: "数字やデータに基づく分析", scoreValue: "T" },
    optionB: { label: "チームや顧客の気持ち", scoreValue: "F" },
  },
  // 価値観（4問）
  {
    axis: "TF",
    questionText: "議論において大切にするのは？",
    optionA: { label: "論理の正しさと一貫性", scoreValue: "T" },
    optionB: { label: "相手の立場や気持ちへの配慮", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "真実と優しさ、どちらを優先する？",
    optionA: { label: "たとえ厳しくても真実を伝える", scoreValue: "T" },
    optionB: { label: "相手を傷つけないよう配慮する", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "公平さについて、あなたの考えは？",
    optionA: { label: "ルールを平等に適用すべき", scoreValue: "T" },
    optionB: { label: "状況や個人の事情を考慮すべき", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "成功の基準として重視するのは？",
    optionA: { label: "客観的な成果や実績", scoreValue: "T" },
    optionB: { label: "周りの人との良好な関係", scoreValue: "F" },
  },
  // 対人関係（4問）
  {
    axis: "TF",
    questionText: "友人が仕事で失敗したとき、あなたは？",
    optionA: { label: "何が問題だったか分析して助言する", scoreValue: "T" },
    optionB: { label: "まず気持ちに寄り添って励ます", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "誰かと意見が対立したとき？",
    optionA: { label: "論理的に自分の意見を説明する", scoreValue: "T" },
    optionB: { label: "相手の気持ちを理解しようとする", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "チームメンバーのミスに対して？",
    optionA: { label: "原因を分析して再発防止策を考える", scoreValue: "T" },
    optionB: { label: "励まして次に向けたサポートをする", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "人間関係で重視するのは？",
    optionA: { label: "相互の尊重と公平さ", scoreValue: "T" },
    optionB: { label: "感情的なつながりと温かさ", scoreValue: "F" },
  },
  // フィードバック（3問）
  {
    axis: "TF",
    questionText: "フィードバックを受けるとき？",
    optionA: { label: "率直で具体的な改善点を聞きたい", scoreValue: "T" },
    optionB: { label: "ポジティブな点も含めて伝えてほしい", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "人を評価するとき、基準にするのは？",
    optionA: { label: "能力や実績", scoreValue: "T" },
    optionB: { label: "努力や人柄", scoreValue: "F" },
  },
  {
    axis: "TF",
    questionText: "批判を受けたとき、どう感じる？",
    optionA: { label: "改善のための情報として受け止める", scoreValue: "T" },
    optionB: { label: "言い方や意図によっては傷つく", scoreValue: "F" },
  },

  // ===== J/P軸（判断/知覚）15問 =====
  // 計画性（4問）
  {
    axis: "JP",
    questionText: "旅行の計画を立てるとき、あなたは？",
    optionA: { label: "事前に詳細なスケジュールを立てる", scoreValue: "J" },
    optionB: { label: "大まかな方向性だけ決めて柔軟に動く", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "週末の予定は？",
    optionA: { label: "あらかじめ決めておく方が好き", scoreValue: "J" },
    optionB: { label: "その時の気分で決める方が好き", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "プロジェクトに取り組むとき？",
    optionA: { label: "最初に全体計画を立てる", scoreValue: "J" },
    optionB: { label: "進めながら調整していく", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "買い物をするとき？",
    optionA: { label: "事前にリストを作って行く", scoreValue: "J" },
    optionB: { label: "店で見ながら決める", scoreValue: "P" },
  },
  // 時間管理（4問）
  {
    axis: "JP",
    questionText: "締め切りのある作業に取り組むとき？",
    optionA: { label: "計画的に進めて余裕を持って完了させる", scoreValue: "J" },
    optionB: { label: "締め切り近くで集中力が高まる", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "約束の時間について？",
    optionA: { label: "時間厳守を心がけている", scoreValue: "J" },
    optionB: { label: "多少の遅れは気にしない", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "一日のスケジュールは？",
    optionA: { label: "予定通りに進めたい", scoreValue: "J" },
    optionB: { label: "状況に応じて変更しても良い", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "朝の準備は？",
    optionA: { label: "決まったルーティンがある", scoreValue: "J" },
    optionB: { label: "その日の気分で変わる", scoreValue: "P" },
  },
  // 仕事スタイル（4問）
  {
    axis: "JP",
    questionText: "複数のタスクがあるとき？",
    optionA: { label: "優先順位をつけて一つずつ完了させる", scoreValue: "J" },
    optionB: { label: "興味のあるものから手をつける", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "作業環境について？",
    optionA: { label: "整理整頓されていると落ち着く", scoreValue: "J" },
    optionB: { label: "多少散らかっていても気にならない", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "決断を求められたとき？",
    optionA: { label: "早めに決めて進めたい", scoreValue: "J" },
    optionB: { label: "情報を集めてから決めたい", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "予定外の出来事が起きたとき？",
    optionA: { label: "計画の変更にストレスを感じる", scoreValue: "J" },
    optionB: { label: "柔軟に対応できる", scoreValue: "P" },
  },
  // 生活習慣（3問）
  {
    axis: "JP",
    questionText: "日常生活で好むのは？",
    optionA: { label: "規則正しい生活リズム", scoreValue: "J" },
    optionB: { label: "自由で変化のある生活", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "新しい情報やチャンスに対して？",
    optionA: { label: "慎重に検討してから行動", scoreValue: "J" },
    optionB: { label: "まずやってみて考える", scoreValue: "P" },
  },
  {
    axis: "JP",
    questionText: "仕事や勉強のやり方は？",
    optionA: { label: "決まった方法で進める方が効率的", scoreValue: "J" },
    optionB: { label: "その時の状況に合わせて変える", scoreValue: "P" },
  },
];

// 16タイプの結果定義
const MBTI_RESULT_TYPES: Record<
  string,
  {
    nickname: string;
    summary: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  }
> = {
  ISTJ: {
    nickname: "管理者",
    summary: "誠実で責任感が強く、伝統と秩序を重んじる",
    description:
      "あなたは責任感が強く、約束を守ることを大切にするタイプです。物事を計画的に進め、細部まで注意を払います。信頼性が高く、周囲から頼りにされる存在です。",
    strengths: [
      "責任感が強い",
      "計画的で組織的",
      "細部への注意力",
      "信頼性が高い",
      "忍耐強い",
    ],
    weaknesses: [
      "変化への適応が苦手",
      "柔軟性に欠けることがある",
      "感情表現が控えめ",
    ],
    recommendations: [
      "時には計画外の行動も楽しんでみる",
      "感情を言葉にする練習をする",
      "新しいアイデアにオープンになる",
    ],
  },
  ISFJ: {
    nickname: "擁護者",
    summary: "献身的で思いやりがあり、周囲をサポートする",
    description:
      "あなたは思いやりがあり、周囲の人々のニーズに敏感なタイプです。控えめながらも献身的にサポートし、人間関係を大切にします。信頼できる存在として多くの人に頼られます。",
    strengths: [
      "思いやりがある",
      "献身的",
      "観察力が鋭い",
      "忍耐強い",
      "信頼できる",
    ],
    weaknesses: [
      "自分のニーズを後回しにしがち",
      "変化を嫌う傾向",
      "批判に敏感",
    ],
    recommendations: [
      "自分自身のケアも忘れずに",
      "「ノー」と言うことも大切",
      "新しい経験にチャレンジする",
    ],
  },
  INFJ: {
    nickname: "提唱者",
    summary: "洞察力が深く、理想主義的で神秘的な雰囲気を持つ",
    description:
      "あなたは深い洞察力を持ち、人や状況の本質を見抜く力があります。理想主義的で、より良い世界の実現に貢献したいという強い思いを持っています。",
    strengths: [
      "洞察力が深い",
      "創造的",
      "献身的",
      "決断力がある",
      "有意義な関係を築く",
    ],
    weaknesses: [
      "完璧主義になりがち",
      "燃え尽きやすい",
      "批判に敏感",
    ],
    recommendations: [
      "完璧を求めすぎない",
      "自分の限界を認識する",
      "実用的な面も大切にする",
    ],
  },
  INTJ: {
    nickname: "建築家",
    summary: "戦略的で独立心が強く、高い目標を追求する",
    description:
      "あなたは戦略的思考に優れ、長期的なビジョンを持って行動するタイプです。独立心が強く、高い基準を自分に課します。複雑な問題を解決する能力に長けています。",
    strengths: [
      "戦略的思考",
      "独立心が強い",
      "決断力がある",
      "知識欲旺盛",
      "高い基準を持つ",
    ],
    weaknesses: [
      "感情面で鈍感に見えることがある",
      "完璧主義",
      "批判的になりすぎることがある",
    ],
    recommendations: [
      "感情面にも注意を払う",
      "他者の意見にも耳を傾ける",
      "柔軟性を持つ",
    ],
  },
  ISTP: {
    nickname: "巨匠",
    summary: "実践的で分析力があり、問題解決に優れる",
    description:
      "あなたは手先が器用で、物事の仕組みを理解する能力に長けています。冷静で論理的、問題が起きたときに素早く対処できる実践的なタイプです。",
    strengths: [
      "問題解決能力が高い",
      "冷静沈着",
      "実践的",
      "柔軟性がある",
      "効率重視",
    ],
    weaknesses: [
      "感情表現が苦手",
      "長期的コミットメントを避ける傾向",
      "リスクを取りすぎることがある",
    ],
    recommendations: [
      "感情を言葉にする練習を",
      "長期的な目標も意識する",
      "他者との協力を大切にする",
    ],
  },
  ISFP: {
    nickname: "冒険家",
    summary: "芸術的で感受性豊か、自分の価値観を大切にする",
    description:
      "あなたは感受性が豊かで、美しいものや調和を大切にするタイプです。自分の価値観に従って行動し、他者を尊重します。穏やかで優しい雰囲気を持っています。",
    strengths: [
      "芸術的センス",
      "共感力が高い",
      "柔軟性がある",
      "現在を楽しむ",
      "他者を尊重する",
    ],
    weaknesses: [
      "計画を立てるのが苦手",
      "批判に敏感",
      "自己主張が控えめ",
    ],
    recommendations: [
      "長期的な目標を設定してみる",
      "自分の意見を積極的に伝える",
      "ストレス管理を意識する",
    ],
  },
  INFP: {
    nickname: "仲介者",
    summary: "理想主義的で共感力があり、深い価値観を持つ",
    description:
      "あなたは理想主義的で、自分の価値観や信念を大切にするタイプです。共感力が高く、他者の感情を深く理解できます。創造的で、意味のある人生を追求します。",
    strengths: [
      "共感力が高い",
      "創造的",
      "献身的",
      "理想を追求する",
      "誠実",
    ],
    weaknesses: [
      "現実離れしやすい",
      "批判に敏感",
      "決断が遅くなりがち",
    ],
    recommendations: [
      "現実的な目標も設定する",
      "批判を成長の機会と捉える",
      "行動に移す勇気を持つ",
    ],
  },
  INTP: {
    nickname: "論理学者",
    summary: "分析的で独創的、知識への探求心が強い",
    description:
      "あなたは分析的思考に優れ、複雑な理論や概念を理解する能力が高いタイプです。好奇心旺盛で、知識を深めることに喜びを感じます。独創的なアイデアを生み出します。",
    strengths: [
      "分析力が高い",
      "独創的",
      "客観的",
      "知識欲旺盛",
      "問題解決能力",
    ],
    weaknesses: [
      "実行力に欠けることがある",
      "感情面が苦手",
      "細かいことに気を取られる",
    ],
    recommendations: [
      "アイデアを行動に移す",
      "感情面にも注意を払う",
      "他者とのコミュニケーションを大切に",
    ],
  },
  ESTP: {
    nickname: "起業家",
    summary: "行動力があり、リスクを恐れず挑戦する",
    description:
      "あなたは行動力があり、その場の状況に素早く対応できるタイプです。リスクを恐れず新しいことに挑戦し、スリルを楽しみます。実践的で結果重視の姿勢を持っています。",
    strengths: [
      "行動力がある",
      "適応力が高い",
      "問題解決が得意",
      "社交的",
      "現実的",
    ],
    weaknesses: [
      "計画性に欠けることがある",
      "長期的な視点が弱い",
      "感情面に鈍感",
    ],
    recommendations: [
      "長期的な目標を意識する",
      "他者の感情にも配慮する",
      "結果だけでなくプロセスも大切に",
    ],
  },
  ESFP: {
    nickname: "エンターテイナー",
    summary: "社交的で楽観的、今この瞬間を楽しむ",
    description:
      "あなたは社交的で、周囲を楽しませる才能があるタイプです。今この瞬間を大切にし、人生を楽しむことを重視します。人懐っこく、多くの人から好かれます。",
    strengths: [
      "社交的",
      "楽観的",
      "柔軟性がある",
      "実践的",
      "人を楽しませる",
    ],
    weaknesses: [
      "計画を立てるのが苦手",
      "批判に敏感",
      "長期的な視点が弱い",
    ],
    recommendations: [
      "将来の計画も立ててみる",
      "批判を成長の機会と捉える",
      "重要な決断は慎重に",
    ],
  },
  ENFP: {
    nickname: "広報運動家",
    summary: "熱意があり創造的、可能性を追求する",
    description:
      "あなたは熱意にあふれ、新しいアイデアや可能性に目を輝かせるタイプです。創造的で、人々を鼓舞する力があります。自由を大切にし、型にはまることを嫌います。",
    strengths: [
      "創造的",
      "熱意がある",
      "共感力が高い",
      "柔軟性がある",
      "コミュニケーション能力",
    ],
    weaknesses: [
      "集中力が続かないことがある",
      "計画の実行が苦手",
      "感情的になりやすい",
    ],
    recommendations: [
      "一つのことに集中する練習を",
      "計画を最後まで実行する",
      "感情をコントロールする",
    ],
  },
  ENTP: {
    nickname: "討論者",
    summary: "知的で議論好き、革新的なアイデアを生み出す",
    description:
      "あなたは知的好奇心が旺盛で、議論を通じて考えを深めることを楽しむタイプです。革新的なアイデアを生み出す能力に優れ、既存の枠にとらわれない発想ができます。",
    strengths: [
      "革新的",
      "知的好奇心旺盛",
      "議論が得意",
      "適応力が高い",
      "問題解決能力",
    ],
    weaknesses: [
      "議論で相手を傷つけることがある",
      "継続性に欠ける",
      "ルーティンが苦手",
    ],
    recommendations: [
      "相手の感情にも配慮する",
      "最後までやり遂げる練習を",
      "安定性も大切にする",
    ],
  },
  ESTJ: {
    nickname: "幹部",
    summary: "組織力があり、リーダーシップを発揮する",
    description:
      "あなたは組織をまとめる能力に優れ、効率的に物事を進めることが得意なタイプです。責任感が強く、ルールや秩序を重視します。決断力があり、リーダーシップを発揮します。",
    strengths: [
      "組織力がある",
      "決断力がある",
      "責任感が強い",
      "効率重視",
      "リーダーシップ",
    ],
    weaknesses: [
      "柔軟性に欠けることがある",
      "他者の感情に鈍感",
      "支配的に見えることがある",
    ],
    recommendations: [
      "他者の意見にも耳を傾ける",
      "感情面にも配慮する",
      "柔軟性を意識する",
    ],
  },
  ESFJ: {
    nickname: "領事",
    summary: "世話好きで協調性があり、人間関係を大切にする",
    description:
      "あなたは人の世話をすることが好きで、周囲との調和を大切にするタイプです。社交的で、人間関係を築くことに長けています。周囲のニーズに敏感で、サポート上手です。",
    strengths: [
      "思いやりがある",
      "協調性が高い",
      "信頼できる",
      "社交的",
      "実践的",
    ],
    weaknesses: [
      "批判に敏感",
      "他者の期待に応えようとしすぎる",
      "変化を嫌う傾向",
    ],
    recommendations: [
      "自分自身のニーズも大切にする",
      "批判を建設的に受け止める",
      "変化を受け入れる練習を",
    ],
  },
  ENFJ: {
    nickname: "主人公",
    summary: "カリスマ性があり、人を導く力を持つ",
    description:
      "あなたはカリスマ性があり、人々を鼓舞し導く力を持つタイプです。他者の成長を支援することに喜びを感じ、共感力が高いです。理想を追求し、ポジティブな影響を与えます。",
    strengths: [
      "カリスマ性がある",
      "共感力が高い",
      "リーダーシップ",
      "コミュニケーション能力",
      "献身的",
    ],
    weaknesses: [
      "他者に尽くしすぎる",
      "批判に敏感",
      "自分のニーズを後回しにしがち",
    ],
    recommendations: [
      "自分自身のケアも忘れずに",
      "完璧を求めすぎない",
      "「ノー」と言うことも大切",
    ],
  },
  ENTJ: {
    nickname: "指揮官",
    summary: "決断力があり、目標達成に向けて邁進する",
    description:
      "あなたは決断力があり、目標に向かって効率的に進むことが得意なタイプです。戦略的思考に優れ、チームを率いる能力があります。野心的で、高い目標を達成します。",
    strengths: [
      "決断力がある",
      "戦略的思考",
      "リーダーシップ",
      "効率重視",
      "自信がある",
    ],
    weaknesses: [
      "支配的に見えることがある",
      "感情面に鈍感",
      "忍耐力に欠けることがある",
    ],
    recommendations: [
      "他者の感情にも配慮する",
      "協調性を意識する",
      "プロセスも大切にする",
    ],
  },
};

// 質問を軸混在形式で配置する関数
function getOrderedQuestions(): Array<{
  order: number;
  questionText: string;
  options: Array<{ value: string; label: string; scoreValue: string }>;
}> {
  const eiQuestions = MBTI_QUESTIONS.filter((q) => q.axis === "EI");
  const snQuestions = MBTI_QUESTIONS.filter((q) => q.axis === "SN");
  const tfQuestions = MBTI_QUESTIONS.filter((q) => q.axis === "TF");
  const jpQuestions = MBTI_QUESTIONS.filter((q) => q.axis === "JP");

  const result: Array<{
    order: number;
    questionText: string;
    options: Array<{ value: string; label: string; scoreValue: string }>;
  }> = [];

  // 15ラウンド × 4軸 = 60問
  for (let round = 0; round < 15; round++) {
    const axes = [eiQuestions, snQuestions, tfQuestions, jpQuestions];
    for (const axisQuestions of axes) {
      const q = axisQuestions[round];
      result.push({
        order: result.length + 1,
        questionText: q.questionText,
        options: [
          { value: "A", label: q.optionA.label, scoreValue: q.optionA.scoreValue },
          { value: "B", label: q.optionB.label, scoreValue: q.optionB.scoreValue },
        ],
      });
    }
  }

  return result;
}

// シードMutation
export const seedMbtiTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存のテストがあるか確認
    const existingTest = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "mbti"))
      .unique();

    if (existingTest) {
      return {
        message: "MBTI診断は既に存在します",
        testId: existingTest._id,
      };
    }

    // テスト定義を作成
    const testId = await ctx.db.insert("tests", {
      ...MBTI_TEST,
      resultTypes: MBTI_RESULT_TYPES,
      createdAt: Date.now(),
    });

    // 質問を作成
    const orderedQuestions = getOrderedQuestions();
    for (const question of orderedQuestions) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: question.order,
        questionText: question.questionText,
        questionType: "multiple",
        options: question.options,
      });
    }

    return {
      message: "MBTI診断を作成しました",
      testId,
      questionCount: orderedQuestions.length,
    };
  },
});

// リセットMutation（開発用）
export const resetMbtiTest = mutation({
  args: {},
  handler: async (ctx) => {
    // テストを取得
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "mbti"))
      .unique();

    if (!test) {
      return { message: "MBTI診断が見つかりません" };
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
      message: "MBTI診断をリセットしました",
      deletedQuestions: questions.length,
    };
  },
});
