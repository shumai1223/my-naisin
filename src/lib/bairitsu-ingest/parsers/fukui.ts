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
 * T-Y11E E-1: fukui(福井県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-fukui.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。aomori型（罫線ブロック・fullLineX0Max判定・学科名/数値の行分離のpendingキュー）を
 * 流用しつつ、鯖江のくくり募集2件だけはpendingDepartmentsのFIFO消費では正しい学科名に
 * 対応付けられないため、既存データで確定済みの数値をキーにした`SABAE_VALUE_OVERRIDES`で
 * 明示補正している（詳細な経緯はテストファイル側のコメントを参照）。
 */

const FUKUI_LAYOUT: GeneralColumnLayout = {
  boundaries: [55, 68, 115, 225, 300, 340, 440, 475, 505],
  roles: { schoolName: 1, department: 2, quota: 4, finalApplicants: 6, finalRate: 7 },
};

const FUKUI_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '足羽|普通キャリアデザイン': '普通（キャリアデザイン）',
  '足羽|多文化共生中国語・英語': '多文化共生（中国語・英語）',
  '足羽|多文化共生日本語': '多文化共生（日本語）',
  '丸岡|普通みらい共創': '普通（みらい共創）',
  '丸岡|普通スポーツ探究': '普通（スポーツ探究）',
  '鯖江|普通スタンダード': '普通（スタンダード）',
  '坂井|食農科学農業': '食農科学（農業）',
  '坂井|食農科学食品': '食農科学（食品）',
  '坂井|機械・自動車機械': '機械・自動車（機械）',
  '坂井|機械・自動車自動車': '機械・自動車（自動車）',
  '坂井|電気・情報システム電気': '電気・情報システム（電気）',
  '坂井|電気・情報システム情報システム': '電気・情報システム（情報システム）',
  '坂井|ビジネス・生活デザインビジネス': 'ビジネス・生活デザイン（ビジネス）',
  '坂井|ビジネス・生活デザイン生活デザイン': 'ビジネス・生活デザイン（生活デザイン）',
  '奥越明成|生活福祉生活': '生活福祉（生活）',
  '奥越明成|生活福祉福祉': '生活福祉（福祉）',
};

/**
 * 鯖江のくくり募集2件は、学科名の子コースラベルが数値行より先に複数個ぶん積み上がる
 * ため、pendingDepartmentsのFIFO消費だけでは正しい学科名に対応付けられない（数値自体は
 * 正しく抽出できることをquota/applicants一致で確認済み）。既存データの数値をキーに、
 * 学校名を明示的に上書きする。
 */
const SABAE_VALUE_OVERRIDES: Record<string, string> = {
  '14|14': '普通（スポーツ・健康福祉くくり募集）',
  '26|29': '普通（IT・アートデザインくくり募集）',
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

/** 福井県R8倍率PDFの学校別データ（`fukui-r8-geometry.json`）を解析する。 */
export function parseFukui(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 75);
  });

  const parsed: ParsedCompetitionRow[] = [];
  for (const block of blocks) {
    const fields = block.map((row) => extractRowFields(row.chars, FUKUI_LAYOUT));
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
      const sabaeValueOverride = schoolName === '鯖江' ? SABAE_VALUE_OVERRIDES[`${quota}|${finalApplicants}`] : undefined;
      const department = sabaeValueOverride ?? FUKUI_DEPARTMENT_OVERRIDES[`${schoolName}|${resolvedRawDept}`] ?? normalizeDepartmentText(resolvedRawDept);
      parsed.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }
  return parsed;
}
