import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Id } from "../../../convex/_generated/dataModel";

interface DiagnosticResult {
  _id: Id<"testResults">;
  testSlug: string;
  resultType: string;
  testTitle?: string;
  testIcon?: string;
  gradientStart?: string;
  gradientEnd?: string;
}

interface ResultSelectorProps {
  completedResults: DiagnosticResult[];
  selectedIds: Id<"testResults">[];
  onToggleSelect: (resultId: Id<"testResults">) => void;
}

const TEST_CONFIG: Record<
  string,
  {
    label: string;
    icon: string;
    iconComponent: "ionicons" | "material";
    gradientStart: string;
    gradientEnd: string;
  }
> = {
  mbti: {
    label: "MBTI",
    icon: "extension-puzzle",
    iconComponent: "ionicons",
    gradientStart: "#8b5cf6",
    gradientEnd: "#7c3aed",
  },
  big5: {
    label: "BIG5",
    icon: "bar-chart",
    iconComponent: "ionicons",
    gradientStart: "#2563eb",
    gradientEnd: "#1d4ed8",
  },
  "last-lover": {
    label: "恋愛診断",
    icon: "heart",
    iconComponent: "ionicons",
    gradientStart: "#a855f7",
    gradientEnd: "#6366f1",
  },
  strengths: {
    label: "強み",
    icon: "star",
    iconComponent: "ionicons",
    gradientStart: "#f59e0b",
    gradientEnd: "#d97706",
  },
  "schwartz-values": {
    label: "価値観",
    icon: "compass",
    iconComponent: "ionicons",
    gradientStart: "#10b981",
    gradientEnd: "#059669",
  },
  "career-anchors": {
    label: "キャリア",
    icon: "briefcase",
    iconComponent: "ionicons",
    gradientStart: "#06b6d4",
    gradientEnd: "#0891b2",
  },
  enneagram: {
    label: "エニアグラム",
    icon: "shapes",
    iconComponent: "ionicons",
    gradientStart: "#f97316",
    gradientEnd: "#ea580c",
  },
};

export function ResultSelector({
  completedResults,
  selectedIds,
  onToggleSelect,
}: ResultSelectorProps) {
  // 7つの診断スロットを準備（完了済み + 未完了）
  const allTestSlugs = [
    "mbti",
    "big5",
    "last-lover",
    "strengths",
    "schwartz-values",
    "career-anchors",
    "enneagram",
  ];

  const resultsBySlug = new Map<string, DiagnosticResult>();
  for (const result of completedResults) {
    resultsBySlug.set(result.testSlug, result);
  }

  const renderIcon = (
    iconName: string,
    iconComponent: "ionicons" | "material",
    color: string
  ) => {
    if (iconComponent === "material") {
      return (
        <MaterialCommunityIcons name={iconName as any} size={20} color={color} />
      );
    }
    return <Ionicons name={iconName as any} size={20} color={color} />;
  };

  return (
    <View className="mb-6">
      <Text className="text-base font-bold text-foreground mb-3">
        分析する診断を選択
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {allTestSlugs.map((slug) => {
          const result = resultsBySlug.get(slug);
          const config = TEST_CONFIG[slug];
          const isCompleted = !!result;
          const isSelected = result ? selectedIds.includes(result._id) : false;

          return (
            <TouchableOpacity
              key={slug}
              onPress={() => {
                if (isCompleted && result) {
                  onToggleSelect(result._id);
                }
              }}
              disabled={!isCompleted}
              activeOpacity={0.7}
              className="w-[31%]"
            >
              <View
                className={`rounded-xl overflow-hidden border-2 ${
                  isSelected
                    ? "border-primary"
                    : isCompleted
                    ? "border-border"
                    : "border-transparent"
                }`}
              >
                <LinearGradient
                  colors={
                    isCompleted
                      ? [config.gradientStart, config.gradientEnd]
                      : ["#e2e8f0", "#cbd5e1"]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 12,
                    alignItems: "center",
                    opacity: isCompleted ? 1 : 0.5,
                  }}
                >
                  {/* チェックマーク */}
                  {isSelected && (
                    <View className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary items-center justify-center">
                      <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                  )}

                  {/* アイコン */}
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mb-2">
                    {renderIcon(
                      config.icon,
                      config.iconComponent,
                      isCompleted ? "white" : "#94a3b8"
                    )}
                  </View>

                  {/* ラベル */}
                  <Text
                    className={`text-xs font-semibold text-center ${
                      isCompleted ? "text-white" : "text-muted-foreground"
                    }`}
                    numberOfLines={1}
                  >
                    {config.label}
                  </Text>

                  {/* 結果タイプ */}
                  {isCompleted && result && (
                    <Text
                      className="text-xs text-white/80 text-center mt-0.5"
                      numberOfLines={1}
                    >
                      {result.resultType}
                    </Text>
                  )}

                  {/* 未完了表示 */}
                  {!isCompleted && (
                    <Text className="text-xs text-muted-foreground text-center mt-0.5">
                      未診断
                    </Text>
                  )}
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 選択数表示 */}
      <Text className="text-xs text-muted-foreground mt-2">
        {selectedIds.length}個選択中（最低1つ選択してください）
      </Text>
    </View>
  );
}
