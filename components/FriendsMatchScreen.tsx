import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FriendsMatchScreenProps {
  onBack: () => void;
}

export function FriendsMatchScreen({ onBack }: FriendsMatchScreenProps) {
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 items-center justify-center rounded-full bg-secondary mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-3 flex-1">
          <LinearGradient
            colors={['#ec4899', '#f43f5e']}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ borderRadius: 20 }}
          >
            <Ionicons name="people" size={20} color="white" />
          </LinearGradient>
          <View>
            <Text className="text-lg font-bold text-foreground">友達と相性チェック</Text>
            <Text className="text-xs text-muted-foreground">友達を招待して診断</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Invite Section */}
        <View className="px-6 py-8">
          <View className="items-center mb-8">
            <LinearGradient
              colors={['#ec4899', '#f43f5e']}
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ borderRadius: 48 }}
            >
              <Ionicons name="people" size={48} color="white" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-foreground text-center mb-2">
              友達を招待しよう
            </Text>
            <Text className="text-muted-foreground text-center">
              友達と一緒に相性診断や恋愛診断を{'\n'}楽しみましょう
            </Text>
          </View>

          {/* Features */}
          <View className="gap-4 mb-8">
            <View className="flex-row items-center gap-4 bg-secondary rounded-2xl p-4">
              <View className="w-12 h-12 rounded-xl bg-pink-100 items-center justify-center">
                <Ionicons name="heart" size={24} color="#ec4899" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">相性診断</Text>
                <Text className="text-sm text-muted-foreground">
                  友達との性格相性を詳しく分析
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 bg-secondary rounded-2xl p-4">
              <View className="w-12 h-12 rounded-xl bg-purple-100 items-center justify-center">
                <Ionicons name="sparkles" size={24} color="#8b5cf6" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">恋愛診断</Text>
                <Text className="text-sm text-muted-foreground">
                  恋愛における相性を科学的に分析
                </Text>
              </View>
            </View>

            <View className="flex-row items-center gap-4 bg-secondary rounded-2xl p-4">
              <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center">
                <Ionicons name="bar-chart" size={24} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">詳細レポート</Text>
                <Text className="text-sm text-muted-foreground">
                  AIが作成する詳細な相性レポート
                </Text>
              </View>
            </View>
          </View>

          {/* Invite Button */}
          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#ec4899', '#f43f5e']}
              className="rounded-2xl py-4 items-center"
              style={{ borderRadius: 16 }}
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="share-social" size={24} color="white" />
                <Text className="text-white text-lg font-bold">友達を招待する</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Stats */}
          <View className="flex-row justify-center gap-8 mt-8">
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">50万+</Text>
              <Text className="text-sm text-muted-foreground">マッチング数</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-foreground">4.8</Text>
              <Text className="text-sm text-muted-foreground">ユーザー評価</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
