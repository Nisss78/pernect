import { mutation } from "./_generated/server";

// 強み診断テスト定義
const STRENGTHS_TEST = {
  slug: "strengths",
  title: "強み診断",
  description:
    "34の強みテーマからあなたのTop 5を発見。CliftonStrengthsをベースにした診断で、自分らしい強みを見つけましょう。",
  category: "strength",
  questionCount: 68,
  estimatedMinutes: 20,
  scoringType: "single" as const,
  icon: "star",
  gradientStart: "#f59e0b", // Amber
  gradientEnd: "#ef4444", // Red
  isActive: true,
  citation: {
    authors: ["Don Clifton", "Gallup"],
    title: "CliftonStrengths (StrengthsFinder)",
    year: 2001,
    url: "https://www.gallup.com/cliftonstrengths",
  },
};

// 34テーマの結果定義
const STRENGTHS_RESULT_TYPES: Record<
  string,
  {
    nameJa: string;
    domain: "executing" | "influencing" | "relationship" | "thinking";
    domainJa: string;
    summary: string;
    description: string;
    strengths: string[];
    howToUse: string[];
  }
> = {
  // ===== 実行力（Executing）- 9テーマ =====
  Achiever: {
    nameJa: "達成欲",
    domain: "executing",
    domainJa: "実行力",
    summary: "毎日何かを成し遂げないと気が済まない",
    description:
      "あなたは生産的であることに強い欲求を持っています。一日の終わりに何かを達成していないと落ち着かず、常に次の目標に向かって進んでいます。この内なる炎があなたを動かし続けます。",
    strengths: ["継続的な生産性", "強い労働意欲", "目標達成への執着"],
    howToUse: [
      "毎日の小さな目標を設定し、達成感を味わう",
      "長期目標をマイルストーンに分割する",
      "達成したことを記録して振り返る",
    ],
  },
  Arranger: {
    nameJa: "アレンジ",
    domain: "executing",
    domainJa: "実行力",
    summary: "複雑な状況を最適に整理できる",
    description:
      "あなたは多くの要素を同時に扱い、最も生産的な組み合わせを見つけ出すことができます。柔軟性があり、状況が変わっても素早く対応して最適な配置を見つけます。",
    strengths: ["柔軟な対応力", "効率的な資源配分", "複雑さの管理"],
    howToUse: [
      "チームやプロジェクトの調整役を担う",
      "変化の多い環境で力を発揮する",
      "複数のタスクを同時進行で管理する",
    ],
  },
  Belief: {
    nameJa: "信念",
    domain: "executing",
    domainJa: "実行力",
    summary: "揺るがない核心的な価値観を持つ",
    description:
      "あなたには確固たる信念があり、それが行動の指針となっています。価値観に沿った仕事をすることで、意味と満足感を得られます。信念は安定性と一貫性をもたらします。",
    strengths: ["一貫した行動", "強い倫理観", "意味のある仕事への集中"],
    howToUse: [
      "自分の価値観に合った仕事を選ぶ",
      "組織のミッションと自分の信念を結びつける",
      "価値観を明確にして意思決定に活かす",
    ],
  },
  Consistency: {
    nameJa: "公平性",
    domain: "executing",
    domainJa: "実行力",
    summary: "すべての人を公平に扱うことを重視する",
    description:
      "あなたは公平さと一貫性を非常に大切にします。ルールを守り、すべての人が同じ基準で扱われるべきだと考えます。この姿勢がチームに信頼と安定をもたらします。",
    strengths: ["公正な判断", "ルールの遵守", "安定した環境の構築"],
    howToUse: [
      "標準化されたプロセスを構築する",
      "チームの公平性を守る役割を担う",
      "透明性のあるルールを設定する",
    ],
  },
  Deliberative: {
    nameJa: "慎重さ",
    domain: "executing",
    domainJa: "実行力",
    summary: "決定を下す前に慎重に検討する",
    description:
      "あなたは行動する前によく考え、リスクを予測します。この慎重さは軽率な決定を防ぎ、確実な結果をもたらします。準備と計画を大切にします。",
    strengths: ["リスク管理", "慎重な意思決定", "確実な実行"],
    howToUse: [
      "重要な決定の前にリスク分析を行う",
      "チームのリスク管理役を担う",
      "計画立案のプロセスに参加する",
    ],
  },
  Discipline: {
    nameJa: "規律性",
    domain: "executing",
    domainJa: "実行力",
    summary: "秩序と構造を作り出すことを好む",
    description:
      "あなたは構造化された環境で最も力を発揮します。ルーティンと計画を好み、予測可能な秩序を作り出します。この規律がプロジェクトを確実に完了させます。",
    strengths: ["計画的な実行", "時間管理", "整理整頓"],
    howToUse: [
      "詳細なスケジュールと計画を立てる",
      "ルーティンを確立して効率を上げる",
      "整理されたシステムを構築する",
    ],
  },
  Focus: {
    nameJa: "目標志向",
    domain: "executing",
    domainJa: "実行力",
    summary: "明確な目標に向かって進むことができる",
    description:
      "あなたは目標を設定し、それに向かって一直線に進むことができます。優先順位を明確にし、脱線せずに集中を維持します。この集中力が成果を生み出します。",
    strengths: ["優先順位付け", "集中力", "効率的な時間配分"],
    howToUse: [
      "明確な目標を設定して共有する",
      "重要でないタスクを排除する",
      "定期的に進捗を確認して軌道修正する",
    ],
  },
  Responsibility: {
    nameJa: "責任感",
    domain: "executing",
    domainJa: "実行力",
    summary: "約束したことは必ずやり遂げる",
    description:
      "あなたは約束に対して強い責任感を持っています。引き受けたことは最後までやり遂げ、言い訳をしません。この信頼性が周囲からの尊敬を集めます。",
    strengths: ["信頼性", "コミットメント", "誠実さ"],
    howToUse: [
      "重要なプロジェクトを引き受ける",
      "約束は慎重にし、必ず守る",
      "チームの信頼できるメンバーとして活躍する",
    ],
  },
  Restorative: {
    nameJa: "回復志向",
    domain: "executing",
    domainJa: "実行力",
    summary: "問題を見つけて解決することが得意",
    description:
      "あなたは問題解決に強い関心があります。壊れたものを直し、課題を解決することに満足感を覚えます。困難な状況でも諦めずに解決策を見つけます。",
    strengths: ["問題解決力", "粘り強さ", "改善への意欲"],
    howToUse: [
      "トラブルシューティングの役割を担う",
      "改善が必要なプロセスを特定する",
      "困難なプロジェクトに挑戦する",
    ],
  },

  // ===== 影響力（Influencing）- 8テーマ =====
  Activator: {
    nameJa: "活発性",
    domain: "influencing",
    domainJa: "影響力",
    summary: "アイデアを行動に移すことができる",
    description:
      "あなたは行動を起こすことで物事を動かします。「いつ始めるか？」が口癖で、計画段階で立ち止まることを好みません。このエネルギーが周囲を活性化します。",
    strengths: ["行動力", "スピード感", "触媒的な影響力"],
    howToUse: [
      "プロジェクトのキックオフ役を担う",
      "停滞しているチームに活力を与える",
      "アイデアを素早く実験に移す",
    ],
  },
  Command: {
    nameJa: "指令性",
    domain: "influencing",
    domainJa: "影響力",
    summary: "状況をコントロールし、決断を下せる",
    description:
      "あなたは存在感があり、状況をコントロールすることができます。対立を恐れず、必要な決断を下します。危機的状況でリーダーシップを発揮します。",
    strengths: ["リーダーシップ", "決断力", "対立への対処"],
    howToUse: [
      "危機的状況でリーダーシップを発揮する",
      "困難な決断が必要な場面で力を発揮する",
      "チームを明確な方向に導く",
    ],
  },
  Communication: {
    nameJa: "コミュニケーション",
    domain: "influencing",
    domainJa: "影響力",
    summary: "考えを言葉で表現することが得意",
    description:
      "あなたは言葉の力を知っています。アイデアを魅力的なストーリーに変え、人々の心を動かすことができます。プレゼンテーションや説明が得意です。",
    strengths: ["表現力", "ストーリーテリング", "聴衆を惹きつける力"],
    howToUse: [
      "プレゼンテーションやスピーチを担当する",
      "複雑な情報をわかりやすく伝える",
      "チームのビジョンを言葉で表現する",
    ],
  },
  Competition: {
    nameJa: "競争性",
    domain: "influencing",
    domainJa: "影響力",
    summary: "他者との比較で自分の位置を確認する",
    description:
      "あなたは競争を通じて成長します。勝つことへの強い欲求があり、比較の中で自分の価値を測ります。この競争心がパフォーマンスを高めます。",
    strengths: ["向上心", "結果へのこだわり", "ベンチマーキング"],
    howToUse: [
      "明確な競争相手や基準を設定する",
      "ランキングや比較が可能な環境で力を発揮する",
      "チームの競争力を高める役割を担う",
    ],
  },
  Maximizer: {
    nameJa: "最上志向",
    domain: "influencing",
    domainJa: "影響力",
    summary: "良いものを最高のものに変えたい",
    description:
      "あなたは卓越性を追求します。平均を良くするより、良いものを最高にすることに関心があります。強みを伸ばすことで、真の優秀さを実現します。",
    strengths: ["卓越性の追求", "強みの発見", "品質へのこだわり"],
    howToUse: [
      "自分と他者の強みを見つけて伸ばす",
      "品質向上プロジェクトをリードする",
      "ベストプラクティスを追求する",
    ],
  },
  SelfAssurance: {
    nameJa: "自己確信",
    domain: "influencing",
    domainJa: "影響力",
    summary: "自分の能力と判断に自信がある",
    description:
      "あなたは自分の能力を信じています。内なる羅針盤があり、自分の判断に確信を持っています。この自信が困難な状況でも前に進む力になります。",
    strengths: ["自信", "独立した判断", "リスクを取る勇気"],
    howToUse: [
      "不確実な状況で意思決定を担う",
      "自分の判断を信じて行動する",
      "周囲に自信を伝播させる",
    ],
  },
  Significance: {
    nameJa: "自我",
    domain: "influencing",
    domainJa: "影響力",
    summary: "重要な人物として認められたい",
    description:
      "あなたは重要な存在として認められることを望んでいます。影響力を持ち、評価されることで力を発揮します。この欲求が大きな成果への原動力になります。",
    strengths: ["野心", "可視性への欲求", "大きな影響を与えたい"],
    howToUse: [
      "大きなプロジェクトで目立つ役割を担う",
      "自分の貢献が認められる環境を選ぶ",
      "意味のある成果を追求する",
    ],
  },
  Woo: {
    nameJa: "社交性",
    domain: "influencing",
    domainJa: "影響力",
    summary: "新しい人と出会い、打ち解けることが好き",
    description:
      "あなたは見知らぬ人と出会い、関係を築くことを楽しみます。人を惹きつける魅力があり、ネットワークを広げることが得意です。Woo = Winning Others Over",
    strengths: ["人を惹きつける力", "ネットワーキング", "初対面での魅力"],
    howToUse: [
      "新規顧客開拓や営業活動に活かす",
      "ネットワーキングイベントで力を発揮する",
      "チームに新しい人を紹介する役割を担う",
    ],
  },

  // ===== 人間関係構築力（Relationship Building）- 9テーマ =====
  Adaptability: {
    nameJa: "適応性",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "変化に柔軟に対応できる",
    description:
      "あなたは「今この瞬間」を生きています。予期せぬ要求にも柔軟に対応し、流れに乗ることができます。変化を恐れず、状況に適応します。",
    strengths: ["柔軟性", "即応性", "現在への集中"],
    howToUse: [
      "変化の多い環境で力を発揮する",
      "緊急対応や危機管理で活躍する",
      "硬直したチームに柔軟性をもたらす",
    ],
  },
  Connectedness: {
    nameJa: "運命思考",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "すべてのものは繋がっていると信じる",
    description:
      "あなたはすべてのものが繋がっていると感じています。偶然はなく、すべての出来事には意味があります。この視点が他者への思いやりと責任感を生みます。",
    strengths: ["大きな視点", "精神的な深さ", "包括的な思考"],
    howToUse: [
      "チームに大きな意味や目的を示す",
      "多様な視点を統合する",
      "対立を超えた共通点を見出す",
    ],
  },
  Developer: {
    nameJa: "成長促進",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "他者の可能性を見出し、育てることができる",
    description:
      "あなたは他者の中に潜在能力を見出します。小さな進歩にも気づき、それを祝福します。人の成長を支援することに大きな喜びを感じます。",
    strengths: ["コーチング", "励まし", "可能性の発見"],
    howToUse: [
      "メンターやコーチの役割を担う",
      "他者の小さな成長を認めて励ます",
      "人材育成プログラムに携わる",
    ],
  },
  Empathy: {
    nameJa: "共感性",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "他者の感情を感じ取ることができる",
    description:
      "あなたは他者の感情を直感的に感じ取ることができます。言葉にならない気持ちを理解し、適切に対応できます。この能力が深い人間関係を築きます。",
    strengths: ["感情の理解", "思いやり", "信頼の構築"],
    howToUse: [
      "チームの感情的なニーズに対応する",
      "顧客の本当のニーズを理解する",
      "対立を調停する",
    ],
  },
  Harmony: {
    nameJa: "調和性",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "対立を避け、合意点を見つけることを好む",
    description:
      "あなたは対立よりも合意を求めます。意見の違いを乗り越え、共通点を見つけることが得意です。このアプローチがチームの結束を高めます。",
    strengths: ["合意形成", "対立の回避", "チームワーク"],
    howToUse: [
      "チームの調整役を担う",
      "対立する意見の共通点を見出す",
      "協力的な環境を作る",
    ],
  },
  Includer: {
    nameJa: "包含",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "すべての人を受け入れ、仲間に入れたい",
    description:
      "あなたは誰も除外されるべきではないと考えます。輪の外にいる人を見つけ、中に入れようとします。多様性を受け入れ、包括的な環境を作ります。",
    strengths: ["包容力", "多様性の尊重", "仲間意識の構築"],
    howToUse: [
      "新しいメンバーを歓迎し、統合する",
      "多様なチームを構築する",
      "疎外されている人に気づき、声をかける",
    ],
  },
  Individualization: {
    nameJa: "個別化",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "一人ひとりの個性を見抜くことができる",
    description:
      "あなたは一人ひとりの違いに魅了されています。各人の強み、スタイル、動機を見抜き、それに合わせて対応できます。この能力が効果的なチーム構築を可能にします。",
    strengths: ["個人の理解", "カスタマイズされた対応", "才能の配置"],
    howToUse: [
      "チームメンバーの強みを活かした配置を提案する",
      "個人に合わせた動機付けを行う",
      "採用や人材配置で力を発揮する",
    ],
  },
  Positivity: {
    nameJa: "ポジティブ",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "熱意を持って人を元気づけることができる",
    description:
      "あなたは楽観的で、熱意を持って周囲を明るくします。ユーモアがあり、困難な状況でも前向きさを失いません。この姿勢が周囲のモチベーションを高めます。",
    strengths: ["楽観性", "熱意", "雰囲気作り"],
    howToUse: [
      "チームの士気を高める役割を担う",
      "困難な時期に前向きな視点を提供する",
      "祝福やお祝いのイベントをリードする",
    ],
  },
  Relator: {
    nameJa: "親密性",
    domain: "relationship",
    domainJa: "人間関係構築力",
    summary: "深い関係を築くことを好む",
    description:
      "あなたは深く、親密な関係を大切にします。多くの人と浅く付き合うより、少数の人と深い絆を築きます。信頼と相互理解に基づく関係を求めます。",
    strengths: ["深い人間関係", "信頼の構築", "本音のコミュニケーション"],
    howToUse: [
      "長期的な関係を構築する",
      "信頼関係を基盤にしたチームワークを発揮する",
      "メンタリングや1対1の関係で力を発揮する",
    ],
  },

  // ===== 戦略的思考力（Strategic Thinking）- 8テーマ =====
  Analytical: {
    nameJa: "分析思考",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "データと証拠に基づいて考える",
    description:
      "あなたは客観的で論理的です。主張にはデータと証拠を求め、パターンや原因を見つけ出します。この分析力が確かな意思決定を支えます。",
    strengths: ["論理的思考", "データ分析", "批判的思考"],
    howToUse: [
      "データ分析や調査の役割を担う",
      "主張の根拠を確認する",
      "意思決定のための情報を整理する",
    ],
  },
  Context: {
    nameJa: "原点思考",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "過去を理解することで現在を理解する",
    description:
      "あなたは過去を振り返ることで、現在をよく理解できます。歴史やバックグラウンドを学び、そこから未来の方向性を見出します。",
    strengths: ["歴史的視点", "パターンの認識", "根本原因の理解"],
    howToUse: [
      "過去の成功と失敗から学ぶ",
      "組織の歴史や文化を理解して活かす",
      "なぜそうなったかの背景を説明する",
    ],
  },
  Futuristic: {
    nameJa: "未来志向",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "未来のビジョンにインスピレーションを受ける",
    description:
      "あなたは未来の可能性に魅了されています。「こうなったらどうだろう」と想像し、その鮮明なビジョンが他者を鼓舞します。未来を描くことで今を導きます。",
    strengths: ["ビジョニング", "インスピレーション", "可能性の探求"],
    howToUse: [
      "長期ビジョンを描いて共有する",
      "変革やイノベーションをリードする",
      "未来の可能性についてチームを鼓舞する",
    ],
  },
  Ideation: {
    nameJa: "着想",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "新しいアイデアに魅了される",
    description:
      "あなたはアイデアに魅了されています。一見関係のない現象の間に繋がりを見出し、新しい視点を生み出します。この創造性が革新をもたらします。",
    strengths: ["創造性", "独創的な視点", "革新的思考"],
    howToUse: [
      "ブレインストーミングやアイデア出しをリードする",
      "既存の問題に新しい視点を提供する",
      "イノベーションプロジェクトに参加する",
    ],
  },
  Input: {
    nameJa: "収集心",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "知識や情報を集めることが好き",
    description:
      "あなたは情報を集めることに強い欲求があります。何でも興味を持ち、集めた情報がいつか役立つと信じています。この知識の蓄積が価値を生みます。",
    strengths: ["情報収集", "好奇心", "知識の蓄積"],
    howToUse: [
      "リサーチや調査の役割を担う",
      "チームの知識ベースを構築する",
      "専門知識を深めて共有する",
    ],
  },
  Intellection: {
    nameJa: "内省",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "深く考えることを好む",
    description:
      "あなたは知的な活動を楽しみます。一人で考える時間が必要で、内省することで洞察を深めます。この思考の深さが質の高い判断を生みます。",
    strengths: ["深い思考", "内省", "哲学的な視点"],
    howToUse: [
      "複雑な問題について深く考える時間を確保する",
      "戦略的な議論や意思決定に貢献する",
      "一人で考える時間を大切にする",
    ],
  },
  Learner: {
    nameJa: "学習欲",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "学ぶこと自体に喜びを感じる",
    description:
      "あなたは学ぶこと自体を楽しみます。結果よりも学習のプロセスに喜びを感じ、常に新しいことを学び続けます。この姿勢が継続的な成長を生みます。",
    strengths: ["継続的な学習", "成長への意欲", "新しいスキルの習得"],
    howToUse: [
      "新しい分野やスキルに挑戦する",
      "研修や学習機会を活用する",
      "学んだことをチームに共有する",
    ],
  },
  Strategic: {
    nameJa: "戦略性",
    domain: "thinking",
    domainJa: "戦略的思考力",
    summary: "目標への最適なルートを見つけることができる",
    description:
      "あなたは複数の選択肢の中から最適なパターンを見つけることができます。「もし〜なら」と考え、障害を予測しながら前進する道を選びます。",
    strengths: ["パターン認識", "代替案の評価", "最適ルートの発見"],
    howToUse: [
      "戦略立案や計画策定に参加する",
      "複雑な状況での意思決定を支援する",
      "チームに複数の選択肢を提示する",
    ],
  },
};

