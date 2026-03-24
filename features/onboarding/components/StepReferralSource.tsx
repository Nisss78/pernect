import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface StepReferralSourceProps {
  referralSource: string;
  onReferralSourceChange: (source: string) => void;
}

const REFERRAL_OPTIONS = [
  { value: 'sns', label: 'SNS', emoji: '📱', description: 'X, Instagram, TikTokなど' },
  { value: 'friend', label: '友達・知人', emoji: '👫', description: '友達に教えてもらった' },
  { value: 'app_store', label: 'App Store', emoji: '🏪', description: 'ストアで見つけた' },
  { value: 'search', label: '検索', emoji: '🔍', description: 'Googleなどで検索した' },
  { value: 'other', label: 'その他', emoji: '💬', description: 'その他の方法' },
];

export function StepReferralSource({
  referralSource,
  onReferralSourceChange,
}: StepReferralSourceProps) {
  return (
    <View className="flex-1 px-6 justify-center">
      <View className="items-center mb-8">
        <Text className="text-5xl mb-4">🎯</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          Pernectをどこで知りましたか？
        </Text>
        <Text className="text-base text-muted-foreground text-center mt-2">
          より良いサービス改善のために教えてください
        </Text>
      </View>

      <View className="gap-3">
        {REFERRAL_OPTIONS.map((option) => {
          const isSelected = referralSource === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => onReferralSourceChange(option.value)}
              className={`rounded-2xl px-5 py-4 border-2 flex-row items-center gap-4 ${
                isSelected
                  ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
                  : 'border-border bg-card'
              }`}
            >
              <Text className="text-3xl">{option.emoji}</Text>
              <View className="flex-1">
                <Text
                  className={`text-base font-bold ${
                    isSelected ? 'text-[#8b5cf6]' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
