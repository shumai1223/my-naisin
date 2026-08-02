import { NextRequest, NextResponse } from 'next/server';

import { persistParentFunnelEvent, type ParentFunnelEvent, type ParentFunnelMedium } from '@/lib/parent-funnel-db';
import { isBotUserAgent } from '@/lib/bot-filter';

/**
 * 保護者ファネル(TIER Σ-3)の計測ビーコン。
 *
 * ParentShareLinkButton（生徒が保護者へ送る操作）・ParentShareBanner（保護者の着地）が
 * `fetch(..., { keepalive: true })` で叩く。既存のGA4 track()と並走させ、GA4欠測を
 * D1一次記録で補う（[[ga4-undercounts-conversions]]）。送信/遷移は止めず、記録はベストエフォート。
 */

const VALID_EVENTS = new Set<ParentFunnelEvent>(['share_to_parent', 'parent_landing_view']);
const VALID_MEDIUMS = new Set<ParentFunnelMedium>(['native', 'copy', 'line', 'x']);
const MAX_BODY_BYTES = 256;

// ベストエフォートのIPレート制限（school-click route と同方針・ウォームアイソレート内のみ有効）。
const RATE = { windowMs: 60_000, max: 30 };
const hits = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

function allow(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  if (recent.length >= RATE.max) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE.windowMs)) hits.delete(k);
    }
  }
  return true;
}

export async function POST(request: NextRequest) {
  if (isBotUserAgent(request.headers.get('user-agent'))) {
    return new NextResponse(null, { status: 204 });
  }
  if (!allow(clientIp(request))) {
    return new NextResponse(null, { status: 429 });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const { event, medium, prefectureCode, hoursSinceSent } = (body ?? {}) as Record<string, unknown>;
  if (typeof event !== 'string' || !VALID_EVENTS.has(event as ParentFunnelEvent)) {
    return new NextResponse(null, { status: 400 });
  }
  if (medium !== undefined && (typeof medium !== 'string' || !VALID_MEDIUMS.has(medium as ParentFunnelMedium))) {
    return new NextResponse(null, { status: 400 });
  }
  if (prefectureCode !== undefined && typeof prefectureCode !== 'string') {
    return new NextResponse(null, { status: 400 });
  }
  // TIER Σ-5: 送信から着地までの経過時間（時間）。異常値（負・非有限・数万時間超）は素通しせず弾く。
  if (
    hoursSinceSent !== undefined &&
    (typeof hoursSinceSent !== 'number' || !Number.isFinite(hoursSinceSent) || hoursSinceSent < 0 || hoursSinceSent > 8760)
  ) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    await persistParentFunnelEvent({
      event: event as ParentFunnelEvent,
      medium: medium as ParentFunnelMedium | undefined,
      prefectureCode: prefectureCode as string | undefined,
      hoursSinceSent: hoursSinceSent as number | undefined,
    });
  } catch {
    /* no-op：計測はベストエフォート */
  }

  return new NextResponse(null, { status: 204 });
}
