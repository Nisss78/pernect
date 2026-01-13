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
}

export function IntegratedAnalysisScreen({
  onBack,
  onAnalysisComplete,
  onViewAnalysis,
}: IntegratedAnalysisScreenProps) {
  const {
    completedResults,
    analysisHistory,
    isLoading,
    isCreating,
    createAnalysis,
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
      const result = await createAnalysis(selectedResultIds, selectedTheme);
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
        <Text className="text-muted-foreground mt-4">読み込み中...</Text>
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
            <View>
              <Text className="text-2xl font-bold text-foreground">統合分析</Text>
              <Text className="text-sm text-muted-foreground">
                複数の診断結果を踏まえてAI分析
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
                    分析中...
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
