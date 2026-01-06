import { v } from "convex/values";
import { query } from "./_generated/server";

// テスト一覧取得（カテゴリフィルタ対応）
export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (args.category) {
      return tests.filter((t) => t.category === args.category);
    }

    return tests;
  },
});

// テスト詳細取得（slugで検索）
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// テスト詳細と質問を取得
export const getWithQuestions = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("tests")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!test) return null;

    const questions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", test._id))
      .collect();

    // 順番でソート
    const sortedQuestions = questions.sort((a, b) => a.order - b.order);

    return { test, questions: sortedQuestions };
  },
});

// テストIDから質問を取得
export const getQuestionsByTestId = query({
  args: {
    testId: v.id("tests"),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("testQuestions")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .collect();

    return questions.sort((a, b) => a.order - b.order);
  },
});

// カテゴリ一覧を取得
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    // 4カテゴリの定義（順序付き）
    const categoryDefinitions: Array<{
      value: string;
      label: string;
      icon: string;
    }> = [
      { value: "personality", label: "性格・自己理解", icon: "brain" },
      { value: "strength", label: "強み・能力", icon: "briefcase" },
      { value: "relationship", label: "対人関係", icon: "people" },
      { value: "lifestyle", label: "ライフスタイル", icon: "leaf" },
    ];

    // アクティブなテストのカテゴリを取得
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const activeCategories = new Set(tests.map((t) => t.category));

    // テストが存在するカテゴリのみ返す（順序を維持）
    return categoryDefinitions
      .filter((cat) => activeCategories.has(cat.value))
      .map((cat) => ({
        ...cat,
        count: tests.filter((t) => t.category === cat.value).length,
      }));
  },
});

// テスト検索（タイトル・説明文）
export const search = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const searchQuery = args.query.toLowerCase().trim();
    if (!searchQuery) return [];

    const tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // タイトルまたは説明文に検索語句を含むテストをフィルタ
    return tests.filter(
      (test) =>
        test.title.toLowerCase().includes(searchQuery) ||
        test.description.toLowerCase().includes(searchQuery) ||
        test.slug.toLowerCase().includes(searchQuery)
    );
  },
});

// 人気のテスト取得（受験数順）
export const getPopular = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;

    // アクティブなテストを取得
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // 各テストの受験数をカウント
    const testsWithCount = await Promise.all(
      tests.map(async (test) => {
        const results = await ctx.db
          .query("testResults")
          .withIndex("by_user_test")
          .filter((q) => q.eq(q.field("testId"), test._id))
          .collect();
        return { ...test, completionCount: results.length };
      })
    );

    // 受験数でソートして上位を返す
    return testsWithCount
      .sort((a, b) => b.completionCount - a.completionCount)
      .slice(0, limit);
  },
});

// おすすめテスト取得（ユーザーが未受験のテスト優先）
export const getRecommended = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 4;
    const identity = await ctx.auth.getUserIdentity();

    // アクティブなテストを取得
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (!identity) {
      // 未認証の場合はランダムに返す
      return tests.slice(0, limit);
    }

    // ユーザーを取得
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      return tests.slice(0, limit);
    }

    // ユーザーが受験済みのテストIDを取得
    const completedResults = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedTestIds = new Set(
      completedResults.map((r) => r.testId.toString())
    );

    // 未受験テストを優先、その後受験済みテスト
    const uncompletedTests = tests.filter(
      (t) => !completedTestIds.has(t._id.toString())
    );
    const completedTests = tests.filter((t) =>
      completedTestIds.has(t._id.toString())
    );

    return [...uncompletedTests, ...completedTests].slice(0, limit);
  },
});

// テスト一覧（受験済みステータス付き）
export const listWithStatus = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // アクティブなテストを取得
    let tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // カテゴリフィルタ
    if (args.category) {
      tests = tests.filter((t) => t.category === args.category);
    }

    if (!identity) {
      return tests.map((t) => ({ ...t, isCompleted: false, lastResult: null }));
    }

    // ユーザーを取得
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      return tests.map((t) => ({ ...t, isCompleted: false, lastResult: null }));
    }

    // ユーザーの結果を取得
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // テストごとの最新結果をマッピング
    const latestResults = new Map<string, { resultType: string; completedAt: number }>();
    for (const result of results) {
      const testIdStr = result.testId.toString();
      const existing = latestResults.get(testIdStr);
      if (!existing || result.completedAt > existing.completedAt) {
        latestResults.set(testIdStr, {
          resultType: result.resultType,
          completedAt: result.completedAt,
        });
      }
    }

    // ステータス付きで返す
    return tests.map((test) => {
      const lastResult = latestResults.get(test._id.toString());
      return {
        ...test,
        isCompleted: !!lastResult,
        lastResult: lastResult || null,
      };
    });
  },
});
