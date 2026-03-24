/**
 * RevenueCat ↔ Convex サブスクリプション設定
 * Free / Premium の2プラン構成
 */

export type Tier = "free" | "premium";

// RevenueCat product_id → Convex planId マッピング
export const REVENUECAT_PRODUCT_MAP: Record<string, string> = {
  pernect_premium_monthly: "premium_monthly",
  pernect_premium_yearly: "premium_yearly",
};

// Entitlement ID → tier マッピング
export const ENTITLEMENT_TIER_MAP: Record<string, Tier> = {
  premium: "premium",
};

/**
 * RevenueCat CustomerInfoのentitlementsからtierを判定する
 */
export function getTierFromEntitlements(
  activeEntitlementIds: string[]
): Tier {
  for (const entitlementId of activeEntitlementIds) {
    if (ENTITLEMENT_TIER_MAP[entitlementId]) {
      return "premium";
    }
  }
  return "free";
}

/**
 * RevenueCat product_idからConvex planIdに変換する
 */
export function mapProductToPlanId(productId: string): string {
  return REVENUECAT_PRODUCT_MAP[productId] ?? productId;
}

/**
 * tierがpremiumかどうか判定する
 */
export function isPremium(currentTier: Tier): boolean {
  return currentTier === "premium";
}

/**
 * 後方互換: meetsRequiredTier
 */
export function meetsRequiredTier(
  currentTier: Tier,
  requiredTier: Tier
): boolean {
  if (requiredTier === "free") return true;
  return currentTier === "premium";
}
