import { useSSO } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { toastHelpers } from '@/lib/toast-helpers';

interface GoogleSignInButtonProps {
  mode?: 'signIn' | 'signUp';
}

export function GoogleSignInButton({ mode = 'signIn' }: GoogleSignInButtonProps) {
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const onGooglePress = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err: any) {
      // キャンセルの場合は何もしない
      if (err?.errors?.[0]?.code === 'session_exists') {
        // すでにログイン中
        console.log('[GoogleSignIn] Already signed in, redirecting...');
        router.replace('/');
        return;
      }

      if (err?.errors?.[0]?.code === 'external_account_exists') {
        toastHelpers.auth.info(
          'このGoogleアカウントは既に登録されています 🔗',
          '別のアカウントでログインしたい場合は、一度ログアウトしてください'
        );
        return;
      }

      // ユーザーがキャンセルした場合
      if (err?.message?.includes('cancelled') || err?.code === 'CANCELED') {
        console.log('[GoogleSignIn] User cancelled');
        return;
      }

      console.error('[GoogleSignIn] Error:', JSON.stringify(err, null, 2));
      toastHelpers.auth.oauthFailed('Google');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, startSSOFlow, router]);

  const buttonText = mode === 'signIn' ? 'Googleでログイン' : 'Googleで登録';

  return (
    <TouchableOpacity
      onPress={onGooglePress}
      disabled={isLoading}
      className="w-full py-4 rounded-2xl bg-white border border-slate-200 flex-row items-center justify-center gap-3"
      activeOpacity={0.8}
      style={{ borderRadius: 16 }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#64748b" />
      ) : (
        <>
          <View className="w-6 h-6 items-center justify-center">
            <Ionicons name="logo-google" size={22} color="#4285F4" />
          </View>
          <Text className="text-slate-700 font-semibold text-base">{buttonText}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
