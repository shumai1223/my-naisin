/**
 * EV(推定経済性)計算エンジンの契約テスト。affiliate-economics.ts経由でrankLiveOffersByEV()等の
 * オファー順位付けに使われる計算式そのもの(誤ると換金導線の表示順位が実際の経済性とズレる)。
 */
import {
  commitmentLevel,
  yen,
  estimatedLeadsFor,
  estimatedLeadsLowFor,
  estimatedRevenueYenFor,
  confirmedRevenueYenFor,
  confirmedPer1000For,
  type AffiliateEconomics,
} from '../ev-engine';

const BASE: AffiliateEconomics = {
  cpaYen: 10000,
  convRate: 0.05,
  convRateLow: 0.02,
  kind: 'free-lead',
};

describe('commitmentLevel', () => {
  it('doc-request=0 < free-lead=1 < paid=2(ハードルの低い順)', () => {
    expect(commitmentLevel('doc-request')).toBe(0);
    expect(commitmentLevel('free-lead')).toBe(1);
    expect(commitmentLevel('paid')).toBe(2);
  });
});

describe('yen', () => {
  it('3桁区切りで¥表記になる', () => {
    expect(yen(1234)).toBe('¥1,234');
    expect(yen(1000000)).toBe('¥1,000,000');
  });

  it('小数は四捨五入される', () => {
    expect(yen(1234.6)).toBe('¥1,235');
    expect(yen(1234.4)).toBe('¥1,234');
  });

  it('0は¥0', () => {
    expect(yen(0)).toBe('¥0');
  });
});

describe('estimatedLeadsFor / estimatedLeadsLowFor', () => {
  it('クリック数×転換率', () => {
    expect(estimatedLeadsFor(BASE, 1000)).toBeCloseTo(50); // 1000 * 0.05
    expect(estimatedLeadsLowFor(BASE, 1000)).toBeCloseTo(20); // 1000 * 0.02
  });

  it('クリック0なら常に0', () => {
    expect(estimatedLeadsFor(BASE, 0)).toBe(0);
    expect(estimatedLeadsLowFor(BASE, 0)).toBe(0);
  });

  it('保守推定(convRateLow)は楽観推定(convRate)を超えない(convRateLow<=convRateが前提の値のとき)', () => {
    expect(estimatedLeadsLowFor(BASE, 1000)).toBeLessThanOrEqual(estimatedLeadsFor(BASE, 1000));
  });
});

describe('estimatedRevenueYenFor', () => {
  it('クリック数×楽観転換率×CPA', () => {
    // 1000 * 0.05 * 10000 = 500,000
    expect(estimatedRevenueYenFor(BASE, 1000)).toBeCloseTo(500000);
  });
});

describe('confirmedRevenueYenFor', () => {
  it('クリック数×保守転換率×CPA×確定率', () => {
    // 1000 * 0.02 * 10000 * 0.5 = 100,000
    expect(confirmedRevenueYenFor(BASE, 1000, 0.5)).toBeCloseTo(100000);
  });

  it('confirmRate=0なら常に0(却下率100%は確定額ゼロ)', () => {
    expect(confirmedRevenueYenFor(BASE, 1000, 0)).toBe(0);
  });

  it('confirmRate=1でも楽観推定額を超えない(convRateLow<=convRateが前提の値のとき)', () => {
    const confirmed = confirmedRevenueYenFor(BASE, 1000, 1);
    const estimated = estimatedRevenueYenFor(BASE, 1000);
    expect(confirmed).toBeLessThanOrEqual(estimated);
  });
});

describe('confirmedPer1000For', () => {
  it('confirmedRevenueYenFor(e, 1000, confirmRate)と一致する(単一指標としての整合性)', () => {
    const confirmRate = 0.6;
    expect(confirmedPer1000For(BASE, confirmRate)).toBe(confirmedRevenueYenFor(BASE, 1000, confirmRate));
  });
});
