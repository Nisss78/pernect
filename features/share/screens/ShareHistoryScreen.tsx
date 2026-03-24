import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";

interface ShareHistoryScreenProps {
  onBack: () => void;
}

export default function ShareHistoryScreen({
  onBack,
}: ShareHistoryScreenProps) {
  const shareLinks = useQuery(api.shareLinks.listByUser);
  const deleteShareLink = useMutation(api.shareLinks.deleteShareLink);

  const handleDelete = async (shareId: string) => {
    try {
      await deleteShareLink({ shareId });
    } catch (error) {
      console.error("Failed to delete share link:", error);
    }
  };

  // 日付フォーマット用ヘルパー関数
  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}秒前`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}時間前`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}日前`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}ヶ月前`;
    const years = Math.floor(months / 12);
    return `${years}年前`;
  };

  if (shareLinks === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">共有履歴</Text>
        <View className="w-7" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-6">
        {shareLinks.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
              <Ionicons name="link-outline" size={40} color="#94a3b8" />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              共有履歴がありません
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              診断結果をシェアすると、ここに履歴が表示されます
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {shareLinks.map((link) => (
              <View
                key={link._id}
                className="bg-card rounded-2xl p-5 border border-border"
              >
                {/* Header */}
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground mb-1">
                      {link.test?.title || "診断結果"}
                    </Text>
                    <Text className="text-sm text-muted-foreground">
                      {link.result?.resultType || "-"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(link.shareId)}
                    className="p-2 -mr-2"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                {/* Stats */}
                <View className="flex-row items-center gap-4 mb-3">
                  <View className="flex-row items-center">
                    <Ionicons name="eye-outline" size={16} color="#64748b" />
                    <Text className="text-sm text-muted-foreground ml-1">
                      {link.accessCount} 回閲覧
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="time-outline" size={16} color="#64748b" />
                    <Text className="text-sm text-muted-foreground ml-1">
                      {formatTimeAgo(link.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View className="flex-row items-center">
                  <View
                    className={`px-2 py-1 rounded-full ${
                      link.isExpired
                        ? "bg-gray-100"
                        : link.expiresAt
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        link.isExpired
                          ? "text-gray-600"
                          : link.expiresAt
                          ? "text-blue-600"
                          : "text-green-600"
                      }`}
                    >
                      {link.isExpired
                        ? "期限切れ"
                        : link.expiresAt
                        ? `有効期限: ${new Date(link.expiresAt).toLocaleDateString(
                            "ja-JP"
                          )}`
                        : "無期限"}
                    </Text>
                  </View>
                </View>

                {/* Link Preview */}
                <View className="mt-3 bg-muted rounded-xl p-3">
                  <Text className="text-xs text-muted-foreground font-mono">
                    {`https://pernect.app/share/${link.shareId}`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
