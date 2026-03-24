import { useState, useCallback } from "react";
import { useSubscription } from "../contexts/SubscriptionContext";
import type { Tier } from "../subscription-config";

interface UseUpgradePromptResult {
  tier: Tier;
  isPremium: boolean;
  showUpgradeModal: boolean;
  featureName: string;
  /** Premium機能へのアクセスを試行。freeならモーダル表示してfalse返す */
  checkAccess: (featureName: string) => boolean;
  dismissModal: () => void;
}

export function useUpgradePrompt(): UseUpgradePromptResult {
  const { tier } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [featureName, setFeatureName] = useState("");

  const checkAccess = useCallback(
    (feature: string): boolean => {
      if (tier === "premium") return true;
      setFeatureName(feature);
      setShowUpgradeModal(true);
      return false;
    },
    [tier]
  );

  const dismissModal = useCallback(() => {
    setShowUpgradeModal(false);
  }, []);

  return {
    tier,
    isPremium: tier === "premium",
    showUpgradeModal,
    featureName,
    checkAccess,
    dismissModal,
  };
}
