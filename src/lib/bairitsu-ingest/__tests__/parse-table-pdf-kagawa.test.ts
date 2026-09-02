import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { KAGAWA_COMPETITION_RATES } from '@/data/competition-rates/kagawa';
import kagawaR8Geometry from '../__fixtures__/kagawa-r8-geometry.json';

/**
 * T-Y11B 段階2-b: kagawa(香川県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）。既存データのヘッダコメント自身が「番号付き学校リストのため他県で頻出
 * した『学校名の行折返し遅延』の罠が無い」と明記しており、実際に単純carry-forwardで問題なく
 * 解決できた（toyama/aomori型のブロック方式は不要）。
 *
 * PDFは全2頁だが**1頁目に「全日制」の本体表とグランドトータルが完結**しており、2頁目は
 * 「【全国からの生徒募集】」という別選抜区分の表（スコープ外）のため、フィクスチャは1頁目のみ。
 */
const KAGAWA_LAYOUT: GeneralColumnLayout = {
  boundaries: [35, 55, 108, 140, 248, 315, 380, 422, 500, 545, 570],
  // 列: 番号,学校名,大学科(=フォールバック用),小学科・コース(=department本命),入学定員+内数(未使用),
  //     入学定員差引後(=quota),出願者数(=finalApplicants),志願変更内訳3列(未使用),
  //     競争率(=finalRate),昨年度競争率(未使用)
  roles: { schoolName: 1, department: 3, quota: 5, finalApplicants: 6, finalRate: 8 },
};

/**
 * ⚠️「普通」「総合」のように小学科・コースが存在しない単一学科の学校は、学科名が
 * 小学科列ではなく大学科列（[108,140)）にのみ印字される（複数学科を持つ学校は大学科列に
 * 広域区分・小学科列に個別コース名が入る二段構成だが、単一学科校はこの二段構成を使わず
 * 大学科列だけで完結する）。小学科列が空の行だけ大学科列の値をdepartmentとして採用する。
 */
const KAGAWA_BROAD_DEPT_LAYOUT: GeneralColumnLayout = {
  boundaries: [35, 55, 108, 140, 248, 315, 380, 422, 500, 545, 570],
  roles: { schoolName: 1, department: 2, quota: 5, finalApplicants: 6, finalRate: 8 },
};

const KAGAWA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '三本松|普通，理数※': '普通・理数（くくり募集）',
  '観音寺第一|普通，理数※': '普通・理数（くくり募集）',
  '農業経営|農業生産，環境園芸※': '農業生産・環境園芸・動物科学・食農科学（くくり募集）',
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (kagawa R8 実データ検証)', () => {
  // 脚注記号（＊＝高松北中学校からの入学予定者を含む・☆＝除く・□＝欠員注記）が学科名・
  // quota列の文字として混入することがある（高松北で実際に発生・quotaTextが"☆93"のように
  // なりNumber()がNaNになって行ごと消えていた）。miyagiの脚注記号除去と同型の対応。
  const stripFootnoteSymbols = (s: string) => s.replace(/[＊☆□]/g, '');

  const geometries = kagawaR8Geometry as PdfPageGeometry[];
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => {
      const fields = extractRowFields(row.chars, KAGAWA_LAYOUT);
      const smallDept = stripFootnoteSymbols(fields.department).trim();
      const department = smallDept || stripFootnoteSymbols(extractRowFields(row.chars, KAGAWA_BROAD_DEPT_LAYOUT).department);
      return {
        ...fields,
        department: stripFootnoteSymbols(department),
        quotaText: stripFootnoteSymbols(fields.quotaText),
        applicantsText: stripFootnoteSymbols(fields.applicantsText),
        rateText: stripFootnoteSymbols(fields.rateText),
      };
    })
  );

  let currentSchool = '';
  const rowFieldsWithOverrides = allRowFields.map((r) => {
    const schoolNameNorm = r.schoolName.trim();
    if (schoolNameNorm) currentSchool = schoolNameNorm;
    const deptKey = r.department.trim();
    const overridden = KAGAWA_DEPARTMENT_OVERRIDES[`${currentSchool}|${deptKey}`];
    return { ...r, department: overridden ?? r.department };
  });

  const parsed = assembleSimpleTableRows(rowFieldsWithOverrides, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });

  const expectedR8Records = KAGAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（68件・30校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(68);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p?.schoolName, department: p?.department, quota: p?.quota, finalApplicants: p?.finalApplicants, finalRate: p?.finalRate }).toEqual({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('グランドトータル「全日制合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 4208)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データのnote（quota4,208・applicants4,296）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(4208);
    expect(sumApplicants).toBe(4296);
  });
});
