import {
  parseTablePdfPageRows,
  assembleCompetitionRateRows,
  type PdfPageGeometry,
  type TableColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: shimane(島根県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-shimane.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。全日制1頁・ibaraki型（結合セル・罫線でブロック境界判定）だが、この県特有の最大の罠は
 * くくり募集の組み立てられ方: 代表学科（数値が実際に乗る学科）が独自のミニブロックを形成し、
 * そのブロックの「学校名列」には学校名でなく学科群の名前が印字される（幾何学的に区別不能）。
 * 既知の4件を固定のCONTINUATION_LABELSとして扱い、直前に登場した真の学校名へ後処理で書き戻す。
 * 松江市立皆美が丘女子高等学校は学校名セルが2行に文字単位で混入するため、観測された不可解な
 * 文字列そのものをキーにした直接のSCHOOL_NAME_OVERRIDEで対応する（詳細はテストファイル側の
 * コメントを参照）。
 */

const SHIMANE_LAYOUT: TableColumnLayout = {
  // 0学校名,1学科名,2未使用,3quota(i),4未使用(k),5applicants(j),6未使用,7未使用,8rate(p)
  boundaries: [100, 150, 185, 441.65, 460.7, 479.8, 500.6, 560, 613.6, 638.3],
  fullLineX0Max: 120,
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 5, finalRate: 8 },
};

const SCHOOL_NAME_OVERRIDE: Record<string, string> = { 皆松美江が市丘立女子: '皆美が丘女子' };

/**
 * くくり募集3組: 代表学科のブロックの学校名列には学科群名が印字される（幾何学的に区別不能）。
 * ⚠️2026-09-10(T-Y11F §5順序#7): 「情報科学」はここには含めない。段階台帳作業で島根県立
 * 情報科学高等学校（安来市・Wikipediaにも独立項目がある実在の独立校）が安来の隣接行に現れる
 * ため従来「安来の継続ブロック」と誤認していたと判明。「令和8年度島根県公立高等学校入学者選抜
 * 一般選抜等合格者数及び第２次募集募集人員一覧」(3/13)・同「学力検査受検状況」(3/4)の2資料でも
 * 情報科学が学級数3・入学定員120の独立行として掲載されており誤認ではないことを確認した。
 */
const CONTINUATION_LABELS = new Set(['商業', '普通']);

/** くくり募集の内数コース名合成。既存データを根拠にした値ベースoverride。 */
const KUKURI_OVERRIDE = new Map<string, string>([
  ['情報科学|72|46', '情報科学(情報システム・情報処理・マルチメディア)'],
  ['松江商業|101|133', '商業(商業・国際ビジネス・情報処理)'],
  ['浜田商業|44|29', '商業(商業・情報処理)'],
  ['隠岐島前|51|17', '普通(普通・地域共創)'],
]);

/** 島根県R8倍率PDFの学校別データ全日制1頁分（`shimane-r8-geometry.json`）を解析する。 */
export function parseShimane(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const rawRows = geometries.map((geom) => parseTablePdfPageRows(geom, SHIMANE_LAYOUT));
  const assembled = assembleCompetitionRateRows(rawRows, '合計', {
    excludeRow: (department) => department.includes('計'),
  }).filter((r) => r.quota > 0);
  // ⚠️罠(wakayama型の再確認): Number('')は0(finite)を返すため、くくり募集の内数コース行
  // （数値が一切乗らない継続行）がquota=0の偽レコードとしてassembleCompetitionRateRowsの
  // NaNチェックを素通りする。quota>0を呼び出し側の不変条件として追加要求する。

  let lastRealSchool = '';
  return assembled.map((r) => {
    const renamed = SCHOOL_NAME_OVERRIDE[r.schoolName] ?? r.schoolName;
    const schoolName = CONTINUATION_LABELS.has(renamed) ? lastRealSchool : renamed;
    if (!CONTINUATION_LABELS.has(renamed)) lastRealSchool = schoolName;
    const override = KUKURI_OVERRIDE.get(`${schoolName}|${r.quota}|${r.finalApplicants}`);
    return { schoolName, department: override ?? r.department, quota: r.quota, finalApplicants: r.finalApplicants, finalRate: r.finalRate };
  });
}
