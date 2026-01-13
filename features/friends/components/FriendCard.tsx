import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Id } from "../../../convex/_generated/dataModel";

interface FriendCardProps {
  friend: {
    _id: Id<"users">;
    name: string | null | undefined;
    userId: string | null | undefined;
    image: string | null | undefined;
    mbti: string | null | undefined;
    latestResult?: {
      testSlug: string | null | undefined;
      resultType: string;
    } | null;
  };
  onPress: (friendId: Id<"users">) => void;
  onAnalysisPress?: (friendId: Id<"users">) => void;
}

export function FriendCard({
  friend,
  onPress,
  onAnalysisPress,
}: FriendCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(friend._id)}
      className="flex-row items-center p-4 bg-card rounded-2xl border border-border mb-3"
      activeOpacity={0.7}
    >
      {/* アバター */}
      <View className="w-14 h-14 rounded-full bg-secondary items-center justify-center mr-4">
        {friend.image ? (
          <Image
            source={{ uri: friend.image }}
            className="w-14 h-14 rounded-full"
          />
        ) : (
          <Ionicons name="person" size={28} color="#8b5cf6" />
        )}
      </View>

      {/* 情報 */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">
          {friend.name || "ユーザー"}
        </Text>
        {friend.userId && (
          <Text className="text-sm text-muted-foreground">@{friend.userId}</Text>
        )}
        {/* タグ */}
        <View className="flex-row mt-1 gap-2">
          {friend.mbti && (
            <View className="px-2 py-0.5 bg-purple-100 rounded-full">
              <Text className="text-xs text-purple-600 font-medium">
                {friend.mbti}
              </Text>
            </View>
          )}
          {friend.latestResult?.resultType && (
            <View className="px-2 py-0.5 bg-blue-100 rounded-full">
              <Text className="text-xs text-blue-600 font-medium">
                {friend.latestResult.resultType}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* アクションボタン */}
      {onAnalysisPress && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onAnalysisPress(friend._id);
          }}
          className="w-10 h-10 items-center justify-center rounded-full bg-purple-100"
        >
          <Ionicons name="analytics" size={20} color="#8b5cf6" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
