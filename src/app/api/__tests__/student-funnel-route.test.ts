/**
 * @jest-environment node
 *
 * /api/student-funnel（S12-1の生徒ファネル計測ビーコン）の契約テスト。
 * beaconStudentFunnelEvent(クライアント側)は既にstudent-funnel-beacon.test.tsでカバー済みだが、
 * このルートハンドラ自体が持つ多段の入力ゲート(bot UA早期リターン・IPレート制限・
 * content-length/実ボディサイズ上限・JSON parse・event/grade enum)は無テストだった。
 * persistStudentFunnelEventをモックし呼び出し引数を直接検証する（parent-funnel-route.test.tsと同型）。
 */
jest.mock('@/lib/student-funnel-db', () => ({ persistStudentFunnelEvent: jest.fn() }));
import { persistStudentFunnelEvent } from '@/lib/student-funnel-db';
import { POST } from '@/app/api/student-funnel/route';

const mockedPersist = persistStudentFunnelEvent as jest.MockedFunction<typeof persistStudentFunnelEvent>;

const HUMAN_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `198.51.100.${ipCounter}`;
}

function postReq(body: string, headers: Record<string, string> = {}) {
  return new Request('https://my-naishin.com/api/student-funnel', {
    method: 'POST',
    body,
    headers: { 'user-agent': HUMAN_UA, 'cf-connecting-ip': freshIp(), ...headers },
  }) as never;
}

beforeEach(() => {
  mockedPersist.mockReset();
  mockedPersist.mockResolvedValue(undefined as never);
});

describe('/api/student-funnel', () => {
  it('正常なeventのみのリクエストは204でpersistStudentFunnelEventを呼ぶ', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'university_bridge_click' })));
    expect(res.status).toBe(204);
    expect(mockedPersist).toHaveBeenCalledWith({
      event: 'university_bridge_click',
      grade: undefined,
      tool: undefined,
    });
  });

  it('grade/toolを含めても204で正しく引き渡す', async () => {
    const res = await POST(
      postReq(JSON.stringify({ event: 'grade_self_identify', grade: 'koukou', tool: 'hyotei-heikin' }))
    );
    expect(res.status).toBe(204);
    expect(mockedPersist).toHaveBeenCalledWith({
      event: 'grade_self_identify',
      grade: 'koukou',
      tool: 'hyotei-heikin',
    });
  });

  it('bot UAは204を返しpersistStudentFunnelEventを呼ばない(計測汚染の防止)', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/student-funnel', {
        method: 'POST',
        body: JSON.stringify({ event: 'university_bridge_click' }),
        headers: { 'user-agent': 'Googlebot/2.1', 'cf-connecting-ip': freshIp() },
      }) as never
    );
    expect(res.status).toBe(204);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('UA未指定(空)もbot扱いで204・呼び出しなし', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/student-funnel', {
        method: 'POST',
        body: JSON.stringify({ event: 'university_bridge_click' }),
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

  it('未知のgrade値は400を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'grade_self_identify', grade: 'daigaku' })));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('toolが文字列でない場合は400を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'university_bridge_click', tool: 123 })));
    expect(res.status).toBe(400);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(postReq('{not json'));
    expect(res.status).toBe(400);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('content-lengthヘッダが256バイトを超えると413を返す', async () => {
    const res = await POST(postReq(JSON.stringify({ event: 'university_bridge_click' }), { 'content-length': '99999' }));
    expect(res.status).toBe(413);
    expect(mockedPersist).not.toHaveBeenCalled();
  });

  it('実ボディが256バイトを超えると413を返す(content-lengthヘッダが無くても素通しにしない)', async () => {
    const oversized = JSON.stringify({ event: 'university_bridge_click', tool: 'x'.repeat(300) });
    const res = await POST(postReq(oversized));
    expect(res.status).toBe(413);
  });

  it('persistStudentFunnelEventが例外を投げても204を返す(計測はベストエフォート)', async () => {
    mockedPersist.mockRejectedValue(new Error('D1 write failed'));
    const res = await POST(postReq(JSON.stringify({ event: 'university_bridge_click' })));
    expect(res.status).toBe(204);
  });

  it('同一IPから60秒内に31件目を送るとrate_limitedとして429を返す', async () => {
    const ip = freshIp();
    let lastStatus = 0;
    for (let i = 0; i < 31; i++) {
      const res = await POST(postReq(JSON.stringify({ event: 'university_bridge_click' }), { 'cf-connecting-ip': ip }));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
