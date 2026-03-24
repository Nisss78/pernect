import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import { api } from "../../../convex/_generated/api";
import { QRScannerModal } from "../components/QRScannerModal";
import { toastHelpers } from "@/lib/toast-helpers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH - 64;
const QR_SIZE = Math.min(CARD_WIDTH - 48, 250);

interface AddFriendScreenProps {
  onBack: () => void;
  onUserFound?: (userId: string) => void;
}

export function AddFriendScreen({ onBack, onUserFound }: AddFriendScreenProps) {
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);

  const shareInfo = useQuery(api.profileSharing.getProfileShareInfo);

  const handleQRScan = async (userId: string) => {
    if (onUserFound) {
      onUserFound(userId);
    }
  };

  const handleShare = async () => {
    if (!shareInfo?.webUrl) return;
    try {
      await Share.share({
        message: `pernectで友達になりましょう！\n\n${shareInfo.webUrl}`,
      });
    } catch {}
  };

  const handleCopyLink = async () => {
    if (!shareInfo?.webUrl) return;
    try {
      await Clipboard.setStringAsync(shareInfo.webUrl);
      toastHelpers.common.success("コピーしました ✅", "リンクをペーストして共有できます");
    } catch {}
  };

  const hasUserId = shareInfo && shareInfo.userId;

  return (
    <LinearGradient
      colors={["#c8c8c8", "#e8e8e8", "#f5f5f5", "#e8e8e8", "#c8c8c8"]}
      locations={[0, 0.2, 0.5, 0.8, 1]}
      style={{ flex: 1 }}
    >
      {/* ヘッダー */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 56,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity onPress={onBack} hitSlop={8}>
          <Ionicons name="close" size={28} color="#1e293b" />
        </TouchableOpacity>
        <View />
        <TouchableOpacity
          onPress={() => setIsQRScannerVisible(true)}
          hitSlop={8}
        >
          <Ionicons name="scan-outline" size={26} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {shareInfo === undefined ? (
          <ActivityIndicator size="large" color="#8b5cf6" />
        ) : !hasUserId ? (
          <View style={{ alignItems: "center", paddingHorizontal: 32 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#94a3b8" />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1e293b",
                marginTop: 12,
              }}
            >
              ユーザーIDが未設定
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#64748b",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              プロフィール編集からユーザーIDを{"\n"}設定してください
            </Text>
          </View>
        ) : (
          <>
            {/* QRカード */}
            <View
              style={{
                width: CARD_WIDTH,
                backgroundColor: "#fff",
                borderRadius: 24,
                alignItems: "center",
                paddingTop: 28,
                paddingBottom: 24,
                paddingHorizontal: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 6,
              }}
            >
              <QRCode
                value={shareInfo.profileUrl || "pernect://profile/user"}
                size={QR_SIZE}
                backgroundColor="white"
                color="#0f172a"
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "900",
                  color: "#0f172a",
                  marginTop: 20,
                  letterSpacing: 1.5,
                  textAlign: "center",
                }}
              >
                @{shareInfo.userId?.toUpperCase()}
              </Text>
            </View>

            {/* アクションボタン3つ */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 16,
                width: CARD_WIDTH,
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-up-outline" size={22} color="#1e293b" />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    fontWeight: "600",
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  プロフィール{"\n"}をシェア
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCopyLink}
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="link-outline" size={22} color="#1e293b" />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    fontWeight: "600",
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  リンク{"\n"}をコピー
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsQRScannerVisible(true)}
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 3,
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="qr-code-outline" size={22} color="#1e293b" />
                <Text
                  style={{
                    fontSize: 11,
                    color: "#475569",
                    fontWeight: "600",
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  スキャン
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <QRScannerModal
        visible={isQRScannerVisible}
        onClose={() => setIsQRScannerVisible(false)}
        onScan={handleQRScan}
      />
    </LinearGradient>
  );
}
