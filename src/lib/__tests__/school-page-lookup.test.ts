import { getPrefectureSchoolPageData } from '../school-page-lookup';

/**
 * 2026-08-09発見・緊急修正の回帰テスト: 掛-1(学校別×多年度)がcompetition-rates.tsに
 * fiscalYear付きの過去年度レコード(R6/R7等)を追加するようになったが、getPrefectureSchoolPageDataは
 * それをフィルタせずbuildSchoolPageDataForPrefectureへ渡していたため、同じ学科が複数年度分そのまま
 * departmentRatesに混入し、totalQuota/totalApplicants/overallRateが複数年度の合算という無意味な値に
 * なっていた(toyama等、index解禁済みの県で実際に発生を確認)。今季分(fiscalYearが無いレコード)のみが
 * 使われることを実データで検証する。
 */
describe('getPrefectureSchoolPageData（今季分のみを使うことの回帰テスト）', () => {
  test('toyama: 複数年度分のレコードが登録されている学校でも、departmentRatesは今季分のみになる', () => {
    const result = getPrefectureSchoolPageData('toyama');
    expect(result).not.toBeNull();
    const nyuzen = result!.schools.find((s) => s.schoolName.includes('入善'));
    expect(nyuzen).toBeDefined();
    // 今季(令和8年度)は普通科+農業科の2レコードのみのはず(R6/R7分は混入しない)
    expect(nyuzen!.departmentRates).toHaveLength(2);
    expect(nyuzen!.departmentRates.every((r) => !r.fiscalYear)).toBe(true);
    // 令和8年度の正しい値(quota108+24=132・applicants63+15=78)であり、R6/R7込みの合算(440/342)ではない
    expect(nyuzen!.totalQuota).toBe(132);
    expect(nyuzen!.totalApplicants).toBe(78);
  });

  test('iwate: 統合前の旧校名(盛岡南・不来方等)はR6タグ付きレコードのみに存在し、今季の学校一覧には出てこない', () => {
    const result = getPrefectureSchoolPageData('iwate');
    expect(result).not.toBeNull();
    const oldNames = result!.schools.map((s) => s.schoolName);
    expect(oldNames.some((n) => n.includes('盛岡南'))).toBe(false);
    expect(oldNames.some((n) => n.includes('不来方'))).toBe(false);
    // 統合後の現行校名は今季分として正しく収録されている
    expect(oldNames.some((n) => n.includes('南昌みらい'))).toBe(true);
  });
});
