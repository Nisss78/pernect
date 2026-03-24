import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Dimensions, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useHomeData } from '../hooks/useHomeData';
import { TestCardSkeleton, GridCardSkeleton } from '@/components/ui/Skeleton';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 96; // 1枚を少し小さくして次のカードが見えるようにする

// 診断タイプ別の背景画像マッピング（Unsplash フリー素材）
const getBackgroundImage = (slug: string): string => {
  const imageMap: Record<string, string> = {
    // 性格診断系 - 脳・心理・抽象的
    'mbti': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    'mbti-simple': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    'mbti-evidence': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    'big5': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',

    // エニアグラム - ジオメトリック・複雑なパターン
    'enneagram': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'enneagram-simple': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',

    // キャリア・仕事系 - 道・ビジネス・成長
    'career-type': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80',
    'career-anchors': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',

    // 強み・才能 - 光・エネルギー
    'strengths': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80',
    'via-strengths': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=800&q=80',

    // 感情・恋愛系 - ハート・温かみ
    'eq': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    'attachment-style': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    'love-language': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    'last-lover': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',

    // コミュニケーション - つながり・ネットワーク
    'disc-communication': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',

    // 感受性・ストレス - 自然・禅・リラックス
    'hsp': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    'stress-coping': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',

    // 学習・価値観 - 本・知識
    'vark-learning': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    'schwartz-values': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',

    // マネー・グリット - 成功・目標
    'money-script': 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80',
    'grit': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
  };

  // 完全一致を探す
  if (imageMap[slug]) return imageMap[slug];

  // 部分一致で探す
  for (const key of Object.keys(imageMap)) {
    if (slug.includes(key) || key.includes(slug)) {
      return imageMap[key];
    }
  }

  // デフォルト画像（抽象的な背景）
  return 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80';
};

interface HomeScreenProps {
  onSignOut?: () => void;
  onNavigate?: (screen: 'home' | 'profile' | 'friends' | 'settings' | 'test-list') => void;
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
            <TouchableOpacity className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary">
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
                    activeOpacity={0.8}
                  >
                    <ImageBackground
                      source={{ uri: getBackgroundImage(test.slug) }}
                      className="rounded-3xl overflow-hidden"
                      imageStyle={{ opacity: 0.15 }}
                    >
                      <View className="flex-row items-center bg-card/80 rounded-3xl p-4 border border-border/50 shadow-sm">
                        <LinearGradient
                          colors={[test.gradientStart, test.gradientEnd]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{ width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
                        >
                          {getIcon(test, 22, 'white')}
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
                    </ImageBackground>
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
                <View style={{ width: cardWidth }}>
                  <TestCardSkeleton />
                </View>
              ) : (
                popularTests.map((test) => (
                  <TouchableOpacity
                    key={test._id}
                    style={{ width: cardWidth, borderRadius: 32 }}
                    className="shadow-sm overflow-hidden"
                    activeOpacity={0.85}
                    onPress={() => onStartTest?.(test.slug)}
                  >
                    <ImageBackground
                      source={{ uri: getBackgroundImage(test.slug) }}
                      style={{ borderRadius: 32 }}
                      imageStyle={{ borderRadius: 32, opacity: 0.35 }}
                    >
                      <LinearGradient
                        colors={[test.gradientStart, test.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 32, padding: 24 }}
                      >
                        <View className="flex-row items-center justify-between mb-6">
                          <View
                          className="bg-white/20 items-center justify-center"
                          style={{ width: 52, height: 52, borderRadius: 26 }}
                        >
                          {getIcon(test, 26, 'white')}
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
                    </ImageBackground>
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
              <>
                <GridCardSkeleton />
                <GridCardSkeleton />
              </>
            ) : (
              recommendedTests.map((test) => (
                <TouchableOpacity
                  key={test._id}
                  className="w-[48%] bg-card rounded-3xl mb-3 border border-border/60 p-4"
                  activeOpacity={0.7}
                  onPress={() => onStartTest?.(test.slug)}
                >
                  <LinearGradient
                    colors={[test.gradientStart, test.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    {getIcon(test, 20, 'white')}
                  </LinearGradient>

                  <Text className="text-[14px] font-bold text-foreground leading-snug mb-2" numberOfLines={2}>
                    {test.title}
                  </Text>

                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="time-outline" size={11} color="#94a3b8" />
                      <Text className="text-muted-foreground text-[11px]">{test.estimatedMinutes}分</Text>
                    </View>
                    <Text className="text-border text-[11px]">|</Text>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="help-circle-outline" size={11} color="#94a3b8" />
                      <Text className="text-muted-foreground text-[11px]">{test.questionCount}問</Text>
                    </View>
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
                  <ImageBackground
                    source={{ uri: getBackgroundImage(test.slug) }}
                    className="rounded-[28px] overflow-hidden"
                    imageStyle={{ opacity: 0.15 }}
                  >
                    <View className="flex-row items-center bg-card/80 rounded-[28px] p-4 border border-border/40 shadow-sm">
                      <LinearGradient
                        colors={[test.gradientStart, test.gradientEnd]}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getIcon(test, 26, 'white')}
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
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
