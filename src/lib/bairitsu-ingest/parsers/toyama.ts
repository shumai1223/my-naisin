import {
  groupCharsIntoRows,
  extractRowFields,
  normalizeExtractedText,
  normalizeDepartmentText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';

/**
 * T-Y11E E-1: toyama(富山県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-toyama.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。「第6パターン: ブロック内のどこにラベルが来るか予測できない」問題を、罫線のy座標
 * だけでブロック（1校ぶんの行の集合）を機械的に決定することで解決している（詳細な経緯は
 * テストファイル側のコメントを参照）。
 */

const TOYAMA_LAYOUT: GeneralColumnLayout = {
  boundaries: [75, 310, 600, 690, 780, 870, 960, 1050],
  roles: { schoolName: 0, department: 1, quota: 4, finalApplicants: 5, finalRate: 6 },
};

const TOYAMA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '魚津工業|電気情報科': '機械創造科・電気情報科・ＩＴ環境化学科（くくり募集）',
  '中央農業|園芸デザイン科': '生物生産科・園芸デザイン科・バイオ技術科（くくり募集）',
};

interface ClusteredRow {
  y: number;
  chars: PdfPageGeometry['chars'];
}

/** 罫線のy座標だけでブロック（1校ぶんの行の集合）を決定する（内部罫線の有無に依存しない）。 */
function groupRowsIntoBlocks(rows: ClusteredRow[], hlines: PdfPageGeometry['hlines']): ClusteredRow[][] {
  const sorted = [...hlines].sort((a, b) => a.y - b.y);
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

/**
 * 富山県R8倍率PDFの学校別データ2頁分（`toyama-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列2頁は生PDF全3頁中の物理ページ1〜2
 * （3頁目はスコープ外。2026-09-11にpdftotext -f 1で入善「普通科」finalRate0.58が
 * 物理ページ1のみに実在することを確認）。オフセットは配列添字+1。
 */
export function parseToyama(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const blocksWithPage = geometries.flatMap((geom, pageIdx) => {
    const page = pageIdx + 1;
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines).map((block) => ({ page, block }));
  });

  const parsed: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  for (const { page, block } of blocksWithPage) {
    const fields = block.map((row) => extractRowFields(row.chars, TOYAMA_LAYOUT));
    const schoolName = fields.map((f) => normalizeExtractedText(f.schoolName)).find((s) => s.length > 0) ?? '';
    if ((schoolName + fields.map((f) => f.department).join('')).includes('合計')) continue;

    for (const f of fields) {
      const rawDept = f.department.trim();
      const department = TOYAMA_DEPARTMENT_OVERRIDES[`${schoolName}|${rawDept}`] ?? normalizeDepartmentText(f.department);
      if (!rawDept) continue;
      const quota = Number(f.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
      const finalRate = Number(f.rateText);
      if (!Number.isFinite(quota) || quota <= 0 || !Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
      const rowIndex = rowIndexByPage.get(page) ?? 0;
      rowIndexByPage.set(page, rowIndex + 1);
      parsed.push({ schoolName, department, quota, finalApplicants, finalRate, page, rowIndex });
    }
  }
  return parsed;
}
