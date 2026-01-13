import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type AnalysisTheme = "love" | "career" | "general";

interface ThemeSelectorProps {
  selectedTheme: AnalysisTheme | null;
  onSelectTheme: (theme: AnalysisTheme) => void;
}

const THEMES: Array<{
  id: AnalysisTheme;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradientStart: string;
  gradientEnd: string;
}> = [
  {
    id: "love",
    label: "恋愛分析",
    description: "恋愛傾向・相性・アドバイス",
    icon: "heart",
    gradientStart: "#ec4899",
    gradientEnd: "#f43f5e",
  },
  {
    id: "career",
    label: "キャリア分析",
    description: "適職・強み・成長のヒント",
    icon: "briefcase",
    gradientStart: "#06b6d4",
    gradientEnd: "#2563eb",
  },
  {
    id: "general",
    label: "総合分析",
    description: "すべての診断を統合して分析",
    icon: "sparkles",
    gradientStart: "#8b5cf6",
    gradientEnd: "#2563eb",
  },
];

export function ThemeSelector({
  selectedTheme,
  onSelectTheme,
}: ThemeSelectorProps) {
  return (
    <View className="mb-6">
      <Text className="text-base font-bold text-foreground mb-3">
        分析テーマを選択
      </Text>
      <View className="gap-3">
        {THEMES.map((theme) => {
          const isSelected = selectedTheme === theme.id;

          return (
            <TouchableOpacity
              key={theme.id}
              onPress={() => onSelectTheme(theme.id)}
              activeOpacity={0.8}
            >
              <View
                className={`rounded-xl overflow-hidden border-2 ${
                  isSelected ? "border-primary" : "border-transparent"
                }`}
              >
                <LinearGradient
                  colors={[theme.gradientStart, theme.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* アイコン */}
                  <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mr-3">
                    <Ionicons name={theme.icon} size={24} color="white" />
                  </View>

                  {/* テキスト */}
                  <View className="flex-1">
                    <Text className="text-base font-bold text-white">
                      {theme.label}
                    </Text>
                    <Text className="text-xs text-white/80 mt-0.5">
                      {theme.description}
                    </Text>
                  </View>

                  {/* 選択インジケーター */}
                  <View
                    className={`w-6 h-6 rounded-full border-2 border-white items-center justify-center ${
                      isSelected ? "bg-white" : "bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={theme.gradientStart}
                      />
                    )}
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
