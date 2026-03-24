import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { toastHelpers } from '@/lib/toast-helpers';
import {
  validateEmail,
  validatePassword,
  getPasswordStrengthScore,
  getPasswordStrengthLabel,
  type ValidationResult,
} from '@/lib/validation';
import { PasswordStrengthBar } from '@/components/ui/InputWithValidation';

// Expo Web Browserのウォームアップ（OAuth高速化）
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: 'oauth_apple' });

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // バリデーション状態
  const [emailValidation, setEmailValidation] = React.useState<ValidationResult>({ isValid: true });
  const [passwordValidation, setPasswordValidation] = React.useState<ValidationResult>({ isValid: true });
  const [isEmailTouched, setIsEmailTouched] = React.useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = React.useState(false);

  // メールアドレス変更時のバリデーション
  const handleEmailChange = (email: string) => {
    setEmailAddress(email);
    if (isEmailTouched) {
      setEmailValidation(validateEmail(email));
    }
  };

  // パスワード変更時のバリデーション
  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    if (isPasswordTouched) {
      setPasswordValidation(validatePassword(pwd));
    }
  };

  // 認証済みのリダイレクトは(auth)/_layout.tsxで処理

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    // バリデーション実行
    const emailResult = validateEmail(emailAddress);
    const passwordResult = validatePassword(password);

    setEmailValidation(emailResult);
    setPasswordValidation(passwordResult);

    if (!emailResult.isValid) {
      toastHelpers.auth.signUpFailed(emailResult.error);
      return;
    }

    if (!passwordResult.isValid) {
      toastHelpers.auth.signUpFailed(passwordResult.error);
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
      toastHelpers.common.success(
        '認証メールを送信しました 📧',
        `${emailAddress} を確認してください`
      );
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      if (err?.errors?.[0]?.message) {
        toastHelpers.auth.signUpFailed(err.errors[0].message);
      } else {
        toastHelpers.auth.signUpFailed();
      }
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    if (!code || code.length !== 6) {
      toastHelpers.common.error('認証コードを入力してください', '6桁のコードをメールから確認してください');
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      toastHelpers.common.error('認証コードが正しくありません', 'コードをもう一度確認してください');
    }
  };

  const onGoogleSignUpPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive: oAuthSetActive } = await startGoogleOAuth();

      if (createdSessionId) {
        await oAuthSetActive!({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('[SignUp] Google OAuth Error:', JSON.stringify(err, null, 2));

      if (err.code === 'oauth_access_denied') {
        toastHelpers.auth.authCancelled();
      } else if (err.code === 'session_exists') {
        toastHelpers.auth.info(
          '既にログイン済みです ✅',
          '別のアカウントで登録したい場合は、一度ログアウトしてください'
        );
      } else {
        toastHelpers.auth.oauthFailed('Google');
      }
    }
  }, [startGoogleOAuth]);

  const onAppleSignUpPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive: oAuthSetActive } = await startAppleOAuth();

      if (createdSessionId) {
        await oAuthSetActive!({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error('[SignUp] Apple OAuth Error:', JSON.stringify(err, null, 2));

      if (err.code === 'oauth_access_denied') {
        toastHelpers.auth.authCancelled();
      } else if (err.code === 'session_exists') {
        toastHelpers.auth.info(
          '既にログイン済みです ✅',
          '別のアカウントで登録したい場合は、一度ログアウトしてください'
        );
      } else {
        toastHelpers.auth.oauthFailed('Apple');
      }
    }
  }, [startAppleOAuth]);

  // パスワード強度スコア
  const passwordStrength = getPasswordStrengthScore(password);
  const passwordStrengthLabel = getPasswordStrengthLabel(passwordStrength);

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
                {/* メールアドレス */}
                <View>
                  <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">メールアドレス</Text>
                  <View className="relative">
                    <TextInput
                      autoCapitalize="none"
                      value={emailAddress}
                      placeholder="name@example.com"
                      placeholderTextColor="#94a3b8"
                      onChangeText={handleEmailChange}
                      onBlur={() => {
                        setIsEmailTouched(true);
                        setEmailValidation(validateEmail(emailAddress));
                      }}
                      className={`w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 text-slate-900 text-base ${
                        isEmailTouched && !emailValidation.isValid
                          ? 'border-red-400 bg-red-50'
                          : isEmailTouched && emailValidation.isValid
                          ? 'border-green-400 bg-green-50'
                          : 'border-slate-200'
                      }`}
                    />
                    {/* バリデーションアイコン */}
                    {isEmailTouched && (
                      <View className="absolute right-4 top-4">
                        {emailValidation.isValid ? (
                          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                        ) : (
                          <Ionicons name="alert-circle" size={24} color="#ef4444" />
                        )}
                      </View>
                    )}
                  </View>
                  {/* バリデーションメッセージ */}
                  {isEmailTouched && emailValidation.error && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Ionicons name="warning" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                      <Text className="text-xs text-red-500">{emailValidation.error}</Text>
                    </View>
                  )}
                  {isEmailTouched && emailValidation.isValid && emailAddress && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Ionicons name="checkmark-circle" size={14} color="#10b981" style={{ marginRight: 4 }} />
                      <Text className="text-xs text-green-600">有効なメールアドレスです ✨</Text>
                    </View>
                  )}
                </View>

                {/* パスワード */}
                <View>
                  <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">パスワード</Text>
                  <View className="relative">
                    <TextInput
                      value={password}
                      placeholder="パスワードを入力"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showPassword}
                      onChangeText={handlePasswordChange}
                      onBlur={() => {
                        setIsPasswordTouched(true);
                        setPasswordValidation(validatePassword(password));
                      }}
                      className={`w-full px-5 py-4 rounded-2xl border-2 text-slate-900 text-base pr-12 ${
                        isPasswordTouched && !passwordValidation.isValid
                          ? 'border-red-400 bg-red-50'
                          : isPasswordTouched && passwordValidation.isValid
                          ? 'border-green-400 bg-green-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
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

                  {/* パスワード強度インジケーター */}
                  {password.length > 0 && (
                    <>
                      <View className="flex-row items-center justify-between mt-2 ml-1">
                        <Text className="text-xs text-slate-500">
                          強度: {passwordStrengthLabel.label} {passwordStrengthLabel.emoji}
                        </Text>
                        <Text className="text-xs text-slate-400">{passwordStrength}/100</Text>
                      </View>
                      <PasswordStrengthBar score={passwordStrength} />
                    </>
                  )}

                  {/* バリデーションメッセージ */}
                  {isPasswordTouched && passwordValidation.error && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Ionicons name="warning" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                      <Text className="text-xs text-red-500">{passwordValidation.error}</Text>
                    </View>
                  )}
                  {isPasswordTouched && passwordValidation.isValid && passwordValidation.hint && (
                    <View className="flex-row items-center mt-2 ml-1">
                      <Ionicons name="checkmark-circle" size={14} color="#10b981" style={{ marginRight: 4 }} />
                      <Text className="text-xs text-green-600">{passwordValidation.hint}</Text>
                    </View>
                  )}
                  {!isPasswordTouched && (
                    <Text className="text-xs text-slate-400 mt-2 ml-1">
                      💡 8文字以上で、英字と数字を混ぜると安全です
                    </Text>
                  )}
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

                {/* Appleログインボタン（iOSのみ） */}
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    onPress={onAppleSignUpPress}
                    className="w-full bg-black rounded-2xl py-4 flex-row items-center justify-center gap-3"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="logo-apple" size={24} color="#ffffff" />
                    <Text className="text-white font-bold text-base">Appleで登録</Text>
                  </TouchableOpacity>
                )}

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
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-base text-center tracking-widest font-bold text-2xl focus:border-purple-400"
                    maxLength={6}
                  />
                  <Text className="text-xs text-slate-400 mt-2 ml-1">
                    💡 メールに記載されている6桁のコードを入力してください
                  </Text>
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
