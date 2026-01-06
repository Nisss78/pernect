import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // 認証済みのリダイレクトは(auth)/_layout.tsxで処理

  const onSignInPress = React.useCallback(async () => {
    console.log('[SignIn] onSignInPress called, isLoaded:', isLoaded);
    if (!isLoaded) {
      console.log('[SignIn] Not loaded yet, returning');
      return;
    }

    try {
      console.log('[SignIn] Creating sign in...');

      // 既存のsign-in attemptをリセット
      if (signIn.status) {
        console.log('[SignIn] Existing sign-in status:', signIn.status);
      }

      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      console.log('[SignIn] Result status:', result.status);
      console.log('[SignIn] Result sessionId:', result.createdSessionId);
      console.log('[SignIn] supportedSecondFactors:', result.supportedSecondFactors);

      if (result.status === 'complete' && result.createdSessionId) {
        console.log('[SignIn] Sign in complete! Setting active session...');
        await setActive({ session: result.createdSessionId });
        console.log('[SignIn] setActive completed! useEffect will handle redirect...');
        // useEffectでisSignedInの変更を検知してリダイレクトする
      } else if (result.status === 'needs_second_factor') {
        // メール認証が要求されている場合、自動で送信
        console.log('[SignIn] Email verification required, attempting...');
        const secondFactor = result.supportedSecondFactors?.find(
          (f: any) => f.strategy === 'email_code'
        );
        if (secondFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
          });
          alert('認証コードをメールに送信しました。メールを確認してください。');
          // TODO: コード入力UIを表示
        }
      } else {
        // その他の認証ステップが必要
        console.log('[SignIn] Additional steps needed. Status:', result.status);
        console.log('[SignIn] First factor:', result.firstFactorVerification);
        console.log('[SignIn] Second factor:', result.secondFactorVerification);
        alert(`認証に追加のステップが必要です: ${result.status}`);
      }
    } catch (err: any) {
      console.error('[SignIn] Error:', JSON.stringify(err, null, 2));
      alert('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
    }
  }, [isLoaded, emailAddress, password]);

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