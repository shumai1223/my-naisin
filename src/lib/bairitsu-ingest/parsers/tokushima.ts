import {
  parseTablePdfPageRows,
  assembleCompetitionRateRows,
  filterGeometryByXRange,
  type PdfPageGeometry,
  type TableColumnLayout,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1/E-6: tokushima(徳島県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-multi-column.test.ts`（T-Y11B段階2-bで検証済み・
 * 「1ページに複数の表が左右に並ぶ県」向け組み立て(tokushima型)の基準実装）から移設。
 * 全日制が左右2段組で、各段が独立にibaraki型の学校名遅延を起こす。
 *
 * ⚠️2026-09-10（T-Y11F段階台帳17県目調査時）: かつて「那賀/海部は幾何学的に一意に決定できない
 * 曖昧ケース」としてWebSearch裏取りを根拠に2レコードのschoolNameを入れ替える
 * `applyKnownAmbiguityCorrection`補正が存在したが、段階台帳用に取得した独立3資料（受検状況・
 * 合格状況・募集人員）およびR7〜R5の3年度分の一貫した大小関係（那賀=小規模23〜33・海部=大規模
 * 48〜50）と突き合わせたところ、**このパーサの生の幾何学的パース結果（那賀=30・海部=47）が正しく、
 * 補正の方が誤りだった**と判明したため補正関数を削除した。`competition-rates/tokushima.ts`側も
 * 同時に訂正済み（詳細は同ファイルのヘッダコメント参照）。
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
 * 徳島県R8倍率PDFの学校別データ全1頁分（`tokushima-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: ehimeと同型の1頁2段組（LEFT/MIDDLE）のため、
 * LEFT呼び出し・MIDDLE呼び出しで`assembleCompetitionRateRows`のrowIndexが独立に0始まり
 * となり同一page+rowIndexが重複しうる。MIDDLE側のrowIndexに同一ページのLEFT側件数分の
 * オフセットを加えて一意性を保つ（「左段を上から読み、続けて中段を上から読む」という
 * 一貫した順序として解釈）。物理ページは1のみ・オフセット無し。
 */
export function parseTokushima(geometries: PdfPageGeometry[]) {
  const geom = geometries[0];
  const leftRows = parseTablePdfPageRows(filterGeometryByXRange(geom, 30, 290), LEFT_LAYOUT).map((r) => ({ ...r, page: 1 }));
  const middleRows = parseTablePdfPageRows(filterGeometryByXRange(geom, 290, 545), MIDDLE_LAYOUT).map((r) => ({ ...r, page: 1 }));
  const leftRecords = assembleCompetitionRateRows([leftRows], '合計');
  const middleRecordsRaw = assembleCompetitionRateRows([middleRows], '合計');
  const leftCountByPage = new Map<number, number>();
  for (const r of leftRecords) {
    if (r.page === undefined) continue;
    leftCountByPage.set(r.page, (leftCountByPage.get(r.page) ?? 0) + 1);
  }
  const middleRecords = middleRecordsRaw.map((r) =>
    r.page === undefined || r.rowIndex === undefined ? r : { ...r, rowIndex: r.rowIndex + (leftCountByPage.get(r.page) ?? 0) }
  );
  return [...leftRecords, ...middleRecords];
}
