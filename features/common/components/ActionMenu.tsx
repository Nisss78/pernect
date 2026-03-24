import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const SHEET_HEIGHT = 480;
const DRAG_THRESHOLD = 80;

interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: 'ai-chat' | 'friends-match' | 'integrated-analysis' | 'notifications' | 'notification-settings') => void;
}

export function ActionMenu({ visible, onClose, onNavigate }: ActionMenuProps) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // 未処理のフレンドリクエスト数を取得
  const pendingRequests = useQuery(api.friendships.listPendingRequests, {});
  const pendingCount = pendingRequests?.length || 0;

  // 未読通知数を取得
  const unreadNotifications = useQuery(api.notifications.listUnread, {});
  const unreadNotificationCount = unreadNotifications?.length || 0;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > DRAG_THRESHOLD || gestureState.vy > 0.5) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  const openSheet = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, backdropOpacity]);

  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [translateY, backdropOpacity, onClose]);

  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      translateY.setValue(SHEET_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [visible, openSheet, translateY, backdropOpacity]);

  const handleNavigate = (screen: 'ai-chat' | 'friends-match' | 'integrated-analysis' | 'notifications' | 'notification-settings') => {
    closeSheet();
    setTimeout(() => {
      onNavigate?.(screen);
    }, 280);
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0" style={{ zIndex: 100 }}>
      {/* Backdrop */}
      <Animated.View
        className="absolute inset-0 bg-black/40"
        style={{ opacity: backdropOpacity }}
      >
        <TouchableOpacity className="flex-1" onPress={closeSheet} activeOpacity={1} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        className="absolute left-0 right-0 bottom-0 bg-background rounded-t-3xl"
        style={{
          height: SHEET_HEIGHT,
          transform: [{ translateY }],
        }}
        {...panResponder.panHandlers}
      >
        {/* Drag Handle */}
        <View className="items-center pt-3 pb-2">
          <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-3 border-b border-border">
          <Text className="text-xl font-bold text-foreground">何をしますか？</Text>
          <TouchableOpacity
            onPress={closeSheet}
            className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="px-6 py-5 gap-3">
          {/* AI Chat Card */}
          <TouchableOpacity onPress={() => handleNavigate('ai-chat')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#8b5cf6', '#8b5cf6', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 16 }}
            >
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="chatbubbles" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white" numberOfLines={1}>AIチャット</Text>
                  <Text className="text-white/90 text-xs" numberOfLines={1}>
                    あなたを深く理解するパーソナルAIと対話
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="star" size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs">4.9</Text>
                <Text className="text-white/80 text-xs mx-1">•</Text>
                <Text className="text-white/80 text-xs">10万人以上が利用中</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Friends Match Card */}
          <TouchableOpacity onPress={() => handleNavigate('friends-match')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#ec4899', '#ec4899', '#f43f5e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 16 }}
            >
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="people" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-bold text-white" numberOfLines={1}>友達と相性チェック</Text>
                    {pendingCount > 0 && (
                      <View className="bg-red-500 rounded-full ml-2 px-2 py-0.5">
                        <Text className="text-white text-xs font-bold">{pendingCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-white/90 text-xs" numberOfLines={1}>
                    友達を招待して相性や恋愛診断を分析
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="heart" size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs">50万組のマッチング</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Notifications Card */}
          <TouchableOpacity onPress={() => handleNavigate('notifications')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#f59e0b', '#f59e0b', '#f97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 16 }}
            >
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="notifications" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-bold text-white" numberOfLines={1}>通知</Text>
                    {unreadNotificationCount > 0 && (
                      <View className="bg-red-500 rounded-full ml-2 px-2 py-0.5">
                        <Text className="text-white text-xs font-bold">{unreadNotificationCount}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-white/90 text-xs" numberOfLines={1}>
                    友達リクエストや分析完了のお知らせ
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="notifications" size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs">リアルタイム通知</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Integrated Analysis Card */}
          <TouchableOpacity onPress={() => handleNavigate('integrated-analysis')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#2563eb', '#2563eb', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ borderRadius: 20, padding: 16 }}
            >
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center">
                  <Ionicons name="analytics" size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-white" numberOfLines={1}>統合分析</Text>
                  <Text className="text-white/90 text-xs" numberOfLines={1}>
                    複数の診断結果を踏まえてAI分析
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles" size={14} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-xs">恋愛・キャリア・総合</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
