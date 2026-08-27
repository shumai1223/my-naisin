/**
 * @jest-environment node
 *
 * /api/click-hop-complete（出血6②のクリックホップ通過率計測ビーコン）の契約テスト。
 * persistClickHopCompletionをモックし呼び出し引数を直接検証する（student-funnel-route.test.tsと同型）。
 */
jest.mock('@/lib/click-hop-db', () => ({ persistClickHopCompletion: jest.fn() }));
import { persistClickHopCompletion } from '@/lib/click-hop-db';
import { POST } from '@/app/api/click-hop-complete/route';

const mockedPersist = persistClickHopCompletion as jest.MockedFunction<typeof persistClickHopCompletion>;

const HUMAN_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

function postReq(body: string, headers: Record<string, string> = {}) {
  return new Request('https://my-naishin.com/api/click-hop-complete', {
    method: 'POST',
    body,
    headers: { 'user-agent': HUMAN_UA, 'cf-connecting-ip': freshIp(), ...headers },
  }) as never;
}

beforeEach(() => {
  mockedPersist.mockReset();
  mockedPersist.mockResolvedValue(undefined as never);
});

describe('/api/click-hop-complete', () => {
  it('AFFILIATESに実在するaffiliateIdは204でpersistClickHopCompletionを呼ぶ', async () => {
    const res = await POST(postReq(JSON.stringify({ affiliateId: 'zkai-banner' })));
    expect(res.status).toBe(204);
    expect(mockedPersist).toHaveBeenCalledWith('zkai-banner');
  });

  it('bot UAは204を返しpersistClickHopCompletionを呼ばない(計測汚染の防止)', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/click-hop-complete', {
        method: 'POST',
        body: JSON.stringify({ affiliateId: 'zkai-banner' }),
        headers: { 'user-agent': 'Googlebot/2.1', 'cf-connecting-ip': freshIp() },
      }) as never
    );
    expect(res.status).toBe(204);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('AFFILIATESに存在しないaffiliateIdは400を返す(架空データの防止)', async () => {
    const res = await POST(postReq(JSON.stringify({ affiliateId: 'not-a-real-affiliate' })));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('affiliateIdが文字列でない場合は400を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ affiliateId: 123 })));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(postReq('{not json'));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('content-lengthヘッダが128バイトを超えると413を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ affiliateId: 'zkai-banner' }), { 'content-length': '99999' }));
    expect(res.status).toBe(413);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('persistClickHopCompletionが例外を投げても204を返す(計測はベストエフォート)', async () => {
    mockedPersist.mockRejectedValue(new Error('D1 write failed'));
    const res = await POST(postReq(JSON.stringify({ affiliateId: 'zkai-banner' })));
    expect(res.status).toBe(204);
  });

  it('同一IPから60秒内に31件目を送るとrate_limitedとして429を返す', async () => {
    const ip = freshIp();
    let lastStatus = 0;
    for (let i = 0; i < 31; i++) {
      const res = await POST(postReq(JSON.stringify({ affiliateId: 'zkai-banner' }), { 'cf-connecting-ip': ip }));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
