import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1/E-6: tochigi(栃木県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-simple.test.ts`（T-Y11B段階2-bで検証済み・
 * 「学校名セルの結合が無い県」向け組み立て(tochigi型)の基準実装）から移設。他のtochigi型
 * 抽出済み県と異なり、この県自身は元々`assembleSimpleTableRows`の汎用テストの実データ例として
 * 書かれていたため県固有のoverrideを一切持たない、最も単純な部類（詳細はテストファイル側の
 * コメントを参照）。
 */

const TOCHIGI_LAYOUT: GeneralColumnLayout = {
  boundaries: [50.4, 66.4, 111.4, 163.8, 185.9, 208.2, 236.7, 264.6, 287.0, 315.4, 343.4, 371.8, 399.8, 428.2, 456.2],
  // 列: 番号,学校名,学科名,男女,募集定員,特色選抜内定者数,A海外内定者数,一般選抜定員(=quota),
  //     出願人員(2/19),出願倍率(2/19),再出願人員,取下げ人員,変更後の出願人員(=applicants),出願倍率(2/25)(=rate)
  roles: { schoolName: 1, department: 2, quota: 7, finalApplicants: 12, finalRate: 13 },
};

/** 栃木県R8倍率PDFの学校別データ全3頁分（`tochigi-r8-geometry.json`）を解析する。 */
export function parseTochigi(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, TOCHIGI_LAYOUT))
  );
  return assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });
}
