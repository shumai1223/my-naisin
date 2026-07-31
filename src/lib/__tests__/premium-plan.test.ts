import { PREMIUM_PLAN, PREMIUM_FEATURES, formatPremiumPriceLabel } from '../premium-plan';

describe('PREMIUM_PLAN（Λ-10・保護者向けプレミアムサブスク計画定義）', () => {
  test('価格は未定(-1)のまま。👤が決定するまでコードに実額を書かない', () => {
    expect(PREMIUM_PLAN.monthlyPriceJpy).toBe(-1);
  });

  test('既存無料機能は永久に無料のまま、という不変条件が明文化されている', () => {
    expect(PREMIUM_PLAN.freeFeaturesRemainFreeForever).toBe(true);
  });

  test('計画中の3機能(年次推移/PDF出力/複数子供管理)がすべて含まれる', () => {
    expect(PREMIUM_FEATURES.map((f) => f.key).sort()).toEqual([
      'multi-child-management',
      'pdf-export',
      'year-over-year-trends',
    ]);
  });

  test('本体実装が済んでいない機能はstatus=plannedのまま(実装済みと偽らない)', () => {
    expect(PREMIUM_FEATURES.every((f) => f.status === 'planned')).toBe(true);
  });

  test('formatPremiumPriceLabelは価格未定時に「準備中」を返す', () => {
    expect(formatPremiumPriceLabel(PREMIUM_PLAN)).toBe('価格未定（準備中）');
  });

  test('formatPremiumPriceLabelは価格確定後は円表示になる', () => {
    expect(formatPremiumPriceLabel({ ...PREMIUM_PLAN, monthlyPriceJpy: 480 })).toBe('月額 ¥480〜（税別目安）');
  });
});