// 68問の質問データ（34テーマ × 2問）
// 同じドメイン内のテーマを比較する形式
const STRENGTHS_QUESTIONS = [
  // ===== Round 1: 実行力ドメイン（1-18問）=====
  // 達成欲 vs アレンジ
  {
    order: 1,
    questionText: "次のうち、どちらがより自分に当てはまりますか？",
    options: [
      {
        value: "A",
        label: "毎日やることリストを作り、すべて完了させると達成感を感じる",
        scoreKey: "Achiever",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "複数のことを同時に調整し、最適な形にまとめるのが得意",
        scoreKey: "Arranger",
        scoreValue: 1,
      },
    ],
  },
  // 信念 vs 公平性
  {
    order: 2,
    questionText: "どちらの姿勢がより自分に近いですか？",
    options: [
      {
        value: "A",
        label: "自分の価値観に合った仕事でないと、やる気が出ない",
        scoreKey: "Belief",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "すべての人が同じルールで公平に扱われるべきだと考える",
        scoreKey: "Consistency",
        scoreValue: 1,
      },
    ],
  },
  // 慎重さ vs 規律性
  {
    order: 3,
    questionText: "仕事の進め方として、どちらがより当てはまりますか？",
    options: [
      {
        value: "A",
        label: "決定を下す前に、リスクを十分に検討したい",
        scoreKey: "Deliberative",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "計画とルーティンに従って、秩序正しく進めたい",
        scoreKey: "Discipline",
        scoreValue: 1,
      },
    ],
  },
  // 目標志向 vs 責任感
  {
    order: 4,
    questionText: "どちらの特徴がより強いですか？",
    options: [
      {
        value: "A",
        label: "明確な目標があると集中できる。脱線するのは苦手",
        scoreKey: "Focus",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "約束したことは何があっても必ずやり遂げる",
        scoreKey: "Responsibility",
        scoreValue: 1,
      },
    ],
  },
  // 回復志向 vs 達成欲
  {
    order: 5,
    questionText: "何に満足感を感じますか？",
    options: [
      {
        value: "A",
        label: "問題を見つけて解決したとき",
        scoreKey: "Restorative",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "一日の終わりに多くのことを成し遂げたとき",
        scoreKey: "Achiever",
        scoreValue: 1,
      },
    ],
  },
  // アレンジ vs 信念
  {
    order: 6,
    questionText: "チームで働くとき、どちらの役割が得意ですか？",
    options: [
      {
        value: "A",
        label: "状況に応じて人や資源を柔軟に配置する",
        scoreKey: "Arranger",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "チームの方向性が自分の信念と合っているか確認する",
        scoreKey: "Belief",
        scoreValue: 1,
      },
    ],
  },
  // 公平性 vs 慎重さ
  {
    order: 7,
    questionText: "意思決定において大切にすることは？",
    options: [
      {
        value: "A",
        label: "すべての人に対して一貫したルールを適用すること",
        scoreKey: "Consistency",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "起こりうるリスクを慎重に評価すること",
        scoreKey: "Deliberative",
        scoreValue: 1,
      },
    ],
  },
  // 規律性 vs 目標志向
  {
    order: 8,
    questionText: "プロジェクトを進めるとき、どちらがより重要ですか？",
    options: [
      {
        value: "A",
        label: "詳細なスケジュールと整理されたプロセス",
        scoreKey: "Discipline",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "明確なゴールと優先順位の設定",
        scoreKey: "Focus",
        scoreValue: 1,
      },
    ],
  },
  // 責任感 vs 回復志向
  {
    order: 9,
    questionText: "困難な状況でどう行動しますか？",
    options: [
      {
        value: "A",
        label: "引き受けた以上、最後まで責任を持ってやり遂げる",
        scoreKey: "Responsibility",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "問題の原因を突き止め、解決策を見つけることに集中する",
        scoreKey: "Restorative",
        scoreValue: 1,
      },
    ],
  },

  // ===== Round 2: 影響力ドメイン（10-17問）=====
  // 活発性 vs 指令性
  {
    order: 10,
    questionText: "チームを動かすとき、どちらのアプローチが得意ですか？",
    options: [
      {
        value: "A",
        label: "「今すぐ始めよう」と行動を促す",
        scoreKey: "Activator",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "明確な指示を出し、決断を下す",
        scoreKey: "Command",
        scoreValue: 1,
      },
    ],
  },
  // コミュニケーション vs 競争性
  {
    order: 11,
    questionText: "どちらの場面でより力を発揮しますか？",
    options: [
      {
        value: "A",
        label: "アイデアを魅力的に伝え、人を説得するとき",
        scoreKey: "Communication",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "他者と競い合い、勝利を目指すとき",
        scoreKey: "Competition",
        scoreValue: 1,
      },
    ],
  },
  // 最上志向 vs 自己確信
  {
    order: 12,
    questionText: "成長について、どちらの考えに近いですか？",
    options: [
      {
        value: "A",
        label: "弱点を克服するより、強みを伸ばしたい",
        scoreKey: "Maximizer",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "自分の判断を信じて、独自の道を進みたい",
        scoreKey: "SelfAssurance",
        scoreValue: 1,
      },
    ],
  },
  // 自我 vs 社交性
  {
    order: 13,
    questionText: "人との関わりで何を大切にしますか？",
    options: [
      {
        value: "A",
        label: "重要な人物として認められ、影響力を持つこと",
        scoreKey: "Significance",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "新しい人と出会い、すぐに打ち解けること",
        scoreKey: "Woo",
        scoreValue: 1,
      },
    ],
  },
  // 活発性 vs コミュニケーション
  {
    order: 14,
    questionText: "プロジェクトにおいて、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "アイデアをすぐに行動に移すこと",
        scoreKey: "Activator",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "ビジョンを言葉で表現し、人を惹きつけること",
        scoreKey: "Communication",
        scoreValue: 1,
      },
    ],
  },
  // 指令性 vs 競争性
  {
    order: 15,
    questionText: "リーダーシップについて、どちらが当てはまりますか？",
    options: [
      {
        value: "A",
        label: "対立を恐れず、必要な決断を下せる",
        scoreKey: "Command",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "競争を通じて、チームのパフォーマンスを高められる",
        scoreKey: "Competition",
        scoreValue: 1,
      },
    ],
  },
  // 最上志向 vs 自我
  {
    order: 16,
    questionText: "仕事のモチベーションについて、どちらが近いですか？",
    options: [
      {
        value: "A",
        label: "良いものを最高のものに磨き上げたい",
        scoreKey: "Maximizer",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "大きな成果を出して認められたい",
        scoreKey: "Significance",
        scoreValue: 1,
      },
    ],
  },
  // 自己確信 vs 社交性
  {
    order: 17,
    questionText: "新しい状況に直面したとき、どうしますか？",
    options: [
      {
        value: "A",
        label: "自分の判断を信じて、自信を持って進む",
        scoreKey: "SelfAssurance",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "まず人と話し、関係を築いてから進む",
        scoreKey: "Woo",
        scoreValue: 1,
      },
    ],
  },

  // ===== Round 3: 人間関係構築力ドメイン（18-26問）=====
  // 適応性 vs 運命思考
  {
    order: 18,
    questionText: "人生の捉え方として、どちらが近いですか？",
    options: [
      {
        value: "A",
        label: "計画通りにいかなくても、流れに乗って柔軟に対応する",
        scoreKey: "Adaptability",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "すべての出来事には意味があり、繋がっている",
        scoreKey: "Connectedness",
        scoreValue: 1,
      },
    ],
  },
  // 成長促進 vs 共感性
  {
    order: 19,
    questionText: "他者との関わりで、どちらを大切にしますか？",
    options: [
      {
        value: "A",
        label: "相手の成長を見守り、小さな進歩を励ます",
        scoreKey: "Developer",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "相手の気持ちを感じ取り、共感する",
        scoreKey: "Empathy",
        scoreValue: 1,
      },
    ],
  },
  // 調和性 vs 包含
  {
    order: 20,
    questionText: "グループの中で、どちらの役割を担いますか？",
    options: [
      {
        value: "A",
        label: "対立を避け、合意点を見つける",
        scoreKey: "Harmony",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "輪の外にいる人を見つけ、仲間に入れる",
        scoreKey: "Includer",
        scoreValue: 1,
      },
    ],
  },
  // 個別化 vs ポジティブ
  {
    order: 21,
    questionText: "チームで働くとき、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "一人ひとりの個性を見抜き、適した役割を見つける",
        scoreKey: "Individualization",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "熱意を持って雰囲気を明るくし、皆を元気づける",
        scoreKey: "Positivity",
        scoreValue: 1,
      },
    ],
  },
  // 親密性 vs 適応性
  {
    order: 22,
    questionText: "人間関係について、どちらが当てはまりますか？",
    options: [
      {
        value: "A",
        label: "少数の人と深い関係を築くことを好む",
        scoreKey: "Relator",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "状況に応じて、柔軟に人と関わることができる",
        scoreKey: "Adaptability",
        scoreValue: 1,
      },
    ],
  },
  // 運命思考 vs 成長促進
  {
    order: 23,
    questionText: "他者を支援するとき、どちらのアプローチを取りますか？",
    options: [
      {
        value: "A",
        label: "大きな視点で、すべてが繋がっていることを伝える",
        scoreKey: "Connectedness",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "相手の可能性を見出し、成長を促す",
        scoreKey: "Developer",
        scoreValue: 1,
      },
    ],
  },
  // 共感性 vs 調和性
  {
    order: 24,
    questionText: "対立が起きたとき、どう対処しますか？",
    options: [
      {
        value: "A",
        label: "それぞれの感情を理解し、寄り添う",
        scoreKey: "Empathy",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "共通点を見つけ、合意に導く",
        scoreKey: "Harmony",
        scoreValue: 1,
      },
    ],
  },
  // 包含 vs 個別化
  {
    order: 25,
    questionText: "多様なメンバーがいるチームで、どう貢献しますか？",
    options: [
      {
        value: "A",
        label: "全員が参加できる環境を作る",
        scoreKey: "Includer",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "一人ひとりに合わせたアプローチを取る",
        scoreKey: "Individualization",
        scoreValue: 1,
      },
    ],
  },
  // ポジティブ vs 親密性
  {
    order: 26,
    questionText: "人との関わりで、何を大切にしますか？",
    options: [
      {
        value: "A",
        label: "楽観的な姿勢で、周囲を明るくすること",
        scoreKey: "Positivity",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "信頼に基づく深い絆を築くこと",
        scoreKey: "Relator",
        scoreValue: 1,
      },
    ],
  },

  // ===== Round 4: 戦略的思考力ドメイン（27-34問）=====
  // 分析思考 vs 原点思考
  {
    order: 27,
    questionText: "問題を理解するとき、どちらのアプローチを取りますか？",
    options: [
      {
        value: "A",
        label: "データや証拠を集めて論理的に分析する",
        scoreKey: "Analytical",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "過去の経緯や背景を調べて理解する",
        scoreKey: "Context",
        scoreValue: 1,
      },
    ],
  },
  // 未来志向 vs 着想
  {
    order: 28,
    questionText: "アイデアについて、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "未来のビジョンを描き、人を鼓舞する",
        scoreKey: "Futuristic",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "一見関係のないことから、新しい繋がりを見出す",
        scoreKey: "Ideation",
        scoreValue: 1,
      },
    ],
  },
  // 収集心 vs 内省
  {
    order: 29,
    questionText: "知的活動において、どちらが楽しいですか？",
    options: [
      {
        value: "A",
        label: "様々な情報や知識を集めること",
        scoreKey: "Input",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "一人で深く考え、内省すること",
        scoreKey: "Intellection",
        scoreValue: 1,
      },
    ],
  },
  // 学習欲 vs 戦略性
  {
    order: 30,
    questionText: "成長について、どちらが当てはまりますか？",
    options: [
      {
        value: "A",
        label: "新しいことを学ぶプロセス自体が楽しい",
        scoreKey: "Learner",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "目標への最適なルートを見つけることが得意",
        scoreKey: "Strategic",
        scoreValue: 1,
      },
    ],
  },
  // 分析思考 vs 未来志向
  {
    order: 31,
    questionText: "計画を立てるとき、どちらを重視しますか？",
    options: [
      {
        value: "A",
        label: "客観的なデータと論理に基づく分析",
        scoreKey: "Analytical",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "実現したい未来のビジョン",
        scoreKey: "Futuristic",
        scoreValue: 1,
      },
    ],
  },
  // 原点思考 vs 着想
  {
    order: 32,
    questionText: "問題解決のとき、どちらのアプローチを取りますか？",
    options: [
      {
        value: "A",
        label: "なぜそうなったか、歴史や経緯を調べる",
        scoreKey: "Context",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "既存の枠にとらわれず、新しいアイデアを出す",
        scoreKey: "Ideation",
        scoreValue: 1,
      },
    ],
  },
  // 収集心 vs 学習欲
  {
    order: 33,
    questionText: "知識について、どちらが近いですか？",
    options: [
      {
        value: "A",
        label: "幅広い情報を集めて蓄積したい",
        scoreKey: "Input",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "新しいスキルや知識を習得するプロセスが好き",
        scoreKey: "Learner",
        scoreValue: 1,
      },
    ],
  },
  // 内省 vs 戦略性
  {
    order: 34,
    questionText: "重要な決断をするとき、どうしますか？",
    options: [
      {
        value: "A",
        label: "一人で深く考える時間を取る",
        scoreKey: "Intellection",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "複数の選択肢を比較して最適なルートを選ぶ",
        scoreKey: "Strategic",
        scoreValue: 1,
      },
    ],
  },

  // ===== Round 5: クロスドメイン比較（35-51問）=====
  // 実行力 vs 影響力
  {
    order: 35,
    questionText: "成果を出すために、どちらが重要だと思いますか？",
    options: [
      {
        value: "A",
        label: "地道な努力と毎日の達成の積み重ね",
        scoreKey: "Achiever",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "周囲を動かし、行動を起こさせる力",
        scoreKey: "Activator",
        scoreValue: 1,
      },
    ],
  },
  // 実行力 vs 人間関係構築力
  {
    order: 36,
    questionText: "チームの成功に貢献するなら？",
    options: [
      {
        value: "A",
        label: "約束を必ず守り、信頼を得る",
        scoreKey: "Responsibility",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "メンバーの成長を支援し、可能性を引き出す",
        scoreKey: "Developer",
        scoreValue: 1,
      },
    ],
  },
  // 実行力 vs 戦略的思考力
  {
    order: 37,
    questionText: "プロジェクトを成功させるには？",
    options: [
      {
        value: "A",
        label: "計画通りに規律正しく実行する",
        scoreKey: "Discipline",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "最適な戦略を見つけて柔軟に進める",
        scoreKey: "Strategic",
        scoreValue: 1,
      },
    ],
  },
  // 影響力 vs 人間関係構築力
  {
    order: 38,
    questionText: "人と関わるとき、どちらを大切にしますか？",
    options: [
      {
        value: "A",
        label: "言葉で人を動かし、ビジョンを伝える",
        scoreKey: "Communication",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "相手の気持ちに共感し、寄り添う",
        scoreKey: "Empathy",
        scoreValue: 1,
      },
    ],
  },
  // 影響力 vs 戦略的思考力
  {
    order: 39,
    questionText: "問題に直面したとき、どうしますか？",
    options: [
      {
        value: "A",
        label: "決断を下し、チームを導く",
        scoreKey: "Command",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "データを分析し、最適解を見つける",
        scoreKey: "Analytical",
        scoreValue: 1,
      },
    ],
  },
  // 人間関係構築力 vs 戦略的思考力
  {
    order: 40,
    questionText: "難しい状況を乗り越えるには？",
    options: [
      {
        value: "A",
        label: "周囲との良好な関係を築き、協力を得る",
        scoreKey: "Relator",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "過去の経験から学び、パターンを見つける",
        scoreKey: "Context",
        scoreValue: 1,
      },
    ],
  },
  // 追加クロスドメイン
  {
    order: 41,
    questionText: "チームに貢献するなら、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "公平なルールを作り、一貫性を保つ",
        scoreKey: "Consistency",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "新しい人を歓迎し、全員を巻き込む",
        scoreKey: "Includer",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 42,
    questionText: "プロジェクトの立ち上げで、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "リスクを慎重に評価してから始める",
        scoreKey: "Deliberative",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "未来のビジョンを描いて皆を鼓舞する",
        scoreKey: "Futuristic",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 43,
    questionText: "変化の多い環境で、どう対応しますか？",
    options: [
      {
        value: "A",
        label: "状況に柔軟に適応し、流れに乗る",
        scoreKey: "Adaptability",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "自分の判断を信じて、自信を持って進む",
        scoreKey: "SelfAssurance",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 44,
    questionText: "チームの問題を解決するなら？",
    options: [
      {
        value: "A",
        label: "問題の原因を突き止め、修復する",
        scoreKey: "Restorative",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "対立を調整し、調和を取り戻す",
        scoreKey: "Harmony",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 45,
    questionText: "目標達成のために、どちらを重視しますか？",
    options: [
      {
        value: "A",
        label: "明確な目標に集中し、優先順位を守る",
        scoreKey: "Focus",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "競争を通じてパフォーマンスを高める",
        scoreKey: "Competition",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 46,
    questionText: "人の育成において、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "一人ひとりの個性を見抜いて適した指導をする",
        scoreKey: "Individualization",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "強みを見つけて、最高のレベルに引き上げる",
        scoreKey: "Maximizer",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 47,
    questionText: "知識を活かすなら、どちらの方法ですか？",
    options: [
      {
        value: "A",
        label: "集めた情報を整理し、必要な時に活用する",
        scoreKey: "Input",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "複数の要素を最適に組み合わせる",
        scoreKey: "Arranger",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 48,
    questionText: "リーダーとして、どちらの強みを発揮しますか？",
    options: [
      {
        value: "A",
        label: "価値観に基づいた一貫した判断",
        scoreKey: "Belief",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "新しい人との関係を素早く築く力",
        scoreKey: "Woo",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 49,
    questionText: "創造的な仕事において、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "新しいアイデアや概念を生み出す",
        scoreKey: "Ideation",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "アイデアを魅力的に表現し、伝える",
        scoreKey: "Communication",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 50,
    questionText: "学びについて、どちらが当てはまりますか？",
    options: [
      {
        value: "A",
        label: "新しいスキルを習得するプロセスが楽しい",
        scoreKey: "Learner",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "大きな意味や繋がりを理解することが大切",
        scoreKey: "Connectedness",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 51,
    questionText: "思考スタイルとして、どちらが近いですか？",
    options: [
      {
        value: "A",
        label: "一人で深く考える時間が必要",
        scoreKey: "Intellection",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "ポジティブに考え、周囲を元気づける",
        scoreKey: "Positivity",
        scoreValue: 1,
      },
    ],
  },

  // ===== Round 6: 追加バランス調整（52-68問）=====
  // 各テーマが十分にカバーされるように追加
  {
    order: 52,
    questionText: "意思決定において大切なことは？",
    options: [
      {
        value: "A",
        label: "重要な人物として認められる決断をする",
        scoreKey: "Significance",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "過去の教訓を活かした決断をする",
        scoreKey: "Context",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 53,
    questionText: "チームワークで発揮する強みは？",
    options: [
      {
        value: "A",
        label: "深い信頼関係を築き、本音で話し合う",
        scoreKey: "Relator",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "すべての人を公平に扱い、一貫性を保つ",
        scoreKey: "Consistency",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 54,
    questionText: "困難な状況を乗り越える方法は？",
    options: [
      {
        value: "A",
        label: "行動を起こし、状況を動かす",
        scoreKey: "Activator",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "論理的に分析し、解決策を見つける",
        scoreKey: "Analytical",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 55,
    questionText: "組織に貢献する方法として、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "リスクを予測し、慎重に判断する",
        scoreKey: "Deliberative",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "メンバーの成長を見守り、励ます",
        scoreKey: "Developer",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 56,
    questionText: "プロジェクトを進めるとき、どちらを重視しますか？",
    options: [
      {
        value: "A",
        label: "計画とスケジュールの厳守",
        scoreKey: "Discipline",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "相手の感情への配慮",
        scoreKey: "Empathy",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 57,
    questionText: "目標を達成するために、何を大切にしますか？",
    options: [
      {
        value: "A",
        label: "約束を守り、最後までやり遂げる",
        scoreKey: "Responsibility",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "複数の選択肢から最適なルートを選ぶ",
        scoreKey: "Strategic",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 58,
    questionText: "変化への対応として、どちらが得意ですか？",
    options: [
      {
        value: "A",
        label: "状況に合わせて柔軟に資源を配置する",
        scoreKey: "Arranger",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "流れに乗って、今この瞬間に集中する",
        scoreKey: "Adaptability",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 59,
    questionText: "影響力を発揮する方法は？",
    options: [
      {
        value: "A",
        label: "明確な指示を出し、決断を下す",
        scoreKey: "Command",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "すべての人を受け入れ、輪に入れる",
        scoreKey: "Includer",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 60,
    questionText: "仕事のモチベーションは何ですか？",
    options: [
      {
        value: "A",
        label: "競争に勝ち、トップを目指す",
        scoreKey: "Competition",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "新しいことを学び続ける",
        scoreKey: "Learner",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 61,
    questionText: "チームにもたらす価値は？",
    options: [
      {
        value: "A",
        label: "楽観的な姿勢で雰囲気を明るくする",
        scoreKey: "Positivity",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "問題を見つけて解決策を提案する",
        scoreKey: "Restorative",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 62,
    questionText: "意思決定のスタイルは？",
    options: [
      {
        value: "A",
        label: "自分の判断を信じて進む",
        scoreKey: "SelfAssurance",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "対立を避け、合意を目指す",
        scoreKey: "Harmony",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 63,
    questionText: "成功の定義は？",
    options: [
      {
        value: "A",
        label: "強みを最大限に活かし、卓越性を追求する",
        scoreKey: "Maximizer",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "毎日着実に成果を積み重ねる",
        scoreKey: "Achiever",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 64,
    questionText: "コミュニケーションの強みは？",
    options: [
      {
        value: "A",
        label: "アイデアを魅力的に表現し、人を惹きつける",
        scoreKey: "Communication",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "一人ひとりに合わせた対話ができる",
        scoreKey: "Individualization",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 65,
    questionText: "人との関わり方は？",
    options: [
      {
        value: "A",
        label: "新しい人と出会い、すぐに打ち解ける",
        scoreKey: "Woo",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "すべてが繋がっているという視点で接する",
        scoreKey: "Connectedness",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 66,
    questionText: "知的な活動で好きなことは？",
    options: [
      {
        value: "A",
        label: "新しいアイデアや概念を考え出す",
        scoreKey: "Ideation",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "様々な情報を集めて整理する",
        scoreKey: "Input",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 67,
    questionText: "仕事で大切にする価値観は？",
    options: [
      {
        value: "A",
        label: "自分の信念に沿った意味のある仕事",
        scoreKey: "Belief",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "認められ、重要な存在として扱われること",
        scoreKey: "Significance",
        scoreValue: 1,
      },
    ],
  },
  {
    order: 68,
    questionText: "目標達成のアプローチは？",
    options: [
      {
        value: "A",
        label: "明確な目標に集中し、脱線しない",
        scoreKey: "Focus",
        scoreValue: 1,
      },
      {
        value: "B",
        label: "未来のビジョンを描き、そこに向かう",
        scoreKey: "Futuristic",
        scoreValue: 1,
      },
    ],
  },
];

// シード実行用のmutation
export const seedStrengthsTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存の強み診断テストを確認
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), STRENGTHS_TEST.slug))
      .first();

    if (existingTest) {
      console.log("強み診断テストは既に存在します。スキップします。");
      return { success: false, message: "Test already exists" };
    }

    // テストを作成
    const testId = await ctx.db.insert("tests", {
      ...STRENGTHS_TEST,
      resultTypes: STRENGTHS_RESULT_TYPES,
      createdAt: Date.now(),
    });

    // 質問を作成
    for (const question of STRENGTHS_QUESTIONS) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: question.order,
        questionText: question.questionText,
        questionType: "multiple",
        options: question.options,
      });
    }

    console.log(`強み診断テストを作成しました: ${testId}`);
    console.log(`質問数: ${STRENGTHS_QUESTIONS.length}`);

    return {
      success: true,
      testId,
      questionCount: STRENGTHS_QUESTIONS.length,
      themeCount: Object.keys(STRENGTHS_RESULT_TYPES).length,
    };
  },
});

// リセット用のmutation（開発用）
export const resetStrengthsTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 強み診断テストを検索
    const existingTest = await ctx.db
      .query("tests")
      .filter((q) => q.eq(q.field("slug"), STRENGTHS_TEST.slug))
      .first();

    if (!existingTest) {
      return { success: false, message: "Test not found" };
    }

    // 関連する質問を削除
    const questions = await ctx.db
      .query("testQuestions")
      .filter((q) => q.eq(q.field("testId"), existingTest._id))
      .collect();

    for (const question of questions) {
      await ctx.db.delete(question._id);
    }

    // テストを削除
    await ctx.db.delete(existingTest._id);

    console.log("強み診断テストをリセットしました");
    return { success: true, deletedQuestions: questions.length };
  },
});
