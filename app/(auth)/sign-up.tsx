import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Expo Web Browserのウォームアップ（OAuth高速化）
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // 認証済みのリダイレクトは(auth)/_layout.tsxで処理

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert('登録に失敗しました。入力内容を確認してください。');
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log('[SignUp] Setting active session...');
      await setActive({ session: completeSignUp.createdSessionId });
      console.log('[SignUp] setActive completed! useEffect will handle redirect...');
      // useEffectでisSignedInの変更を検知してリダイレクトする
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      alert('認証コードが正しくありません。');
    }
  };

  const onGoogleSignUpPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive: oAuthSetActive } = await startOAuthFlow();

      if (createdSessionId) {
        await oAuthSetActive!({ session: createdSessionId });
        console.log('[SignUp] Google OAuth complete!');
        // useEffectでisSignedInの変更を検知してリダイレクトする
      } else {
        // ユーザーがOAuthフローをキャンセルした場合など
        console.log('[SignUp] Google OAuth cancelled or incomplete');
      }
    } catch (err: any) {
      console.error('[SignUp] Google OAuth Error:', JSON.stringify(err, null, 2));

      // エラーメッセージを日本語化
      if (err.code === 'oauth_access_denied') {
        alert('Googleログインがキャンセルされました。');
      } else if (err.code === 'session_exists') {
        alert('既にログイン済みです。');
      } else {
        alert('Googleログインに失敗しました。もう一度お試しください。');
      }
    }
  }, [startOAuthFlow]);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-8 pt-20 pb-12">
          {!pendingVerification ? (
            <>
              {/* ヘッダー */}
              <View className="mb-12">
                <Text className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
                  アカウント作成
                </Text>
                <Text className="text-slate-500 font-medium">
                  新しいアカウントを作成して{'\n'}pernectを始めましょう
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
                    onChangeText={(email) => setEmailAddress(email)}
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
                  <Text className="text-xs text-slate-400 mt-2 ml-1">
                    8文字以上の英数字を含めてください
                  </Text>
                </View>
              </View>

              {/* アクションボタン */}
              <View className="gap-4">
                <TouchableOpacity
                  onPress={onSignUpPress}
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
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>アカウント作成</Text>
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
                  onPress={onGoogleSignUpPress}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 flex-row items-center justify-center gap-3"
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-google" size={24} color="#4285F4" />
                  <Text className="text-slate-900 font-bold text-base">Googleで登録</Text>
                </TouchableOpacity>

                <View className="flex-row items-center justify-center gap-2 py-2">
                  <Text className="text-slate-500 font-medium">すでにアカウントをお持ちですか？</Text>
                  <Link href="/(auth)/sign-in" asChild>
                    <TouchableOpacity>
                      <Text className="text-purple-600 font-bold">ログイン</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* 認証コード入力画面 */}
              <View className="mb-12">
                <Text className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
                  メール認証
                </Text>
                <Text className="text-slate-500 font-medium">
                  {emailAddress} に送信された{'\n'}認証コードを入力してください
                </Text>
              </View>

              <View className="space-y-6 mb-12 gap-6">
                <View>
                  <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">認証コード</Text>
                  <TextInput
                    value={code}
                    placeholder="123456"
                    placeholderTextColor="#94a3b8"
                    keyboardType="number-pad"
                    onChangeText={(code) => setCode(code)}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base text-center tracking-widest font-bold text-2xl"
                    maxLength={6}
                  />
                </View>
              </View>

              <View className="gap-4">
                <TouchableOpacity
                  onPress={onPressVerify}
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
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>認証する</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPendingVerification(false)} className="py-2">
                  <Text className="text-slate-500 font-medium text-center">メールアドレスを変更する</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}