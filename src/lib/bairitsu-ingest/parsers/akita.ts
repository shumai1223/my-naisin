import {
  groupCharsIntoRows,
  extractRowFields,
  assembleNumberedBlockRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1/E-6: akita(秋田県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-numbered-block.test.ts`（T-Y11B段階2-bで検証済み・
 * 「学校名が複数行に折り返す県」向け組み立て(akita型)の基準実装）から移設。分校のrenameOverrides
 * のみを持つ（詳細はテストファイル側のコメントを参照）。
 */

const AKITA_LAYOUT: GeneralColumnLayout = {
  boundaries: [95, 126.1, 188.5, 347.7, 397.8, 448.0, 498.2, 548.4, 598.6, 648.7, 698.9, 749.1, 800.4, 851.8],
  // 列: №,学校名,学科名,募集定員(=quota),特色選抜募集人員,一般選抜募集人員,特色選抜志願者数,
  //     一般選抜志願者数,総志願者(=applicants),特色選抜倍率,総志願者倍率(=rate),昨年特色倍率,昨年総倍率
  roles: { number: 0, schoolName: 1, department: 2, quota: 3, finalApplicants: 8, finalRate: 10 },
};

/**
 * 秋田県R8倍率PDFの学校別データ全2頁分（`akita-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: pageオフセットは県ごとに異なるため生PDFで毎回実測する
 * （2026-09-10確認: 詳細は本ファイルの変更コミット参照）。
 */
export function parseAkita(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => ({ ...extractRowFields(row.chars, AKITA_LAYOUT), page: pageIdx + 1 }))
  );
  return assembleNumberedBlockRows(allRowFields, {
    excludeRow: (department) => department.includes('計'),
    stopAt: (department) => department.includes('県合計'),
    renameOverrides: { 太田分校: '大曲農業(太田分校)', 雄勝校: '湯沢翔北(雄勝校)' },
  });
}
