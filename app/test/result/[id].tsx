import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { TestResultScreen } from '../../../features/tests/screens/TestResultScreen';
import { Id } from '../../../convex/_generated/dataModel';

export default function TestResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <TestResultScreen
      resultId={id as Id<"testResults">}
      onBack={() => router.back()}
      onRetakeTest={(testSlug: string) => router.replace(`/test/${testSlug}`)}
    />
  );
}
