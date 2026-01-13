import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { QRCodeModal } from "../components/QRCodeModal";
import { QRScannerModal } from "../components/QRScannerModal";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { useUserSearch } from "../hooks/useUserSearch";

interface AddFriendScreenProps {
  onBack: () => void;
  onUserFound?: (userId: string) => void;
}

export function AddFriendScreen({ onBack, onUserFound }: AddFriendScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);

  const { searchUser, searchResult, isSearching, clearSearch } = useUserSearch();
  const { sendRequest, isSending } = useFriendRequests();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // @を除去して検索
      const userId = searchQuery.replace(/^@/, "").trim();
      searchUser(userId);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;

    const result = await sendRequest(searchResult.userId!);
    if (result.success) {
      if (result.status === "auto_accepted") {
        Alert.alert("友達になりました", `${searchResult.name}さんと友達になりました！`);
      } else {
        Alert.alert("申請を送信しました", `${searchResult.name}さんに友達申請を送信しました`);
      }
      clearSearch();
      setSearchQuery("");
    } else {
      Alert.alert("エラー", "申請の送信に失敗しました");
    }
  };

  const handleQRScan = async (userId: string) => {
    // スキャンしたユーザーIDで検索
    searchUser(userId);
    if (onUserFound) {
      onUserFound(userId);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="px-5 pt-14 pb-4">
        <TouchableOpacity
          onPress={onBack}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
          <Text className="ml-2 text-foreground">戻る</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-foreground mb-2">
          友達を追加
        </Text>
        <Text className="text-muted-foreground text-sm">
          ユーザーIDで検索するか、QRコードをスキャン
        </Text>
      </View>

      {/* QRコードボタン */}
      <View className="px-5 mb-6">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => setIsQRCodeVisible(true)}
            className="flex-1"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8b5cf6", "#2563eb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="qr-code" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-white font-semibold">マイQRコード</Text>
                  <Text className="text-white/70 text-xs">表示する</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsQRScannerVisible(true)}
            className="flex-1"
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#ec4899", "#f43f5e"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, padding: 16 }}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="scan" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-white font-semibold">QRスキャン</Text>
                  <Text className="text-white/70 text-xs">読み取る</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* 検索バー */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-secondary rounded-xl px-4">
            <Ionicons name="at" size={20} color="#94a3b8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="ユーザーIDを入力"
              placeholderTextColor="#94a3b8"
              className="flex-1 py-3.5 px-2 text-foreground"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  clearSearch();
                }}
              >
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="w-12 h-12 bg-primary rounded-xl items-center justify-center"
          >
            {isSearching ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="search" size={22} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 検索結果 */}
      <View className="px-5">
        {searchResult === null && !isSearching && searchQuery.length > 0 && (
          <View className="items-center py-8">
            <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mb-3">
              <Ionicons name="person-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-muted-foreground">
              ユーザーが見つかりませんでした
            </Text>
          </View>
        )}

        {searchResult && (
          <View className="bg-card rounded-2xl border border-border p-4">
            <View className="flex-row items-center">
              {/* アバター */}
              <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center mr-4">
                {searchResult.image ? (
                  <Image
                    source={{ uri: searchResult.image }}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <Ionicons name="person" size={32} color="#8b5cf6" />
                )}
              </View>

              {/* 情報 */}
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  {searchResult.name || "ユーザー"}
                </Text>
                <Text className="text-muted-foreground">
                  @{searchResult.userId}
                </Text>
                {searchResult.mbti && (
                  <View className="flex-row mt-1">
                    <View className="px-2 py-0.5 bg-purple-100 rounded-full">
                      <Text className="text-xs text-purple-600 font-medium">
                        {searchResult.mbti}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* 申請ボタン */}
            <TouchableOpacity
              onPress={handleSendRequest}
              disabled={isSending}
              className="mt-4 py-3 bg-primary rounded-xl items-center"
              activeOpacity={0.7}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="person-add" size={20} color="white" />
                  <Text className="text-white font-semibold">友達申請を送る</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* 説明セクション */}
      {!searchResult && !isSearching && searchQuery.length === 0 && (
        <View className="px-5 mt-8">
          <Text className="text-lg font-bold text-foreground mb-4">
            友達を追加する方法
          </Text>

          <View className="gap-4">
            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-purple-100 rounded-xl items-center justify-center">
                <Text className="text-purple-600 font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  ユーザーIDで検索
                </Text>
                <Text className="text-sm text-muted-foreground">
                  友達のユーザーID（@username）を入力して検索
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-pink-100 rounded-xl items-center justify-center">
                <Text className="text-pink-600 font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  QRコードをスキャン
                </Text>
                <Text className="text-sm text-muted-foreground">
                  友達のQRコードをカメラでスキャンして追加
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center">
                <Text className="text-blue-600 font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  QRコードをシェア
                </Text>
                <Text className="text-sm text-muted-foreground">
                  自分のQRコードを友達に見せて追加してもらう
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* モーダル */}
      <QRCodeModal
        visible={isQRCodeVisible}
        onClose={() => setIsQRCodeVisible(false)}
      />
      <QRScannerModal
        visible={isQRScannerVisible}
        onClose={() => setIsQRScannerVisible(false)}
        onScan={handleQRScan}
      />
    </View>
  );
}
