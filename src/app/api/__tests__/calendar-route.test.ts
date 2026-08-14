/**
 * @jest-environment node
 *
 * /api/calendar（N14・受験準備カレンダーのICS購読フィード）の契約テスト。
 * buildJukenIcs/currentAcademicStartYear自体はjuken-schedule.test.tsで既にカバー済みだが、
 * ルートハンドラのyearクエリパラメータのバリデーション(4桁数字のみ許可・不正値は既定年度へ
 * フォールバック)とレスポンスヘッダ(Content-Type/Content-Disposition/Cache-Control)は無テストだった。
 */
import { GET } from '@/app/api/calendar/route';
import { currentAcademicStartYear } from '@/lib/juken-schedule';

function req(url: string) {
  return new Request(url);
}

describe('/api/calendar', () => {
  it('year未指定は既定年度(currentAcademicStartYear)のICSを返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/calendar'));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Disposition')).toContain(`my-naishin-juken-${currentAcademicStartYear()}.ics`);
    const text = await res.text();
    expect(text).toContain('BEGIN:VCALENDAR');
  });

  it('4桁数字のyearを指定すればその年度のICSを返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/calendar?year=2026'));
    expect(res.headers.get('Content-Disposition')).toContain('my-naishin-juken-2026.ics');
  });

  it('4桁でないyear(3桁/5桁/非数字)は既定年度へフォールバックする', async () => {
    for (const bad of ['123', '20266', 'abcd']) {
      const res = await GET(req(`https://my-naishin.com/api/calendar?year=${bad}`));
      expect(res.headers.get('Content-Disposition')).toContain(`my-naishin-juken-${currentAcademicStartYear()}.ics`);
    }
  });

  it('Content-Type/Cache-Controlヘッダが正しい', async () => {
    const res = await GET(req('https://my-naishin.com/api/calendar'));
    expect(res.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400, s-maxage=86400');
  });
});
