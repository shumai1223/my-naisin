/**
 * Stripe Billing 連携（堀B／課金ループの本丸）— SDK不要・raw fetch + Web Crypto。
 *
 * DDレポートの辛口指摘「蛇口はできたが水が出ていない＝決済→自動proキー発行のループが無い」への回答。
 * これで「クレカ決済 → Webhook → 自動で pro キー発行＆メール送付 → 解約で失効」までが閉じる。
 *
 * 設計（[[esp]] と同方針・push=本番なので壊さない）：
 *  - STRIPE_SECRET_KEY 未設定なら全て休眠（checkout は null、Webhookは無視）。点火は env だけ。
 *  - SDKを足さない（Workersバンドル肥大・npm ci事故の回避）。REST直叩き＋HMAC-SHA256で署名検証。
 *  - 価格→ティアの対応は env（STRIPE_PRICE_PRO / STRIPE_PRICE_SCALE）で持つ。
 *
 * env：
 *  - STRIPE_SECRET_KEY        … sk_live_...（checkout作成・API認証）
 *  - STRIPE_WEBHOOK_SECRET    … whsec_...（Webhook署名検証）
 *  - STRIPE_PRICE_PRO         … price_...（Proの定期課金 price ID）
 *  - STRIPE_PRICE_SCALE       … price_...（任意・Scaleをセルフ決済にする場合）
 */

import type { ApiTier } from './api-tiers';

const STRIPE_API = 'https://api.stripe.com/v1';

export interface StripeEnv {
  secretKey?: string;
  webhookSecret?: string;
  pricePro?: string;
  priceScale?: string;
}

/** process.env → Cloudflare env の順で Stripe 設定を解決する（secret は wrangler secret put 由来でも拾う）。 */
export async function readStripeEnv(): Promise<StripeEnv> {
  const e: StripeEnv = {
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    pricePro: process.env.STRIPE_PRICE_PRO,
    priceScale: process.env.STRIPE_PRICE_SCALE,
  };
  if (!e.secretKey || !e.webhookSecret || !e.pricePro) {
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare');
      const { env } = await getCloudflareContext({ async: true });
      const c = env as unknown as Record<string, string | undefined>;
      e.secretKey = e.secretKey || c.STRIPE_SECRET_KEY;
      e.webhookSecret = e.webhookSecret || c.STRIPE_WEBHOOK_SECRET;
      e.pricePro = e.pricePro || c.STRIPE_PRICE_PRO;
      e.priceScale = e.priceScale || c.STRIPE_PRICE_SCALE;
    } catch {
      /* Workers外（テスト/ビルド）では process.env のみ */
    }
  }
  return e;
}

export async function stripeConfigured(): Promise<boolean> {
  return Boolean((await readStripeEnv()).secretKey);
}

/** ティア → price ID。未設定/対象外は null。 */
export function priceIdForTier(tier: ApiTier, env: StripeEnv): string | null {
  if (tier === 'pro') return env.pricePro ?? null;
  if (tier === 'scale') return env.priceScale ?? null;
  return null;
}

/** price ID → ティア。Webhookでどのプランが買われたか判定する。 */
export function tierForPriceId(priceId: string | undefined, env: StripeEnv): Exclude<ApiTier, 'anonymous' | 'free'> | null {
  if (!priceId) return null;
  if (env.pricePro && priceId === env.pricePro) return 'pro';
  if (env.priceScale && priceId === env.priceScale) return 'scale';
  return null;
}

export interface CheckoutInput {
  tier: Exclude<ApiTier, 'anonymous' | 'free'>;
  email?: string;
  origin: string;
}

/**
 * Stripe Checkout（サブスク）セッションを作成し、決済URLを返す。
 * 未設定/対象price無しは null（呼び出し側が「準備中」を返す）。metadata.tier で Webhook が発行ティアを決める。
 */
export async function createCheckoutSession(input: CheckoutInput): Promise<{ url: string } | null> {
  const env = await readStripeEnv();
  if (!env.secretKey) return null;
  const priceId = priceIdForTier(input.tier, env);
  if (!priceId) return null;

  const params = new URLSearchParams();
  params.set('mode', 'subscription');
  params.set('line_items[0][price]', priceId);
  params.set('line_items[0][quantity]', '1');
  params.set('success_url', `${input.origin}/developers?checkout=success`);
  params.set('cancel_url', `${input.origin}/developers?checkout=cancel`);
  params.set('allow_promotion_codes', 'true');
  params.set('metadata[tier]', input.tier);
  params.set('subscription_data[metadata][tier]', input.tier);
  if (input.email) params.set('customer_email', input.email);

  try {
    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!res.ok) {
      console.error('Stripe checkout not ok:', res.status, (await res.text().catch(() => '')).slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { url?: string };
    return data.url ? { url: data.url } : null;
  } catch (err) {
    console.error('Stripe checkout failed:', err);
    return null;
  }
}

/** HMAC-SHA256 の16進（Web Crypto）。Stripe署名検証に使う。 */
async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** 一定時間比較（タイミング攻撃の緩和）。 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Stripe Webhook 署名検証（`Stripe-Signature: t=..,v1=..` 形式）。
 * 署名対象は `${t}.${payload}`。toleranceSec 内のタイムスタンプのみ受理（リプレイ緩和）。
 * 純粋・テスト可能（now 注入可）。
 */
export async function verifyStripeSignature(
  payload: string,
  sigHeader: string | null,
  secret: string,
  opts?: { toleranceSec?: number; now?: number }
): Promise<boolean> {
  if (!sigHeader || !secret) return false;
  const parts = sigHeader.split(',').map((p) => p.trim());
  const tPart = parts.find((p) => p.startsWith('t='))?.slice(2);
  const v1s = parts.filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!tPart || v1s.length === 0) return false;

  const tolerance = opts?.toleranceSec ?? 300;
  const nowSec = Math.floor((opts?.now ?? Date.now()) / 1000);
  const ts = Number(tPart);
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > tolerance) return false;

  const expected = await hmacSha256Hex(secret, `${tPart}.${payload}`);
  return v1s.some((v1) => timingSafeEqual(expected, v1));
}
