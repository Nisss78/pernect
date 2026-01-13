import { useAuth } from '@clerk/clerk-expo';
import { useConvexAuth } from 'convex/react';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { ActionMenu } from '../features/common/components/ActionMenu';
import { AIChatScreen } from '../features/ai-chat/screens/AIChatScreen';
import { FriendsMatchScreen } from '../features/friends/screens/FriendsMatchScreen';
import { FriendsListScreen } from '../features/friends/screens/FriendsListScreen';
import { FriendRequestsScreen } from '../features/friends/screens/FriendRequestsScreen';
import { AddFriendScreen } from '../features/friends/screens/AddFriendScreen';
import { FriendProfileScreen } from '../features/friends/screens/FriendProfileScreen';
import { FriendAnalysisScreen } from '../features/friends/screens/FriendAnalysisScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { IntegratedAnalysisScreen } from '../features/integrated-analysis/screens/IntegratedAnalysisScreen';
import { AnalysisResultScreen } from '../features/integrated-analysis/screens/AnalysisResultScreen';
import { ProfileEditScreen } from '../features/profile/screens/ProfileEditScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { TestListScreen } from '../features/tests/screens/TestListScreen';
import { TestResultScreen } from '../features/tests/screens/TestResultScreen';
import { TestScreen } from '../features/tests/screens/TestScreen';
import { WelcomeScreen } from '../features/welcome/screens/WelcomeScreen';
import { Id } from '../convex/_generated/dataModel';

type Screen = 'home' | 'profile' | 'settings' | 'ai-chat' | 'friends-match' | 'friends-list' | 'friend-requests' | 'add-friend' | 'friend-profile' | 'friend-analysis' | 'integrated-analysis' | 'analysis-result' | 'profile-edit' | 'test-list' | 'test' | 'test-result';

