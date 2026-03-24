import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// ============================================================
// RevenueCat Webhook Endpoint
// ============================================================

http.route({
  path: "/revenuecat-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Authorization header検証
    const authHeader = request.headers.get("Authorization");
    const expectedToken = process.env.REVENUECAT_WEBHOOK_SECRET;

    if (!expectedToken) {
      console.error("REVENUECAT_WEBHOOK_SECRET not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      console.warn("RevenueCat webhook: Invalid authorization header");
      return new Response("Unauthorized", { status: 401 });
    }

    // リクエストボディをパース
    let body: {
      api_version?: string;
      event?: {
        type: string;
        app_user_id: string;
        product_id: string;
        entitlement_ids?: string[];
        expiration_at_ms?: number | null;
        purchased_at_ms?: number;
        environment?: string;
      };
    };

    try {
      body = await request.json();
    } catch {
      console.error("RevenueCat webhook: Invalid JSON body");
      return new Response("Invalid JSON", { status: 400 });
    }

    const event = body.event;
    if (!event) {
      console.error("RevenueCat webhook: Missing event field");
      return new Response("Missing event", { status: 400 });
    }

    // 本番環境ではSANDBOXイベントを無視（ログのみ）
    if (
      process.env.NODE_ENV === "production" &&
      event.environment === "SANDBOX"
    ) {
      console.log("RevenueCat webhook: Ignoring SANDBOX event in production");
      return new Response("OK", { status: 200 });
    }

    // internal mutationでDB更新
    try {
      await ctx.runMutation(internal.subscriptions.handleWebhookEvent, {
        revenuecatAppUserId: event.app_user_id,
        eventType: event.type,
        productId: event.product_id || "",
        expirationAtMs: event.expiration_at_ms ?? undefined,
        purchasedAtMs: event.purchased_at_ms,
      });
    } catch (error) {
      console.error("RevenueCat webhook handler error:", error);
      // ユーザー未発見等のケースでも200を返す（リトライ防止）
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
