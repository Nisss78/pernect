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
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_active")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const categories = [...new Set(tests.map((t) => t.category))];

    // カテゴリの日本語マッピング
    const categoryLabels: Record<string, string> = {
      personality: "性格診断",
      career: "キャリア",
      relationship: "人間関係",
    };

    return categories.map((cat) => ({
      value: cat,
      label: categoryLabels[cat] || cat,
    }));
  },
});
