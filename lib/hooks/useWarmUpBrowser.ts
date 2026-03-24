import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

/**
 * Android向けブラウザウォームアップフック
 * OAuth認証のブラウザ起動を高速化する
 */
export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Androidのみ実行
    if (Platform.OS !== 'android') return;

    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};
