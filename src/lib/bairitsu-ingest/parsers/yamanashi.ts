import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: yamanashi(山梨県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-yamanashi.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）。くくり募集4組は「○○（一括）」の
 * 1行完結ラベルで既に表現されており複数行合成は不要。既存データは学科名の括弧を半角に統一して
 * いるため、パース後に全角括弧を半角へ変換するpost-processが必要（詳細はテストファイル側のコメント参照）。
 */

const YAMANASHI_LAYOUT: GeneralColumnLayout = {
  boundaries: [50, 100, 188, 210, 405, 428, 480, 515, 545],
  // 列: 学校名,学科名,後期募集人員(=quota),志願変更等3列+2/19時点志願者数(未使用),
  //     最終志願者数(帰国内数の括弧を除く先頭の数字だけを含む=finalApplicants),
  //     帰国内数の残り+空白(未使用),倍率(帰国を除く=finalRate),前年同期倍率(未使用)
  roles: { schoolName: 0, department: 1, quota: 2, finalApplicants: 4, finalRate: 6 },
};

/**
 * 山梨県R8倍率PDFの学校別データ2頁分（`yamanashi-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: 全7頁中1頁目は概要（総括）で、学校別詳細表は
 * 物理ページ2〜3の2頁（2026-09-10にpdftoppmでビジョン確認: 先頭の北杜「普通」
 * (quota49/applicants45)が物理ページ2に、末尾の甲府商業「情報処理」
 * (quota48/applicants48)が物理ページ3に実在）。出典ロケータ用のpageは配列添字+2。
 */
export function parseYamanashi(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => ({ ...extractRowFields(row.chars, YAMANASHI_LAYOUT), page: pageIdx + 2 }))
  );

  const parsed = assembleSimpleTableRows(allRowFields, {
    // ⚠️「県立高校計」等の集計ラベルは学校名列/学科名列の境界をまたいで分裂することがある
    // （nara型の教訓と同型）。既知の集計ラベルへの前方一致で判定する。
    excludeRow: (schoolName, department) => {
      if (department.trim() === '計') return true;
      const combined = schoolName + department;
      return ['県立高校計', '市立高校計', '全日制課程計'].some((marker) => combined.startsWith(marker));
    },
  });

  // ⚠️既存データはokinawa/nara型と同じく学科名の括弧を半角で統一している。
  return parsed.map((r) => ({ ...r, department: r.department.replace(/（/g, '(').replace(/）/g, ')') }));
}
