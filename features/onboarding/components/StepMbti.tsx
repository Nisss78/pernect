import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface StepMbtiProps {
  mbti: string;
  onMbtiChange: (mbti: string) => void;
}

const MBTI_TYPES = [
  { code: 'INTJ', label: '建築家', emoji: '🧠' },
  { code: 'INTP', label: '論理学者', emoji: '🔬' },
  { code: 'ENTJ', label: '指揮官', emoji: '👑' },
  { code: 'ENTP', label: '討論者', emoji: '💡' },
  { code: 'INFJ', label: '提唱者', emoji: '🌟' },
  { code: 'INFP', label: '仲介者', emoji: '🦋' },
  { code: 'ENFJ', label: '主人公', emoji: '🎭' },
  { code: 'ENFP', label: '広報運動家', emoji: '🌈' },
  { code: 'ISTJ', label: '管理者', emoji: '📋' },
  { code: 'ISFJ', label: '擁護者', emoji: '🛡️' },
  { code: 'ESTJ', label: '幹部', emoji: '💼' },
  { code: 'ESFJ', label: '領事官', emoji: '🤝' },
  { code: 'ISTP', label: '巨匠', emoji: '🔧' },
  { code: 'ISFP', label: '冒険家', emoji: '🎨' },
  { code: 'ESTP', label: '起業家', emoji: '🚀' },
  { code: 'ESFP', label: 'エンターテイナー', emoji: '🎤' },
];

export function StepMbti({ mbti, onMbtiChange }: StepMbtiProps) {
  const [knowsMbti, setKnowsMbti] = useState<boolean | null>(
    mbti ? true : null
  );

  if (knowsMbti === null) {
    return (
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
          <Text className="text-5xl mb-4">🧩</Text>
          <Text className="text-2xl font-bold text-foreground text-center">
            MBTIって知ってる？
          </Text>
          <Text className="text-base text-muted-foreground text-center mt-2">
            16タイプの性格診断です
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={() => setKnowsMbti(true)}
            className="bg-card border-2 border-[#8b5cf6] rounded-2xl px-6 py-5 items-center"
          >
            <Text className="text-lg font-bold text-[#8b5cf6]">
              知ってる！自分のタイプもわかる
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setKnowsMbti(false);
              onMbtiChange('');
            }}
            className="bg-card border border-border rounded-2xl px-6 py-5 items-center"
          >
            <Text className="text-lg font-medium text-muted-foreground">
              知らない / スキップする
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (knowsMbti === false) {
    return (
      <View className="flex-1 px-6 justify-center">
        <View className="items-center">
          <Text className="text-5xl mb-4">✨</Text>
          <Text className="text-2xl font-bold text-foreground text-center">
            大丈夫！
          </Text>
          <Text className="text-base text-muted-foreground text-center mt-2">
            アプリ内のMBTI診断でいつでも調べられます
          </Text>
          <Text className="text-sm text-muted-foreground text-center mt-4">
            「次へ」を押して進みましょう
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 px-6">
      <View className="items-center mt-4 mb-4">
        <Text className="text-2xl font-bold text-foreground text-center">
          あなたのMBTIは？
        </Text>
        <Text className="text-sm text-muted-foreground text-center mt-1">
          タイプを選んでください
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {MBTI_TYPES.map((type) => {
            const isSelected = mbti === type.code;
            return (
              <TouchableOpacity
                key={type.code}
                onPress={() => onMbtiChange(type.code)}
                className={`w-[48%] rounded-2xl px-4 py-4 border-2 ${
                  isSelected
                    ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
                    : 'border-border bg-card'
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-xl">{type.emoji}</Text>
                  <View className="flex-1">
                    <Text
                      className={`text-base font-bold ${
                        isSelected ? 'text-[#8b5cf6]' : 'text-foreground'
                      }`}
                    >
                      {type.code}
                    </Text>
                    <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                      {type.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => {
            setKnowsMbti(null);
            onMbtiChange('');
          }}
          className="mt-4 items-center py-3"
        >
          <Text className="text-sm text-muted-foreground">
            やっぱりスキップする
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
