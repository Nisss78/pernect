import { useRouter } from 'expo-router';
import { IntegratedAnalysisScreen } from '../../features/integrated-analysis/screens/IntegratedAnalysisScreen';
import { Id } from '../../convex/_generated/dataModel';

export default function AnalysisRoute() {
  const router = useRouter();

  return (
    <IntegratedAnalysisScreen
      onBack={() => router.back()}
      onAnalysisComplete={(analysisId: Id<"integratedAnalyses">) =>
        router.replace(`/analysis/result/${analysisId}`)
      }
      onViewAnalysis={(analysisId: Id<"integratedAnalyses">) =>
        router.push(`/analysis/result/${analysisId}`)
      }
      onNavigateToPaywall={() => router.push('/settings/paywall' as any)}
    />
  );
}
