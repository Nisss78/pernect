import { useRouter } from "expo-router";
import { PaywallScreen } from "../../features/premium/screens/PaywallScreen";

export default function PaywallRoute() {
  const router = useRouter();

  return (
    <PaywallScreen
      onBack={() => router.back()}
      onSuccess={() => router.back()}
    />
  );
}
