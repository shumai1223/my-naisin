// education-cost/data.ts: 教育費一次データ(文科省出典)。engine.test.tsはengine.tsの計算式を
// data.tsの値から導出した期待値で検証しているため、engine側のロジックは守られるが、
// data.ts自体が持つべき構造的な不変条件(出典URLの形式・区分の並び順・型キーの一致・
// 複数年概算が単年より大きいこと等)はどちらのテストにも無かった。

import {
  MEXT_GAKUSHUHI_SOURCE,
  MEXT_SHUGAKU_SHIEN_SOURCE,
  JFC_AWAY_COST_SOURCE,
  SHUGAKU_SHIEN_TIERS,
  JUKU_RATES,
  UNIVERSITY_ESTIMATE,
  UNIVERSITY_AWAY_COST,
} from '../data';

describe('CostSource系(出典)は全てhttps・.go.jp/.jfc.go.jpの一次ソースを指す', () => {
  const sources = [MEXT_GAKUSHUHI_SOURCE, MEXT_SHUGAKU_SHIEN_SOURCE, JFC_AWAY_COST_SOURCE];

  test.each(sources.map((s) => [s.docTitle, s] as const))('%s', (_title, source) => {
    expect(source.url.startsWith('https://')).toBe(true);
    expect(source.docTitle.length).toBeGreaterThan(0);
    // 'YYYY-MM-DD'形式の日付であること
    expect(source.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('MEXT系の出典は.mext.go.jpドメインを含む', () => {
    expect(MEXT_GAKUSHUHI_SOURCE.url).toContain('mext.go.jp');
    expect(MEXT_SHUGAKU_SHIEN_SOURCE.url).toContain('mext.go.jp');
  });
});

describe('SHUGAKU_SHIEN_TIERS(就学支援金区分)', () => {
  it('under590 -> under910 -> over910の順で並んでいる', () => {
    expect(SHUGAKU_SHIEN_TIERS.map((t) => t.bracket)).toEqual(['under590', 'under910', 'over910']);
  });

  it('世帯年収が上がるほど支援額は単調非増加(私立の上乗せが先に消え、次に公立分も消える)', () => {
    for (let i = 1; i < SHUGAKU_SHIEN_TIERS.length; i++) {
      expect(SHUGAKU_SHIEN_TIERS[i].publicAnnual).toBeLessThanOrEqual(SHUGAKU_SHIEN_TIERS[i - 1].publicAnnual);
      expect(SHUGAKU_SHIEN_TIERS[i].privateAnnual).toBeLessThanOrEqual(SHUGAKU_SHIEN_TIERS[i - 1].privateAnnual);
    }
  });

  it('各区分でprivateAnnualはpublicAnnual以上(私立の方が手厚いか同額)', () => {
    for (const tier of SHUGAKU_SHIEN_TIERS) {
      expect(tier.privateAnnual).toBeGreaterThanOrEqual(tier.publicAnnual);
    }
  });
});

describe('JUKU_RATES(塾形態別の相場)', () => {
  it('各エントリのtypeフィールドが自身のキーと一致する(データ入力ミスの検出)', () => {
    for (const [key, rate] of Object.entries(JUKU_RATES)) {
      expect(rate.type).toBe(key);
    }
  });

  it('月謝・季節講習費とも正の値', () => {
    for (const rate of Object.values(JUKU_RATES)) {
      expect(rate.monthly).toBeGreaterThan(0);
      expect(rate.seasonal).toBeGreaterThan(0);
    }
  });
});

describe('UNIVERSITY_ESTIMATE / UNIVERSITY_AWAY_COST', () => {
  it('4年間の概算は初年度概算より大きい(初年度のみ入学金等が乗るため、単純な4倍にはならない設計)', () => {
    for (const key of Object.keys(UNIVERSITY_ESTIMATE) as Array<keyof typeof UNIVERSITY_ESTIMATE>) {
      const est = UNIVERSITY_ESTIMATE[key];
      expect(est.fourYear).toBeGreaterThan(est.firstYear);
    }
  });

  it('自宅外通学の初期費用・年間仕送りとも正の値', () => {
    expect(UNIVERSITY_AWAY_COST.firstYearSetup).toBeGreaterThan(0);
    expect(UNIVERSITY_AWAY_COST.annualSupport).toBeGreaterThan(0);
  });
});
