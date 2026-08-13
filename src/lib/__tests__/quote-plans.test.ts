/**
 * 見積書（/mitsumori）・料金ページ（/developers）が共通参照するプラン定義の不変条件テスト。
 * 2026-08-13価格決定（ops/PRICING_OPTIONS.md）の確定額をコードとドキュメントの間でずれさせないため。
 */

import { QUOTE_PLANS, getQuotePlan } from '../quote-plans';
import { TIER_POLICIES } from '../api-tiers';

describe('QUOTE_PLANS（2026-08-13価格決定）', () => {
  test('4プランが揃っている', () => {
    const ids = QUOTE_PLANS.map((p) => p.id);
    expect(ids).toEqual(['business', 'enterprise-base', 'enterprise-redistribute', 'enterprise-full']);
  });

  test('business の年額は TIER_POLICIES.business.annualPriceJpy と一致する（単一ソース化の担保）', () => {
    const business = getQuotePlan('business');
    expect(business.annualPriceJpy).toBe(TIER_POLICIES.business.annualPriceJpy);
    expect(business.annualPriceJpy).toBe(240_000);
  });

  test('Enterpriseの3構成は基本 < +再配布権 < フル の順に単調増加する', () => {
    const base = getQuotePlan('enterprise-base').annualPriceJpy;
    const redistribute = getQuotePlan('enterprise-redistribute').annualPriceJpy;
    const full = getQuotePlan('enterprise-full').annualPriceJpy;
    expect(base).toBeLessThan(redistribute);
    expect(redistribute).toBeLessThan(full);
  });

  test('ops/PRICING_OPTIONS.mdの確定額（100万／150万／250万）と一致する', () => {
    expect(getQuotePlan('enterprise-base').annualPriceJpy).toBe(1_000_000);
    expect(getQuotePlan('enterprise-redistribute').annualPriceJpy).toBe(1_500_000);
    expect(getQuotePlan('enterprise-full').annualPriceJpy).toBe(2_500_000);
  });

  test('全プランの年額は正の整数（0円・個別見積りの-1が紛れ込んでいない）', () => {
    for (const plan of QUOTE_PLANS) {
      expect(plan.annualPriceJpy).toBeGreaterThan(0);
      expect(Number.isInteger(plan.annualPriceJpy)).toBe(true);
    }
  });

  test('全プランに空でないfeaturesが付いている（見積書の品目欄が空白にならない）', () => {
    for (const plan of QUOTE_PLANS) {
      expect(plan.features.length).toBeGreaterThan(0);
      for (const feature of plan.features) {
        expect(feature.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('id・labelに重複がない', () => {
    const ids = QUOTE_PLANS.map((p) => p.id);
    const labels = QUOTE_PLANS.map((p) => p.label);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

describe('getQuotePlan', () => {
  test('存在するidを渡すと対応するプランを返す', () => {
    expect(getQuotePlan('enterprise-full').label).toBe('Enterprise（フル）');
  });

  test('存在しないidを渡すと例外を投げる（fail-closed・不正なプランで見積書を作らせない）', () => {
    // @ts-expect-error 意図的に不正な値を渡す
    expect(() => getQuotePlan('unknown-plan')).toThrow(/unknown quote plan/);
  });
});
