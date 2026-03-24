import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { toastHelpers } from "@/lib/toast-helpers";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ProfileModal } from "../../profile/components/ProfileModal/ProfileModal";
import { TEST_CONFIG } from "../../profile/components/ProfileModal/DiagnosticMiniCard";
import { useModalAnimation } from "../../profile/components/ProfileModal/useModalAnimation";
import { ProfileStickerBoard } from "../../profile/components/ProfileStickerBoard";
import { useFriendsList } from "../hooks/useFriendsList";

interface FriendProfileScreenProps {
  friendId: Id<"users">;
  onBack: () => void;
  onAnalysisPress: (friendId: Id<"users">) => void;
}

const TOTAL_TESTS = 7;

export function FriendProfileScreen({
  friendId,
  onBack,
  onAnalysisPress,
}: FriendProfileScreenProps) {
  const friendProfile = useQuery(api.profileSharing.getFriendProfile, {
    friendId,
  });
  const { removeFriend, isRemoving } = useFriendsList();
  const insets = useSafeAreaInsets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarRef = useRef<View>(null);
  const modalAnimation = useModalAnimation();

  // Transform friend's test results to diagnostics list (deduplicated by testSlug)
  const diagnosticsList = useMemo(() => {
    if (
      !friendProfile?.isFriend ||
      !("testResults" in friendProfile) ||
      !friendProfile.testResults
    )
      return [];

    const latestBySlug = new Map<
      string,
      { testSlug: string; resultType: string; completedAt: number }
    >();
    for (const result of friendProfile.testResults) {
      if (!result.testSlug) continue;
      const slug = result.testSlug;
      const existing = latestBySlug.get(slug);
      if (!existing || result.completedAt > existing.completedAt) {
        latestBySlug.set(slug, { testSlug: slug, resultType: result.resultType, completedAt: result.completedAt });
      }
    }

    return Array.from(latestBySlug.values()).map((r) => ({
      testSlug: r.testSlug,
      resultType: r.resultType,
    }));
  }, [friendProfile]);

  const completedTestCount = diagnosticsList.length;

  const handleRemoveFriend = () => {
    Alert.alert(
      "友達を解除",
      `${friendProfile?.name || "このユーザー"}さんとの友達関係を解除しますか？`,
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "解除",
          style: "destructive",
          onPress: async () => {
            const result = await removeFriend(friendId);
            if (result.success) {
              toastHelpers.common.success(
                "友達を解除しました 👋",
                `${friendProfile?.name || "このユーザー"}さんとの友達関係を解除しました`
              );
              onBack();
            } else {
              toastHelpers.common.error(
                "友達の解除に失敗しました",
                "もう一度お試しください"
              );
            }
          },
        },
      ]
    );
  };

  const handleAvatarPress = useCallback(() => {
    avatarRef.current?.measureInWindow((x, y, width, height) => {
      modalAnimation.open({ x, y, width, height });
      setIsModalOpen(true);
    });
  }, [modalAnimation]);

  const handleModalClose = useCallback(() => {
    modalAnimation.close(() => {
      setIsModalOpen(false);
    });
  }, [modalAnimation]);

  // No-op for friend diagnostics (we don't have full result data to navigate to)
  const handleDiagnosticPress = useCallback((_testSlug: string) => {}, []);

  if (!friendProfile) {
    return (
      <View style={styles.screen}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </View>
    );
  }

  const friendName = friendProfile.name || "ユーザー";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top + 4, 16) },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* ヘッダー: 戻るボタン & 友達解除 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#0f172a" />
              <Text style={styles.backText}>戻る</Text>
            </TouchableOpacity>

            {friendProfile.isFriend && (
              <TouchableOpacity
                onPress={handleRemoveFriend}
                disabled={isRemoving === friendId}
                style={styles.removeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="person-remove-outline"
                  size={16}
                  color="#ef4444"
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.panel}>
            <View ref={avatarRef} collapsable={false}>
              <ProfileStickerBoard
                diagnostics={diagnosticsList}
                userName={friendName}
                userImage={friendProfile.image ?? undefined}
                onCenterPress={handleAvatarPress}
                onDiagnosticPress={handleDiagnosticPress}
              />
            </View>

            {/* 相性分析ボタン */}
            {friendProfile.isFriend && (
              <TouchableOpacity
                onPress={() => onAnalysisPress(friendId)}
                activeOpacity={0.8}
                style={styles.analysisButton}
              >
                <Ionicons name="analytics" size={20} color="white" />
                <Text style={styles.analysisButtonText}>相性を分析する</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <ProfileModal
          isVisible={modalAnimation.isOpen.value || isModalOpen}
          onClose={handleModalClose}
          onDiagnosticPress={handleDiagnosticPress}
          overlayStyle={modalAnimation.overlayStyle}
          modalCardStyle={modalAnimation.modalCardStyle}
          contentStyle={modalAnimation.contentStyle}
          progress={modalAnimation.progress}
          userImage={friendProfile.image ?? undefined}
          userName={friendName}
          diagnostics={diagnosticsList}
          completedCount={completedTestCount}
          totalCount={TOTAL_TESTS}
          sectionTitle={`${friendName}さんの診断結果`}
          sectionSubtitle="友達の診断結果を確認"
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 132,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    padding: 8,
  },
  backText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  panel: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  analysisButton: {
    alignItems: "center",
    backgroundColor: "#ec4899",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: "90%",
  },
  analysisButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
