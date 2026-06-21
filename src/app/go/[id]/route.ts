import { NextRequest, NextResponse } from 'next/server';

import { AFFILIATES, isLiveAffiliate, type AffiliateId } from '@/lib/affiliates';
import { persistClick, countRecentClicksByIp } from '@/lib/clicks-db';
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

/**
 * placement クエリが無いクリック（素のバナー等）を、同一オリジンの referer パスから面に推定する。
 * これで「placement未付与＝(不明)」をページ単位で取りこぼさず回収（referer がある実クリックに限る）。
 * 外部 referer・referer無し（bot/直叩き）は undefined のまま（=偽の面を作らない）。
 */
function placementFromReferer(referer: string | null): string | undefined {
  if (!referer) return undefined;
  try {
    const u = new URL(referer);
    if (!u.hostname.endsWith('my-naishin.com')) return undefined;
    const path = u.pathname.replace(/\/+$/, '') || '/';
    return path.slice(0, 40);
  } catch {
    return undefined;
  }
}

/** 生IPは保存せず SHA-256 の先頭16桁ハッシュにする（PII最小・同一送信元の判定には十分）。 */
async function hashIp(ip: string): Promise<string | undefined> {
  const t = ip.trim();
  if (!t) return undefined;
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`my-naishin:${t}`));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
  } catch {
    return undefined;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const affiliate = AFFILIATES[id as AffiliateId];

  // allowlist 外 / pending / href未設定 → ホームへ退避（オープンリダイレクト・デッドリンク防止）
  if (!affiliate || !isLiveAffiliate(id as AffiliateId) || !affiliate.href || affiliate.href === '#') {
    return NextResponse.redirect(`${SITE}/`, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  }

  const ua = request.headers.get('user-agent');

  // ① UAでボットを弾く（robots.txt の /go/ disallow を無視する非正規bot向けのサーバ側二重防御）。
  // ASPへ飛ばさず・D1にも記録せずホームへ退避 → 無効クリックのASP計上(EPC悪化)＋データ汚染を同時に防ぐ。
  if (isBotUserAgent(ua)) {
    return NextResponse.redirect(`${SITE}/`, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  }

  // ② 同一IPの短時間バースト（ブラウザ風UAのbot・連打）をレート制限で弾く。
  // 直近120秒に同一IPハッシュで6件以上＝人間の購買行動ではない → ホーム退避（記録もしない）。フェイルオープン。
  const ipRaw = (request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? '').split(',')[0];
  const ipHash = await hashIp(ipRaw);
  if (ipHash && (await countRecentClicksByIp(ipHash, 120)) >= 6) {
    return NextResponse.redirect(`${SITE}/`, { status: 302, headers: { 'Cache-Control': 'no-store' } });
  }

  const url = new URL(request.url);
  const refererRaw = request.headers.get('referer');
  // 先にログ（D1未バインドなら no-op）。記録に失敗しても送客（302）は必ず行う。
  try {
    await persistClick({
      affiliateId: id,
      prefecture: clamp(url.searchParams.get('pref'), 40),
      // placement 明示があれば最優先。無ければ referer パスから面を推定（取りこぼし回収）。
      placement: clamp(url.searchParams.get('placement'), 40) ?? placementFromReferer(refererRaw),
      referer: clamp(refererRaw, 300),
      userAgent: clamp(ua, 300),
      ipHash,
    });
  } catch {
    /* no-op：計測はベストエフォート、送客を止めない */
  }

  return NextResponse.redirect(affiliate.href, { status: 302, headers: { 'Cache-Control': 'no-store' } });
}
