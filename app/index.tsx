import { useAuth } from '@clerk/clerk-expo';
import { Authenticated, AuthLoading, Unauthenticated, useConvexAuth } from 'convex/react';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ActionMenu } from '../components/ActionMenu';
import { HomeScreen } from '../components/HomeScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import { SettingsScreen } from '../components/SettingsScreen';
import { WelcomeScreen } from '../components/WelcomeScreen';

export default function IndexPage() {
  const { signOut, isSignedIn } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [currentTab, setCurrentTab] = useState<'home' | 'profile' | 'settings'>('home');
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

  useEffect(() => {
    console.log('[Index] Clerk isSignedIn:', isSignedIn);
    console.log('[Index] Convex isAuthenticated:', isAuthenticated);
    console.log('[Index] Convex isLoading:', isLoading);
  }, [isSignedIn, isAuthenticated, isLoading]);

  return (
    <>
      <AuthLoading>
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-lg text-gray-500">Loading auth...</Text>
        </View>
      </AuthLoading>

      <Authenticated>
        {currentTab === 'home' ? (
          <HomeScreen
            onSignOut={() => signOut()}
            onNavigate={setCurrentTab}
            onActionPress={() => setIsActionMenuVisible(true)}
          />
        ) : currentTab === 'profile' ? (
          <ProfileScreen
            onNavigate={setCurrentTab}
            onActionPress={() => setIsActionMenuVisible(true)}
          />
        ) : (
          <SettingsScreen
            onNavigate={setCurrentTab}
            onSignOut={() => signOut()}
          />
        )}
        <ActionMenu visible={isActionMenuVisible} onClose={() => setIsActionMenuVisible(false)} />
      </Authenticated>

      <Unauthenticated>
        <WelcomeScreen />
      </Unauthenticated>
    </>
  );
}
