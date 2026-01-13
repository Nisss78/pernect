import React from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useResultComparisonData } from "../hooks/useResultComparisonData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ResultComparisonScreenProps {
  testSlug: string;
  onBack?: () => void;
  onSelectResult?: (resultId: string) => void;
}

const screenWidth = Dimensions.get("window").width;

export default function ResultComparisonScreen({
  testSlug,
  onBack,
  onSelectResult,
}: ResultComparisonScreenProps) {
  const { data } = useResultComparisonData(testSlug);

  if (data === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const { results, scoreDiffs, test } = data;

  if (results.length < 2) {
    return (
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center px-4 pt-14 pb-4">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground ml-2">
            結果比較
          </Text>
        </View>

        <View className="flex-1 items-center justify-center p-8">
          <Ionicons name="git-compare-outline" size={48} color="#94a3b8" />
          <Text className="text-muted-foreground text-center mt-4">
            比較するには2回以上の診断結果が必要です
          </Text>
        </View>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // スコアのキーを取得（最新の結果から）
  const latestResult = results[results.length - 1];
  const scoreKeys = Object.keys(latestResult.scores || {}).filter(
    (key) => key !== "total"
  );

  // スコア差分から成長ポイントを抽出
  const growthPoints: Array<{ key: string; diff: number }> = [];
  if (scoreDiffs) {
    for (const [key, diff] of Object.entries(scoreDiffs)) {
      if (Math.abs(diff) >= 1) {
        growthPoints.push({ key, diff });
      }
    }
    // 差分の絶対値でソート
    growthPoints.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4">
        <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground ml-2">
          {test?.title || "結果比較"}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* タイプ変化 */}
        <View className="bg-card rounded-2xl p-4 border border-border mb-4">
          <Text className="text-muted-foreground text-sm mb-3">
            タイプの変化
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-2"
          >
            {results.map((result, index) => (
              <TouchableOpacity
                key={result._id}
                onPress={() => onSelectResult?.(result._id)}
                className="mx-2"
              >
                <View className="items-center">
                  <LinearGradient
                    colors={[
                      test?.gradientStart || "#8b5cf6",
                      test?.gradientEnd || "#2563eb",
                    ]}
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ borderRadius: 16 }}
                  >
                    <Text className="text-white font-bold text-lg">
                      {result.resultType}
                    </Text>
                  </LinearGradient>
                  <Text className="text-muted-foreground text-xs mt-2">
                    {formatDate(result.completedAt)}
                  </Text>
                  {index < results.length - 1 && (
                    <View className="absolute right-[-20] top-6">
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color="#94a3b8"
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* スコア比較グラフ */}
        {scoreKeys.length > 0 && (
          <View className="bg-card rounded-2xl p-4 border border-border mb-4">
            <Text className="text-muted-foreground text-sm mb-4">
              スコア比較
            </Text>

            {scoreKeys.slice(0, 8).map((key) => {
              const oldest = results[0].scores?.[key] || 0;
              const newest = latestResult.scores?.[key] || 0;
              const maxScore = Math.max(
                oldest,
                newest,
                ...results.map((r) => r.scores?.[key] || 0),
                10
              );

              return (
                <View key={key} className="mb-4">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-foreground font-medium">{key}</Text>
                    <Text className="text-muted-foreground text-sm">
                      {oldest} → {newest}
                      {newest > oldest && (
                        <Text className="text-green-500"> (+{newest - oldest})</Text>
                      )}
                      {newest < oldest && (
                        <Text className="text-red-500"> ({newest - oldest})</Text>
                      )}
                    </Text>
                  </View>

                  {/* 古いスコア */}
                  <View className="h-3 bg-muted rounded-full overflow-hidden mb-1">
                    <View
                      className="h-full bg-gray-400 rounded-full"
                      style={{ width: `${(oldest / maxScore) * 100}%` }}
                    />
                  </View>

                  {/* 新しいスコア */}
                  <View className="h-3 bg-muted rounded-full overflow-hidden">
                    <LinearGradient
                      colors={["#8b5cf6", "#2563eb"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      className="h-full rounded-full"
                      style={{ width: `${(newest / maxScore) * 100}%` }}
                    />
                  </View>
                </View>
              );
            })}

            <View className="flex-row items-center mt-2">
              <View className="flex-row items-center mr-4">
                <View className="w-3 h-3 bg-gray-400 rounded-full mr-1" />
                <Text className="text-muted-foreground text-xs">初回</Text>
              </View>
              <View className="flex-row items-center">
                <LinearGradient
                  colors={["#8b5cf6", "#2563eb"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="w-3 h-3 rounded-full mr-1"
                />
                <Text className="text-muted-foreground text-xs">最新</Text>
              </View>
            </View>
          </View>
        )}

        {/* 成長ポイント */}
        {growthPoints.length > 0 && (
          <View className="bg-card rounded-2xl p-4 border border-border mb-4">
            <Text className="text-muted-foreground text-sm mb-3">
              成長ポイント
            </Text>

            {growthPoints.slice(0, 5).map(({ key, diff }) => (
              <View
                key={key}
                className="flex-row items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name={diff > 0 ? "trending-up" : "trending-down"}
                    size={20}
                    color={diff > 0 ? "#10b981" : "#ef4444"}
                  />
                  <Text className="text-foreground font-medium ml-2">{key}</Text>
                </View>
                <Text
                  className={`font-semibold ${
                    diff > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 診断履歴一覧 */}
        <View className="bg-card rounded-2xl p-4 border border-border mb-8">
          <Text className="text-muted-foreground text-sm mb-3">診断履歴</Text>

          {results.map((result, index) => (
            <TouchableOpacity
              key={result._id}
              onPress={() => onSelectResult?.(result._id)}
              className={`flex-row items-center justify-between py-3 ${
                index < results.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <View className="flex-row items-center">
                <Text className="text-muted-foreground text-sm w-6">
                  {index + 1}.
                </Text>
                <View>
                  <Text className="text-foreground font-medium">
                    {result.resultType}
                  </Text>
                  <Text className="text-muted-foreground text-xs">
                    {formatDate(result.completedAt)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
