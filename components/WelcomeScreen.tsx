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

      <View className="flex-1 px-6">
        {/* 上部: ロゴとテキスト */}
        <View className="flex-1 items-center justify-center">
          {/* メインビジュアル */}
          <View className="items-center justify-center mb-8">
            <View className="relative">
              {/* ロゴコンテナ */}
              <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                className="w-32 h-32 rounded-[32px] items-center justify-center shadow-2xl shadow-purple-500/20 border border-white/50"
              >
                <LinearGradient
                  colors={['#8b5cf6', '#ec4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-16 h-16 rounded-2xl items-center justify-center"
                  style={{ borderRadius: 20 }}
                >
                  <Ionicons name="sparkles" size={32} color="white" />
                </LinearGradient>
              </LinearGradient>

              {/* 装飾パーツ */}
              <View className="absolute -right-6 -top-6 bg-white p-2.5 rounded-xl shadow-lg shadow-slate-200/50">
                <Ionicons name="heart" size={20} color="#ec4899" />
              </View>
              <View className="absolute -left-5 -bottom-3 bg-white p-2.5 rounded-xl shadow-lg shadow-slate-200/50">
                <Ionicons name="chatbubble" size={20} color="#8b5cf6" />
              </View>
            </View>
          </View>

          {/* テキスト部分 */}
          <View className="items-center">
            <Text className="text-4xl font-black text-slate-900 tracking-tighter text-center mb-3">
              pernect
            </Text>
            <Text className="text-base text-slate-500 text-center font-medium leading-relaxed">
              AIが導く、あなただけの{'\n'}新しいつながりと可能性。
            </Text>
          </View>
        </View>

        {/* 下部: ボタン部分 - 画面下部に固定 */}
        <View className="pb-12 gap-4">
          <TouchableOpacity
            className="w-full"
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/sign-up')}
            style={{ borderRadius: 16 }}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 16, minHeight: 60, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>アカウントを作成</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/sign-in')}
            style={{ borderRadius: 16, minHeight: 60, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderWidth: 2, borderColor: '#e2e8f0' }}
          >
            <Text style={{ color: '#1e293b', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>ログイン</Text>
          </TouchableOpacity>

          {/* 利用規約 */}
          <Text className="text-xs text-slate-400 text-center mt-2 px-4">
            続行することで、利用規約とプライバシーポリシーに同意したことになります。
          </Text>
        </View>
      </View>
    </View>
  );
}
