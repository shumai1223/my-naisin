import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';

import { isJukuSaasEnabled } from '@/lib/juku-saas/flag';
import { recordReferral } from '@/lib/juku-matching-db';

/**
 * 保護者向け「提携塾に紹介を依頼する」送客ボタンの受け口（Λ-7残作業・Ω-6公開導線）。
 * /api/juku-reviews/submitと同方針の公開POST（API tier認証は不要・軽量レート制限のみ）。
 *
 * PIIは一切受け取らない・保存しない。studentRefはこのリクエスト用にサーバー側で
 * 生成する匿名UUID（ユーザー入力は使わない＝入力欄からのPII混入を構造的に防ぐ）。
 *
 * NEXT_PUBLIC_JUKU_SAAS_ENABLED='1'（既定off）の時だけ機能する。旗offはpage.tsx側で
 * 404にする設計だが、直接POSTされた場合の防御としてAPI側でも二重に確認する。
 */

type ReferralBody = {
  jukuPartnerId?: unknown;
  prefectureCode?: unknown;
  format?: unknown;
};

const MAX_BODY_BYTES = 1024;
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
  if (!isJukuSaasEnabled(process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED)) {
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

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

    let parsed: ReferralBody;
    try {
      parsed = raw ? (JSON.parse(raw) as ReferralBody) : {};
    } catch {
      return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 });
    }

    const jukuPartnerId = Number(parsed.jukuPartnerId);
    if (!Number.isFinite(jukuPartnerId)) {
      return NextResponse.json({ error: '提携塾を指定してください。' }, { status: 400 });
    }
    const prefectureCode =
      typeof parsed.prefectureCode === 'string' ? parsed.prefectureCode.trim().slice(0, 40) || undefined : undefined;
    const format = parsed.format === 'online' || parsed.format === 'in-person' ? parsed.format : undefined;

    const referralId = await recordReferral({
      jukuPartnerId,
      studentRef: `web-${randomUUID()}`,
      prefectureCode,
      format,
    });

    if (referralId === null) {
      return NextResponse.json(
        { error: '送信に失敗しました。時間をおいて再度お試しください。' },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('juku-matching referral API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
