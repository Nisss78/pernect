import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { AnalysisDisplay } from "../components/AnalysisDisplay";
import { AnalysisTheme } from "../components/ThemeSelector";
import { useAnalysisDetail } from "../hooks/useIntegratedAnalysis";

interface AnalysisResultScreenProps {
  analysisId: Id<"integratedAnalyses"> | null;
  onBack: () => void;
}

export function AnalysisResultScreen({
  analysisId,
  onBack,
}: AnalysisResultScreenProps) {
  const { analysis, isLoading } = useAnalysisDetail(analysisId);

  if (isLoading || !analysis) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">
          {isLoading ? "読み込み中..." : "分析が見つかりません"}
        </Text>
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
        </View>

        {/* 分析結果 */}
        <View className="px-5 pb-32">
          <AnalysisDisplay
            analysis={analysis.analysis}
            theme={analysis.theme as AnalysisTheme}
            selectedResults={analysis.selectedResults}
            createdAt={analysis.createdAt}
          />

          {/* 新しい分析を行うボタン */}
          <TouchableOpacity
            onPress={onBack}
            className="mt-6 py-4 rounded-xl border border-border items-center"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="add-circle-outline" size={20} color="#8b5cf6" />
              <Text className="text-primary font-semibold">
                新しい分析を行う
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
