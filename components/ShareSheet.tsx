import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import ShareCard from "./ShareCard";

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  resultId: Id<"testResults">;
  testTitle: string;
  resultType: string;
  scores?: Record<string, number>;
  userName?: string;
  completedAt?: number;
  gradientStart?: string;
  gradientEnd?: string;
  icon?: string;
}

export default function ShareSheet({
  visible,
  onClose,
  resultId,
  testTitle,
  resultType,
  scores,
  userName,
  completedAt,
  gradientStart,
  gradientEnd,
  icon,
}: ShareSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const viewShotRef = useRef<ViewShot>(null);

  const createShareLink = useMutation(api.shareLinks.create);

  // シェアリンクを作成
  const handleCreateLink = async () => {
    setIsLoading(true);
    try {
      const result = await createShareLink({
        resultId,
        expiresInDays: 30, // 30日間有効
      });
      setShareUrl(result.webUrl);
    } catch (error) {
      Alert.alert("エラー", "シェアリンクの作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // テキストでシェア
  const handleShareText = async () => {
    if (!shareUrl) {
      await handleCreateLink();
    }

    const url = shareUrl || `https://pernect.app/share/${resultId}`;
    const message = `私の${testTitle}の結果は「${resultType}」でした！\n\n${url}\n\n#pernect #自己分析`;

    if (await Sharing.isAvailableAsync()) {
      try {
        // テキストを一時ファイルに保存してシェア
        await Sharing.shareAsync(url, {
          dialogTitle: "結果をシェア",
          mimeType: "text/plain",
          UTI: "public.plain-text",
        });
      } catch {
        // フォールバック: クリップボードにコピー
        Alert.alert("シェア", message, [{ text: "OK" }]);
      }
    } else {
      Alert.alert("シェア", message, [{ text: "OK" }]);
    }
  };

  // 画像でシェア
  const handleShareImage = async () => {
    if (!viewShotRef.current) return;

    setIsLoading(true);
    try {
      const uri = await viewShotRef.current.capture?.();

      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          UTI: "public.png",
          dialogTitle: "結果画像をシェア",
        });
      } else {
        Alert.alert("エラー", "画像のシェアに失敗しました");
      }
    } catch (error) {
      Alert.alert("エラー", "画像の作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  // リンクをコピー
  const handleCopyLink = async () => {
    if (!shareUrl) {
      await handleCreateLink();
    }

    // React Native doesn't have Clipboard built-in, show alert instead
    const url = shareUrl || `https://pernect.app/share/${resultId}`;
    Alert.alert("リンクをコピー", url, [{ text: "OK" }]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-background rounded-t-3xl">
          {/* ヘッダー */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-border">
            <Text className="text-lg font-bold text-foreground">
              結果をシェア
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* プレビュー */}
          <View className="items-center py-6 px-6">
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", quality: 1 }}
            >
              <ShareCard
                testTitle={testTitle}
                resultType={resultType}
                scores={scores}
                userName={userName}
                completedAt={completedAt}
                gradientStart={gradientStart}
                gradientEnd={gradientEnd}
                icon={icon}
              />
            </ViewShot>
          </View>

          {/* シェアオプション */}
          <View className="flex-row justify-around px-6 pb-4">
            {/* 画像でシェア */}
            <TouchableOpacity
              onPress={handleShareImage}
              disabled={isLoading}
              className="items-center"
            >
              <View className="w-14 h-14 rounded-full bg-muted items-center justify-center mb-2">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#8b5cf6" />
                ) : (
                  <Ionicons name="image-outline" size={24} color="#8b5cf6" />
                )}
              </View>
              <Text className="text-sm text-muted-foreground">画像</Text>
            </TouchableOpacity>

            {/* テキストでシェア */}
            <TouchableOpacity
              onPress={handleShareText}
              disabled={isLoading}
              className="items-center"
            >
              <View className="w-14 h-14 rounded-full bg-muted items-center justify-center mb-2">
                <Ionicons name="chatbubble-outline" size={24} color="#8b5cf6" />
              </View>
              <Text className="text-sm text-muted-foreground">テキスト</Text>
            </TouchableOpacity>

            {/* リンクをコピー */}
            <TouchableOpacity
              onPress={handleCopyLink}
              disabled={isLoading}
              className="items-center"
            >
              <View className="w-14 h-14 rounded-full bg-muted items-center justify-center mb-2">
                <Ionicons name="link-outline" size={24} color="#8b5cf6" />
              </View>
              <Text className="text-sm text-muted-foreground">リンク</Text>
            </TouchableOpacity>
          </View>

          {/* SNSシェアボタン */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              onPress={handleShareText}
              disabled={isLoading}
              className="w-full"
            >
              <LinearGradient
                colors={["#8b5cf6", "#2563eb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-2xl items-center"
                style={{ borderRadius: 16 }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="share-social-outline"
                    size={20}
                    color="white"
                  />
                  <Text className="text-white font-semibold ml-2">
                    SNSでシェア
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* セーフエリア用スペース */}
          <View style={{ height: Platform.OS === "ios" ? 20 : 0 }} />
        </View>
      </View>
    </Modal>
  );
}
