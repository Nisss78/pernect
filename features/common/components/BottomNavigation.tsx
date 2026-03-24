import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  currentScreen: 'home' | 'profile' | 'friends';
  onNavigate: (screen: 'home' | 'profile' | 'friends') => void;
  onActionPress?: () => void;
}

export function BottomNavigation({ currentScreen, onNavigate, onActionPress }: BottomNavigationProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-border">
      {/* プラスボタン - 絶対配置で画面中央 */}
      <TouchableOpacity
        className="absolute items-center justify-center"
        style={{
          top: -28,
          left: '50%',
          transform: [{ translateX: -28 }],
          zIndex: 10,
        }}
        onPress={onActionPress}
      >
        <LinearGradient
          colors={["#ec4899", "#8b5cf6", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* ナビゲーションアイテム - 3つのタブ（ホーム・フレンズ・プロフィール） */}
      <View className="flex-row items-center justify-around pt-3 pb-8">
        {/* ホームタブ */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('home')}>
            <Ionicons
              name="home"
              size={24}
              color={currentScreen === 'home' ? '#8b5cf6' : '#64748b'}
            />
            <Text className={`text-xs ${currentScreen === 'home' ? 'font-semibold text-[#8b5cf6]' : 'text-muted-foreground'}`}>
              ホーム
            </Text>
          </TouchableOpacity>
        </View>

        {/* フレンズタブ - 中央（FABの下に配置） */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('friends')}>
            <Ionicons
              name="people"
              size={24}
              color={currentScreen === 'friends' ? '#8b5cf6' : '#64748b'}
            />
            <Text className={`text-xs ${currentScreen === 'friends' ? 'font-semibold text-[#8b5cf6]' : 'text-muted-foreground'}`}>
              フレンズ
            </Text>
          </TouchableOpacity>
        </View>

        {/* プロフィールタブ */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('profile')}>
            <FontAwesome
              name="user"
              size={24}
              color={currentScreen === 'profile' ? '#8b5cf6' : '#64748b'}
            />
            <Text className={`text-xs ${currentScreen === 'profile' ? 'font-semibold text-[#8b5cf6]' : 'text-muted-foreground'}`}>
              プロフィール
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
