import { useAuth } from '@clerk/clerk-expo';
import { useConvexAuth } from 'convex/react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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
  const { signOut, isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

  // 診断テスト用のstate
  const [currentTestSlug, setCurrentTestSlug] = useState<string | null>(null);
  const [currentResultId, setCurrentResultId] = useState<Id<"testResults"> | null>(null);

  useEffect(() => {
    console.log('[Index] Clerk isSignedIn:', isSignedIn, 'isClerkLoaded:', isClerkLoaded);
    console.log('[Index] Convex isAuthenticated:', isAuthenticated, 'isConvexLoading:', isConvexLoading);
  }, [isSignedIn, isClerkLoaded, isAuthenticated, isConvexLoading]);

  // Clerkがまだロード中の場合
  if (!isClerkLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-lg text-gray-500 mt-4">読み込み中...</Text>
      </View>
    );
  }

  // Clerkでログイン済みだがConvexがまだ同期中の場合
  if (isSignedIn && !isAuthenticated && isConvexLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text className="text-lg text-gray-500 mt-4">認証を同期中...</Text>
      </View>
    );
  }

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

  // Clerkの認証状態を基準に判定（Convexより優先）
  // isSignedIn: Clerkでログイン済み
  // isAuthenticated: Convexで認証済み
  const isUserAuthenticated = isSignedIn || isAuthenticated;

  if (!isUserAuthenticated) {
    return <WelcomeScreen />;
  }

  return (
    <>
      {renderScreen()}
      <ActionMenu
        visible={isActionMenuVisible}
        onClose={() => setIsActionMenuVisible(false)}
        onNavigate={handleNavigateFromMenu}
      />
    </>
  );
}
