import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSubscription } from "../../../lib/contexts/SubscriptionContext";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface SubscriptionManageScreenProps {
  onBack: () => void;
  onNavigateToPaywall: () => void;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
};

const TIER_COLORS: Record<string, [string, string]> = {
  free: ["#94a3b8", "#94a3b8"],
  premium: ["#8b5cf6", "#ec4899"],
};

const TIER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  free: "person",
  premium: "diamond",
};

export function SubscriptionManageScreen({
  onBack,
  onNavigateToPaywall,
}: SubscriptionManageScreenProps) {
  const { tier, customerInfo, isLoading } = useSubscription();
  const currentSubscription = useQuery(api.subscriptions.getCurrentSubscription);

  const formatDate = (timestamp: number | string | undefined | null) => {
    if (!timestamp) return "---";
    const date = typeof timestamp === "string" ? new Date(timestamp) : new Date(timestamp);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOpenStoreManagement = () => {
    Alert.alert(
      "サブスクリプション管理",
      "ストアのサブスクリプション管理画面を開きます。キャンセルや変更はストアから行えます。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "ストアを開く",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("https://apps.apple.com/account/subscriptions");
            } else {
              Linking.openURL(
                "https://play.google.com/store/account/subscriptions"
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading || currentSubscription === undefined) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  const colors = TIER_COLORS[tier] ?? TIER_COLORS.free;
  const icon = TIER_ICONS[tier] ?? "person";
  const label = TIER_LABELS[tier] ?? "Free";

  // RevenueCat CustomerInfoからentitlement情報を取得
  const activeEntitlements = customerInfo?.entitlements?.active ?? {};
  const primaryEntitlement = Object.values(activeEntitlements)[0];
  const expirationDate = primaryEntitlement?.expirationDate;
  const willRenew = primaryEntitlement?.willRenew;
  const isCancelledButActive = !willRenew && tier !== "free";

  const hasSubscription = tier !== "free";

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-14 pb-4 border-b border-border bg-background">
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={28} color="#0f172a" />
        </TouchableOpacity>
        <Text className="flex-1 text-xl font-bold text-foreground text-center">
          サブスクリプション
        </Text>
        <View className="w-7" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {hasSubscription ? (
          <View className="px-6 py-6">
            {/* Plan Card */}
            <LinearGradient
              colors={colors}
              style={{ borderRadius: 24, padding: 24, marginBottom: 24 }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-white text-sm opacity-90 mb-1">
                    現在のプラン
                  </Text>
                  <Text className="text-white text-3xl font-bold">
                    {label}
                  </Text>
                </View>
                <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                  <Ionicons name={icon} size={28} color="white" />
                </View>
              </View>

              {/* Details */}
              <View className="bg-white/20 rounded-2xl p-4">
                {currentSubscription?.plan?.price && (
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-white/80 text-sm">料金</Text>
                    <Text className="text-white font-semibold">
                      ¥{currentSubscription.plan.price.toLocaleString()}/
                      {currentSubscription.plan.billingPeriod === "yearly"
                        ? "年"
                        : "月"}
                    </Text>
                  </View>
                )}

                {expirationDate && (
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-white/80 text-sm">
                      {willRenew ? "次回更新日" : "有効期限"}
                    </Text>
                    <Text className="text-white font-semibold">
                      {formatDate(expirationDate)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between">
                  <Text className="text-white/80 text-sm">ステータス</Text>
                  <Text className="text-white font-semibold">
                    {isCancelledButActive ? "キャンセル予約済み" : "有効"}
                  </Text>
                </View>

                {isCancelledButActive && (
                  <View className="bg-yellow-500/30 rounded-xl p-3 mt-3">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="warning" size={16} color="#fef08a" />
                      <Text className="text-white text-sm flex-1">
                        有効期限後にサブスクリプションが終了します
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </LinearGradient>

            {/* Features List */}
            {currentSubscription?.plan?.features && (
              <View className="bg-card rounded-2xl p-5 border border-border mb-4">
                <Text className="text-lg font-bold text-foreground mb-3">
                  利用可能な機能
                </Text>
                <View className="gap-3">
                  {currentSubscription.plan.features.map(
                    (feature: string, index: number) => (
                      <View key={index} className="flex-row items-center gap-3">
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#10b981"
                        />
                        <Text className="text-sm text-foreground flex-1">
                          {feature}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}

            {/* Actions */}
            <View className="gap-3">
              <TouchableOpacity
                onPress={onNavigateToPaywall}
                className="bg-card rounded-2xl p-4 border border-border flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                    <Ionicons
                      name="swap-horizontal"
                      size={20}
                      color="#8b5cf6"
                    />
                  </View>
                  <Text className="text-foreground font-medium">
                    プランを変更
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleOpenStoreManagement}
                className={`rounded-2xl p-4 border flex-row items-center justify-between ${
                  isCancelledButActive
                    ? "border-border opacity-50"
                    : "border-red-200"
                }`}
                disabled={isCancelledButActive}
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      isCancelledButActive ? "bg-gray-100" : "bg-red-100"
                    }`}
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={isCancelledButActive ? "#94a3b8" : "#ef4444"}
                    />
                  </View>
                  <Text
                    className={`font-medium ${
                      isCancelledButActive
                        ? "text-muted-foreground"
                        : "text-red-600"
                    }`}
                  >
                    {isCancelledButActive
                      ? "キャンセル予約済み"
                      : "サブスクリプションを管理"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isCancelledButActive ? "#94a3b8" : "#ef4444"}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* No Subscription State */
          <View className="px-6 py-8">
            <View className="items-center mb-8">
              <LinearGradient
                colors={["#8b5cf6", "#ec4899"]}
                style={{
                  borderRadius: 40,
                  width: 80,
                  height: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons name="sparkles" size={40} color="white" />
              </LinearGradient>
              <Text className="text-xl font-bold text-foreground mb-2">
                プレミアムプランをご利用ください
              </Text>
              <Text className="text-muted-foreground text-center">
                AI分析や詳細なレポートなど、{"\n"}
                便利な機能を解放できます
              </Text>
            </View>

            <TouchableOpacity onPress={onNavigateToPaywall}>
              <LinearGradient
                colors={["#8b5cf6", "#ec4899"]}
                style={{
                  borderRadius: 16,
                  paddingVertical: 16,
                  alignItems: "center",
                }}
              >
                <Text className="text-white font-bold text-base">
                  プランを見る
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* FAQ Section */}
        <View className="px-6 pb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            よくある質問
          </Text>
          <View className="gap-3">
            <View className="bg-secondary rounded-2xl p-4">
              <Text className="text-foreground font-medium mb-2">
                キャンセル方法は？
              </Text>
              <Text className="text-sm text-muted-foreground">
                App Store / Google Play のサブスクリプション管理画面からキャンセルできます。
              </Text>
            </View>
            <View className="bg-secondary rounded-2xl p-4">
              <Text className="text-foreground font-medium mb-2">
                プラン変更のタイミングは？
              </Text>
              <Text className="text-sm text-muted-foreground">
                アップグレードは即時反映されます。ダウングレードは現在の期間終了後に反映されます。
              </Text>
            </View>
            <View className="bg-secondary rounded-2xl p-4">
              <Text className="text-foreground font-medium mb-2">
                返金ポリシーは？
              </Text>
              <Text className="text-sm text-muted-foreground">
                返金はApp Store / Google Play のポリシーに従います。
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <View className="px-6 pb-8">
          <View className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <View className="flex-row items-center gap-3">
              <Ionicons name="mail" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-blue-900 mb-1">
                  ご不明な点はこちら
                </Text>
                <Text className="text-xs text-blue-800">
                  サポート: support@pernect.app
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
