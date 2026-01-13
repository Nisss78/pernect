import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { BottomNavigation } from "../../common/components/BottomNavigation";
import { AnalysisHistoryList } from "../../integrated-analysis/components/AnalysisHistoryList";
import { ProfileCard3D } from "../components/ProfileCard3D/ProfileCard3D";
import { ProfileModal } from "../components/ProfileModal/ProfileModal";
import { useModalAnimation } from "../components/ProfileModal/useModalAnimation";
import ResultHistoryList from "../components/ResultHistoryList";
import { useIntegratedProfile } from "../hooks/useIntegratedProfile";
import { useProfileData } from "../hooks/useProfileData";

interface ProfileScreenProps {
  onNavigate: (
    screen: "home" | "profile" | "settings" | "profile-edit" | "test-result" | "integrated-analysis" | "analysis-result"
  ) => void;
  onActionPress?: () => void;
  onTestResultPress?: (testSlug: string) => void;
  onAnalysisPress?: (analysisId: Id<"integratedAnalyses">) => void;
}

// Total number of available tests
const TOTAL_TESTS = 7;

export function ProfileScreen({
  onNavigate,
  onActionPress,
  onTestResultPress,
  onAnalysisPress,
}: ProfileScreenProps) {
  const { big5Latest, currentUser, inProgress, results } = useProfileData();
  const { diagnosticsList, completedTestCount } = useIntegratedProfile();

  // 統合分析履歴を取得
  const analysisHistory = useQuery(api.integratedAnalyses.listByUser) ?? [];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<View>(null);
  const modalAnimation = useModalAnimation();

  // User data fallback
  const userName = currentUser?.name || "ゲストユーザー";
  const userIdDisplay = currentUser?.userId ? `@${currentUser.userId}` : "";
  const userMbti = currentUser?.mbti || "";
  const userImage = currentUser?.image;

  // BIG5 percentiles
  const percentiles = (big5Latest?.aiData as any)?.percentiles as
    | Record<string, number>
    | undefined;
  const traitE = percentiles?.E ?? null;
  const traitO = percentiles?.O ?? null;
  const traitC = percentiles?.C ?? null;
  const traitA = percentiles?.A ?? null;
  const traitN = percentiles?.N ?? null;

  // Statistics
  const testsTaken = results?.length ?? 0;
  const completionRate = (() => {
    const ip = inProgress?.length ?? 0;
    const total = testsTaken + ip;
    if (total === 0) return 0;
    return Math.round((testsTaken / total) * 100);
  })();
  const averageScore = (() => {
    if (!percentiles) return null;
    const vals = [traitO, traitC, traitE, traitA, traitN].filter(
      (v) => typeof v === "number"
    ) as number[];
    if (vals.length === 0) return null;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round((avg / 20) * 10) / 10;
  })();

  // Handle card press - open modal
  const handleCardPress = useCallback(() => {
    cardRef.current?.measureInWindow((x, y, width, height) => {
      modalAnimation.open({ x, y, width, height });
      setIsModalOpen(true);
    });
  }, [modalAnimation]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    modalAnimation.close(() => {
      setIsModalOpen(false);
    });
  }, [modalAnimation]);

  // Handle diagnostic card press in modal
  const handleDiagnosticPress = useCallback(
    (testSlug: string) => {
      handleModalClose();
      // Navigate to test result or test start
      if (onTestResultPress) {
        onTestResultPress(testSlug);
      }
    },
    [handleModalClose, onTestResultPress]
  );

  // Loading state
  if (currentUser === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 pt-14 pb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-3xl font-bold text-[#8b5cf6]">
                プロフィール
              </Text>
              <TouchableOpacity
                onPress={() => onNavigate("settings")}
                className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary"
              >
                <Ionicons name="settings-sharp" size={24} color="#ec4899" />
              </TouchableOpacity>
            </View>
            <Text className="text-muted-foreground text-sm">
              あなたの性格の旅と洞察
            </Text>
          </View>

          {/* 3D Profile Card */}
          <View className="px-6 mb-4" ref={cardRef} collapsable={false}>
            <ProfileCard3D
              userName={userName}
              userIdDisplay={userIdDisplay}
              userMbti={userMbti}
              userImage={userImage}
              traitE={traitE}
              traitO={traitO}
              traitA={traitA}
              onPress={handleCardPress}
              onEditPress={() => onNavigate("profile-edit")}
              isModalOpen={isModalOpen}
            />
          </View>

          {/* Statistics Cards */}
          <View className="px-6 mb-4">
            <View className="flex-row gap-2">
              <View className="flex-1 bg-card rounded-xl p-3 border border-border items-center">
                <Ionicons
                  name="document-text"
                  size={24}
                  color="#8b5cf6"
                  style={{ marginBottom: 4 }}
                />
                <Text className="text-xl font-bold text-foreground">
                  {testsTaken}
                </Text>
                <Text className="text-muted-foreground text-xs">受けた診断</Text>
              </View>
              <View className="flex-1 bg-card rounded-xl p-3 border border-border items-center">
                <Ionicons
                  name="star"
                  size={24}
                  color="#f97316"
                  style={{ marginBottom: 4 }}
                />
                <Text className="text-xl font-bold text-foreground">
                  {averageScore ?? "--"}
                </Text>
                <Text className="text-muted-foreground text-xs">平均スコア</Text>
              </View>
              <View className="flex-1 bg-card rounded-xl p-3 border border-border items-center">
                <Ionicons
                  name="pie-chart"
                  size={24}
                  color="#10b981"
                  style={{ marginBottom: 4 }}
                />
                <Text className="text-xl font-bold text-foreground">
                  {completionRate}%
                </Text>
                <Text className="text-muted-foreground text-xs">完了率</Text>
              </View>
            </View>
          </View>

          {/* Diagnostic History */}
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-foreground">診断履歴</Text>
            </View>
            <ResultHistoryList />
          </View>

          {/* Integrated Analysis History */}
          {analysisHistory.length > 0 && (
            <View className="px-6 mb-28">
              <AnalysisHistoryList
                analyses={analysisHistory}
                onSelectAnalysis={(analysisId) => {
                  if (onAnalysisPress) {
                    onAnalysisPress(analysisId);
                  }
                }}
                showTitle={true}
                limit={3}
              />
              {analysisHistory.length > 3 && (
                <TouchableOpacity
                  onPress={() => onNavigate("integrated-analysis")}
                  className="mt-3 py-3 bg-secondary rounded-xl items-center"
                >
                  <Text className="text-primary font-medium">
                    すべての分析を見る
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Spacer when no analysis history */}
          {analysisHistory.length === 0 && <View className="h-24" />}
        </ScrollView>

        {/* Profile Modal */}
        <ProfileModal
          isVisible={modalAnimation.isOpen.value || isModalOpen}
          onClose={handleModalClose}
          onDiagnosticPress={handleDiagnosticPress}
          overlayStyle={modalAnimation.overlayStyle}
          modalCardStyle={modalAnimation.modalCardStyle}
          contentStyle={modalAnimation.contentStyle}
          progress={modalAnimation.progress}
          userName={userName}
          userIdDisplay={userIdDisplay}
          userImage={userImage}
          diagnostics={diagnosticsList}
          completedCount={completedTestCount}
          totalCount={TOTAL_TESTS}
        />

        <BottomNavigation
          currentScreen="profile"
          onNavigate={onNavigate}
          onActionPress={onActionPress}
        />
      </View>
    </GestureHandlerRootView>
  );
}
