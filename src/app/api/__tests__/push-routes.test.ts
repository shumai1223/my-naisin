/**
 * @jest-environment node
 *
 * /api/push/subscribe・/api/push/unsubscribe（H-NEW）の契約テスト。push-db.ts/push-config.tsは
 * 既にno-op安全設計を単体テスト済みだが、ルートハンドラ自体が持つ入力ゲート
 * (ボディサイズ上限・IPレート制限・JSON parseエラー・購読形式バリデーション)は無テストだった。
 * D1(LEADS_DB)未設定のテスト環境ではsaveSubscription/revokeSubscriptionはno-opでstored:falseを
 * 返す(push-db.test.tsで既に確認済みの契約)ため、ここではルートハンドラの入力検証層のみを対象にする。
 *
 * ⚠️subscribeルートのIPレート制限(60秒10件/IP)はモジュールスコープのMapに状態を持ち、
 * テスト間でリセットする手段が実装側に無い。テストごとに異なるcf-connecting-ipヘッダを
 * 割り当ててバケットを分離することで、テスト間の干渉を避ける。
 */
import { POST as subscribePost } from '@/app/api/push/subscribe/route';
import { POST as unsubscribePost } from '@/app/api/push/unsubscribe/route';

function postReq(url: string, body: string, headers: Record<string, string> = {}) {
  return new Request(url, { method: 'POST', body, headers });
}

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

describe('/api/push/subscribe', () => {
  it('正しい購読形式はok:trueを返す(D1未設定のテスト環境ではstored:falseだが例外にならない)', async () => {
    const body = JSON.stringify({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
        keys: { p256dh: 'valid-p256dh', auth: 'valid-auth' },
      },
      prefecture: 'tokyo',
      audience: 'parent',
    });
    const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', body, {
      'cf-connecting-ip': freshIp(),
    }) as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, stored: false });
  });

  it('不正なJSONはinvalid_json・400を返す', async () => {
    const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', '{not json', {
      'cf-connecting-ip': freshIp(),
    }) as never);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_json');
  });

  it('endpoint/keys欠落はinvalid_subscription・400を返す', async () => {
    const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', JSON.stringify({}), {
      'cf-connecting-ip': freshIp(),
    }) as never);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_subscription');
  });

  it('ボディが4096バイトを超えるとpayload_too_large・413を返す', async () => {
    const oversized = 'x'.repeat(4097);
    const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', oversized, {
      'cf-connecting-ip': freshIp(),
    }) as never);
    expect(res.status).toBe(413);
    expect((await res.json()).error).toBe('payload_too_large');
  });

  it('prefecture/audienceは40/16文字に切り詰められる(overflowでも例外にならない)', async () => {
    const body = JSON.stringify({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
        keys: { p256dh: 'valid-p256dh', auth: 'valid-auth' },
      },
      prefecture: 'x'.repeat(100),
      audience: 'y'.repeat(100),
    });
    const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', body, {
      'cf-connecting-ip': freshIp(),
    }) as never);
    expect(res.status).toBe(200);
  });

  it('同一IPから60秒内に11件目を送るとrate_limited・429を返す', async () => {
    const ip = freshIp();
    const body = JSON.stringify({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/rate-limit-test',
        keys: { p256dh: 'valid-p256dh', auth: 'valid-auth' },
      },
    });
    let lastStatus = 0;
    for (let i = 0; i < 11; i++) {
      const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', body, {
        'cf-connecting-ip': ip,
      }) as never);
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });

  it('x-forwarded-forヘッダからもIPを取り出せる(先頭要素を使用)', async () => {
    const body = JSON.stringify({
      subscription: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/xff-test',
        keys: { p256dh: 'valid-p256dh', auth: 'valid-auth' },
      },
    });
    const res = await subscribePost(postReq('https://my-naishin.com/api/push/subscribe', body, {
      'x-forwarded-for': `${freshIp()}, 10.0.0.1`,
    }) as never);
    expect(res.status).toBe(200);
  });
});

describe('/api/push/unsubscribe', () => {
  it('https://始まりの有効なendpointはok:trueを返す', async () => {
    const res = await unsubscribePost(
      postReq('https://my-naishin.com/api/push/unsubscribe', JSON.stringify({ endpoint: 'https://fcm.googleapis.com/fcm/send/abc123' })) as never
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true, stored: false });
  });

  it('不正なJSONはinvalid_json・400を返す', async () => {
    const res = await unsubscribePost(postReq('https://my-naishin.com/api/push/unsubscribe', '{not json') as never);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_json');
  });

  it('endpoint欠落・http始まり・1000文字超はいずれもinvalid_endpoint・400を返す', async () => {
    const cases = [
      JSON.stringify({}),
      JSON.stringify({ endpoint: 'http://fcm.googleapis.com/fcm/send/abc123' }),
      JSON.stringify({ endpoint: 'https://' + 'a'.repeat(1000) }),
    ];
    for (const body of cases) {
      const res = await unsubscribePost(postReq('https://my-naishin.com/api/push/unsubscribe', body) as never);
      expect(res.status).toBe(400);
      expect((await res.json()).error).toBe('invalid_endpoint');
    }
  });

  it('ボディが2048バイトを超えるとpayload_too_large・413を返す', async () => {
    const oversized = 'x'.repeat(2049);
    const res = await unsubscribePost(postReq('https://my-naishin.com/api/push/unsubscribe', oversized) as never);
    expect(res.status).toBe(413);
    expect((await res.json()).error).toBe('payload_too_large');
  });
});
