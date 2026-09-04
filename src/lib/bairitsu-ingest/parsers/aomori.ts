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
 * T-Y11E E-1: aomori(青森県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-aomori.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。「学科名テキストと数値が別の行に分離することがある」問題を、数値を持たない
 * 「学科名のみの行」をpendingキューに積み、数値を持つ行で学科名列が空欄だった場合に
 * 消費する方式で解決している（詳細な経緯はテストファイル側のコメントを参照）。
 */

const AOMORI_LAYOUT: GeneralColumnLayout = {
  boundaries: [55, 105, 190, 315, 388, 455, 515, 560],
  roles: { schoolName: 1, department: 2, quota: 4, finalApplicants: 5, finalRate: 6 },
};

const AOMORI_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '青森商業|商業': '商業・情報処理(くくり)',
  '五所川原|普通': '普通・理数(くくり)',
  '三沢商業|商業': '商業・情報処理(くくり)',
};

interface ClusteredRow {
  y: number;
  chars: PdfPageGeometry['chars'];
}

/**
 * ⚠️aomoriではtoyamaと異なり、学科ごとの内部区切り線が実在する（ibaraki型と同じ）。
 * 区切り線のx0が学校名列に届いていない（x0≈181.8＝部分線）ものは「学科の内部区切り」であり
 * ブロック境界ではない。学校名列を跨ぐ完全線（x0≈108.9）だけが真のブロック境界。
 * `fullLineX0Max`未満のx0を持つ線だけをブロック境界として採用する。
 */
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

/** 青森県R8倍率PDFの学校別データ2頁分（`aomori-r8-geometry.json`）を解析する。 */
export function parseAomori(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 150);
  });

  const parsed: ParsedCompetitionRow[] = [];
  for (const block of blocks) {
    const fields = block.map((row) => extractRowFields(row.chars, AOMORI_LAYOUT));
    const schoolName = fields.map((f) => normalizeExtractedText(f.schoolName)).find((s) => s.length > 0) ?? '';
    if ((schoolName + fields.map((f) => f.department).join('')).includes('合計')) continue;

    const pendingDepartments: string[] = [];
    for (const f of fields) {
      const rawDept = normalizeExtractedText(f.department);
      const quota = Number(f.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
      const finalRate = Number(f.rateText);
      const hasNumbers = Number.isFinite(quota) && quota > 0 && Number.isFinite(finalApplicants) && Number.isFinite(finalRate);
      if (!hasNumbers) {
        if (rawDept) pendingDepartments.push(rawDept);
        continue;
      }
      const resolvedRawDept = rawDept || pendingDepartments.shift() || '';
      if (!resolvedRawDept) continue;
      const department = AOMORI_DEPARTMENT_OVERRIDES[`${schoolName}|${resolvedRawDept}`] ?? normalizeDepartmentText(resolvedRawDept);
      parsed.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }
  return parsed;
}
