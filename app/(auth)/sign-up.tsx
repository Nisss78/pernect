import { useAuth, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace('/');
    }
  }, [isSignedIn]);

  // start the sign up process.
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {!pendingVerification && (
        <View className="w-full max-w-sm">
          <Text className="text-2xl font-bold mb-8 text-center">Welcome to Expo SDK</Text>
          <View>
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email..."
              onChangeText={(email) => setEmailAddress(email)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
            />
          </View>

          <View className="relative">
            <TextInput
              value={password}
              placeholder="Password..."
              placeholderTextColor="#000"
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
            onPress={onSignUpPress}
            className="bg-blue-500 w-full py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}

      {pendingVerification && (
        <View className="w-full max-w-sm">
          <Text className="text-2xl font-bold mb-8 text-center">Verify Email</Text>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              onChangeText={(code) => setCode(code)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6"
            />
          </View>
          <TouchableOpacity
            onPress={onPressVerify}
            className="bg-blue-500 w-full py-3 rounded-lg items-center"
          >
            <Text className="text-white font-semibold text-lg">Verify Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}