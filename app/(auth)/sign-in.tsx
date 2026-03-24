import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toastHelpers } from '@/lib/toast-helpers';

// Expo Web Browserのウォームアップ（OAuth高速化）
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // 認証済みのリダイレクトは(auth)/_layout.tsxで処理

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
      } else if (result.status === 'needs_second_factor') {
        const secondFactor = result.supportedSecondFactors?.find(
          (f: any) => f.strategy === 'email_code'
        );
        if (secondFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
          });
          toastHelpers.auth.info(
            '認証コードをメールに送信しました 📧',
            'メールを確認して、コードを入力してください'
          );
        }
      } else {
        toastHelpers.auth.info(
          '認証に追加のステップが必要です',
          `ステータス: ${result.status}`
        );
      }
    } catch (err: any) {
      console.error('[SignIn] Error:', JSON.stringify(err, null, 2));
      const errorMessage = err?.errors?.[0]?.message || err?.message;
      toastHelpers.auth.signInFailed(errorMessage);
    }
  }, [isLoaded, emailAddress, password, signIn, setActive]);

  const onGoogleSignInPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive: oAuthSetActive } = await startGoogleOAuth();

      if (createdSessionId) {
        await oAuthSetActive!({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('[SignIn] Google OAuth Error:', JSON.stringify(err, null, 2));

      if (err.code === 'oauth_access_denied') {
        toastHelpers.auth.authCancelled();
      } else if (err.code === 'session_exists') {
        toastHelpers.auth.info(
          '既にログイン済みです ✅',
          '別のアカウントでログインしたい場合は、一度ログアウトしてください'
        );
      } else {
        toastHelpers.auth.oauthFailed('Google');
      }
    }
  }, [startGoogleOAuth]);

  const onAppleSignInPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive: oAuthSetActive } = await startAppleOAuth();

      if (createdSessionId) {
        await oAuthSetActive!({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('[SignIn] Apple OAuth Error:', JSON.stringify(err, null, 2));

      if (err.code === 'oauth_access_denied') {
        toastHelpers.auth.authCancelled();
      } else if (err.code === 'session_exists') {
        toastHelpers.auth.info(
          '既にログイン済みです ✅',
          '別のアカウントでログインしたい場合は、一度ログアウトしてください'
        );
      } else {
        toastHelpers.auth.oauthFailed('Apple');
      }
    }
  }, [startAppleOAuth]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-8 pt-20 pb-12">
          {/* ヘッダー */}
          <View className="mb-12">
            <Text className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
              おかえりなさい
            </Text>
            <Text className="text-slate-500 font-medium">
              アカウントにログインして{'\n'}続きを始めましょう
            </Text>
          </View>

          {/* フォーム */}
          <View className="space-y-6 mb-12 gap-6">
            <View>
              <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">メールアドレス</Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="name@example.com"
                placeholderTextColor="#94a3b8"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base"
              />
            </View>

            <View>
              <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">パスワード</Text>
              <View className="relative">
                <TextInput
                  value={password}
                  placeholder="パスワードを入力"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  onChangeText={(password) => setPassword(password)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base pr-12"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#94a3b8"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="items-end mt-3">
                <Text className="text-sm text-purple-600 font-bold">
                  パスワードをお忘れですか？
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* アクションボタン */}
          <View className="gap-4">
            <TouchableOpacity
              onPress={onSignInPress}
              className="w-full"
              activeOpacity={0.9}
              style={{ borderRadius: 16 }}
            >
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 16, minHeight: 60, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>ログイン</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* 区切り線 */}
            <View className="flex-row items-center gap-4 py-2">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="text-slate-400 font-medium">または</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Googleログインボタン */}
            <TouchableOpacity
              onPress={onGoogleSignInPress}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 flex-row items-center justify-center gap-3"
              activeOpacity={0.7}
            >
              <Ionicons name="logo-google" size={24} color="#4285F4" />
              <Text className="text-slate-900 font-bold text-base">Googleでログイン</Text>
            </TouchableOpacity>

            {/* Appleログインボタン（iOSのみ） */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={onAppleSignInPress}
                className="w-full bg-black rounded-2xl py-4 flex-row items-center justify-center gap-3"
                activeOpacity={0.7}
              >
                <Ionicons name="logo-apple" size={24} color="#ffffff" />
                <Text className="text-white font-bold text-base">Appleでログイン</Text>
              </TouchableOpacity>
            )}

            <View className="flex-row items-center justify-center gap-2 py-2">
              <Text className="text-slate-500 font-medium">アカウントをお持ちでないですか？</Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="text-purple-600 font-bold">新規登録</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}