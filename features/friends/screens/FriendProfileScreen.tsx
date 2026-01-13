import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useFriendsList } from "../hooks/useFriendsList";

interface FriendProfileScreenProps {
  friendId: Id<"users">;
  onBack: () => void;
  onAnalysisPress: (friendId: Id<"users">) => void;
}

export function FriendProfileScreen({
  friendId,
  onBack,
  onAnalysisPress,
}: FriendProfileScreenProps) {
  const friendProfile = useQuery(api.profileSharing.getFriendProfile, {
    friendId,
  });
  const { removeFriend, isRemoving } = useFriendsList();

  const handleRemoveFriend = () => {
    Alert.alert(
      "友達を解除",
      `${friendProfile?.name || "このユーザー"}さんとの友達関係を解除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "解除",
          style: "destructive",
          onPress: async () => {
            const result = await removeFriend(friendId);
            if (result.success) {
              onBack();
            } else {
              Alert.alert("エラー", "友達の解除に失敗しました");
            }
          },
        },
      ]
    );
  };

  if (!friendProfile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View className="px-5 pt-14 pb-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={onBack}
              className="flex-row items-center"
            >
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
              <Text className="ml-2 text-foreground">戻る</Text>
            </TouchableOpacity>

            {friendProfile.isFriend && (
              <TouchableOpacity
                onPress={handleRemoveFriend}
                disabled={isRemoving === friendId}
                className="px-4 py-2 rounded-xl bg-red-50"
              >
                <Text className="text-red-500 font-medium">友達解除</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* プロフィールカード */}
        <View className="px-5 mb-6">
          <View className="bg-card rounded-3xl border border-border p-6 items-center">
            {/* アバター */}
            <View className="w-24 h-24 rounded-full bg-secondary items-center justify-center mb-4">
              {friendProfile.image ? (
                <Image
                  source={{ uri: friendProfile.image }}
                  className="w-24 h-24 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={48} color="#8b5cf6" />
              )}
            </View>

            {/* 名前 */}
            <Text className="text-2xl font-bold text-foreground mb-1">
              {friendProfile.name || "ユーザー"}
            </Text>
            {friendProfile.userId && (
              <Text className="text-muted-foreground mb-3">
                @{friendProfile.userId}
              </Text>
            )}

            {/* タグ */}
            <View className="flex-row gap-2 mb-4">
              {friendProfile.mbti && (
                <View className="px-3 py-1 bg-purple-100 rounded-full">
                  <Text className="text-purple-600 font-medium">
                    {friendProfile.mbti}
                  </Text>
                </View>
              )}
              {friendProfile.isFriend && (
                <View className="px-3 py-1 bg-green-100 rounded-full">
                  <Text className="text-green-600 font-medium">友達</Text>
                </View>
              )}
            </View>

            {/* 自己紹介 */}
            {friendProfile.bio && (
              <Text className="text-muted-foreground text-center">
                {friendProfile.bio}
              </Text>
            )}
          </View>
        </View>

        {/* 相性分析ボタン */}
        {friendProfile.isFriend && (
          <View className="px-5 mb-6">
            <TouchableOpacity
              onPress={() => onAnalysisPress(friendId)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-4"
              activeOpacity={0.8}
              style={{ backgroundColor: "#ec4899" }}
            >
              <View className="flex-row items-center justify-center gap-3">
                <Ionicons name="analytics" size={24} color="white" />
                <Text className="text-white text-lg font-bold">
                  相性を分析する
                </Text>
              </View>
              <Text className="text-white/80 text-center text-sm mt-1">
                AIが2人の診断結果から相性を分析します
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 診断結果履歴（友達の場合のみ） */}
        {friendProfile.isFriend && friendProfile.testResults && (
          <View className="px-5 mb-6">
            <Text className="text-lg font-bold text-foreground mb-4">
              診断結果
            </Text>

            {friendProfile.testResults.length === 0 ? (
              <View className="bg-secondary rounded-2xl p-6 items-center">
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#94a3b8"
                />
                <Text className="text-muted-foreground mt-2">
                  まだ診断結果がありません
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {friendProfile.testResults.map((result) => (
                  <View
                    key={result._id}
                    className="bg-card rounded-2xl border border-border p-4 flex-row items-center"
                  >
                    <View className="w-12 h-12 bg-purple-100 rounded-xl items-center justify-center mr-4">
                      <Ionicons name="checkmark-circle" size={24} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {result.resultType}
                      </Text>
                      {result.testSlug && (
                        <Text className="text-sm text-muted-foreground">
                          {getTestName(result.testSlug)}
                        </Text>
                      )}
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {formatDate(result.completedAt)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* スペーサー */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}

function getTestName(slug: string): string {
  const testNames: Record<string, string> = {
    "mbti": "MBTI診断",
    "big5": "BIG5診断",
    "last-lover": "最後の恋人診断",
    "enneagram": "エニアグラム",
    "career": "キャリア診断",
  };
  return testNames[slug] || slug;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}
