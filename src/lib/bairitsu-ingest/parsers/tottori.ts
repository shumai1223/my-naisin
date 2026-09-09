import {
  groupCharsIntoRows,
  extractRowFields,
  normalizeExtractedText,
  normalizeDepartmentText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: tottori(鳥取県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-tottori.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。toyama型（罫線ブロック内のどこにラベルがあっても採用）。既存データが`area`
 * （東部/中部/西部）フィールドを持つ唯一の県のため、戻り値は標準の`ParsedCompetitionRow`に
 * `area`を加えた形。学校名列の複数行断片連結・小計行の除外・くくり募集3組の「学校計」行
 * 採用・1学科校の大学科/小学科列分裂復元など多数の罠を持つ（詳細はテストファイル側のコメント
 * を参照）。
 */

export interface TottoriParsedRow {
  schoolName: string;
  area: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
  /**
   * T-Y11F §5順序#8（出典ロケータ）用。この行が由来するPDFの1始まりページ番号
   * （`geometries`配列の添字+1）。
   */
  page: number;
  /** #8用。同一ページ内でこの行が何番目に出力されたか（0始まり）。 */
  rowIndex: number;
}

const TOTTORI_LAYOUT: GeneralColumnLayout = {
  boundaries: [0, 53, 95, 142, 230, 260, 295, 320, 350, 380, 410, 440, 465, 495, 520, 547],
  roles: { schoolName: 1, department: 3, quota: 5, finalApplicants: 12, finalRate: 13 },
};
/** 大学科(広域区分)列だけを`department`役として読み直すための補助レイアウト（後述の1学科校の
 *  ラベル分裂復元に使う）。 */
const TOTTORI_BROAD_LAYOUT: GeneralColumnLayout = {
  boundaries: TOTTORI_LAYOUT.boundaries,
  roles: { ...TOTTORI_LAYOUT.roles, department: 2 },
};

const AREA_BY_PAGE = ['東部', '中部', '西部'] as const;

const KUKURI_DEPARTMENT_OVERRIDE: Record<string, string> = {
  鳥取東: '普通・理数（くくり募集）',
  智頭農林: '生産科学・森林科学（くくり募集）',
  鳥取工業: '工業（機械・電気・情報工学・建設工学）（くくり募集）',
};

interface ClusteredRow {
  y: number;
  chars: PdfPageGeometry['chars'];
}

function groupRowsIntoBlocks(rows: ClusteredRow[], hlines: PdfPageGeometry['hlines'], fullLineX0Max: number): ClusteredRow[][] {
  const fullLines = hlines.filter((h) => h.x0 <= fullLineX0Max);
  const sorted = [...fullLines].sort((a, b) => a.y - b.y);
  const boundaries: number[] = [];
  for (const h of sorted) {
    if (boundaries.length && Math.abs(boundaries[boundaries.length - 1] - h.y) < 3.0) continue;
    boundaries.push(h.y);
  }
  const blocks: ClusteredRow[][] = Array.from({ length: Math.max(boundaries.length - 1, 0) }, () => []);
  for (const row of rows) {
    for (let i = 0; i < boundaries.length - 1; i++) {
      if (row.y >= boundaries[i] - 0.5 && row.y < boundaries[i + 1] - 0.5) {
        blocks[i].push(row);
        break;
      }
    }
  }
  return blocks.filter((b) => b.length > 0);
}

/** 鳥取県R8倍率PDFの学校別データ全3頁分（`tottori-r8-geometry.json`）を解析する。 */
export function parseTottori(geometries: PdfPageGeometry[]): TottoriParsedRow[] {
  const parsed: TottoriParsedRow[] = [];
  geometries.forEach((geom, pageIdx) => {
    // ⚠️`geometries`はPDF全8頁のうち学校別詳細表の3頁（東部/中部/西部）だけを抜き出した
    // サブセット（`tottori-r8-geometry.json`はconcat元PDF全体でなくこの3頁分のみを保持）。
    // 詳細表は物理ページ5〜7（1〜4頁は地区別概要・8頁は定時制で対象外）のため、
    // 出典ロケータ用のpageは物理ページ番号（pageIdx+5）を記録する（pdftotext -f 5で
    // 実際に鳥取東の数値290/280/294が現れることを2026-09-10に確認済み）。
    const page = pageIdx + 5;
    let rowIndex = 0;
    const area = AREA_BY_PAGE[pageIdx];
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    const blocks = groupRowsIntoBlocks(rows, geom.hlines, 90);

    for (const block of blocks) {
      const fields = block.map((row) => extractRowFields(row.chars, TOTTORI_LAYOUT));
      const schoolNameFragments = fields.map((f) => normalizeExtractedText(f.schoolName)).filter((s) => s.length > 0);
      const schoolName = schoolNameFragments.join('');
      if (!schoolName) continue;

      if (schoolName in KUKURI_DEPARTMENT_OVERRIDE) {
        const totalRow = fields.find((f) => f.department.includes('計'));
        if (!totalRow) continue;
        const quota = Number(totalRow.quotaText.replace(/,/g, ''));
        const finalApplicants = Number(totalRow.applicantsText.replace(/,/g, ''));
        const finalRate = Number(totalRow.rateText.replace(/,/g, ''));
        if (!Number.isFinite(quota) || !Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
        parsed.push({ schoolName, area, department: KUKURI_DEPARTMENT_OVERRIDE[schoolName], quota, finalApplicants, finalRate, page, rowIndex: rowIndex++ });
        continue;
      }

      const broadFields = block.map((row) => extractRowFields(row.chars, TOTTORI_BROAD_LAYOUT));
      // ⚠️1学科のみの学校（学校計行を持たない単独ブロック）は、学科名が「大学科列＋小学科列」の
      // 2列にまたがって分散印字されることがある（青谷「総合」→大学科列「総」＋小学科列「合」の
      // ように1単語が2列に割れて中央寄せされる／鳥取西「普通」のように両列に同じ語が重複印字
      // される、の2パターン）。多学科の学校（鳥取湖陵等）は大学科列が「農業」等の広域区分の
      // ラベルであり小学科列とは無関係の別の語なので、小学科列だけを採用する必要がある。
      // 判定は「学科計行を除いた実データ行が1本だけのブロックか」で行う（複数学科ブロックの
      // 大学科ラベルは複数の小学科行にまたがって共有されるため、この条件では該当しない）。
      const realRowCount = fields.filter((f) => f.department.trim() && !f.department.includes('計')).length;
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        const rawNarrow = f.department.trim();
        if (!rawNarrow || rawNarrow.includes('計')) continue;
        const rawBroad = broadFields[i].department.trim();
        const rawDept = realRowCount === 1 && rawBroad && rawBroad !== rawNarrow ? rawBroad + rawNarrow : rawNarrow;
        const quota = Number(f.quotaText.replace(/,/g, ''));
        const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
        const finalRate = Number(f.rateText.replace(/,/g, ''));
        if (!Number.isFinite(quota) || quota <= 0) continue;
        if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
        parsed.push({ schoolName, area, department: normalizeDepartmentText(rawDept), quota, finalApplicants, finalRate, page, rowIndex: rowIndex++ });
      }
    }
  });
  return parsed;
}
