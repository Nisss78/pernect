import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../convex/_generated/api';
import { BottomNavigation } from './BottomNavigation';

interface ProfileScreenProps {
  onNavigate: (screen: 'home' | 'profile' | 'settings') => void;
  onActionPress?: () => void;
}

// MBTI タイプの日本語名マッピング
const MBTI_NAMES: Record<string, { name: string; description: string }> = {
  INTJ: { name: '建築家', description: '想像力が豊かで戦略的な思考を持つ計画者' },
  INTP: { name: '論理学者', description: '革新的な発明家で尽きることのない知識欲' },
  ENTJ: { name: '指揮官', description: '大胆で想像力豊か、意志の強いリーダー' },
  ENTP: { name: '討論者', description: '賢くて好奇心旺盛な思想家' },
  INFJ: { name: '提唱者', description: '静かで神秘的、しかし非常に勇気づける理想主義者' },
  INFP: { name: '仲介者', description: '詩的で親切な利他主義者、常に善を追求' },
  ENFJ: { name: '主人公', description: 'カリスマ性があり人々を励ますリーダー' },
  ENFP: { name: '広報運動家', description: '創造的で、熱心で、社交的な自由な精神' },
  ISTJ: { name: '管理者', description: '実用的で事実に基づいた、信頼性の高い人物' },
  ISFJ: { name: '擁護者', description: '非常に献身的で温かい守護者' },
  ESTJ: { name: '幹部', description: '優れた管理者、人やものを管理する能力' },
  ESFJ: { name: '領事官', description: '非常に思いやりがあり社交的で人気者' },
  ISTP: { name: '巨匠', description: '大胆で実践的な実験者、あらゆる道具の達人' },
  ISFP: { name: '冒険家', description: '柔軟で魅力的な芸術家' },
  ESTP: { name: '起業家', description: '賢く、エネルギッシュで、鋭い知覚の持ち主' },
  ESFP: { name: 'エンターテイナー', description: '自発的でエネルギッシュな楽しませ上手' },
};

