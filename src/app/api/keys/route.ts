import { createRateLimiter, extractApiKey } from '@/lib/api-auth';
import { corsPreflight, CORS_HEADERS } from '@/lib/api-cors';
import { hashApiKey, issueApiKey, lookupApiKey } from '@/lib/api-keys';
import { getTierPolicy } from '@/lib/api-tiers';

/**
 * 無料APIキーの自己発行口（堀B／課金ゲートの入口）。
 *
 * DDレポート §H「Webhookでキー自動発行→完全自動課金」のうち、まず無料ティアの自己発行を実装。
 * POST /api/keys { label?, email? } → free ティアのキーを発行し、平文を一度だけ返す（以後は再表示不可）。
 * GET  /api/keys（Authorization: Bearer <key>）→ 自分のキーのティア・有効性を確認（平文は返さない）。
 *
 * 安全設計：
 *  - 平文は保存しない（D1にはSHA-256ハッシュのみ）。
 *  - IP単位の発行レート制限（連続発行＝D1肥大の防止）。
 *  - D1 バインディング未設定なら 503（点火前は「準備中」を明示してサイレント失敗を避ける）。
 */

const issueLimiter = createRateLimiter(60 * 60_000); // 1時間窓
const MAX_ISSUE_PER_HOUR = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  // 発行レート制限（ベストエフォート）。
  if (issueLimiter.hit(`issue:${clientIp(request)}`) > MAX_ISSUE_PER_HOUR) {
    return json({ error: '発行のリクエストが多すぎます。1時間ほどおいて再度お試しください。' }, 429);
  }

  let body: { label?: unknown; email?: unknown } = {};
  try {
    const raw = await request.text();
    if (raw && raw.length < 2048) body = JSON.parse(raw);
  } catch {
    /* 空ボディ可。ラベル・メールは任意。 */
  }

  const label = typeof body.label === 'string' ? body.label.trim().slice(0, 80) : undefined;
  const emailRaw = typeof body.email === 'string' ? body.email.trim().slice(0, 254) : '';
  const email = emailRaw && EMAIL_RE.test(emailRaw) ? emailRaw : undefined;

  const issued = await issueApiKey({ tier: 'free', label, email });
  if (!issued) {
    // D1 未バインド＝点火前。利用者にはCDNキャッシュ無しの匿名ティアで使えることを案内。
    return json(
      {
        error: 'not_enabled',
        message:
          'APIキーの自己発行は現在準備中です。キー無し（匿名ティア）で /api/naishin をそのままご利用いただけます。',
        anonymous: { ...getTierPolicy('anonymous') },
        docs: 'https://my-naishin.com/developers',
      },
      503
    );
  }

  const policy = getTierPolicy(issued.tier);
  return json({
    apiKey: issued.apiKey, // ★この一度きり。安全に保管してください。
    prefix: issued.prefix,
    tier: issued.tier,
    rateLimitPerMinute: policy.ratePerMinute,
    monthlyQuota: policy.monthlyQuota,
    attributionRequired: policy.attributionRequired,
    usage: 'Authorization: Bearer <apiKey> または x-api-key: <apiKey> を付けて /api/naishin を呼び出してください。',
    upgrade: '上位プラン（Pro / Scale・データライセンス）は https://my-naishin.com/developers',
    notice: 'このキーは再表示できません。安全に保管してください。',
  });
}

/** 自分のキーの有効性確認（平文は返さない）。 */
export async function GET(request: Request) {
  const presented = extractApiKey(request);
  if (!presented) {
    return json({ error: 'no_key', message: 'Authorization: Bearer <key> を付けてください。' }, 400);
  }
  const rec = await lookupApiKey(await hashApiKey(presented));
  if (!rec) {
    return json({ valid: false, message: 'キーが見つからない、または発行機能が未接続です。' }, 404);
  }
  const policy = getTierPolicy(rec.tier);
  return json({
    valid: rec.status === 'active',
    prefix: rec.prefix,
    tier: rec.tier,
    status: rec.status,
    rateLimitPerMinute: policy.ratePerMinute,
    monthlyQuota: policy.monthlyQuota,
  });
}

export function OPTIONS() {
  return corsPreflight();
}
