import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Image,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { Id } from "../../../convex/_generated/dataModel";
import { LinearGradient } from "expo-linear-gradient";

interface UserSearchScreenProps {
  onBack: () => void;
  onUserPress: (userId: string) => void;
}

interface SearchResult {
  _id: Id<"users">;
  userId: string | undefined;
  name: string | undefined;
  image: string | undefined;
  bio: string | undefined;
  profileVisibility: string | undefined;
}

export function UserSearchScreen({
  onBack,
  onUserPress,
}: UserSearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // デバウンス処理（300ms）
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 検索クエリが2文字未満の場合は空の配列を返す
  const shouldSkip = debouncedQuery.length < 2;
  const searchResults = useQuery(
    api.users.searchUsers,
    shouldSkip ? "skip" : { query: debouncedQuery, limit: 20 }
  );

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleUserPress = (user: SearchResult) => {
    Keyboard.dismiss();
    onUserPress(user.userId || "");
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-foreground">ユーザー検索</Text>
        <View className="w-7" />
      </View>

      {/* Search Input */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center bg-secondary rounded-2xl px-4 py-3">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            className="flex-1 ml-3 text-base text-foreground"
            placeholder="ユーザーIDまたは名前で検索"
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-xs text-muted-foreground mt-2 ml-1">
          @username または 名前で検索
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Search Results */}
        {searchQuery.length >= 2 && (
          <View className="px-6 py-4">
            {searchResults === undefined ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#8b5cf6" />
              </View>
            ) : !Array.isArray(searchResults) || (searchResults as SearchResult[]).length === 0 ? (
              <View className="items-center py-8">
                <View className="w-16 h-16 rounded-full bg-muted items-center justify-center mb-3">
                  <Ionicons name="search" size={32} color="#94a3b8" />
                </View>
                {searchQuery.length >= 2 ? (
                  <>
                    <Text className="text-base font-semibold text-foreground mb-1">
                      検索結果がありません
                    </Text>
                    <Text className="text-sm text-muted-foreground text-center">
                      別のキーワードで試してみてください
                    </Text>
                  </>
                ) : (
                  <Text className="text-sm text-muted-foreground">
                    キーワードを入力して検索
                  </Text>
                )}
              </View>
            ) : (
              <View className="gap-3">
                <Text className="text-sm text-muted-foreground mb-2">
                  {(searchResults as SearchResult[]).length}件の結果
                </Text>
                {(searchResults as SearchResult[]).map((user) => (
                  <TouchableOpacity
                    key={user._id}
                    onPress={() => handleUserPress(user)}
                    className="bg-card rounded-2xl p-4 border border-border flex-row items-center gap-4"
                  >
                    {/* Avatar */}
                    <View className="w-14 h-14 rounded-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                      {user.image ? (
                        <Image
                          source={{ uri: user.image }}
                          style={{ width: 56, height: 56, borderRadius: 28 }}
                        />
                      ) : (
                        <Text className="text-white text-xl font-bold">
                          {(user.name || "?")[0]}
                        </Text>
                      )}
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-semibold text-foreground">
                          {user.name || "匿名ユーザー"}
                        </Text>
                        {user.profileVisibility === "public" && (
                          <View className="px-2 py-0.5 bg-green-100 rounded-full">
                            <Text className="text-xs text-green-700">公開</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-sm text-muted-foreground">
                        @{user.userId || "unknown"}
                      </Text>
                      {user.bio && (
                        <Text
                          className="text-sm text-muted-foreground mt-1"
                          numberOfLines={1}
                        >
                          {user.bio}
                        </Text>
                      )}
                    </View>

                    {/* Arrow */}
                    <Ionicons name="chevron-forward" size={20} color="#64748b" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Initial State - No Search */}
        {searchQuery.length < 2 && (
          <View className="px-6 py-8">
            <View className="items-center mb-8">
              <LinearGradient
                colors={["#8b5cf6", "#ec4899"]}
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ borderRadius: 40 }}
              >
                <Ionicons name="search" size={40} color="white" />
              </LinearGradient>
              <Text className="text-xl font-bold text-foreground mb-2">
                ユーザーを探す
              </Text>
              <Text className="text-muted-foreground text-center">
                ユーザーIDまたは名前で検索できます{"\n"}
                友達や気になる人のプロフィールをチェック
              </Text>
            </View>

            {/* Search Tips */}
            <View className="bg-secondary rounded-2xl p-5">
              <Text className="text-sm font-semibold text-foreground mb-3">
                検索のコツ
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-start gap-3">
                  <View className="w-6 h-6 rounded-full bg-purple-100 items-center justify-center mt-0.5">
                    <Text className="text-xs text-purple-700 font-bold">1</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-foreground">
                      ユーザーIDは@usernameで検索
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-3">
                  <View className="w-6 h-6 rounded-full bg-pink-100 items-center justify-center mt-0.5">
                    <Text className="text-xs text-pink-700 font-bold">2</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-foreground">
                      名前の一部でも検索可能
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-start gap-3">
                  <View className="w-6 h-6 rounded-full bg-blue-100 items-center justify-center mt-0.5">
                    <Text className="text-xs text-blue-700 font-bold">3</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-foreground">
                      2文字以上入力で検索開始
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
