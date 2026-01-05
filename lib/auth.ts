import { TokenCache } from '@clerk/clerk-expo/dist/cache';
import * as SecureStore from 'expo-secure-store';

// デバッグ用: 全トークンをクリア
export const clearAllTokens = async () => {
  const keys = ['__clerk_client_jwt', '__clerk_session_jwt', '__clerk_session_id'];
  for (const key of keys) {
    try {
      await SecureStore.deleteItemAsync(key);
      console.log(`Cleared: ${key}`);
    } catch (e) {
      console.log(`Failed to clear: ${key}`);
    }
  }
};

export const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};