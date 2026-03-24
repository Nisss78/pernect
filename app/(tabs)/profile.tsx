import { useRouter } from 'expo-router';
import { useActionMenu } from '../../lib/contexts/ActionMenuContext';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { Id } from '../../convex/_generated/dataModel';

export default function ProfileTab() {
  const router = useRouter();
  const { openMenu } = useActionMenu();

  return (
    <ProfileScreen
      onNavigate={(screen) => {
        switch (screen) {
          case 'home':
            router.push('/(tabs)');
            break;
          case 'friends':
            router.push('/(tabs)/friends');
            break;
          case 'settings':
            router.push('/settings');
            break;
          case 'profile-edit':
            router.push('/profile/edit');
            break;
          case 'integrated-analysis':
            router.push('/analysis');
            break;
        }
      }}
      onActionPress={openMenu}
      onTestResultPress={(testSlug) => router.push(`/test/${testSlug}`)}
      onAnalysisPress={(analysisId: Id<"integratedAnalyses">) =>
        router.push(`/analysis/result/${analysisId}`)
      }
    />
  );
}
