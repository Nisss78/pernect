import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BottomNavigation } from './BottomNavigation';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth - 48; // 左右のパディング(24px * 2)を引いた幅

interface HomeScreenProps {
  onSignOut?: () => void;
  onNavigate?: (screen: 'home' | 'profile' | 'settings' | 'test-list') => void;
  onActionPress?: () => void;
}

export function HomeScreen({ onSignOut, onNavigate, onActionPress }: HomeScreenProps) {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-14 pb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-primary">
              pernect
            </Text>
            <TouchableOpacity className="flex items-center justify-center w-11 h-11 rounded-2xl bg-secondary">
              <Ionicons name="notifications" size={24} className="text-accent" color="#8b5cf6" />
            </TouchableOpacity>
          </View>
          <Text className="text-muted-foreground text-sm">AI分析であなた自身を発見しよう</Text>
        </View>

        <View className="px-6 mb-6">
          <View className="relative justify-center">
            <Ionicons
              name="search-outline"
              size={20}
              color="#64748b"
              style={{ position: 'absolute', left: 16, zIndex: 1 }}
            />
            <TextInput
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-input text-foreground placeholder:text-muted-foreground"
              placeholder="テストを検索..."
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">人気のテスト</Text>
            <TouchableOpacity onPress={() => onNavigate?.('test-list')}>
              <Text className="text-sm text-primary font-semibold">すべて見る</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={cardWidth + 12}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 24 }}
            style={{ marginHorizontal: -24 }}
          >
            {/* MBTI Card */}
            <LinearGradient
              colors={['#8b5cf6', '#db2777']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: cardWidth, borderRadius: 24, padding: 20, marginRight: 12 }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <FontAwesome name="user" size={24} color="white" />
                </View>
                <View className="px-3 py-1 rounded-full bg-white/20">
                  <Text className="text-xs font-bold text-white">人気</Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-white mb-1">MBTI診断</Text>
              <Text className="text-white/80 text-sm mb-3" numberOfLines={2}>
                16種類のユニークなプロフィールであなたの性格タイプを発見
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">15分</Text>
                <Text className="text-white/90 text-xs mx-1">•</Text>
                <Ionicons name="star" size={14} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">4.8</Text>
              </View>
            </LinearGradient>

            {/* Career Path Card */}
            <LinearGradient
              colors={['#2563eb', '#7c3aed']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: cardWidth, borderRadius: 24, padding: 20, marginRight: 12 }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="stats-chart" size={24} color="white" />
                </View>
                <View className="px-3 py-1 rounded-full bg-white/20">
                  <Text className="text-xs font-bold text-white">新着</Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-white mb-1">キャリアパスAI</Text>
              <Text className="text-white/80 text-sm mb-3" numberOfLines={2}>
                あなたの強みに基づいて理想的なキャリアを見つける
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">10分</Text>
                <Text className="text-white/90 text-xs mx-1">•</Text>
                <Ionicons name="star" size={14} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">4.9</Text>
              </View>
            </LinearGradient>

            {/* Love Language Card */}
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: cardWidth, borderRadius: 24, padding: 20, marginRight: 12 }}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="heart" size={24} color="white" />
                </View>
                <View className="px-3 py-1 rounded-full bg-white/20">
                  <Text className="text-xs font-bold text-white">トップ</Text>
                </View>
              </View>
              <Text className="text-lg font-bold text-white mb-1">愛の言語</Text>
              <Text className="text-white/80 text-sm mb-3" numberOfLines={2}>
                あなたが愛を与え、受け取る方法を理解する
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">8分</Text>
                <Text className="text-white/90 text-xs mx-1">•</Text>
                <Ionicons name="star" size={14} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">4.7</Text>
              </View>
            </LinearGradient>
          </ScrollView>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">あなたへのおすすめ</Text>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {/* Learning Style */}
            <View className="w-[48%] bg-card rounded-2xl p-4 border border-border mb-3">
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                className="w-10 h-10 items-center justify-center mb-2"
                style={{ borderRadius: 8 }}
              >
                <Ionicons name="school" size={20} color="white" />
              </LinearGradient>
              <Text className="text-sm font-bold mb-1 text-foreground" numberOfLines={1}>学習スタイル</Text>
              <Text className="text-muted-foreground text-xs mb-2" numberOfLines={2}>あなたに最適な学習方法は？</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={10} color="#64748b" />
                <Text className="text-muted-foreground text-xs">12分</Text>
              </View>
            </View>

            {/* Color Psychology */}
            <View className="w-[48%] bg-card rounded-2xl p-4 border border-border mb-3">
              <LinearGradient
                colors={['#06b6d4', '#0891b2']}
                className="w-10 h-10 items-center justify-center mb-2"
                style={{ borderRadius: 8 }}
              >
                <Ionicons name="color-palette" size={20} color="white" />
              </LinearGradient>
              <Text className="text-sm font-bold mb-1 text-foreground" numberOfLines={1}>色彩心理学</Text>
              <Text className="text-muted-foreground text-xs mb-2" numberOfLines={2}>色があなたについて語ること</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={10} color="#64748b" />
                <Text className="text-muted-foreground text-xs">5分</Text>
              </View>
            </View>

            {/* Enneagram */}
            <View className="w-[48%] bg-card rounded-2xl p-4 border border-border mb-3">
              <LinearGradient
                colors={['#8b5cf6', '#e11d48']}
                className="w-10 h-10 items-center justify-center mb-2"
                style={{ borderRadius: 8 }}
              >
                <Ionicons name="happy" size={20} color="white" />
              </LinearGradient>
              <Text className="text-sm font-bold mb-1 text-foreground" numberOfLines={1}>エニアグラム</Text>
              <Text className="text-muted-foreground text-xs mb-2" numberOfLines={2}>9つの性格タイプを明らかに</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={10} color="#64748b" />
                <Text className="text-muted-foreground text-xs">20分</Text>
              </View>
            </View>

            {/* Astrology */}
            <View className="w-[48%] bg-card rounded-2xl p-4 border border-border mb-3">
              <LinearGradient
                colors={['#2563eb', '#4f46e5']}
                className="w-10 h-10 items-center justify-center mb-2"
                style={{ borderRadius: 8 }}
              >
                <Ionicons name="sparkles" size={20} color="white" />
              </LinearGradient>
              <Text className="text-sm font-bold mb-1 text-foreground" numberOfLines={1}>星座深掘り</Text>
              <Text className="text-muted-foreground text-xs mb-2" numberOfLines={2}>あなたの占星術プロフィール</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={10} color="#64748b" />
                <Text className="text-muted-foreground text-xs">7分</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-6 mb-32">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">最近追加されたテスト</Text>
          </View>
          <View className="gap-3">
            {/* Cognitive Style */}
            <View className="flex-row items-center gap-4 bg-card rounded-2xl p-4 border border-border">
              <LinearGradient
                colors={['#10b981', '#0d9488']} // chart-3 to teal-600
                className="w-16 h-16 rounded-xl items-center justify-center"
                style={{ borderRadius: 12 }}
              >
                <MaterialCommunityIcons name="brain" size={32} color="white" />
              </LinearGradient>
              <View className="flex-1">
                <Text className="font-bold mb-1 text-foreground">認知スタイル</Text>
                <Text className="text-muted-foreground text-xs mb-2">あなたの脳が情報を処理する方法</Text>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time" size={12} color="#64748b" />
                  <Text className="text-muted-foreground text-xs">15分</Text>
                  <Text className="text-muted-foreground text-xs mx-1">•</Text>
                  <View className="px-2 py-0.5 rounded-full bg-primary/20">
                    <Text className="text-primary text-xs font-semibold">新着</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Emotional Intelligence */}
            <View className="flex-row items-center gap-4 bg-card rounded-2xl p-4 border border-border">
              <LinearGradient
                colors={['#f97316', '#d97706']} // chart-4 to amber-600
                className="w-16 h-16 rounded-xl items-center justify-center"
                style={{ borderRadius: 12 }}
              >
                <Ionicons name="happy" size={32} color="white" />
              </LinearGradient>
              <View className="flex-1">
                <Text className="font-bold mb-1 text-foreground">感情知能</Text>
                <Text className="text-muted-foreground text-xs mb-2">5つの次元であなたのEQを測定</Text>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time" size={12} color="#64748b" />
                  <Text className="text-muted-foreground text-xs">18分</Text>
                  <Text className="text-muted-foreground text-xs mx-1">•</Text>
                  <View className="px-2 py-0.5 rounded-full bg-primary/20">
                    <Text className="text-primary text-xs font-semibold">新着</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
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
