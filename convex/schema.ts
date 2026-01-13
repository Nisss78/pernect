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
    category: v.string(), // "personality" | "strength" | "relationship" | "lifestyle"
    questionCount: v.number(), // 5
    estimatedMinutes: v.number(), // 3
    scoringType: v.string(), // "dimension" | "single" | "scale" | "percentile"
    resultField: v.optional(v.string()), // "mbti" - usersテーブルの保存先
    icon: v.string(), // "brain" | "briefcase" | "heart"
    gradientStart: v.string(), // "#8b5cf6"
    gradientEnd: v.string(), // "#2563eb"
    isActive: v.boolean(), // true
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    // 科学的根拠：出典情報
    citation: v.optional(
      v.object({
        authors: v.array(v.string()), // ["Carl Jung", "Isabel Myers", "Katharine Briggs"]
        title: v.string(), // "Gifts Differing"
        year: v.number(), // 1980
        doi: v.optional(v.string()), // "10.xxxx/xxxxx"
        url: v.optional(v.string()), // "https://..."
      })
    ),

    // スコアリング設定
    scoringConfig: v.optional(
      v.object({
        // dimension: 対立次元ペア定義
        dimensions: v.optional(
          v.array(
            v.object({
              positive: v.string(), // "E"
              negative: v.string(), // "I"
            })
          )
        ),
        // scale: 閾値定義
        thresholds: v.optional(
          v.array(
            v.object({
              min: v.number(),
              max: v.number(),
              label: v.string(), // "高感受性", "中程度", "低感受性"
            })
          )
        ),
        // percentile: 基準値
        percentileBase: v.optional(v.number()), // 100
        // カスタム計算関数名
        customCalculator: v.optional(v.string()),
      })
    ),

    // 結果タイプ定義（分析テンプレート）
    resultTypes: v.optional(v.any()), // Record<string, ResultTypeDefinition>
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // 質問テーブル（テストに紐づく）
  testQuestions: defineTable({
    testId: v.id("tests"),
    order: v.number(), // 1, 2, 3...
    questionText: v.string(), // "あなたはパーティーで..."

    // 質問タイプ（新規）
    questionType: v.optional(v.string()), // "multiple" | "likert" | "forced_choice" | "slider" (デフォルト: "multiple")

    // 質問タイプ別設定
    typeConfig: v.optional(
      v.object({
        // likert: スケール範囲
        likertMin: v.optional(v.number()), // 1
        likertMax: v.optional(v.number()), // 5 or 7
        likertLabels: v.optional(
          v.object({
            min: v.string(), // "全くそう思わない"
            max: v.string(), // "非常にそう思う"
          })
        ),
        // slider: 範囲
        sliderMin: v.optional(v.number()), // 0
        sliderMax: v.optional(v.number()), // 100
      })
    ),

    // スコアキー（likert/slider用）
    scoreKey: v.optional(v.string()), // "openness", "conscientiousness", etc.

    // 逆転項目フラグ（BIG5など逆転スコアリングが必要な質問用）
    reverseScored: v.optional(v.boolean()), // true = 逆転項目（スコア反転が必要）

    // 選択肢（multiple, forced_choice用）
    options: v.optional(
      v.array(
        v.object({
          value: v.string(), // "A" | "B" | "E" | "I"
          label: v.string(), // "多くの人と話す"
          // スコア加算情報
          scoreKey: v.optional(v.string()), // "EI" (dimension) or "type1" (single)
          scoreValue: v.optional(v.union(v.string(), v.number())),
          // dimension: "E" or "I"
          // single: 1 (加算値)
        })
      )
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

    // AI分析用構造化データ（新規）
    aiData: v.optional(
      v.object({
        testSlug: v.string(), // "mbti"
        resultType: v.string(), // "ENFP"
        scores: v.any(), // { E: 7, I: 3, N: 8, S: 2 }
        dimensions: v.optional(v.array(v.string())), // ["E", "N", "F", "P"]
        percentiles: v.optional(v.any()), // { E_I: 70, N_S: 80 }
        completedAt: v.string(), // ISO 8601: "2026-01-05T12:00:00Z"
      })
    ),

    // シェア設定（新規）
    shareSettings: v.optional(
      v.object({
        isPublic: v.boolean(), // 公開/非公開
        shareId: v.optional(v.string()), // 短縮シェアID
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_test", ["userId", "testId"])
    .index("by_completed", ["completedAt"]),

  // シェアリンクテーブル（新規）
  shareLinks: defineTable({
    resultId: v.id("testResults"),
    userId: v.id("users"),
    shareId: v.string(), // 短縮ID (8文字)
    expiresAt: v.optional(v.number()), // 有効期限
    accessCount: v.number(), // アクセス数
    maxAccessCount: v.optional(v.number()), // 最大アクセス数
    createdAt: v.number(),
  })
    .index("by_shareId", ["shareId"])
    .index("by_result", ["resultId"])
    .index("by_user", ["userId"]),

  // 最後の恋人診断: 16タイプのキャラクター定義
  lastLoverTypes: defineTable({
    typeCode: v.string(), // "ESFJ", "INFP", etc.
    characterName: v.string(), // "献身的な世話焼きさん"
    emoji: v.string(), // "💝"
    summary: v.string(), // 短い要約
    description: v.string(), // 詳細説明
    loveStyle: v.string(), // 恋愛スタイル説明
    strengths: v.array(v.string()), // 恋愛における強み
    weaknesses: v.array(v.string()), // 注意点
    idealDate: v.string(), // 理想のデート
    communicationStyle: v.string(), // コミュニケーションスタイル
  }).index("by_type_code", ["typeCode"]),

  // 最後の恋人診断: タイプ間の相性情報
  lastLoverCompatibility: defineTable({
    typeCode: v.string(), // 基準タイプ "ESFJ"
    compatibleType: v.string(), // 相手タイプ "INFP"
    compatibilityLevel: v.string(), // "best" | "good" | "neutral" | "challenging"
    reason: v.string(), // 相性の理由
    advice: v.optional(v.string()), // アドバイス
  })
    .index("by_type", ["typeCode"])
    .index("by_pair", ["typeCode", "compatibleType"]),

  // 友達関係テーブル
  friendships: defineTable({
    requesterId: v.id("users"), // 申請者
    receiverId: v.id("users"), // 受信者
    status: v.string(), // "pending" | "accepted" | "rejected" | "cancelled"
    requestedAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_requester", ["requesterId"])
    .index("by_receiver", ["receiverId"])
    .index("by_pair", ["requesterId", "receiverId"])
    .index("by_receiver_status", ["receiverId", "status"]),

  // 友達間の相性分析テーブル
  friendAnalyses: defineTable({
    user1Id: v.id("users"), // 常にID昇順で保存
    user2Id: v.id("users"),
    usedResults: v.array(
      v.object({
        userId: v.id("users"),
        resultId: v.id("testResults"),
        testSlug: v.string(),
        resultType: v.string(),
      })
    ),
    analysis: v.object({
      overallCompatibility: v.number(), // 0-100
      compatibilityLevel: v.string(), // "best" | "good" | "neutral" | "challenging"
      title: v.string(),
      summary: v.string(),
      strengths: v.array(v.string()),
      challenges: v.array(v.string()),
      recommendations: v.array(v.string()),
      insights: v.array(
        v.object({
          category: v.string(),
          description: v.string(),
          score: v.number(),
        })
      ),
    }),
    usedAiApi: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user_pair", ["user1Id", "user2Id"])
    .index("by_user1", ["user1Id"])
    .index("by_user2", ["user2Id"]),

  // 統合分析テーブル
  integratedAnalyses: defineTable({
    userId: v.id("users"),
    // 選択した診断結果
    selectedResults: v.array(
      v.object({
        resultId: v.id("testResults"),
        testSlug: v.string(),
        resultType: v.string(),
      })
    ),
    // 分析テーマ
    theme: v.string(), // "love" | "career" | "general"
    // AI分析結果
    analysis: v.object({
      title: v.string(), // "あなたの恋愛傾向分析"
      summary: v.string(), // 一文要約
      insights: v.array(v.string()), // 主要インサイト（3-5項目）
      strengths: v.array(v.string()), // 強み
      challenges: v.array(v.string()), // 課題
      recommendations: v.array(v.string()), // アドバイス
    }),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_theme", ["userId", "theme"])
    .index("by_created", ["createdAt"]),
});