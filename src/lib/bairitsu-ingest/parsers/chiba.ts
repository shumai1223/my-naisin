import {
  groupCharsIntoRows,
  extractRowFields,
  assembleSimpleTableRows,
  normalizeExtractedText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: chiba(千葉県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-chiba.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（学校名セルの結合が無い・単純carry-forward）で、独自の学科名/学校名の
 * オーバーライドは不要な最も単純な部類（学校名列の行頭に付く「番号」「市」+番号だけを
 * 正規表現で除去する）。詳細な経緯はテストファイル側のコメントを参照。
 */

const CHIBA_LAYOUT: GeneralColumnLayout = {
  boundaries: [95, 212, 396, 444, 498, 536, 580],
  // 列: 番号+学校名,学科名,募集定員(A・未使用),募集人員(B=quota),
  //     志願者確定数(C=finalApplicants),倍率(C/B=finalRate)
  roles: { schoolName: 0, department: 1, quota: 3, finalApplicants: 4, finalRate: 5 },
};

/**
 * 千葉県R8倍率PDFの学校別データ5頁分（`chiba-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: 概要ページ等は無く物理ページ1から詳細表が始まる
 * （2026-09-10に`pdftotext -f 1`で千葉のquota240/applicants331が物理ページ1に実在する
 * ことを確認済み）。出典ロケータ用のpageは配列添字+1（オフセット無し）。
 */
export function parseChiba(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRowFields = geometries.flatMap((geom, pageIdx) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => {
      const fields = extractRowFields(row.chars, CHIBA_LAYOUT);
      // 学校名列の行頭「番号」（市立校は「市」+番号）を除去する。
      return { ...fields, schoolName: fields.schoolName.replace(/^[＊市]?\d+[\s　]*/, ''), page: pageIdx + 1 };
    })
  );

  return assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => {
      const combined = normalizeExtractedText(schoolName) + normalizeExtractedText(department);
      return combined.includes('合計');
    },
  });
}
