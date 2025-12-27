import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "convex/react";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

interface TestResultScreenProps {
  resultId: Id<"testResults">;
  onBack: () => void;
  onRetakeTest: (testSlug: string) => void;
}

export function TestResultScreen({
  resultId,
  onBack,
  onRetakeTest,
}: TestResultScreenProps) {
  const resultData = useQuery(api.testResults.getById, { resultId });

  if (!resultData) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">結果を読み込み中...</Text>
      </View>
    );
  }

  const { test, resultType, scores, analysis, completedAt } = resultData;

  if (!test) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">テスト情報が見つかりません</Text>
        <TouchableOpacity onPress={onBack} className="mt-4">
          <Text className="text-primary">戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderScoreBar = (label: string, value: number, max: number, color: string) => {
    const percentage = Math.round((value / max) * 100);
    return (
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-foreground">{label}</Text>
          <Text className="text-sm text-muted-foreground">{value}/{max}</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  };

  const renderDimensionScores = () => {
    if (test.scoringType !== "dimension") return null;

    const dimensions = [
      { left: "E", right: "I", leftLabel: "外向型", rightLabel: "内向型", color: "#8b5cf6" },
      { left: "S", right: "N", leftLabel: "感覚型", rightLabel: "直感型", color: "#2563eb" },
      { left: "T", right: "F", leftLabel: "思考型", rightLabel: "感情型", color: "#10b981" },
      { left: "J", right: "P", leftLabel: "判断型", rightLabel: "知覚型", color: "#f97316" },
    ];

    return (
      <View className="bg-card rounded-2xl p-5 border border-border mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">次元別スコア</Text>
        {dimensions.map((dim) => {
          const leftScore = (scores as Record<string, number>)[dim.left] || 0;
          const rightScore = (scores as Record<string, number>)[dim.right] || 0;
          const total = leftScore + rightScore;
          const leftPercentage = total > 0 ? Math.round((leftScore / total) * 100) : 50;

          return (
            <View key={dim.left + dim.right} className="mb-4">
              <View className="flex-row justify-between mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: dim.color }}
                  >
                    <Text className="text-white font-bold text-xs">{dim.left}</Text>
                  </View>
                  <Text className="text-sm text-foreground">{dim.leftLabel}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm text-foreground">{dim.rightLabel}</Text>
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center ml-2"
                    style={{ backgroundColor: dim.color, opacity: 0.5 }}
                  >
                    <Text className="text-white font-bold text-xs">{dim.right}</Text>
                  </View>
                </View>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden flex-row">
                <View
                  className="h-full"
                  style={{
                    width: `${leftPercentage}%`,
                    backgroundColor: dim.color,
                  }}
                />
                <View
                  className="h-full"
                  style={{
                    width: `${100 - leftPercentage}%`,
                    backgroundColor: dim.color,
                    opacity: 0.3,
                  }}
                />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-xs text-muted-foreground">{leftPercentage}%</Text>
                <Text className="text-xs text-muted-foreground">{100 - leftPercentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSingleScores = () => {
    if (test.scoringType !== "single") return null;

    const scoreEntries = Object.entries(scores as Record<string, number>).sort(
      ([, a], [, b]) => b - a
    );
    const maxScore = Math.max(...scoreEntries.map(([, v]) => v));
    const colors = ["#8b5cf6", "#2563eb", "#10b981", "#f97316", "#ef4444", "#06b6d4", "#84cc16", "#ec4899", "#f59e0b"];

    return (
      <View className="bg-card rounded-2xl p-5 border border-border mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">タイプ別スコア</Text>
        {scoreEntries.map(([type, score], index) => (
          <View key={type}>
            {renderScoreBar(
              type.replace("type", "タイプ"),
              score,
              maxScore,
              colors[index % colors.length]
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[test.gradientStart, test.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-14 pb-8 px-6"
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={onBack} className="flex-row items-center">
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white/80 text-sm">
              {formatDate(completedAt)}
            </Text>
          </View>

          <Text className="text-white/80 text-sm mb-2">{test.title}の結果</Text>
          <Text className="text-4xl font-bold text-white mb-2">{resultType}</Text>
          {analysis && (
            <Text className="text-white/90 text-lg">{analysis.summary}</Text>
          )}
        </LinearGradient>

        <View className="px-6 py-6">
          {/* Description */}
          {analysis && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <Text className="text-lg font-bold text-foreground mb-3">あなたのタイプについて</Text>
              <Text className="text-foreground leading-relaxed">
                {analysis.description}
              </Text>
            </View>
          )}

          {/* Scores */}
          {renderDimensionScores()}
          {renderSingleScores()}

          {/* Strengths */}
          {analysis?.strengths && analysis.strengths.length > 0 && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                </View>
                <Text className="text-lg font-bold text-foreground">強み</Text>
              </View>
              {analysis.strengths.map((strength, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#10b981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-foreground ml-2 flex-1">{strength}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Weaknesses */}
          {analysis?.weaknesses && analysis.weaknesses.length > 0 && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="alert-circle" size={20} color="#f97316" />
                </View>
                <Text className="text-lg font-bold text-foreground">注意点</Text>
              </View>
              {analysis.weaknesses.map((weakness, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#f97316"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-foreground ml-2 flex-1">{weakness}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Ionicons name="bulb" size={20} color="#2563eb" />
                </View>
                <Text className="text-lg font-bold text-foreground">アドバイス</Text>
              </View>
              {analysis.recommendations.map((rec, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-blue-500 font-bold mr-2">{index + 1}.</Text>
                  <Text className="text-foreground flex-1">{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View className="flex-row gap-3 mt-4 mb-10">
            <TouchableOpacity
              onPress={() => onRetakeTest(test.slug)}
              className="flex-1"
            >
              <View className="bg-card rounded-2xl p-4 border border-border flex-row items-center justify-center">
                <Ionicons name="refresh" size={20} color="#64748b" />
                <Text className="text-muted-foreground font-semibold ml-2">
                  もう一度診断する
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1">
              <LinearGradient
                colors={[test.gradientStart, test.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl p-4 flex-row items-center justify-center"
              >
                <Ionicons name="share-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">シェアする</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
