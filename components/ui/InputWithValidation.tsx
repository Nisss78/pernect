import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { ValidationResult, ValidationStatus } from '@/lib/validation';

interface InputWithValidationProps extends TextInputProps {
  /** ラベルテキスト */
  label?: string;
  /** エラーメッセージ（手動設定用） */
  error?: string;
  /** ヒントテキスト */
  hint?: string;
  /** バリデーション結果 */
  validation?: ValidationResult;
  /** バリデーション実行中かどうか */
  isValidating?: boolean;
  /** 値をクリアするボタンを表示するか */
  clearable?: boolean;
  /** コンテナスタイル */
  containerClassName?: string;
  /** onClearコールバック */
  onClear?: () => void;
}

/**
 * バリデーション付き入力フィールドコンポーネント
 *
 * - リアルタイムバリデーション結果を視覚的に表示
 * - エラー時は赤い枠とアイコン
 * - 成功時は緑色のチェックマーク
 * - ヒントメッセージの表示
 * - クリアボタン付き
 */
export function InputWithValidation({
  label,
  error,
  hint,
  validation,
  isValidating = false,
  clearable = false,
  containerClassName = '',
  onClear,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = '#94a3b8',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  ...props
}: InputWithValidationProps) {
  const [isFocused, setIsFocused] = useState(false);

  // バリデーションステータスの判定
  const getStatus = (): ValidationStatus => {
    if (error) return 'invalid';
    if (isValidating) return 'validating';
    if (!validation) return 'idle';
    if (!value) return 'idle';
    return validation.isValid ? 'valid' : 'invalid';
  };

  const status = getStatus();

  // 枠線の色
  const getBorderColor = () => {
    if (status === 'invalid') return '#ef4444'; // 赤
    if (status === 'valid') return '#10b981'; // 緑
    if (isFocused) return '#8b5cf6'; // 紫（フォーカス時）
    return '#e2e8f0'; // グレー（デフォルト）
  };

  const getBackgroundColor = () => {
    if (status === 'invalid') return '#fef2f2';
    return '#f8fafc';
  };

  // ステータスアイコン
  const getStatusIcon = () => {
    if (isValidating) {
      return <Ionicons name="time-outline" size={20} color="#94a3b8" />;
    }
    if (status === 'valid') {
      return <Ionicons name="checkmark-circle" size={20} color="#10b981" />;
    }
    if (status === 'invalid') {
      return <Ionicons name="alert-circle" size={20} color="#ef4444" />;
    }
    return null;
  };

  // エラーメッセージまたはヒント
  const getMessage = () => {
    if (error) return error;
    if (validation?.error) return validation.error;
    if (validation?.hint) return validation.hint;
    return hint;
  };

  const message = getMessage();
  const hasMessage = !!message;

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {/* ラベル */}
      {label && (
        <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">
          {label}
        </Text>
      )}

      {/* 入力フィールド */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.input}
          {...props}
        />

        {/* 右側のアイコン/ボタン */}
        <View style={styles.rightContainer}>
          {clearable && value && status !== 'validating' && (
            <TouchableOpacity onPress={onClear} style={styles.iconButton}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
          {getStatusIcon()}
        </View>
      </View>

      {/* メッセージ（エラーまたはヒント） */}
      {hasMessage && (
        <View className="flex-row items-start mt-2 ml-1">
          {status === 'invalid' && (
            <Ionicons name="warning" size={14} color="#ef4444" style={{ marginRight: 4, marginTop: 2 }} />
          )}
          {status === 'valid' && validation?.hint && (
            <Ionicons name="checkmark-circle" size={14} color="#10b981" style={{ marginRight: 4, marginTop: 2 }} />
          )}
          <Text
            className="text-xs"
            style={{
              color: status === 'invalid' ? '#ef4444' : '#64748b',
              flex: 1,
            }}
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
}

/**
 * パスワード強度表示バー
 */
export function PasswordStrengthBar({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getWidth = (): `${number}%` => `${score}%`;

  return (
    <View className="mt-2">
      <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <View
          style={[
            styles.strengthBar,
            {
              width: getWidth(),
              backgroundColor: getColor(),
            },
          ]}
        />
      </View>
    </View>
  );
}

/**
 * ユーザーID入力コンポーネント（プレフィックス付き）
 */
export function UserIdInput({
  value,
  onChangeText,
  validation,
  isValidating,
  error,
  ...props
}: Omit<InputWithValidationProps, 'label'>) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-bold text-slate-700 mb-2 ml-1">ユーザーID</Text>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? '#ef4444' : validation?.isValid ? '#10b981' : '#e2e8f0',
            backgroundColor: error ? '#fef2f2' : '#f8fafc',
          },
        ]}
      >
        {/* @プレフィックス */}
        <View className="px-3 border-r border-slate-300 justify-center">
          <Text className="text-slate-500 font-medium">@</Text>
        </View>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="yamada_taro"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          {...props}
        />

        {/* ステータスアイコン */}
        <View style={styles.rightContainer}>
          {isValidating && <Ionicons name="time-outline" size={20} color="#94a3b8" />}
          {!isValidating && validation?.isValid && (
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          )}
          {!isValidating && validation?.error && (
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
          )}
        </View>
      </View>

      {/* メッセージ */}
      {(error || validation?.error || validation?.hint) && (
        <View className="flex-row items-start mt-2 ml-1">
          {validation?.error && (
            <Ionicons name="warning" size={14} color="#ef4444" style={{ marginRight: 4, marginTop: 2 }} />
          )}
          {validation?.isValid && validation?.hint && (
            <Ionicons name="checkmark-circle" size={14} color="#10b981" style={{ marginRight: 4, marginTop: 2 }} />
          )}
          <Text
            className="text-xs flex-1"
            style={{ color: validation?.error ? '#ef4444' : '#64748b' }}
          >
            {error || validation?.error || validation?.hint}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    padding: 0,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
});
