import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useMutation } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../../../convex/_generated/api';
import { useProfileEditData } from '../hooks/useProfileEditData';

interface ProfileEditScreenProps {
  onBack: () => void;
}

type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say' | '';

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: '', label: '選択してください' },
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
  { value: 'prefer_not_to_say', label: '回答しない' },
];

const OCCUPATION_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'student', label: '学生' },
  { value: 'engineer', label: 'エンジニア・技術職' },
  { value: 'designer', label: 'デザイナー・クリエイティブ' },
  { value: 'sales', label: '営業・販売' },
  { value: 'marketing', label: 'マーケティング・広報' },
  { value: 'finance', label: '金融・会計' },
  { value: 'medical', label: '医療・福祉' },
  { value: 'education', label: '教育' },
  { value: 'service', label: 'サービス業' },
  { value: 'government', label: '公務員' },
  { value: 'freelance', label: 'フリーランス' },
  { value: 'homemaker', label: '主婦・主夫' },
  { value: 'unemployed', label: '無職' },
  { value: 'other', label: 'その他' },
];

const MBTI_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'INTJ', label: 'INTJ - 建築家' },
  { value: 'INTP', label: 'INTP - 論理学者' },
  { value: 'ENTJ', label: 'ENTJ - 指揮官' },
  { value: 'ENTP', label: 'ENTP - 討論者' },
  { value: 'INFJ', label: 'INFJ - 提唱者' },
  { value: 'INFP', label: 'INFP - 仲介者' },
  { value: 'ENFJ', label: 'ENFJ - 主人公' },
  { value: 'ENFP', label: 'ENFP - 広報運動家' },
  { value: 'ISTJ', label: 'ISTJ - 管理者' },
  { value: 'ISFJ', label: 'ISFJ - 擁護者' },
  { value: 'ESTJ', label: 'ESTJ - 幹部' },
  { value: 'ESFJ', label: 'ESFJ - 領事官' },
  { value: 'ISTP', label: 'ISTP - 巨匠' },
  { value: 'ISFP', label: 'ISFP - 冒険家' },
  { value: 'ESTP', label: 'ESTP - 起業家' },
  { value: 'ESFP', label: 'ESFP - エンターテイナー' },
];

