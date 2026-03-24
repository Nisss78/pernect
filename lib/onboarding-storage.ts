import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * オンボーディングストレージ
 *
 * 初回ユーザーに親切なガイダンスを提供するための管理機能
 * チュートリアル完了状態、ヒント表示回数などを追跡
 */

const STORAGE_KEY = '@pernect:onboarding';

export interface OnboardingState {
  /** 各機能のチュートリアル完了状態 */
  completedTutorials: {
    /** ホーム画面のチュートリアル完了 */
    home: boolean;
    /** テスト実行のチュートリアル完了 */
    test: boolean;
    /** プロフィール編集のチュートリアル完了 */
    profile: boolean;
    /** 友達機能のチュートリアル完了 */
    friends: boolean;
  };

  /** ヒント表示回数 */
  hintShownCounts: {
    /** テストカードスワイプのヒント表示回数 */
    testCardSwipe: number;
    /** プロフィール編集のヒント表示回数 */
    profileEdit: number;
    /** 友達追加のヒント表示回数 */
    addFriend: number;
  };

  /** 最後に表示したチップ（重複回避用） */
  lastShownTip: string | null;

  /** アプリの初回起動日時 */
  firstLaunchDate: string | null;

  /** ユーザーが最初にテストを完了した日時 */
  firstTestCompletionDate: string | null;
}

const DEFAULT_STATE: OnboardingState = {
  completedTutorials: {
    home: false,
    test: false,
    profile: false,
    friends: false,
  },
  hintShownCounts: {
    testCardSwipe: 0,
    profileEdit: 0,
    addFriend: 0,
  },
  lastShownTip: null,
  firstLaunchDate: null,
  firstTestCompletionDate: null,
};

/**
 * オンボーディング状態を取得
 */
export async function getOnboardingState(): Promise<OnboardingState> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...DEFAULT_STATE, ...JSON.parse(data) };
    }
    return DEFAULT_STATE;
  } catch (error) {
    console.error('[Onboarding] Failed to get state:', error);
    return DEFAULT_STATE;
  }
}

/**
 * オンボーディング状態を保存
 */
export async function saveOnboardingState(state: Partial<OnboardingState>): Promise<void> {
  try {
    const currentState = await getOnboardingState();
    const newState = { ...currentState, ...state };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('[Onboarding] Failed to save state:', error);
  }
}

/**
 * 初回起動かどうかを確認
 */
export async function isFirstLaunch(): Promise<boolean> {
  const state = await getOnboardingState();
  return !state.firstLaunchDate;
}

/**
 * 初回起動を記録
 */
export async function markFirstLaunch(): Promise<void> {
  const state = await getOnboardingState();
  if (!state.firstLaunchDate) {
    await saveOnboardingState({
      firstLaunchDate: new Date().toISOString(),
    });
  }
}

/**
 * チュートリアル完了を記録
 */
export async function markTutorialCompleted(
  tutorial: keyof OnboardingState['completedTutorials']
): Promise<void> {
  const state = await getOnboardingState();
  await saveOnboardingState({
    completedTutorials: {
      ...state.completedTutorials,
      [tutorial]: true,
    },
  });
}

/**
 * 特定のチュートリアルが完了しているかを確認
 */
export async function isTutorialCompleted(
  tutorial: keyof OnboardingState['completedTutorials']
): Promise<boolean> {
  const state = await getOnboardingState();
  return state.completedTutorials[tutorial];
}

/**
 * ヒントを表示すべきかどうかを判定
 * @param hintKey ヒントのキー
 * @param maxShows 最大表示回数（デフォルト: 3回）
 */
export async function shouldShowHint(
  hintKey: keyof OnboardingState['hintShownCounts'],
  maxShows: number = 3
): Promise<boolean> {
  const state = await getOnboardingState();
  const count = state.hintShownCounts[hintKey] || 0;
  return count < maxShows;
}

/**
 * ヒント表示回数をインクリメント
 */
export async function incrementHintCount(
  hintKey: keyof OnboardingState['hintShownCounts']
): Promise<void> {
  const state = await getOnboardingState();
  const currentCount = state.hintShownCounts[hintKey] || 0;
  await saveOnboardingState({
    hintShownCounts: {
      ...state.hintShownCounts,
      [hintKey]: currentCount + 1,
    },
  });
}

/**
 * 最後に表示したチップを記録
 * 重複表示を回避するために使用
 */
export async function markTipShown(tipId: string): Promise<void> {
  await saveOnboardingState({ lastShownTip: tipId });
}

/**
 * 特定のチップが最後に表示されたものかを確認
 */
export async function isLastShownTip(tipId: string): Promise<boolean> {
  const state = await getOnboardingState();
  return state.lastShownTip === tipId;
}

/**
 * 最初のテスト完了を記録
 */
