import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Id } from "../../../convex/_generated/dataModel";
import { useFriendsList } from "../hooks/useFriendsList";
import { useFriendRequests } from "../hooks/useFriendRequests";
import { useUserSearch } from "../hooks/useUserSearch";
import { toastHelpers } from "@/lib/toast-helpers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const AVATAR_SIZE = 105;
const SMALL_AVATAR_SIZE = 60;
// 菱形の横幅（ペア行の左右アバター中心間の距離）
const PAIR_SPREAD = SCREEN_WIDTH * 0.62;
// 行間の重なり（大きいほど詰まる）
const ROW_OVERLAP = 58;

// デモモード（確認用：falseに戻すと本番データに切り替わる）
const DEMO_MODE = false;

const DEMO_FRIENDS = [
  { _id: "demo1" as Id<"users">, name: "Yuki", userId: "yuki_123", image: "https://i.pravatar.cc/150?img=1", mbti: "ENFP" },
  { _id: "demo2" as Id<"users">, name: "Hana", userId: "hana_456", image: "https://i.pravatar.cc/150?img=5", mbti: "INTJ" },
  { _id: "demo3" as Id<"users">, name: "Ren", userId: "ren_789", image: "https://i.pravatar.cc/150?img=3", mbti: "INFP" },
  { _id: "demo4" as Id<"users">, name: "Sora", userId: "sora_101", image: "https://i.pravatar.cc/150?img=8", mbti: "ESTP" },
  { _id: "demo5" as Id<"users">, name: "Mio", userId: "mio_202", image: "https://i.pravatar.cc/150?img=9", mbti: "ISFJ" },
  { _id: "demo6" as Id<"users">, name: "Kaito", userId: "kaito_303", image: "https://i.pravatar.cc/150?img=11", mbti: "ENTP" },
  { _id: "demo7" as Id<"users">, name: "Aoi", userId: "aoi_404", image: "https://i.pravatar.cc/150?img=16", mbti: "INFJ" },
  { _id: "demo8" as Id<"users">, name: "Riku", userId: "riku_505", image: "https://i.pravatar.cc/150?img=12", mbti: null },
  { _id: "demo9" as Id<"users">, name: "Mei", userId: "mei_606", image: "https://i.pravatar.cc/150?img=20", mbti: "ESTJ" },
];

type FriendItem = {
  _id: Id<"users">;
  name: string | null | undefined;
  userId: string | null | undefined;
  image: string | null | undefined;
  mbti: string | null | undefined;
};

interface FriendsMatchScreenProps {
  onBack: () => void;
  onNavigate?: (screen: "home" | "profile" | "friends") => void;
  onActionPress?: () => void;
  onFriendsListPress: () => void;
  onRequestsPress: () => void;
  onAddFriendPress: () => void;
  onFriendPress: (friendId: Id<"users">) => void;
  onAnalysisPress: (friendId: Id<"users">) => void;
}

