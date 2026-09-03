/**
 * @jest-environment node
 *
 * 課金導線（/api/billing/checkout）の契約テスト。
 * 2026-08-13追加のクリックラップ必須化（ops/PRICING_OPTIONS.md #5）＝
 * tosAgreedAt（利用規約への同意時刻）が無い/不正な申し込みを弾くことを固定する。
 */
import { POST } from '@/app/api/billing/checkout/route';
import type { NextRequest } from 'next/server';

function checkoutReq(body: unknown) {
  return new Request('https://my-naishin.com/api/billing/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

describe('/api/billing/checkout 契約', () => {
  const validTos = new Date().toISOString();

  beforeAll(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  test('tier未指定は400', async () => {
    const res = await POST(checkoutReq({ tosAgreedAt: validTos }));
    expect(res.status).toBe(400);
  });

  test('不正なtierは400', async () => {
    const res = await POST(checkoutReq({ tier: 'free', tosAgreedAt: validTos }));
    expect(res.status).toBe(400);
  });

  test('tosAgreedAt未指定はtier有効でも400 tos_not_agreed（クリックラップ必須化）', async () => {
    const res = await POST(checkoutReq({ tier: 'pro' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('tos_not_agreed');
  });

  test('tosAgreedAtが不正な日付文字列でも400 tos_not_agreed', async () => {
    const res = await POST(checkoutReq({ tier: 'pro', tosAgreedAt: 'not-a-date' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('tos_not_agreed');
  });

  test('tier・tosAgreedAtとも有効なら検証は通過する（STRIPE_SECRET_KEY未設定のため503 not_enabledで確認）', async () => {
    const res = await POST(checkoutReq({ tier: 'pro', tosAgreedAt: validTos }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('not_enabled');
  });

  test('scale tierは未設定時503のメッセージが個別見積り案内になる', async () => {
    const res = await POST(checkoutReq({ tier: 'scale', tosAgreedAt: validTos }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.message).toContain('個別見積り');
  });

  test('business tierも検証を通過する（STRIPE_SECRET_KEY未設定のため503 not_enabledで確認・T-SS1 SS1-2）', async () => {
    const res = await POST(checkoutReq({ tier: 'business', tosAgreedAt: validTos }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('not_enabled');
  });
});
