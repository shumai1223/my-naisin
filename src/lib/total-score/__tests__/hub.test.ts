import { HUB_CALCULATORS, HUB_EXPLAINERS, HUB_ALL } from '../hub';

describe('total-score hub（47県の集約）', () => {
  it('計算機13県 ＋ 解説34県 ＝ 全47県を網羅する', () => {
    expect(HUB_CALCULATORS).toHaveLength(13);
    expect(HUB_EXPLAINERS).toHaveLength(34);
    expect(HUB_ALL).toHaveLength(47);
  });

  it('県コードに重複がない（静的とregistryの二重掲載なし）', () => {
    const codes = HUB_ALL.map((e) => e.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('全エントリが必須項目を持ち、href が絶対パス', () => {
    for (const e of HUB_ALL) {
      expect(e.code).toBeTruthy();
      expect(e.name).toBeTruthy();
      expect(e.term).toBeTruthy();
      expect(e.href).toMatch(/^\/[a-z]+\/(total-score|s-value|rank)$/);
      expect(['calculator', 'explainer']).toContain(e.kind);
    }
  });
});
