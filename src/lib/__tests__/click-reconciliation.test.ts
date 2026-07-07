/**
 * ASP確定⇔GA4⇔D1 三面照合（I-4）の純関数テスト。
 * D1（一次データ）を天井として、ASP確定・GA4がその範囲に収まっているかを検証する。
 */
import { reconcileClickSources, summarizeReconciliation, type ReconciliationRow } from '../click-reconciliation';

describe('reconcileClickSources', () => {
  it('全て整合していればフラグは0件', () => {
    const rows: ReconciliationRow[] = [{ affiliateId: 'zkai-text-request', d1Clicks: 20, ga4Clicks: 12, aspConfirmed: 2 }];
    expect(reconcileClickSources(rows)).toHaveLength(0);
  });

  it('ASP確定がD1クリックを超過するとerrorフラグ', () => {
    const rows: ReconciliationRow[] = [{ affiliateId: 'a', d1Clicks: 5, ga4Clicks: 3, aspConfirmed: 6 }];
    const flags = reconcileClickSources(rows);
    expect(flags).toHaveLength(1);
    expect(flags[0].severity).toBe('error');
    expect(flags[0].issue).toContain('ASP確定');
  });

  it('GA4クリックがD1クリックを超過するとerrorフラグ（D1は欠測しない設計のため矛盾）', () => {
    const rows: ReconciliationRow[] = [{ affiliateId: 'a', d1Clicks: 5, ga4Clicks: 8, aspConfirmed: 0 }];
    const flags = reconcileClickSources(rows);
    expect(flags.some((f) => f.severity === 'error' && f.issue.includes('GA4'))).toBe(true);
  });

  it('D1クリックがあるのにGA4が0件はwarningフラグ（タグ抜けの疑い）', () => {
    const rows: ReconciliationRow[] = [{ affiliateId: 'a', d1Clicks: 10, ga4Clicks: 0, aspConfirmed: 0 }];
    const flags = reconcileClickSources(rows);
    expect(flags).toHaveLength(1);
    expect(flags[0].severity).toBe('warning');
  });

  it('D1が0件でGA4も0件は警告しない（両方ゼロは単に発生していないだけ）', () => {
    const rows: ReconciliationRow[] = [{ affiliateId: 'a', d1Clicks: 0, ga4Clicks: 0, aspConfirmed: 0 }];
    expect(reconcileClickSources(rows)).toHaveLength(0);
  });

  it('複数affiliateを独立して評価する', () => {
    const rows: ReconciliationRow[] = [
      { affiliateId: 'ok', d1Clicks: 10, ga4Clicks: 6, aspConfirmed: 1 },
      { affiliateId: 'bad', d1Clicks: 5, ga4Clicks: 3, aspConfirmed: 9 },
    ];
    const flags = reconcileClickSources(rows);
    expect(flags.map((f) => f.affiliateId)).toEqual(['bad']);
  });
});

describe('summarizeReconciliation', () => {
  it('合計とGA4捕捉率を計算する', () => {
    const rows: ReconciliationRow[] = [
      { affiliateId: 'a', d1Clicks: 10, ga4Clicks: 6, aspConfirmed: 1 },
      { affiliateId: 'b', d1Clicks: 10, ga4Clicks: 4, aspConfirmed: 0 },
    ];
    const s = summarizeReconciliation(rows);
    expect(s.totalD1).toBe(20);
    expect(s.totalGa4).toBe(10);
    expect(s.totalAspConfirmed).toBe(1);
    expect(s.ga4CaptureRatePercent).toBeCloseTo(50, 5);
  });

  it('D1が0件なら捕捉率はnull（ゼロ除算しない）', () => {
    const s = summarizeReconciliation([{ affiliateId: 'a', d1Clicks: 0, ga4Clicks: 0, aspConfirmed: 0 }]);
    expect(s.ga4CaptureRatePercent).toBeNull();
  });

  it('flagsフィールドにreconcileClickSourcesと同じ結果を含む', () => {
    const rows: ReconciliationRow[] = [{ affiliateId: 'a', d1Clicks: 5, ga4Clicks: 3, aspConfirmed: 9 }];
    const s = summarizeReconciliation(rows);
    expect(s.flags).toEqual(reconcileClickSources(rows));
  });
});
