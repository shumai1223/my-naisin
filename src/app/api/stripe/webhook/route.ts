import { issueApiKey, revokeApiKeysBySubscription } from '@/lib/api-keys';
import { sendApiKeyEmail } from '@/lib/esp';
import { readStripeEnv, tierForPriceId, verifyStripeSignature } from '@/lib/stripe';

/**
 * Stripe Webhook（堀B／Stripeループの出口）。
 *
 * checkout.session.completed → metadata.tier のキーを自動発行し、購入者へメール送付（平文一度きり）。
 * customer.subscription.deleted → その購読で出したキーを自動失効。
 *
 * 安全設計：
 *  - 署名検証は STRIPE_WEBHOOK_SECRET を使う（未設定なら 503・本番では必ず設定）。
 *  - 署名対象は生ボディなので request.text() を JSON.parse 前に取得する。
 *  - 検証失敗は 400、それ以外は常に 200 を返す（Stripe の再送ループを避ける／処理失敗はログに残す）。
 */

// 署名検証のため生ボディが必要。Edge/ノードどちらでも request.text() でOK。
export async function POST(request: Request) {
  const env = await readStripeEnv();
  if (!env.webhookSecret) {
    return new Response(JSON.stringify({ error: 'webhook not configured' }), { status: 503 });
  }

  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');
  const ok = await verifyStripeSignature(payload, sig, env.webhookSecret);
  if (!ok) {
    return new Response(JSON.stringify({ error: 'invalid signature' }), { status: 400 });
  }

  let event: {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400 });
  }

  try {
    const obj = (event.data?.object ?? {}) as Record<string, unknown>;

    if (event.type === 'checkout.session.completed') {
      const tier =
        ((obj.metadata as Record<string, string> | undefined)?.tier as 'pro' | 'scale' | undefined) ?? 'pro';
      const email =
        (obj.customer_email as string | undefined) ||
        ((obj.customer_details as Record<string, string> | undefined)?.email as string | undefined);
      const customerId = (obj.customer as string | undefined) ?? undefined;
      const subscriptionId = (obj.subscription as string | undefined) ?? undefined;

      const issued = await issueApiKey({
        tier,
        email,
        label: `stripe:${tier}`,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
      });
      if (issued && email) {
        await sendApiKeyEmail(email, issued.apiKey, issued.tier);
      }
      console.log(JSON.stringify({ t: new Date().toISOString(), stripe: 'key_issued', tier, hasEmail: Boolean(email) }));
    } else if (event.type === 'customer.subscription.deleted') {
      const subscriptionId = obj.id as string | undefined;
      if (subscriptionId) await revokeApiKeysBySubscription(subscriptionId);
      console.log(JSON.stringify({ t: new Date().toISOString(), stripe: 'key_revoked', sub: subscriptionId }));
    } else if (event.type === 'customer.subscription.updated') {
      // 価格変更（ダウン/アップグレード）の余地。price→tier の付け替えは将来対応。
      const items = ((obj.items as Record<string, unknown> | undefined)?.data as Array<Record<string, unknown>>) ?? [];
      const priceId = (items[0]?.price as Record<string, unknown> | undefined)?.id as string | undefined;
      const mapped = tierForPriceId(priceId, env);
      console.log(JSON.stringify({ t: new Date().toISOString(), stripe: 'sub_updated', mapped }));
    }
  } catch (err) {
    // 処理失敗はログのみ。200を返してStripeの再送ループを止める（重複発行の回避）。
    console.error('stripe webhook handler error:', err instanceof Error ? err.message : err);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
