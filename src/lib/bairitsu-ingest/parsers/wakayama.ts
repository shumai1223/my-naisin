import {
  parseTablePdfPageRows,
  assembleCompetitionRateRows,
  type PdfPageGeometry,
  type TableColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: wakayama(和歌山県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-wakayama.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。全1頁・ibaraki型（結合セル・罫線でブロック境界判定）だが、この県特有の最大の罠は
 * 列構成そのもの: quota(=入学者枠数A)とfinalApplicants(=D+E、スポーツ推薦本出願者数Dと
 * 一般選抜本出願者数Eの合算)が別々の列で、単一列をfinalApplicantsに割り当てる既存のroles
 * 機構では表現できない。`extraColumns`でDを追加取得し、`.map()`してEにDを加算してから
 * `assembleCompetitionRateRows`へ渡す（kochi型の拡張と同型）。分校4校の複合名合成・くくり
 * 募集3組の値ベースoverride・括弧の全角→半角post-processも行う（詳細はテストファイル側の
 * コメントを参照）。
 */

const WAKAYAMA_LAYOUT: TableColumnLayout = {
  // 0学校名,1学科名,2学級数,3定員,4内定者数,5全国枠1,6A(quota),7B,8C,9全国枠2,10rate1,11D,12E,13全国枠3,14rate2(finalRate)
  boundaries: [83, 127, 204, 225, 255, 270, 296, 318, 341, 366, 386, 417, 441, 464, 487, 512],
  fullLineX0Max: 100,
  roles: { schoolName: 0, department: 1, quota: 6, finalApplicants: 12, finalRate: 14 },
  extraColumns: { d: 11 },
};

/** PDFは全角括弧で印字するが、既存データは括弧をすべて半角で統一する県固有の表記慣行を持つ。
 *  脚注番号(*1〜*5)も学科名の末尾に連結印字されるため、既存データに合わせて除去する。 */
function toHalfWidthParens(s: string): string {
  return s
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/\*\d+$/, '');
}

/** くくり募集3組: 主課程行にのみ数値が乗り、内数コース名は別の数値を持たない行に分裂する。 */
const KUKURI_OVERRIDE = new Map<string, string>([
  ['有田中央|105|60', '総合学科(総合・福祉)'],
  ['南部|97|55', '食と農園科(園芸・加工流通・調理)'],
  ['串本古座|111|48', '未来創造学科(宇宙探究・地域探究/文理探究)'],
]);

/** 和歌山県R8倍率PDFの学校別データ全1頁分（`wakayama-r8-geometry.json`）を解析する。 */
export function parseWakayama(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const rawRows = geometries.map((geom) => {
    const rows = parseTablePdfPageRows(geom, WAKAYAMA_LAYOUT);
    return rows.map((r) => ({
      ...r,
      applicantsText: String(Number(r.applicantsText.replace(/,/g, '') || 0) + Number(r.extra.d.replace(/,/g, '') || 0)),
    }));
  });

  const assembled = assembleCompetitionRateRows(rawRows, '合計', {
    excludeRow: (department) => department === '計' || department.includes('合計'),
  }).filter((r) => r.quota > 0);
  // ⚠️Number('')は0(finite)を返すため、内部進学専用行やくくり募集の内数コース行(数値が
  // 一切乗らない)がquota=0のまま素通りする。`assembleCompetitionRateRows`のNaNチェックは
  // 空欄と真の0を区別できないため、quota>0を明示的な不変条件として追加で要求する。

  let lastNonBranchSchool = '';
  return assembled.map((r) => {
    const branchMatch = /^\((.+)\)$/.exec(r.schoolName);
    const schoolName = branchMatch ? `${lastNonBranchSchool}(${branchMatch[1]})` : r.schoolName;
    if (!branchMatch) lastNonBranchSchool = schoolName;
    const department = toHalfWidthParens(r.department);
    const override = KUKURI_OVERRIDE.get(`${schoolName}|${r.quota}|${r.finalApplicants}`);
    return { schoolName, department: override ?? department, quota: r.quota, finalApplicants: r.finalApplicants, finalRate: r.finalRate };
  });
}
