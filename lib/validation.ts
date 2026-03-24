/**
 * リアルタイムバリデーションライブラリ
 *
 * ユーザー入力に対する即座のフィードバックを提供
 * 機械的な「エラー」ではなく、建設的な「アドバイス」として提示
 */

export interface ValidationResult {
  /** 有効かどうか */
  isValid: boolean;
  /** エラーメッセージ（無効な場合） */
  error?: string;
  /** 補足的なヒント（有効だが改善できる場合） */
  hint?: string;
  /** 検証の強度（weak: 入力不足、medium: 形式不備、strong: 重複など） */
  strength?: 'weak' | 'medium' | 'strong';
}

/**
 * ユーザーIDのバリデーション
 * ルール: 3-20文字、英数字とアンダースコアのみ
 */
export function validateUserId(userId: string): ValidationResult {
  if (!userId) {
    return {
      isValid: false,
      error: 'ユーザーIDを入力してください',
      strength: 'weak',
    };
  }

  if (userId.length < 3) {
    return {
      isValid: false,
      error: 'ユーザーIDは3文字以上にしてください 💪',
      strength: 'weak',
    };
  }

  if (userId.length > 20) {
    return {
      isValid: false,
      error: 'ユーザーIDは20文字以内にしてください',
      strength: 'medium',
    };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(userId)) {
    return {
      isValid: false,
      error: 'ユーザーIDは英数字とアンダースコア（_）のみ使用できます',
      hint: '例: yamada_taro, user123',
      strength: 'medium',
    };
  }

  if (/^[0-9]+$/.test(userId)) {
    return {
      isValid: false,
      error: '数字のみのIDは使用できません',
      hint: '英字を含めてください。例: user123',
      strength: 'medium',
    };
  }

  if (/^_/.test(userId) || /_$/.test(userId)) {
    return {
      isValid: false,
      error: 'ユーザーIDの先頭または末尾にアンダースコアは使用できません',
      strength: 'medium',
    };
  }

  if (/__/.test(userId)) {
    return {
      isValid: false,
      error: 'アンダースコアを連続して使用することはできません',
      strength: 'medium',
    };
  }

  return {
    isValid: true,
    hint: '素晴らしいユーザーIDです！ ✨',
  };
}

/**
 * 名前のバリデーション
 * ルール: 1-50文字、空欄可能
 */
export function validateName(name: string): ValidationResult {
  if (!name) {
    return {
      isValid: true,
      hint: '名前を入力すると、友達が見つけやすくなります 📝',
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: '名前は50文字以内にしてください',
      strength: 'weak',
    };
  }

  if (name.trim().length === 0) {
    return {
      isValid: false,
      error: '名前にスペースのみを入力することはできません',
      strength: 'weak',
    };
  }

  return { isValid: true };
}

/**
 * 自己紹介（bio）のバリデーション
 * ルール: 最大200文字
 */
export function validateBio(bio: string): ValidationResult {
  if (!bio) {
    return { isValid: true };
  }

  if (bio.length > 200) {
    const remaining = bio.length - 200;
    return {
      isValid: false,
      error: `${remaining}文字过长しています`,
      hint: '200文字以内にまとめてみましょう 💡',
      strength: 'weak',
    };
  }

  return { isValid: true };
}

/**
 * メールアドレスのバリデーション
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      error: 'メールアドレスを入力してください',
      strength: 'weak',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: '有効なメールアドレスを入力してください',
      hint: '例: user@example.com',
      strength: 'medium',
    };
  }

  return { isValid: true };
}

/**
 * パスワードのバリデーション
 * ルール: 8文字以上、英数字を含む
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'パスワードを入力してください',
      strength: 'weak',
    };
  }

  if (password.length < 8) {
    const remaining = 8 - password.length;
    return {
      isValid: false,
      error: `パスワードは${remaining}文字以上必要です`,
      hint: '安全なパスワードは8文字以上です 🔒',
      strength: 'weak',
    };
  }

  if (!/[a-zA-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'パスワードに英字を含めてください',
      hint: 'アルファベット（A-Z, a-z）を混ぜると安全です',
      strength: 'medium',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'パスワードに数字を含めてください',
      hint: '数字を混ぜるとより安全になります',
      strength: 'medium',
    };
  }

  // パスワード強度の判定
  if (password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) {
    return {
      isValid: true,
      hint: '非常に強力なパスワードです！ 🛡️',
    };
  }

  if (password.length >= 10) {
    return {
      isValid: true,
      hint: '強力なパスワードです ✨',
    };
  }

  return { isValid: true };
}

/**
 * パスワード確認のバリデーション
 */
