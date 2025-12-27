import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ユーザーテーブル
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    pushToken: v.optional(v.string()),
    // プロフィール追加情報
    userId: v.optional(v.string()), // ユーザーID (@username形式)
    mbti: v.optional(v.string()), // MBTIタイプ (ENFP, INTJ, etc.)
    birthday: v.optional(v.string()), // ISO形式: "YYYY-MM-DD"
    gender: v.optional(v.string()), // "male" | "female" | "other" | "prefer_not_to_say"
    bio: v.optional(v.string()), // 自己紹介
    occupation: v.optional(v.string()), // 職業
    createdAt: v.optional(v.number()), // 作成日時
    updatedAt: v.optional(v.number()), // 更新日時
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_userId", ["userId"]),

  // 診断テスト定義テーブル
  tests: defineTable({
    slug: v.string(), // "mbti-simple"
    title: v.string(), // "MBTI診断（簡易版）"
    description: v.string(), // "5問で分かるあなたの性格タイプ"
    category: v.string(), // "personality" | "career" | "relationship"
    questionCount: v.number(), // 5
    estimatedMinutes: v.number(), // 3
    scoringType: v.string(), // "dimension" | "single"
    resultField: v.optional(v.string()), // "mbti" - usersテーブルの保存先
    icon: v.string(), // "brain" | "briefcase" | "heart"
    gradientStart: v.string(), // "#8b5cf6"
    gradientEnd: v.string(), // "#2563eb"
    isActive: v.boolean(), // true
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // 質問テーブル（テストに紐づく）
  testQuestions: defineTable({
    testId: v.id("tests"),
    order: v.number(), // 1, 2, 3...
    questionText: v.string(), // "あなたはパーティーで..."
    options: v.array(
      v.object({
        value: v.string(), // "A" | "B" | "E" | "I"
        label: v.string(), // "多くの人と話す"
        // スコア加算情報
        scoreKey: v.optional(v.string()), // "EI" (dimension) or "type1" (single)
        scoreValue: v.optional(v.union(v.string(), v.number())),
        // dimension: "E" or "I"
        // single: 1 (加算値)
      })
    ),
  })
    .index("by_test", ["testId"])
    .index("by_test_order", ["testId", "order"]),

  // 回答一時保存テーブル（進行中の診断）
  testAnswers: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    answers: v.array(
      v.object({
        questionOrder: v.number(),
        selectedValue: v.string(),
      })
    ),
    startedAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_test", ["userId", "testId"]),

  // 診断結果テーブル
  testResults: defineTable({
    userId: v.id("users"),
    testId: v.id("tests"),
    resultType: v.string(), // "ENFP" | "タイプ1" | "リーダー型"
    scores: v.any(), // { E: 3, I: 2, ... } or { type1: 5, type2: 3, ... }
    analysis: v.optional(
      v.object({
        summary: v.string(), // 一行説明
        description: v.string(), // 詳細説明
        strengths: v.array(v.string()), // 強み
        weaknesses: v.array(v.string()), // 弱み
        recommendations: v.array(v.string()), // アドバイス
      })
    ),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_test", ["userId", "testId"])
    .index("by_completed", ["completedAt"]),
});