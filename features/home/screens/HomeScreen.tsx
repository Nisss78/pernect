import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { BottomNavigation } from '../../common/components/BottomNavigation';
import { useHomeData } from '../hooks/useHomeData';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 96; // 1枚を少し小さくして次のカードが見えるようにする

interface HomeScreenProps {
  onSignOut?: () => void;
  onNavigate?: (screen: 'home' | 'profile' | 'settings' | 'test-list') => void;
  onActionPress?: () => void;
  onStartTest?: (testSlug: string) => void;
}

const getIcon = (test: any, size: number, color: string) => {
  // 1. DBのiconフィールドを優先
  if (test.icon) {
    switch (test.icon) {
      case 'brain': return <MaterialCommunityIcons name="brain" size={size} color={color} />;
      case 'briefcase': return <Ionicons name="briefcase" size={size} color={color} />;
      case 'heart': return <Ionicons name="heart" size={size} color={color} />;
      case 'sparkles': return <Ionicons name="sparkles" size={size} color={color} />;
      case 'people': return <Ionicons name="people" size={size} color={color} />;
      case 'school': return <Ionicons name="school" size={size} color={color} />;
      case 'fitness': return <Ionicons name="fitness" size={size} color={color} />;
      case 'color-palette': return <Ionicons name="color-palette" size={size} color={color} />;
    }
  }

  // 2. スラッグから推測 (フォールバック)
  const slug = test.slug || '';
  if (slug.includes('mbti')) return <MaterialCommunityIcons name="brain" size={size} color={color} />; // MBTI -> Brain
  if (slug.includes('16')) return <MaterialCommunityIcons name="brain" size={size} color={color} />; // 16タイプ -> Brain
  if (slug.includes('love') || slug.includes('lover')) return <Ionicons name="heart" size={size} color={color} />; // 恋愛 -> Heart
  if (slug.includes('career') || slug.includes('work')) return <Ionicons name="briefcase" size={size} color={color} />; // 仕事 -> Briefcase
  if (slug.includes('strength')) return <Ionicons name="flash" size={size} color={color} />; // 強み -> Flash
  if (slug.includes('big5')) return <Ionicons name="layers" size={size} color={color} />; // Big5 -> Layers
  if (slug.includes('enneagram')) return <MaterialCommunityIcons name="shape" size={size} color={color} />; // エニアグラム -> Shape

  // 3. 完全なデフォルト
  return <Ionicons name="sparkles" size={size} color={color} />;
};

