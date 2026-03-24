import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { AnalysisHistoryList } from "../components/AnalysisHistoryList";
import { ResultSelector } from "../components/ResultSelector";
import { AnalysisTheme, ThemeSelector } from "../components/ThemeSelector";
import { useIntegratedAnalysis } from "../hooks/useIntegratedAnalysis";

interface IntegratedAnalysisScreenProps {
  onBack: () => void;
  onAnalysisComplete: (analysisId: Id<"integratedAnalyses">) => void;
  onViewAnalysis: (analysisId: Id<"integratedAnalyses">) => void;
  onNavigateToPaywall?: () => void;
}

export function IntegratedAnalysisScreen({
  onBack,
  onAnalysisComplete,
  onViewAnalysis,
  onNavigateToPaywall,
}: IntegratedAnalysisScreenProps) {
  const {
    completedResults,
    analysisHistory,
    isLoading,
    isCreating,
    createAnalysis,
    aiAvailability,
  } = useIntegratedAnalysis();

  // 選択状態
  const [selectedResultIds, setSelectedResultIds] = useState<Id<"testResults">[]>(
    []
  );
  const [selectedTheme, setSelectedTheme] = useState<AnalysisTheme | null>(null);

  // 診断結果の選択をトグル
  const handleToggleSelect = (resultId: Id<"testResults">) => {
    setSelectedResultIds((prev) => {
      if (prev.includes(resultId)) {
        return prev.filter((id) => id !== resultId);
      }
      return [...prev, resultId];
    });
  };

  // 分析を開始
  const handleStartAnalysis = async () => {
    if (selectedResultIds.length === 0 || !selectedTheme) return;

    try {
      // AIが利用可能な場合はAIを使用
      const useAI = aiAvailability?.available ?? false;
      const result = await createAnalysis(selectedResultIds, selectedTheme, useAI);
      if (result?.analysisId) {
        onAnalysisComplete(result.analysisId);
      }
    } catch (error) {
      console.error("分析の作成に失敗しました:", error);
    }
  };

  // 分析開始可能かチェック
  const canStartAnalysis =
    selectedResultIds.length > 0 && selectedTheme !== null && !isCreating;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">統合分析を準備しています... 📊</Text>
        <Text className="text-muted-foreground text-xs mt-1">もう少しお待ちください</Text>
      </View>
    );
  }

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

          <View className="flex-row items-center gap-3 mb-2">
            <LinearGradient
              colors={["#2563eb", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="analytics" size={24} color="white" />
            </LinearGradient>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-foreground">統合分析</Text>
                {aiAvailability?.available && (
                  <View className="bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full">
                    <Text className="text-white text-xs font-bold">AI</Text>
                  </View>
                )}
              </View>
              <Text className="text-sm text-muted-foreground">
                複数の診断結果を踏まえて分析
              </Text>
            </View>
          </View>
        </View>

        {/* メインコンテンツ */}
        <View className="px-5 pb-32">
          {/* 診断結果選択 */}
          <ResultSelector
            completedResults={completedResults}
            selectedIds={selectedResultIds}
            onToggleSelect={handleToggleSelect}
          />

          {/* テーマ選択 */}
          <ThemeSelector
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />

          {/* 分析開始ボタン */}
          <TouchableOpacity
            onPress={handleStartAnalysis}
            disabled={!canStartAnalysis}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                canStartAnalysis
                  ? ["#8b5cf6", "#2563eb"]
                  : ["#cbd5e1", "#94a3b8"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {isCreating ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-base ml-2">
                    {aiAvailability?.available ? "AI分析中..." : "分析中..."}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="white" />
                  <Text className="text-white font-bold text-base ml-2">
                    分析を開始する
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* 補足テキスト */}
          {!canStartAnalysis && !isCreating && (
            <Text className="text-xs text-muted-foreground text-center mt-2">
              {selectedResultIds.length === 0
                ? "分析する診断を1つ以上選択してください"
                : "分析テーマを選択してください"}
            </Text>
          )}

          {/* AI利用可能性ステータス */}
          {canStartAnalysis && !isCreating && (
            <View className="mt-3">
              {aiAvailability?.available ? (
                <View className="flex-row items-center justify-center gap-2 bg-purple-50 py-2 px-4 rounded-xl">
                  <Ionicons name="sparkles" size={16} color="#8b5cf6" />
                  <Text className="text-xs text-purple-700 font-medium">
                    AIによる高度な分析が利用可能
                  </Text>
                </View>
              ) : aiAvailability?.reason === "premium_required" ? (
                <TouchableOpacity
                  onPress={onNavigateToPaywall}
                  className="flex-row items-center justify-center gap-2 bg-purple-50 py-2 px-4 rounded-xl border border-purple-200"
                >
                  <Ionicons name="lock-closed" size={16} color="#8b5cf6" />
                  <Text className="text-xs text-purple-700 font-medium">
                    プレミアムプランでAI分析を解放
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color="#8b5cf6" />
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          {/* 過去の分析履歴 */}
          {analysisHistory.length > 0 && (
            <View className="mt-8">
              <AnalysisHistoryList
                analyses={analysisHistory}
                onSelectAnalysis={onViewAnalysis}
                limit={5}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
