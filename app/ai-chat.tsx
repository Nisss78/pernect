import { useRouter } from 'expo-router';
import { AIChatScreen } from '../features/ai-chat/screens/AIChatScreen';

export default function AIChatRoute() {
  const router = useRouter();

  return <AIChatScreen onBack={() => router.back()} />;
}
