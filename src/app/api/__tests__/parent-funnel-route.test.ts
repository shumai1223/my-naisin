/**
 * @jest-environment node
 *
 * /api/parent-funnel（TIER Σ-3の保護者ファネル計測ビーコン）の契約テスト。
 * beaconParentFunnelEvent(クライアント側)は既にparent-funnel-beacon.test.tsでカバー済みだが、
 * このルートハンドラ自体が持つ多段の入力ゲート(bot UA早期リターン・IPレート制限・
 * content-length/実ボディサイズ上限・JSON parse・event/medium enum・hoursSinceSentの範囲検証)は
 * 無テストだった。persistParentFunnelEventをモックし呼び出し引数を直接検証する。
 */
jest.mock('@/lib/parent-funnel-db', () => ({ persistParentFunnelEvent: jest.fn() }));
import { persistParentFunnelEvent } from '@/lib/parent-funnel-db';
import { POST } from '@/app/api/parent-funnel/route';

const mockedPersist = persistParentFunnelEvent as jest.MockedFunction<typeof persistParentFunnelEvent>;

const HUMAN_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

function postReq(body: string, headers: Record<string, string> = {}) {
  return new Request('https://my-naishin.com/api/parent-funnel', {
    method: 'POST',
    body,
    headers: { 'user-agent': HUMAN_UA, 'cf-connecting-ip': freshIp(), ...headers },
  }) as never;
}

beforeEach(() => {
  mockedPersist.mockReset();
  mockedPersist.mockResolvedValue(undefined);
});

describe('/api/parent-funnel', () => {
  it('正常なeventのみのリクエストは204でpersistParentFunnelEventを呼ぶ', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent' })));
    expect(res.status).toBe(204);
    expect(mockedPersist).toHaveBeenCalledWith({
      event: 'share_to_parent',
      medium: undefined,
      prefectureCode: undefined,
      hoursSinceSent: undefined,
    });
  });

  it('medium/prefectureCode/hoursSinceSentを全部含めても204で正しく引き渡す', async () => {
    const res = await POST(
      postReq(JSON.stringify({ event: 'line_registration_click', medium: 'line', prefectureCode: 'tokyo', hoursSinceSent: 5 }))
    );
    expect(res.status).toBe(204);
    expect(mockedPersist).toHaveBeenCalledWith({
      event: 'line_registration_click',
      medium: 'line',
      prefectureCode: 'tokyo',
      hoursSinceSent: 5,
    });
  });

  it('bot UAは204を返しpersistParentFunnelEventを呼ばない(計測汚染の防止)', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/parent-funnel', {
        method: 'POST',
        body: JSON.stringify({ event: 'share_to_parent' }),
        headers: { 'user-agent': 'Googlebot/2.1', 'cf-connecting-ip': freshIp() },
      }) as never
    );
    expect(res.status).toBe(204);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('UA未指定(空)もbot扱いで204・呼び出しなし', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/parent-funnel', {
        method: 'POST',
        body: JSON.stringify({ event: 'share_to_parent' }),
        headers: { 'cf-connecting-ip': freshIp() },
      }) as never
    );
    expect(res.status).toBe(204);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('未知のevent値は400を返し呼び出しなし', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'not-a-real-event' })));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('未知のmedium値は400を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent', medium: 'fax' })));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('prefectureCodeが文字列でない場合は400を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent', prefectureCode: 123 })));
    expect(res.status).toBe(400);
  });

  it('hoursSinceSentが負・非有限・8760超のいずれも400を返す', async () => {
    for (const bad of [-1, NaN, 8761]) {
      const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent', hoursSinceSent: bad })));
      expect(res.status).toBe(400);
    }
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('hoursSinceSentが0または8760(境界値)は許可される', async () => {
    const res1 = await POST(postReq(JSON.stringify({ event: 'share_to_parent', hoursSinceSent: 0 })));
    expect(res1.status).toBe(204);
    const res2 = await POST(postReq(JSON.stringify({ event: 'share_to_parent', hoursSinceSent: 8760 })));
    expect(res2.status).toBe(204);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(postReq('{not json'));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('content-lengthヘッダが256バイトを超えると413を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent' }), { 'content-length': '99999' }));
    expect(res.status).toBe(413);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('実ボディが256バイトを超えると413を返す(content-lengthヘッダが無くても素通しにしない)', async () => {
    const oversized = JSON.stringify({ event: 'share_to_parent', prefectureCode: 'x'.repeat(300) });
    const res = await POST(postReq(oversized));
    expect(res.status).toBe(413);
  });

  it('persistParentFunnelEventが例外を投げても204を返す(計測はベストエフォート)', async () => {
    mockedPersist.mockRejectedValue(new Error('D1 write failed'));
    const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent' })));
    expect(res.status).toBe(204);
  });

  it('同一IPから60秒内に31件目を送るとrate_limitedとして429を返す', async () => {
    const ip = freshIp();
    let lastStatus = 0;
    for (let i = 0; i < 31; i++) {
      const res = await POST(postReq(JSON.stringify({ event: 'share_to_parent' }), { 'cf-connecting-ip': ip }));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
