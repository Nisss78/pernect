import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface ProfileScreenProps {
  onNavigate: (screen: 'home' | 'profile' | 'settings') => void;
  onActionPress?: () => void;
}

export function ProfileScreen({ onNavigate, onActionPress }: ProfileScreenProps) {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-14 pb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-primary">
              プロフィール
            </Text>
            <TouchableOpacity 
              onPress={() => onNavigate('settings')}
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary"
            >
              <Ionicons name="settings-sharp" size={24} className="text-accent" color="#ec4899" />
            </TouchableOpacity>
          </View>
          <Text className="text-muted-foreground text-sm">あなたの性格の旅と洞察</Text>
        </View>

        <View className="px-6 mb-6">
          <LinearGradient
            colors={['#ec4899', '#8b5cf6', '#7c3aed']} // accent via primary to violet-600
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 shadow-lg overflow-hidden relative"
            style={{ borderRadius: 24 }}
          >
            {/* Decorative circles */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <View className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

            <View className="relative">
              <View className="flex-row items-start justify-between mb-6">
                <View className="flex-row items-center gap-4">
                  <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/women/47.jpg' }}
                    className="w-20 h-20 rounded-2xl border-4 border-white/30"
                    style={{ borderRadius: 16 }}
                  />
                  <View>
                    <Text className="text-2xl font-bold text-white mb-1">サラ・チェン</Text>
                    <Text className="text-white/80 text-sm">@sarahchen</Text>
                  </View>
                </View>
                <TouchableOpacity className="w-11 h-11 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="share-social" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <View className="bg-white/15 rounded-2xl p-4 mb-4">
                <Text className="text-white/90 text-xs font-semibold mb-3">性格タイプ</Text>
                <View className="flex-row items-center gap-2 mb-3">
                  <Text className="text-3xl font-bold text-white">ENFP</Text>
                  <View className="px-3 py-1 rounded-full bg-white/25">
                    <Text className="text-white text-xs font-bold">運動家</Text>
                  </View>
                </View>
                <Text className="text-white/90 text-sm">創造的で、熱心で、社交的な自由な精神</Text>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 bg-white/15 rounded-xl p-3 items-center">
                  <Text className="text-white text-xs mb-1">外向性</Text>
                  <Text className="text-white text-xl font-bold">87%</Text>
                </View>
                <View className="flex-1 bg-white/15 rounded-xl p-3 items-center">
                  <Text className="text-white text-xs mb-1">開放性</Text>
                  <Text className="text-white text-xl font-bold">92%</Text>
                </View>
                <View className="flex-1 bg-white/15 rounded-xl p-3 items-center">
                  <Text className="text-white text-xs mb-1">共感性</Text>
                  <Text className="text-white text-xl font-bold">84%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-card rounded-2xl p-4 border border-border items-center">
              <Ionicons name="document-text" size={32} color="#8b5cf6" className="mb-2" />
              <Text className="text-2xl font-bold mb-1 text-foreground">24</Text>
              <Text className="text-muted-foreground text-xs">受けた診断</Text>
            </View>
            <View className="flex-1 bg-card rounded-2xl p-4 border border-border items-center">
              <Ionicons name="star" size={32} color="#f97316" className="mb-2" />
              <Text className="text-2xl font-bold mb-1 text-foreground">4.8</Text>
              <Text className="text-muted-foreground text-xs">平均スコア</Text>
            </View>
            <View className="flex-1 bg-card rounded-2xl p-4 border border-border items-center">
              <Ionicons name="pie-chart" size={32} color="#10b981" className="mb-2" />
              <Text className="text-2xl font-bold mb-1 text-foreground">89%</Text>
              <Text className="text-muted-foreground text-xs">完了率</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">アナリティクス</Text>
            <TouchableOpacity>
              <Text className="text-sm text-primary font-semibold">すべて見る</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-card rounded-3xl p-5 border border-border mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-foreground">性格特性</Text>
              <Text className="text-xs text-muted-foreground">過去6ヶ月</Text>
            </View>
            <View className="gap-3">
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-foreground">外向性</Text>
                  <Text className="text-sm font-bold text-primary">87%</Text>
                </View>
                <View className="h-2 bg-secondary rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '87%', height: '100%' }}
                  />
                </View>
              </View>
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-foreground">開放性</Text>
                  <Text className="text-sm font-bold text-accent">92%</Text>
                </View>
                <View className="h-2 bg-secondary rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#ec4899', '#db2777']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '92%', height: '100%' }}
                  />
                </View>
              </View>
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-foreground">誠実性</Text>
                  <Text className="text-sm font-bold text-emerald-500">78%</Text>
                </View>
                <View className="h-2 bg-secondary rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '78%', height: '100%' }}
                  />
                </View>
              </View>
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-foreground">協調性</Text>
                  <Text className="text-sm font-bold text-orange-500">84%</Text>
                </View>
                <View className="h-2 bg-secondary rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#f97316', '#ea580c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '84%', height: '100%' }}
                  />
                </View>
              </View>
              <View>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-foreground">情緒安定性</Text>
                  <Text className="text-sm font-bold text-cyan-500">71%</Text>
                </View>
                <View className="h-2 bg-secondary rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#06b6d4', '#0891b2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '71%', height: '100%' }}
                  />
                </View>
              </View>
            </View>
          </View>

          <View className="bg-card rounded-3xl p-5 border border-border mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-foreground">診断活動</Text>
              <Text className="text-xs text-muted-foreground">週平均</Text>
            </View>
            <View className="flex-row items-end justify-between gap-2 h-32">
              {[
                { day: '月', h: 20, c: ['#2563eb', 'rgba(37, 99, 235, 0.5)'] as const },
                { day: '火', h: 16, c: ['#8b5cf6', 'rgba(139, 92, 246, 0.5)'] as const },
                { day: '水', h: 24, c: ['#10b981', 'rgba(16, 185, 129, 0.5)'] as const },
                { day: '木', h: 14, c: ['#f97316', 'rgba(249, 115, 22, 0.5)'] as const },
                { day: '金', h: 18, c: ['#06b6d4', 'rgba(6, 182, 212, 0.5)'] as const },
                { day: '土', h: 22, c: ['#2563eb', 'rgba(37, 99, 235, 0.5)'] as const },
                { day: '日', h: 12, c: ['#8b5cf6', 'rgba(139, 92, 246, 0.5)'] as const },
              ].map((item, index) => (
                <View key={index} className="flex-1 items-center justify-end gap-2">
                  <LinearGradient
                    colors={item.c}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    className="w-full rounded-t-lg"
                    style={{ height: item.h * 4 }}
                  />
                  <Text className="text-xs text-muted-foreground">{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-card rounded-3xl p-5 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-bold text-foreground">相性インサイト</Text>
            </View>
            <View className="gap-3">
              <View className="flex-row items-center gap-4">
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Text className="text-white font-bold text-sm">INTJ</Text>
                </LinearGradient>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-semibold text-foreground">建築家</Text>
                    <Text className="text-sm font-bold text-emerald-500">94%</Text>
                  </View>
                  <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <View className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                  </View>
                </View>
              </View>
              <View className="flex-row items-center gap-4">
                <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Text className="text-white font-bold text-sm">INFP</Text>
                </LinearGradient>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-semibold text-foreground">仲介者</Text>
                    <Text className="text-sm font-bold text-orange-500">88%</Text>
                  </View>
                  <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <View className="h-full bg-orange-500 rounded-full" style={{ width: '88%' }} />
                  </View>
                </View>
              </View>
              <View className="flex-row items-center gap-4">
                <LinearGradient
                  colors={['#2563eb', '#7c3aed']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Text className="text-white font-bold text-sm">ENTP</Text>
                </LinearGradient>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-semibold text-foreground">討論者</Text>
                    <Text className="text-sm font-bold text-primary">92%</Text>
                  </View>
                  <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <View className="h-full bg-primary rounded-full" style={{ width: '92%' }} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mb-32">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">診断履歴</Text>
            <TouchableOpacity>
              <Text className="text-sm text-primary font-semibold">すべて見る</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            <View className="bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center gap-4 mb-3">
                <LinearGradient
                  colors={['#8b5cf6', '#db2777']}
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <FontAwesome name="user" size={28} color="white" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="font-bold mb-1 text-foreground">MBTI性格診断</Text>
                  <Text className="text-muted-foreground text-xs">2日前に完了</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <LinearGradient
                    colors={['#8b5cf6', '#2563eb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-xs font-bold text-emerald-500">100%</Text>
              </View>
            </View>

            <View className="bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center gap-4 mb-3">
                <LinearGradient
                  colors={['#2563eb', '#7c3aed']}
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Ionicons name="stats-chart" size={28} color="white" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="font-bold mb-1 text-foreground">キャリアパスAI</Text>
                  <Text className="text-muted-foreground text-xs">5日前に完了</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <LinearGradient
                    colors={['#2563eb', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-xs font-bold text-emerald-500">100%</Text>
              </View>
            </View>

            <View className="bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center gap-4 mb-3">
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Ionicons name="heart" size={28} color="white" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="font-bold mb-1 text-foreground">愛の言語</Text>
                  <Text className="text-muted-foreground text-xs">1週間前に完了</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-xs font-bold text-emerald-500">100%</Text>
              </View>
            </View>

            <View className="bg-card rounded-2xl p-4 border border-border">
              <View className="flex-row items-center gap-4 mb-3">
                <LinearGradient
                  colors={['#f97316', '#ea580c']}
                  className="w-14 h-14 rounded-xl items-center justify-center"
                  style={{ borderRadius: 12 }}
                >
                  <Ionicons name="school" size={28} color="white" />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="font-bold mb-1 text-foreground">学習スタイル</Text>
                  <Text className="text-muted-foreground text-xs">2週間前に完了</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <View className="flex-row items-center gap-2">
                <View className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                  <LinearGradient
                    colors={['#f97316', '#ea580c']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
                <Text className="text-xs font-bold text-emerald-500">100%</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border">
        <View className="flex-row items-center justify-around pt-3 pb-8 px-6">
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('home')}>
            <Ionicons name="home" size={24} className="text-muted-foreground" color="#64748b" />
            <Text className="text-xs text-muted-foreground">ホーム</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center justify-center -mt-10 shadow-lg shadow-accent/30" onPress={onActionPress}>
            <LinearGradient
              colors={['#8b5cf6', '#2563eb']}
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ borderRadius: 32 }}
            >
              <Ionicons name="add" size={36} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('profile')}>
            <FontAwesome name="user" size={24} className="text-primary" color="#2563eb" />
            <Text className="text-xs font-semibold text-primary">プロフィール</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
