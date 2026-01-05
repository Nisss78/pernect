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
          colors={['#8b5cf6', '#2563eb']}
          style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* ナビゲーションアイテム */}
      <View className="flex-row justify-between pt-3 pb-8 px-12">
        <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('home')}>
          <Ionicons
            name="home"
            size={24}
            color={currentScreen === 'home' ? '#2563eb' : '#64748b'}
          />
          <Text className={`text-xs ${currentScreen === 'home' ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
            ホーム
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center gap-1" onPress={() => onNavigate('profile')}>
          <FontAwesome
            name="user"
            size={24}
            color={currentScreen === 'profile' ? '#2563eb' : '#64748b'}
          />
          <Text className={`text-xs ${currentScreen === 'profile' ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
            プロフィール
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
