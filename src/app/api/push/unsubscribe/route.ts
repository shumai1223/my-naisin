import { NextRequest, NextResponse } from 'next/server';

import { revokeSubscription } from '@/lib/push-db';

/**
 * Web Push 購読の解除（H-NEW）。endpoint を受け取り D1 で revoked=1 にする。
 * D1 未バインドでも 200（stored:false）。
 */

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 2048;

export async function POST(request: NextRequest) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }
  let endpoint: string | undefined;
  try {
    const body = JSON.parse(raw) as { endpoint?: unknown };
    endpoint = typeof body.endpoint === 'string' ? body.endpoint.trim() : undefined;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  if (!endpoint || !/^https:\/\//.test(endpoint) || endpoint.length > 1000) {
    return NextResponse.json({ error: 'invalid_endpoint' }, { status: 400 });
  }
  const stored = await revokeSubscription(endpoint);
  return NextResponse.json({ ok: true, stored });
}