export function ProfileEditScreen({ onBack }: ProfileEditScreenProps) {
  const { currentUser } = useProfileEditData();
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [mbti, setMbti] = useState('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender>('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [image, setImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [userIdError, setUserIdError] = useState('');

  // Picker modals
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showOccupationPicker, setShowOccupationPicker] = useState(false);
  const [showMbtiPicker, setShowMbtiPicker] = useState(false);

  // 初期値をセット
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUserId(currentUser.userId || '');
      setMbti(currentUser.mbti || '');
      setImage(currentUser.image || '');
      if (currentUser.birthday) {
        setBirthday(new Date(currentUser.birthday));
      }
      setGender((currentUser.gender as Gender) || '');
      setBio(currentUser.bio || '');
      setOccupation(currentUser.occupation || '');
    }
  }, [currentUser]);

  // 変更があるかチェック
  useEffect(() => {
    if (currentUser) {
      const currentBirthday = birthday ? birthday.toISOString().split('T')[0] : '';
      const changed =
        name !== (currentUser.name || '') ||
        userId !== (currentUser.userId || '') ||
        mbti !== (currentUser.mbti || '') ||
        currentBirthday !== (currentUser.birthday || '') ||
        gender !== ((currentUser.gender as Gender) || '') ||
        bio !== (currentUser.bio || '') ||
        occupation !== (currentUser.occupation || '') ||
        image !== (currentUser.image || '');
      setHasChanges(changed);
    }
  }, [name, userId, mbti, birthday, gender, bio, occupation, image, currentUser]);

  // ユーザーIDバリデーション
  const validateUserId = (value: string) => {
    if (!value) {
      setUserIdError('');
      return true;
    }
    // 英数字とアンダースコアのみ許可（3-20文字）
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!regex.test(value)) {
      setUserIdError('3〜20文字の英数字とアンダースコアのみ使用可能');
      return false;
    }
    setUserIdError('');
    return true;
  };

  const handleUserIdChange = (value: string) => {
    setUserId(value.toLowerCase());
    validateUserId(value.toLowerCase());
  };

  const getMbtiLabel = () => {
    const option = MBTI_OPTIONS.find((o) => o.value === mbti);
    return option?.label || '選択してください';
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    if (userIdError) {
      Alert.alert('エラー', userIdError);
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name || undefined,
        userId: userId || undefined,
        mbti: mbti || undefined,
        birthday: birthday ? birthday.toISOString().split('T')[0] : undefined,
        gender: gender || undefined,
        bio: bio || undefined,
        occupation: occupation || undefined,
        image: image || undefined,
      });
      Alert.alert('保存完了', 'プロフィールを更新しました', [
        { text: 'OK', onPress: onBack },
      ]);
    } catch (error: any) {
      if (error.message?.includes('既に使用されています')) {
        Alert.alert('エラー', 'このユーザーIDは既に使用されています');
      } else {
        Alert.alert('エラー', 'プロフィールの更新に失敗しました');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('権限が必要です', '写真ライブラリへのアクセスを許可してください。');
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
        const dataUrl = `data:${mime};base64,${asset.base64}`;
        setImage(dataUrl);
      } else if (asset.uri) {
        setImage(asset.uri);
      }
    } catch (e) {
      console.error('pickImage error', e);
      Alert.alert('エラー', '画像の選択に失敗しました');
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}年${month}月${day}日`;
  };

  const getGenderLabel = () => {
    const option = GENDER_OPTIONS.find((o) => o.value === gender);
    return option?.label || '選択してください';
  };

  const getOccupationLabel = () => {
    const option = OCCUPATION_OPTIONS.find((o) => o.value === occupation);
    return option?.label || '選択してください';
  };

  if (!currentUser) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-14 pb-4 border-b border-border bg-background z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 items-center justify-center rounded-full bg-secondary"
          >
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#8b5cf6]">プロフィール編集</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges || isSaving}
            className={`px-4 py-2 rounded-full ${hasChanges && !isSaving ? 'bg-[#8b5cf6]' : 'bg-muted'
              }`}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className={`font-bold ${hasChanges ? 'text-white' : 'text-muted-foreground'
                  }`}
              >
                保存
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="p-6 gap-6">
            {/* Avatar */}
            <View className="items-center">
              <View className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-background shadow-sm mb-4 bg-card items-center justify-center relative">
                {image ? (
                  <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Ionicons name="person" size={48} color="#94a3b8" />
                )}
                <View className="absolute bottom-0 right-0 left-0 h-8 bg-black/30 items-center justify-center">
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </View>
              <View className="flex-row gap-3">
                <TouchableOpacity onPress={pickImageFromLibrary} className="px-4 py-2 rounded-xl bg-[#8b5cf6] shadow-sm">
                  <Text className="text-white font-bold">写真を変更</Text>
                </TouchableOpacity>
                {image ? (
                  <TouchableOpacity onPress={() => setImage('')} className="px-4 py-2 rounded-xl bg-card border border-border">
                    <Text className="text-foreground font-medium">削除</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Name */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                名前
              </Text>
              <TextInput
                className="bg-card border border-border/50 rounded-2xl px-5 py-4 text-base text-foreground shadow-sm"
                placeholder="名前を入力"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
                maxLength={50}
              />
            </View>

            {/* User ID */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                ユーザーID
              </Text>
              <View className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex-row items-center shadow-sm">
                <Text className="text-[#8b5cf6] font-bold text-base mr-1">@</Text>
                <TextInput
                  className="flex-1 text-base text-foreground"
                  placeholder="username"
                  placeholderTextColor="#94a3b8"
                  value={userId}
                  onChangeText={handleUserIdChange}
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {userIdError ? (
                <Text className="text-xs text-red-500 mt-1 ml-1">{userIdError}</Text>
              ) : (
                <Text className="text-xs text-muted-foreground mt-1 ml-1">
                  3〜20文字の英数字とアンダースコア
                </Text>
              )}
            </View>

            {/* MBTI - Picker */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                MBTI
              </Text>
              <TouchableOpacity
                onPress={() => setShowMbtiPicker(true)}
                className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex-row items-center justify-between shadow-sm"
              >
                <Text
                  className={`text-base ${mbti ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                >
                  {getMbtiLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Birthday - DatePicker */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                誕生日
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex-row items-center justify-between shadow-sm"
              >
                <Text
                  className={`text-base ${birthday ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                >
                  {birthday ? formatDate(birthday) : '誕生日を選択'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Gender - Picker */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                性別
              </Text>
              <TouchableOpacity
                onPress={() => setShowGenderPicker(true)}
                className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex-row items-center justify-between shadow-sm"
              >
                <Text
                  className={`text-base ${gender ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                >
                  {getGenderLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Occupation - Picker */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                職業
              </Text>
              <TouchableOpacity
                onPress={() => setShowOccupationPicker(true)}
                className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex-row items-center justify-between shadow-sm"
              >
                <Text
                  className={`text-base ${occupation ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                >
                  {getOccupationLabel()}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Bio */}
            <View>
              <Text className="text-sm font-bold text-muted-foreground mb-2 ml-1">
                自己紹介
              </Text>
              <TextInput
                className="bg-card border border-border/50 rounded-2xl px-5 py-4 text-base text-foreground min-h-[120px] shadow-sm"
                placeholder="自己紹介を入力"
                placeholderTextColor="#94a3b8"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={300}
              />
              <Text className="text-xs text-muted-foreground mt-1 ml-1 text-right">
                {bio.length}/300
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="text-base text-muted-foreground">キャンセル</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-foreground">誕生日</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text className="text-base font-bold text-[#8b5cf6]">完了</Text>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center', paddingVertical: 10 }}>
                <DateTimePicker
                  value={birthday || new Date(2000, 0, 1)}
                  mode="date"
                  display="inline"
                  onChange={(event, date) => {
                    if (date) setBirthday(date);
                  }}
                  maximumDate={new Date()}
                  minimumDate={new Date(1920, 0, 1)}
                  locale="ja"
                  style={{ height: 320, width: 320 }}
                  accentColor="#8b5cf6"
                  textColor="#000000"
                />
              </View>
              <View className="h-8" />
            </View>
          </View>
        </Modal>
      )}

      {/* Gender Picker Modal */}
      {showGenderPicker && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                  <Text className="text-base text-muted-foreground">キャンセル</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-foreground">性別</Text>
                <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                  <Text className="text-base font-bold text-[#8b5cf6]">完了</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value as Gender)}
                style={{ height: 200 }}
              >
                {GENDER_OPTIONS.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <View className="h-8" />
            </View>
          </View>
        </Modal>
      )}

      {/* Occupation Picker Modal */}
      {showOccupationPicker && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={() => setShowOccupationPicker(false)}>
                  <Text className="text-base text-muted-foreground">キャンセル</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-foreground">職業</Text>
                <TouchableOpacity onPress={() => setShowOccupationPicker(false)}>
                  <Text className="text-base font-bold text-[#8b5cf6]">完了</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={occupation}
                onValueChange={(value) => setOccupation(value)}
                style={{ height: 200 }}
              >
                {OCCUPATION_OPTIONS.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <View className="h-8" />
            </View>
          </View>
        </Modal>
      )}

      {/* MBTI Picker Modal */}
      {showMbtiPicker && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center px-6 py-4 border-b border-border">
                <TouchableOpacity onPress={() => setShowMbtiPicker(false)}>
                  <Text className="text-base text-muted-foreground">キャンセル</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-foreground">MBTI</Text>
                <TouchableOpacity onPress={() => setShowMbtiPicker(false)}>
                  <Text className="text-base font-bold text-[#8b5cf6]">完了</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={mbti}
                onValueChange={(value) => setMbti(value)}
                style={{ height: 200 }}
              >
                {MBTI_OPTIONS.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <View className="h-8" />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
