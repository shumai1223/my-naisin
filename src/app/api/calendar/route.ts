import { buildJukenIcs, currentAcademicStartYear } from '@/lib/juken-schedule';

/**
 * 受験準備カレンダーの「購読できる」ICSフィード（N14・堀A＝Google非依存の再訪チャネル）。
 *
 *   GET /api/calendar          … 今年度の受験準備カレンダー（text/calendar）
 *   GET /api/calendar?year=2026 … 指定年度
 *
 * ダウンロード（JukenIcsButton）と違い、これは webcal:// で購読すると各カレンダーアプリが
 * 定期取得する＝月別ToDoを“配信し続ける”継続接点になる。県別の確定日程は持たない（準備リマインダー）。
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const yParam = url.searchParams.get('year');
  const year = yParam && /^\d{4}$/.test(yParam) ? Number(yParam) : currentAcademicStartYear();
  const ics = buildJukenIcs(year);

  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="my-naishin-juken-${year}.ics"`,
      // 購読クライアントの再取得を考慮し1日キャッシュ。
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
