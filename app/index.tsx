import { useAuth } from '@clerk/clerk-expo';
import { Authenticated, AuthLoading, Unauthenticated, useConvexAuth } from 'convex/react';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ActionMenu } from '../components/ActionMenu';
import { AIChatScreen } from '../components/AIChatScreen';
import { FriendsMatchScreen } from '../components/FriendsMatchScreen';
import { HomeScreen } from '../components/HomeScreen';
import { ProfileEditScreen } from '../components/ProfileEditScreen';
import { ProfileScreen } from '../components/ProfileScreen';
import { SettingsScreen } from '../components/SettingsScreen';
import { TestListScreen } from '../components/TestListScreen';
import { TestResultScreen } from '../components/TestResultScreen';
import { TestScreen } from '../components/TestScreen';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { Id } from '../convex/_generated/dataModel';

type Screen = 'home' | 'profile' | 'settings' | 'ai-chat' | 'friends-match' | 'profile-edit' | 'test-list' | 'test' | 'test-result';

export default function IndexPage() {
  const { signOut, isSignedIn } = useAuth();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

  // 診断テスト用のstate
  const [currentTestSlug, setCurrentTestSlug] = useState<string | null>(null);
  const [currentResultId, setCurrentResultId] = useState<Id<"testResults"> | null>(null);

  useEffect(() => {
    console.log('[Index] Clerk isSignedIn:', isSignedIn);
    console.log('[Index] Convex isAuthenticated:', isAuthenticated);
    console.log('[Index] Convex isLoading:', isLoading);
  }, [isSignedIn, isAuthenticated, isLoading]);

  const handleNavigateFromMenu = (screen: 'ai-chat' | 'friends-match') => {
    setCurrentScreen(screen);
  };

  const handleBackToMain = () => {
    setCurrentScreen('home');
  };

  // 診断テスト用のハンドラー
  const handleStartTest = (testSlug: string) => {
    setCurrentTestSlug(testSlug);
    setCurrentScreen('test');
  };

  const handleTestComplete = (resultId: Id<"testResults">) => {
    setCurrentResultId(resultId);
    setCurrentScreen('test-result');
  };

  const handleRetakeTest = (testSlug: string) => {
    setCurrentTestSlug(testSlug);
    setCurrentScreen('test');
  };

  const handleBackToTestList = () => {
    setCurrentTestSlug(null);
    setCurrentResultId(null);
    setCurrentScreen('test-list');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'ai-chat':
        return <AIChatScreen onBack={handleBackToMain} />;
      case 'friends-match':
        return <FriendsMatchScreen onBack={handleBackToMain} />;
      case 'test-list':
        return (
          <TestListScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
            onStartTest={handleStartTest}
          />
        );
      case 'test':
        return currentTestSlug ? (
          <TestScreen
            testSlug={currentTestSlug}
            onBack={handleBackToTestList}
            onComplete={handleTestComplete}
          />
        ) : (
          <TestListScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
            onStartTest={handleStartTest}
          />
        );
      case 'test-result':
        return currentResultId ? (
          <TestResultScreen
            resultId={currentResultId}
            onBack={handleBackToTestList}
            onRetakeTest={handleRetakeTest}
          />
        ) : (
          <TestListScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
            onStartTest={handleStartTest}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onNavigate={(screen) => setCurrentScreen(screen)}
            onSignOut={() => signOut()}
          />
        );
      case 'profile-edit':
        return (
          <ProfileEditScreen
            onBack={() => setCurrentScreen('settings')}
          />
        );
      case 'home':
      default:
        return (
          <HomeScreen
            onSignOut={() => signOut()}
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
          />
        );
    }
  };

  return (
    <>
      <AuthLoading>
        <View className="flex-1 items-center justify-center bg-white">
          <Text className="text-lg text-gray-500">Loading auth...</Text>
        </View>
      </AuthLoading>

      <Authenticated>
        {renderScreen()}
        <ActionMenu
          visible={isActionMenuVisible}
          onClose={() => setIsActionMenuVisible(false)}
          onNavigate={handleNavigateFromMenu}
        />
      </Authenticated>

      <Unauthenticated>
        <WelcomeScreen />
      </Unauthenticated>
    </>
  );
}
