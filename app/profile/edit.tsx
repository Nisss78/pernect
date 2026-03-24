import { useRouter } from 'expo-router';
import { ProfileEditScreen } from '../../features/profile/screens/ProfileEditScreen';

export default function ProfileEditRoute() {
  const router = useRouter();

  return <ProfileEditScreen onBack={() => router.back()} />;
}
