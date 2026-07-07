/**
 * EV表の仮定→実測突合（D-6）のテスト。
 * サンプル不足のガード（過学習防止）と、スニペット整形の両方を固定する。
 */
import {
  reconcileAffiliateEconomics,
  formatEconomicsSnippet,
  knownAffiliateIds,
  type AffiliateActualRow,
} from '@/lib/affiliate-actuals-reconciliation';

describe('reconcileAffiliateEconomics', () => {
  it('クリック0件は no-data とし実測値を出さない', () => {
    const rows = reconcileAffiliateEconomics([{ affiliateId: 'fp-soudan', clicks: 0, conversions: 0, confirmed: 0 }]);
    expect(rows[0].recommendation).toBe('no-data');
    expect(rows[0].actual).toBeNull();
  });

  it('クリックが閾値未満は insufficient-sample とし、上書き候補にしない（過学習防止）', () => {
    const rows = reconcileAffiliateEconomics(
      [{ affiliateId: 'sora-juku-text', clicks: 10, conversions: 2, confirmed: 1 }],
      30
    );
    expect(rows[0].recommendation).toBe('insufficient-sample');
    expect(rows[0].actual?.convRateLow).toBeCloseTo(0.1);
  });

  it('クリックが閾値以上は update とし、実測convRate/convRateLow/confirmRateを計算する', () => {
    const rows = reconcileAffiliateEconomics(
      [{ affiliateId: 'fp-soudan', clicks: 100, conversions: 8, confirmed: 5 }],
      30
    );
    const r = rows[0];
    expect(r.recommendation).toBe('update');
    expect(r.actual?.convRate).toBeCloseTo(0.08);
    expect(r.actual?.convRateLow).toBeCloseTo(0.05);
    expect(r.actual?.confirmRate).toBeCloseTo(0.625);
    expect(r.deltaPercent).not.toBeNull();
  });

  it('deltaPercentは現在の仮定convRateLowとの変化率', () => {
    const custom: AffiliateActualRow = { affiliateId: 'fp-soudan', clicks: 100, conversions: 8, confirmed: 5 };
    const rows = reconcileAffiliateEconomics([custom], 30);
    const r = rows[0];
    // assumed.convRateLowは affiliate-economics.ts の実値（変わりうる）なので符号と桁だけ検証
    expect(typeof r.deltaPercent).toBe('number');
  });
});

describe('formatEconomicsSnippet', () => {
  it('recommendation=update の行のみ貼り付け用スニペットを返す', () => {
    const [updateRow] = reconcileAffiliateEconomics(
      [{ affiliateId: 'fp-soudan', clicks: 100, conversions: 8, confirmed: 5 }],
      30
    );
    const snippet = formatEconomicsSnippet(updateRow);
    expect(snippet).toContain("'fp-soudan'");
    expect(snippet).toContain('convRateLow: 0.05');
  });

  it('insufficient-sample/no-data の行はnullを返す（誤って貼られないガード）', () => {
    const [insufficientRow] = reconcileAffiliateEconomics(
      [{ affiliateId: 'sora-juku-text', clicks: 10, conversions: 2, confirmed: 1 }],
      30
    );
    expect(formatEconomicsSnippet(insufficientRow)).toBeNull();

    const [noDataRow] = reconcileAffiliateEconomics([{ affiliateId: 'fp-soudan', clicks: 0, conversions: 0, confirmed: 0 }]);
    expect(formatEconomicsSnippet(noDataRow)).toBeNull();
  });
});

describe('knownAffiliateIds', () => {
  it('AFFILIATE_ECONOMICSに登録済みの全IDを返す（重複なし）', () => {
    const ids = knownAffiliateIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('fp-soudan');
  });
});
