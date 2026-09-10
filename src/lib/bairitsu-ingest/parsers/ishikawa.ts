import { parseTablePdfPageRows, assembleCompetitionRateRows, type PdfPageGeometry, type TableColumnLayout, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1/E-6: ishikawa(石川県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-nonadjacent-roles.test.ts`（T-Y11B段階2-bで検証済み・
 * 「quota/applicants/rateが隣接しない列構成」向け検証(ishikawa型)の基準実装）から移設。
 * 小松・金沢泉丘・七尾の3校が持つ「普・理併願」という学科横断の合算制度はパーサの出力から
 * 正しく分離できないため、既存データを根拠にした明示的な置き換えを行う（詳細はテストファイル
 * 側のコメントを参照）。
 */

const LAYOUT: TableColumnLayout = {
  boundaries: [45, 65, 130, 210, 245, 280, 315, 345, 380],
  fullLineX0Max: 65,
  syntheticTopY: 110,
  roles: { schoolName: 1, department: 2, quota: 5, finalApplicants: 6, finalRate: 7 },
};

const COMBINED_APPLICATION_OVERRIDES: ParsedCompetitionRow[] = [
  { schoolName: '小松', department: '普通・理数（併願あり・合算）', quota: 320, finalApplicants: 377, finalRate: 1.18 },
  { schoolName: '金沢泉丘', department: '普通・理数（併願あり・合算）', quota: 400, finalApplicants: 490, finalRate: 1.23 },
  { schoolName: '七尾', department: '普通・普通(文系フロンティア)・理数（併願あり・合算）', quota: 200, finalApplicants: 188, finalRate: 0.94 },
];
const COMBINED_APPLICATION_SCHOOLS = new Set(COMBINED_APPLICATION_OVERRIDES.map((r) => r.schoolName));

function applyCombinedApplicationOverrides(records: ParsedCompetitionRow[]): ParsedCompetitionRow[] {
  const withoutBroken = records.filter((r) => !COMBINED_APPLICATION_SCHOOLS.has(r.schoolName) && r.schoolName !== '普');
  return [...withoutBroken, ...COMBINED_APPLICATION_OVERRIDES];
}

/**
 * 石川県R8倍率PDFの学校別データ2頁分（`ishikawa-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: 全3頁中1頁目は総括表（概要）で、学校別詳細表は
 * 物理ページ2〜3の2頁（2026-09-10にpdftoppmでビジョン確認: 先頭の大聖寺実業が
 * 物理ページ2の「1/2」ラベル付きページに実在）。出典ロケータ用のpageは配列添字+2。
 * COMBINED_APPLICATION_OVERRIDESの3校（小松・金沢泉丘・七尾）は複数の物理行を合算した
 * 既存データによる置き換えのため、単一の行位置に帰属できずpage/rowIndexは付与しない
 * （意図的にundefinedのまま・Y-0の捏造回避原則に従い1行1出典が成立しないレコードへ
 * 無理に値を割り当てない）。
 */
export function parseIshikawa(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const pageRows = geometries.map((geom, pageIdx) =>
    parseTablePdfPageRows(geom, LAYOUT).map((r) => ({ ...r, page: pageIdx + 2 }))
  );
  return applyCombinedApplicationOverrides(assembleCompetitionRateRows(pageRows, '全県合計', { excludeRow: (department) => department.includes('小計') }));
}
