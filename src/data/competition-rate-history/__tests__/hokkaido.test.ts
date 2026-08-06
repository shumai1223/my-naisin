import { checkYearTotal } from '@/lib/competition-rate-history';
import { HOKKAIDO_COMPETITION_RATE_HISTORY } from '../hokkaido';

/**
 * Λ-4（多年度アーカイブ・北海道）DoD検証: 学科区分別（普通/農業/工業/商業/水産/家庭/看護/
 * 福祉/理数/体育/外国語/工芸/数理データサイエンス/総合）の内訳を積み上げた合計が、
 * 一次ソース(R6/R7入学者選抜状況報告書 第1表)の全日制「合計」行と完全一致することを機械的に
 * 突合する。北海道は2026-08-06まで教委公式ページのリンク切れにより恒久ブロック扱いだったが、
 * 別ページ経由でR6・R7年度分のデータを新規発見・収録した(詳細はhokkaido.tsのコメント参照)。
 */
describe('北海道 多年度アーカイブ（Λ-4・令和8〜6年度の3年分・category-detail）', () => {
  it('3年度分（令和8年度・令和7年度・令和6年度）を収録している', () => {
    expect(HOKKAIDO_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(HOKKAIDO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it.each(HOKKAIDO_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 学科区分別の内訳合計が全日制「合計」行と完全一致する', (snapshot) => {
    const result = checkYearTotal(snapshot, snapshot.grandTotal, () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(snapshot.grandTotal.quota);
    expect(result.actualApplicants).toBe(snapshot.grandTotal.applicants);
  });

  it('令和8年度の全日制計は一次資料と一致する(募集29,116・出願27,126・倍率0.93)', () => {
    const r8 = HOKKAIDO_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(29116);
    expect(r8.grandTotal.applicants).toBe(27126);
    expect(r8.grandTotal.rate).toBeCloseTo(0.93, 2);
  });

  it('令和7年度の全日制計は一次資料と一致する(募集29,366・出願28,326・倍率0.96)', () => {
    const r7 = HOKKAIDO_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(29366);
    expect(r7.grandTotal.applicants).toBe(28326);
    expect(r7.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('令和6年度の全日制計は一次資料と一致する(募集29,730・出願28,756・倍率0.97)', () => {
    const r6 = HOKKAIDO_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(29730);
    expect(r6.grandTotal.applicants).toBe(28756);
    expect(r6.grandTotal.rate).toBeCloseTo(0.97, 2);
  });

  it('全年度で学科区分は14種を収録している(普通/農業/工業/商業/水産/家庭/看護/福祉/理数/体育/外国語/工芸/数理データサイエンス/総合)', () => {
    for (const y of HOKKAIDO_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(14);
      expect(y.categories.map((c) => c.label)).toEqual([
        '普通', '農業', '工業', '商業', '水産', '家庭', '看護', '福祉',
        '理数', '体育', '外国語', '工芸', '数理データサイエンス', '総合',
      ]);
    }
  });

  it('内部整合性: 各区分の志願者数÷募集人員が記録された倍率とおおむね一致する', () => {
    for (const y of HOKKAIDO_COMPETITION_RATE_HISTORY.years) {
      for (const c of y.categories) {
        expect(Math.abs(c.applicants / c.quota - c.rate)).toBeLessThan(0.006);
      }
      expect(y.grandTotal.applicants / y.grandTotal.quota).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
