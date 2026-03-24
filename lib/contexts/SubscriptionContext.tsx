import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Platform, AppState } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
  type PurchasesPackage,
  LOG_LEVEL,
  PURCHASES_ERROR_CODE,
} from "react-native-purchases";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  getTierFromEntitlements,
  mapProductToPlanId,
  type Tier,
} from "../subscription-config";

interface SubscriptionContextType {
  tier: Tier;
  isLoading: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  purchase: (pkg: PurchasesPackage) => Promise<void>;
  restorePurchases: () => Promise<{ restored: boolean }>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

interface SubscriptionProviderProps {
  children: ReactNode;
  userId: string | null; // Convex user._id (null = 未認証)
  isAuthenticated: boolean;
}

export function SubscriptionProvider({
  children,
  userId,
  isAuthenticated,
}: SubscriptionProviderProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  const syncSubscription = useMutation(api.subscriptions.syncSubscription);

  // tier導出
  const tier: Tier = customerInfo
    ? getTierFromEntitlements(Object.keys(customerInfo.entitlements.active))
    : "free";

  // Convex同期ヘルパー
  const syncToConvex = useCallback(
    async (info: CustomerInfo) => {
      if (!isAuthenticated) return;

      const activeEntitlementIds = Object.keys(info.entitlements.active);
      if (activeEntitlementIds.length === 0) return;

      // 最もアクティブなentitlementからproductIdを取得
      const primaryEntitlement =
        info.entitlements.active[activeEntitlementIds[0]];
      if (!primaryEntitlement) return;

      const planId = mapProductToPlanId(primaryEntitlement.productIdentifier);
      const expirationDate = primaryEntitlement.expirationDate;

      try {
        await syncSubscription({
          planId,
          status: "active",
          revenuecatAppUserId: info.originalAppUserId,
          revenuecatProductId: primaryEntitlement.productIdentifier,
          revenuecatEntitlementId: activeEntitlementIds[0],
          currentPeriodEnd: expirationDate
            ? new Date(expirationDate).getTime()
            : undefined,
        });
      } catch (error) {
        console.error("Failed to sync subscription to Convex:", error);
      }
    },
    [isAuthenticated, syncSubscription]
  );

  // SDK初期化
  useEffect(() => {
    const configure = async () => {
      try {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }

        const apiKey =
          Platform.OS === "ios"
            ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS
            : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;

        if (!apiKey) {
          console.warn("RevenueCat API key not configured");
          setIsLoading(false);
          return;
        }

        await Purchases.configure({ apiKey });
        setIsConfigured(true);
      } catch (error) {
        console.error("RevenueCat configuration failed:", error);
        setIsLoading(false);
      }
    };

    configure();
  }, []);

  // ユーザー紐付け & 状態取得
  useEffect(() => {
    if (!isConfigured) return;

    const identify = async () => {
      try {
        if (isAuthenticated && userId) {
          // Convex userIdでRevenueCatにログイン
          const { customerInfo: info } = await Purchases.logIn(userId);
          setCustomerInfo(info);
          await syncToConvex(info);
        } else {
          // 未認証: ログアウト
          await Purchases.logOut();
          setCustomerInfo(null);
        }
      } catch (error) {
        console.error("RevenueCat identify error:", error);
        // エラー時でも現在の状態を取得
        try {
          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);
        } catch {
          // SDK利用不可
        }
      }

      // Offerings取得
      try {
        const offs = await Purchases.getOfferings();
        setOfferings(offs);
      } catch (error) {
        console.error("Failed to fetch offerings:", error);
      }

      setIsLoading(false);
    };

    identify();
  }, [isConfigured, isAuthenticated, userId, syncToConvex]);

  // CustomerInfo更新リスナー
  useEffect(() => {
    if (!isConfigured) return;

    const handler = (info: CustomerInfo) => {
      setCustomerInfo(info);
      syncToConvex(info);
    };

    Purchases.addCustomerInfoUpdateListener(handler);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(handler);
    };
  }, [isConfigured, syncToConvex]);

  // フォアグラウンド復帰時の同期
  useEffect(() => {
    if (!isConfigured || !isAuthenticated) return;

    const subscription = AppState.addEventListener("change", async (state) => {
      if (state === "active") {
        try {
          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);
          await syncToConvex(info);
        } catch (error) {
          console.error("Foreground sync error:", error);
        }
      }
    });

    return () => subscription.remove();
  }, [isConfigured, isAuthenticated, syncToConvex]);

  // 購入処理
  const purchase = useCallback(
    async (pkg: PurchasesPackage) => {
      try {
        const { customerInfo: info } = await Purchases.purchasePackage(pkg);
        setCustomerInfo(info);
        await syncToConvex(info);
      } catch (error: any) {
        if (error.userCancelled) {
          // ユーザーキャンセル — 何もしない
          return;
        }
        if (error.code === PURCHASES_ERROR_CODE.PRODUCT_ALREADY_PURCHASED_ERROR) {
          throw new Error("既にこのプランに加入しています");
        }
        if (error.code === PURCHASES_ERROR_CODE.NETWORK_ERROR) {
          throw new Error(
            "購入処理に問題が発生しました。しばらくしてからもう一度お試しください"
          );
        }
        throw error;
      }
    },
    [syncToConvex]
  );

  // 購入復元
  const restorePurchases = useCallback(async () => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);

      const restoredTier = getTierFromEntitlements(
        Object.keys(info.entitlements.active)
      );

      if (restoredTier !== "free") {
        await syncToConvex(info);
        return { restored: true };
      }

      return { restored: false };
    } catch (error) {
      console.error("Restore purchases error:", error);
      throw error;
    }
  }, [syncToConvex]);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isLoading,
        customerInfo,
        offerings,
        purchase,
        restorePurchases,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
}
