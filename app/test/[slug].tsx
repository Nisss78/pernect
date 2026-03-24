import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { TestScreen } from '../../features/tests/screens/TestScreen';

export default function TestRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  if (!slug) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <TestScreen
      testSlug={slug}
      onBack={() => router.back()}
      onComplete={(resultId) => router.replace(`/test/result/${resultId}`)}
    />
  );
}
