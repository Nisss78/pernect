import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { FriendCard } from "../components/FriendCard";
import { useFriendsList } from "../hooks/useFriendsList";

interface FriendsMatchScreenProps {
  onBack: () => void;
  onFriendsListPress: () => void;
  onRequestsPress: () => void;
  onAddFriendPress: () => void;
  onFriendPress: (friendId: Id<"users">) => void;
  onAnalysisPress: (friendId: Id<"users">) => void;
}

export function FriendsMatchScreen({
  onBack,
  onFriendsListPress,
  onRequestsPress,
  onAddFriendPress,
  onFriendPress,
  onAnalysisPress,
}: FriendsMatchScreenProps) {
  const { friends, friendsCount, pendingCount } = useFriendsList();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full bg-secondary mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3 flex-1">
          <LinearGradient
            colors={["#ec4899", "#f43f5e"]}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ borderRadius: 20 }}
          >
            <Ionicons name="people" size={20} color="white" />
          </LinearGradient>
          <View>
            <Text className="text-lg font-bold text-foreground">
              友達と相性チェック
            </Text>
            <Text className="text-xs text-muted-foreground">
              友達を招待して診断
            </Text>
          </View>
        </View>
        {/* ヘッダーアクション */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onRequestsPress}
            className="relative w-10 h-10 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="mail" size={20} color="#64748b" />
            {pendingCount > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddFriendPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-primary"
          >
            <Ionicons name="person-add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 友達がいない場合 */}
        {friendsCount === 0 ? (
          <View className="px-6 py-8">
            <View className="items-center mb-8">
              <LinearGradient
                colors={["#ec4899", "#f43f5e"]}
                className="w-24 h-24 rounded-full items-center justify-center mb-4"
                style={{ borderRadius: 48 }}
              >
                <Ionicons name="people" size={48} color="white" />
              </LinearGradient>
              <Text className="text-2xl font-bold text-foreground text-center mb-2">
                友達を追加しよう
              </Text>
              <Text className="text-muted-foreground text-center">
                友達と一緒に相性診断や恋愛診断を{"\n"}楽しみましょう
              </Text>
            </View>

            {/* Features */}
            <View className="gap-4 mb-8">
              <View className="flex-row items-center gap-4 bg-secondary rounded-2xl p-4">
                <View className="w-12 h-12 rounded-xl bg-pink-100 items-center justify-center">
                  <Ionicons name="heart" size={24} color="#ec4899" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    相性診断
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    友達との性格相性を詳しく分析
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4 bg-secondary rounded-2xl p-4">
                <View className="w-12 h-12 rounded-xl bg-purple-100 items-center justify-center">
                  <Ionicons name="sparkles" size={24} color="#8b5cf6" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    AI分析
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    AIが2人の診断結果を徹底分析
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4 bg-secondary rounded-2xl p-4">
                <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center">
                  <Ionicons name="qr-code" size={24} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    QRコードで追加
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    QRコードをスキャンして簡単追加
                  </Text>
                </View>
              </View>
            </View>

            {/* Add Friend Button */}
            <TouchableOpacity onPress={onAddFriendPress} activeOpacity={0.8}>
              <LinearGradient
                colors={["#ec4899", "#f43f5e"]}
                className="rounded-2xl py-4 items-center"
                style={{ borderRadius: 16 }}
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="person-add" size={24} color="white" />
                  <Text className="text-white text-lg font-bold">
                    友達を追加する
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          // 友達がいる場合
          <View className="px-5 py-6">
            {/* 友達一覧セクション */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-foreground">
                友達一覧
              </Text>
              <TouchableOpacity
                onPress={onFriendsListPress}
                className="flex-row items-center"
              >
                <Text className="text-primary text-sm mr-1">すべて見る</Text>
                <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
              </TouchableOpacity>
            </View>

            {/* 友達リスト（最大3人） */}
            {friends.slice(0, 3).map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                onPress={onFriendPress}
                onAnalysisPress={onAnalysisPress}
              />
            ))}

            {/* 相性診断を始めるセクション */}
            <View className="mt-6 p-5 bg-gradient-to-r rounded-2xl border border-border">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-xl bg-pink-100 items-center justify-center">
                  <Ionicons name="analytics" size={24} color="#ec4899" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    相性分析
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    友達をタップしてAI分析を開始
                  </Text>
                </View>
              </View>
              <Text className="text-xs text-muted-foreground">
                上のリストから友達を選んで、
                <Ionicons name="analytics" size={12} color="#8b5cf6" />
                ボタンをタップすると相性分析が始まります
              </Text>
            </View>

            {/* もっと友達を追加 */}
            <TouchableOpacity
              onPress={onAddFriendPress}
              className="mt-4 py-3 border border-dashed border-border rounded-xl items-center"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="add-circle-outline" size={20} color="#8b5cf6" />
                <Text className="text-primary font-medium">
                  もっと友達を追加
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
