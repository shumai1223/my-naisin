// parent-funnel-beacon.ts: 保護者ファネル(TIER Σ-3)のD1一次記録ビーコン(クライアント側)。
// ParentShareBanner/ParentShareInvite/ParentShareLinkButton/SchoolPageParentBridgeという
// 堀Aの主要導線4箇所から呼ばれるが無テストだった。「遷移/送信は止めずベストエフォートで送る」
// という設計(fetch失敗・例外いずれでも呼び出し元に影響させない)を固定する。

import { beaconParentFunnelEvent } from '../parent-funnel-beacon';

describe('beaconParentFunnelEvent', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('/api/parent-funnelへevent・medium・prefectureCode・hoursSinceSentをJSONで送信する(keepalive付き)', () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    beaconParentFunnelEvent('share_to_parent', {
      medium: 'line',
      prefectureCode: 'tokyo',
      hoursSinceSent: 3,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/parent-funnel');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(init.keepalive).toBe(true);
    expect(JSON.parse(init.body)).toEqual({
      event: 'share_to_parent',
      medium: 'line',
      prefectureCode: 'tokyo',
      hoursSinceSent: 3,
    });
  });

  it('optsを省略してもeventのみで送信できる', () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    beaconParentFunnelEvent('line_registration_click');

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(init.body)).toEqual({ event: 'line_registration_click' });
  });

  it('fetchがPromise拒否しても例外を投げない(遷移/送信をブロックしないベストエフォート設計)', () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as unknown as typeof fetch;
    expect(() => beaconParentFunnelEvent('parent_landing_view')).not.toThrow();
  });

  it('fetch自体が同期的に例外を投げても呼び出し元に伝播しない', () => {
    global.fetch = jest.fn(() => {
      throw new Error('fetch not available');
    }) as unknown as typeof fetch;
    expect(() => beaconParentFunnelEvent('parent_landing_view')).not.toThrow();
  });
});