export async function markFirstTestCompletion(): Promise<void> {
  const state = await getOnboardingState();
  if (!state.firstTestCompletionDate) {
    await saveOnboardingState({
      firstTestCompletionDate: new Date().toISOString(),
    });
  }
}

/**
 * ユーザーが最初のテストを完了しているか
 */
export async function hasCompletedFirstTest(): Promise<boolean> {
  const state = await getOnboardingState();
  return !!state.firstTestCompletionDate;
}

/**
 * すべてのチュートリアルを完了としてマーク（開発用）
 */
export async function completeAllTutorials(): Promise<void> {
  await saveOnboardingState({
    completedTutorials: {
      home: true,
      test: true,
      profile: true,
      friends: true,
    },
  });
}

/**
 * オンボーディング状態をリセット（開発用）
 */
export async function resetOnboarding(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/**
 * ユーザーセグメントの判定
 * ユーザーのアクティビティに基づいて適切なガイダンスを提供するために使用
 */
export async function getUserSegment(): Promise<'new' | 'exploring' | 'active'> {
  const state = await getOnboardingState();

  // 新規ユーザー: 初回起動から7日以内かつテスト未完了
  if (state.firstLaunchDate && !state.firstTestCompletionDate) {
    const daysSinceLaunch = Math.floor(
      (Date.now() - new Date(state.firstLaunchDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLaunch < 7) {
      return 'new';
    }
  }

  // アクティブユーザー: テストを1回以上完了
  if (state.firstTestCompletionDate) {
    return 'active';
  }

  // 探索中ユーザー: それ以外
  return 'exploring';
}

/**
 * 次に表示すべきチップを提案
 * ユーザーの状態に基づいて最適なタイミングでチップを表示
 */
export async function getNextTip(
  currentScreen: 'home' | 'test' | 'profile' | 'friends' | 'settings'
): Promise<{
  id: string;
  title: string;
  message: string;
  action?: string;
} | null> {
  const state = await getOnboardingState();
  const userSegment = await getUserSegment();

  // 新規ユーザーへのチップ
  if (userSegment === 'new') {
    switch (currentScreen) {
      case 'home':
        if (!state.completedTutorials.home) {
          return {
            id: 'home_welcome',
            title: 'ようこそ、Pernectへ！🎉',
            message: 'あなたに合うテストから始めてみましょう。カードを左右にスワイプしてテストを見つけてください',
            action: 'テストを見る',
          };
        }
        break;
      case 'test':
        if (!state.completedTutorials.test) {
          return {
            id: 'test_intro',
            title: 'テストに挑戦！💪',
            message: '直感で答えるのがコツ。考えすぎずに、あなたの最初の反応を選んでください',
            action: '始める',
          };
        }
        break;
    }
  }

  // 探索中ユーザーへのチップ
  if (userSegment === 'exploring') {
    switch (currentScreen) {
      case 'home':
        if (await shouldShowHint('testCardSwipe', 2)) {
          await incrementHintCount('testCardSwipe');
          return {
            id: 'card_swipe_hint',
            title: 'ヒント 👆',
            message: 'カードをタップするだけでテストを開始できます',
          };
        }
        break;
      case 'profile':
        if (await shouldShowHint('profileEdit', 2)) {
          await incrementHintCount('profileEdit');
          return {
            id: 'profile_edit_hint',
            title: 'プロフィールを完成させよう ✨',
            message: 'MBTIや誕生日を設定すると、あなたにぴったりの分析が受けられます',
            action: '編集する',
          };
        }
        break;
      case 'friends':
        if (await shouldShowHint('addFriend', 2)) {
          await incrementHintCount('addFriend');
          return {
            id: 'add_friend_hint',
            title: '友達と一緒に 🔗',
            message: '友達と結果を共有して、お互いの性格を比較してみましょう',
            action: '友達を追加',
          };
        }
        break;
    }
  }

  // アクティブユーザーへのチップ
  if (userSegment === 'active') {
    switch (currentScreen) {
      case 'home':
        return {
          id: 'new_test_available',
          title: '新しいテストが登場！🆕',
          message: '最近追加されたテストで、新たな発見があるかもしれません',
          action: '見る',
        };
      case 'profile':
        if (!state.completedTutorials.profile) {
          return {
            id: 'profile_insight',
            title: '自分を知ろう 🧠',
            message: 'プロフィール画面で、これまでの診断結果を振り返ることができます',
            action: '見る',
          };
        }
        break;
    }
  }

  return null;
}

/**
 * オンボーディング完了率を計算
 * デバッグ・分析用
 */
export async function getOnboardingProgress(): Promise<{
  completed: number;
  total: number;
  percentage: number;
}> {
  const state = await getOnboardingState();
  const tutorials = Object.values(state.completedTutorials);
  const completed = tutorials.filter(Boolean).length;
  const total = tutorials.length;
  const percentage = Math.round((completed / total) * 100);

  return { completed, total, percentage };
}
