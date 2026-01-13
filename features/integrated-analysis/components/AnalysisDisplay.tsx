import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { AnalysisTheme } from "./ThemeSelector";

interface AnalysisResult {
  title: string;
  summary: string;
  insights: string[];
  strengths: string[];
  challenges: string[];
  recommendations: string[];
}

interface SelectedResult {
  testSlug: string;
  resultType: string;
  testTitle?: string;
}

interface AnalysisDisplayProps {
  analysis: AnalysisResult;
  theme: AnalysisTheme;
  selectedResults: SelectedResult[];
  createdAt: number;
}

const THEME_CONFIG: Record<
  AnalysisTheme,
  {
    icon: keyof typeof Ionicons.glyphMap;
    gradientStart: string;
    gradientEnd: string;
  }
> = {
  love: {
    icon: "heart",
    gradientStart: "#ec4899",
    gradientEnd: "#f43f5e",
  },
  career: {
    icon: "briefcase",
    gradientStart: "#06b6d4",
    gradientEnd: "#2563eb",
  },
  general: {
    icon: "sparkles",
    gradientStart: "#8b5cf6",
    gradientEnd: "#2563eb",
  },
};

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        className="flex-row items-center justify-between py-3 border-b border-border"
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name={icon} size={18} color="#8b5cf6" />
          <Text className="text-base font-semibold text-foreground">{title}</Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#64748b"
        />
      </TouchableOpacity>
      {isOpen && <View className="pt-3">{children}</View>}
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View className="gap-2">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-start gap-2">
          <Text className="text-primary mt-1">•</Text>
          <Text className="text-sm text-foreground flex-1">{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function AnalysisDisplay({
  analysis,
  theme,
  selectedResults,
  createdAt,
}: AnalysisDisplayProps) {
  const config = THEME_CONFIG[theme];
  const formattedDate = new Date(createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View className="bg-card rounded-2xl overflow-hidden border border-border">
      {/* ヘッダー */}
      <LinearGradient
        colors={[config.gradientStart, config.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 20 }}
      >
        <View className="flex-row items-center gap-3 mb-2">
          <Ionicons name={config.icon} size={28} color="white" />
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">{analysis.title}</Text>
            <Text className="text-sm text-white/80">{formattedDate}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* コンテンツ */}
      <View className="p-5">
        {/* 使用した診断 */}
        <View className="mb-4 pb-4 border-b border-border">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="document-text" size={16} color="#64748b" />
            <Text className="text-sm text-muted-foreground">分析に使用した診断</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {selectedResults.map((result, index) => (
              <View
                key={index}
                className="bg-secondary px-3 py-1 rounded-full"
              >
                <Text className="text-xs text-foreground">
                  {result.testTitle || result.testSlug}: {result.resultType}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* サマリー */}
        <View className="mb-4 pb-4 border-b border-border">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="bulb" size={16} color="#f59e0b" />
            <Text className="text-sm font-semibold text-foreground">一言でいうと</Text>
          </View>
          <Text className="text-base text-foreground leading-6 italic">
            "{analysis.summary}"
          </Text>
        </View>

        {/* インサイト */}
        <CollapsibleSection title="主要なインサイト" icon="analytics" defaultOpen>
          <BulletList items={analysis.insights} />
        </CollapsibleSection>

        {/* 強み */}
        <CollapsibleSection title="強み" icon="star">
          <BulletList items={analysis.strengths} />
        </CollapsibleSection>

        {/* 課題 */}
        <CollapsibleSection title="課題" icon="warning">
          <BulletList items={analysis.challenges} />
        </CollapsibleSection>

        {/* アドバイス */}
        <CollapsibleSection title="アドバイス" icon="rocket">
          <BulletList items={analysis.recommendations} />
        </CollapsibleSection>
      </View>
    </View>
  );
}
