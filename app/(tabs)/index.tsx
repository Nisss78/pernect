import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useActionMenu } from '../../lib/contexts/ActionMenuContext';
import { HomeScreen } from '../../features/home/screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();
  const { openMenu } = useActionMenu();
  const { signOut } = useAuth();

  return (
    <HomeScreen
      onStartTest={(slug) => router.push(`/test/${slug}`)}
      onActionPress={openMenu}
      onNavigate={(screen) => {
        switch (screen) {
          case 'profile':
            router.push('/(tabs)/profile');
            break;
          case 'friends':
            router.push('/(tabs)/friends');
            break;
          case 'settings':
            router.push('/settings');
            break;
          case 'test-list':
            break;
        }
      }}
      onSignOut={() => signOut()}
    />
  );
}
