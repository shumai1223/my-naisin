import { EXAM_SCHEDULE_BY_PREFECTURE } from '@/data/exam-schedules';
import { buildExamScheduleIcs } from '@/lib/exam-schedule';
import { PREFECTURES } from '@/lib/prefectures';

/**
 * T-Y12段階3: 県別入試日程の「購読できる」ICSフィード（N14の県別版・堀A）。
 *
 *   GET /api/calendar/{prefecture}（例: /api/calendar/ibaraki）
 *
 * /api/calendar（全国共通・月レベルの準備リマインダー）とは別物。こちらは教育委員会公表の
 * 確定日程（出願期間・学力検査日・合格発表日等）をそのまま配信する。認証・課金は無し
 * （/api/schools/{pref}等の堀B有料APIとは異なる、無料の消費者向け機能）。
 */
export async function GET(_request: Request, { params }: { params: Promise<{ prefecture: string }> }) {
  const { prefecture } = await params;
  const file = EXAM_SCHEDULE_BY_PREFECTURE[prefecture];
  const pref = PREFECTURES.find((p) => p.code === prefecture);

  if (!file || !pref) {
    return new Response('Not Found', { status: 404 });
  }

  const ics = buildExamScheduleIcs(file, pref.name);

  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="my-naishin-nyuushi-nittei-${prefecture}.ics"`,
      // 購読クライアントの再取得を考慮し1日キャッシュ（/api/calendarと同じ方針）。
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
