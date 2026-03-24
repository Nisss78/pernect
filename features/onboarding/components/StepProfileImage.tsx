import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface StepProfileImageProps {
  image: string;
  onPickImage: () => void;
  onClearImage: () => void;
}

export function StepProfileImage({
  image,
  onPickImage,
  onClearImage,
}: StepProfileImageProps) {
  return (
    <View className="flex-1 px-6 justify-center">
      <View className="items-center mb-10">
        <Text className="text-5xl mb-4">🖼️</Text>
        <Text className="text-2xl font-bold text-foreground text-center">
          プロフィール画像を設定
        </Text>
        <Text className="text-base text-muted-foreground text-center mt-2">
          あとで変更できます。今は好きな画像を入れて大丈夫です
        </Text>
      </View>

      <View className="items-center">
        <TouchableOpacity
          activeOpacity={0.85}
          className="w-40 h-40 rounded-full bg-card border border-border/60 items-center justify-center overflow-hidden shadow-sm"
          onPress={onPickImage}
        >
          {image ? (
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center justify-center">
              <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center mb-3">
                <Ionicons name="person" size={32} color="#64748b" />
              </View>
              <Text className="text-sm font-semibold text-foreground">画像を選択</Text>
            </View>
          )}
        </TouchableOpacity>

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            className="px-5 py-3 rounded-2xl bg-[#8b5cf6]"
            onPress={onPickImage}
          >
            <Text className="text-white font-bold">写真を選ぶ</Text>
          </TouchableOpacity>

          {image ? (
            <TouchableOpacity
              className="px-5 py-3 rounded-2xl bg-card border border-border"
              onPress={onClearImage}
            >
              <Text className="text-foreground font-bold">削除</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text className="text-xs text-muted-foreground mt-4 text-center">
          正方形に切り抜かれて表示されます
        </Text>
      </View>
    </View>
  );
}
