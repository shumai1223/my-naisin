import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: nagasaki(長崎県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-nagasaki.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）。各校末尾に付随する「計」行
 * （学校別小計）と、表末尾の「県立計」「市立計」「総計」（グランドトータル）は`excludeRow`で
 * 除外する。唯一のくくり募集（長崎東「普通・国際」）は既存データが注記どおり「（くくり募集）」を
 * 末尾に付与するため、departmentOverrideで対応する（詳細はテストファイル側のコメントを参照）。
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

const GRAND_TOTAL_SCHOOL_LABELS = new Set(['県立計', '市立計', '総計']);

/**
 * 長崎県R8倍率PDFの学校別データ4頁分（`nagasaki-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: このPDFは全10頁中、学校別詳細表は物理ページ3〜6の
 * 4頁のみ（1〜2頁は概要・7〜10頁は定時制等の別表）。2026-09-10に生PDF全文抽出で先頭校
 * 長崎東(quota151/applicants158)が物理ページ3に、末尾の市立長崎商業「情報」
 * (applicants27/rate0.8)が物理ページ6に実在することを確認済み。出典ロケータ用のpageは
 * 配列添字+3（tottori型と同様、概要ページ分のオフセットが必要）。
 */
export function parseNagasaki(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => ({ ...extractRowFields(row.chars, NAGASAKI_LAYOUT), page: pageIdx + 3 }))
  );

  let currentSchool = '';
  const rowFieldsWithOverrides = allRowFields.map((r) => {
    const schoolNameNorm = r.schoolName.trim();
    if (schoolNameNorm) currentSchool = schoolNameNorm;
    const deptKey = r.department.trim();
    const overridden = NAGASAKI_DEPARTMENT_OVERRIDES[`${currentSchool}|${deptKey}`];
    return { ...r, department: overridden ?? r.department };
  });

  return assembleSimpleTableRows(rowFieldsWithOverrides, {
    // ⚠️「会計ビジネス」のように部分文字列として「計」を含む正当な学科名があるため、
    // 学校別小計行はdepartmentの完全一致（'計'単体）で、グランドトータル行はschoolNameの
    // 完全一致（県立計/市立計/総計）で判定する（部分一致.includes('計')は誤検知する）。
    excludeRow: (schoolName, department) => department === '計' || GRAND_TOTAL_SCHOOL_LABELS.has(schoolName),
  });
}