export function validatePasswordConfirm(password: string, confirm: string): ValidationResult {
  if (!confirm) {
    return {
      isValid: false,
      error: '確認用パスワードを入力してください',
      strength: 'weak',
    };
  }

  if (password !== confirm) {
    return {
      isValid: false,
      error: 'パスワードが一致しません',
      hint: '同じパスワードをもう一度入力してください',
      strength: 'medium',
    };
  }

  return { isValid: true };
}

/**
 * 誕生日のバリデーション
 */
export function validateBirthday(birthday: Date | null): ValidationResult {
  if (!birthday) {
    return { isValid: true }; // 誕生日は任意
  }

  const now = new Date();
  const age = now.getFullYear() - birthday.getFullYear();

  if (birthday > now) {
    return {
      isValid: false,
      error: '未来の日付は選択できません',
      strength: 'medium',
    };
  }

  if (age > 150) {
    return {
      isValid: false,
      error: '有効な生年月日を入力してください',
      strength: 'medium',
    };
  }

  if (age < 13) {
    return {
      isValid: false,
      error: '13歳未満の方はご利用いただけません',
      strength: 'strong',
    };
  }

  return { isValid: true };
}

/**
 * ユーザーIDの提案（入力されたIDが取られている場合の代替案生成）
 */
export function suggestUserIdAlternatives(userId: string, existingIds: string[]): string[] {
  const alternatives: string[] = [];
  const base = userId.replace(/_[0-9]+$/, ''); // 末尾の数字を除去

  // パターン1: 数字を追加
  for (let i = 1; i <= 9; i++) {
    const suggestion = `${base}${i}`;
    if (!existingIds.includes(suggestion)) {
      alternatives.push(suggestion);
      if (alternatives.length >= 3) break;
    }
  }

  // パターン2: アンダースコア + 数字
  if (alternatives.length < 3) {
    for (let i = 1; i <= 9; i++) {
      const suggestion = `${base}_${i}`;
      if (!existingIds.includes(suggestion)) {
        alternatives.push(suggestion);
        if (alternatives.length >= 3) break;
      }
    }
  }

  // パターン3: ランダムな数字（4桁）
  if (alternatives.length < 3) {
    const random = Math.floor(Math.random() * 9000) + 1000;
    alternatives.push(`${base}${random}`);
  }

  return alternatives.slice(0, 3);
}

/**
 * 入力フィールドのバリデーションステータス
 */
export type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

/**
 * デバウンス付きバリデーション
 * ユーザーが入力を停止してから指定したミリ秒後にバリデーションを実行
 */
export function createDebouncedValidator<T>(
  validator: (value: T) => ValidationResult,
  delay: number = 300
): (value: T) => Promise<ValidationResult> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (value: T): Promise<ValidationResult> => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        resolve(validator(value));
      }, delay);
    });
  };
}

/**
 * 複数のバリデーション結果を結合
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const invalidResults = results.filter((r) => !r.isValid);

  if (invalidResults.length > 0) {
    return invalidResults[0]; // 最初のエラーを返す
  }

  const hints = results.map((r) => r.hint).filter(Boolean) as string[];
  return {
    isValid: true,
    hint: hints[0] || undefined,
  };
}

/**
 * パスワード強度をスコア化（0-100）
 */
export function getPasswordStrengthScore(password: string): number {
  let score = 0;

  // 長さ
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;

  // 文字種
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;

  return Math.min(100, score);
}

/**
 * パスワード強度のラベル
 */
export function getPasswordStrengthLabel(score: number): {
  label: string;
  color: string;
  emoji: string;
} {
  if (score >= 80) {
    return { label: '非常に強力', color: '#10b981', emoji: '🛡️' };
  }
  if (score >= 60) {
    return { label: '強力', color: '#3b82f6', emoji: '🔒' };
  }
  if (score >= 40) {
    return { label: '普通', color: '#f59e0b', emoji: '🔐' };
  }
  return { label: '弱い', color: '#ef4444', emoji: '⚠️' };
}
