import { NextRequest, NextResponse } from 'next/server';

import { AFFILIATES, type AffiliateId } from '@/lib/affiliates';
import { persistClickHopCompletion } from '@/lib/click-hop-db';
import { isBotUserAgent } from '@/lib/bot-filter';

/**
 * クリックホップ通過率(出血6②)の計測ビーコン。
 *
 * click-hop.tsが生成するホップページのJSが、`location.replace`の直前に
 * `navigator.sendBeacon`で叩く。JSが実行された＝実ブラウザがASPへ到達したことを意味する
 * （href収集だけのボットはこのJSを実行しないため到達しない）。送信/遷移は止めず、
 * 記録はベストエフォート。構造は/api/student-funnel/parent-funnelと同型。
 */

const MAX_BODY_BYTES = 128;

// ベストエフォートのIPレート制限（他ビーコン系routeと同方針・ウォームアイソレート内のみ有効）。
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

  const { affiliateId } = (body ?? {}) as Record<string, unknown>;
  // AFFILIATESのallowlistに無いIDは記録しない（架空データ・悪用防止）。
  if (typeof affiliateId !== 'string' || !(affiliateId in AFFILIATES)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    await persistClickHopCompletion(affiliateId as AffiliateId);
  } catch {
    /* no-op：計測はベストエフォート */
  }

  return new NextResponse(null, { status: 204 });
}
