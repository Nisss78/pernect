import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Clerkがまだロード中の場合
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-lg text-gray-500 mt-4">読み込み中...</Text>
      </View>
    );
  }

  // 認証済みの場合はホームにリダイレクト
  if (isSignedIn) {
    console.log('[AuthLayout] User is signed in, redirecting to home...');
    return <Redirect href="/" />;
  }

  // 未認証の場合は認証画面を表示
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
