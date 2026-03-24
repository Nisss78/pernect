import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DiagnosticGrid } from "./DiagnosticGrid";
import { TEST_CONFIG } from "./DiagnosticMiniCard";

interface DiagnosticResult {
  testSlug: string;
  resultType: string;
}

// Floating badge positions around the avatar (relative to header area)
const FLOATING_BADGES = [
  { x: 0.12, y: 0.22, size: 38 },
  { x: 0.30, y: 0.08, size: 34 },
  { x: 0.70, y: 0.08, size: 34 },
  { x: 0.88, y: 0.22, size: 38 },
  { x: 0.06, y: 0.55, size: 32 },
  { x: 0.94, y: 0.55, size: 32 },
  { x: 0.18, y: 0.82, size: 30 },
  { x: 0.82, y: 0.82, size: 30 },
];

const ALL_TEST_SLUGS = [
  "mbti",
  "big5",
  "last-lover",
  "strengths",
  "schwartz-values",
  "career-anchors",
  "enneagram",
] as const;

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDiagnosticPress: (testSlug: string) => void;
  overlayStyle: any;
  modalCardStyle: any;
  contentStyle: any;
  progress: SharedValue<number>;
  // User data
  userImage?: string;
  userName?: string;
  // Diagnostics
  diagnostics: DiagnosticResult[];
  completedCount: number;
  totalCount: number;
  // Customization
  sectionTitle?: string;
  sectionSubtitle?: string;
  // Friend visibility
  friendVisibleSlugs?: string[];
  onToggleFriendVisibility?: (testSlug: string) => void;
}

export function ProfileModal({
  isVisible,
  onClose,
  onDiagnosticPress,
  overlayStyle,
  modalCardStyle,
  contentStyle,
  progress,
  userImage,
  userName,
  diagnostics,
  completedCount,
  totalCount,
  sectionTitle: sectionTitleText,
  sectionSubtitle: sectionSubtitleText,
  friendVisibleSlugs,
  onToggleFriendVisibility,
}: ProfileModalProps) {
  const insets = useSafeAreaInsets();

  if (!isVisible) {
    return null;
  }

  const completedMap = new Map(
    diagnostics.map((d) => [d.testSlug, d.resultType])
  );

  const headerHeight = 280;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}>
      {/* Backdrop */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.backdrop} />
      </TouchableOpacity>

      {/* Modal Card */}
      <Animated.View style={[styles.modalCard, modalCardStyle]}>
        <LinearGradient
          colors={["#ec4899", "#8b5cf6", "#7c3aed"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.headerGradient, { paddingTop: insets.top + 16, height: insets.top + 16 + headerHeight }]}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          {/* Floating diagnostic badges around avatar */}
          <View style={[styles.floatingArea, { height: headerHeight }]}>
            {FLOATING_BADGES.map((badge, index) => {
              const slug = ALL_TEST_SLUGS[index % ALL_TEST_SLUGS.length];
              const config = TEST_CONFIG[slug];
              const hasResult = completedMap.has(slug);

              if (!config) return null;

              return (
                <View
                  key={`badge-${index}`}
                  style={[
                    styles.floatingBadge,
                    {
                      left: `${badge.x * 100}%`,
                      top: badge.y * headerHeight,
                      width: badge.size,
                      height: badge.size,
                      borderRadius: badge.size / 2,
                      marginLeft: -badge.size / 2,
                      marginTop: -badge.size / 2,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={hasResult ? config.colors : ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.08)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.floatingBadgeInner,
                      { borderRadius: badge.size / 2 },
                    ]}
                  >
                    <Ionicons
                      name={config.icon}
                      size={badge.size * 0.44}
                      color={hasResult ? "#ffffff" : "rgba(255,255,255,0.5)"}
                    />
                  </LinearGradient>
                </View>
              );
            })}

            {/* Center avatar with story ring */}
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#feda75", "#fa7e1e", "#d62976", "#962fbf", "#4f5bd5"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.storyRing}
              >
                <View style={styles.storyRingGap}>
                  {userImage ? (
                    <Image
                      source={{ uri: userImage }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={48} color="#64748b" />
                    </View>
                  )}
                </View>
              </LinearGradient>

              {userName ? (
                <Text style={styles.userName}>{userName}</Text>
              ) : null}

              {/* Progress indicator */}
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {completedCount} / {totalCount} 診断完了
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(completedCount / totalCount) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <Animated.View style={[styles.content, contentStyle]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 24 },
            ]}
          >
            {/* Section title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{sectionTitleText ?? "あなたの診断結果"}</Text>
              <Text style={styles.sectionSubtitle}>
                {sectionSubtitleText ?? "タップして詳細や履歴を確認"}
              </Text>
            </View>

            {/* Diagnostic cards grid */}
            <DiagnosticGrid
              diagnostics={diagnostics}
              onDiagnosticPress={onDiagnosticPress}
              friendVisibleSlugs={friendVisibleSlugs}
              onToggleFriendVisibility={onToggleFriendVisibility}
            />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const AVATAR_SIZE = 110;
const RING_SIZE = AVATAR_SIZE + 8;

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  backdrop: {
    flex: 1,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  headerGradient: {
    paddingHorizontal: 24,
    position: "relative",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 56,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  floatingArea: {
    position: "relative",
    width: "100%",
  },
  floatingBadge: {
    position: "absolute",
    zIndex: 5,
  },
  floatingBadgeInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  storyRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },
  storyRingGap: {
    width: "100%",
    height: "100%",
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#ffffff",
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatar: {
    width: AVATAR_SIZE - 6,
    height: AVATAR_SIZE - 6,
    borderRadius: (AVATAR_SIZE - 6) / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE - 6,
    height: AVATAR_SIZE - 6,
    borderRadius: (AVATAR_SIZE - 6) / 2,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  progressText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginBottom: 6,
  },
  progressBar: {
    width: 160,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 3,
  },
  content: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
});
