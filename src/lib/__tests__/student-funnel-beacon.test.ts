// student-funnel-beacon.ts: 生徒ファネル(S12-1)のD1一次記録ビーコン(クライアント側)。
// HyoteiUniversityBridgeから呼ばれる。「遷移/送信は止めずベストエフォートで送る」という設計
// (fetch失敗・例外いずれでも呼び出し元に影響させない)を固定する(parent-funnel-beacon.test.tsと同型)。

import { beaconStudentFunnelEvent } from '../student-funnel-beacon';

describe('beaconStudentFunnelEvent', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('/api/student-funnelへevent・grade・toolをJSONで送信する(keepalive付き)', () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    beaconStudentFunnelEvent('grade_self_identify', { grade: 'koukou', tool: 'hyotei-heikin' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/student-funnel');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(init.keepalive).toBe(true);
    expect(JSON.parse(init.body)).toEqual({
      event: 'grade_self_identify',
      grade: 'koukou',
      tool: 'hyotei-heikin',
    });
  });

  it('optsを省略してもeventのみで送信できる', () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    beaconStudentFunnelEvent('university_bridge_click');

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({ event: 'university_bridge_click' });
  });

  it('fetchがPromise拒否しても例外を投げない(遷移/送信をブロックしないベストエフォート設計)', () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as unknown as typeof fetch;
    expect(() => beaconStudentFunnelEvent('university_bridge_click')).not.toThrow();
  });

  it('fetch自体が同期的に例外を投げても呼び出し元に伝播しない', () => {
    global.fetch = jest.fn(() => {
      throw new Error('fetch not available');
    }) as unknown as typeof fetch;
    expect(() => beaconStudentFunnelEvent('university_bridge_click')).not.toThrow();
  });
});
