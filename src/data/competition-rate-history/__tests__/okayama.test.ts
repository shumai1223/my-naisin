import { OKAYAMA_COMPETITION_RATE_HISTORY } from '../okayama';

/**
 * Λ-4（多年度アーカイブ・岡山県）DoD検証: 令和7年度の県立全日制・一般入学の合計を一次資料の
 * 「（１）総括表」の「県立全日制」行の固定値で確認する。既存Y-6と同一の列定義(quota=一般入学
 * 募集人員・applicants=一般入学志願者数)。
 */
describe('岡山県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    expect(OKAYAMA_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('県立全日制・一般入学は一次資料の総括表と一致する(一般入学募集人員5,729・志願者数5,968・倍率1.04)', () => {
    const r7 = OKAYAMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5729);
    expect(r7.grandTotal.applicants).toBe(5968);
    expect(r7.grandTotal.rate).toBeCloseTo(1.04, 2);
    expect(r7.grandTotal.schoolCount).toBe(50);
  });
});
