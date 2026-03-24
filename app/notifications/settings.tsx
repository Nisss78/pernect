import { useRouter } from 'expo-router';
import { NotificationSettingsScreen } from '../../features/notifications/screens/NotificationSettingsScreen';

export default function NotificationSettingsRoute() {
  const router = useRouter();

  return <NotificationSettingsScreen onBack={() => router.back()} />;
}
