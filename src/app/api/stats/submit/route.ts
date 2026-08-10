import { NextRequest, NextResponse } from 'next/server';

import { isValidStatsSubmission, type StatsMetric } from '@/lib/stats-aggregation';
import { insertStatsSubmission } from '@/lib/stats-db';
import { classifyClick, isBotUserAgent, isPrefetchRequest, isInternalReferer } from '@/lib/bot-filter';

/**
 * 匿名統計の投稿受け口（S-1・旧N-3）。/api/lead と同方針の公開POST（レート制限あり・API鍵不要）。
 *
 * PII（メール・氏名・IP等）は一切受け取らない・保存しない。個人を特定できる情報を持たないことが
 * 「匿名で統計に協力する」（stats-consent.ts・StatsOptIn）という同意文言の前提。
 *
 * ── DW-1（2026-08-10）の是正 ─────────────────────────────────────────────
 * 事故: このエンドポイントには**ボットUA検査もオリジン検査も無かった**。
 *   レート制限はモジュールスコープのMapで、アイソレート分散により分散IPには貫通する
 *   （2026-07-16に別経路で実証済み）。結果、自動投稿が混入し、本番が
 *   「偏差値の全国平均 = 63.16」を配信していた（偏差値は定義上、母集団平均が50）。
 *   実測: hensachi 263件中243件(92%)が5日に集中。同期間のGA4 stats_optin_grant は28日で10件。
 *
 * 対策: /go ルートで得た教訓をそのまま適用する。
 *   実ブラウザの同一オリジン遷移は必ず my-naishin.com の referer/origin を伴う
 *   （リンクに noreferrer を付けておらず、Referrer-Policy 既定で same-origin はURLを送る）。
 *   よって「内部オリジンの有無」が人/botの強い分離軸になる（bot-filter.ts:43-47）。
 *
 *   - ボットUA・空UA・プリフェッチ … 保存せず 204（攻撃側に成否を教えない）
 *   - 内部オリジン無し             … 保存はするが trusted=0（集計には入らない・規模の検証用に残す）
 *   - ブラウザUA かつ 内部オリジン … trusted=1（集計対象）
 *
 * ⚠️ この検査を緩めると DW-1 が再発する。緩める場合は
 *   src/lib/__tests__/stats-submit-provenance.test.ts の契約を先に読むこと。
 * ───────────────────────────────────────────────────────────────────────
 *
 * migration 0007 / 0019 適用済み・呼び出し元は src/lib/stats-submit-client.ts（同意済みユーザーの
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

/**
 * 送信元の真正性を判定する（DW-1）。
 * Origin ヘッダを優先し、無ければ Referer で判定する（fetch は同一オリジンPOSTに Origin を付ける）。
 * 純粋関数として切り出し、テストから直接叩けるようにしている。
 */
export function classifySubmission(headers: { get(name: string): string | null }): ReturnType<typeof classifyClick> {
  const ua = headers.get('user-agent');
  const origin = headers.get('origin');
  const referer = headers.get('referer');
  // Origin は "https://my-naishin.com" の形。isInternalReferer はURLとして解釈するのでそのまま渡せる。
  const internalOrigin = isInternalReferer(origin) || isInternalReferer(referer);
  return classifyClick({ userAgent: ua, referer: internalOrigin ? 'https://my-naishin.com/' : null });
}

export async function POST(request: NextRequest) {
  try {
    // DW-1: ボット・プリフェッチは保存もしない。204で無言に落とす（攻撃側に成否を教えない）。
    if (isBotUserAgent(request.headers.get('user-agent')) || isPrefetchRequest(request.headers)) {
      return new NextResponse(null, { status: 204 });
    }

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

    // DW-1: 出所の信頼度を添えて保存する。'human' 以外は trusted=0 で集計から外れる。
    const trustClass = classifySubmission(request.headers);
    const saved = await insertStatsSubmission(submission, { trustClass });
    // 応答は従来どおり（trusted かどうかは返さない＝判定基準を攻撃側に晒さない）。
    return NextResponse.json({ success: true, saved });
  } catch (error) {
    console.error('Stats submit API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
