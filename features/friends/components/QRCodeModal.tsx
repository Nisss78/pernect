import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { api } from "../../../convex/_generated/api";

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function QRCodeModal({ visible, onClose }: QRCodeModalProps) {
  const shareInfo = useQuery(api.profileSharing.getProfileShareInfo);

  const handleShare = async () => {
    if (!shareInfo) return;

    try {
      await Share.share({
        message: `pernectで友達になりましょう！\n\n${shareInfo.webUrl}`,
        title: "pernect - 友達追加",
      });
    } catch (error) {
      console.error("シェアに失敗しました:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-background">
        {/* ヘッダー */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4 border-b border-border">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-foreground">マイQRコード</Text>
          <TouchableOpacity
            onPress={handleShare}
            className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="share-outline" size={22} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* コンテンツ */}
        <View className="flex-1 items-center justify-center px-6">
          {shareInfo === undefined ? (
            // ローディング中
            <ActivityIndicator size="large" color="#8b5cf6" />
          ) : shareInfo === null || !shareInfo.userId ? (
            // ユーザーIDが設定されていない、または認証エラー
            <View className="items-center">
              <View className="w-20 h-20 bg-secondary rounded-full items-center justify-center mb-4">
                <Ionicons name="alert-circle-outline" size={40} color="#94a3b8" />
              </View>
              <Text className="text-lg font-semibold text-foreground mb-2">
                ユーザーIDが設定されていません
              </Text>
              <Text className="text-muted-foreground text-center">
                プロフィール編集からユーザーIDを{"\n"}設定してください
              </Text>
            </View>
          ) : (
            <>
              {/* QRコード */}
              <View className="bg-white p-6 rounded-3xl shadow-lg mb-6">
                <QRCode
                  value={shareInfo.profileUrl}
                  size={220}
                  backgroundColor="white"
                  color="#0f172a"
                />
              </View>

              {/* ユーザー情報 */}
              <View className="items-center mb-8">
                <Text className="text-xl font-bold text-foreground mb-1">
                  {shareInfo.name || "ユーザー"}
                </Text>
                <Text className="text-muted-foreground">@{shareInfo.userId}</Text>
              </View>

              {/* 説明 */}
              <View className="bg-secondary rounded-2xl p-4 w-full">
                <View className="flex-row items-center gap-3 mb-2">
                  <Ionicons name="scan-outline" size={24} color="#8b5cf6" />
                  <Text className="text-base font-semibold text-foreground">
                    このQRコードをスキャン
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  友達にこのQRコードをスキャンしてもらうと、友達申請が送られます
                </Text>
              </View>

              {/* シェアボタン */}
              <TouchableOpacity
                onPress={handleShare}
                className="mt-6 flex-row items-center gap-2 px-6 py-3 bg-primary rounded-xl"
              >
                <Ionicons name="share-social" size={20} color="white" />
                <Text className="text-white font-semibold">リンクをシェア</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
