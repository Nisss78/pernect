import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { ProfileHistoryCard, ProfileHistoryShelf } from "../components/ProfileHistoryShelf";
import { ProfileModal } from "../components/ProfileModal/ProfileModal";
import { TEST_CONFIG } from "../components/ProfileModal/DiagnosticMiniCard";
import { useModalAnimation } from "../components/ProfileModal/useModalAnimation";
import { ProfileStickerBoard } from "../components/ProfileStickerBoard";
import { useIntegratedProfile } from "../hooks/useIntegratedProfile";
import { useProfileData } from "../hooks/useProfileData";
import { ProfileHeaderSkeleton } from "@/components/ui/Skeleton";

interface ProfileScreenProps {
  onNavigate: (
    screen:
      | "home"
      | "profile"
      | "friends"
      | "settings"
      | "profile-edit"
      | "test-result"
      | "integrated-analysis"
      | "analysis-result"
  ) => void;
  onActionPress?: () => void;
  onTestResultPress?: (testSlug: string) => void;
  onAnalysisPress?: (analysisId: Id<"integratedAnalyses">) => void;
}

const TOTAL_TESTS = 7;

export function ProfileScreen({
  onNavigate,
  onTestResultPress,
  onAnalysisPress,
}: ProfileScreenProps) {
  const { currentUser, results } = useProfileData();
  const { diagnosticsList, completedTestCount } = useIntegratedProfile();
  const insets = useSafeAreaInsets();

  const analysisHistoryQuery = useQuery(api.integratedAnalyses.listByUser, {});
  const friendVisibleSlugs = useQuery(api.users.getFriendVisibleDiagnostics, {});
  const toggleVisibility = useMutation(api.users.toggleFriendDiagnosticVisibility);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const avatarRef = useRef<View>(null);
  const modalAnimation = useModalAnimation();

  const userImage = currentUser?.image;

  const historyCards = useMemo<ProfileHistoryCard[]>(() => {
    const analysisHistory = analysisHistoryQuery ?? [];
    const resultCards =
      results?.flatMap((result) => {
        if (!result.test) {
          return [];
        }

        const config = TEST_CONFIG[result.test.slug];
        const testSlug = result.test.slug;

        return [
          {
            key: result._id,
            title: result.test.title,
            subtitle: result.resultType,
            meta: new Date(result.completedAt).toLocaleDateString("ja-JP", {
              month: "short",
              day: "numeric",
            }),
            icon: config?.icon ?? "sparkles",
            colors: config?.colors ?? [result.test.gradientStart ?? "#8b5cf6", result.test.gradientEnd ?? "#2563eb"],
            kindLabel: "診断",
            timestamp: result.completedAt,
            onPress: () => {
              if (onTestResultPress) {
                onTestResultPress(testSlug);
              }
            },
          },
        ];
      }) ?? [];

    const analysisCards = analysisHistory.map((analysis) => {
      const themeMap = {
        love: {
          colors: ["#ec4899", "#f43f5e"] as [string, string],
          icon: "heart" as const,
          subtitle: `${analysis.selectedResults.length}個の診断を使用`,
        },
        career: {
          colors: ["#06b6d4", "#2563eb"] as [string, string],
          icon: "briefcase" as const,
          subtitle: `${analysis.selectedResults.length}個の診断を使用`,
        },
        general: {
          colors: ["#8b5cf6", "#2563eb"] as [string, string],
          icon: "sparkles" as const,
          subtitle: `${analysis.selectedResults.length}個の診断を使用`,
        },
      };

      const themeKey =
        analysis.theme === "love" || analysis.theme === "career"
          ? analysis.theme
          : "general";
      const theme = themeMap[themeKey];

      return {
        key: analysis._id,
        title: analysis.analysis.title,
        subtitle: theme.subtitle,
        meta: new Date(analysis.createdAt).toLocaleDateString("ja-JP", {
          month: "short",
          day: "numeric",
        }),
        icon: theme.icon,
        colors: theme.colors,
        kindLabel: "分析",
        timestamp: analysis.createdAt,
        onPress: () => {
          if (onAnalysisPress) {
            onAnalysisPress(analysis._id);
          }
        },
      };
    });

    const cards = [...resultCards, ...analysisCards]
      .sort((left, right) => (right.timestamp ?? 0) - (left.timestamp ?? 0))
      .slice(0, 4);

    while (cards.length < 3) {
      cards.push({
        key: `placeholder-${cards.length}`,
        title: "",
        subtitle: "",
        meta: "",
        icon: "sparkles",
        colors: ["#e2e8f0", "#cbd5e1"],
        kindLabel: "",
        placeholder: true,
        timestamp: 0,
      });
    }

    return cards;
  }, [analysisHistoryQuery, onAnalysisPress, onTestResultPress, results]);

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

  const handleDiagnosticPress = useCallback(
    (testSlug: string) => {
      if (onTestResultPress) {
        onTestResultPress(testSlug);
      }
    },
    [onTestResultPress]
  );

  const handleModalDiagnosticPress = useCallback(
    (testSlug: string) => {
      handleModalClose();
      if (onTestResultPress) {
        onTestResultPress(testSlug);
      }
    },
    [handleModalClose, onTestResultPress]
  );

  const handleToggleFriendVisibility = useCallback(
    (testSlug: string) => {
      toggleVisibility({ testSlug });
    },
    [toggleVisibility]
  );

  if (currentUser === undefined) {
    return (
      <View style={styles.screen}>
        <ProfileHeaderSkeleton />
        <View style={styles.loadingCardWrap}>
          <View style={styles.loadingCard} />
        </View>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top + 12, 24) },
          ]}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={styles.panel}>
            <View ref={avatarRef} collapsable={false}>
              <ProfileStickerBoard
                diagnostics={diagnosticsList}
                userName={currentUser?.name ?? undefined}
                userImage={userImage}
                onCenterPress={handleAvatarPress}
                onDiagnosticPress={handleDiagnosticPress}
                onSettingsPress={() => onNavigate("settings")}
              />
            </View>

            <View style={styles.historyWrap}>
              <ProfileHistoryShelf cards={historyCards} />
            </View>
          </View>
        </ScrollView>

        <ProfileModal
          isVisible={modalAnimation.isOpen.value || isModalOpen}
          onClose={handleModalClose}
          onDiagnosticPress={handleModalDiagnosticPress}
          overlayStyle={modalAnimation.overlayStyle}
          modalCardStyle={modalAnimation.modalCardStyle}
          contentStyle={modalAnimation.contentStyle}
          progress={modalAnimation.progress}
          userImage={userImage}
          userName={currentUser?.name ?? undefined}
          diagnostics={diagnosticsList}
          completedCount={completedTestCount}
          totalCount={TOTAL_TESTS}
          friendVisibleSlugs={friendVisibleSlugs ?? undefined}
          onToggleFriendVisibility={handleToggleFriendVisibility}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 132,
  },
  panel: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  historyWrap: {
    marginTop: 16,
    paddingHorizontal: 8,
    width: "100%",
  },
  loadingCardWrap: {
    paddingHorizontal: 16,
  },
  loadingCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 36,
    borderWidth: 1,
    height: 260,
  },
});
