import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { TEST_CONFIG } from "./ProfileModal/DiagnosticMiniCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── layout ───────────────────────────────────────────────────
const AVATAR_SIZE = 150;
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = 232;
const CONTAINER_HEIGHT = 462;

// Three concentric rings – tight spacing, outer overflows screen
const RINGS = [
  { radius: 108, count: 5, badge: 50, offset: 0 },
  { radius: 148, count: 8, badge: 46, offset: 22.5 },
  { radius: 190, count: 8, badge: 42, offset: 0 },
] as const;

// Tests in priority order – fills inner→middle→outer, rest = ???
const ORDERED_TESTS: (string | null)[] = [
  // inner ring (5)
  "mbti", "big5", "last-lover", "enneagram", "strengths",
  // middle ring first 2, then ???
  "schwartz-values", "career-anchors",
];

// ─── helpers ──────────────────────────────────────────────────
function toXY(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER_X + Math.cos(rad) * radius,
    y: CENTER_Y + Math.sin(rad) * radius,
  };
}

function angleFor(i: number, count: number, offsetDeg: number) {
  return 270 + offsetDeg + (360 / count) * i;
}

// Build flat slot list across all rings
interface Slot {
  slug: string | null;
  angle: number;
  radius: number;
  badge: number;
  globalIdx: number;
}

function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  let testIdx = 0;
  for (const ring of RINGS) {
    for (let i = 0; i < ring.count; i++) {
      slots.push({
        slug: testIdx < ORDERED_TESTS.length ? ORDERED_TESTS[testIdx] : null,
        angle: angleFor(i, ring.count, ring.offset),
        radius: ring.radius,
        badge: ring.badge,
        globalIdx: slots.length,
      });
      testIdx++;
    }
  }
  return slots;
}

const ALL_SLOTS = buildSlots();

// ─── types ────────────────────────────────────────────────────
interface DiagnosticResult {
  testSlug: string;
  resultType: string;
}

interface Props {
  userName: string;
  userImage?: string;
  diagnostics: DiagnosticResult[];
  onAvatarPress: () => void;
  onSettingsPress: () => void;
  onDiagnosticPress: (testSlug: string) => void;
}

// ─── component ────────────────────────────────────────────────
export function DiagnosticConstellation({
  userName,
  userImage,
  diagnostics,
  onAvatarPress,
  onSettingsPress,
  onDiagnosticPress,
}: Props) {
  const resultMap = new Map(
    diagnostics.map((d) => [d.testSlug, d.resultType])
  );

  const renderBadge = (slot: Slot) => {
    const { slug, angle, radius, badge, globalIdx } = slot;
    const { x, y } = toXY(angle, radius);
    const isPlaceholder = slug === null;
    const config = slug ? TEST_CONFIG[slug] : null;
    const hasResult = slug ? resultMap.has(slug) : false;
    const wrapW = badge + 16; // wrapper a bit wider for label

    return (
      <Animated.View
        key={slug ?? `ph-${globalIdx}`}
        entering={FadeIn.delay(60 + globalIdx * 40).duration(350)}
        style={[
          styles.badgeAbsolute,
          {
            left: x - wrapW / 2,
            top: y - badge / 2,
            width: wrapW,
          },
        ]}
      >
        {isPlaceholder ? (
          <View style={styles.badgeTouchable}>
            <View
              style={[
                styles.badgeCircle,
                styles.badgePlaceholder,
                { width: badge, height: badge, borderRadius: badge / 2 },
              ]}
            >
              <Text style={[styles.phIcon, { fontSize: badge * 0.4 }]}>?</Text>
            </View>
            <Text style={[styles.badgeLabel, styles.phLabel]}>???</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => onDiagnosticPress(slug)}
            activeOpacity={0.75}
            style={styles.badgeTouchable}
          >
            <View
              style={[
                styles.badgeCircle,
                { width: badge, height: badge, borderRadius: badge / 2 },
                !hasResult && styles.badgeInactive,
              ]}
            >
              <Ionicons
                name={hasResult ? config!.icon : config?.icon ?? "add"}
                size={badge * 0.44}
                color={hasResult ? config!.colors[0] : "#b0b0b0"}
              />
            </View>
            <Text style={styles.badgeLabel} numberOfLines={1}>
              {hasResult ? resultMap.get(slug) : config!.label}
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Central avatar */}
      <Animated.View
        entering={FadeIn.duration(450)}
        style={[
          styles.avatarWrap,
          {
            left: CENTER_X - AVATAR_SIZE / 2,
            top: CENTER_Y - AVATAR_SIZE / 2,
          },
        ]}
      >
        <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.85}>
          <View style={styles.avatarBorder}>
            {userImage ? (
              <Image source={{ uri: userImage }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Ionicons name="person" size={54} color="#b8b8b8" />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <Text style={styles.userName} numberOfLines={1}>
          {userName}
        </Text>
      </Animated.View>

      {/* All badge slots */}
      {ALL_SLOTS.map(renderBadge)}

      {/* Settings */}
      <TouchableOpacity
        onPress={onSettingsPress}
        style={styles.settingsBtn}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-sharp" size={22} color="#7c7c7c" />
      </TouchableOpacity>
    </View>
  );
}

// ─── styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: CONTAINER_HEIGHT,
    backgroundColor: "#edc8c1",
    overflow: "visible", // let edge badges poke outside
  },

  /* avatar */
  avatarWrap: {
    position: "absolute",
    alignItems: "center",
    zIndex: 10,
  },
  avatarBorder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.75)",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  avatarImg: { width: "100%", height: "100%" },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
  },
  userName: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
    color: "#3a3a3a",
  },

  /* badges */
  badgeAbsolute: {
    position: "absolute",
    alignItems: "center",
    zIndex: 5,
  },
  badgeTouchable: { alignItems: "center" },
  badgeCircle: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeInactive: {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  badgePlaceholder: {
    backgroundColor: "rgba(255,255,255,0.35)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.45)",
    borderStyle: "dashed",
    shadowOpacity: 0,
    elevation: 0,
  },
  badgeLabel: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: "600",
    color: "#5a5a5a",
    textAlign: "center",
  },
  phIcon: {
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
  },
  phLabel: {
    color: "rgba(140,140,140,0.5)",
  },

  /* settings */
  settingsBtn: {
    position: "absolute",
    top: 54,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
});
