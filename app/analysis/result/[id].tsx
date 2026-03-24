import { useLocalSearchParams, useRouter, Redirect } from 'expo-router';
import { AnalysisResultScreen } from '../../../features/integrated-analysis/screens/AnalysisResultScreen';
import { Id } from '../../../convex/_generated/dataModel';

export default function AnalysisResultRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!id) {
    return <Redirect href="/analysis" />;
  }

  return (
    <AnalysisResultScreen
      analysisId={id as Id<"integratedAnalyses">}
      onBack={() => router.back()}
    />
  );
}
