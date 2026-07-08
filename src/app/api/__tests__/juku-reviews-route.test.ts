/**
 * @jest-environment node
 *
 * 塾口コミAPI（/api/juku-reviews/submit・/api/juku-reviews）の契約テスト（TIER R-1第2弾）。
 * D1バインディング未設定（テスト環境）を前提に、no-opフォールバック契約を固定する。
 */
import { POST as submitPOST } from '@/app/api/juku-reviews/submit/route';
import { GET as reviewsGET } from '@/app/api/juku-reviews/route';
import { JUKU_OFFERS } from '@/lib/juku-match';
import type { NextRequest } from 'next/server';

const validJukuId = JUKU_OFFERS[0].id;

function submitReq(body: unknown, opts: { ip?: string; contentLength?: string } = {}) {
  const raw = JSON.stringify(body);
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'cf-connecting-ip': opts.ip ?? 'test-default',
  };
  if (opts.contentLength) headers['content-length'] = opts.contentLength;
  return new Request('https://my-naishin.com/api/juku-reviews/submit', { method: 'POST', headers, body: raw }) as unknown as NextRequest;
}

function reviewsReq(query: string, opts: { ip?: string } = {}) {
  return new Request(`https://my-naishin.com/api/juku-reviews${query}`, {
    headers: { 'cf-connecting-ip': opts.ip ?? 'test-default' },
  });
}

describe('/api/juku-reviews/submit 契約', () => {
  test('妥当な投稿はsuccess:true・status:pending・D1未設定なのでsaved:false', async () => {
    const res = await submitPOST(
      submitReq({ jukuId: validJukuId, rating: 5, comment: 'とても丁寧に教えてもらえて助かりました。' }, { ip: '4.1.1.1' })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.saved).toBe(false);
    expect(json.status).toBe('pending');
  });

  test('未登録の塾idは400', async () => {
    const res = await submitPOST(submitReq({ jukuId: 'unknown-juku', rating: 5, comment: '1234567890' }, { ip: '4.1.1.2' }));
    expect(res.status).toBe(400);
  });

  test('評価が範囲外は400', async () => {
    const res = await submitPOST(submitReq({ jukuId: validJukuId, rating: 0, comment: '1234567890' }, { ip: '4.1.1.3' }));
    expect(res.status).toBe(400);
  });

  test('コメントが短すぎは400', async () => {
    const res = await submitPOST(submitReq({ jukuId: validJukuId, rating: 5, comment: '短い' }, { ip: '4.1.1.4' }));
    expect(res.status).toBe(400);
  });

  test('content-lengthが上限超過なら413', async () => {
    const res = await submitPOST(
      submitReq({ jukuId: validJukuId, rating: 5, comment: '1234567890' }, { ip: '4.1.1.5', contentLength: '99999' })
    );
    expect(res.status).toBe(413);
  });

  test('同一IPの連打は6回目で429', async () => {
    const ip = '9.9.9.20';
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) {
      last = await submitPOST(submitReq({ jukuId: validJukuId, rating: 5, comment: '1234567890' }, { ip }));
    }
    expect(last!.status).toBe(429);
  });
});

describe('/api/juku-reviews (GET) 契約', () => {
  test('jukuId未指定は400', async () => {
    const res = await reviewsGET(reviewsReq('', { ip: '5.1.1.1' }));
    expect(res.status).toBe(400);
  });

  test('未登録の塾idは400', async () => {
    const res = await reviewsGET(reviewsReq('?jukuId=unknown-juku', { ip: '5.1.1.2' }));
    expect(res.status).toBe(400);
  });

  test('妥当なjukuIdはD1未設定なので空配列（承認済みのみ返す契約・0件でも捏造しない）', async () => {
    const res = await reviewsGET(reviewsReq(`?jukuId=${validJukuId}`, { ip: '5.1.1.3' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.reviews).toEqual([]);
    expect(json.meta.jukuId).toBe(validJukuId);
    expect(json.meta.count).toBe(0);
  });
});
