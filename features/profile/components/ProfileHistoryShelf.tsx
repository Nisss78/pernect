import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

export interface ProfileHistoryCard {
  key: string;
  title: string;
  subtitle: string;
  meta: string;
  icon: IconName;
  colors: [string, string];
  kindLabel: string;
  onPress?: () => void;
  placeholder?: boolean;
  timestamp?: number;
}

interface ProfileHistoryShelfProps {
  cards: ProfileHistoryCard[];
}

export function ProfileHistoryShelf({ cards }: ProfileHistoryShelfProps) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(168, width * 0.42);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.headerText}>履歴</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {cards.map((card) => (
          <TouchableOpacity
            key={card.key}
            activeOpacity={0.85}
            disabled={!card.onPress}
            onPress={card.onPress}
            style={[
              styles.card,
              {
                width: cardWidth,
              },
              card.placeholder ? styles.placeholderCard : null,
            ]}
          >
            <View style={styles.cardStickerArea}>
              {card.placeholder ? (
                <View style={styles.placeholderBadge}>
                  <Ionicons color="#94a3b8" name="sparkles" size={28} />
                </View>
              ) : (
                <LinearGradient
                  colors={card.colors}
                  start={{ x: 0.05, y: 0.05 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardSticker}
                >
                  <Ionicons color="#ffffff" name={card.icon} size={32} />
                  <View style={styles.cardFloat}>
                    <Ionicons color="#8b5cf6" name="sparkles" size={12} />
                  </View>
                </LinearGradient>
              )}
            </View>

            {card.placeholder ? (
              <View style={styles.placeholderFooter} />
            ) : (
              <View style={styles.cardTextBlock}>
                <Text numberOfLines={1} style={styles.kindLabel}>
                  {card.kindLabel}
                </Text>
                <Text numberOfLines={1} style={styles.cardTitle}>
                  {card.title}
                </Text>
                <Text numberOfLines={2} style={styles.cardSubtitle}>
                  {card.subtitle}
                </Text>
                <Text numberOfLines={1} style={styles.cardMeta}>
                  {card.meta}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 8,
    width: "100%",
  },
  headerText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  scrollContent: {
    gap: 12,
    paddingRight: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 28,
    borderWidth: 1,
    minHeight: 206,
    overflow: "hidden",
    padding: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  placeholderCard: {
    borderStyle: "dashed",
  },
  cardStickerArea: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 22,
    height: 112,
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  cardSticker: {
    alignItems: "center",
    borderRadius: 28,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  cardFloat: {
    position: "absolute",
    right: -6,
    top: -6,
  },
  placeholderBadge: {
    alignItems: "center",
    borderColor: "#cbd5e1",
    borderRadius: 24,
    borderStyle: "dashed",
    borderWidth: 1.5,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  placeholderFooter: {
    minHeight: 58,
  },
  cardTextBlock: {
    gap: 4,
    paddingHorizontal: 2,
  },
  kindLabel: {
    color: "#8b5cf6",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  cardTitle: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
    minHeight: 36,
  },
  cardMeta: {
    color: "#94a3b8",
    fontSize: 11,
  },
});