export function ProfileScreen({ onNavigate, onActionPress }: ProfileScreenProps) {
  const currentUser = useQuery(api.users.current);

  // ユーザーデータのフォールバック
  const userName = currentUser?.name || 'ゲストユーザー';
  const userIdDisplay = currentUser?.userId ? `@${currentUser.userId}` : '';
  const userMbti = currentUser?.mbti || '';
  const mbtiInfo = userMbti ? MBTI_NAMES[userMbti] : null;
  const userImage = currentUser?.image;

  // ローディング状態
  if (currentUser === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-14 pb-4">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-2xl font-bold text-primary">
              プロフィール
            </Text>
            <TouchableOpacity
              onPress={() => onNavigate('settings')}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary"
            >
              <Ionicons name="settings-sharp" size={20} color="#ec4899" />
            </TouchableOpacity>
          </View>
          <Text className="text-muted-foreground text-xs">あなたの性格の旅と洞察</Text>
        </View>

        {/* プロフィールカード */}
        <View className="px-6 mb-4">
          <LinearGradient
            colors={['#ec4899', '#8b5cf6', '#7c3aed']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 20, padding: 16, overflow: 'hidden', position: 'relative' }}
          >
            <View className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <View className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10" />

            <View className="relative">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-3">
                  {userImage ? (
                    <Image
                      source={{ uri: userImage }}
                      style={{ width: 56, height: 56, borderRadius: 14, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' }}
                    />
                  ) : (
                    <View
                      style={{ width: 56, height: 56, borderRadius: 14, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Ionicons name="person" size={28} color="white" />
                    </View>
                  )}
                  <View>
                    <Text className="text-lg font-bold text-white" numberOfLines={1}>{userName}</Text>
                    {userIdDisplay ? (
                      <Text className="text-white/80 text-xs">{userIdDisplay}</Text>
                    ) : (
                      <Text className="text-white/60 text-xs">IDを設定してください</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity className="w-9 h-9 rounded-lg bg-white/20 items-center justify-center">
                  <Ionicons name="share-social" size={18} color="white" />
                </TouchableOpacity>
              </View>

              {mbtiInfo ? (
                <View className="bg-white/15 rounded-xl p-3 mb-3">
                  <Text className="text-white/90 text-xs font-semibold mb-2">性格タイプ</Text>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-2xl font-bold text-white">{userMbti}</Text>
                    <View className="px-2 py-0.5 rounded-full bg-white/25">
                      <Text className="text-white text-xs font-bold">{mbtiInfo.name}</Text>
                    </View>
                  </View>
                  <Text className="text-white/90 text-xs" numberOfLines={1}>{mbtiInfo.description}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => onNavigate('settings')}
                  className="bg-white/15 rounded-xl p-3 mb-3"
                >
                  <Text className="text-white/90 text-xs font-semibold mb-2">性格タイプ</Text>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text className="text-white/80 text-sm">MBTIを設定する</Text>
                  </View>
                </TouchableOpacity>
              )}

              <View className="flex-row gap-2">
                <View className="flex-1 bg-white/15 rounded-lg p-2 items-center">
                  <Text className="text-white text-xs mb-0.5">外向性</Text>
                  <Text className="text-white text-lg font-bold">--</Text>
                </View>
                <View className="flex-1 bg-white/15 rounded-lg p-2 items-center">
                  <Text className="text-white text-xs mb-0.5">開放性</Text>
                  <Text className="text-white text-lg font-bold">--</Text>
                </View>
                <View className="flex-1 bg-white/15 rounded-lg p-2 items-center">
                  <Text className="text-white text-xs mb-0.5">共感性</Text>
                  <Text className="text-white text-lg font-bold">--</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 統計カード */}
        <View className="px-6 mb-4">
          <View className="flex-row gap-2">
            <View className="flex-1 bg-card rounded-xl p-3 border border-border items-center">
              <Ionicons name="document-text" size={24} color="#8b5cf6" style={{ marginBottom: 4 }} />
              <Text className="text-xl font-bold text-foreground">24</Text>
              <Text className="text-muted-foreground text-xs">受けた診断</Text>
            </View>
            <View className="flex-1 bg-card rounded-xl p-3 border border-border items-center">
              <Ionicons name="star" size={24} color="#f97316" style={{ marginBottom: 4 }} />
              <Text className="text-xl font-bold text-foreground">4.8</Text>
              <Text className="text-muted-foreground text-xs">平均スコア</Text>
            </View>
            <View className="flex-1 bg-card rounded-xl p-3 border border-border items-center">
              <Ionicons name="pie-chart" size={24} color="#10b981" style={{ marginBottom: 4 }} />
              <Text className="text-xl font-bold text-foreground">89%</Text>
              <Text className="text-muted-foreground text-xs">完了率</Text>
            </View>
          </View>
        </View>

        {/* アナリティクス */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-foreground">アナリティクス</Text>
            <TouchableOpacity>
              <Text className="text-xs text-primary font-semibold">すべて見る</Text>
            </TouchableOpacity>
          </View>

          {/* 性格特性 */}
          <View className="bg-card rounded-2xl p-4 border border-border mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-foreground">性格特性</Text>
              <Text className="text-xs text-muted-foreground">過去6ヶ月</Text>
            </View>
            <View className="gap-2">
              {[
                { label: '外向性', value: 87, colors: ['#8b5cf6', '#ec4899'] as const, textColor: 'text-primary' },
                { label: '開放性', value: 92, colors: ['#ec4899', '#db2777'] as const, textColor: 'text-accent' },
                { label: '誠実性', value: 78, colors: ['#10b981', '#059669'] as const, textColor: 'text-emerald-500' },
                { label: '協調性', value: 84, colors: ['#f97316', '#ea580c'] as const, textColor: 'text-orange-500' },
                { label: '情緒安定性', value: 71, colors: ['#06b6d4', '#0891b2'] as const, textColor: 'text-cyan-500' },
              ].map((item, index) => (
                <View key={index}>
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-xs text-foreground">{item.label}</Text>
                    <Text className={`text-xs font-bold ${item.textColor}`}>{item.value}%</Text>
                  </View>
                  <View className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <LinearGradient
                      colors={item.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: `${item.value}%`, height: '100%' }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 診断活動グラフ */}
          <View className="bg-card rounded-2xl p-4 border border-border mb-3">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-foreground">診断活動</Text>
              <Text className="text-xs text-muted-foreground">週平均</Text>
            </View>
            <View className="flex-row items-end justify-between gap-1 h-24">
              {[
                { day: '月', h: 20, c: ['#2563eb', 'rgba(37, 99, 235, 0.5)'] as const },
                { day: '火', h: 16, c: ['#8b5cf6', 'rgba(139, 92, 246, 0.5)'] as const },
                { day: '水', h: 24, c: ['#10b981', 'rgba(16, 185, 129, 0.5)'] as const },
                { day: '木', h: 14, c: ['#f97316', 'rgba(249, 115, 22, 0.5)'] as const },
                { day: '金', h: 18, c: ['#06b6d4', 'rgba(6, 182, 212, 0.5)'] as const },
                { day: '土', h: 22, c: ['#2563eb', 'rgba(37, 99, 235, 0.5)'] as const },
                { day: '日', h: 12, c: ['#8b5cf6', 'rgba(139, 92, 246, 0.5)'] as const },
              ].map((item, index) => (
                <View key={index} className="flex-1 items-center justify-end gap-1">
                  <LinearGradient
                    colors={item.c}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{ width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4, height: item.h * 3 }}
                  />
                  <Text className="text-xs text-muted-foreground">{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 相性インサイト */}
          <View className="bg-card rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-bold text-foreground">相性インサイト</Text>
            </View>
            <View className="gap-2">
              {[
                { type: 'INTJ', name: '建築家', value: 94, colors: ['#10b981', '#059669'] as const, barColor: 'bg-emerald-500', textColor: 'text-emerald-500' },
                { type: 'INFP', name: '仲介者', value: 88, colors: ['#f97316', '#ea580c'] as const, barColor: 'bg-orange-500', textColor: 'text-orange-500' },
                { type: 'ENTP', name: '討論者', value: 92, colors: ['#2563eb', '#7c3aed'] as const, barColor: 'bg-primary', textColor: 'text-primary' },
              ].map((item, index) => (
                <View key={index} className="flex-row items-center gap-3">
                  <LinearGradient
                    colors={item.colors}
                    style={{ width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text className="text-white font-bold text-xs">{item.type}</Text>
                  </LinearGradient>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-xs font-semibold text-foreground">{item.name}</Text>
                      <Text className={`text-xs font-bold ${item.textColor}`}>{item.value}%</Text>
                    </View>
                    <View className="h-1 bg-secondary rounded-full overflow-hidden">
                      <View className={`h-full ${item.barColor} rounded-full`} style={{ width: `${item.value}%` }} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 診断履歴 */}
        <View className="px-6 mb-28">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-foreground">診断履歴</Text>
            <TouchableOpacity>
              <Text className="text-xs text-primary font-semibold">すべて見る</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-2">
            {[
              { name: 'MBTI性格診断', time: '2日前に完了', icon: 'user' as const, iconType: 'fontawesome', colors: ['#8b5cf6', '#db2777'] as const },
              { name: 'キャリアパスAI', time: '5日前に完了', icon: 'stats-chart' as const, iconType: 'ionicons', colors: ['#2563eb', '#7c3aed'] as const },
              { name: '愛の言語', time: '1週間前に完了', icon: 'heart' as const, iconType: 'ionicons', colors: ['#10b981', '#059669'] as const },
              { name: '学習スタイル', time: '2週間前に完了', icon: 'school' as const, iconType: 'ionicons', colors: ['#f97316', '#ea580c'] as const },
            ].map((item, index) => (
              <View key={index} className="bg-card rounded-xl p-3 border border-border">
                <View className="flex-row items-center gap-3 mb-2">
                  <LinearGradient
                    colors={item.colors}
                    style={{ width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                  >
                    {item.iconType === 'fontawesome' ? (
                      <FontAwesome name={item.icon as any} size={20} color="white" />
                    ) : (
                      <Ionicons name={item.icon as any} size={20} color="white" />
                    )}
                  </LinearGradient>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-foreground" numberOfLines={1}>{item.name}</Text>
                    <Text className="text-muted-foreground text-xs">{item.time}</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                    <LinearGradient
                      colors={item.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </View>
                  <Text className="text-xs font-bold text-emerald-500">100%</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation
        currentScreen="profile"
        onNavigate={onNavigate}
        onActionPress={onActionPress}
      />
    </View>
  );
}
