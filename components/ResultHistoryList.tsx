import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ResultHistoryListProps {
  onSelectResult?: (resultId: string) => void;
  onCompare?: (testSlug: string) => void;
}

export default function ResultHistoryList({
  onSelectResult,
  onCompare,
}: ResultHistoryListProps) {
  const results = useQuery(api.testResults.listByUser);

  if (results === undefined) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
        <Text className="text-muted-foreground text-center mt-4">
          診断結果がありません
        </Text>
        <Text className="text-muted-foreground text-center text-sm mt-2">
          テストを受けて結果を記録しましょう
        </Text>
      </View>
    );
  }

  // テストごとに結果をグループ化（比較ボタン表示用）
  const testResultCounts: Record<string, number> = {};
  for (const result of results) {
    if (result.test) {
      const slug = result.test.slug;
      testResultCounts[slug] = (testResultCounts[slug] || 0) + 1;
    }
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIconName = (icon?: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      brain: "extension-puzzle",
      briefcase: "briefcase",
      heart: "heart",
      book: "book",
      star: "star",
      leaf: "leaf",
    };
    return iconMap[icon || ""] || "help-circle";
  };

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => {
        const test = item.test;
        if (!test) return null;

        const canCompare = testResultCounts[test.slug] >= 2;

        return (
          <TouchableOpacity
            onPress={() => onSelectResult?.(item._id)}
            className="mb-3"
          >
            <View className="bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center">
                {/* アイコン */}
                <LinearGradient
                  colors={[
                    test.gradientStart || "#8b5cf6",
                    test.gradientEnd || "#2563eb",
                  ]}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Ionicons
                    name={getIconName(test.icon)}
                    size={24}
                    color="white"
                  />
                </LinearGradient>

                {/* 診断情報 */}
                <View className="flex-1 ml-3">
                  <Text className="text-foreground font-semibold text-base">
                    {test.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="bg-primary/10 rounded-full px-2 py-0.5">
                      <Text className="text-primary font-medium text-sm">
                        {item.resultType}
                      </Text>
                    </View>
                    <Text className="text-muted-foreground text-xs ml-2">
                      {formatDate(item.completedAt)}
                    </Text>
                  </View>
                </View>

                {/* 比較ボタン */}
                {canCompare && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      onCompare?.(test.slug);
                    }}
                    className="bg-muted rounded-full p-2 ml-2"
                  >
                    <Ionicons
                      name="git-compare-outline"
                      size={18}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                )}

                {/* 詳細矢印 */}
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#94a3b8"
                  style={{ marginLeft: 8 }}
                />
              </View>

              {/* 分析サマリー */}
              {item.analysis?.summary && (
                <Text
                  className="text-muted-foreground text-sm mt-3"
                  numberOfLines={2}
                >
                  {item.analysis.summary}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
