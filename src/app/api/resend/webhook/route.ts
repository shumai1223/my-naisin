import { verifyResendWebhookSignature } from '@/lib/resend-webhook';
import { insertEmailEvent } from '@/lib/email-events-db';

/**
 * Resend Webhook（メール開封/クリック計測・TIER Q-4／C-7の運用編）。
 *
 * email.opened / email.clicked 等のイベントを受け取り、email_events（migration 0010・未適用）に記録する。
 * どの配信（保護者メール講座のどのステップ等）かは、送信時にResendのtags機能で付与した値が
 * data.tagsとしてそのまま返ってくるため、送信時の別テーブル管理なしで相関できる
 * （scripts/newsletter.tsの送信時tags付与とセット）。
 *
 * 安全設計（Stripe webhookと同方針）：
 *  - RESEND_WEBHOOK_SECRET未設定なら503（本番では必ず設定）。
 *  - 署名検証失敗は400。
 *  - 検証成功後の記録処理が失敗してもResendの再送ループを避けるため常に200を返す（ログのみ）。
 */

async function readWebhookSecret(): Promise<string | undefined> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (
      (env as unknown as { RESEND_WEBHOOK_SECRET?: string }).RESEND_WEBHOOK_SECRET ??
      process.env.RESEND_WEBHOOK_SECRET
    );
  } catch {
    return process.env.RESEND_WEBHOOK_SECRET;
  }
}

interface ResendWebhookPayload {
  type?: string;
  data?: {
    email_id?: string;
    to?: string[] | string;
    click?: { link?: string };
    tags?: { name: string; value: string }[];
  };
}

export async function POST(request: Request) {
  const secret = await readWebhookSecret();
  if (!secret) {
    return new Response(JSON.stringify({ error: 'webhook not configured' }), { status: 503 });
  }

  const payload = await request.text();
  const ok = await verifyResendWebhookSignature(
    payload,
    {
      svixId: request.headers.get('svix-id'),
      svixTimestamp: request.headers.get('svix-timestamp'),
      svixSignature: request.headers.get('svix-signature'),
    },
    secret
  );
  if (!ok) {
    return new Response(JSON.stringify({ error: 'invalid signature' }), { status: 400 });
  }

  let event: ResendWebhookPayload;
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), { status: 400 });
  }

  try {
    const data = event.data ?? {};
    const recipient = Array.isArray(data.to) ? data.to[0] : data.to;
    await insertEmailEvent({
      eventType: event.type ?? 'unknown',
      resendEmailId: data.email_id,
      recipient,
      link: data.click?.link,
      tags: data.tags,
    });
    console.log(JSON.stringify({ t: new Date().toISOString(), resend_webhook: event.type, hasTags: Boolean(data.tags?.length) }));
  } catch (err) {
    console.error('resend webhook handler error:', err instanceof Error ? err.message : err);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
