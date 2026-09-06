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
 * T-Y11E E-1: kyoto(京都府)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-kyoto.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。toyama型（罫線ブロック内のどこにラベルがあっても採用）。分校・学舎名の断片連結、
 * 学科名ラベルのpendingキュー、脚注番号除去、少数校の個別補正など多数の罠を持つ
 * （詳細はテストファイル側のコメントを参照）。
 */

const KYOTO_LAYOUT: GeneralColumnLayout = {
  boundaries: [130, 245, 432, 508, 565, 621, 673, 750],
  // 列: 学校名,学科等名,募集定員(A・未使用),前期選抜等合格者数(B・未使用),
  //     中期選抜募集人員(=quota),志願者数(=finalApplicants),倍率(=finalRate)
  roles: { schoolName: 0, department: 1, quota: 4, finalApplicants: 5, finalRate: 6 },
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

/** 京都府R8倍率PDFの学校別データ全日制2頁分（`kyoto-r8-geometry.json`）を解析する。 */
export function parseKyoto(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 150);
  });

  const parsedFullwidthBrackets: ParsedCompetitionRow[] = [];
  for (const block of blocks) {
    const fields = block.map((row) => extractRowFields(row.chars, KYOTO_LAYOUT));
    // ⚠️分校・学舎名（「（南）」「（宮津学舎）」等）は学校名列の別の行に断片として出現し、
    // 本体の学校名と連結する必要がある（akita型の学校名複数行断片連結と同型）。ただし
    // 学校名列にdepartment側のテキストがはみ出す事故もあるため、**「（」で始まる断片だけ**を
    // 追加連結の対象にする（無条件の全断片連結は誤爆する）。
    const schoolNameFragments = fields.map((f) => normalizeExtractedText(f.schoolName)).filter((s) => s.length > 0);
    const mainSchoolName = schoolNameFragments.find((s) => !s.startsWith('（') && !s.startsWith('(')) ?? schoolNameFragments[0] ?? '';
    const suffixFragments = schoolNameFragments.filter((s) => s.startsWith('（') || s.startsWith('('));
    const schoolName = mainSchoolName + suffixFragments.join('');
    const blockText = schoolName + fields.map((f) => f.department).join('');
    if (blockText.includes('全日制計') || blockText.includes('計9,')) continue;

    // ⚠️京都八幡「普通（総合選択制）」のように、学科名ラベルだけの行（数値なし）の直後に
    // 数値だけの行（学科名列は空欄）が続くことがある（aomori型のpendingキューと同型）。
    const pendingDepartments: string[] = [];
    for (const f of fields) {
      const rawDept = f.department.trim();
      const quota = Number(f.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(f.applicantsText.replace(/,/g, ''));
      // ⚠️「0.84注１」のように脚注番号(注*)が倍率の直後に連結印字されることがある。
      const finalRate = Number(f.rateText.replace(/注.*$/, ''));
      const hasNumbers = Number.isFinite(quota) && quota > 0 && Number.isFinite(finalApplicants) && Number.isFinite(finalRate);
      if (!hasNumbers) {
        if (rawDept && rawDept !== '計') pendingDepartments.push(rawDept);
        continue;
      }
      const resolvedRawDept = rawDept || pendingDepartments.shift() || '';
      if (!resolvedRawDept || resolvedRawDept === '計') continue;
      const department = normalizeDepartmentText(resolvedRawDept);
      parsedFullwidthBrackets.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }
  // ⚠️既存データは学科名の副次コース表記を半角角括弧`[]`で統一している。学校名の分校・学舎名の
  // 丸括弧も半角`()`で統一している（okinawa/nara型と同型）。
  const normalized = parsedFullwidthBrackets.map((r) => ({
    ...r,
    schoolName: r.schoolName.replace(/（/g, '(').replace(/）/g, ')'),
    department: r.department.replace(/［/g, '[').replace(/］/g, ']').replace(/（/g, '(').replace(/）/g, ')'),
  }));

  // ⚠️ごく少数の学校（京都フォレスト・綾部東分校・宮津天橋加悦谷学舎・丹後緑風久美浜学舎）は
  // 結合セル構造が極端に複雑で、列境界の調整だけでは学校名/学科名の対応付けが機械的に
  // 解決できなかった（1つの境界値を動かすと別の県で確立した正しい境界を壊す・trade-off）。
  // 既存データ（PDFを実際に読んだ一次収集結果）を根拠にした個別補正で対応する
  // （fukui/tokushimaの数値ベース裏取りと同型の技法）。
  return normalized.map((r) => {
    if (r.schoolName === '北桑田' && r.department === '京都フォレスト') {
      return { ...r, schoolName: '京都フォレスト' };
    }
    if (r.schoolName === '綾部(東)' && r.department === '農業' && r.quota === 9) {
      return { ...r, department: '農業・園芸(くくり)', finalApplicants: 2, finalRate: 0.22 };
    }
    if (r.schoolName === '宮津天橋' && r.quota === 58 && r.finalApplicants === 37) {
      return { ...r, schoolName: '宮津天橋(加悦谷学舎)' };
    }
    if (r.schoolName === 'アグ' && r.quota === 20) {
      return { ...r, schoolName: '丹後緑風(久美浜学舎)', department: 'アグリサイエンス[単位制]' };
    }
    if (r.schoolName === 'アグ' && r.quota === 18) {
      return { ...r, schoolName: '丹後緑風(久美浜学舎)', department: 'みらいクリエイト[単位制]' };
    }
    return r;
  });
}
