import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { api } from '../../../convex/_generated/api';

interface SettingsScreenProps {
  onNavigate: (screen: 'home' | 'profile' | 'settings' | 'profile-edit') => void;
  onSignOut: () => void;
}

export function SettingsScreen({ onNavigate, onSignOut }: SettingsScreenProps) {
  const [isCreatingTestData, setIsCreatingTestData] = useState(false);
  const [isClearingTestData, setIsClearingTestData] = useState(false);

  const createTestFriends = useMutation(api.seedTestFriends.createTestFriends);
  const clearTestFriends = useMutation(api.seedTestFriends.clearTestFriends);

  const handleCreateTestFriends = async () => {
    setIsCreatingTestData(true);
    try {
      const result = await createTestFriends();
      Alert.alert('テストデータ作成', result.message);
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'テストデータの作成に失敗しました');
    } finally {
      setIsCreatingTestData(false);
    }
  };

  const handleClearTestFriends = async () => {
    Alert.alert(
      'テストデータ削除',
      'テスト用の友達データをすべて削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            setIsClearingTestData(true);
            try {
              const result = await clearTestFriends();
              Alert.alert('削除完了', result.message);
            } catch (error: any) {
              Alert.alert('エラー', error.message || 'テストデータの削除に失敗しました');
            } finally {
              setIsClearingTestData(false);
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

          {/* Developer Section */}
          <View>
            <Text className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">開発者向け</Text>
            <View className="bg-card rounded-2xl overflow-hidden border border-border">
              <TouchableOpacity
                onPress={handleCreateTestFriends}
                disabled={isCreatingTestData}
                className="flex-row items-center justify-between p-4 border-b border-border bg-white"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center">
                    <Ionicons name="people" size={18} color="#22c55e" />
                  </View>
                  <View>
                    <Text className="text-base font-medium text-foreground">テスト友達を作成</Text>
                    <Text className="text-xs text-muted-foreground">5人の友達と2件の申請を追加</Text>
                  </View>
                </View>
                {isCreatingTestData ? (
                  <ActivityIndicator size="small" color="#22c55e" />
                ) : (
                  <Ionicons name="add-circle" size={24} color="#22c55e" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClearTestFriends}
                disabled={isClearingTestData}
                className="flex-row items-center justify-between p-4 bg-white"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-8 h-8 rounded-full bg-orange-100 items-center justify-center">
                    <Ionicons name="trash" size={18} color="#f97316" />
                  </View>
                  <View>
                    <Text className="text-base font-medium text-foreground">テストデータを削除</Text>
                    <Text className="text-xs text-muted-foreground">作成したテスト友達を削除</Text>
                  </View>
                </View>
                {isClearingTestData ? (
                  <ActivityIndicator size="small" color="#f97316" />
                ) : (
                  <Ionicons name="remove-circle" size={24} color="#f97316" />
                )}
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
