import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface DiagnosticResult {
  testSlug: string;
  resultType: string;
}

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDiagnosticPress: (testSlug: string) => void;
  overlayStyle: any;
  modalCardStyle: any;
  contentStyle: any;
  progress: SharedValue<number>;
  // User data
  userName: string;
  userIdDisplay: string;
  userImage?: string;
  // Diagnostics
  diagnostics: DiagnosticResult[];
  completedCount: number;
  totalCount: number;
}

export function ProfileModal({
  isVisible,
  onClose,
  onDiagnosticPress,
  overlayStyle,
  modalCardStyle,
  contentStyle,
  progress,
  userName,
  userIdDisplay,
  userImage,
  diagnostics,
  completedCount,
  totalCount,
}: ProfileModalProps) {
  const insets = useSafeAreaInsets();

  if (!isVisible) {
    return null;
  }

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
          style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          {/* User info header */}
          <View style={styles.headerContent}>
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="white" />
              </View>
            )}
            <Text style={styles.userName}>{userName}</Text>
            {userIdDisplay && (
              <Text style={styles.userId}>{userIdDisplay}</Text>
            )}

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
              <Text style={styles.sectionTitle}>あなたの診断結果</Text>
              <Text style={styles.sectionSubtitle}>
                タップして詳細や履歴を確認
              </Text>
            </View>

            {/* Diagnostic cards grid */}
            <DiagnosticGrid
              diagnostics={diagnostics}
              onDiagnosticPress={onDiagnosticPress}
            />
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

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
    paddingBottom: 24,
    position: "relative",
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
  headerContent: {
    alignItems: "center",
    paddingTop: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    width: "80%",
    height: 6,
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
