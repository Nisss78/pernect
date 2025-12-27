import { mutation } from "./_generated/server";

// MBTI簡易版テストデータを投入
export const seedMbtiTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存のMBTIテストがあるか確認
    const existingTest = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "mbti-simple"))
      .unique();

    if (existingTest) {
      return { message: "MBTIテストは既に存在します", testId: existingTest._id };
    }

    // テスト定義を作成
    const testId = await ctx.db.insert("tests", {
      slug: "mbti-simple",
      title: "MBTI診断（簡易版）",
      description: "5問の質問であなたの性格タイプを診断します",
      category: "personality",
      questionCount: 5,
      estimatedMinutes: 3,
      scoringType: "dimension",
      resultField: "mbti",
      icon: "brain",
      gradientStart: "#8b5cf6",
      gradientEnd: "#2563eb",
      isActive: true,
      createdAt: Date.now(),
    });

    // 質問データを作成
    const questions = [
      {
        order: 1,
        questionText: "新しい人と会う場面で、あなたは...",
        options: [
          {
            value: "E",
            label: "多くの人と積極的に話すことを楽しむ",
            scoreValue: "E",
          },
          {
            value: "I",
            label: "少人数と深く話すことを好む",
            scoreValue: "I",
          },
        ],
      },
      {
        order: 2,
        questionText: "情報を得るとき、あなたは...",
        options: [
          {
            value: "S",
            label: "具体的な事実やデータを重視する",
            scoreValue: "S",
          },
          {
            value: "N",
            label: "可能性やパターンを重視する",
            scoreValue: "N",
          },
        ],
      },
      {
        order: 3,
        questionText: "重要な決断をするとき、あなたは...",
        options: [
          {
            value: "T",
            label: "論理的な分析を重視する",
            scoreValue: "T",
          },
          {
            value: "F",
            label: "人の気持ちや価値観を重視する",
            scoreValue: "F",
          },
        ],
      },
      {
        order: 4,
        questionText: "仕事や予定の進め方で、あなたは...",
        options: [
          {
            value: "J",
            label: "計画を立てて進めることを好む",
            scoreValue: "J",
          },
          {
            value: "P",
            label: "柔軟に対応することを好む",
            scoreValue: "P",
          },
        ],
      },
      {
        order: 5,
        questionText: "ストレス解消法として、あなたは...",
        options: [
          {
            value: "E2",
            label: "人と会って話すことでエネルギーを得る",
            scoreValue: "E",
          },
          {
            value: "I2",
            label: "一人で過ごすことでエネルギーを回復する",
            scoreValue: "I",
          },
        ],
      },
    ];

    // 質問を投入
    for (const q of questions) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: q.order,
        questionText: q.questionText,
        options: q.options,
      });
    }

    return { message: "MBTIテストを作成しました", testId };
  },
});

