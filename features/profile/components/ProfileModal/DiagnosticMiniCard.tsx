import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

// Test configuration with icons and colors
export const TEST_CONFIG: Record<
  string,
  {
    label: string;
    labelJa: string;
    icon: keyof typeof Ionicons.glyphMap;
    colors: [string, string];
  }
> = {
  mbti: {
    label: "MBTI",
    labelJa: "性格タイプ",
    icon: "extension-puzzle",
    colors: ["#8b5cf6", "#7c3aed"],
  },
  big5: {
    label: "BIG5",
    labelJa: "5因子性格",
    icon: "bar-chart",
    colors: ["#3b82f6", "#2563eb"],
  },
  "last-lover": {
    label: "最後の恋人",
    labelJa: "恋愛タイプ",
    icon: "heart",
    colors: ["#ec4899", "#db2777"],
  },
  strengths: {
    label: "強み",
    labelJa: "強み診断",
    icon: "star",
    colors: ["#f59e0b", "#d97706"],
  },
  "schwartz-values": {
    label: "価値観",
    labelJa: "価値観診断",
    icon: "compass",
    colors: ["#10b981", "#059669"],
  },
  "career-anchors": {
    label: "キャリア",
    labelJa: "キャリアアンカー",
    icon: "briefcase",
    colors: ["#06b6d4", "#0891b2"],
  },
  enneagram: {
    label: "エニアグラム",
    labelJa: "9タイプ性格",
    icon: "shapes",
    colors: ["#f97316", "#ea580c"],
  },
};

interface DiagnosticMiniCardProps {
  testSlug: string;
  resultType: string | null;
  onPress: () => void;
  index: number;
}

export function DiagnosticMiniCard({
  testSlug,
  resultType,
  onPress,
  index,
}: DiagnosticMiniCardProps) {
  const config = TEST_CONFIG[testSlug];

  if (!config) {
    return null;
  }

  const hasResult = resultType !== null;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(400)}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        <LinearGradient
          colors={hasResult ? config.colors : ["#94a3b8", "#64748b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name={config.icon} size={24} color="white" />
          </View>

          {/* Label */}
          <Text style={styles.label} numberOfLines={1}>
            {config.label}
          </Text>

          {/* Result type or placeholder */}
          {hasResult ? (
            <Text style={styles.resultType} numberOfLines={1}>
              {resultType}
            </Text>
          ) : (
            <View style={styles.noResultContainer}>
              <Ionicons name="add-circle-outline" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.noResultText}>未診断</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    marginBottom: 12,
  },
  touchable: {
    width: "100%",
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  resultType: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResultContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  noResultText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
});
