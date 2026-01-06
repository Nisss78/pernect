import React, { forwardRef } from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface ShareCardProps {
  testTitle: string;
  resultType: string;
  scores?: Record<string, number>;
  userName?: string;
  completedAt?: number;
  gradientStart?: string;
  gradientEnd?: string;
  icon?: string;
}

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth - 48;

const ShareCard = forwardRef<View, ShareCardProps>(
  (
    {
      testTitle,
      resultType,
      scores,
      userName,
      completedAt,
      gradientStart = "#8b5cf6",
      gradientEnd = "#2563eb",
      icon,
    },
    ref
  ) => {
    const formatDate = (timestamp?: number) => {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return date.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getIconName = (iconStr?: string): keyof typeof Ionicons.glyphMap => {
      const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
        brain: "extension-puzzle",
        briefcase: "briefcase",
        heart: "heart",
        book: "book",
        star: "star",
        leaf: "leaf",
        people: "people",
        bulb: "bulb",
        fitness: "fitness",
        cash: "cash",
      };
      return iconMap[iconStr || ""] || "help-circle";
    };

    // スコアの上位3つを取得
    const topScores = scores
      ? Object.entries(scores)
          .filter(([key]) => key !== "total")
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
      : [];

    return (
      <View
        ref={ref}
        style={{
          width: cardWidth,
          backgroundColor: "#ffffff",
          borderRadius: 24,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        {/* ヘッダー部分（グラデーション） */}
        <LinearGradient
          colors={[gradientStart, gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 32,
            paddingBottom: 40,
            paddingHorizontal: 24,
            alignItems: "center",
          }}
        >
          {/* アイコン */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name={getIconName(icon)} size={32} color="white" />
          </View>

          {/* テスト名 */}
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 14,
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            {testTitle}
          </Text>

          {/* 結果タイプ */}
          <Text
            style={{
              color: "#ffffff",
              fontSize: 36,
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {resultType}
          </Text>

          {/* ユーザー名 */}
          {userName && (
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: 14,
                marginTop: 12,
              }}
            >
              {userName} の結果
            </Text>
          )}
        </LinearGradient>

        {/* スコア表示部分 */}
        {topScores.length > 0 && (
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#94a3b8",
                fontWeight: "600",
                marginBottom: 12,
              }}
            >
              スコア詳細
            </Text>
            {topScores.map(([key, value]) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: "#334155",
                    fontWeight: "500",
                  }}
                >
                  {key}
                </Text>
                <View
                  style={{
                    width: 120,
                    height: 8,
                    backgroundColor: "#e2e8f0",
                    borderRadius: 4,
                    overflow: "hidden",
                    marginRight: 8,
                  }}
                >
                  <LinearGradient
                    colors={[gradientStart, gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: "100%",
                      width: `${Math.min(value * 10, 100)}%`,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    fontWeight: "600",
                    width: 30,
                    textAlign: "right",
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* フッター */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderTopWidth: 1,
            borderTopColor: "#f1f5f9",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <LinearGradient
              colors={["#8b5cf6", "#2563eb"]}
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
                P
              </Text>
            </LinearGradient>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#334155",
              }}
            >
              pernect
            </Text>
          </View>

          {completedAt && (
            <Text
              style={{
                fontSize: 12,
                color: "#94a3b8",
              }}
            >
              {formatDate(completedAt)}
            </Text>
          )}
        </View>
      </View>
    );
  }
);

ShareCard.displayName = "ShareCard";

export default ShareCard;
