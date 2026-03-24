import { useRouter } from 'expo-router';
import { FriendsListScreen } from '../../features/friends/screens/FriendsListScreen';

export default function FriendsListRoute() {
  const router = useRouter();

  return (
    <FriendsListScreen
      onBack={() => router.back()}
      onFriendPress={(friendId) => router.push(`/friends/${friendId}`)}
      onAnalysisPress={(friendId) => router.push(`/friends/analysis/${friendId}`)}
      onRequestsPress={() => router.push('/friends/requests')}
      onAddFriendPress={() => router.push('/friends/add')}
    />
  );
}
