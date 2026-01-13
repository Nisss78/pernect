import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FriendRequestCard } from "../components/FriendRequestCard";
import { useFriendRequests } from "../hooks/useFriendRequests";

interface FriendRequestsScreenProps {
  onBack: () => void;
}

type TabType = "received" | "sent";

export function FriendRequestsScreen({ onBack }: FriendRequestsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("received");
  const {
    pendingRequests,
    sentRequests,
    isLoading,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    processingId,
  } = useFriendRequests();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      );
    }

    if (activeTab === "received") {
      if (pendingRequests.length === 0) {
        return (
          <View className="items-center justify-center py-12">
            <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mb-4">
              <Ionicons name="mail-outline" size={32} color="#94a3b8" />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-1">
              新しい申請はありません
            </Text>
            <Text className="text-muted-foreground text-center">
              友達申請が届くとここに表示されます
            </Text>
          </View>
        );
      }

      return pendingRequests.map((request) => (
        <FriendRequestCard
          key={request._id}
          request={request}
          type="received"
          onAccept={acceptRequest}
          onReject={rejectRequest}
          isLoading={processingId === request._id}
        />
      ));
    }

    if (sentRequests.length === 0) {
      return (
        <View className="items-center justify-center py-12">
          <View className="w-16 h-16 bg-secondary rounded-full items-center justify-center mb-4">
            <Ionicons name="send-outline" size={32} color="#94a3b8" />
          </View>
          <Text className="text-lg font-semibold text-foreground mb-1">
            送信した申請はありません
          </Text>
          <Text className="text-muted-foreground text-center">
            友達申請を送信するとここに表示されます
          </Text>
        </View>
      );
    }

    return sentRequests.map((request) => (
      <FriendRequestCard
        key={request._id}
        request={request}
        type="sent"
        onCancel={cancelRequest}
        isLoading={processingId === request._id}
      />
    ));
  };

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

          <Text className="text-2xl font-bold text-foreground mb-2">
            友達申請
          </Text>
        </View>

        {/* タブ */}
        <View className="px-5 mb-4">
          <View className="flex-row bg-secondary rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setActiveTab("received")}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                activeTab === "received" ? "bg-white" : ""
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Text
                  className={`font-semibold ${
                    activeTab === "received"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  受信
                </Text>
                {pendingRequests.length > 0 && (
                  <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {pendingRequests.length > 9
                        ? "9+"
                        : pendingRequests.length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("sent")}
              className={`flex-1 py-2.5 rounded-lg items-center ${
                activeTab === "sent" ? "bg-white" : ""
              }`}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "sent"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                送信済み
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* コンテンツ */}
        <View className="px-5 pb-32">{renderContent()}</View>
      </ScrollView>
    </View>
  );
}
