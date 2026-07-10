import { NextRequest, NextResponse } from 'next/server';

import { isValidStatsSubmission, type StatsMetric } from '@/lib/stats-aggregation';
import { insertStatsSubmission } from '@/lib/stats-db';

/**
 * 匿名統計の投稿受け口（S-1・旧N-3）。/api/lead と同方針の公開POST（レート制限あり・API鍵不要）。
 *
 * PII（メール・氏名・IP等）は一切受け取らない・保存しない。個人を特定できる情報を持たないことが
 * 「匿名で統計に協力する」（stats-consent.ts・StatsOptIn）という同意文言の前提。
 *
 * migration 0007 適用済み・呼び出し元は src/lib/stats-submit-client.ts（同意済みユーザーの
 * 結果のみ送信）。2026-07-11時点で/hensachiに結線済み（他計算機面への展開は継続タスク）。
 */

type SubmitBody = {
  metric?: unknown;
  prefectureCode?: unknown;
  value?: unknown;
  maxValue?: unknown;
};

const MAX_BODY_BYTES = 512; // 数値+短い文字列のみ・PIIが無い分/api/leadより小さく絞る
const PREF_CODE_MAX_LEN = 20;

// ベストエフォートのIPレート制限（モジュールスコープ＝ウォームアイソレート内のみ有効）。
const RATE = { windowMs: 60_000, max: 10 };
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

    const prefectureCode =
      typeof parsed.prefectureCode === 'string' && parsed.prefectureCode.trim()
        ? parsed.prefectureCode.trim().slice(0, PREF_CODE_MAX_LEN)
        : undefined;

    const submission = {
      metric: parsed.metric as StatsMetric,
      value: parsed.value,
      maxValue: parsed.maxValue,
      prefectureCode,
    };

    if (!isValidStatsSubmission(submission)) {
      return NextResponse.json({ error: '入力内容が不正です。' }, { status: 400 });
    }

    const saved = await insertStatsSubmission(submission);
    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error('Stats submit API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
