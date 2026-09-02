import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { EHIME_COMPETITION_RATES } from '@/data/competition-rates/ehime';
import ehimeR8Geometry from '../__fixtures__/ehime-r8-geometry.json';

/**
 * T-Y11B 段階2-b: ehime(愛媛県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）だが、**1ページ2段組**（左右2組の学校リストが横に並ぶ・tokushima型と
 * 同種のレイアウト分割）という罠がある。同じ行の文字集合にLEFT用/RIGHT用2つの`GeneralColumnLayout`
 * を順に適用するだけで良い（`extractRowFields`は自レイアウトの境界外の文字を無視するため、
 * 事前にジオメトリをx範囲で分割する必要がない）。LEFT/RIGHTそれぞれで独立にcarry-forwardし、
 * 結果をLEFT全件→RIGHT全件の順で連結すると既存データの並び順と一致する。
 *
 * 右下の余白に印字される脚注（「くくり募集の略称である。」等）はLEFTの実データ行と同じy座標に
 * 存在するが、数値列に数字を持たないため`assembleSimpleTableRows`のquota検証で自然に除外される。
 *
 * フィクスチャは令和8年度公表PDF（`ehime-r8.pdf`・全1頁2段組）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。
 */
const EHIME_LEFT_LAYOUT: GeneralColumnLayout = {
  boundaries: [55, 128, 196, 225, 259, 280, 298],
  // 列: 学校名,学科名,定員(=quota),入学志願者数(=finalApplicants),特色(内数・未使用),倍率(=finalRate)
  roles: { schoolName: 0, department: 1, quota: 2, finalApplicants: 3, finalRate: 5 },
};
const EHIME_RIGHT_LAYOUT: GeneralColumnLayout = {
  boundaries: [298, 353, 421, 450, 480, 505, 530],
  roles: { schoolName: 0, department: 1, quota: 2, finalApplicants: 3, finalRate: 5 },
};

const EHIME_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '今治西|国・普': '国・普（くくり募集）',
  '宇和島東|理・普': '理・普（くくり募集）',
};

/**
 * 分校（本校/分校が独立した学校番号を持たない）は、raw PDFでは「親校名+本校」が1語で
 * 連結されて印字される（例:「松山南本校」）一方、分校側は親校名を伴わず単独の地名のみが
 * 印字される（例:「砥部」）。既存データは「親校（分校名）」の括弧表記に統一しているため、
 * akita型の`renameOverrides`と同型の対応として、raw schoolNameそのものを直接書き換える
 * （分校名は他行の学校名と衝突しない固有の地名のためキーの一意性は問題ない）。
 */
const EHIME_SCHOOL_NAME_OVERRIDES: Record<string, string> = {
  松山南本校: '松山南（本校）',
  砥部: '松山南（砥部）',
  松山北本校: '松山北（本校）',
  中島: '松山北（中島）',
  内子本校: '内子（本校）',
  小田: '内子（小田）',
};

function parseHalf(rows: { chars: PdfPageGeometry['chars'] }[], layout: GeneralColumnLayout) {
  const rowFields = rows.map((row) => extractRowFields(row.chars, layout));
  let currentSchool = '';
  const withOverrides = rowFields.map((r) => {
    const rawSchoolName = r.schoolName.trim();
    const overriddenSchoolName = EHIME_SCHOOL_NAME_OVERRIDES[rawSchoolName];
    const schoolNameNorm = overriddenSchoolName ?? rawSchoolName;
    if (schoolNameNorm) currentSchool = schoolNameNorm;
    const deptKey = r.department.trim();
    const overriddenDept = EHIME_DEPARTMENT_OVERRIDES[`${currentSchool}|${deptKey}`];
    return { ...r, schoolName: overriddenSchoolName ?? r.schoolName, department: overriddenDept ?? r.department };
  });
  return assembleSimpleTableRows(withOverrides, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (ehime R8 実データ検証・1ページ2段組)', () => {
  const geometries = ehimeR8Geometry as unknown as PdfPageGeometry[];
  const clusteredRows = geometries.flatMap((geom) => groupCharsIntoRows(geom.chars, 3.0));

  const leftParsed = parseHalf(clusteredRows, EHIME_LEFT_LAYOUT);
  const rightParsed = parseHalf(clusteredRows, EHIME_RIGHT_LAYOUT);
  const parsed = [...leftParsed, ...rightParsed];

  const expectedR8Records = EHIME_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（99件・43校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(99);
  });

  test('レコード単位で既存データと完全一致する（LEFT列→RIGHT列の順で順序も含む）', () => {
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

  test('脚注テキスト「くくり募集の略称である」由来の空行は数値化できず除外される', () => {
    expect(parsed.some((r) => r.department.includes('くくり募集の略称'))).toBe(false);
  });

  test('グランドトータル「合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 8370)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データの「合計」行（quota8,370・applicants7,468）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(8370);
    expect(sumApplicants).toBe(7468);
  });
});
