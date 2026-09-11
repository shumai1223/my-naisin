import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { licensableRecords } from '../competition-rate';
import { buildFullExportRecords, buildYearOverYearDiff, toCsv } from '../obunsha-poc-export';

/**
 * T-Y11F §5順序#5 DoD検証: 旺文社PoC納品物v0の件数固定（過去に提案書で件数の手打ち誤りが
 * 見つかった前科があるため、既存の`/developers`ページと同じ22,830件をここでも独立に固定する）。
 */
describe('旺文社PoC納品物v0（T-Y11F §5順序#5）', () => {
  it('buildFullExportRecordsは配布可能レコード数（22,830件）と一致する', () => {
    const records = buildFullExportRecords();
    const expectedTotal = Object.values(COMPETITION_RATE_BY_PREFECTURE)
      .filter((f): f is NonNullable<typeof f> => f !== undefined)
      .reduce((sum, f) => sum + licensableRecords(f).length, 0);
    expect(expectedTotal).toBe(22_830);
    expect(records).toHaveLength(22_830);
  });

  it('各レコードはprefectureCode/schoolName/department/fiscalYear/quota/finalApplicants/finalRateを持つ', () => {
    const records = buildFullExportRecords();
    for (const r of records.slice(0, 50)) {
      expect(r.prefectureCode.length).toBeGreaterThan(0);
      expect(r.schoolName.length).toBeGreaterThan(0);
      expect(r.department.length).toBeGreaterThan(0);
      expect(r.fiscalYear.length).toBeGreaterThan(0);
      expect(r.quota).toBeGreaterThanOrEqual(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
    }
  });

  it('toCsvはヘッダ行＋レコード数分の行を返す', () => {
    const records = buildFullExportRecords();
    const csv = toCsv(records);
    const lines = csv.trim().split('\n');
    expect(lines).toHaveLength(22_830 + 1);
    expect(lines[0]).toBe(
      'prefectureCode,prefectureName,schoolName,area,department,fiscalYear,quota,finalApplicants,finalRate,sourceUrl,docTitle,fetchedAt'
    );
  });

  it('toCsvはカンマ・改行を含む値をダブルクォートでエスケープする', () => {
    const csv = toCsv([
      {
        prefectureCode: 'tokyo',
        prefectureName: '東京都',
        schoolName: '普通,科',
        area: '',
        department: '普通科',
        fiscalYear: '令和8年度（2026年度）',
        quota: 1,
        finalApplicants: 1,
        finalRate: 1,
        sourceUrl: 'https://example.com',
        docTitle: 'test',
        fetchedAt: '2026-09-09',
      },
    ]);
    expect(csv).toContain('"普通,科"');
  });

  it('buildYearOverYearDiffは前年度=令和7年度・当年度=令和8年度のペアのみを返す', () => {
    const diff = buildYearOverYearDiff();
    expect(diff.length).toBeGreaterThan(0);
    for (const e of diff) {
      expect(e.previousFiscalYear.startsWith('令和7年度')).toBe(true);
      expect(e.currentFiscalYear.startsWith('令和8年度')).toBe(true);
    }
  });

  it('buildYearOverYearDiffのrateDeltaはcurrentRate-previousRateと一致する', () => {
    const diff = buildYearOverYearDiff();
    for (const e of diff.slice(0, 100)) {
      expect(Math.abs(e.rateDelta - (e.currentRate - e.previousRate))).toBeLessThan(0.001);
    }
  });

  it('千葉県は多年度データを持つため差分に含まれる（千葉型サンプルの根拠）', () => {
    const diff = buildYearOverYearDiff();
    const chiba = diff.filter((e) => e.prefectureCode === 'chiba');
    expect(chiba.length).toBeGreaterThan(0);
  });
});
