import { toast } from 'sonner-native';

/**
 * ユーザーフレンドリーなトースト通知ヘルパー
 *
 * 設計原則:
 * - 機械的な表現を避ける（"失敗しました" → "うまくいきませんでした"）
 * - 解決策を提案する（"もう一度お試しください"）
 * - 絵文字で温かみを加える（💫, ✨, 🎉）
 * - 具体的な状況を伝える（何を、どうすればよいか）
 */

export const toastHelpers = {
  /**
   * 認証関連のトースト
   */
  auth: {
    // サインイン失敗
    signInFailed: (error?: string) => {
      toast.error('ログインできませんでした', {
        description: error ?? 'メールアドレスとパスワードをもう一度確認してみてください',
      });
    },

    // サインアップ失敗
    signUpFailed: (error?: string) => {
      toast.error('アカウントを作成できませんでした', {
        description: error ?? '入力内容を確認して、もう一度お試しください',
      });
    },

    // セッション期限切れ
    sessionExpired: () => {
      toast.error('セッションの有効期限が切れました', {
        description: '再度ログインしてください',
      });
    },

    // OAuth認証失敗
    oauthFailed: (provider: string) => {
      toast.error(`${provider}でログインできませんでした`, {
        description: '別の認証方法をお試しいただくか、少し時間をおいてから再度お試しください',
      });
    },

    // 認証キャンセル
    authCancelled: () => {
      toast('ログインがキャンセルされました', {
        description: 'またのご利用をお待ちしております ✨',
      });
    },

    // 汎用infoトースト
    info: (message: string, description?: string) => {
      toast(message, { description });
    },

    // ログアウト成功
    signedOut: () => {
      toast.success('ログアウトしました', {
        description: 'またのご利用をお待ちしております 🎉',
      });
    },
  },

  /**
   * データ保存関連のトースト
   */
  save: {
    // 保存成功
    success: (item: string) => {
      toast.success(`${item}を保存しました`, {
        description: '変更が反映されました ✨',
      });
    },

    // 保存失敗
    failed: (context: string) => {
      toast.error(`${context}を保存できませんでした`, {
        description: 'インターネット接続を確認して、もう一度お試しください',
      });
    },

    // 保存中
    saving: (item: string) => {
      toast.loading(`${item}を保存中です...`, {
        description: 'もう少しお待ちください 💫',
      });
    },
  },

  /**
   * データ読み込み関連のトースト
   */
  load: {
    // 読み込み失敗
    failed: (context: string) => {
      toast.error(`${context}を読み込めませんでした`, {
        description: 'インターネット接続を確認して、ページを更新してみてください',
      });
    },

    // ネットワークエラー
    networkError: () => {
      toast.error('インターネット接続がありません', {
        description: 'オフラインのようです。接続を確認してもう一度お試しください 📶',
      });
    },

    // タイムアウト
    timeout: () => {
      toast.error('時間がかかりすぎています', {
        description: '通信環境が良い場所で再度お試しください ⏱️',
      });
    },
  },

  /**
   * フレンド（友達）機能関連のトースト
   */
  friends: {
    // 友達追加成功
    added: (name: string) => {
      toast.success(`${name}さんを友達に追加しました 🎉`, {
        description: 'これで一緒に診断結果を見られますね',
      });
    },

    // 友達追加失敗
    addFailed: () => {
      toast.error('友達を追加できませんでした', {
        description: 'ユーザーIDを確認して、もう一度お試しください',
      });
    },

    // 友達が見つからない
    notFound: () => {
      toast.error('ユーザーが見つかりませんでした', {
        description: 'IDを正しく入力しているか確認してみてください 🔍',
      });
    },

    // 既に友達
    alreadyFriends: () => {
      toast.info('すでに友達です', {
        description: 'このユーザーはすでに友達リストに登録されています 👋',
      });
    },

    // 自分自身を追加しようとした
    cannotAddSelf: () => {
      toast.info('自分自身を追加することはできません', {
        description: 'もしあなたの友達を探したいなら、友達にIDを教えてもらいましょう！',
      });
    },
  },

  /**
   * プロフィール関連のトースト
   */
  profile: {
    // 更新成功
    updated: () => {
      toast.success('プロフィールを更新しました ✨', {
        description: '新しい情報が反映されました',
      });
    },

    // 更新失敗
    updateFailed: (field: string) => {
      toast.error(`${field}を更新できませんでした`, {
        description: '入力内容を確認して、もう一度お試しください',
      });
    },

    // 画像アップロード成功
    imageUploaded: () => {
      toast.success('プロフィール画像を変更しました 📸', {
        description: '素敵な写真ですね！',
      });
    },

    // 画像アップロード失敗
    imageUploadFailed: () => {
      toast.error('画像をアップロードできませんでした', {
        description: '別の画像を選んでみてください',
      });
    },
  },

  /**
   * テスト・診断関連のトースト
   */
  test: {
    // 完了
    completed: (title: string) => {
      toast.success(`${title}を完了しました 🎉`, {
        description: '結果を見てみましょう！',
      });
    },

    // 保存成功
    resultSaved: () => {
      toast.success('結果を保存しました ✨', {
        description: '「マイページ」からいつでも見られます',
      });
    },

    // 開始失敗
    startFailed: () => {
      toast.error('テストを開始できませんでした', {
        description: '少し時間をおいてから再度お試しください',
      });
    },

    // 回答保存失敗
    saveAnswerFailed: () => {
      toast.error('回答を保存できませんでした', {
        description: 'インターネット接続を確認して、もう一度回答してください',
      });
    },
  },

  /**
   * 設定関連のトースト
   */
  settings: {
    // 通知設定更新
    notificationUpdated: (enabled: boolean) => {
      if (enabled) {
        toast.success('通知をオンにしました 🔔', {
          description: '最新情報をお届けします',
        });
      } else {
        toast.success('通知をオフにしました', {
          description: '必要な場合は設定から再度オンにできます',
        });
      }
    },

    // 言語変更
    languageChanged: (language: string) => {
      toast.success(`言語を${language}に変更しました 🌐`, {
        description: '変更が適用されました',
      });
    },
  },

  /**
   * プレミアム機能関連のトースト
   */
  premium: {
    // サブスクリプション開始
    subscribed: (plan: string) => {
      toast.success(`${plan}プランに加入しました 🎉`, {
        description: 'すべてのプレミアム機能が利用できます',
      });
    },

    // 購入失敗
    purchaseFailed: () => {
      toast.error('購入を完了できませんでした', {
        description: '決済情報を確認して、もう一度お試しください',
      });
    },

    // プレミアム機能へのアクセス拒否
    premiumRequired: () => {
      toast.error('この機能はプレミアムプランのみです ⭐', {
        description: 'プランをアップグレードして、すべての機能を解放しましょう',
        action: {
          label: 'プランを見る',
          onClick: () => {
            // プラン画面へ遷移
          },
        },
      });
    },

    // キャンセル完了
    cancelled: () => {
      toast.success('サブスクリプションをキャンセルしました', {
        description: '期間終了までプレミアム機能をご利用いただけます',
      });
    },
  },

  /**
   * その他の共通トースト
   */
  common: {
    // 成功
    success: (message: string, description?: string) => {
      toast.success(message, { description });
    },

    // エラー
    error: (message: string, description?: string) => {
      toast.error(message, { description });
    },

    // 情報
    info: (message: string, description?: string) => {
      toast.info(message, { description });
    },

    // 予期しないエラー
    unexpectedError: () => {
      toast.error('予期しないエラーが発生しました', {
        description: '問題が解決しない場合は、サポートまでお問い合わせください 🛠️',
      });
    },

    // 機能開発中
    comingSoon: (feature: string) => {
      toast.info(`${feature}はまもなく登場です 🔜`, {
        description: '楽しみにお待ちください！',
      });
    },
  },
};
