import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface StepNameProps {
  name: string;
  onNameChange: (name: string) => void;
}

export function StepName({ name, onNameChange }: StepNameProps) {
  return (
    <View className="flex-1 px-6 justify-center">
      <View className="items-center mb-10">
        <Text className="text-5xl mb-4">👋</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          ようこそ！
        </Text>
        <Text className="text-base text-muted-foreground text-center mt-2">
          まずはニックネームを教えてください
        </Text>
      </View>

      <View>
        <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
          ニックネーム
        </Text>
        <TextInput
          className="bg-card border border-border/50 rounded-2xl px-5 py-4 text-base text-foreground shadow-sm"
          placeholder="ニックネームを入力"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={onNameChange}
          maxLength={20}
          autoFocus
        />
        <Text className="text-xs text-muted-foreground mt-2 ml-1">
          あとで変更できます
        </Text>
      </View>
    </View>
  );
}