// エニアグラム簡易版テストデータを投入
export const seedEnneagramTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存のテストがあるか確認
    const existingTest = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "enneagram-simple"))
      .unique();

    if (existingTest) {
      return {
        message: "エニアグラムテストは既に存在します",
        testId: existingTest._id,
      };
    }

    // テスト定義を作成
    const testId = await ctx.db.insert("tests", {
      slug: "enneagram-simple",
      title: "エニアグラム診断（簡易版）",
      description: "5問の質問であなたのタイプを診断します",
      category: "personality",
      questionCount: 5,
      estimatedMinutes: 3,
      scoringType: "single",
      resultField: undefined,
      icon: "star",
      gradientStart: "#f97316",
      gradientEnd: "#eab308",
      isActive: true,
      createdAt: Date.now(),
    });

    // 質問データを作成（タイプ1〜9への加点方式）
    const questions = [
      {
        order: 1,
        questionText: "仕事をするとき、あなたが最も重視するのは...",
        options: [
          {
            value: "A",
            label: "正確さと完璧さ",
            scoreKey: "type1",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "人の役に立つこと",
            scoreKey: "type2",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "成果と効率",
            scoreKey: "type3",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 2,
        questionText: "困難な状況に直面したとき、あなたは...",
        options: [
          {
            value: "A",
            label: "自分の感情を深く探る",
            scoreKey: "type4",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "情報を集めて分析する",
            scoreKey: "type5",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "信頼できる人に相談する",
            scoreKey: "type6",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 3,
        questionText: "休日の過ごし方として好ましいのは...",
        options: [
          {
            value: "A",
            label: "新しい体験や冒険",
            scoreKey: "type7",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "目標に向かって行動する",
            scoreKey: "type8",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "平和で穏やかな時間",
            scoreKey: "type9",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 4,
        questionText: "他者との関係で大切にしていることは...",
        options: [
          {
            value: "A",
            label: "正しいことを伝える",
            scoreKey: "type1",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "相手の気持ちを理解する",
            scoreKey: "type2",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "調和を保つ",
            scoreKey: "type9",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 5,
        questionText: "自分の強みだと思うのは...",
        options: [
          {
            value: "A",
            label: "知識や専門性",
            scoreKey: "type5",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "行動力とリーダーシップ",
            scoreKey: "type8",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "独自の視点と創造性",
            scoreKey: "type4",
            scoreValue: 1,
          },
        ],
      },
    ];

    // 質問を投入
    for (const q of questions) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: q.order,
        questionText: q.questionText,
        options: q.options,
      });
    }

    return { message: "エニアグラムテストを作成しました", testId };
  },
});

// キャリアタイプ診断テストデータを投入
export const seedCareerTest = mutation({
  args: {},
  handler: async (ctx) => {
    // 既存のテストがあるか確認
    const existingTest = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "career-type"))
      .unique();

    if (existingTest) {
      return {
        message: "キャリアタイプテストは既に存在します",
        testId: existingTest._id,
      };
    }

    // テスト定義を作成
    const testId = await ctx.db.insert("tests", {
      slug: "career-type",
      title: "キャリアタイプ診断",
      description: "あなたに合ったキャリアスタイルを診断します",
      category: "career",
      questionCount: 5,
      estimatedMinutes: 3,
      scoringType: "single",
      resultField: undefined,
      icon: "briefcase",
      gradientStart: "#10b981",
      gradientEnd: "#06b6d4",
      isActive: true,
      createdAt: Date.now(),
    });

    // 質問データを作成
    const questions = [
      {
        order: 1,
        questionText: "チームでの役割として好ましいのは...",
        options: [
          {
            value: "A",
            label: "チームを率いて方向性を示す",
            scoreKey: "leader",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "メンバーをサポートする",
            scoreKey: "supporter",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "アイデアを出して創造する",
            scoreKey: "creator",
            scoreValue: 1,
          },
          {
            value: "D",
            label: "データを分析して改善する",
            scoreKey: "analyst",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 2,
        questionText: "仕事で達成感を感じるのは...",
        options: [
          {
            value: "A",
            label: "目標を達成したとき",
            scoreKey: "leader",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "誰かの助けになれたとき",
            scoreKey: "supporter",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "新しいものを生み出したとき",
            scoreKey: "creator",
            scoreValue: 1,
          },
          {
            value: "D",
            label: "問題を解決したとき",
            scoreKey: "analyst",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 3,
        questionText: "困難なプロジェクトで最初にすることは...",
        options: [
          {
            value: "A",
            label: "全体の計画を立てる",
            scoreKey: "leader",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "チームの状態を確認する",
            scoreKey: "supporter",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "ブレインストーミングする",
            scoreKey: "creator",
            scoreValue: 1,
          },
          {
            value: "D",
            label: "データを収集・分析する",
            scoreKey: "analyst",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 4,
        questionText: "理想の働き方は...",
        options: [
          {
            value: "A",
            label: "責任ある立場で決断を下す",
            scoreKey: "leader",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "人と協力しながら進める",
            scoreKey: "supporter",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "自由に発想できる環境",
            scoreKey: "creator",
            scoreValue: 1,
          },
          {
            value: "D",
            label: "論理的に考える仕事",
            scoreKey: "analyst",
            scoreValue: 1,
          },
        ],
      },
      {
        order: 5,
        questionText: "スキルアップしたいのは...",
        options: [
          {
            value: "A",
            label: "リーダーシップ",
            scoreKey: "leader",
            scoreValue: 1,
          },
          {
            value: "B",
            label: "コミュニケーション",
            scoreKey: "supporter",
            scoreValue: 1,
          },
          {
            value: "C",
            label: "クリエイティビティ",
            scoreKey: "creator",
            scoreValue: 1,
          },
          {
            value: "D",
            label: "分析力",
            scoreKey: "analyst",
            scoreValue: 1,
          },
        ],
      },
    ];

    // 質問を投入
    for (const q of questions) {
      await ctx.db.insert("testQuestions", {
        testId,
        order: q.order,
        questionText: q.questionText,
        options: q.options,
      });
    }

    return { message: "キャリアタイプテストを作成しました", testId };
  },
});

// 全テストデータを投入
export const seedAllTests = mutation({
  args: {},
  handler: async (ctx) => {
    // 各テストのシード関数を直接呼び出す代わりに、
    // ここで全てのデータを投入

    const results = [];

    // MBTI
    const mbtiExists = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "mbti-simple"))
      .unique();
    if (!mbtiExists) {
      results.push("MBTI: 作成予定");
    } else {
      results.push("MBTI: 既存");
    }

    // Enneagram
    const enneagramExists = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "enneagram-simple"))
      .unique();
    if (!enneagramExists) {
      results.push("エニアグラム: 作成予定");
    } else {
      results.push("エニアグラム: 既存");
    }

    // Career
    const careerExists = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", "career-type"))
      .unique();
    if (!careerExists) {
      results.push("キャリアタイプ: 作成予定");
    } else {
      results.push("キャリアタイプ: 既存");
    }

    return {
      message: "各テストの状態を確認しました。個別のシード関数を実行してください。",
      results,
    };
  },
});
