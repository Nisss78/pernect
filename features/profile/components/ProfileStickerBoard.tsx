import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

import { TEST_CONFIG } from "./ProfileModal/DiagnosticMiniCard";

type IconName = keyof typeof Ionicons.glyphMap;

interface DiagnosticResult {
  testSlug: string;
  resultType: string;
}

interface StickerSlot {
  key: string;
  x: number;
  y: number;
  size: number;
  accent: string;
  testSlug?: keyof typeof TEST_CONFIG;
  decorativeIcon?: IconName;
}

interface ProfileStickerBoardProps {
  diagnostics: DiagnosticResult[];
  userName?: string;
  userImage?: string;
  onCenterPress: () => void;
  onDiagnosticPress: (testSlug: string) => void;
  onSettingsPress?: () => void;
}

const STICKER_SLOTS: StickerSlot[] = [
  { key: "top-left", x: 0.18, y: 0.09, size: 66, accent: "#8b5cf6", testSlug: "mbti" },
  { key: "top-center", x: 0.5, y: 0.065, size: 72, accent: "#2563eb", decorativeIcon: "sparkles" },
  { key: "top-right", x: 0.82, y: 0.09, size: 66, accent: "#06b6d4", testSlug: "enneagram" },
  { key: "upper-left-edge", x: 0.05, y: 0.23, size: 70, accent: "#ec4899", decorativeIcon: "heart" },
  { key: "upper-left", x: 0.29, y: 0.21, size: 76, accent: "#f97316", testSlug: "last-lover" },
  { key: "upper-right", x: 0.71, y: 0.21, size: 76, accent: "#f59e0b", testSlug: "strengths" },
  { key: "upper-right-edge", x: 0.95, y: 0.23, size: 70, accent: "#2563eb", decorativeIcon: "star" },
  { key: "middle-left", x: 0.065, y: 0.44, size: 78, accent: "#3b82f6", testSlug: "big5" },
  { key: "middle-right", x: 0.935, y: 0.44, size: 78, accent: "#10b981", testSlug: "career-anchors" },
  { key: "lower-left", x: 0.11, y: 0.70, size: 70, accent: "#10b981", testSlug: "schwartz-values" },
  { key: "lower-right", x: 0.89, y: 0.70, size: 70, accent: "#64748b", decorativeIcon: "moon" },
  { key: "bottom-left", x: 0.2, y: 0.87, size: 66, accent: "#8b5cf6", decorativeIcon: "leaf" },
  { key: "bottom-center", x: 0.5, y: 0.90, size: 74, accent: "#ec4899", decorativeIcon: "heart" },
  { key: "bottom-right", x: 0.8, y: 0.87, size: 66, accent: "#2563eb", decorativeIcon: "diamond" },
];

export function ProfileStickerBoard({
  diagnostics,
  userName,
  userImage,
  onCenterPress,
  onDiagnosticPress,
  onSettingsPress,
}: ProfileStickerBoardProps) {
  const { width } = useWindowDimensions();
  const boardWidth = Math.min(width - 18, 430);
  const boardHeight = Math.round(boardWidth * 1.38);
  const centerSize = Math.round(boardWidth * 0.52);

  const completedMap = useMemo(
    () => new Map(diagnostics.map((diagnostic) => [diagnostic.testSlug, diagnostic.resultType])),
    [diagnostics]
  );

  return (
    <View
      style={[
        styles.board,
        {
          width: boardWidth,
          height: boardHeight,
        },
      ]}
    >
      {onSettingsPress ? (
        <TouchableOpacity
          accessibilityLabel="設定"
          activeOpacity={0.82}
          onPress={onSettingsPress}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-sharp" size={18} color="#64748b" />
        </TouchableOpacity>
      ) : null}

      {STICKER_SLOTS.map((slot) => {
        const left = boardWidth * slot.x - slot.size / 2;
        const top = boardHeight * slot.y - slot.size / 2;
        const config = slot.testSlug ? TEST_CONFIG[slot.testSlug] : null;
        const hasResult = slot.testSlug ? completedMap.has(slot.testSlug) : false;
        const isInteractive = Boolean(slot.testSlug && hasResult);
        const badgeSize = slot.size * 0.64;

        return (
          <TouchableOpacity
            key={slot.key}
            accessibilityLabel={slot.testSlug ? `${config?.labelJa ?? config?.label}診断` : "デコレーション"}
            activeOpacity={isInteractive ? 0.8 : 1}
            disabled={!isInteractive}
            onPress={() => {
              if (slot.testSlug) {
                onDiagnosticPress(slot.testSlug);
              }
            }}
            style={[
              styles.slotShell,
              {
                left,
                top,
                width: slot.size,
                height: slot.size,
                borderRadius: slot.size / 2,
              },
            ]}
          >
            {config ? (
              <LinearGradient
                colors={hasResult ? config.colors : [`${slot.accent}18`, `${slot.accent}08`]}
                start={{ x: 0.1, y: 0.1 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.stickerBadge,
                  {
                    width: badgeSize,
                    height: badgeSize,
                    borderRadius: badgeSize / 2,
                  },
                ]}
              >
                <Ionicons
                  color={hasResult ? "#ffffff" : slot.accent}
                  name={config.icon}
                  size={badgeSize * 0.48}
                />
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.stickerBadge,
                  styles.decorativeBadge,
                  {
                    width: badgeSize,
                    height: badgeSize,
                    borderRadius: badgeSize / 2,
                  },
                ]}
              >
                <Ionicons
                  color={slot.accent}
                  name={slot.decorativeIcon ?? "sparkles"}
                  size={badgeSize * 0.48}
                />
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        accessibilityLabel="プロフィール詳細"
        activeOpacity={0.88}
        onPress={onCenterPress}
        style={[
          styles.centerShell,
          {
            width: centerSize,
            height: centerSize,
            borderRadius: centerSize / 2,
            left: (boardWidth - centerSize) / 2,
            top: boardHeight * 0.48 - centerSize / 2,
          },
        ]}
      >
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
                style={styles.centerImage}
              />
            ) : (
              <View style={styles.personPlate}>
                <Ionicons name="person" size={centerSize * 0.3} color="#64748b" />
              </View>
            )}
          </View>
        </LinearGradient>
        {userName ? (
          <Text style={styles.centerName} numberOfLines={1}>
            {userName}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: "center",
    overflow: "visible",
    position: "relative",
  },
  settingsButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    top: 10,
    width: 36,
    zIndex: 30,
  },
  slotShell: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 5,
    justifyContent: "center",
    position: "absolute",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    zIndex: 10,
  },
  stickerBadge: {
    alignItems: "center",
    justifyContent: "center",
  },
  decorativeBadge: {
    backgroundColor: "#f8fafc",
  },
  centerShell: {
    alignItems: "center",
    position: "absolute",
    zIndex: 20,
  },
  storyRing: {
    alignItems: "center",
    borderRadius: 999,
    height: "100%",
    justifyContent: "center",
    padding: 3,
    width: "100%",
  },
  storyRingGap: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: 3,
    width: "100%",
  },
  personPlate: {
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 999,
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  centerImage: {
    borderRadius: 999,
    height: "100%",
    width: "100%",
  },
  centerName: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginTop: 12,
    textAlign: "center",
  },
});
