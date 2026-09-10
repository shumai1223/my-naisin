import { normalizeExtractedText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1: kumamoto(熊本県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-kumamoto.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。ibaraki型（罫線ブロック・学校名列は結合セル）をベースに、単一学科校の
 * 「学校名（学科名）」埋め込みパターンと、分校の「〃」（同上記号）が学校名列/学科名列で
 * 意味が異なる罠を解決する`resolveSingleDeptSchool`を持つ。くくり募集3組の値ベースoverride
 * も含む（詳細はテストファイル側のコメントを参照）。
 */

const BOUNDARIES = [66.5, 130.1, 229.2, 281.9, 329.15, 361.1, 385.9, 426.1, 457.6, 493.1, 535];
const NUM_COLS = BOUNDARIES.length - 1;
// idx: 0 schoolName, 1 department, 2 前期(特色)内定者数, 3 quota, 4 当初出願者数,
//      5 増減, 6 finalApplicants, 7 学区外(内数), 8 finalRate, 9 7年度倍率
const ROLES = { schoolName: 0, department: 1, quota: 3, finalApplicants: 6, finalRate: 8 };

const KUKURI_OVERRIDE = new Map<string, string>([
  ['矢部|27|1', '食農科学(農業科学コース)・(食・生活コース)'],
  ['大津|276|180', '普通・理数'],
  ['上天草|63|6', '普通・(グローカル文理コース)'],
]);

function normalizeDepartmentTextHalfwidth(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・');
}

interface RawRow {
  schoolNameRaw: string;
  departmentRaw: string;
  quotaText: string;
  applicantsText: string;
  rateText: string;
  isBlockEnd: boolean;
  page: number;
}

function extractRows(geom: PdfPageGeometry, page: number): RawRow[] {
  const { chars, hlines } = geom;
  const fullLineX0Max = 100;
  const sorted = [...hlines].sort((a, b) => a.y - b.y);
  const merged: { y: number; x0: number }[] = [];
  for (const h of sorted) {
    const last = merged[merged.length - 1];
    if (last && Math.abs(last.y - h.y) < 1.0) {
      last.x0 = Math.min(last.x0, h.x0);
    } else {
      merged.push({ y: h.y, x0: h.x0 });
    }
  }
  const rows: RawRow[] = [];
  for (let i = 0; i < merged.length - 1; i++) {
    const yTop = merged[i].y;
    const yBottom = merged[i + 1].y;
    if (yBottom - yTop < 3) continue;
    const rowChars = chars.filter((c) => c.y0 >= yTop - 0.5 && c.y0 < yBottom - 0.5);
    if (rowChars.length === 0) continue;
    const cell: PdfPageGeometry['chars'][] = Array.from({ length: NUM_COLS }, () => []);
    for (const c of rowChars) {
      const cx = (c.x0 + c.x1) / 2;
      for (let i2 = 0; i2 < NUM_COLS; i2++) {
        if (cx >= BOUNDARIES[i2] - 1 && cx < BOUNDARIES[i2 + 1] - 1) {
          cell[i2].push(c);
          break;
        }
      }
    }
    for (const arr of cell) arr.sort((a, b) => a.x0 - b.x0);
    const join = (arr: PdfPageGeometry['chars']) => arr.map((c) => c.c).join('').trim();
    rows.push({
      schoolNameRaw: join(cell[ROLES.schoolName]),
      departmentRaw: join(cell[ROLES.department]),
      quotaText: join(cell[ROLES.quota]),
      applicantsText: join(cell[ROLES.finalApplicants]),
      rateText: join(cell[ROLES.finalRate]),
      isBlockEnd: merged[i + 1].x0 <= fullLineX0Max,
      page,
    });
  }
  const cutIdx = rows.findIndex((r) => !r.departmentRaw && normalizeExtractedText(r.schoolNameRaw) === '計');
  return cutIdx === -1 ? rows : rows.slice(0, cutIdx);
}

function resolveSingleDeptSchool(schoolNameRaw: string, departmentRaw: string, prevSchoolName: string) {
  let raw = schoolNameRaw;
  let namePrefix = '';
  if (raw.startsWith('〃')) {
    namePrefix = prevSchoolName;
    raw = raw.slice(1);
  }
  const combined = raw + departmentRaw;
  if (combined.includes('（')) {
    const m = combined.match(/^([^（]*)（([^）]*)）$/);
    if (m) return { schoolName: namePrefix + m[1], department: m[2] };
  }
  return { schoolName: namePrefix + raw, department: departmentRaw };
}

/**
 * 熊本県R8倍率PDFの学校別データ全5頁分（`kumamoto-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: pageは各行が属する物理ページ番号（配列添字+offset）。
 * ブロック(blockRows)は毎ページ末尾で強制flushされ次ページへ跨がないため、行のpageは常に
 * そのブロックのflush元と一致する。rowIndexByPageで同一ページ内の出力順を0始まりで採番。
 */
export function parseKumamoto(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRecords: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  let prevBlockSchoolName = '';
  geometries.forEach((geom, pageIdx) => {
    const page = pageIdx + 1;
    const scoped = extractRows(geom, page);
    let blockRows: RawRow[] = [];
    const flush = () => {
      if (blockRows.length === 0) return;
      const resolved = blockRows.map((r) => ({ r, res: resolveSingleDeptSchool(r.schoolNameRaw, r.departmentRaw, prevBlockSchoolName) }));

      let blockSchoolName = '';
      for (const { res } of resolved) {
        const sn = normalizeExtractedText(res.schoolName);
        if (sn) {
          blockSchoolName = sn;
          break;
        }
      }
      if (blockSchoolName) prevBlockSchoolName = blockSchoolName;

      let blockBaseDept = '';
      for (const { r, res } of resolved) {
        const deptRaw = res.department;
        if (!deptRaw) continue;
        let dept = normalizeExtractedText(deptRaw);
        if (dept.startsWith('〃')) {
          dept = blockBaseDept + dept.slice(1);
        } else {
          blockBaseDept = dept.split(/[（(]/)[0];
        }
        dept = normalizeDepartmentTextHalfwidth(dept);
        const quota = Number(r.quotaText.replace(/,/g, ''));
        const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
        const finalRate = Number(r.rateText);
        if (!Number.isFinite(quota) || quota <= 0) continue;
        if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;

        const overridden = KUKURI_OVERRIDE.get(`${blockSchoolName}|${quota}|${finalApplicants}`);
        const rowIndex = rowIndexByPage.get(r.page) ?? 0;
        rowIndexByPage.set(r.page, rowIndex + 1);
        allRecords.push({ schoolName: blockSchoolName, department: overridden ?? dept, quota, finalApplicants, finalRate, page: r.page, rowIndex });
      }
      blockRows = [];
    };
    for (const row of scoped) {
      blockRows.push(row);
      if (row.isBlockEnd) flush();
    }
    flush();
  });
  return allRecords;
}
