import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: iwate(岩手県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-iwate.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・先頭行にラベル・単純carry-forward）をそのまま
 * 流用できた最も単純な部類の県。倍率も印字済み（自前算出不要）。唯一の例外「大東|情報ビジネス科」
 * は学校名+学科名テキストをキーにしたoverrideで対応する（詳細はテストファイル側のコメントを参照）。
 */

const IWATE_LAYOUT: GeneralColumnLayout = {
  boundaries: [15, 56, 88, 163, 247, 271, 293, 320],
  roles: { schoolName: 0, department: 2, quota: 4, finalApplicants: 5, finalRate: 6 },
};

const DEPARTMENT_TEXT_OVERRIDE: Record<string, string> = {
  '大東|情報ビジネス科': '商業(情報ビジネス科)',
};

/** 岩手県R8倍率PDFの学校別データ（`iwate-r8-geometry.json`）を解析する。 */
export function parseIwate(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, IWATE_LAYOUT))
  );

  return assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  }).map((r) => {
    const override = DEPARTMENT_TEXT_OVERRIDE[`${r.schoolName}|${r.department}`];
    return override ? { ...r, department: override } : r;
  });
}
