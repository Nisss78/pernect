import { useRouter } from 'expo-router';
import { AddFriendScreen } from '../../features/friends/screens/AddFriendScreen';

export default function AddFriendRoute() {
  const router = useRouter();

  return (
    <AddFriendScreen
      onBack={() => router.back()}
      onUserFound={(userId) => router.push(`/friends/${userId}`)}
    />
  );
}
