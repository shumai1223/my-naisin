import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: miyagi(宮城県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-miyagi.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（y座標クラスタリング・単純carry-forward）の応用だが、2つの追加の罠を持つ:
 * ①「○○地区計」「○○地区合計」という地区別小計行が学校の行に混入する（`excludeRow`で除外）。
 * ②市立高等学校等を示す脚注記号「※」「■」「☆」が学校名・学科名のどちらにも付着することが
 * あるため、`extractRowFields`の生テキストの時点で除去する（詳細はテストファイル側のコメントを参照）。
 */

const MIYAGI_LAYOUT: GeneralColumnLayout = {
  boundaries: [46, 56, 115, 245, 290, 335, 385, 430, 478, 525, 550],
  // 列: (空白),学校名,学科名,募集定員(=quota),R8出願志願者数(=finalApplicants),R8出願倍率(=finalRate),
  //     R8出願希望調査志願者数,R8出願希望調査倍率,R7出願希望調査志願者数,R7出願希望調査倍率
  roles: { schoolName: 1, department: 2, quota: 3, finalApplicants: 4, finalRate: 5 },
};

/** 市立高等学校等を示す脚注記号。学校名・学科名のどちらにも付着しうる。 */
function stripFootnoteMarks(s: string): string {
  return s.replace(/[※■☆]/g, '');
}

/** 宮城県R8倍率PDFの学校別データ4頁分（`miyagi-r8-geometry.json`）を解析する。 */
export function parseMiyagi(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => {
      const fields = extractRowFields(row.chars, MIYAGI_LAYOUT);
      return { ...fields, schoolName: stripFootnoteMarks(fields.schoolName), department: stripFootnoteMarks(fields.department) };
    })
  );

  return assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('地区計') || (schoolName + department).includes('合計'),
  });
}
