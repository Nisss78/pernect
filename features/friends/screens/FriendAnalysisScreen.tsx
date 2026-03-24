import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAction, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface FriendAnalysisScreenProps {
  friendId: Id<"users">;
  onBack: () => void;
}

export function FriendAnalysisScreen({
  friendId,
  onBack,
}: FriendAnalysisScreenProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDeep, setIsGeneratingDeep] = useState(false);

  // 分析に必要なデータを取得
  const analysisData = useQuery(api.friendships.getAnalysisData, { friendId });

  // 既存の分析結果を取得
  const existingAnalysis = useQuery(api.friendships.getExistingAnalysis, {
    friendId,
  });

  // 深掘り分析アクセス権チェック
  const deepAccess = useQuery(api.friendships.checkDeepAnalysisAccess);

  // 分析生成のmutation
  const generateAnalysis = useMutation(
    api.friendships.generateCompatibilityAnalysis
  );
  const generateDeep = useAction(api.aiActions.runDeepCompatibility);

  const handleGenerateDeepAnalysis = async () => {
    if (!existingAnalysis) return;

    setIsGeneratingDeep(true);
    try {
      await generateDeep({
        friendId,
        analysisId: existingAnalysis._id,
      });
    } catch (error: any) {
      Alert.alert("エラー", error.message || "深掘り分析の生成に失敗しました");
    } finally {
      setIsGeneratingDeep(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!analysisData) return;

    setIsGenerating(true);
    try {
      await generateAnalysis({ friendId });
    } catch (error: any) {
      Alert.alert("エラー", error.message || "分析の生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  };

  // ローディング状態
  if (analysisData === undefined || existingAnalysis === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">相性分析をしています... ✨</Text>
        <Text className="text-muted-foreground text-xs mt-1">もう少しお待ちください</Text>
      </View>
    );
  }

  // データ取得エラー
  if (!analysisData || !analysisData.friend) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Ionicons name="warning" size={48} color="#f97316" />
        <Text className="text-lg font-semibold text-foreground mt-4">
          データを取得できませんでした
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className="mt-6 px-6 py-3 bg-primary rounded-xl"
        >
          <Text className="text-white font-semibold">戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { currentUser, friend, myResults, friendResults } = analysisData;
  const analysis = existingAnalysis?.analysis;

  // 分析結果がある場合は表示
  if (analysis) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* ヘッダー */}
          <View className="px-5 pt-14 pb-4">
            <TouchableOpacity
              onPress={onBack}
              className="flex-row items-center mb-4"
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
              <Text className="ml-2 text-foreground">戻る</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">相性分析</Text>
          </View>

          {/* 2人のプロフィール */}
          <View className="px-5 mb-6">
            <View className="flex-row items-center justify-center gap-4">
              {/* 自分 */}
              <View className="items-center flex-1">
                <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-2">
                  {currentUser?.image ? (
                    <Image
                      source={{ uri: currentUser.image }}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <Ionicons name="person" size={36} color="#8b5cf6" />
                  )}
                </View>
                <Text className="font-semibold text-foreground text-center">
                  {currentUser?.name || "あなた"}
                </Text>
                {currentUser?.mbti && (
                  <View className="px-2 py-0.5 bg-purple-100 rounded mt-1">
                    <Text className="text-purple-600 text-xs font-medium">
                      {currentUser.mbti}
                    </Text>
                  </View>
                )}
              </View>

              {/* ハートアイコン */}
              <View className="w-12 h-12 bg-pink-100 rounded-full items-center justify-center">
                <Ionicons name="heart" size={24} color="#ec4899" />
              </View>

              {/* 友達 */}
              <View className="items-center flex-1">
                <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-2">
                  {friend.image ? (
                    <Image
                      source={{ uri: friend.image }}
                      className="w-20 h-20 rounded-full"
                    />
                  ) : (
                    <Ionicons name="person" size={36} color="#8b5cf6" />
                  )}
                </View>
                <Text className="font-semibold text-foreground text-center">
                  {friend.name || "友達"}
                </Text>
                {friend.mbti && (
                  <View className="px-2 py-0.5 bg-purple-100 rounded mt-1">
                    <Text className="text-purple-600 text-xs font-medium">
                      {friend.mbti}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* 相性スコア */}
          <View className="px-5 mb-6">
            <View className="bg-gradient-to-r rounded-3xl p-6 items-center" style={{ backgroundColor: getScoreColor(analysis.overallCompatibility) }}>
              <Text className="text-white text-sm font-medium mb-2">
                総合相性スコア
              </Text>
              <Text className="text-white text-6xl font-bold">
                {analysis.overallCompatibility}%
              </Text>
              <View className="px-4 py-1 bg-white/20 rounded-full mt-3">
                <Text className="text-white font-semibold">
                  {analysis.compatibilityLevel === "best"
                    ? "🎉 最高の相性！"
                    : analysis.compatibilityLevel === "good"
                    ? "✨ 良好な相性"
                    : analysis.compatibilityLevel === "neutral"
                    ? "🤝 普通の相性"
                    : "💪 チャレンジングな相性"}
                </Text>
              </View>
            </View>
          </View>

          {/* タイトル & サマリー */}
          <View className="px-5 mb-6">
            <View className="bg-card rounded-2xl border border-border p-5">
              <Text className="text-xl font-bold text-foreground mb-3">
                {analysis.title}
              </Text>
              <Text className="text-muted-foreground leading-6">
                {analysis.summary}
              </Text>
            </View>
          </View>

          {/* カテゴリ別スコア */}
          {analysis.insights && analysis.insights.length > 0 && (
            <View className="px-5 mb-6">
              <Text className="text-lg font-bold text-foreground mb-4">
                📊 カテゴリ別スコア
              </Text>
              <View className="bg-card rounded-2xl border border-border p-4 gap-4">
                {analysis.insights.map((insight, index) => (
                  <View key={index}>
                    <View className="flex-row justify-between mb-2">
                      <Text className="font-medium text-foreground">
                        {insight.category}
                      </Text>
                      <Text className="font-bold text-primary">
                        {insight.score}%
                      </Text>
                    </View>
                    <View className="h-3 bg-secondary rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${insight.score}%`,
                          backgroundColor: getScoreColor(insight.score),
                        }}
                      />
                    </View>
                    <Text className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 相性の良い点 */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <View className="px-5 mb-6">
              <Text className="text-lg font-bold text-foreground mb-4">
                ✨ 相性の良い点
              </Text>
              <View className="bg-green-50 rounded-2xl border border-green-100 p-4">
                {analysis.strengths.map((strength, index) => (
                  <View key={index} className="flex-row items-start mb-3 last:mb-0">
                    <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                    <Text className="flex-1 text-foreground">{strength}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 注意点 */}
          {analysis.challenges && analysis.challenges.length > 0 && (
            <View className="px-5 mb-6">
              <Text className="text-lg font-bold text-foreground mb-4">
                ⚠️ 注意点
              </Text>
              <View className="bg-orange-50 rounded-2xl border border-orange-100 p-4">
                {analysis.challenges.map((challenge, index) => (
                  <View key={index} className="flex-row items-start mb-3 last:mb-0">
                    <View className="w-6 h-6 bg-orange-500 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Ionicons name="alert" size={14} color="white" />
                    </View>
                    <Text className="flex-1 text-foreground">{challenge}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* アドバイス */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <View className="px-5 mb-6">
              <Text className="text-lg font-bold text-foreground mb-4">
                💡 アドバイス
              </Text>
              <View className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
                {analysis.recommendations.map((rec, index) => (
                  <View key={index} className="flex-row items-start mb-3 last:mb-0">
                    <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center mr-3 mt-0.5">
                      <Text className="text-white text-xs font-bold">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 text-foreground">{rec}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* AI深掘り分析セクション */}
          <View className="px-5 mb-6">
            {existingAnalysis?.deepAnalysis ? (
              /* 深掘り分析結果を表示 */
              <View>
                <View className="flex-row items-center mb-4">
                  <Ionicons name="sparkles" size={22} color="#8b5cf6" />
                  <Text className="text-lg font-bold text-foreground ml-2">
                    AI深掘り分析
                  </Text>
                  <View className="ml-2 px-2 py-0.5 bg-purple-100 rounded-full">
                    <Text className="text-purple-600 text-xs font-bold">Pro</Text>
                  </View>
                </View>

                {/* タイトル & 概要 */}
                <View className="bg-purple-50 rounded-2xl border border-purple-100 p-5 mb-4">
                  <Text className="text-lg font-bold text-foreground mb-3">
                    {existingAnalysis.deepAnalysis.title}
                  </Text>
                  <Text className="text-foreground leading-6">
                    {existingAnalysis.deepAnalysis.overview}
                  </Text>
                </View>

                {/* セクション別インサイト */}
                {existingAnalysis.deepAnalysis.sections?.map((section: any, index: number) => (
                  <View key={index} className="bg-card rounded-2xl border border-border p-4 mb-3">
                    <Text className="font-bold text-foreground mb-2">
                      {section.category}
                    </Text>
                    <Text className="text-foreground leading-5 mb-3">
                      {section.insight}
                    </Text>
                    <View className="bg-purple-50 rounded-xl p-3">
                      <View className="flex-row items-start">
                        <Ionicons name="bulb" size={16} color="#8b5cf6" style={{ marginTop: 2 }} />
                        <Text className="flex-1 ml-2 text-purple-700 text-sm">
                          {section.advice}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}

                {/* 隠れたダイナミクス */}
                {existingAnalysis.deepAnalysis.hiddenDynamics && (
                  <View className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5 mb-3">
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="eye" size={18} color="#6366f1" />
                      <Text className="font-bold text-foreground ml-2">隠れたダイナミクス</Text>
                    </View>
                    <Text className="text-foreground leading-6">
                      {existingAnalysis.deepAnalysis.hiddenDynamics}
                    </Text>
                  </View>
                )}

                {/* 成長のロードマップ */}
                {existingAnalysis.deepAnalysis.growthPath && (
                  <View className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5 mb-3">
                    <View className="flex-row items-center mb-3">
                      <Ionicons name="trending-up" size={18} color="#10b981" />
                      <Text className="font-bold text-foreground ml-2">成長のロードマップ</Text>
                    </View>
                    <Text className="text-foreground leading-6">
                      {existingAnalysis.deepAnalysis.growthPath}
                    </Text>
                  </View>
                )}
              </View>
            ) : deepAccess?.hasAccess ? (
              /* プレミアムユーザー：深掘り分析ボタン */
              <TouchableOpacity
                onPress={handleGenerateDeepAnalysis}
                disabled={isGeneratingDeep}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#8b5cf6", "#6366f1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 20, padding: 20 }}
                >
                  {isGeneratingDeep ? (
                    <View className="items-center py-2">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="text-white font-semibold mt-3">
                        AIが深掘り分析中...
                      </Text>
                      <Text className="text-white/70 text-sm mt-1">
                        30秒ほどお待ちください
                      </Text>
                    </View>
                  ) : (
                    <View className="items-center">
                      <Ionicons name="sparkles" size={32} color="white" />
                      <Text className="text-white text-lg font-bold mt-3">
                        AIで深掘り分析する
                      </Text>
                      <Text className="text-white/80 text-sm mt-1 text-center">
                        2人の関係の本質をAIが心理学的に読み解きます
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              /* 無料ユーザー：アップグレードCTA */
              <View className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <View className="items-center">
                  <View className="w-14 h-14 bg-slate-200 rounded-full items-center justify-center mb-3">
                    <Ionicons name="lock-closed" size={28} color="#8b5cf6" />
                  </View>
                  <Text className="text-lg font-bold text-foreground mb-2">
                    AI深掘り分析
                  </Text>
                  <Text className="text-muted-foreground text-center text-sm mb-4 leading-5">
                    AIが2人の関係の本質を心理学的に読み解き、{'\n'}
                    具体的なアドバイスを提供します
                  </Text>
                  <View className="bg-purple-50 rounded-xl p-3 w-full mb-4">
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="checkmark-circle" size={16} color="#8b5cf6" />
                      <Text className="ml-2 text-sm text-foreground">コミュニケーションパターン分析</Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="checkmark-circle" size={16} color="#8b5cf6" />
                      <Text className="ml-2 text-sm text-foreground">隠れた関係のダイナミクス</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={16} color="#8b5cf6" />
                      <Text className="ml-2 text-sm text-foreground">成長のロードマップ</Text>
                    </View>
                  </View>
                  <View className="px-5 py-2 bg-purple-100 rounded-full">
                    <Text className="text-purple-700 font-bold text-sm">
                      Proプランで利用可能
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* 再分析ボタン */}
          <View className="px-5 mb-6">
            <TouchableOpacity
              onPress={handleGenerateAnalysis}
              disabled={isGenerating}
              className="bg-secondary rounded-xl p-4 flex-row items-center justify-center"
            >
              {isGenerating ? (
                <ActivityIndicator size="small" color="#8b5cf6" />
              ) : (
                <>
                  <Ionicons name="refresh" size={20} color="#8b5cf6" />
                  <Text className="ml-2 text-primary font-semibold">
                    再分析する
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* スペーサー */}
          <View className="h-20" />
        </ScrollView>
      </View>
    );
  }

  // 分析がまだない場合：分析を開始する画面
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View className="px-5 pt-14 pb-4">
          <TouchableOpacity
            onPress={onBack}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
            <Text className="ml-2 text-foreground">戻る</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">相性分析</Text>
        </View>

        {/* 2人のプロフィール */}
        <View className="px-5 mb-8">
          <View className="bg-card rounded-3xl border border-border p-6">
            <View className="flex-row items-center justify-center gap-4">
              {/* 自分 */}
              <View className="items-center flex-1">
                <View className="w-24 h-24 rounded-full bg-secondary items-center justify-center mb-3">
                  {currentUser?.image ? (
                    <Image
                      source={{ uri: currentUser.image }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <Ionicons name="person" size={48} color="#8b5cf6" />
                  )}
                </View>
                <Text className="font-bold text-foreground text-center">
                  {currentUser?.name || "あなた"}
                </Text>
                {currentUser?.mbti && (
                  <View className="px-3 py-1 bg-purple-100 rounded-full mt-2">
                    <Text className="text-purple-600 font-medium">
                      {currentUser.mbti}
                    </Text>
                  </View>
                )}
              </View>

              {/* VS */}
              <View className="items-center">
                <Text className="text-3xl">💕</Text>
              </View>

              {/* 友達 */}
              <View className="items-center flex-1">
                <View className="w-24 h-24 rounded-full bg-secondary items-center justify-center mb-3">
                  {friend.image ? (
                    <Image
                      source={{ uri: friend.image }}
                      className="w-24 h-24 rounded-full"
                    />
                  ) : (
                    <Ionicons name="person" size={48} color="#8b5cf6" />
                  )}
                </View>
                <Text className="font-bold text-foreground text-center">
                  {friend.name || "友達"}
                </Text>
                {friend.mbti && (
                  <View className="px-3 py-1 bg-purple-100 rounded-full mt-2">
                    <Text className="text-purple-600 font-medium">
                      {friend.mbti}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 診断データの状態 */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">
            使用する診断データ
          </Text>

          {/* 自分の診断結果 */}
          <View className="bg-card rounded-2xl border border-border p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={20} color="#8b5cf6" />
              </View>
              <Text className="font-semibold text-foreground">あなたの診断</Text>
            </View>
            {myResults && myResults.length > 0 ? (
              <View className="gap-2">
                {myResults.map((result) => (
                  <View
                    key={result._id}
                    className="flex-row items-center bg-green-50 rounded-xl px-3 py-2"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#22c55e"
                    />
                    <Text className="ml-2 text-foreground">
                      {result.resultType} ({getTestName(result.testSlug)})
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row items-center bg-orange-50 rounded-xl px-3 py-2">
                <Ionicons name="warning" size={18} color="#f97316" />
                <Text className="ml-2 text-orange-600">
                  診断結果がありません
                </Text>
              </View>
            )}
          </View>

          {/* 友達の診断結果 */}
          <View className="bg-card rounded-2xl border border-border p-4">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="people" size={20} color="#ec4899" />
              </View>
              <Text className="font-semibold text-foreground">
                {friend.name || "友達"}さんの診断
              </Text>
            </View>
            {friendResults && friendResults.length > 0 ? (
              <View className="gap-2">
                {friendResults.map((result) => (
                  <View
                    key={result._id}
                    className="flex-row items-center bg-green-50 rounded-xl px-3 py-2"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#22c55e"
                    />
                    <Text className="ml-2 text-foreground">
                      {result.resultType} ({getTestName(result.testSlug)})
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="flex-row items-center bg-orange-50 rounded-xl px-3 py-2">
                <Ionicons name="warning" size={18} color="#f97316" />
                <Text className="ml-2 text-orange-600">
                  診断結果がありません
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 分析開始ボタン */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            onPress={handleGenerateAnalysis}
            disabled={isGenerating || (!myResults?.length && !friendResults?.length)}
            className="rounded-2xl p-5 items-center"
            style={{
              backgroundColor:
                !myResults?.length && !friendResults?.length
                  ? "#e2e8f0"
                  : "#ec4899",
            }}
          >
            {isGenerating ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="ml-3 text-white text-lg font-bold">
                  分析中...
                </Text>
              </View>
            ) : (
              <>
                <Ionicons name="sparkles" size={28} color="white" />
                <Text className="text-white text-lg font-bold mt-2">
                  相性を分析する
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  {myResults?.length && friendResults?.length
                    ? "AIが2人の診断結果から相性を分析します"
                    : "MBTIタイプから相性を分析します"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {(!myResults?.length || !friendResults?.length) && (
            <Text className="text-muted-foreground text-sm text-center mt-3">
              ※ 診断結果が少ない場合は、MBTIタイプを基に分析されます
            </Text>
          )}
        </View>

        {/* スペーサー */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

function getTestName(slug: string): string {
  const testNames: Record<string, string> = {
    mbti: "MBTI診断",
    big5: "BIG5診断",
    "last-lover": "恋愛診断",
    enneagram: "エニアグラム",
    career: "キャリア診断",
  };
  return testNames[slug] || slug;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e"; // green
  if (score >= 65) return "#8b5cf6"; // purple
  if (score >= 50) return "#3b82f6"; // blue
  return "#f97316"; // orange
}
