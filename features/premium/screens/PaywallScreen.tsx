import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { toast } from "sonner-native";
import type { PurchasesPackage } from "react-native-purchases";
import { useSubscription } from "../../../lib/contexts/SubscriptionContext";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface PaywallScreenProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const FEATURES = [
  { icon: "sparkles" as const, text: "AI統合分析（30回/日）" },
  { icon: "people" as const, text: "深掘り相性分析" },
  { icon: "flask" as const, text: "全診断テスト解放" },
  { icon: "cloud-upload" as const, text: "無制限の結果保存" },
  { icon: "heart" as const, text: "フレンド機能" },
];

export function PaywallScreen({ onBack, onSuccess }: PaywallScreenProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { tier, offerings, purchase, restorePurchases, isLoading } = useSubscription();
  const fallbackPlans = useQuery(api.subscriptions.listPlans);

  // Offeringsからパッケージを取得
  const packages = offerings?.current?.availablePackages ?? [];
  const pkg = packages.find((p) => {
    const id = p.product.identifier;
    if (billingPeriod === "monthly") return id.includes("monthly");
    return id.includes("yearly");
  });

  // Fallback plans
  const fallbackPlan = fallbackPlans?.find((p) => p.billingPeriod === billingPeriod);

  const isCurrentlyPremium = tier === "premium";

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (isPurchasing) return;
    setIsPurchasing(true);
    try {
      await purchase(pkg);
      toast.success("Premiumプランに加入しました！");
      onSuccess?.();
    } catch (error: any) {
      if (error.message) {
        toast.error(error.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      const { restored } = await restorePurchases();
      if (restored) {
        toast.success("購入を復元しました");
        onSuccess?.();
      } else {
        toast.info("有効なサブスクリプションが見つかりませんでした");
      }
    } catch {
      toast.error("復元に失敗しました。もう一度お試しください");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-foreground text-center">Premium</Text>
        <View className="w-7" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View className="items-center px-6 pt-8 pb-6">
          <LinearGradient
            colors={["#8b5cf6", "#ec4899"]}
            style={{ borderRadius: 32, width: 64, height: 64, alignItems: "center", justifyContent: "center", marginBottom: 16 }}
          >
            <Ionicons name="diamond" size={32} color="white" />
          </LinearGradient>
          <Text className="text-2xl font-bold text-foreground mb-2">
            Pernect Premium
          </Text>
          <Text className="text-sm text-muted-foreground text-center">
            全機能を解放して、自己分析をもっと深く
          </Text>
        </View>

        {/* Already premium */}
        {isCurrentlyPremium && (
          <View className="px-6 pb-4">
            <View className="bg-purple-50 rounded-2xl p-4 border border-purple-100 flex-row items-center gap-3">
              <Ionicons name="checkmark-circle" size={24} color="#8b5cf6" />
              <Text className="text-sm font-semibold text-purple-900">
                現在Premiumプランをご利用中です
              </Text>
            </View>
          </View>
        )}

        {/* Billing Period Toggle */}
        <View className="px-6 pb-4">
          <View className="flex-row bg-secondary rounded-2xl p-1">
            <TouchableOpacity
              onPress={() => setBillingPeriod("monthly")}
              className={`flex-1 py-3 rounded-xl items-center ${
                billingPeriod === "monthly" ? "bg-background shadow-sm" : ""
              }`}
            >
              <Text className={`text-sm font-semibold ${
                billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}>
                月次
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setBillingPeriod("yearly")}
              className={`flex-1 py-3 rounded-xl items-center relative ${
                billingPeriod === "yearly" ? "bg-background shadow-sm" : ""
              }`}
            >
              <Text className={`text-sm font-semibold ${
                billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"
              }`}>
                年次
              </Text>
              <View className="absolute -top-2 -right-2 bg-red-500 rounded-full px-2 py-0.5">
                <Text className="text-white text-xs font-bold">お得</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Card */}
        <View className="px-6 pb-6">
          <View className="rounded-2xl p-6 border-2 border-purple-300 bg-card">
            {/* Price */}
            <Text className="text-4xl font-bold text-foreground text-center mb-1">
              {pkg ? pkg.product.priceString : fallbackPlan ? `¥${fallbackPlan.price.toLocaleString()}` : "---"}
            </Text>
            <Text className="text-sm text-muted-foreground text-center mb-6">
              /{billingPeriod === "monthly" ? "月" : "年"}
            </Text>

            {/* Features */}
            <View className="gap-3 mb-6">
              {FEATURES.map((feature, i) => (
                <View key={i} className="flex-row items-center gap-3">
                  <Ionicons name={feature.icon} size={20} color="#8b5cf6" />
                  <Text className="text-sm text-foreground flex-1">{feature.text}</Text>
                </View>
              ))}
            </View>

            {/* Purchase Button */}
            {pkg && !isCurrentlyPremium ? (
              <TouchableOpacity
                onPress={() => handlePurchase(pkg)}
                disabled={isPurchasing}
              >
                <LinearGradient
                  colors={["#8b5cf6", "#ec4899"]}
                  style={{ borderRadius: 14, paddingVertical: 16, alignItems: "center" }}
                >
                  {isPurchasing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Premiumを始める
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ) : isCurrentlyPremium ? (
              <View className="bg-gray-100 rounded-xl py-4 items-center">
                <Text className="text-muted-foreground font-semibold">現在のプラン</Text>
              </View>
            ) : (
              <View className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <Text className="text-xs text-amber-800 text-center">
                  ストア接続中...しばらくお待ちください
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Restore */}
        <View className="px-6 pb-4">
          <TouchableOpacity onPress={handleRestore} className="py-3 items-center">
            <Text className="text-sm text-primary font-medium">購入を復元</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View className="px-6 pb-8">
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <View className="flex-row items-start gap-3">
              <Ionicons name="information-circle" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-xs text-blue-800 leading-relaxed">
                  {`• いつでもキャンセル可能\n• 年次プランはさらにお得\n• 決済はApp Store/Google Playで安全に処理`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