export function HomeScreen({ onSignOut, onNavigate, onActionPress, onStartTest }: HomeScreenProps) {
  const {
    inProgress,
    popularTests,
    recentTests,
    recommendedTests,
  } = useHomeData();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-14 pb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-[#8b5cf6]">
              pernect
            </Text>
            <TouchableOpacity className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary">
              <Ionicons name="notifications" size={24} className="text-accent" color="#8b5cf6" />
            </TouchableOpacity>
          </View>
          <Text className="text-muted-foreground text-sm">AI分析であなた自身を発見しよう</Text>
        </View>

        {/* 続きから（進行中） */}
        {inProgress && inProgress.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-foreground">続きから</Text>
            </View>
            <View className="gap-3">
              {inProgress.map((p) => {
                const test = p.test;
                if (!test) return null;
                const answered = p.answers?.length || 0;
                const total = test.questionCount || Math.max(answered, 1);
                const percent = Math.min(100, Math.round((answered / total) * 100));
                return (
                  <TouchableOpacity
                    key={p._id}
                    onPress={() => onStartTest?.(test.slug)}
                    className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm"
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={[test.gradientStart, test.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                      >
                        {getIcon(test, 24, 'white')}
                      </LinearGradient>
                      <View className="flex-1 ml-4">
                        <Text className="text-foreground font-bold text-base mb-1" numberOfLines={1}>
                          {test.title}
                        </Text>
                        <View className="h-2 bg-secondary rounded-full overflow-hidden">
                          <View
                            className="bg-[#8b5cf6] h-2 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </View>
                        <Text className="text-muted-foreground text-xs mt-1">{answered} / {total} ({percent}%)</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* 人気のテスト */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">人気のテスト</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
            <View className="flex-row gap-4 px-1">
              {popularTests === undefined ? (
                <View className="w-full items-center py-6">
                  <ActivityIndicator size="small" color="#8b5cf6" />
                </View>
              ) : (
                popularTests.map((test) => (
                  <TouchableOpacity
                    key={test._id}
                    style={{ width: cardWidth, borderRadius: 28 }}
                    className="shadow-sm overflow-hidden"
                    activeOpacity={0.85}
                    onPress={() => onStartTest?.(test.slug)}
                  >
                    <LinearGradient
                      colors={[test.gradientStart, test.gradientEnd]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 28, padding: 24 }}
                    >
                      <View className="flex-row items-center justify-between mb-6">
                        <View
                          className="bg-white/20 items-center justify-center"
                          style={{ width: 56, height: 56, borderRadius: 16 }}
                        >
                          {getIcon(test, 28, 'white')}
                        </View>
                        <View className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md">
                          <Text className="text-xs font-bold text-white">人気 🔥</Text>
                        </View>
                      </View>
                      <Text className="text-2xl font-bold text-white mb-2 leading-tight">{test.title}</Text>
                      <Text className="text-white/90 text-sm mb-6 leading-relaxed" numberOfLines={2}>
                        {test.description}
                      </Text>
                      <View className="flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                          <Ionicons name="help-circle" size={14} color="rgba(255,255,255,0.9)" />
                          <Text className="text-white font-medium text-xs">{test.questionCount}問</Text>
                        </View>
                        <View className="flex-row items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
                          <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
                          <Text className="text-white font-medium text-xs">約{test.estimatedMinutes}分</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </View>

        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">あなたへのおすすめ</Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {recommendedTests === undefined ? (
              <View className="w-full items-center py-6">
                <ActivityIndicator size="small" color="#8b5cf6" />
              </View>
            ) : (
              recommendedTests.map((test) => (
                <TouchableOpacity
                  key={test._id}
                  className="w-[48%] bg-card rounded-[24px] p-5 border border-border/40 shadow-sm mb-4"
                  activeOpacity={0.8}
                  onPress={() => onStartTest?.(test.slug)}
                >
                  <View className="mb-4 self-start">
                    <LinearGradient
                      colors={[test.gradientStart, test.gradientEnd]}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getIcon(test, 24, 'white')}
                    </LinearGradient>
                  </View>

                  <Text className="text-[15px] font-bold mb-2 text-foreground leading-snug min-h-[44px]" numberOfLines={2}>
                    {test.title}
                  </Text>

                  <View className="flex-row items-center gap-1 mt-auto">
                    <Ionicons name="time-outline" size={13} color="#94a3b8" />
                    <Text className="text-muted-foreground text-xs font-medium">約{test.estimatedMinutes}分</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View className="px-6 mb-32">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">最近追加されたテスト</Text>
          </View>
          {recentTests === undefined ? (
            <View className="items-center justify-center py-6">
              <ActivityIndicator size="small" color="#8b5cf6" />
            </View>
          ) : recentTests.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text className="text-muted-foreground">新しいテストはまだありません</Text>
            </View>
          ) : (
            <View className="gap-4">
              {recentTests.map((test) => (
                <TouchableOpacity
                  key={test._id}
                  onPress={() => onStartTest?.(test.slug)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-center bg-card rounded-[24px] p-4 border border-border/40 shadow-sm">
                    <LinearGradient
                      colors={[test.gradientStart, test.gradientEnd]}
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getIcon(test, 28, 'white')}
                    </LinearGradient>

                    <View className="flex-1 ml-4 py-1">
                      <View className="flex-row items-center justify-between mb-1.5">
                        <Text className="font-bold text-[16px] text-foreground flex-1 pr-2" numberOfLines={1}>
                          {test.title}
                        </Text>
                        <View className="bg-secondary px-2 py-1 rounded-[8px]">
                          <Text className="text-[10px] font-bold text-[#8b5cf6]">NEW</Text>
                        </View>
                      </View>

                      <Text className="text-muted-foreground text-[13px] leading-snug mb-2.5" numberOfLines={1}>
                        {test.description}
                      </Text>

                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="help-circle-outline" size={13} color="#94a3b8" />
                          <Text className="text-muted-foreground text-xs font-medium">{test.questionCount}問</Text>
                        </View>
                        <View className="w-[1px] h-3 bg-border" />
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="time-outline" size={13} color="#94a3b8" />
                          <Text className="text-muted-foreground text-xs font-medium">約{test.estimatedMinutes}分</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigation
        currentScreen="home"
        onNavigate={(screen) => onNavigate?.(screen)}
        onActionPress={onActionPress}
      />
    </View>
  );
}
