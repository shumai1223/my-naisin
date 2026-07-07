import { calcApplicationRatio, calcActualRatio, roundRatio } from '@/lib/bairitsu';

describe('calcApplicationRatio', () => {
  test('志願者240人・募集120人 → 倍率2.0', () => {
    expect(calcApplicationRatio(240, 120)).toBe(2.0);
  });
  test('志願者0人 → 倍率0', () => {
    expect(calcApplicationRatio(0, 120)).toBe(0);
  });
  test('募集人員0以下や不正値は null', () => {
    expect(calcApplicationRatio(100, 0)).toBeNull();
    expect(calcApplicationRatio(100, -5)).toBeNull();
    expect(calcApplicationRatio(NaN, 120)).toBeNull();
  });
  test('志願者が負の値は null', () => {
    expect(calcApplicationRatio(-1, 120)).toBeNull();
  });
});

describe('calcActualRatio', () => {
  test('受験者200人・合格者100人 → 実質倍率2.0', () => {
    expect(calcActualRatio(200, 100)).toBe(2.0);
  });
  test('合格者0以下や不正値は null', () => {
    expect(calcActualRatio(200, 0)).toBeNull();
    expect(calcActualRatio(200, -5)).toBeNull();
    expect(calcActualRatio(NaN, 100)).toBeNull();
  });
});

describe('roundRatio', () => {
  test('小数第2位で丸める', () => {
    expect(roundRatio(2 / 3)).toBe(0.67);
    expect(roundRatio(2)).toBe(2);
  });
});
