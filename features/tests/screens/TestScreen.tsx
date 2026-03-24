import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useTestScreenData } from "../hooks/useTestScreenData";

interface TestScreenProps {
  testSlug: string;
  onBack: () => void;
  onComplete: (resultId: Id<"testResults">) => void;
}

export function TestScreen({ testSlug, onBack, onComplete }: TestScreenProps) {
  const insets = useSafeAreaInsets();
  const { existingProgress, testData } = useTestScreenData(testSlug);

  const saveProgress = useMutation(api.testAnswers.saveProgress);
  const calculateResult = useMutation(api.testResults.calculate);
  const clearProgress = useMutation(api.testAnswers.clearProgress);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    { questionOrder: number; selectedValue: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 既存の進捗があれば復元
  useEffect(() => {
    if (existingProgress && existingProgress.answers.length > 0) {
      setAnswers(existingProgress.answers);
      // 最後に回答した質問の次へ
      const maxOrder = Math.max(
        ...existingProgress.answers.map((a) => a.questionOrder)
      );
      const idx = testData?.questions.findIndex((q) => q.order === maxOrder) ?? 0;
      setCurrentQuestionIndex(Math.min(idx + 1, (testData?.questions.length ?? 1) - 1));
    }
  }, [existingProgress, testData?.questions]);

  if (!testData) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-muted-foreground mt-4">テストを準備しています... 💫</Text>
        <Text className="text-muted-foreground text-xs mt-2">もう少しお待ちください</Text>
      </View>
    );
  }

  const { test, questions } = testData;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // 恋愛診断かどうかを判定
  const isLoveTest = test.category === "love" || test.slug === "last-lover";

  const handleSelectOption = async (value: string) => {
    const newAnswer = {
      questionOrder: currentQuestion.order,
      selectedValue: value,
    };

    // 既存の回答を更新または追加
    const updatedAnswers = answers.filter(
      (a) => a.questionOrder !== currentQuestion.order
    );
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    // 進捗を保存（リトライ付き）
    const saveWithRetry = async (retries = 2) => {
      try {
        await saveProgress({
          testId: test._id,
          answers: updatedAnswers,
        });
      } catch (error) {
        if (retries > 0) {
          // リトライ
          await new Promise((resolve) => setTimeout(resolve, 500));
          return saveWithRetry(retries - 1);
        }
        console.error("Failed to save progress:", error);
        toast.error("保存に失敗しました", {
          description: "インターネット接続を確認してください",
        });
      }
    };
    saveWithRetry();

    // 次の質問へ自動遷移（少し遅延を入れて選択を見せる）
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleComplete = async () => {
    if (answers.length < totalQuestions) {
      toast.warning("未回答の質問があります", {
        description: "すべての質問に回答してください",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await calculateResult({ testId: test._id });
      toast.success("診断完了！", {
        description: "結果を表示します",
      });
      onComplete(result.resultId);
    } catch (error) {
      console.error("Failed to calculate result:", error);
      toast.error("結果の算出に失敗しました", {
        description: "もう一度お試しください",
        action: {
          label: "再試行",
          onClick: () => handleComplete(),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (answers.length > 0) {
      Alert.alert(
        "診断を中断しますか？",
        "進捗は保存されます。後から続きを受けられます。",
        [
          { text: "続ける", style: "cancel" },
          { text: "中断する", onPress: onBack },
        ]
      );
    } else {
      onBack();
    }
  };

  const handleReset = () => {
    Alert.alert(
      "最初からやり直しますか？",
      "これまでの回答がすべて削除されます。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "やり直す",
          style: "destructive",
          onPress: async () => {
            try {
              await clearProgress({ testId: test._id });
              setAnswers([]);
              setCurrentQuestionIndex(0);
              toast.success("リセットしました", {
                description: "最初から回答してください",
              });
            } catch (error) {
              console.error("Failed to reset:", error);
              toast.error("リセットに失敗しました", {
                description: "もう一度お試しください",
              });
            }
          },
        },
      ]
    );
  };

  const currentAnswer = answers.find(
    (a) => a.questionOrder === currentQuestion.order
  );
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = answers.length === totalQuestions;

  return (
    <View className={`flex-1 ${isLoveTest ? "bg-pink-50" : "bg-background"}`}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 8, paddingBottom: 16, paddingHorizontal: 24 }}>
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={handleBack} className="flex-row items-center">
            <Ionicons name="close" size={24} color={isLoveTest ? "#9d174d" : "#0f172a"} />
          </TouchableOpacity>
          <View className="flex-row items-center">
            {isLoveTest && <Text className="mr-2">💕</Text>}
            <Text className={`text-lg font-semibold ${isLoveTest ? "text-pink-900" : "text-foreground"}`}>
              {test.title}
            </Text>
          </View>
          <TouchableOpacity onPress={handleReset}>
            <Ionicons name="refresh" size={24} color={isLoveTest ? "#9d174d" : "#64748b"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar - Enhanced for love tests */}
      <View className="px-6 mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className={`text-sm ${isLoveTest ? "text-pink-700" : "text-muted-foreground"}`}>
            {isLoveTest ? "💗 " : ""}質問 {currentQuestionIndex + 1} / {totalQuestions}
          </Text>
          <Text className={`text-sm ${isLoveTest ? "text-pink-700" : "text-muted-foreground"}`}>
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </Text>
        </View>
        <View className={`h-3 rounded-full overflow-hidden ${isLoveTest ? "bg-pink-100" : "bg-gray-200"}`}>
          <LinearGradient
            colors={[test.gradientStart, test.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              height: "100%",
            }}
          />
        </View>
      </View>

      {/* Question */}
      <View className="flex-1 px-6">
        <View>
          {isLoveTest ? (
            <LinearGradient
              colors={["#fdf2f8", "#fce7f3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 24, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: "#fbcfe8" }}
            >
              <Text className="text-xl font-bold text-pink-900 leading-relaxed">
                {currentQuestion.questionText}
              </Text>
            </LinearGradient>
          ) : (
            <View className="bg-card border border-border mb-6" style={{ borderRadius: 24, padding: 24 }}>
              <Text className="text-xl font-bold text-foreground leading-relaxed">
                {currentQuestion.questionText}
              </Text>
            </View>
          )}
        </View>

        {/* Options - Likert Scale or Multiple Choice */}
        {currentQuestion.questionType === "likert" ? (
          // Likert Scale UI (5段階スケール)
          <View className="gap-4">
            {/* Scale Labels */}
            <View className="flex-row justify-between px-2 mb-2">
              <Text className="text-xs text-muted-foreground flex-1 text-left">
                {currentQuestion.typeConfig?.likertLabels?.min || "全く当てはまらない"}
              </Text>
              <Text className="text-xs text-muted-foreground flex-1 text-right">
                {currentQuestion.typeConfig?.likertLabels?.max || "非常に当てはまる"}
              </Text>
            </View>

            {/* Scale Buttons */}
            <View className="flex-row justify-between px-2">
              {Array.from(
                { length: (currentQuestion.typeConfig?.likertMax || 5) - (currentQuestion.typeConfig?.likertMin || 1) + 1 },
                (_, i) => (currentQuestion.typeConfig?.likertMin || 1) + i
              ).map((value) => {
                const isSelected = currentAnswer?.selectedValue === String(value);
                return (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleSelectOption(String(value))}
                    activeOpacity={0.7}
                    className="items-center"
                  >
                    <View
                      className={`w-14 h-14 rounded-full border-2 items-center justify-center ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border bg-card"
                      }`}
                    >
                      <Text
                        className={`text-lg font-bold ${
                          isSelected ? "text-white" : "text-foreground"
                        }`}
                      >
                        {value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Value Indicator */}
            {currentAnswer && (
              <View className="items-center mt-4">
                <Text className="text-sm text-muted-foreground">
                  選択: {currentAnswer.selectedValue}
                </Text>
              </View>
            )}
          </View>
        ) : (
          // Multiple Choice UI (従来の選択肢形式)
          <View className="gap-3">
            {currentQuestion.options?.map((option) => {
              const isSelected = currentAnswer?.selectedValue === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelectOption(option.value)}
                  activeOpacity={0.7}
                >
                  <View
                    className={`rounded-2xl p-5 border-2 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-6 h-6 rounded-full border-2 mr-4 items-center justify-center ${
                          isSelected ? "border-primary bg-primary" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <Ionicons name="checkmark" size={16} color="white" />
                        )}
                      </View>
                      <Text
                        className={`flex-1 text-base ${
                          isSelected
                            ? "text-primary font-semibold"
                            : "text-foreground"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Navigation */}
      <View className="px-6 pb-10 pt-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex-row items-center px-4 py-3 rounded-xl ${
              currentQuestionIndex === 0 ? "opacity-40" : ""
            }`}
          >
            <Ionicons name="chevron-back" size={20} color="#64748b" />
            <Text className="text-muted-foreground ml-1">前へ</Text>
          </TouchableOpacity>

          {isLastQuestion ? (
            <TouchableOpacity
              onPress={handleComplete}
              disabled={!allAnswered || isSubmitting}
              style={{ opacity: !allAnswered || isSubmitting ? 0.4 : 1 }}
            >
              <LinearGradient
                colors={[test.gradientStart, test.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 24,
                  borderRadius: 16,
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text className="text-white font-semibold mr-2">
                      結果を見る
                    </Text>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              disabled={!currentAnswer}
              className={`flex-row items-center px-4 py-3 rounded-xl ${
                !currentAnswer ? "opacity-40" : ""
              }`}
            >
              <Text className="text-muted-foreground mr-1">次へ</Text>
              <Ionicons name="chevron-forward" size={20} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
