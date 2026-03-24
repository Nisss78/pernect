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
import { LinearGradient } from "expo-linear-gradient";
import { Id } from "../../../convex/_generated/dataModel";

interface NotificationListScreenProps {
  onBack: () => void;
}

export function NotificationListScreen({
  onBack,
}: NotificationListScreenProps) {
  const notifications = useQuery(api.notifications.listByUser, {});
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleNotificationPress = async (notificationId: Id<"notifications">) => {
    await markAsRead({ notificationId });
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDelete = async (notificationId: Id<"notifications">) => {
    try {
      await deleteNotification({ notificationId });
    } catch (error) {
      console.error("Failed to delete notification:", error);
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

  // 通知タイプごとのスタイルとアイコン
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "friend_request":
        return {
          gradient: ["#8b5cf6", "#a78bfa"] as const,
          icon: "person-add" as const,
          bgColor: "bg-purple-50",
        };
      case "friend_accepted":
        return {
          gradient: ["#10b981", "#34d399"] as const,
          icon: "people" as const,
          bgColor: "bg-green-50",
        };
      case "analysis_complete":
        return {
          gradient: ["#ec4899", "#f472b6"] as const,
          icon: "analytics" as const,
          bgColor: "bg-pink-50",
        };
      case "share_link":
        return {
          gradient: ["#f59e0b", "#fbbf24"] as const,
          icon: "link" as const,
          bgColor: "bg-yellow-50",
        };
      default:
        return {
          gradient: ["#64748b", "#94a3b8"] as const,
          icon: "notifications" as const,
          bgColor: "bg-gray-50",
        };
    }
  };

  if (notifications === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">通知</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} className="px-3 py-1 bg-primary/10 rounded-full">
            <Text className="text-sm text-primary font-medium">すべて既読</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView className="flex-1">
        {notifications.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-4">
              <Ionicons name="notifications-outline" size={40} color="#94a3b8" />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              通知がありません
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              友達リクエストや分析完了の通知がここに表示されます
            </Text>
          </View>
        ) : (
          <View className="gap-3 p-4">
            {notifications.map((notification) => {
              const style = getNotificationStyle(notification.type);
              return (
                <TouchableOpacity
                  key={notification._id}
                  onPress={() => handleNotificationPress(notification._id)}
                  className={`bg-card rounded-2xl p-4 border ${notification.isRead ? 'border-border opacity-60' : 'border-primary/30'}`}
                >
                  <View className="flex-row items-start gap-3">
                    {/* Icon */}
                    <LinearGradient
                      colors={style.gradient}
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ borderRadius: 24 }}
                    >
                      <Ionicons name={style.icon} size={24} color="white" />
                    </LinearGradient>

                    {/* Content */}
                    <View className="flex-1">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text
                            className={`text-base font-semibold text-foreground mb-1 ${!notification.isRead ? 'text-primary' : ''}`}
                          >
                            {notification.title}
                          </Text>
                          <Text className="text-sm text-muted-foreground">
                            {notification.message}
                          </Text>
                          <Text className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(notification.createdAt)}
                          </Text>
                        </View>

                        {/* Actions */}
                        <TouchableOpacity
                          onPress={() => handleDelete(notification._id)}
                          className="p-2 -mr-2"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Unread indicator */}
                  {!notification.isRead && (
                    <View className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
