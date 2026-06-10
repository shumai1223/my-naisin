/**
 * @jest-environment node
 *
 * お問い合わせ/不具合報告（/api/contact）の契約テスト。
 * 空送信の弾き／webhook未設定時のフォールバック契約（delivered:false）を固定する。
 */
import { POST } from '@/app/api/contact/route';
import type { NextRequest } from 'next/server';

function contactReq(body: unknown) {
  return new Request('https://my-naishin.com/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('/api/contact 契約', () => {
  beforeAll(() => {
    delete process.env.CONTACT_WEBHOOK_URL;
  });

  test('一般問い合わせ（内容あり）はwebhook未設定でも success/delivered:false', async () => {
    const res = await POST(contactReq({ type: 'general', message: 'テスト', email: 'a@b.com' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.delivered).toBe(false);
  });

  test('内容が空なら400', async () => {
    const res = await POST(contactReq({ type: 'general', message: '   ' }));
    expect(res.status).toBe(400);
  });

  test('不具合報告は description 必須（空は400）', async () => {
    const res = await POST(contactReq({ type: 'bug', description: '' }));
    expect(res.status).toBe(400);
  });

  test('不具合報告（description あり）は200', async () => {
    const res = await POST(contactReq({ type: 'bug', description: '計算結果が表示されない', device: 'iPhone' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
