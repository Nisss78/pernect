import React from "react";
import { StyleSheet, View } from "react-native";

import { DiagnosticMiniCard, TEST_CONFIG } from "./DiagnosticMiniCard";

// All test slugs in display order
const ALL_TEST_SLUGS = [
  "mbti",
  "big5",
  "last-lover",
  "strengths",
  "schwartz-values",
  "career-anchors",
  "enneagram",
] as const;

interface DiagnosticResult {
  testSlug: string;
  resultType: string;
}

interface DiagnosticGridProps {
  diagnostics: DiagnosticResult[];
  onDiagnosticPress: (testSlug: string) => void;
  friendVisibleSlugs?: string[];
  onToggleFriendVisibility?: (testSlug: string) => void;
}

export function DiagnosticGrid({
  diagnostics,
  onDiagnosticPress,
  friendVisibleSlugs,
  onToggleFriendVisibility,
}: DiagnosticGridProps) {
  // Create a map for quick lookup
  const resultMap = new Map(
    diagnostics.map((d) => [d.testSlug, d.resultType])
  );

  return (
    <View style={styles.container}>
      {ALL_TEST_SLUGS.map((slug, index) => {
        // Skip if test config doesn't exist
        if (!TEST_CONFIG[slug]) return null;

        const resultType = resultMap.get(slug) ?? null;

        return (
          <DiagnosticMiniCard
            key={slug}
            testSlug={slug}
            resultType={resultType}
            onPress={() => onDiagnosticPress(slug)}
            index={index}
            isVisibleToFriends={friendVisibleSlugs?.includes(slug)}
            onToggleFriendVisibility={
              onToggleFriendVisibility
                ? () => onToggleFriendVisibility(slug)
                : undefined
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
});
