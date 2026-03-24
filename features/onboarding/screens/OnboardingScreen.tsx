import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useConvexAuth, useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../../convex/_generated/api';
import { clearAllTokens } from '../../../lib/auth';
import { toastHelpers } from '../../../lib/toast-helpers';
import { StepBirthday } from '../components/StepBirthday';
import { StepMbti } from '../components/StepMbti';
import { StepProfileImage } from '../components/StepProfileImage';
import { StepName } from '../components/StepName';
import { StepReferralSource } from '../components/StepReferralSource';

const TOTAL_STEPS = 5;

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step data
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState(new Date(2000, 0, 1));
  const [mbti, setMbti] = useState('');
  const [referralSource, setReferralSource] = useState('');

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return true; // image is optional
      case 1:
        return name.trim().length >= 1;
      case 2:
        return true; // birthday always has a value
      case 3:
        return true; // MBTI is optional
      case 4:
        return true; // referral source is optional
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Last step: submit
    if (!isAuthenticated) {
      Alert.alert('認証エラー', 'ログインセッションが切れました。再ログインしてください。');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeOnboarding({
        name: name.trim(),
        birthday: birthday.toISOString().split('T')[0],
        mbti: mbti || undefined,
        referralSource: referralSource || undefined,
        image: image || undefined,
      });
      // onboardingCompleted: true がDBに反映されると
      // _layout.tsx のリアクティブクエリが自動で (tabs) に切り替える
      // router.replace は不要（競合の原因になる）
    } catch (error) {
      console.error('Onboarding error:', error);
      toastHelpers.common.error(
        '保存できませんでした',
        'もう一度お試しください'
      );
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限が必要です', '写真ライブラリへのアクセスを許可してください');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset) return;

      if (asset.base64) {
        const mime = asset.mimeType || 'image/jpeg';
        setImage(`data:${mime};base64,${asset.base64}`);
      } else if (asset.uri) {
        setImage(asset.uri);
      }
    } catch (error) {
      console.error('pickImage error:', error);
      Alert.alert('画像を選べませんでした', 'もう一度お試しください');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepProfileImage
            image={image}
            onPickImage={pickImageFromLibrary}
            onClearImage={() => setImage('')}
          />
        );
      case 1:
        return <StepName name={name} onNameChange={setName} />;
      case 2:
        return (
          <StepBirthday birthday={birthday} onBirthdayChange={setBirthday} />
        );
      case 3:
        return <StepMbti mbti={mbti} onMbtiChange={setMbti} />;
      case 4:
        return (
          <StepReferralSource
            referralSource={referralSource}
            onReferralSourceChange={setReferralSource}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Header: Progress bar + Back button */}
      <View className="px-6 pt-4 pb-2">
        <View className="flex-row items-center gap-3 mb-4">
          {currentStep > 0 ? (
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
            >
              <Ionicons name="arrow-back" size={20} color="#64748b" />
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}

          <View className="flex-1 flex-row gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View
                key={i}
                className={`flex-1 h-1.5 rounded-full ${
                  i <= currentStep ? 'bg-[#8b5cf6]' : 'bg-border'
                }`}
              />
            ))}
          </View>

          <View className="w-10">
            <Text className="text-xs text-muted-foreground text-center">
              {currentStep + 1}/{TOTAL_STEPS}
            </Text>
          </View>
        </View>
      </View>

      {/* Step content */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {renderStep()}
      </KeyboardAvoidingView>

      {/* Sign out link (step 1 only) */}
      {currentStep === 0 && (
        <View className="items-center pb-2">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'ログアウト',
                'ログアウトして別のアカウントでログインしますか？',
                [
                  { text: 'キャンセル', style: 'cancel' },
                  {
                    text: 'ログアウト',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await clearAllTokens();
                        await signOut();
                        console.log('SignOut success');
                        router.replace('/(auth)/sign-in');
                      } catch (e) {
                        console.error('SignOut error:', e);
                        router.replace('/(auth)/sign-in');
                      }
                    },
                  },
                ]
              );
            }}
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
            style={{ paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <Text className="text-sm text-muted-foreground underline">
              別のアカウントでログインする
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom button */}
      <View className="px-6 pb-4">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canGoNext() || isSubmitting}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              canGoNext() && !isSubmitting
                ? ['#8b5cf6', '#2563eb']
                : ['#d1d5db', '#d1d5db']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ borderRadius: 16, paddingVertical: 18, alignItems: 'center' }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-lg font-bold">
                {isLastStep ? 'はじめる' : '次へ'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
