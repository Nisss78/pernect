import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// MBTI タイプの日本語名マッピング
const MBTI_NAMES: Record<string, { name: string; description: string }> = {
  INTJ: { name: "建築家", description: "想像力が豊かで戦略的な思考を持つ計画者" },
  INTP: { name: "論理学者", description: "革新的な発明家で尽きることのない知識欲" },
  ENTJ: { name: "指揮官", description: "大胆で想像力豊か、意志の強いリーダー" },
  ENTP: { name: "討論者", description: "賢くて好奇心旺盛な思想家" },
  INFJ: { name: "提唱者", description: "静かで神秘的、しかし非常に勇気づける理想主義者" },
  INFP: { name: "仲介者", description: "詩的で親切な利他主義者、常に善を追求" },
  ENFJ: { name: "主人公", description: "カリスマ性があり人々を励ますリーダー" },
  ENFP: { name: "広報運動家", description: "創造的で、熱心で、社交的な自由な精神" },
  ISTJ: { name: "管理者", description: "実用的で事実に基づいた、信頼性の高い人物" },
  ISFJ: { name: "擁護者", description: "非常に献身的で温かい守護者" },
  ESTJ: { name: "幹部", description: "優れた管理者、人やものを管理する能力" },
  ESFJ: { name: "領事官", description: "非常に思いやりがあり社交的で人気者" },
  ISTP: { name: "巨匠", description: "大胆で実践的な実験者、あらゆる道具の達人" },
  ISFP: { name: "冒険家", description: "柔軟で魅力的な芸術家" },
  ESTP: { name: "起業家", description: "賢く、エネルギッシュで、鋭い知覚の持ち主" },
  ESFP: { name: "エンターテイナー", description: "自発的でエネルギッシュな楽しませ上手" },
};

interface CardContentProps {
  userName: string;
  userIdDisplay: string;
  userMbti: string;
  userImage?: string;
  traitE: number | null;
  traitO: number | null;
  traitA: number | null;
  onEditPress?: () => void;
  onSharePress?: () => void;
}

export function CardContent({
  userName,
  userIdDisplay,
  userMbti,
  userImage,
  traitE,
  traitO,
  traitA,
  onEditPress,
  onSharePress,
}: CardContentProps) {
  const mbtiInfo = userMbti ? MBTI_NAMES[userMbti] : null;

  return (
    <View className="relative">
      {/* Background decorations */}
      <View className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
      <View className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />

      {/* Header row */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            />
          ) : (
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                borderWidth: 3,
                borderColor: "rgba(255,255,255,0.3)",
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person" size={28} color="white" />
            </View>
          )}
          <View>
            <Text className="text-lg font-bold text-white" numberOfLines={1}>
              {userName}
            </Text>
            {userIdDisplay ? (
              <Text className="text-white/80 text-xs">{userIdDisplay}</Text>
            ) : (
              <Text className="text-white/60 text-xs">IDを設定してください</Text>
            )}
          </View>
        </View>
        {onSharePress && (
          <TouchableOpacity
            onPress={onSharePress}
            className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center"
          >
            <Ionicons name="share-social" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* MBTI Section */}
      {mbtiInfo ? (
        <View className="bg-white/15 rounded-xl p-3 mb-3">
          <Text className="text-white/90 text-xs font-semibold mb-2">
            性格タイプ
          </Text>
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-2xl font-bold text-white">{userMbti}</Text>
            <View className="px-2 py-0.5 rounded-full bg-white/25">
              <Text className="text-white text-xs font-bold">{mbtiInfo.name}</Text>
            </View>
          </View>
          <Text className="text-white/90 text-xs" numberOfLines={1}>
            {mbtiInfo.description}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onEditPress}
          className="bg-white/15 rounded-xl p-3 mb-3"
        >
          <Text className="text-white/90 text-xs font-semibold mb-2">
            性格タイプ
          </Text>
          <View className="flex-row items-center gap-2">
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text className="text-white/80 text-sm">MBTIを設定する</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Traits row */}
      <View className="flex-row gap-2">
        <View className="flex-1 bg-white/15 rounded-lg p-2 items-center">
          <Text className="text-white text-xs mb-0.5">外向性</Text>
          <Text className="text-white text-lg font-bold">
            {traitE !== null ? `${traitE}%` : "--"}
          </Text>
        </View>
        <View className="flex-1 bg-white/15 rounded-lg p-2 items-center">
          <Text className="text-white text-xs mb-0.5">開放性</Text>
          <Text className="text-white text-lg font-bold">
            {traitO !== null ? `${traitO}%` : "--"}
          </Text>
        </View>
        <View className="flex-1 bg-white/15 rounded-lg p-2 items-center">
          <Text className="text-white text-xs mb-0.5">共感性</Text>
          <Text className="text-white text-lg font-bold">
            {traitA !== null ? `${traitA}%` : "--"}
          </Text>
        </View>
        {onEditPress && (
          <TouchableOpacity
            onPress={onEditPress}
            className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center"
            accessibilityLabel="プロフィール編集"
          >
            <Ionicons name="create-outline" size={18} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tap hint */}
      <View className="mt-3 items-center">
        <Text className="text-white/50 text-xs">タップして詳細を見る</Text>
      </View>
    </View>
  );
}
