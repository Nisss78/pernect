import { useRouter } from 'expo-router';
import { FriendRequestsScreen } from '../../features/friends/screens/FriendRequestsScreen';

export default function FriendRequestsRoute() {
  const router = useRouter();

  return <FriendRequestsScreen onBack={() => router.back()} />;
}
