import { NextRequest, NextResponse } from 'next/server';

import { isReviewableJuku, validateReviewSubmission } from '@/lib/juku-reviews';
import { insertJukuReview } from '@/lib/juku-reviews-db';

/**
 * 塾口コミの投稿受け口（TIER R-1第2弾）。/api/lead・/api/stats/submitと同方針の公開POST。
 *
 * 保存時のstatusは常に'pending'（モデレーション必須・validateReviewSubmission/
 * insertJukuReviewが強制）。承認されるまで公開読み出し（GET /api/juku-reviews）には出ない。
 *
 * ⚠️ 2026-07-09時点、このエンドポイントを呼び出す投稿UIは存在しない（R-1第2弾はAPIのみ）。
 * migration 0008 も未適用のため、deploy後もinsertJukuReviewは常にfalse（no-op）。
 */

type SubmitBody = {
  jukuId?: unknown;
  rating?: unknown;
  comment?: unknown;
  prefectureCode?: unknown;
};

const MAX_BODY_BYTES = 2048;

const RATE = { windowMs: 60_000, max: 5 };
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
  try {
    if (!allow(clientIp(request))) {
      return NextResponse.json({ error: 'リクエストが多すぎます。少し時間をおいて再度お試しください。' }, { status: 429 });
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'リクエストが大きすぎます。' }, { status: 413 });
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'リクエストが大きすぎます。' }, { status: 413 });
    }

    let parsed: SubmitBody;
    try {
      parsed = JSON.parse(raw) as SubmitBody;
    } catch {
      return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 });
    }

    if (!isReviewableJuku(parsed.jukuId)) {
      return NextResponse.json({ error: '対象の塾が見つかりません。' }, { status: 400 });
    }

    const submission = {
      jukuId: parsed.jukuId,
      rating: parsed.rating,
      comment: parsed.comment,
      prefectureCode: typeof parsed.prefectureCode === 'string' ? parsed.prefectureCode.slice(0, 20) : undefined,
    };

    const validation = validateReviewSubmission(submission);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.reason ?? '入力内容が不正です。' }, { status: 400 });
    }

    const saved = await insertJukuReview(submission);
    return NextResponse.json({ success: true, saved, status: 'pending' });
  } catch (error) {
    console.error('Juku review submit API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
