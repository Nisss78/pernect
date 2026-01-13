import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { FriendCard } from "../components/FriendCard";
import { useFriendsList } from "../hooks/useFriendsList";

interface FriendsListScreenProps {
  onBack: () => void;
  onFriendPress: (friendId: Id<"users">) => void;
  onAnalysisPress: (friendId: Id<"users">) => void;
  onRequestsPress: () => void;
  onAddFriendPress: () => void;
}

export function FriendsListScreen({
  onBack,
  onFriendPress,
  onAnalysisPress,
  onRequestsPress,
  onAddFriendPress,
}: FriendsListScreenProps) {
  const { friends, friendsCount, pendingCount, isLoading } = useFriendsList();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View className="px-5 pt-14 pb-4">
          <TouchableOpacity
            onPress={onBack}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
            <Text className="ml-2 text-foreground">戻る</Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-foreground">友達一覧</Text>
            <View className="flex-row gap-2">
              {/* 申請ボタン */}
              <TouchableOpacity
                onPress={onRequestsPress}
                className="relative w-10 h-10 items-center justify-center rounded-full bg-secondary"
              >
                <Ionicons name="mail" size={22} color="#64748b" />
                {pendingCount > 0 && (
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {/* 友達追加ボタン */}
              <TouchableOpacity
                onPress={onAddFriendPress}
                className="w-10 h-10 items-center justify-center rounded-full bg-primary"
              >
                <Ionicons name="person-add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-muted-foreground text-sm">
            {friendsCount}人の友達
          </Text>
        </View>

        {/* コンテンツ */}
        <View className="px-5 pb-32">
          {isLoading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="#8b5cf6" />
            </View>
          ) : friends.length === 0 ? (
            <View className="items-center justify-center py-12">
              <View className="w-20 h-20 bg-secondary rounded-full items-center justify-center mb-4">
                <Ionicons name="people-outline" size={40} color="#94a3b8" />
              </View>
              <Text className="text-lg font-semibold text-foreground mb-2">
                まだ友達がいません
              </Text>
              <Text className="text-muted-foreground text-center mb-6">
                QRコードをスキャンするか、{"\n"}
                ユーザーIDで検索して友達を追加しましょう
              </Text>
              <TouchableOpacity
                onPress={onAddFriendPress}
                className="px-6 py-3 bg-primary rounded-xl"
              >
                <Text className="text-white font-semibold">友達を追加する</Text>
              </TouchableOpacity>
            </View>
          ) : (
            friends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                onPress={onFriendPress}
                onAnalysisPress={onAnalysisPress}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
