import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { NAGASAKI_COMPETITION_RATES } from '@/data/competition-rates/nagasaki';
import nagasakiR8Geometry from '../__fixtures__/nagasaki-r8-geometry.json';

/**
 * T-Y11B 段階2-b: nagasaki(長崎県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）。各校末尾に付随する「計」行（学校別小計）と、表末尾の「県立計」「市立計」
 * 「総計」（グランドトータル）は`excludeRow`で除外する。唯一のくくり募集（長崎東「普通・国際」）
 * は既存データが注記どおり「（くくり募集）」を末尾に付与するため、departmentOverrideで対応する
 * （他は全て素直な一致）。
 *
 * フィクスチャは令和8年度公表PDF（`nagasaki-r8.pdf`・全10頁のうち全日制の4頁分[page index 2-5]）を
 * `extract-pdf-geometry.py`で抽出した文字座標データ。定時制・離島留学制度の別表はスコープ外。
 */
const NAGASAKI_LAYOUT: GeneralColumnLayout = {
  boundaries: [65, 127, 197, 231, 271, 303, 345, 370, 404, 434],
  // 列: 学校名,学科名,全募集定員,特別等合格者数,一般定員(=quota),一般志願者数(=finalApplicants),
  //     うち学区外(未使用),本年度志願倍率(=finalRate),前年度志願倍率(未使用)
  roles: { schoolName: 0, department: 1, quota: 4, finalApplicants: 5, finalRate: 7 },
};

const NAGASAKI_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '長崎東|普通・国際': '普通・国際（くくり募集）',
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (nagasaki R8 実データ検証)', () => {
  const geometries = nagasakiR8Geometry as PdfPageGeometry[];
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, NAGASAKI_LAYOUT))
  );

  let currentSchool = '';
  const rowFieldsWithOverrides = allRowFields.map((r) => {
    const schoolNameNorm = r.schoolName.trim();
    if (schoolNameNorm) currentSchool = schoolNameNorm;
    const deptKey = r.department.trim();
    const overridden = NAGASAKI_DEPARTMENT_OVERRIDES[`${currentSchool}|${deptKey}`];
    return { ...r, department: overridden ?? r.department };
  });

  const GRAND_TOTAL_SCHOOL_LABELS = new Set(['県立計', '市立計', '総計']);
  const parsed = assembleSimpleTableRows(rowFieldsWithOverrides, {
    // ⚠️「会計ビジネス」のように部分文字列として「計」を含む正当な学科名があるため、
    // 学校別小計行はdepartmentの完全一致（'計'単体）で、グランドトータル行はschoolNameの
    // 完全一致（県立計/市立計/総計）で判定する（部分一致.includes('計')は誤検知する）。
    excludeRow: (schoolName, department) => department === '計' || GRAND_TOTAL_SCHOOL_LABELS.has(schoolName),
  });

  const expectedR8Records = NAGASAKI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（116件・55校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(116);
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

  test('学校別小計「計」行と表末尾のグランドトータル（県立計/市立計/総計）は収録されない（「会計ビジネス」等の正当な学科名は残る）', () => {
    expect(parsed.some((r) => r.department === '計')).toBe(false);
    expect(parsed.some((r) => ['県立計', '市立計', '総計'].includes(r.schoolName))).toBe(false);
    expect(parsed.some((r) => r.quota === 8760)).toBe(false);
    expect(parsed.some((r) => r.schoolName === '佐世保商業' && r.department === '会計ビジネス')).toBe(true);
  });

  test('機械集計のグランドトータルが既存データのnote（quota7,288・applicants5,794）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(7288);
    expect(sumApplicants).toBe(5794);
  });
});
