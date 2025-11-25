import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export function HomeScreen({ onSignOut, onNavigate, onActionPress }: { onSignOut?: () => void, onNavigate?: (screen: 'home' | 'profile' | 'settings') => void, onActionPress?: () => void }) {
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
            <TouchableOpacity>
              <Text className="text-sm text-primary font-semibold">すべて見る</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 pb-4">
            {/* MBTI Card */}
            <LinearGradient
              colors={['#8b5cf6', '#db2777']} // accent to pink-600
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-72 rounded-3xl p-6 mr-4 shadow-lg"
              style={{ borderRadius: 24 }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                  <FontAwesome name="user" size={32} color="white" />
                </View>
                <View className="px-3 py-1 rounded-full bg-white/20">
                  <Text className="text-xs font-bold text-white">人気</Text>
                </View>
              </View>
              <Text className="text-xl font-bold text-white mb-2">MBTI診断</Text>
              <Text className="text-white/80 text-sm mb-4">
                16種類のユニークなプロフィールであなたの性格タイプを発見
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">15分</Text>
                <Text className="text-white/90 text-xs mx-1">•</Text>
                <Ionicons name="star" size={16} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">4.8</Text>
              </View>
            </LinearGradient>

            {/* Career Path Card */}
            <LinearGradient
              colors={['#2563eb', '#7c3aed']} // primary to violet-600
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-72 rounded-3xl p-6 mr-4 shadow-lg"
              style={{ borderRadius: 24 }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                  <Ionicons name="stats-chart" size={32} color="white" />
                </View>
                <View className="px-3 py-1 rounded-full bg-white/20">
                  <Text className="text-xs font-bold text-white">新着</Text>
                </View>
              </View>
              <Text className="text-xl font-bold text-white mb-2">キャリアパスAI</Text>
              <Text className="text-white/80 text-sm mb-4">
                あなたの強みに基づいて理想的なキャリアを見つける
              </Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">10分</Text>
                <Text className="text-white/90 text-xs mx-1">•</Text>
                <Ionicons name="star" size={16} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">4.9</Text>
              </View>
            </LinearGradient>

            {/* Love Language Card */}
            <LinearGradient
              colors={['#10b981', '#059669']} // chart-3 to emerald-600
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-72 rounded-3xl p-6 mr-4 shadow-lg"
              style={{ borderRadius: 24 }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="w-14 h-14 rounded-2xl bg-white/20 items-center justify-center">
                  <Ionicons name="heart" size={32} color="white" />
                </View>
                <View className="px-3 py-1 rounded-full bg-white/20">
                  <Text className="text-xs font-bold text-white">トップ</Text>
                </View>
              </View>
              <Text className="text-xl font-bold text-white mb-2">愛の言語</Text>
              <Text className="text-white/80 text-sm mb-4">あなたが愛を与え、受け取る方法を理解する</Text>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.9)" />
                <Text className="text-white/90 text-xs">8分</Text>
                <Text className="text-white/90 text-xs mx-1">•</Text>
                <Ionicons name="star" size={16} color="rgba(255,255,255,0.9)" />
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
            <View className="w-[48%] bg-card rounded-3xl p-5 border border-border mb-4">
              <LinearGradient
                colors={['#f97316', '#ea580c']} // chart-4 to orange-600
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ borderRadius: 12 }}
              >
                <Ionicons name="school" size={24} color="white" />
              </LinearGradient>
              <Text className="text-base font-bold mb-1 text-foreground">学習スタイル</Text>
              <Text className="text-muted-foreground text-xs mb-3">あなたに最適な学習方法は？</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={12} color="#64748b" />
                <Text className="text-muted-foreground text-xs">12分</Text>
              </View>
            </View>

            {/* Color Psychology */}
            <View className="w-[48%] bg-card rounded-3xl p-5 border border-border mb-4">
              <LinearGradient
                colors={['#06b6d4', '#0891b2']} // chart-5 to cyan-600
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ borderRadius: 12 }}
              >
                <Ionicons name="color-palette" size={24} color="white" />
              </LinearGradient>
              <Text className="text-base font-bold mb-1 text-foreground">色彩心理学</Text>
              <Text className="text-muted-foreground text-xs mb-3">色があなたについて語ること</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={12} color="#64748b" />
                <Text className="text-muted-foreground text-xs">5分</Text>
              </View>
            </View>

            {/* Enneagram */}
            <View className="w-[48%] bg-card rounded-3xl p-5 border border-border mb-4">
              <LinearGradient
                colors={['#8b5cf6', '#e11d48']} // accent to rose-600
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ borderRadius: 12 }}
              >
                <Ionicons name="happy" size={24} color="white" />
              </LinearGradient>
              <Text className="text-base font-bold mb-1 text-foreground">エニアグラム</Text>
              <Text className="text-muted-foreground text-xs mb-3">9つの性格タイプを明らかに</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={12} color="#64748b" />
                <Text className="text-muted-foreground text-xs">20分</Text>
              </View>
            </View>

            {/* Astrology */}
            <View className="w-[48%] bg-card rounded-3xl p-5 border border-border mb-4">
              <LinearGradient
                colors={['#2563eb', '#4f46e5']} // primary to indigo-600
                className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                style={{ borderRadius: 12 }}
              >
                <Ionicons name="sparkles" size={24} color="white" />
              </LinearGradient>
              <Text className="text-base font-bold mb-1 text-foreground">星座深掘り</Text>
              <Text className="text-muted-foreground text-xs mb-3">あなたの占星術プロフィール</Text>
              <View className="flex-row items-center gap-1">
                <Ionicons name="time" size={12} color="#64748b" />
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

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border">
        <View className="flex-row items-center justify-around pt-3 pb-8 px-6">
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate?.('home')}>
            <Ionicons name="home" size={24} className="text-primary" color="#2563eb" />
            <Text className="text-xs font-semibold text-primary">ホーム</Text>
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
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate?.('profile')}>
            <FontAwesome name="user" size={24} className="text-muted-foreground" color="#64748b" />
            <Text className="text-xs text-muted-foreground">プロフィール</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
