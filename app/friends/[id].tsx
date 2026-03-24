import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { FriendProfileScreen } from '../../features/friends/screens/FriendProfileScreen';
import { Id } from '../../convex/_generated/dataModel';

export default function FriendProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) {
    return <Redirect href="/(tabs)/friends" />;
  }

  return (
    <FriendProfileScreen
      friendId={id as Id<"users">}
      onBack={() => router.back()}
      onAnalysisPress={(friendId) => router.push(`/friends/analysis/${friendId}`)}
    />
  );
}
