import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: ehime(愛媛県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-ehime.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）だが、1ページ2段組（左右2組の
 * 学校リストが横に並ぶ）のため、同じ行の文字集合にLEFT用/RIGHT用2つの`GeneralColumnLayout`を
 * 順に適用しLEFT全件→RIGHT全件の順で連結する（詳細な経緯はテストファイル側のコメントを参照）。
 */

const EHIME_LEFT_LAYOUT: GeneralColumnLayout = {
  boundaries: [55, 128, 196, 225, 259, 280, 298],
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
 * raw schoolNameそのものを直接書き換える。
 */
const EHIME_SCHOOL_NAME_OVERRIDES: Record<string, string> = {
  松山南本校: '松山南（本校）',
  砥部: '松山南（砥部）',
  松山北本校: '松山北（本校）',
  中島: '松山北（中島）',
  内子本校: '内子（本校）',
  小田: '内子（小田）',
};

function parseHalf(rows: { chars: PdfPageGeometry['chars']; page: number }[], layout: GeneralColumnLayout): ParsedCompetitionRow[] {
  const rowFields = rows.map((row) => ({ ...extractRowFields(row.chars, layout), page: row.page }));
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

/**
 * 愛媛県R8倍率PDFの学校別データ（1頁2段組・`ehime-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: pageオフセットは県ごとに異なるため生PDFで毎回実測する
 * （2026-09-10確認: 詳細は本ファイルの変更コミット参照）。
 */
export function parseEhime(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const clusteredRows = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => ({ ...row, page: pageIdx + 1 }))
  );
  const leftParsed = parseHalf(clusteredRows, EHIME_LEFT_LAYOUT);
  const rightParsedRaw = parseHalf(clusteredRows, EHIME_RIGHT_LAYOUT);
  // ⚠️LEFT/RIGHTは同一の物理ページを共有するため、assembleSimpleTableRows内のrowIndexは
  // LEFT呼び出し・RIGHT呼び出しそれぞれ独立に0始まりで採番される（同じpage+rowIndexが
  // LEFT/RIGHT間で重複しうる）。出典ロケータとしての一意性を保つため、RIGHT側のrowIndexには
  // 同一ページのLEFT側件数分のオフセットを加える（「左列を上から読み、続けて右列を上から読む」
  // という一貫した順序として解釈する）。
  const leftCountByPage = new Map<number, number>();
  for (const r of leftParsed) {
    if (r.page === undefined) continue;
    leftCountByPage.set(r.page, (leftCountByPage.get(r.page) ?? 0) + 1);
  }
  const rightParsed = rightParsedRaw.map((r) =>
    r.page === undefined || r.rowIndex === undefined ? r : { ...r, rowIndex: r.rowIndex + (leftCountByPage.get(r.page) ?? 0) }
  );
  return [...leftParsed, ...rightParsed];
}
