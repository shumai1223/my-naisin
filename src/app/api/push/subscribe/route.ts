import { NextRequest, NextResponse } from 'next/server';

import { saveSubscription, isValidSubscription, type PushSubscriptionInput } from '@/lib/push-db';

/**
 * Web Push 購読の登録（H-NEW）。
 *
 * クライアント（WebPushOptIn）が PushManager.subscribe() で得た購読を受け取り D1 に保存する。
 * 設計：
 *  - D1（LEADS_DB）未バインドでも 200 を返す（stored:false）。push機能は env が揃うまで休眠。
 *  - 個人を特定する情報は受け取らない（endpoint＋公開鍵のみ）。県・対象は出し分け用の任意メタ。
 *  - 公開POSTのためボディ上限・最小バリデーション・ベストエフォートのIP流量制限を課す。
 */

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 4096;
const RATE = { windowMs: 60_000, max: 10 };
const hits = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > RATE.max;
}

interface SubscribeBody {
  subscription?: {
    endpoint?: unknown;
    keys?: { p256dh?: unknown; auth?: unknown };
  };
  prefecture?: unknown;
  audience?: unknown;
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

export async function POST(request: NextRequest) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  let body: SubscribeBody;
  try {
    body = JSON.parse(raw) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const sub = body.subscription;
  const candidate: Partial<PushSubscriptionInput> = {
    endpoint: str(sub?.endpoint),
    p256dh: str(sub?.keys?.p256dh),
    auth: str(sub?.keys?.auth),
    prefecture: str(body.prefecture)?.slice(0, 40),
    audience: str(body.audience)?.slice(0, 16),
    userAgent: request.headers.get('user-agent')?.slice(0, 300) || undefined,
  };

  if (!isValidSubscription(candidate)) {
    return NextResponse.json({ error: 'invalid_subscription' }, { status: 400 });
  }

  const stored = await saveSubscription(candidate);
  return NextResponse.json({ ok: true, stored });
}
