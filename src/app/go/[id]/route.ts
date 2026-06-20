import { NextRequest, NextResponse } from 'next/server';

import { AFFILIATES, isLiveAffiliate, type AffiliateId } from '@/lib/affiliates';
import { persistClick } from '@/lib/clicks-db';
import { isBotUserAgent } from '@/lib/bot-filter';

/**
 * ファーストパーティ・リダイレクタ（P1-1/P1-4）。
 *
 *   GET /go/{affiliateId}?pref=tokyo&placement=result
 *     → D1 にクリックを記録（未バインドなら no-op）
 *     → affiliates.ts の固定 href へ 302
 *
 * 目的：GA4 affiliate_click は ITP/広告ブロッカーで最大3割欠測する。自前ドメインの 302 を
 * くぐらせ D1 に一次記録することで、欠測しないクリック実数（program × 県 × 面）を貯める。
 *
 * セキュリティ：302 先は AFFILIATES の allowlist の href だけ（オープンリダイレクトにしない）。
 * 不明ID・pending・href未設定はホームへ退避（デッドリンクを出さない）。
 */

const SITE = 'https://my-naishin.com';

function clamp(v: string | null, max: number): string | undefined {
  if (!v) return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const affiliate = AFFILIATES[id as AffiliateId];

  // allowlist 外 / pending / href未設定 → ホームへ退避（オープンリダイレクト・デッドリンク防止）
  if (!affiliate || !isLiveAffiliate(id as AffiliateId) || !affiliate.href || affiliate.href === '#') {
    return NextResponse.redirect(`${SITE}/`, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  }

  // ボット/クローラ/スキャナ対策（robots.txt の /go/ disallow を無視する非正規bot向けのサーバ側二重防御）。
  // ASPへ飛ばさず・D1にも記録せずホームへ退避 → ①無効クリックのASP計上(EPC悪化/アカウントリスク)
  // ②クリックデータの汚染（偽の勝者・幻の確定額）を同時に防ぐ。
  if (isBotUserAgent(request.headers.get('user-agent'))) {
    return NextResponse.redirect(`${SITE}/`, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  }

  const url = new URL(request.url);
  // 先にログ（D1未バインドなら no-op）。記録に失敗しても送客（302）は必ず行う。
  try {
    await persistClick({
      affiliateId: id,
      prefecture: clamp(url.searchParams.get('pref'), 40),
      placement: clamp(url.searchParams.get('placement'), 40),
      referer: clamp(request.headers.get('referer'), 300),
    });
  } catch {
    /* no-op：計測はベストエフォート、送客を止めない */
  }

  return NextResponse.redirect(affiliate.href, { status: 302, headers: { 'Cache-Control': 'no-store' } });
}
