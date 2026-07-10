/**
 * 匿名統計の自動送信（クライアント側）テスト。
 */
import { submitStatsResult } from '../stats-submit-client';
import { grantStatsConsent, revokeStatsConsent } from '../stats-consent';

describe('submitStatsResult', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    window.localStorage.clear();
    fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('未同意なら fetch を呼ばない', async () => {
    revokeStatsConsent();
    await submitStatsResult({ metric: 'naishin', value: 40 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('同意済みなら /api/stats/submit へ POST する', async () => {
    grantStatsConsent();
    await submitStatsResult({ metric: 'naishin', value: 40, prefectureCode: 'tokyo', maxValue: 45 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/stats/submit');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      metric: 'naishin',
      value: 40,
      prefectureCode: 'tokyo',
      maxValue: 45,
    });
  });

  it('不正な入力（value が数値でない）なら同意済みでも送信しない', async () => {
    grantStatsConsent();
    await submitStatsResult({ metric: 'naishin', value: Number.NaN });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('不正な metric なら送信しない', async () => {
    grantStatsConsent();
    // @ts-expect-error 意図的に不正な metric を渡す
    await submitStatsResult({ metric: 'invalid-metric', value: 40 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetch が例外を投げても呼び出し元には伝播しない', async () => {
    grantStatsConsent();
    fetchMock.mockRejectedValue(new Error('network error'));
    await expect(submitStatsResult({ metric: 'hensachi', value: 55 })).resolves.toBeUndefined();
  });
});
