import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSubscription } from '../../../lib/contexts/SubscriptionContext';

interface SettingsScreenProps {
  onNavigate: (screen: 'home' | 'profile' | 'settings' | 'profile-edit' | 'subscription') => void;
  onSignOut: () => void;
}

const TIER_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  free: { bg: 'bg-gray-100', text: 'text-gray-600' },
  premium: { bg: 'bg-purple-100', text: 'text-purple-700' },
};

export function SettingsScreen({ onNavigate, onSignOut }: SettingsScreenProps) {
  const deleteAccount = useMutation(api.users.deleteAccount);
  const { tier } = useSubscription();
  const badgeColor = TIER_BADGE_COLORS[tier] ?? TIER_BADGE_COLORS.free;

  const handleDeleteAccount = () => {
    Alert.alert(
      'アカウントを削除',
      'すべてのデータが完全に削除されます。この操作は取り消せません。本当に削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除する',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              onSignOut();
            } catch (err) {
              console.error('Account deletion failed:', err);
              Alert.alert('エラー', 'アカウントの削除に失敗しました。もう一度お試しください。');
            }
          },
        },
      ]
    );
  };

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
                    <Ionicons name="notifications" size={18} color="#2563eb" />
                  </View>
                  <Text className="text-base font-medium text-foreground">通知設定</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onNavigate('subscription')}
                className="flex-row items-center justify-between p-4 bg-white"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-purple-100 items-center justify-center">
                    <Ionicons name="diamond" size={18} color="#8b5cf6" />
                  </View>
                  <Text className="text-base font-medium text-foreground">サブスクリプション</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className={`px-2 py-0.5 rounded-full ${badgeColor.bg}`}>
                    <Text className={`text-xs font-bold ${badgeColor.text}`}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
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
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="flex-row items-center justify-center p-4 rounded-2xl mt-3"
            >
              <Ionicons name="trash" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
              <Text className="text-sm font-medium text-slate-400">アカウントを削除</Text>
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
