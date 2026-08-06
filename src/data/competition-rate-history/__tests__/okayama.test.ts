import { OKAYAMA_COMPETITION_RATE_HISTORY } from '../okayama';

/**
 * Λ-4（多年度アーカイブ・岡山県）DoD検証: 令和7・令和6年度の県立全日制・一般入学の合計を
 * 一次資料/リセマム記事の固定値で確認する。既存Y-6と同一の列定義(quota=一般入学
 * 募集人員・applicants=一般入学志願者数)。
 */
describe('岡山県 多年度アーカイブ（Λ-4・令和8〜令和2の7年度分・grand-total-only）', () => {
  it('7年度分（令和8年度〜令和2年度）を収録している', () => {
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('令和8年度の県立全日制・一般入学はリセマム記事と一致する(募集人員5,698・志願者数5,650・倍率0.99)', () => {
    const r8 = OKAYAMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(5698);
    expect(r8.grandTotal.applicants).toBe(5650);
    expect(r8.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('全年度でcategoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    for (const y of OKAYAMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の県立全日制・一般入学は一次資料の総括表と一致する(一般入学募集人員5,729・志願者数5,968・倍率1.04)', () => {
    const r7 = OKAYAMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(5729);
    expect(r7.grandTotal.applicants).toBe(5968);
    expect(r7.grandTotal.rate).toBeCloseTo(1.04, 2);
    expect(r7.grandTotal.schoolCount).toBe(50);
  });

  it('令和6年度の県立全日制・一般入学はリセマム記事と一致する(募集人員5,750・志願者数6,263・倍率1.09)', () => {
    const r6 = OKAYAMA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(5750);
    expect(r6.grandTotal.applicants).toBe(6263);
    expect(r6.grandTotal.rate).toBeCloseTo(1.09, 2);
    expect(r6.grandTotal.schoolCount).toBe(50);
  });

  it('令和5年度の県立全日制・一般入学はリセマム記事(山陽新聞デジタル見出しでも倍率一致)と一致する(募集人員6,099・志願者数6,810・倍率1.12)', () => {
    const r5 = OKAYAMA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(6099);
    expect(r5.grandTotal.applicants).toBe(6810);
    expect(r5.grandTotal.rate).toBeCloseTo(1.12, 2);
  });

  it('令和4年度の県立全日制・一般入学はリセマム記事と一致する(募集人員7,360・志願者数7,975・倍率1.08)', () => {
    const r4 = OKAYAMA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(7360);
    expect(r4.grandTotal.applicants).toBe(7975);
    expect(r4.grandTotal.rate).toBeCloseTo(1.08, 2);
  });

  it('令和3年度の県立全日制・一般入学はリセマム記事と一致する(募集人員7,520・志願者数7,761・倍率1.03)', () => {
    const r3 = OKAYAMA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(7520);
    expect(r3.grandTotal.applicants).toBe(7761);
    expect(r3.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和2年度の県立全日制・一般入学はリセマム記事と一致する(募集人員7,683・志願者数8,121・倍率1.06)', () => {
    const r2 = OKAYAMA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(7683);
    expect(r2.grandTotal.applicants).toBe(8121);
    expect(r2.grandTotal.rate).toBeCloseTo(1.06, 2);
  });
});
