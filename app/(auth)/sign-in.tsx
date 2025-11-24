import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/');
    }
  }, [isSignedIn]);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });
      // This is an important step to navigate the user to the home page
      await setActive({ session: completeSignIn.createdSessionId });
      router.replace('/');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-8">Welcome to Expo SDK</Text>
      <View className="w-full max-w-sm space-y-4">
        <View>
          <TextInput
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Email..."
            onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
          />
        </View>

        <View className="relative">
          <TextInput
            value={password}
            placeholder="Password..."
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 pr-12"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3"
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-blue-500 w-full py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-lg">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/sign-up">
            <Text className="text-blue-500 font-semibold">Sign up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}