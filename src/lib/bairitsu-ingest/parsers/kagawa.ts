import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: kagawa(香川県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-kagawa.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）を使うが、単一学科校は
 * 小学科列でなく大学科列にだけ学科名が印字されるため、小学科列が空の行だけ大学科列の値を
 * フォールバックとして採用する（詳細な経緯はテストファイル側のコメントを参照）。
 */

const KAGAWA_LAYOUT: GeneralColumnLayout = {
  boundaries: [35, 55, 108, 140, 248, 315, 380, 422, 500, 545, 570],
  roles: { schoolName: 1, department: 3, quota: 5, finalApplicants: 6, finalRate: 8 },
};

/**
 * ⚠️「普通」「総合」のように小学科・コースが存在しない単一学科の学校は、学科名が
 * 小学科列ではなく大学科列（[108,140)）にのみ印字される。小学科列が空の行だけ
 * 大学科列の値をdepartmentとして採用する。
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

/** 脚注記号（＊＝高松北中学校からの入学予定者を含む・☆＝除く・□＝欠員注記）を除去する。 */
function stripFootnoteSymbols(s: string): string {
  return s.replace(/[＊☆□]/g, '');
}

/** 香川県R8倍率PDFの学校別データ1頁分（`kagawa-r8-geometry.json`）を解析する。 */
export function parseKagawa(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
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

  return assembleSimpleTableRows(rowFieldsWithOverrides, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });
}
