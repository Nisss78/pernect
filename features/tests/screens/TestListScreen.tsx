import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { BottomNavigation } from "../../common/components/BottomNavigation";
import { useTestListData } from "../hooks/useTestListData";

type IconName = "brain" | "briefcase" | "star" | "heart" | "help-circle";

const iconMap: Record<string, { component: any; name: string }> = {
  brain: { component: MaterialCommunityIcons, name: "brain" },
  briefcase: { component: Ionicons, name: "briefcase" },
  star: { component: Ionicons, name: "star" },
  heart: { component: Ionicons, name: "heart" },
};

interface TestListScreenProps {
  onNavigate?: (screen: "home" | "profile" | "friends" | "settings") => void;
  onActionPress?: () => void;
  onStartTest?: (testSlug: string) => void;
}

export function TestListScreen({
  onNavigate,
  onActionPress,
  onStartTest,
}: TestListScreenProps) {
  const { completedResults, inProgressTests, tests } = useTestListData();

  const getTestStatus = (
    testId: Id<"tests">
  ): "not_started" | "in_progress" | "completed" => {
    if (inProgressTests?.some((p) => p.testId === testId)) {
      return "in_progress";
    }
    if (completedResults?.some((r) => r.testId === testId)) {
      return "completed";
    }
    return "not_started";
  };

  const getStatusBadge = (status: "not_started" | "in_progress" | "completed") => {
    switch (status) {
      case "in_progress":
        return (
          <View className="px-2 py-1 rounded-full bg-yellow-100">
            <Text className="text-xs font-semibold text-yellow-700">進行中</Text>
          </View>
        );
      case "completed":
        return (
          <View className="px-2 py-1 rounded-full bg-green-100">
            <Text className="text-xs font-semibold text-green-700">完了</Text>
          </View>
        );
      default:
        return (
          <View className="px-2 py-1 rounded-full bg-gray-100">
            <Text className="text-xs font-semibold text-gray-500">未開始</Text>
          </View>
        );
    }
  };

  const renderIcon = (iconName: string) => {
    const icon = iconMap[iconName] || { component: Ionicons, name: "help-circle" };
    const IconComponent = icon.component;
    return <IconComponent name={icon.name} size={28} color="white" />;
  };

  if (!tests) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">テスト一覧を読み込んでいます... 💫</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-14 pb-6">
          <TouchableOpacity
            onPress={() => onNavigate?.("home")}
            className="flex-row items-center mb-5"
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
            <Text className="ml-2 text-foreground">戻る</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">診断テスト</Text>
          <Text className="text-muted-foreground text-sm mt-2">
            あなたをより深く理解するための診断
          </Text>
        </View>

        {/* Test List */}
        <View className="px-5 pb-32">
          {tests.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
              <Text className="text-muted-foreground mt-4">
                利用可能なテストがありません
              </Text>
            </View>
          ) : (
            <View className="gap-5">
              {tests.map((test) => {
                const status = getTestStatus(test._id);
                return (
                  <TouchableOpacity
                    key={test._id}
                    onPress={() => onStartTest?.(test.slug)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[test.gradientStart, test.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 24, padding: 20 }}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                          {renderIcon(test.icon)}
                        </View>
                        {getStatusBadge(status)}
                      </View>
                      <Text className="text-lg font-bold text-white mb-1">
                        {test.title}
                      </Text>
                      <Text
                        className="text-white/80 text-sm mb-3"
                        numberOfLines={2}
                      >
                        {test.description}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name="help-circle-outline"
                          size={14}
                          color="rgba(255,255,255,0.9)"
                        />
                        <Text className="text-white/90 text-xs">
                          {test.questionCount}問
                        </Text>
                        <Text className="text-white/90 text-xs mx-1">•</Text>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color="rgba(255,255,255,0.9)"
                        />
                        <Text className="text-white/90 text-xs">
                          約{test.estimatedMinutes}分
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigation
        currentScreen="home"
        onNavigate={(screen) => onNavigate?.(screen)}
        onActionPress={onActionPress}
      />
    </View>
  );
}
