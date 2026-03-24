import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { FriendAnalysisScreen } from '../../../features/friends/screens/FriendAnalysisScreen';
import { Id } from '../../../convex/_generated/dataModel';

export default function FriendAnalysisRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) {
    return <Redirect href="/(tabs)/friends" />;
  }

  return (
    <FriendAnalysisScreen
      friendId={id as Id<"users">}
      onBack={() => router.back()}
    />
  );
}