// 円形アバター（サイズ指定可能）
function CircleAvatar({
  friend,
  size,
  onPress,
}: {
  friend: FriendItem;
  size: number;
  onPress: (friendId: Id<"users">) => void;
}) {
  const borderWidth = 2.5;
  const innerPadding = 2;
  const imageSize = size - borderWidth * 2 - innerPadding * 2;

  return (
    <TouchableOpacity
      onPress={() => onPress(friend._id)}
      className="items-center"
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={["#8b5cf6", "#3b82f6", "#06b6d4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          padding: borderWidth,
        }}
      >
        <View
          className="bg-background"
          style={{
            width: size - borderWidth * 2,
            height: size - borderWidth * 2,
            borderRadius: (size - borderWidth * 2) / 2,
            padding: innerPadding,
          }}
        >
          {friend.image ? (
            <Image
              source={{ uri: friend.image }}
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
              }}
            />
          ) : (
            <View
              className="bg-secondary items-center justify-center"
              style={{
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
              }}
            >
              <Ionicons name="person" size={imageSize * 0.4} color="#8b5cf6" />
            </View>
          )}
        </View>
      </LinearGradient>

      {/* 名前 */}
      <Text
        className="text-sm font-bold text-foreground mt-1.5"
        numberOfLines={1}
      >
        {friend.name?.split(" ")[0] || "ユーザー"}
      </Text>

      {/* MBTI or ユーザーID */}
      {friend.mbti ? (
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {friend.mbti}
        </Text>
      ) : friend.userId ? (
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          @{friend.userId}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

// アクションボタン（QR・申請）小さい円
function ActionCircle({
  icon,
  label,
  color,
  bgColor,
  onPress,
  badge,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bgColor: string;
  onPress: () => void;
  badge?: number;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center"
      activeOpacity={0.7}
    >
      <View
        style={{
          width: SMALL_AVATAR_SIZE,
          height: SMALL_AVATAR_SIZE,
          borderRadius: SMALL_AVATAR_SIZE / 2,
          backgroundColor: bgColor,
        }}
        className="items-center justify-center"
      >
        <Ionicons name={icon} size={26} color={color} />
        {badge != null && badge > 0 && (
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {badge > 9 ? "9+" : badge}
            </Text>
          </View>
        )}
      </View>
      <Text className="text-xs text-muted-foreground mt-1.5">{label}</Text>
    </TouchableOpacity>
  );
}

export function FriendsMatchScreen({
  onBack,
  onNavigate,
  onActionPress,
  onFriendsListPress,
  onRequestsPress,
  onAddFriendPress,
  onFriendPress,
  onAnalysisPress,
}: FriendsMatchScreenProps) {
  const realData = useFriendsList();
  const { searchUser, searchResult, isSearching, clearSearch } = useUserSearch();
  const { sendRequest, isSending } = useFriendRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [matchModalVisible, setMatchModalVisible] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<Id<"users"> | null>(null);

  // デモモード切り替え
  const friends = DEMO_MODE ? DEMO_FRIENDS : realData.friends;
  const friendsCount = DEMO_MODE ? DEMO_FRIENDS.length : realData.friendsCount;
  const pendingCount = DEMO_MODE ? 3 : realData.pendingCount;

  // デモモード時はアラートで通知（ダミーIDがConvexに渡されるのを防ぐ）
  const handleFriendPress = DEMO_MODE
    ? (id: Id<"users">) => {
        const friend = friends.find((f) => f._id === id);
        alert(`デモ: ${friend?.name ?? "ユーザー"}のプロフィール`);
      }
    : onFriendPress;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const userId = searchQuery.replace(/^@/, "").trim();
      searchUser(userId);
    }
  };

  const handleSendRequest = async () => {
    if (!searchResult) return;
    const result = await sendRequest(searchResult.userId!);
    if (result.success) {
      if ("status" in result && result.status === "auto_accepted") {
        toastHelpers.friends.added(searchResult.name || "友達");
      } else {
        toastHelpers.common.success(
          "申請を送信しました 📨",
          `${searchResult.name}さんに友達申請を送信しました`
        );
      }
      clearSearch();
      setSearchQuery("");
    } else {
      toastHelpers.friends.addFailed();
    }
  };

  // 菱形パターン: 1(center) → 2(pair) → 1(center) → 2(pair) ...
  // 最初の1人はトップ中央、残りを交互に配置
  const topFriend = friends.length > 0 ? friends[0] : null;
  const rest = friends.slice(1);

  // 三角形パターン: 上(中央) → 左右(ペア) → 上(中央) → 左右(ペア) ...
  // 最後の1人がペア行に来た場合は左に配置
  type DiamondRow =
    | { type: "pair"; items: FriendItem[] }
    | { type: "single"; item: FriendItem }
    | { type: "left-only"; item: FriendItem };
  const diamondRows: DiamondRow[] = [];
  let idx = 0;
  while (idx < rest.length) {
    // ペア行（2人 左右）
    if (idx + 1 < rest.length) {
      diamondRows.push({ type: "pair", items: [rest[idx], rest[idx + 1]] });
      idx += 2;
    } else {
      // 1人だけ → 左に配置
      diamondRows.push({ type: "left-only", item: rest[idx] });
      idx += 1;
      break;
    }
    // シングル行（1人 中央）
    if (idx < rest.length) {
      diamondRows.push({ type: "single", item: rest[idx] });
      idx += 1;
    }
  }

  return (
    <View className="flex-1 bg-background">
      {/* ヘッダー */}
      <View className="flex-row items-center justify-end px-4 pt-14 pb-3 bg-background">
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onRequestsPress}
            className="relative w-9 h-9 items-center justify-center"
          >
            <Ionicons name="heart-outline" size={26} color="#000" />
            {pendingCount > 0 && (
              <View className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddFriendPress}
            className="w-9 h-9 items-center justify-center"
          >
            <Ionicons name="person-add-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 検索バー */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center bg-secondary rounded-xl px-3">
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="ユーザーIDで検索"
              placeholderTextColor="#94a3b8"
              className="flex-1 py-3 px-2 text-foreground text-base"
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
                <Ionicons name="close-circle" size={18} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 検索結果 */}
        {searchQuery.length > 0 && (
          <View className="px-4 pb-2">
            {isSearching ? (
              <View className="items-center py-6">
                <ActivityIndicator size="large" color="#8b5cf6" />
              </View>
            ) : searchResult === null ? (
              <View className="items-center py-6">
                <Ionicons name="person-outline" size={40} color="#d1d5db" />
                <Text className="text-muted-foreground mt-2 text-sm">
                  ユーザーが見つかりませんでした
                </Text>
              </View>
            ) : searchResult ? (
              <View className="flex-row items-center py-3 bg-secondary/50 rounded-xl px-3 mt-2">
                <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center mr-3">
                  {searchResult.image ? (
                    <Image
                      source={{ uri: searchResult.image }}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Ionicons name="person" size={24} color="#8b5cf6" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {searchResult.name || "ユーザー"}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    @{searchResult.userId}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleSendRequest}
                  disabled={isSending}
                  className="px-5 py-1.5 bg-primary rounded-full"
                  activeOpacity={0.7}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-sm">追加</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {/* 友達がいない場合 */}
        {friendsCount === 0 ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            {/* トップ行：QR・申請ボタン */}
            <View className="flex-row items-center justify-center gap-8 mb-8">
              <ActionCircle
                icon="qr-code-outline"
                label="QR"
                color="#8b5cf6"
                bgColor="#f3e8ff"
                onPress={onAddFriendPress}
              />
              <ActionCircle
                icon="heart-outline"
                label="申請"
                color="#ec4899"
                bgColor="#fce7f3"
                onPress={onRequestsPress}
                badge={pendingCount}
              />
            </View>

            <Text className="text-xl font-bold text-foreground text-center mb-2">
              友達を作ろう
            </Text>
            <Text className="text-muted-foreground text-center mb-8">
              QRコードをスキャンして友達を追加し、{"\n"}相性診断を始めましょう
            </Text>

            <TouchableOpacity
              onPress={onAddFriendPress}
              className="flex-row items-center bg-foreground px-6 py-3 rounded-full"
              activeOpacity={0.8}
            >
              <Ionicons name="qr-code" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                QRコードをスキャン
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="pt-2 pb-6">
            {/* トップ：QR（左上）・申請（右上）→ フレンド（中央下） */}
            <View className="items-center">
              {/* QR + 申請 行（上） */}
              <View
                className="flex-row justify-between"
                style={{ width: PAIR_SPREAD + SMALL_AVATAR_SIZE }}
              >
                <ActionCircle
                  icon="qr-code-outline"
                  label="QR"
                  color="#000000"
                  bgColor="#f1f5f9"
                  onPress={onAddFriendPress}
                />
                <ActionCircle
                  icon="heart"
                  label="相性"
                  color="#000000"
                  bgColor="#f1f5f9"
                  onPress={() => {
                    setSelectedFriendId(null);
                    setMatchModalVisible(true);
                  }}
                />
              </View>

              {/* 最初のフレンド（中央、少し上に重ねる） */}
              <View style={{ marginTop: -SMALL_AVATAR_SIZE * 0.55 }}>
                {topFriend && (
                  <CircleAvatar
                    friend={topFriend}
                    size={AVATAR_SIZE}
                    onPress={handleFriendPress}
                  />
                )}
              </View>
            </View>

            {/* 三角形グリッド：ペア行(左右) → シングル行(中央) → ... */}
            {diamondRows.map((row, rowIdx) => {
              if (row.type === "pair") {
                return (
                  <View
                    key={rowIdx}
                    className="flex-row justify-between self-center"
                    style={{
                      width: PAIR_SPREAD + AVATAR_SIZE,
                      marginTop: -ROW_OVERLAP,
                    }}
                  >
                    <CircleAvatar
                      friend={row.items[0]}
                      size={AVATAR_SIZE}
                      onPress={handleFriendPress}
                    />
                    <CircleAvatar
                      friend={row.items[1]}
                      size={AVATAR_SIZE}
                      onPress={handleFriendPress}
                    />
                  </View>
                );
              }
              if (row.type === "left-only") {
                return (
                  <View
                    key={rowIdx}
                    className="flex-row self-center"
                    style={{
                      width: PAIR_SPREAD + AVATAR_SIZE,
                      marginTop: -ROW_OVERLAP,
                    }}
                  >
                    <CircleAvatar
                      friend={row.item}
                      size={AVATAR_SIZE}
                      onPress={handleFriendPress}
                    />
                  </View>
                );
              }
              return (
                <View
                  key={rowIdx}
                  className="items-center"
                  style={{ marginTop: -ROW_OVERLAP }}
                >
                  <CircleAvatar
                    friend={row.item}
                    size={AVATAR_SIZE}
                    onPress={handleFriendPress}
                  />
                </View>
              );
            })}

            {/* もっと見る */}
            {friendsCount > 12 && (
              <TouchableOpacity
                onPress={onFriendsListPress}
                className="py-3 items-center"
              >
                <Text className="text-primary text-sm font-medium">
                  すべての友達を表示
                </Text>
              </TouchableOpacity>
            )}

          </View>
        )}
      </ScrollView>

      {/* 友達選択モーダル */}
      <Modal
        visible={matchModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMatchModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setMatchModalVisible(false)}
          className="flex-1 bg-black/50 justify-end"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="bg-background rounded-t-3xl max-h-[70%]"
          >
            {/* ハンドル */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-border" />
            </View>

            {/* ヘッダー */}
            <View className="flex-row items-center justify-between px-5 py-3">
              <Text className="text-lg font-bold text-foreground">
                誰と相性診断する？
              </Text>
              <TouchableOpacity onPress={() => setMatchModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* 友達リスト */}
            <FlatList
              data={friends}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
              renderItem={({ item }) => {
                const isSelected = selectedFriendId === item._id;
                return (
                  <TouchableOpacity
                    onPress={() => setSelectedFriendId(item._id)}
                    activeOpacity={0.7}
                    className={`flex-row items-center py-3 px-3 rounded-2xl mb-1.5 ${
                      isSelected ? "bg-primary/10" : ""
                    }`}
                  >
                    {/* アバター */}
                    <View className="w-12 h-12 rounded-full overflow-hidden bg-secondary items-center justify-center mr-3">
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <Ionicons name="person" size={24} color="#8b5cf6" />
                      )}
                    </View>

                    {/* 名前・MBTI */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {item.name || "ユーザー"}
                      </Text>
                      {item.mbti && (
                        <Text className="text-sm text-muted-foreground">
                          {item.mbti}
                        </Text>
                      )}
                    </View>

                    {/* ラジオボタン */}
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        isSelected ? "border-primary" : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <View className="w-3.5 h-3.5 rounded-full bg-primary" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            {/* 分析するボタン */}
            <View className="px-5 pb-8 pt-2">
              <TouchableOpacity
                onPress={() => {
                  if (selectedFriendId) {
                    setMatchModalVisible(false);
                    onAnalysisPress(selectedFriendId);
                  }
                }}
                disabled={!selectedFriendId}
                activeOpacity={0.8}
                className={`flex-row items-center justify-center py-4 rounded-2xl ${
                  selectedFriendId ? "bg-foreground" : "bg-border"
                }`}
              >
                <Ionicons
                  name="heart"
                  size={18}
                  color="white"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-white font-bold text-base">
                  {selectedFriendId
                    ? `${friends.find((f) => f._id === selectedFriendId)?.name || "ユーザー"}との相性を診断`
                    : "友達を選んでください"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
