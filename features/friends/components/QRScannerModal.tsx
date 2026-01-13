import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (userId: string) => void;
}

export function QRScannerModal({
  visible,
  onClose,
  onScan,
}: QRScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (hasScanned) return;

    // pernect://profile/{userId} 形式のURLをパース
    const match = data.match(/pernect:\/\/profile\/([^/]+)/);
    if (match && match[1]) {
      setHasScanned(true);
      onScan(match[1]);
      onClose();
    } else {
      // Web URL形式もサポート: https://pernect.app/profile/{userId}
      const webMatch = data.match(/pernect\.app\/profile\/([^/]+)/);
      if (webMatch && webMatch[1]) {
        setHasScanned(true);
        onScan(webMatch[1]);
        onClose();
      }
    }
  };

  const handleClose = () => {
    setHasScanned(false);
    onClose();
  };

  const renderContent = () => {
    if (!permission) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 bg-secondary rounded-full items-center justify-center mb-4">
            <Ionicons name="camera-outline" size={40} color="#94a3b8" />
          </View>
          <Text className="text-lg font-semibold text-foreground mb-2 text-center">
            カメラへのアクセスが必要です
          </Text>
          <Text className="text-muted-foreground text-center mb-6">
            QRコードをスキャンするために{"\n"}カメラへのアクセスを許可してください
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="px-6 py-3 bg-primary rounded-xl"
          >
            <Text className="text-white font-semibold">カメラを許可</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={hasScanned ? undefined : handleBarCodeScanned}
        >
          {/* オーバーレイ */}
          <View className="flex-1">
            {/* 上部の暗いエリア */}
            <View className="flex-1 bg-black/50" />

            {/* スキャンエリア */}
            <View className="flex-row">
              <View className="flex-1 bg-black/50" />
              <View className="w-64 h-64 relative">
                {/* コーナー装飾 */}
                <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
              </View>
              <View className="flex-1 bg-black/50" />
            </View>

            {/* 下部の暗いエリア */}
            <View className="flex-1 bg-black/50 items-center pt-8">
              <Text className="text-white text-base font-medium">
                QRコードをフレーム内に収めてください
              </Text>
            </View>
          </View>
        </CameraView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black">
        {/* ヘッダー */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-5 pt-14 pb-4">
          <TouchableOpacity
            onPress={handleClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-black/50"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">QRスキャン</Text>
          <View className="w-10" />
        </View>

        {renderContent()}
      </View>
    </Modal>
  );
}
