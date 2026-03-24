import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string];
}

export function NotificationSettingsScreen({
  onBack,
}: NotificationSettingsScreenProps) {
  // TODO: Convexからユーザーの通知設定を取得・保存する
  const [settings, setSettings] = useState<Record<string, boolean>>({
    friendRequests: true,
    friendAccepted: true,
    analysisComplete: true,
    shareLinks: true,
    recommendations: true,
  });

  const toggleSetting = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: Convexに保存
  };

  const notificationCategories: NotificationSetting[] = [
    {
      id: "friendRequests",
      title: "友達リクエスト",
      description: "新しい友達リクエストを受け取ったとき",
      icon: "person-add",
      gradient: ["#8b5cf6", "#a78bfa"],
    },
    {
      id: "friendAccepted",
      title: "友達承認",
      description: "友達リクエストが承認されたとき",
      icon: "people",
      gradient: ["#10b981", "#34d399"],
    },
    {
      id: "analysisComplete",
      title: "相性分析完了",
      description: "相性分析が完了したとき",
      icon: "analytics",
      gradient: ["#ec4899", "#f472b6"],
    },
    {
      id: "shareLinks",
      title: "シェアリンク",
      description: "誰かがあなたの診断結果を見たとき",
      icon: "link",
      gradient: ["#f59e0b", "#fbbf24"],
    },
    {
      id: "recommendations",
      title: "おすすめ",
      description: "新しい診断やおすすめ情報",
      icon: "sparkles",
      gradient: ["#06b6d4", "#22d3ee"],
    },
  ];

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">通知設定</Text>
        <View className="w-7" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header Info */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground mb-2">
            通知を管理
          </Text>
          <Text className="text-muted-foreground">
            受け取る通知の種類を選択できます
          </Text>
        </View>

        {/* Notification Categories */}
        <View className="gap-4">
          {notificationCategories.map((category) => (
            <View
              key={category.id}
              className="bg-card rounded-2xl p-4 border border-border"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4 flex-1">
                  {/* Icon */}
                  <LinearGradient
                    colors={category.gradient}
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ borderRadius: 24 }}
                  >
                    <Ionicons name={category.icon} size={24} color="white" />
                  </LinearGradient>

                  {/* Text */}
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground mb-1">
                      {category.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {category.description}
                    </Text>
                  </View>
                </View>

                {/* Switch */}
                <Switch
                  value={settings[category.id]}
                  onValueChange={() => toggleSetting(category.id)}
                  trackColor={{ false: "#e2e8f0", true: "#8b5cf6" }}
                  thumbColor={settings[category.id] ? "#ffffff" : "#ffffff"}
                  ios_backgroundColor="#e2e8f0"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View className="mt-8 p-5 bg-secondary rounded-2xl">
          <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mt-1">
              <Ionicons name="information-circle" size={20} color="#2563eb" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-2">
                通知について
              </Text>
              <Text className="text-xs text-muted-foreground leading-relaxed">
                通知は重要な更新をお知らせするために使用されます。
                設定はいつでも変更できます。
                {"\n\n"}
                プッシュ通知を有効にするには、デバイスの設定で通知を許可してください。
              </Text>
            </View>
          </View>
        </View>

        {/* Device Settings Link */}
        <TouchableOpacity className="mt-4 py-4 border border-dashed border-border rounded-xl items-center">
          <View className="flex-row items-center gap-2">
            <Ionicons name="settings-outline" size={20} color="#8b5cf6" />
            <Text className="text-primary font-medium">
              デバイスの通知設定を開く
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
