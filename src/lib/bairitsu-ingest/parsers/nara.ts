import {
  groupCharsIntoRows,
  extractRowFields,
  normalizeExtractedText,
  normalizeDepartmentText,
  type PdfPageGeometry,
  type GeneralColumnLayout,
  type ParsedCompetitionRow,
} from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';

/**
 * T-Y11E E-1: nara(奈良県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-nara.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。toyama/aomori型（罫線ブロック内のどこにラベルがあっても採用・学科名/数値の行分離の
 * pendingキュー）を流用するが、資料に倍率が印字されておらず自前算出が必要（`roundHalfUpScaled`
 * で算出し既存データと突合）。既存データは学科名の括弧を半角`()`で統一しており、資料の第一
 * 出願期間の出願者数のみを採用する（詳細はテストファイル側のコメントを参照）。
 */

const NARA_LAYOUT: GeneralColumnLayout = {
  boundaries: [145, 212, 480, 620, 760, 800],
  // 列: 学校名,学科(コース)名,募集人員(=quota),第一出願期間出願者数(=finalApplicants),
  //     第二出願期間出願者数(未使用・対象外)
  roles: { schoolName: 0, department: 1, quota: 2, finalApplicants: 3, finalRate: 4 },
};

const NARA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '国際|国際（ＬＩ）': '国際(LI)',
  '商業|会計': '会計・情報ビジネス・経営ビジネス・総合ビジネス(くくり募集)',
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

/**
 * 奈良県R8倍率PDFの学校別データ2頁分（`nara-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列2頁は生PDF全2頁と完全一致（概要ページ無し）
 * のためオフセットは配列添字+1（2026-09-11にpdftotext -f 1で奈良商工「機械工学」
 * quota74/applicants64が物理ページ1に実在することを確認）。
 */
export function parseNara(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const blocksWithPage = geometries.flatMap((geom, pageIdx) => {
    const page = pageIdx + 1;
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 155).map((block) => ({ page, block }));
  });

  const parsedFullwidthParens: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  for (const { page, block } of blocksWithPage) {
    const fields = block.map((row) => extractRowFields(row.chars, NARA_LAYOUT));
    const schoolName = fields.map((f) => normalizeExtractedText(f.schoolName)).find((s) => s.length > 0) ?? '';
    // ⚠️「会計」のように「計」を含む正当な学科名があるため部分一致では除外できない。かつ
    // 「県立計」の「計」の文字が学校名列にはみ出し schoolName="県" department="立計..." に
    // 分裂することもある（gunma/ehime型と同型）。既知の小計/合計ラベルへの前方一致でのみ除外する。
    const blockText = schoolName + fields.map((f) => f.department).join('');
    if (['県立計', '市立計', '合計', '総計'].some((marker) => blockText.startsWith(marker))) continue;

    // ⚠️添上「普通」→（人文探究）（人文探究以外）・桜井「普通」→（書芸）（書芸以外）のように、
    // 数値を持たない「基底ラベル」1件が、数値を持つ複数の「（コース名）」行に共通して適用される
    // （fukui/aomori型のpendingキュー1個消費とは異なり、基底ラベルは複数回使い回される）。
    // 数値行の学科名が「（」で始まる場合だけ直前の基底ラベルと連結する。
    let currentBaseLabel = '';
    for (const f of fields) {
      const rawDept = normalizeExtractedText(f.department);
      const quota = Number(f.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
      const hasNumbers = Number.isFinite(quota) && quota > 0 && Number.isFinite(finalApplicants);
      if (!hasNumbers) {
        if (rawDept) currentBaseLabel = rawDept;
        continue;
      }
      const isSuffixOnly = rawDept.startsWith('（') || rawDept.startsWith('(');
      const resolvedRawDept = isSuffixOnly ? currentBaseLabel + rawDept : rawDept || currentBaseLabel;
      if (rawDept && !isSuffixOnly) currentBaseLabel = rawDept;
      if (!resolvedRawDept) continue;
      const overridden = NARA_DEPARTMENT_OVERRIDES[`${schoolName}|${resolvedRawDept}`];
      const department = overridden ?? normalizeDepartmentText(resolvedRawDept);
      const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
      const rowIndex = rowIndexByPage.get(page) ?? 0;
      rowIndexByPage.set(page, rowIndex + 1);
      parsedFullwidthParens.push({ schoolName, department, quota, finalApplicants, finalRate, page, rowIndex });
    }
  }
  // ⚠️既存データはokinawa型と同じく学科名の括弧を半角で統一している。
  return parsedFullwidthParens.map((r) => ({ ...r, department: r.department.replace(/（/g, '(').replace(/）/g, ')') }));
}
