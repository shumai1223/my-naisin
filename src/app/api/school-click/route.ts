import { NextRequest, NextResponse } from 'next/server';

import { getPrefectureByCode } from '@/lib/prefectures';
import { getPrefectureSchoolPageData } from '@/lib/school-page-lookup';
import { persistSchoolPageClick, type SchoolPageCta } from '@/lib/school-page-clicks-db';
import { isBotUserAgent } from '@/lib/bot-filter';

/**
 * 学校別倍率ページ(Λ-2)のCTAクリック計測ビーコン（主食②-2）。
 *
 * SchoolPageConvertCTA（クライアント）が /reverse・/juku-shindan・LINE友だち追加への
 * リンクを押した瞬間に `fetch(..., { keepalive: true })` で叩く。送客の遷移は止めず、
 * D1への記録はベストエフォート（失敗しても204を返す＝計測がUXを壊さない）。
 */

const VALID_CTAS = new Set<SchoolPageCta>(['reverse', 'juku-shindan', 'line']);
const MAX_BODY_BYTES = 512;

// ベストエフォートのIPレート制限（lead route と同方針・ウォームアイソレート内のみ有効）。
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

  const { prefectureCode, schoolCode, cta } = (body ?? {}) as Record<string, unknown>;
  if (typeof prefectureCode !== 'string' || typeof schoolCode !== 'string' || typeof cta !== 'string') {
    return new NextResponse(null, { status: 400 });
  }
  if (!VALID_CTAS.has(cta as SchoolPageCta)) {
    return new NextResponse(null, { status: 400 });
  }
  if (!getPrefectureByCode(prefectureCode)) {
    return new NextResponse(null, { status: 400 });
  }
  const data = getPrefectureSchoolPageData(prefectureCode);
  if (!data?.schools.some((school) => school.schoolCode === schoolCode)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    await persistSchoolPageClick({ prefectureCode, schoolCode, cta: cta as SchoolPageCta });
  } catch {
    /* no-op：計測はベストエフォート */
  }

  return new NextResponse(null, { status: 204 });
}
