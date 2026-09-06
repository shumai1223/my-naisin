import { parseTablePdfPageRows, assembleCompetitionRateRows, type PdfPageGeometry, type TableColumnLayout, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1/E-6: ibaraki(茨城県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf.test.ts`（T-Y11B段階2-bで検証済み・
 * 「罫線+結合セル」向け組み立て(ibaraki型)の基準実装）から移設。県固有のoverrideを
 * 一切持たない最も単純な部類（詳細はテストファイル側のコメントを参照）。
 */

const IBARAKI_LAYOUT: TableColumnLayout = {
  boundaries: [60.1, 114.6, 182.2, 223.6, 265.0, 306.4],
  fullLineX0Max: 65,
};

/** 茨城県R8倍率PDFの学校別データ全3頁分（`ibaraki-r8-geometry.json`）を解析する。 */
export function parseIbaraki(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const pageRows = geometries.map((geom) => parseTablePdfPageRows(geom, IBARAKI_LAYOUT));
  return assembleCompetitionRateRows(pageRows, '全日制計');
}
