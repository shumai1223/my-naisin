/**
 * @jest-environment node
 *
 * clicks-db.ts: アフィリエイトクリック一次ログ(堀A/勝者判定の精度)＝D1。
 * leads-db.ts/school-page-clicks-db.tsと同じno-op安全設計(LEADS_DBバインディング未設定なら
 * 例外を投げず/goのリダイレクトを止めない)だが、8つの公開関数がいずれも無テストだった。
 * jest環境ではgetCloudflareContext()が常に失敗しno-opパスを通ることを利用して直接検証する。
 */

import {
  persistClick,
  countRecentClicksByIp,
  getRecentClicks,
  getClickSummary,
  getClickTrend,
  getRefererSummary,
  getClickPeriodComparison,
  getClickTrustCounts,
} from '../clicks-db';

describe('persistClick (no-op契約)', () => {
  it('例外を投げずfalseを返す(送客リダイレクトは止めない)', async () => {
    await expect(persistClick({ affiliateId: 'sapix' })).resolves.toBe(false);
  });

  it('任意フィールド全部を渡しても例外を投げない', async () => {
    await expect(
      persistClick({
        affiliateId: 'sapix',
        prefecture: 'tokyo',
        placement: 'parent-lp',
        referer: 'https://my-naishin.com/hensachi',
        userAgent: 'Mozilla/5.0',
        ipHash: 'abc123',
      })
    ).resolves.toBe(false);
  });
});

describe('countRecentClicksByIp', () => {
  it('ipHashが空文字ならDB到達前に0を返す', async () => {
    await expect(countRecentClicksByIp('')).resolves.toBe(0);
  });

  it('ipHashがあってもテスト環境のDB未設定で0を返す(フェイルオープン)', async () => {
    await expect(countRecentClicksByIp('abc123')).resolves.toBe(0);
  });

  it('secondsに極端な値を渡しても例外を投げない', async () => {
    await expect(countRecentClicksByIp('abc123', 0)).resolves.toBe(0);
    await expect(countRecentClicksByIp('abc123', 999999)).resolves.toBe(0);
  });
});

describe('getRecentClicks / getClickSummary / getClickTrend / getRefererSummary (no-op空配列契約)', () => {
  it('getRecentClicksは空配列(limit極端値含む)', async () => {
    await expect(getRecentClicks()).resolves.toEqual([]);
    await expect(getRecentClicks(0)).resolves.toEqual([]);
    await expect(getRecentClicks(100000)).resolves.toEqual([]);
  });

  it('getClickSummaryは空配列(trustedOnly指定含む)', async () => {
    await expect(getClickSummary()).resolves.toEqual([]);
    await expect(getClickSummary(30, { trustedOnly: true })).resolves.toEqual([]);
  });

  it('getClickTrendは空配列(day/hourいずれも)', async () => {
    await expect(getClickTrend()).resolves.toEqual([]);
    await expect(getClickTrend(30, 'hour')).resolves.toEqual([]);
    await expect(getClickTrend(30, 'day', { trustedOnly: true })).resolves.toEqual([]);
  });

  it('getRefererSummaryは空配列', async () => {
    await expect(getRefererSummary()).resolves.toEqual([]);
    await expect(getRefererSummary(7)).resolves.toEqual([]);
  });
});

describe('getClickPeriodComparison', () => {
  it('current/previousとも0を返す', async () => {
    await expect(getClickPeriodComparison()).resolves.toEqual({ current: 0, previous: 0 });
    await expect(getClickPeriodComparison(7, { trustedOnly: true })).resolves.toEqual({ current: 0, previous: 0 });
  });
});

describe('getClickTrustCounts', () => {
  it('total/trusted/suspect全て0を返す(ダッシュボードの清浄度バナーが壊れない既定値)', async () => {
    await expect(getClickTrustCounts()).resolves.toEqual({ total: 0, trusted: 0, suspect: 0 });
  });
});
