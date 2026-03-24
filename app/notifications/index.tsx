import { useRouter } from 'expo-router';
import { NotificationListScreen } from '../../features/notifications/screens/NotificationListScreen';

export default function NotificationsRoute() {
  const router = useRouter();

  return <NotificationListScreen onBack={() => router.back()} />;
}
