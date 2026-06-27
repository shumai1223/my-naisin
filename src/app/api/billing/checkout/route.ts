import { createRateLimiter } from '@/lib/api-auth';
import { corsPreflight, CORS_HEADERS } from '@/lib/api-cors';
import { createCheckoutSession } from '@/lib/stripe';

/**
 * 課金導線（堀B／Stripeループの入口）。
 * POST /api/billing/checkout { tier: 'pro' | 'scale', email? } → Stripe Checkout の決済URLを返す。
 * フロント（/developers の Upgrade ボタン）はこのURLへ遷移する。
 *
 * 未設定（STRIPE_SECRET_KEY 無し）/ price未設定は 503「準備中」＋お問い合わせ案内（サイレント失敗を避ける）。
 */

const limiter = createRateLimiter(60 * 60_000);
const MAX_PER_HOUR = 10;

function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: Request) {
  if (limiter.hit(`checkout:${clientIp(request)}`) > MAX_PER_HOUR) {
    return json({ error: 'リクエストが多すぎます。少し時間をおいてお試しください。' }, 429);
  }

  let body: { tier?: unknown; email?: unknown } = {};
  try {
    const raw = await request.text();
    if (raw && raw.length < 2048) body = JSON.parse(raw);
  } catch {
    /* 空ボディは下でバリデーション */
  }

  const tier = body.tier === 'pro' || body.tier === 'scale' ? body.tier : null;
  if (!tier) {
    return json({ error: 'tier は "pro" または "scale" を指定してください。' }, 400);
  }
  const email = typeof body.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    ? body.email.trim().slice(0, 254)
    : undefined;

  const origin = new URL(request.url).origin;
  const session = await createCheckoutSession({ tier, email, origin });
  if (!session) {
    return json(
      {
        error: 'not_enabled',
        message:
          tier === 'scale'
            ? 'Scale/データライセンスは個別見積りです。お問い合わせください。'
            : 'オンライン決済は現在準備中です。お問い合わせいただければ手動で発行します。',
        contact: 'https://my-naishin.com/contact',
      },
      503
    );
  }
  return json({ url: session.url });
}

export function OPTIONS() {
  return corsPreflight();
}
