import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient, useConvexAuth, useMutation, useQuery } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { api } from "../convex/_generated/api";
import "../global.css";
import { tokenCache } from "../lib/auth";
import "../lib/i18n"; // Initialize i18n
import { registerForPushNotificationsAsync } from "../lib/notifications";
import { ActionMenuProvider, useActionMenu } from "../lib/contexts/ActionMenuContext";
import { SubscriptionProvider } from "../lib/contexts/SubscriptionContext";
import { ActionMenu } from "../features/common/components/ActionMenu";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

function GlobalActionMenu() {
  const { isVisible, closeMenu } = useActionMenu();
  const router = useRouter();

  return (
    <ActionMenu
      visible={isVisible}
      onClose={closeMenu}
      onNavigate={(screen) => {
        closeMenu();
        switch (screen) {
          case 'ai-chat':
            router.push('/ai-chat');
            break;
          case 'friends-match':
            router.push('/(tabs)/friends');
            break;
          case 'integrated-analysis':
            router.push('/analysis');
            break;
          case 'notifications':
            router.push('/notifications');
            break;
          case 'notification-settings':
            router.push('/notifications/settings');
            break;
        }
      }}
    />
  );
}

function RootLayoutNav() {
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const { isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const storeUser = useMutation(api.users.store);
  const router = useRouter();
  const currentUser = useQuery(
    api.users.current,
    isAuthenticated ? {} : "skip"
  );

  const [isUserSynced, setIsUserSynced] = useState(false);
  const storeUserRef = useRef(storeUser);
  storeUserRef.current = storeUser;

  useEffect(() => {
    let cancelled = false;

    if (isAuthenticated) {
      const syncUser = async () => {
        let token: string | undefined;
        try {
          token = await registerForPushNotificationsAsync();
        } catch (e) {
          console.error("Error getting push token:", e);
        }
        if (cancelled) return;
        try {
          // Push token取得の成否に関わらず、ユーザー情報の同期（userId自動生成など）を実行
          await storeUserRef.current({ pushToken: token });
          if (!cancelled) {
            setIsUserSynced(true);
          }
        } catch (e) {
          console.error("Error syncing user:", e);
          // storeUser失敗でもsync済みとしてマーク（既存ユーザーならcurrentUserで取得可能）
          if (!cancelled) {
            setIsUserSynced(true);
          }
        }
      };

      syncUser();
    } else {
      setIsUserSynced(false);
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // Clerkがまだロード中の場合
  if (!isClerkLoaded || isConvexLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-lg text-gray-500 mt-4">読み込み中...</Text>
      </View>
    );
  }

  // 未認証の場合は認証画面へリダイレクト
  if (!isSignedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    );
  }

  // ユーザーデータ読み込み中、またはstoreUser未完了でDBにユーザーが未作成
  if (currentUser === undefined || (currentUser === null && !isUserSynced)) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-lg text-gray-500 mt-4">読み込み中...</Text>
      </View>
    );
  }

  // オンボーディング未完了: onboardingCompleted === false
  // 既存ユーザー (onboardingCompleted === undefined) は完了済みとして扱う
  const needsOnboarding = currentUser !== null && currentUser.onboardingCompleted === false;

  if (needsOnboarding) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(onboarding)"
            options={{ gestureEnabled: false }}
          />
        </Stack>
        <Toaster />
      </>
    );
  }

  return (
    <SubscriptionProvider
      userId={currentUser?._id ?? null}
      isAuthenticated={isAuthenticated}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="test" />
        <Stack.Screen name="friends" />
        <Stack.Screen name="analysis" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="notifications" />
        <Stack.Screen
          name="ai-chat"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <GlobalActionMenu />
      <Toaster />
    </SubscriptionProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <ActionMenuProvider>
            <RootLayoutNav />
          </ActionMenuProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
