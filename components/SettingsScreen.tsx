import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface SettingsScreenProps {
  onNavigate: (screen: 'home' | 'profile' | 'settings') => void;
  onSignOut: () => void;
}

export function SettingsScreen({ onNavigate, onSignOut }: SettingsScreenProps) {
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 border-b border-border bg-background z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => onNavigate('profile')}
            className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-foreground">設定</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 space-y-6 gap-6">
          {/* Account Section */}
          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">アカウント</Text>
            <View className="bg-card rounded-2xl overflow-hidden border border-border">
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border bg-white">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                    <Ionicons name="person" size={18} color="#2563eb" />
                  </View>
                  <Text className="text-base font-medium text-foreground">プロフィール編集</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                    <Ionicons name="notifications" size={18} color="#2563eb" />
                  </View>
                  <Text className="text-base font-medium text-foreground">通知設定</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* About Section */}
          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">アプリについて</Text>
            <View className="bg-card rounded-2xl overflow-hidden border border-border">
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border bg-white">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
                    <Ionicons name="business" size={18} color="#64748b" />
                  </View>
                  <Text className="text-base font-medium text-foreground">運営会社</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-border bg-white">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
                    <Ionicons name="document-text" size={18} color="#64748b" />
                  </View>
                  <Text className="text-base font-medium text-foreground">利用規約</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white">
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center">
                    <Ionicons name="shield-checkmark" size={18} color="#64748b" />
                  </View>
                  <Text className="text-base font-medium text-foreground">プライバシーポリシー</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Actions Section */}
          <View>
            <TouchableOpacity 
              onPress={onSignOut}
              className="flex-row items-center justify-center p-4 rounded-2xl bg-red-50 border border-red-100"
            >
              <Ionicons name="log-out" size={20} color="#ef4444" style={{ marginRight: 8 }} />
              <Text className="text-base font-bold text-red-500">ログアウト</Text>
            </TouchableOpacity>
            <View className="items-center mt-6">
              <Text className="text-xs text-muted-foreground">バージョン 1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
