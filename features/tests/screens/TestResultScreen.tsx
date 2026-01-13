import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Id } from "../../../convex/_generated/dataModel";
import { useTestResultData } from "../hooks/useTestResultData";

interface TestResultScreenProps {
  resultId: Id<"testResults">;
  onBack: () => void;
  onRetakeTest: (testSlug: string) => void;
}

export function TestResultScreen({
  resultId,
  onBack,
  onRetakeTest,
}: TestResultScreenProps) {
  const insets = useSafeAreaInsets();
  const { isLastLoverTest, lastLoverDetails, resultData } = useTestResultData(resultId);

  if (!resultData) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">結果を読み込み中...</Text>
      </View>
    );
  }

  const { test, resultType, scores, analysis, completedAt } = resultData;

  if (!test) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-muted-foreground">テスト情報が見つかりません</Text>
        <TouchableOpacity onPress={onBack} className="mt-4">
          <Text className="text-primary">戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderScoreBar = (label: string, value: number, max: number, color: string) => {
    const percentage = Math.round((value / max) * 100);
    return (
      <View className="mb-3">
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-foreground">{label}</Text>
          <Text className="text-sm text-muted-foreground">{value}/{max}</Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </View>
      </View>
    );
  };

  const renderDimensionScores = () => {
    if (test.scoringType !== "dimension") return null;

    const dimensions = [
      { left: "E", right: "I", leftLabel: "外向型", rightLabel: "内向型", color: "#8b5cf6" },
      { left: "S", right: "N", leftLabel: "感覚型", rightLabel: "直感型", color: "#2563eb" },
      { left: "T", right: "F", leftLabel: "思考型", rightLabel: "感情型", color: "#10b981" },
      { left: "J", right: "P", leftLabel: "判断型", rightLabel: "知覚型", color: "#f97316" },
    ];

    return (
      <View className="bg-card rounded-2xl p-5 border border-border mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">次元別スコア</Text>
        {dimensions.map((dim) => {
          const leftScore = (scores as Record<string, number>)[dim.left] || 0;
          const rightScore = (scores as Record<string, number>)[dim.right] || 0;
          const total = leftScore + rightScore;
          const leftPercentage = total > 0 ? Math.round((leftScore / total) * 100) : 50;

          return (
            <View key={dim.left + dim.right} className="mb-4">
              <View className="flex-row justify-between mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: dim.color }}
                  >
                    <Text className="text-white font-bold text-xs">{dim.left}</Text>
                  </View>
                  <Text className="text-sm text-foreground">{dim.leftLabel}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-sm text-foreground">{dim.rightLabel}</Text>
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center ml-2"
                    style={{ backgroundColor: dim.color, opacity: 0.5 }}
                  >
                    <Text className="text-white font-bold text-xs">{dim.right}</Text>
                  </View>
                </View>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden flex-row">
                <View
                  className="h-full"
                  style={{
                    width: `${leftPercentage}%`,
                    backgroundColor: dim.color,
                  }}
                />
                <View
                  className="h-full"
                  style={{
                    width: `${100 - leftPercentage}%`,
                    backgroundColor: dim.color,
                    opacity: 0.3,
                  }}
                />
              </View>
              <View className="flex-row justify-between mt-1">
                <Text className="text-xs text-muted-foreground">{leftPercentage}%</Text>
                <Text className="text-xs text-muted-foreground">{100 - leftPercentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // 強み診断かどうかの判定
  const isStrengthsTest = test?.slug === "strengths";

  // ドメイン情報のマッピング
  const domainInfo: Record<string, { label: string; color: string; bgColor: string }> = {
    executing: { label: "実行力", color: "#f59e0b", bgColor: "#fef3c7" },
    influencing: { label: "影響力", color: "#ef4444", bgColor: "#fee2e2" },
    relationship: { label: "人間関係構築力", color: "#10b981", bgColor: "#d1fae5" },
    thinking: { label: "戦略的思考力", color: "#2563eb", bgColor: "#dbeafe" },
  };

  // 強み診断: Top 5テーマを表示
  const renderStrengthsTop5 = () => {
    if (!isStrengthsTest || test.scoringType !== "single") return null;

    const scoreEntries = Object.entries(scores as Record<string, number>).sort(
      ([, a], [, b]) => b - a
    );
    const top5 = scoreEntries.slice(0, 5);
    const resultTypes = test.resultTypes as Record<string, {
      nameJa: string;
      domain: string;
      domainJa: string;
      summary: string;
      description: string;
      strengths: string[];
      howToUse: string[];
    }>;

    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

    return (
      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        className="mb-4"
      >
        <LinearGradient
          colors={["#fffbeb", "#fef3c7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-5"
          style={{ borderWidth: 1, borderColor: "#fde68a" }}
        >
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-amber-200 items-center justify-center mr-3">
              <Text className="text-xl">⭐</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-amber-900">
                あなたのTop 5 強み
              </Text>
              <Text className="text-xs text-amber-600">
                最も高いスコアを獲得したテーマ
              </Text>
            </View>
          </View>

          {top5.map(([themeKey, score], index) => {
            const themeInfo = resultTypes?.[themeKey];
            const domain = themeInfo?.domain || "executing";
            const domainStyle = domainInfo[domain] || domainInfo.executing;

            return (
              <Animated.View
                key={themeKey}
                entering={FadeInDown.delay(300 + index * 100).duration(400)}
                className="bg-white/80 rounded-xl p-4 mb-3"
                style={{
                  borderWidth: 1,
                  borderColor: index < 3 ? "#fde68a" : "#e5e7eb"
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl mr-3">{medals[index]}</Text>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-base font-bold text-gray-900">
                        {themeInfo?.nameJa || themeKey}
                      </Text>
                      <View
                        className="rounded-full px-2 py-0.5 ml-2"
                        style={{ backgroundColor: domainStyle.bgColor }}
                      >
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: domainStyle.color }}
                        >
                          {domainStyle.label}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-gray-500 mt-0.5">{themeKey}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-amber-600">{score}</Text>
                    <Text className="text-xs text-gray-400">点</Text>
                  </View>
                </View>
                {themeInfo?.summary && (
                  <Text className="text-sm text-gray-700 leading-relaxed">
                    {themeInfo.summary}
                  </Text>
                )}
              </Animated.View>
            );
          })}
        </LinearGradient>
      </Animated.View>
    );
  };

  // 強み診断: ドメイン分布を表示
  const renderStrengthsDomainDistribution = () => {
    if (!isStrengthsTest || test.scoringType !== "single") return null;

    const scoreEntries = Object.entries(scores as Record<string, number>).sort(
      ([, a], [, b]) => b - a
    );
    const top5 = scoreEntries.slice(0, 5);
    const resultTypes = test.resultTypes as Record<string, { domain: string }>;

    // ドメインごとのTop 5内の数をカウント
    const domainCounts: Record<string, number> = {
      executing: 0,
      influencing: 0,
      relationship: 0,
      thinking: 0,
    };

    top5.forEach(([themeKey]) => {
      const domain = resultTypes?.[themeKey]?.domain;
      if (domain && domainCounts[domain] !== undefined) {
        domainCounts[domain]++;
      }
    });

    return (
      <Animated.View
        entering={FadeInDown.delay(800).duration(500)}
        className="bg-card rounded-2xl p-5 border border-border mb-4"
      >
        <Text className="text-lg font-bold text-foreground mb-4">ドメイン分布</Text>
        <Text className="text-sm text-muted-foreground mb-4">
          あなたのTop 5強みが属するドメイン
        </Text>
        {Object.entries(domainInfo).map(([domain, info]) => {
          const count = domainCounts[domain];
          const percentage = (count / 5) * 100;

          return (
            <View key={domain} className="mb-3">
              <View className="flex-row justify-between items-center mb-1">
                <View className="flex-row items-center">
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: info.color }}
                  />
                  <Text className="text-sm text-foreground">{info.label}</Text>
                </View>
                <Text className="text-sm text-muted-foreground">{count}/5</Text>
              </View>
              <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: info.color,
                  }}
                />
              </View>
            </View>
          );
        })}
      </Animated.View>
    );
  };

  const renderSingleScores = () => {
    if (test.scoringType !== "single") return null;

    // 強み診断の場合はTop 5表示を使用
    if (isStrengthsTest) return null;

    const scoreEntries = Object.entries(scores as Record<string, number>).sort(
      ([, a], [, b]) => b - a
    );
    const maxScore = Math.max(...scoreEntries.map(([, v]) => v));
    const colors = ["#8b5cf6", "#2563eb", "#10b981", "#f97316", "#ef4444", "#06b6d4", "#84cc16", "#ec4899", "#f59e0b"];

    return (
      <View className="bg-card rounded-2xl p-5 border border-border mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">タイプ別スコア</Text>
        {scoreEntries.map(([type, score], index) => (
          <View key={type}>
            {renderScoreBar(
              type.replace("type", "タイプ"),
              score,
              maxScore,
              colors[index % colors.length]
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderPercentileScores = () => {
    if (test.scoringType !== "percentile") return null;

    // BIG5因子のラベルと色定義
    const big5Factors: Record<string, { label: string; fullLabel: string; color: string }> = {
      O: { label: "開放性", fullLabel: "開放性 (Openness)", color: "#8b5cf6" },
      C: { label: "誠実性", fullLabel: "誠実性 (Conscientiousness)", color: "#2563eb" },
      E: { label: "外向性", fullLabel: "外向性 (Extraversion)", color: "#10b981" },
      A: { label: "協調性", fullLabel: "協調性 (Agreeableness)", color: "#f97316" },
      N: { label: "神経症傾向", fullLabel: "神経症傾向 (Neuroticism)", color: "#ef4444" },
    };

    // aiDataからパーセンタイルを取得（存在する場合）
    const percentiles = resultData.aiData?.percentiles as Record<string, number> | undefined;

    // スコアをソート（パーセンタイルが高い順）
    const scoreEntries = Object.entries(scores as Record<string, number>)
      .filter(([key]) => big5Factors[key])
      .sort(([keyA], [keyB]) => {
        const pA = percentiles?.[keyA] ?? 0;
        const pB = percentiles?.[keyB] ?? 0;
        return pB - pA;
      });

    return (
      <View className="bg-card rounded-2xl p-5 border border-border mb-4">
        <Text className="text-lg font-bold text-foreground mb-4">5因子パーセンタイル</Text>
        {scoreEntries.map(([factor, rawScore]) => {
          const factorInfo = big5Factors[factor];
          if (!factorInfo) return null;

          // パーセンタイルを取得（aiDataから、または生スコアから推定）
          const percentile = percentiles?.[factor] ?? Math.round(((rawScore - 10) / 40) * 100);

          return (
            <View key={factor} className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: factorInfo.color }}
                  >
                    <Text className="text-white font-bold text-sm">{factor}</Text>
                  </View>
                  <View>
                    <Text className="text-sm font-semibold text-foreground">
                      {factorInfo.label}
                    </Text>
                    <Text className="text-xs text-muted-foreground">
                      スコア: {rawScore}/50
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: factorInfo.color }}
                  >
                    {percentile}%
                  </Text>
                </View>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${percentile}%`,
                    backgroundColor: factorInfo.color,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // 最後の恋人診断: 相性の良いタイプを表示
  const renderBestCompatibilities = () => {
    if (!isLastLoverTest || !lastLoverDetails?.compatibilities) return null;

    const { best, good } = lastLoverDetails.compatibilities;
    const bestMatches = [...best, ...good].slice(0, 3);

    if (bestMatches.length === 0) return null;

    return (
      <Animated.View
        entering={FadeInDown.delay(300).duration(500)}
        className="mb-4"
      >
        <LinearGradient
          colors={["#fdf2f8", "#fce7f3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-5"
          style={{ borderWidth: 1, borderColor: "#fbcfe8" }}
        >
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-pink-200 items-center justify-center mr-3">
              <Text className="text-xl">💕</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-pink-900">
                相性の良いタイプ
              </Text>
              <Text className="text-xs text-pink-600">
                あなたと相性が良い恋愛タイプ
              </Text>
            </View>
          </View>

          {bestMatches.map((compat, index) => (
            <Animated.View
              key={compat.compatibleType}
              entering={FadeInDown.delay(400 + index * 100).duration(400)}
              className="bg-white/70 rounded-xl p-4 mb-3"
              style={{
                borderWidth: 1,
                borderColor: compat.compatibilityLevel === "best" ? "#f9a8d4" : "#fce7f3"
              }}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">
                  {compat.compatibleTypeInfo?.emoji || "💝"}
                </Text>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-base font-bold text-pink-900">
                      {compat.compatibleTypeInfo?.characterName || compat.compatibleType}
                    </Text>
                    {compat.compatibilityLevel === "best" && (
                      <View className="bg-pink-500 rounded-full px-2 py-0.5 ml-2">
                        <Text className="text-xs text-white font-semibold">最高</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-pink-600">{compat.compatibleType}</Text>
                </View>
              </View>
              <Text className="text-sm text-pink-800 leading-relaxed">
                {compat.reason}
              </Text>
              {compat.advice && (
                <View className="mt-2 pt-2 border-t border-pink-100">
                  <Text className="text-xs text-pink-600 italic">
                    💡 {compat.advice}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))}
        </LinearGradient>
      </Animated.View>
    );
  };

  // 最後の恋人診断: 注意が必要なタイプを表示
  const renderChallengingCompatibilities = () => {
    if (!isLastLoverTest || !lastLoverDetails?.compatibilities) return null;

    const { challenging } = lastLoverDetails.compatibilities;

    if (challenging.length === 0) return null;

    return (
      <Animated.View
        entering={FadeInDown.delay(600).duration(500)}
        className="mb-4"
      >
        <LinearGradient
          colors={["#faf5ff", "#f3e8ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-5"
          style={{ borderWidth: 1, borderColor: "#e9d5ff" }}
        >
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-purple-200 items-center justify-center mr-3">
              <Text className="text-xl">🤔</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-purple-900">
                ちょっと注意なタイプ
              </Text>
              <Text className="text-xs text-purple-600">
                お互いの理解が大切になるかも
              </Text>
            </View>
          </View>

          {challenging.slice(0, 2).map((compat: typeof challenging[number], index: number) => (
            <Animated.View
              key={compat.compatibleType}
              entering={FadeInDown.delay(700 + index * 100).duration(400)}
              className="bg-white/70 rounded-xl p-4 mb-3"
              style={{ borderWidth: 1, borderColor: "#e9d5ff" }}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">
                  {compat.compatibleTypeInfo?.emoji || "💜"}
                </Text>
                <View className="flex-1">
                  <Text className="text-base font-bold text-purple-900">
                    {compat.compatibleTypeInfo?.characterName || compat.compatibleType}
                  </Text>
                  <Text className="text-xs text-purple-600">{compat.compatibleType}</Text>
                </View>
              </View>
              <Text className="text-sm text-purple-800 leading-relaxed">
                {compat.reason}
              </Text>
              {compat.advice && (
                <View className="mt-2 pt-2 border-t border-purple-100">
                  <Text className="text-xs text-purple-600 italic">
                    💡 {compat.advice}
                  </Text>
                </View>
              )}
            </Animated.View>
          ))}

          <View className="bg-white/50 rounded-lg p-3 mt-2">
            <Text className="text-xs text-purple-700 text-center leading-relaxed">
              ⚠️ 相性は参考情報です。お互いの努力と理解で、
              どんなタイプとも素敵な関係を築けます！
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  // 最後の恋人診断: タイプ詳細情報を表示
  const renderLastLoverTypeDetails = () => {
    if (!isLastLoverTest || !lastLoverDetails?.typeInfo) return null;

    const { typeInfo } = lastLoverDetails;

    return (
      <Animated.View
        entering={FadeInUp.delay(200).duration(500)}
        className="mb-4"
      >
        <LinearGradient
          colors={["#fdf4ff", "#fce7f3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-2xl p-5"
          style={{ borderWidth: 1, borderColor: "#f5d0fe" }}
        >
          <View className="items-center mb-4">
            <Text className="text-5xl mb-2">{typeInfo.emoji}</Text>
            <Text className="text-xl font-bold text-pink-900">
              {typeInfo.characterName}
            </Text>
            <Text className="text-sm text-pink-600">{typeInfo.typeCode}</Text>
          </View>

          <Text className="text-sm text-pink-800 leading-relaxed mb-4">
            {typeInfo.summary}
          </Text>

          {/* 恋愛スタイル */}
          <View className="bg-white/60 rounded-xl p-4 mb-3">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">💗</Text>
              <Text className="text-sm font-bold text-pink-900">恋愛スタイル</Text>
            </View>
            <Text className="text-sm text-pink-800 leading-relaxed">
              {typeInfo.loveStyle}
            </Text>
          </View>

          {/* 理想のデート */}
          <View className="bg-white/60 rounded-xl p-4 mb-3">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">🌟</Text>
              <Text className="text-sm font-bold text-pink-900">理想のデート</Text>
            </View>
            <Text className="text-sm text-pink-800 leading-relaxed">
              {typeInfo.idealDate}
            </Text>
          </View>

          {/* コミュニケーションスタイル */}
          <View className="bg-white/60 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">💬</Text>
              <Text className="text-sm font-bold text-pink-900">コミュニケーション</Text>
            </View>
            <Text className="text-sm text-pink-800 leading-relaxed">
              {typeInfo.communicationStyle}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[test.gradientStart, test.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 16, paddingBottom: 32, paddingHorizontal: 24 }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity
              onPress={onBack}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white/80 text-sm">
              {formatDate(completedAt)}
            </Text>
          </View>

          <Text className="text-white/80 text-sm mb-2">{test.title}の結果</Text>
          <Text className="text-4xl font-bold text-white mb-2">{resultType}</Text>
          {analysis && (
            <Text className="text-white/90 text-lg">{analysis.summary}</Text>
          )}
        </LinearGradient>

        <View className="px-6 py-6">
          {/* Last Lover Type Details */}
          {renderLastLoverTypeDetails()}

          {/* Description */}
          {analysis && !isLastLoverTest && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <Text className="text-lg font-bold text-foreground mb-3">あなたのタイプについて</Text>
              <Text className="text-foreground leading-relaxed">
                {analysis.description}
              </Text>
            </View>
          )}

          {/* Scores */}
          {renderDimensionScores()}
          {renderStrengthsTop5()}
          {renderStrengthsDomainDistribution()}
          {renderSingleScores()}
          {renderPercentileScores()}

          {/* Strengths */}
          {analysis?.strengths && analysis.strengths.length > 0 && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-3">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                </View>
                <Text className="text-lg font-bold text-foreground">強み</Text>
              </View>
              {analysis.strengths.map((strength, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#10b981"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-foreground ml-2 flex-1">{strength}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Weaknesses */}
          {analysis?.weaknesses && analysis.weaknesses.length > 0 && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="alert-circle" size={20} color="#f97316" />
                </View>
                <Text className="text-lg font-bold text-foreground">注意点</Text>
              </View>
              {analysis.weaknesses.map((weakness, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#f97316"
                    style={{ marginTop: 2 }}
                  />
                  <Text className="text-foreground ml-2 flex-1">{weakness}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <View className="bg-card rounded-2xl p-5 border border-border mb-4">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Ionicons name="bulb" size={20} color="#2563eb" />
                </View>
                <Text className="text-lg font-bold text-foreground">アドバイス</Text>
              </View>
              {analysis.recommendations.map((rec, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-blue-500 font-bold mr-2">{index + 1}.</Text>
                  <Text className="text-foreground flex-1">{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Last Lover Compatibility Sections */}
          {renderBestCompatibilities()}
          {renderChallengingCompatibilities()}

          {/* Actions */}
          <View className="flex-row gap-4 mt-6 mb-10">
            <TouchableOpacity
              onPress={() => onRetakeTest(test.slug)}
              className="flex-1"
            >
              <View
                className="bg-card border border-border flex-row items-center justify-center"
                style={{ borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20 }}
              >
                <Ionicons name="refresh" size={20} color="#64748b" />
                <Text className="text-muted-foreground font-semibold ml-2">
                  もう一度診断する
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1">
              <LinearGradient
                colors={[test.gradientStart, test.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 16,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="share-outline" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">シェアする</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
