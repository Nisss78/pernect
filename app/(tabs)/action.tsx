import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MENU_ITEMS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  gradient: readonly [string, string];
}> = [
  { icon: 'chatbubbles', label: 'AIチャット', route: '/ai-chat', gradient: ['#8b5cf6', '#6366f1'] as const },
  { icon: 'heart', label: '相性診断', route: '/(tabs)/friends', gradient: ['#ec4899', '#f43f5e'] as const },
  { icon: 'sparkles', label: '統合分析', route: '/analysis', gradient: ['#06b6d4', '#0ea5e9'] as const },
  { icon: 'notifications', label: '通知', route: '/notifications', gradient: ['#f97316', '#eab308'] as const },
];

export default function ActionTab() {
  const router = useRouter();

  const handlePress = (route: string) => {
    router.push(route as any);
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      />
      <View style={styles.actionSheet}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.actionItem}
            onPress={() => handlePress(item.route)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={item.gradient}
              style={styles.actionIcon}
            >
              <Ionicons name={item.icon} size={24} color="white" />
            </LinearGradient>
            <Text style={styles.actionLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionSheet: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    left: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
});
