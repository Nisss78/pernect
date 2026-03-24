import { useRouter } from 'expo-router';
import { useActionMenu } from '../../lib/contexts/ActionMenuContext';
import { FriendsMatchScreen } from '../../features/friends/screens/FriendsMatchScreen';

export default function FriendsTab() {
  const router = useRouter();
  const { openMenu } = useActionMenu();

  return (
    <FriendsMatchScreen
      onBack={() => router.push('/(tabs)')}
      onNavigate={(screen) => {
        switch (screen) {
          case 'home':
            router.push('/(tabs)');
            break;
          case 'profile':
            router.push('/(tabs)/profile');
            break;
          case 'friends':
            break;
        }
      }}
      onActionPress={openMenu}
      onFriendsListPress={() => router.push('/friends/list')}
      onRequestsPress={() => router.push('/friends/requests')}
      onAddFriendPress={() => router.push('/friends/add')}
      onFriendPress={(friendId) => router.push(`/friends/${friendId}`)}
      onAnalysisPress={(friendId) => router.push(`/friends/analysis/${friendId}`)}
    />
  );
}
