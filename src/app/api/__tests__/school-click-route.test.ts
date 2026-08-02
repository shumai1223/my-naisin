/**
 * @jest-environment node
 *
 * 学校ページCTAクリック計測ビーコン（/api/school-click）の契約テスト（主食②-2）。
 * D1未バインドのテスト環境でもno-opで204を返す契約と、バリデーション/流量制限を固定する。
 */
import { POST } from '@/app/api/school-click/route';
import { getPrefectureSchoolPageData } from '@/lib/school-page-lookup';
import type { NextRequest } from 'next/server';

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function clickReq(body: unknown, opts: { ip?: string; contentLength?: string } = {}) {
  const raw = JSON.stringify(body);
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'cf-connecting-ip': opts.ip ?? 'test-default',
    'user-agent': BROWSER_UA,
  };
  if (opts.contentLength) headers['content-length'] = opts.contentLength;
  return new Request('https://my-naishin.com/api/school-click', { method: 'POST', headers, body: raw }) as unknown as NextRequest;
}

const tokyoData = getPrefectureSchoolPageData('tokyo');
const sampleSchool = tokyoData?.schools[0];

describe('/api/school-click 契約', () => {
  test('前提: tokyoの学校データが存在する（テストの土台）', () => {
    expect(sampleSchool).toBeDefined();
  });

  test('正当なクリックはD1未バインドでも204', async () => {
    const res = await POST(
      clickReq(
        { prefectureCode: 'tokyo', schoolCode: sampleSchool!.schoolCode, cta: 'reverse' },
        { ip: '2.2.2.1' }
      )
    );
    expect(res.status).toBe(204);
  });

  test('未知のCTA種別は400', async () => {
    const res = await POST(
      clickReq(
        { prefectureCode: 'tokyo', schoolCode: sampleSchool!.schoolCode, cta: 'unknown-cta' },
        { ip: '2.2.2.2' }
      )
    );
    expect(res.status).toBe(400);
  });

  test('存在しない都道府県コードは400', async () => {
    const res = await POST(
      clickReq({ prefectureCode: 'nonexistent', schoolCode: 'x', cta: 'line' }, { ip: '2.2.2.3' })
    );
    expect(res.status).toBe(400);
  });

  test('存在しない学校コードは400', async () => {
    const res = await POST(
      clickReq({ prefectureCode: 'tokyo', schoolCode: 'not-a-real-code', cta: 'line' }, { ip: '2.2.2.4' })
    );
    expect(res.status).toBe(400);
  });

  test('不正なJSONは400', async () => {
    const req = new Request('https://my-naishin.com/api/school-click', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': '2.2.2.5', 'user-agent': BROWSER_UA },
      body: '{not-json',
    }) as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  test('content-lengthが上限超過なら413', async () => {
    const res = await POST(
      clickReq(
        { prefectureCode: 'tokyo', schoolCode: sampleSchool!.schoolCode, cta: 'reverse' },
        { ip: '2.2.2.6', contentLength: '99999' }
      )
    );
    expect(res.status).toBe(413);
  });

  test('同一IPの連打は31回目で429（ベストエフォート流量制限）', async () => {
    const ip = '9.9.9.10';
    let last: Response | undefined;
    for (let i = 0; i < 31; i++) {
      last = await POST(
        clickReq({ prefectureCode: 'tokyo', schoolCode: sampleSchool!.schoolCode, cta: 'line' }, { ip })
      );
    }
    expect(last!.status).toBe(429);
  });
});
