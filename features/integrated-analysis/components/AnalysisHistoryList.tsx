import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { AnalysisTheme } from "./ThemeSelector";

interface AnalysisHistoryItem {
  _id: Id<"integratedAnalyses">;
  theme: string;
  analysis: {
    title: string;
    summary: string;
  };
  selectedResults: Array<{
    testSlug: string;
    resultType: string;
  }>;
  createdAt: number;
}

interface AnalysisHistoryListProps {
  analyses: AnalysisHistoryItem[];
  onSelectAnalysis: (analysisId: Id<"integratedAnalyses">) => void;
  showTitle?: boolean;
  limit?: number;
}

const THEME_CONFIG: Record<
  AnalysisTheme,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    gradientStart: string;
    gradientEnd: string;
  }
> = {
  love: {
    label: "恋愛",
    icon: "heart",
    gradientStart: "#ec4899",
    gradientEnd: "#f43f5e",
  },
  career: {
    label: "キャリア",
    icon: "briefcase",
    gradientStart: "#06b6d4",
    gradientEnd: "#2563eb",
  },
  general: {
    label: "総合",
    icon: "sparkles",
    gradientStart: "#8b5cf6",
    gradientEnd: "#2563eb",
  },
};

export function AnalysisHistoryList({
  analyses,
  onSelectAnalysis,
  showTitle = true,
  limit,
}: AnalysisHistoryListProps) {
  const displayAnalyses = limit ? analyses.slice(0, limit) : analyses;

  if (analyses.length === 0) {
    return (
      <View className="items-center py-8">
        <Ionicons name="analytics-outline" size={48} color="#94a3b8" />
        <Text className="text-muted-foreground mt-3 text-center">
          まだ分析履歴がありません
        </Text>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View>
      {showTitle && (
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-bold text-foreground">過去の分析</Text>
          {limit && analyses.length > limit && (
            <Text className="text-sm text-primary">すべて見る</Text>
          )}
        </View>
      )}

      <View className="gap-3">
        {displayAnalyses.map((item) => {
          const themeConfig = THEME_CONFIG[item.theme as AnalysisTheme] || THEME_CONFIG.general;

          return (
            <TouchableOpacity
              key={item._id}
              onPress={() => onSelectAnalysis(item._id)}
              activeOpacity={0.7}
            >
              <View className="bg-card rounded-xl border border-border overflow-hidden">
                <View className="flex-row items-center p-3">
                  {/* テーマアイコン */}
                  <LinearGradient
                    colors={[themeConfig.gradientStart, themeConfig.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={themeConfig.icon} size={22} color="white" />
                  </LinearGradient>

                  {/* コンテンツ */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-0.5">
                      <Text className="text-sm font-semibold text-foreground">
                        {themeConfig.label}分析
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                    <Text
                      className="text-xs text-muted-foreground"
                      numberOfLines={1}
                    >
                      {item.selectedResults.length}個の診断を使用
                    </Text>
                  </View>

                  {/* 矢印 */}
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
