import { useRouter } from "expo-router";
import { SubscriptionManageScreen } from "../../features/premium/screens/SubscriptionManageScreen";

export default function SubscriptionRoute() {
  const router = useRouter();

  return (
    <SubscriptionManageScreen
      onBack={() => router.back()}
      onNavigateToPaywall={() => router.push("/settings/paywall" as any)}
    />
  );
}
