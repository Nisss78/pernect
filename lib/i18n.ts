import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Expo SDK',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      emailPlaceholder: 'Email...',
      passwordPlaceholder: 'Password...',
      loggedIn: 'You are logged in!',
      loadingAuth: 'Loading auth...',
      signInContinue: 'Please sign in to continue',
      verifyEmail: 'Verify Email',
      codePlaceholder: 'Code...',
      noAccount: "Don't have an account?",
    },
  },
  ja: {
    translation: {
      welcome: 'Expo SDKへようこそ',
      signIn: 'ログイン',
      signUp: '新規登録',
      signOut: 'ログアウト',
      emailPlaceholder: 'メールアドレス...',
      passwordPlaceholder: 'パスワード...',
      loggedIn: 'ログイン済みです！',
      loadingAuth: '認証情報を読み込み中...',
      signInContinue: '続けるにはログインしてください',
      verifyEmail: 'メールアドレスを確認',
      codePlaceholder: '確認コード...',
      noAccount: 'アカウントをお持ちでないですか？',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0].languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;