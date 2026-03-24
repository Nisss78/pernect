import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Image,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Id } from "../../../convex/_generated/dataModel";

interface PublicProfileScreenProps {
  userId: string;
  onBack: () => void;
}

export function PublicProfileScreen({
  userId,
  onBack,
}: PublicProfileScreenProps) {
  const profileData = useQuery(api.users.getPublicProfile, {
    userId,
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${profileData?.user?.name || "ユーザー"}さんのプロフィールをチェック！\nhttps://pernect.app/u/${userId}`,
        url: `https://pernect.app/u/${userId}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // ローディング状態
  if (profileData === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  // エラー状態
  if ("error" in profileData) {
    return (
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center px-6 pt-14 pb-4 border-b border-border bg-background">
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="chevron-back" size={28} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">プロフィール</Text>
          <View className="w-7" />
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
            <Ionicons name="lock-closed" size={40} color="#94a3b8" />
          </View>
          <Text className="text-lg font-semibold text-foreground mb-2">
            表示できません
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            {profileData.error}
          </Text>
        </View>
      </View>
    );
  }

  const { user, testResults } = profileData;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">プロフィール</Text>
        <TouchableOpacity onPress={handleShare} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="share-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="px-6 pt-6 pb-6">
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 mb-3">
              {user.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                />
              ) : (
                <Text className="text-white text-3xl font-bold">
                  {(user.name || "?")[0]}
                </Text>
              )}
            </View>

            <Text className="text-2xl font-bold text-foreground mb-1">
              {user.name || "匿名ユーザー"}
            </Text>
            <Text className="text-base text-muted-foreground mb-3">
              @{user.userId || "unknown"}
            </Text>

            {user.mbti && (
              <View className="px-3 py-1 bg-purple-100 rounded-full">
                <Text className="text-sm font-semibold text-purple-700">{user.mbti}</Text>
              </View>
            )}
          </View>

          {/* Bio */}
          {user.bio && (
            <View className="bg-secondary rounded-2xl p-4 mb-4">
              <Text className="text-sm text-foreground">{user.bio}</Text>
            </View>
          )}

          {/* Info Cards */}
          <View className="flex-row gap-3">
            {user.occupation && (
              <View className="flex-1 bg-secondary rounded-xl p-3 items-center">
                <Ionicons name="briefcase" size={20} color="#8b5cf6" />
                <Text className="text-xs text-muted-foreground mt-1">{user.occupation}</Text>
              </View>
            )}

            <View className="flex-1 bg-secondary rounded-xl p-3 items-center">
              <Ionicons name="analytics" size={20} color="#ec4899" />
              <Text className="text-xs text-muted-foreground mt-1">
                {testResults.length} 診断完了
              </Text>
            </View>
          </View>
        </View>

        {/* Test Results Section */}
        {testResults.length > 0 && (
          <View className="px-6 pb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-foreground">診断結果</Text>
              <Text className="text-sm text-muted-foreground">
                最新 {Math.min(testResults.length, 5)}件
              </Text>
            </View>

            <View className="gap-3">
              {testResults.slice(0, 5).map((result: any) => (
                <View
                  key={result._id}
                  className="bg-card rounded-2xl p-4 border border-border"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                      <LinearGradient
                        colors={["#8b5cf6", "#2563eb"]}
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ borderRadius: 12 }}
                      >
                        <Ionicons name="clipboard" size={20} color="white" />
                      </LinearGradient>
                      <View>
                        <Text className="text-base font-semibold text-foreground">
                          {result.resultType}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {new Date(result.completedAt).toLocaleDateString("ja-JP")}
                        </Text>
                      </View>
                    </View>
                    <View className="px-2 py-1 bg-green-100 rounded-full">
                      <Text className="text-xs text-green-700">公開中</Text>
                    </View>
                  </View>

                  {result.analysis?.summary && (
                    <Text className="text-sm text-muted-foreground">
                      {result.analysis.summary}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Privacy Notice */}
        <View className="px-6 pb-6">
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <View className="flex-row items-start gap-3">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mt-0.5">
                <Ionicons name="information-circle" size={16} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground mb-1">
                  公開プロフィール
                </Text>
                <Text className="text-xs text-muted-foreground leading-relaxed">
                  {user.profileVisibility === "public"
                    ? "このプロフィールは全員に公開されています"
                    : user.profileVisibility === "friends_only"
                    ? "このプロフィールは友達のみに公開されています"
                    : "プロフィール設定"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
