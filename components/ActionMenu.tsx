import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function ActionMenu({ visible, onClose }: ActionMenuProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-end">
          <TouchableWithoutFeedback>
            <View className="bg-background rounded-t-3xl shadow-2xl">
              {/* Header */}
              <View className="flex-row items-center justify-between px-6 py-5 border-b border-border">
                <Text className="text-xl font-bold text-foreground">何をしますか？</Text>
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
                >
                  <Ionicons name="close" size={24} className="text-muted-foreground" color="#64748b" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="px-6 py-6 space-y-4 gap-4">
                {/* AI Chat Card */}
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#8b5cf6', '#8b5cf6', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-3xl p-6 shadow-lg"
                    style={{ borderRadius: 24 }}
                  >
                    <View className="flex-row items-start gap-4 mb-4">
                      <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
                        <Ionicons name="chatbubbles" size={36} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-2">AIチャット</Text>
                        <Text className="text-white/90 text-sm leading-relaxed">
                          あなたを深く理解するパーソナルAIと対話
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="star" size={16} color="rgba(255,255,255,0.8)" />
                      <Text className="text-white/80 text-xs">4.9</Text>
                      <Text className="text-white/80 text-xs mx-2">•</Text>
                      <Text className="text-white/80 text-xs">10万人以上が利用中</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Friends Match Card */}
                <TouchableOpacity>
                  <LinearGradient
                    colors={['#ec4899', '#ec4899', '#f43f5e']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-3xl p-6 shadow-lg"
                    style={{ borderRadius: 24 }}
                  >
                    <View className="flex-row items-start gap-4 mb-4">
                      <View className="w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
                        <Ionicons name="people" size={36} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-2xl font-bold text-white mb-2">友達と相性チェック</Text>
                        <Text className="text-white/90 text-sm leading-relaxed">
                          友達を招待して相性や恋愛診断を分析
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="heart" size={16} color="rgba(255,255,255,0.8)" />
                      <Text className="text-white/80 text-xs">50万組のマッチング</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              {/* Spacer for bottom safe area */}
              <View className="h-10" />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
