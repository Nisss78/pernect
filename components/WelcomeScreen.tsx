import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* 背景の装飾的なグラデーション */}
      <View className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] opacity-20 transform -rotate-12">
        <LinearGradient
          colors={['#8b5cf6', '#ec4899', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 rounded-[100px]"
        />
      </View>

      <View className="flex-1 items-center justify-center px-8">
        {/* メインビジュアル */}
        <View className="items-center justify-center mb-16">
          <View className="relative">
            {/* グロー効果 */}
            <View className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 rounded-full transform scale-150" />
            
            {/* ロゴコンテナ */}
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              className="w-40 h-40 rounded-[40px] items-center justify-center shadow-2xl shadow-purple-500/20 border border-white/50"
            >
              <LinearGradient
                colors={['#8b5cf6', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-20 h-20 rounded-2xl items-center justify-center transform rotate-3"
                style={{ borderRadius: 24 }}
              >
                <Ionicons name="sparkles" size={40} color="white" />
              </LinearGradient>
            </LinearGradient>

            {/* 装飾パーツ */}
            <View className="absolute -right-8 -top-8 bg-white p-3 rounded-2xl shadow-lg shadow-slate-200/50 transform rotate-12">
              <Ionicons name="heart" size={24} color="#ec4899" />
            </View>
            <View className="absolute -left-6 -bottom-4 bg-white p-3 rounded-2xl shadow-lg shadow-slate-200/50 transform -rotate-6">
              <Ionicons name="chatbubble" size={24} color="#8b5cf6" />
            </View>
          </View>
        </View>

        {/* テキスト部分 */}
        <View className="items-center mb-16 space-y-4">
          <Text className="text-5xl font-black text-slate-900 tracking-tighter text-center mb-2">
            pernect
          </Text>
          <Text className="text-lg text-slate-500 text-center font-medium leading-relaxed px-4">
            AIが導く、あなただけの{'\n'}新しいつながりと可能性。
          </Text>
        </View>

        {/* ボタン部分 */}
        <View className="w-full gap-4 mb-12">
          <TouchableOpacity 
            className="w-full shadow-xl shadow-purple-500/30" 
            activeOpacity={0.9}
            onPress={() => router.push('/(auth)/sign-up')}
            style={{ borderRadius: 20 }}
          >
            <LinearGradient
              colors={['#1e293b', '#0f172a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-full py-5 items-center justify-center border border-slate-700/50"
              style={{ borderRadius: 20 }}
            >
              <Text className="text-white font-bold text-lg tracking-wide text-center">はじめる</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-full py-5 items-center justify-center bg-white border border-slate-200" 
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/sign-in')}
            style={{ borderRadius: 20 }}
          >
            <Text className="text-slate-900 font-bold text-lg text-center">ログイン</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
