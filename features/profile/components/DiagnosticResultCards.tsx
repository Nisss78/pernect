import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { TEST_CONFIG } from "./ProfileModal/DiagnosticMiniCard";

interface DiagnosticResult {
  testSlug: string;
  resultType: string;
}

interface Props {
  diagnostics: DiagnosticResult[];
  onCardPress: (testSlug: string) => void;
}

export function DiagnosticResultCards({ diagnostics, onCardPress }: Props) {
  if (diagnostics.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* Section header with page indicator dots */}
      <View style={styles.header}>
        <Text style={styles.title}>診断結果</Text>
        <View style={styles.dots}>
          {diagnostics.slice(0, 3).map((d, i) => (
            <View
              key={d.testSlug}
              style={[
                styles.dot,
                { backgroundColor: TEST_CONFIG[d.testSlug]?.colors[0] ?? "#ccc" },
                i === 0 && styles.dotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {diagnostics.map((d) => {
          const config = TEST_CONFIG[d.testSlug];
          if (!config) return null;

          return (
            <TouchableOpacity
              key={d.testSlug}
              onPress={() => onCardPress(d.testSlug)}
              activeOpacity={0.85}
              style={styles.card}
            >
              <View style={styles.cardInner}>
                {/* Gradient accent bar on left */}
                <LinearGradient
                  colors={config.colors}
                  style={styles.accentBar}
                />
                <View style={styles.cardContent}>
                  <View style={styles.cardIcon}>
                    <Ionicons
                      name={config.icon}
                      size={24}
                      color={config.colors[0]}
                    />
                  </View>
                  <Text style={styles.cardLabel} numberOfLines={1}>
                    {config.label}
                  </Text>
                  <Text style={styles.cardResult} numberOfLines={1}>
                    {d.resultType}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 160,
  },
  cardInner: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  accentBar: {
    width: 4,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  cardResult: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
});
