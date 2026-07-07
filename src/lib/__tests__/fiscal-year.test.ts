import {
  CURRENT_FISCAL_YEAR,
  CURRENT_FISCAL_YEAR_STRING,
  CURRENT_REIWA_YEAR,
  FISCAL_YEAR_LABEL,
  REIWA_YEAR_LABEL,
  FISCAL_YEAR_FULL_LABEL,
  reiwaYear,
} from '@/lib/fiscal-year';

describe('fiscal-year', () => {
  test('reiwaYear: 2026年 → 令和8年', () => {
    expect(reiwaYear(2026)).toBe(8);
  });
  test('reiwaYear: 2019年（令和1年） → 1', () => {
    expect(reiwaYear(2019)).toBe(1);
  });

  test('CURRENT_FISCAL_YEAR_STRING は CURRENT_FISCAL_YEAR の文字列版', () => {
    expect(CURRENT_FISCAL_YEAR_STRING).toBe(String(CURRENT_FISCAL_YEAR));
  });

  test('CURRENT_REIWA_YEAR は CURRENT_FISCAL_YEAR から算出される', () => {
    expect(CURRENT_REIWA_YEAR).toBe(reiwaYear(CURRENT_FISCAL_YEAR));
  });

  test('ラベルのフォーマット', () => {
    expect(FISCAL_YEAR_LABEL).toBe(`${CURRENT_FISCAL_YEAR}年度`);
    expect(REIWA_YEAR_LABEL).toBe(`令和${CURRENT_REIWA_YEAR}年度`);
    expect(FISCAL_YEAR_FULL_LABEL).toBe(`${REIWA_YEAR_LABEL}（${FISCAL_YEAR_LABEL}）`);
  });
});
