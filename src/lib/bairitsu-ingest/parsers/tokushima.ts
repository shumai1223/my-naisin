import {
  parseTablePdfPageRows,
  assembleCompetitionRateRows,
  filterGeometryByXRange,
  type PdfPageGeometry,
  type TableColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1/E-6: tokushima(徳島県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-multi-column.test.ts`（T-Y11B段階2-bで検証済み・
 * 「1ページに複数の表が左右に並ぶ県」向け組み立て(tokushima型)の基準実装）から移設。
 * 全日制が左右2段組で、各段が独立にibaraki型の学校名遅延を起こす。那賀/海部の1件は幾何学的に
 * 一意に決定できない既知の曖昧ケースのため既存データを根拠に補正する（詳細はテストファイル側の
 * コメントを参照）。
 *
 * ⚠️この県のfixtureは他県と異なり単一頁分の`PdfPageGeometry`オブジェクト（配列ではない）。
 * レジストリ型との整合のため引数は`PdfPageGeometry[]`のまま受け取り、内部で先頭要素を使う。
 */

const LEFT_LAYOUT: TableColumnLayout = {
  boundaries: [30, 102.72, 177.84, 211.92, 246, 280.92],
  fullLineX0Max: 50,
  syntheticTopY: 75,
  syntheticBottomY: 560,
};
const MIDDLE_LAYOUT: TableColumnLayout = {
  boundaries: [290, 355.92, 430.44, 464.52, 500.64, 536.4],
  fullLineX0Max: 300,
  syntheticTopY: 75,
  syntheticBottomY: 560,
};

/**
 * 那賀/海部の学校名帰属は幾何学的に一意に決まらない（「那賀」ラベル単独行の直前データ行が
 * 実は海部の学科である）。既存データ（WebSearch裏取り済み）に合わせて2レコードを入れ替える。
 */
function applyKnownAmbiguityCorrection(records: ParsedCompetitionRow[]): ParsedCompetitionRow[] {
  return records.map((r) => {
    if (r.schoolName === '那賀' && r.department === '普通' && r.quota === 30) {
      return { ...r, schoolName: '海部' };
    }
    if (r.schoolName === '海部' && r.department === '普通' && r.quota === 47) {
      return { ...r, schoolName: '那賀' };
    }
    return r;
  });
}

/** 徳島県R8倍率PDFの学校別データ全1頁分（`tokushima-r8-geometry.json`）を解析する。 */
export function parseTokushima(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const geom = geometries[0];
  const leftRows = parseTablePdfPageRows(filterGeometryByXRange(geom, 30, 290), LEFT_LAYOUT);
  const middleRows = parseTablePdfPageRows(filterGeometryByXRange(geom, 290, 545), MIDDLE_LAYOUT);
  const leftRecords = assembleCompetitionRateRows([leftRows], '合計');
  const middleRecords = assembleCompetitionRateRows([middleRows], '合計');
  return applyKnownAmbiguityCorrection([...leftRecords, ...middleRecords]);
}
