import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  featureName: string;
}

export function UpgradeModal({
  visible,
  onClose,
  onUpgrade,
  featureName,
}: UpgradeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
          {/* Icon */}
          <View className="items-center mb-4">
            <LinearGradient
              colors={["#8b5cf6", "#ec4899"]}
              style={{
                borderRadius: 32,
                width: 64,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="lock-closed" size={28} color="white" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-foreground text-center mb-2">
            Premiumにアップグレード
          </Text>

          {/* Feature name */}
          <View className="bg-purple-50 rounded-xl px-4 py-2 mb-3">
            <Text className="text-sm text-purple-800 text-center font-medium">
              「{featureName}」はPremiumプランで利用できます
            </Text>
          </View>

          {/* Description */}
          <Text className="text-sm text-muted-foreground text-center mb-6">
            AI分析や全診断テストなど、全機能を解放しましょう
          </Text>

          {/* Buttons */}
          <TouchableOpacity onPress={onUpgrade} className="mb-3">
            <LinearGradient
              colors={["#8b5cf6", "#ec4899"]}
              style={{
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
              }}
            >
              <Text className="text-white font-bold text-base">
                プランを見る
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="py-3 items-center"
          >
            <Text className="text-muted-foreground text-sm font-medium">
              あとで
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
