import { NextRequest, NextResponse } from 'next/server';

import { persistStudentFunnelEvent, type StudentFunnelEvent, type StudentGrade } from '@/lib/student-funnel-db';
import { isBotUserAgent } from '@/lib/bot-filter';

/**
 * 生徒ファネル(S12-1)の計測ビーコン。
 *
 * HyoteiUniversityBridge（学年自己申告→my-shingaku導線）が
 * `fetch(..., { keepalive: true })` で叩く。既存のGA4 track()と並走させ、GA4欠測を
 * D1一次記録で補う（[[ga4-undercounts-conversions]]）。送信/遷移は止めず、記録はベストエフォート。
 * 構造は/api/parent-funnelと同型（bot UA早期リターン・IPレート制限・ボディサイズ上限）。
 */

const VALID_EVENTS = new Set<StudentFunnelEvent>(['grade_self_identify', 'university_bridge_click']);
const VALID_GRADES = new Set<StudentGrade>(['chugaku', 'koukou']);
const MAX_BODY_BYTES = 256;

// ベストエフォートのIPレート制限（parent-funnel route と同方針・ウォームアイソレート内のみ有効）。
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

  const { event, grade, tool } = (body ?? {}) as Record<string, unknown>;
  if (typeof event !== 'string' || !VALID_EVENTS.has(event as StudentFunnelEvent)) {
    return new NextResponse(null, { status: 400 });
  }
  if (grade !== undefined && (typeof grade !== 'string' || !VALID_GRADES.has(grade as StudentGrade))) {
    return new NextResponse(null, { status: 400 });
  }
  if (tool !== undefined && typeof tool !== 'string') {
    return new NextResponse(null, { status: 400 });
  }

  try {
    await persistStudentFunnelEvent({
      event: event as StudentFunnelEvent,
      grade: grade as StudentGrade | undefined,
      tool: tool as string | undefined,
    });
  } catch {
    /* no-op：計測はベストエフォート */
  }

  return new NextResponse(null, { status: 204 });
}
