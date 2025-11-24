import { useAuth } from '@clerk/clerk-expo';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black p-4">
      <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
        Expo SDK Starter
      </Text>

      <AuthLoading>
        <Text className="text-lg text-gray-500">Loading auth...</Text>
      </AuthLoading>

      <Authenticated>
        <Text className="text-xl text-green-600 mb-4">You are logged in!</Text>
        <TouchableOpacity
          onPress={() => signOut()}
          className="bg-red-500 px-6 py-3 rounded-full active:bg-red-600"
        >
          <Text className="text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </Authenticated>

      <Unauthenticated>
        <Text className="text-xl text-slate-600 mb-4">Please sign in to continue</Text>
        <View className="flex-row gap-4">
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-full active:bg-blue-600">
              <Text className="text-white font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity className="bg-slate-500 px-6 py-3 rounded-full active:bg-slate-600">
              <Text className="text-white font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Unauthenticated>
    </View>
  );
}
