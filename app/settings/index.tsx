import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';

export default function SettingsRoute() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <SettingsScreen
      onNavigate={(screen) => {
        switch (screen) {
          case 'home':
            router.push('/(tabs)');
            break;
          case 'profile':
            router.push('/(tabs)/profile');
            break;
          case 'profile-edit':
            router.push('/profile/edit');
            break;
          case 'subscription':
            router.push('/settings/subscription' as any);
            break;
        }
      }}
      onSignOut={async () => {
        try {
          await signOut();
          router.replace('/(auth)/sign-in');
        } catch (e) {
          console.error('Sign out error:', e);
        }
      }}
    />
  );
}
