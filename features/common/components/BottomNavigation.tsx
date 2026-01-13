import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface BottomNavigationProps {
  currentScreen: 'home' | 'profile';
  onNavigate: (screen: 'home' | 'profile' | 'settings') => void;
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

      {/* ナビゲーションアイテム（左右をハーフに分け、中央のFAB領域を確保。各アイテムは「プラスボタンと端」の中間に配置） */}
      <View className="flex-row items-center justify-between pt-3 pb-8">
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

        {/* 中央のフローティングボタン(56px) + 余白のためのスペース */}
        <View style={{ width: 96 }} />

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
