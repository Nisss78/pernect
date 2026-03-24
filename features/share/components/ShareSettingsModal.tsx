import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Ionicons } from "@expo/vector-icons";

interface ShareSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  resultId: Id<"testResults">;
}

export default function ShareSettingsModal({
  visible,
  onClose,
  resultId,
}: ShareSettingsModalProps) {
  const result = useQuery(api.testResults.getById, { resultId });
  const updateShareSettings = useMutation(api.testResults.updateShareSettings);

  const [isPublic, setIsPublic] = useState(result?.shareSettings?.isPublic ?? false);
  const [isSaving, setIsSaving] = useState(false);

  const handleTogglePublic = async (value: boolean) => {
    setIsPublic(value);
    setIsSaving(true);
    try {
      await updateShareSettings({
        resultId,
        isPublic: value,
      });
    } catch (error) {
      console.error("Failed to update share settings:", error);
      setIsPublic(!value); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-background rounded-3xl w-full max-w-md">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-border">
            <Text className="text-lg font-bold text-foreground">
              公開設定
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="p-6">
            {/* 公開/非公開トグル */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-1">
                  結果を公開する
                </Text>
                <Text className="text-sm text-muted-foreground">
                  オンにすると、誰でも結果を閲覧できます
                </Text>
              </View>
              <Switch
                value={isPublic}
                onValueChange={handleTogglePublic}
                disabled={isSaving}
                trackColor={{ false: "#e2e8f0", true: "#8b5cf6" }}
                thumbColor={isPublic ? "#ffffff" : "#f1f5f9"}
              />
            </View>

            {isSaving && (
              <View className="items-center py-4">
                <ActivityIndicator size="small" color="#8b5cf6" />
                <Text className="text-sm text-muted-foreground mt-2">
                  保存中...
                </Text>
              </View>
            )}

            {/* 情報メッセージ */}
            <View className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <View className="flex-row items-start">
                <Ionicons name="information-circle" size={20} color="#2563eb" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-semibold text-blue-900 mb-1">
                    公開設定について
                  </Text>
                  <Text className="text-xs text-blue-700 leading-relaxed">
                    結果を公開すると、シェアリンクを持っている誰でもが閲覧できます。
                    非公開にすると、自分でのみ閲覧可能です。
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Close Button */}
          <View className="px-6 pb-6">
            <TouchableOpacity
              onPress={onClose}
              className="w-full bg-card border border-border rounded-2xl py-4 items-center"
            >
              <Text className="text-foreground font-semibold">閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
