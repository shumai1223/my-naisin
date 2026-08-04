import { OKAYAMA_COMPETITION_RATE_HISTORY } from '../okayama';

/**
 * Λ-4（多年度アーカイブ・岡山県）DoD検証: 令和7・令和6年度の県立全日制・一般入学の合計を
 * 一次資料/リセマム記事の固定値で確認する。既存Y-6と同一の列定義(quota=一般入学
 * 募集人員・applicants=一般入学志願者数)。
 */
describe('岡山県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    for (const y of OKAYAMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の県立全日制・一般入学は一次資料の総括表と一致する(一般入学募集人員5,729・志願者数5,968・倍率1.04)', () => {
    const r7 = OKAYAMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5729);
    expect(r7.grandTotal.applicants).toBe(5968);
    expect(r7.grandTotal.rate).toBeCloseTo(1.04, 2);
    expect(r7.grandTotal.schoolCount).toBe(50);
  });

  it('令和6年度の県立全日制・一般入学はリセマム記事と一致する(募集人員5,750・志願者数6,263・倍率1.09)', () => {
    const r6 = OKAYAMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(5750);
    expect(r6.grandTotal.applicants).toBe(6263);
    expect(r6.grandTotal.rate).toBeCloseTo(1.09, 2);
    expect(r6.grandTotal.schoolCount).toBe(50);
  });
});
