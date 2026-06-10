/**
 * @jest-environment node
 *
 * 名簿リード受け口（/api/lead）の契約テスト。
 * 堀Aの入口として、バリデーション・スパム耐性（サイズ/流量制限）・webhook未設定時のフォールバック契約を固定する。
 */
import { POST } from '@/app/api/lead/route';
import type { NextRequest } from 'next/server';

function leadReq(body: unknown, opts: { ip?: string; contentLength?: string } = {}) {
  const raw = JSON.stringify(body);
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'cf-connecting-ip': opts.ip ?? 'test-default',
  };
  if (opts.contentLength) headers['content-length'] = opts.contentLength;
  return new Request('https://my-naishin.com/api/lead', { method: 'POST', headers, body: raw }) as unknown as NextRequest;
}

const valid = { email: 'a@b.com', consent: true, source: 'result', prefectureCode: 'tokyo' };

describe('/api/lead 契約', () => {
  beforeAll(() => {
    // webhook未設定の前提を固定（環境に値があってもこのテストでは無効化）
    delete process.env.LEAD_WEBHOOK_URL;
    delete process.env.CONTACT_WEBHOOK_URL;
  });

  test('正当なリードはwebhook未設定でも success:true / delivered:false（mailtoフォールバック契約）', async () => {
    const res = await POST(leadReq(valid, { ip: '1.1.1.1' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.delivered).toBe(false);
  });

  test('不正なメールは400', async () => {
    const res = await POST(leadReq({ ...valid, email: 'not-an-email' }, { ip: '1.1.1.2' }));
    expect(res.status).toBe(400);
  });

  test('同意なしは400', async () => {
    const res = await POST(leadReq({ ...valid, consent: false }, { ip: '1.1.1.3' }));
    expect(res.status).toBe(400);
  });

  test('content-lengthが上限超過なら413', async () => {
    const res = await POST(leadReq(valid, { ip: '1.1.1.4', contentLength: '99999' }));
    expect(res.status).toBe(413);
  });

  test('同一IPの連打は7回目で429（ベストエフォート流量制限）', async () => {
    const ip = '9.9.9.9';
    let last: Response | undefined;
    for (let i = 0; i < 7; i++) {
      last = await POST(leadReq(valid, { ip }));
    }
    expect(last!.status).toBe(429);
  });
});
