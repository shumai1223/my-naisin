/**
 * @jest-environment node
 *
 * /api/calendar/{prefecture}（T-Y12段階3・県別入試日程のICS購読フィード）の契約テスト。
 * buildExamScheduleIcs自体はexam-schedule.test.tsでカバー済み。ここではルートハンドラの
 * 存在確認404・レスポンスヘッダ・実データ(ibaraki)での疎通のみを見る。
 */
import { GET } from '@/app/api/calendar/[prefecture]/route';

function req(url: string) {
  return new Request(url);
}

function ctx(prefecture: string) {
  return { params: Promise.resolve({ prefecture }) };
}

describe('/api/calendar/[prefecture]', () => {
  it('実在する県コード(ibaraki)はICSを200で返す', async () => {
    const res = await GET(req('https://my-naishin.com/api/calendar/ibaraki'), ctx('ibaraki'));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('BEGIN:VCALENDAR');
    expect(text).toContain('【茨城県】');
  });

  it('存在しない県コードは404', async () => {
    const res = await GET(req('https://my-naishin.com/api/calendar/atlantis'), ctx('atlantis'));
    expect(res.status).toBe(404);
  });

  it('Content-Type/Content-Disposition/Cache-Controlヘッダが正しい', async () => {
    const res = await GET(req('https://my-naishin.com/api/calendar/ibaraki'), ctx('ibaraki'));
    expect(res.headers.get('Content-Type')).toBe('text/calendar; charset=utf-8');
    expect(res.headers.get('Content-Disposition')).toContain('my-naishin-nyuushi-nittei-ibaraki.ics');
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400, s-maxage=86400');
  });
});
