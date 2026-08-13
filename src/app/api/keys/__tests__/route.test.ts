/**
 * @jest-environment node
 *
 * 無料APIキー自己発行口（/api/keys）の契約テスト。D1バインディングが無い
 * テスト/ビルド環境では issueApiKey/lookupApiKey が休眠しnullを返す設計
 * （getDb()のtry/catch）を利用し、DBモック無しでルートの契約を固定する。
 * 2026-08-13追加のtosAgreedAt（任意・記録のみ・クリックラップ非必須）が
 * 応答契約を壊さないことも確認する。
 */
import { GET, POST } from '@/app/api/keys/route';
import type { NextRequest } from 'next/server';

function postReq(body: unknown) {
  return new Request('https://my-naishin.com/api/keys', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

function getReq(authHeader?: string) {
  return new Request('https://my-naishin.com/api/keys', {
    method: 'GET',
    headers: authHeader ? { authorization: authHeader } : {},
  }) as unknown as NextRequest;
}

describe('POST /api/keys 契約（D1未接続＝テスト環境）', () => {
  test('label/emailのみでも503 not_enabled（サイレント失敗にしない）', async () => {
    const res = await POST(postReq({ label: 'my app' }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('not_enabled');
    expect(json.anonymous).toBeDefined();
  });

  test('tosAgreedAt（有効な日時）を含めても応答契約は変わらない（記録のみ・非必須）', async () => {
    const res = await POST(postReq({ tosAgreedAt: new Date().toISOString() }));
    expect(res.status).toBe(503);
  });

  test('tosAgreedAtが不正な文字列でもエラーにならない（非必須のため無視される）', async () => {
    const res = await POST(postReq({ tosAgreedAt: 'not-a-date' }));
    expect(res.status).toBe(503);
  });

  test('空ボディでも受け付ける（label/emailは任意）', async () => {
    const res = await POST(postReq({}));
    expect(res.status).toBe(503);
  });
});

describe('GET /api/keys 契約', () => {
  test('Authorizationヘッダ無しは400 no_key', async () => {
    const res = await GET(getReq());
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('no_key');
  });

  test('キーを提示してもD1未接続なら404（valid:false）', async () => {
    const res = await GET(getReq('Bearer mnsk_live_dummy'));
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.valid).toBe(false);
  });
});
