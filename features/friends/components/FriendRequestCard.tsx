import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { Id } from "../../../convex/_generated/dataModel";

interface FriendRequestCardProps {
  request: {
    _id: Id<"friendships">;
    requestedAt: number;
    requester?: {
      _id: Id<"users">;
      name: string | null | undefined;
      userId: string | null | undefined;
      image: string | null | undefined;
      mbti: string | null | undefined;
    } | null;
    receiver?: {
      _id: Id<"users">;
      name: string | null | undefined;
      userId: string | null | undefined;
      image: string | null | undefined;
      mbti: string | null | undefined;
    } | null;
  };
  type: "received" | "sent";
  onAccept?: (friendshipId: Id<"friendships">) => void;
  onReject?: (friendshipId: Id<"friendships">) => void;
  onCancel?: (friendshipId: Id<"friendships">) => void;
  isLoading?: boolean;
}

export function FriendRequestCard({
  request,
  type,
  onAccept,
  onReject,
  onCancel,
  isLoading,
}: FriendRequestCardProps) {
  const user = type === "received" ? request.requester : request.receiver;
  const timeAgo = getTimeAgo(request.requestedAt);

  if (!user) return null;

  return (
    <View className="p-4 bg-card rounded-2xl border border-border mb-3">
      <View className="flex-row items-center">
        {/* アバター */}
        <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center mr-3">
          {user.image ? (
            <Image
              source={{ uri: user.image }}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <Ionicons name="person" size={24} color="#8b5cf6" />
          )}
        </View>

        {/* 情報 */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {user.name || "ユーザー"}
          </Text>
          <View className="flex-row items-center gap-2">
            {user.userId && (
              <Text className="text-sm text-muted-foreground">@{user.userId}</Text>
            )}
            {user.mbti && (
              <View className="px-2 py-0.5 bg-purple-100 rounded-full">
                <Text className="text-xs text-purple-600 font-medium">
                  {user.mbti}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 時間 */}
        <Text className="text-xs text-muted-foreground">{timeAgo}</Text>
      </View>

      {/* アクションボタン */}
      <View className="flex-row mt-3 gap-2">
        {type === "received" && (
          <>
            <TouchableOpacity
              onPress={() => onAccept?.(request._id)}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-primary rounded-xl items-center justify-center"
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">承認</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onReject?.(request._id)}
              disabled={isLoading}
              className="flex-1 py-2.5 bg-secondary rounded-xl items-center justify-center"
              activeOpacity={0.7}
            >
              <Text className="text-muted-foreground font-semibold">拒否</Text>
            </TouchableOpacity>
          </>
        )}
        {type === "sent" && (
          <TouchableOpacity
            onPress={() => onCancel?.(request._id)}
            disabled={isLoading}
            className="flex-1 py-2.5 bg-secondary rounded-xl items-center justify-center"
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#64748b" />
            ) : (
              <Text className="text-muted-foreground font-semibold">
                キャンセル
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}週間前`;

  const months = Math.floor(days / 30);
  return `${months}ヶ月前`;
}