export default function IndexPage() {
  const { signOut, isSignedIn, isLoaded: isClerkLoaded } = useAuth();
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isActionMenuVisible, setIsActionMenuVisible] = useState(false);

  // 診断テスト用のstate
  const [currentTestSlug, setCurrentTestSlug] = useState<string | null>(null);
  const [currentResultId, setCurrentResultId] = useState<Id<"testResults"> | null>(null);

  // 統合分析用のstate
  const [currentAnalysisId, setCurrentAnalysisId] = useState<Id<"integratedAnalyses"> | null>(null);

  // 友達機能用のstate
  const [currentFriendId, setCurrentFriendId] = useState<Id<"users"> | null>(null);

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

  const handleNavigateFromMenu = (screen: 'ai-chat' | 'friends-match' | 'integrated-analysis') => {
    setCurrentScreen(screen);
  };

  // 統合分析用のハンドラー
  const handleAnalysisComplete = (analysisId: Id<"integratedAnalyses">) => {
    setCurrentAnalysisId(analysisId);
    setCurrentScreen('analysis-result');
  };

  const handleViewAnalysis = (analysisId: Id<"integratedAnalyses">) => {
    setCurrentAnalysisId(analysisId);
    setCurrentScreen('analysis-result');
  };

  const handleBackFromAnalysisResult = () => {
    setCurrentAnalysisId(null);
    setCurrentScreen('integrated-analysis');
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

  // 友達機能用のハンドラー
  const handleFriendPress = (friendId: Id<"users">) => {
    setCurrentFriendId(friendId);
    setCurrentScreen('friend-profile');
  };

  const handleFriendAnalysisPress = (friendId: Id<"users">) => {
    setCurrentFriendId(friendId);
    setCurrentScreen('friend-analysis');
  };

  const handleBackToFriendsMatch = () => {
    setCurrentFriendId(null);
    setCurrentScreen('friends-match');
  };

  const renderOtherScreens = () => {
    switch (currentScreen) {
      case 'ai-chat':
        return <AIChatScreen onBack={handleBackToMain} />;
      case 'friends-match':
        return (
          <FriendsMatchScreen
            onBack={handleBackToMain}
            onFriendsListPress={() => setCurrentScreen('friends-list')}
            onRequestsPress={() => setCurrentScreen('friend-requests')}
            onAddFriendPress={() => setCurrentScreen('add-friend')}
            onFriendPress={handleFriendPress}
            onAnalysisPress={handleFriendAnalysisPress}
          />
        );
      case 'friends-list':
        return (
          <FriendsListScreen
            onBack={handleBackToFriendsMatch}
            onFriendPress={handleFriendPress}
            onAnalysisPress={handleFriendAnalysisPress}
            onRequestsPress={() => setCurrentScreen('friend-requests')}
            onAddFriendPress={() => setCurrentScreen('add-friend')}
          />
        );
      case 'friend-requests':
        return (
          <FriendRequestsScreen onBack={handleBackToFriendsMatch} />
        );
      case 'add-friend':
        return (
          <AddFriendScreen onBack={handleBackToFriendsMatch} />
        );
      case 'friend-profile':
        return currentFriendId ? (
          <FriendProfileScreen
            friendId={currentFriendId}
            onBack={handleBackToFriendsMatch}
            onAnalysisPress={handleFriendAnalysisPress}
          />
        ) : (
          <FriendsListScreen
            onBack={handleBackToFriendsMatch}
            onFriendPress={handleFriendPress}
            onAnalysisPress={handleFriendAnalysisPress}
            onRequestsPress={() => setCurrentScreen('friend-requests')}
            onAddFriendPress={() => setCurrentScreen('add-friend')}
          />
        );
      case 'friend-analysis':
        return currentFriendId ? (
          <FriendAnalysisScreen
            friendId={currentFriendId}
            onBack={handleBackToFriendsMatch}
          />
        ) : (
          <FriendsListScreen
            onBack={handleBackToFriendsMatch}
            onFriendPress={handleFriendPress}
            onAnalysisPress={handleFriendAnalysisPress}
            onRequestsPress={() => setCurrentScreen('friend-requests')}
            onAddFriendPress={() => setCurrentScreen('add-friend')}
          />
        );
      case 'integrated-analysis':
        return (
          <IntegratedAnalysisScreen
            onBack={handleBackToMain}
            onAnalysisComplete={handleAnalysisComplete}
            onViewAnalysis={handleViewAnalysis}
          />
        );
      case 'analysis-result':
        return currentAnalysisId ? (
          <AnalysisResultScreen
            analysisId={currentAnalysisId}
            onBack={handleBackFromAnalysisResult}
          />
        ) : (
          <IntegratedAnalysisScreen
            onBack={handleBackToMain}
            onAnalysisComplete={handleAnalysisComplete}
            onViewAnalysis={handleViewAnalysis}
          />
        );
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
            onBack={() => setCurrentScreen('profile')}
          />
        );
      default:
        return null;
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
      <View className="flex-1">
        {/* Keep Home and Profile mounted to cache data and UI state */}
        <View style={{ flex: 1, display: currentScreen === 'home' ? 'flex' : 'none' }}>
          <HomeScreen
            onSignOut={() => signOut()}
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
            onStartTest={handleStartTest}
          />
        </View>
        <View style={{ flex: 1, display: currentScreen === 'profile' ? 'flex' : 'none' }}>
          <ProfileScreen
            onNavigate={(screen) => setCurrentScreen(screen as Screen)}
            onActionPress={() => setIsActionMenuVisible(true)}
            onAnalysisPress={handleViewAnalysis}
          />
        </View>

        {/* Other screens rendered on demand */}
        {currentScreen !== 'home' && currentScreen !== 'profile' && renderOtherScreens()}
      </View>

      <ActionMenu
        visible={isActionMenuVisible}
        onClose={() => setIsActionMenuVisible(false)}
        onNavigate={handleNavigateFromMenu}
      />
    </>
  );
}
