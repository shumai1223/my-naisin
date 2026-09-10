import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';

/**
 * T-Y11E E-1: oita(大分県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-oita.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。倍率は資料に印字されておらず`roundHalfUpScaled`で自前算出する（nara/shiga型）。
 * 注記がquota/applicants列にはみ出す罠（純粋な数字の時だけ採用するガード）・学科名ラベルと
 * 数値がブロック境界をまたいで分裂する罠（greedy合体アルゴリズム）・中津南耶馬溪校の個別
 * rename・「計」の完全一致除外・定時制セクションの全角スペース均等割り付け検知・くくり募集
 * 2件のoverrideを含む（詳細はテストファイル側のコメントを参照）。
 */

const boundaries = [57.8, 135, 205.3, 264.8, 324.4, 383.9, 443.4, 502.9, 562.4];
// 0 学校名, 1 学科名, 2 入学定員(未使用), 3 quota, 4 当初志願者数(未使用),
// 5 取り下げ数(未使用), 6 提出数(未使用), 7 finalApplicants
const numCols = boundaries.length - 1;

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function rowsForPage(pageChars: PdfPageGeometry['chars']): { y: number; chars: PdfPageGeometry['chars'] }[] {
  const sorted = [...pageChars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
  for (const c of sorted) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < 1.2);
    if (row) row.chars.push(c);
    else rows.push({ y: c.y0, chars: [c] });
  }
  rows.sort((a, b) => a.y - b.y);
  return rows;
}

function cellText(rowChars: PdfPageGeometry['chars'], colIdx: number): string {
  const inCol = rowChars.filter((c) => columnIndexForX((c.x0 + c.x1) / 2) === colIdx);
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

interface RawRow {
  schoolNameRaw: string;
  departmentRaw: string;
  quotaText: string;
  applicantsText: string;
  page: number;
}

const RENAME_ON_DEPARTMENT = new Map<string, string>([['中津南|環境・社会共生', '中津南耶馬溪校']]);
const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['大分舞鶴|普通', '普通・理数（くくり募集）'],
  ['大分東|園芸ビジネス', '園芸ビジネス・園芸デザイン（くくり募集）'],
]);

/**
 * 大分県R8倍率PDFの学校別データ全頁分（`oita-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列4頁は生PDF全4頁と完全一致（概要ページ無し）
 * のためオフセットは配列添字+1（2026-09-11にpdftotext -f 1で中津南「普通」quota175/
 * applicants192が物理ページ1に実在することを確認）。
 */
export function parseOita(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRows: RawRow[] = [];
  geometries.forEach((pg, pageIdx) => {
    const page = pageIdx + 1;
    for (const row of rowsForPage(pg.chars)) {
      allRows.push({
        schoolNameRaw: cellText(row.chars, 0),
        departmentRaw: cellText(row.chars, 1),
        quotaText: cellText(row.chars, 3),
        applicantsText: cellText(row.chars, 7),
        page,
      });
    }
  });

  // 「[ 定 時 制 ]」（全角スペース均等割り付け）は他県の定時制と同じ理由でスコープ外。
  const teijiseiIdx = allRows.findIndex((r) => normalizeExtractedText(r.schoolNameRaw + r.departmentRaw).includes('定時制'));
  const scopedRows = teijiseiIdx === -1 ? allRows : allRows.slice(0, teijiseiIdx);

  const HEADER_MARKERS = ['高等学校', '学　科', '入学定員', '募集人員', '志願変更', '（4枚', '全 日 制', '令和'];
  const dataRows = scopedRows.filter((r) => {
    const combined = r.schoolNameRaw + r.departmentRaw;
    if (HEADER_MARKERS.some((m) => combined.includes(m))) return false;
    if (combined + r.quotaText + r.applicantsText === '') return false;
    // 「うち全国募集は」等の注記サブ行を除外（学科名/学校名列に乗るケース）
    if (combined.includes('うち') || combined.includes('人以内') || combined.includes('人程度')) return false;
    // 全日制合計の総括行を除外
    if (combined.includes('合計')) return false;
    return true;
  });

  const records: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  let currentSchool = '';
  let pendingDept = '';
  let pendingQuota = '';
  let pendingApplicants = '';
  let pendingPage = 0;
  for (const r of dataRows) {
    const sn = normalizeExtractedText(r.schoolNameRaw);
    if (sn) currentSchool = sn;
    if (r.departmentRaw) pendingDept = r.departmentRaw;
    // 罠: 注記がquota/applicants列にはみ出すことがあるため、純粋な数字の時だけ採用する。
    if (/^[0-9,]+$/.test(r.quotaText) && /^[0-9,]+$/.test(r.applicantsText)) {
      pendingQuota = r.quotaText;
      pendingApplicants = r.applicantsText;
      pendingPage = r.page;
    }
    if (pendingDept && pendingQuota && pendingApplicants) {
      const deptNorm = normalizeDepartmentText(pendingDept);
      const quotaTextResolved = pendingQuota;
      const applicantsTextResolved = pendingApplicants;
      const page = pendingPage;
      pendingDept = '';
      pendingQuota = '';
      pendingApplicants = '';
      if (!deptNorm || deptNorm === '計') continue;
      const schoolName = RENAME_ON_DEPARTMENT.get(`${currentSchool}|${deptNorm}`) ?? currentSchool;
      const department = DEPARTMENT_OVERRIDE.get(`${schoolName}|${deptNorm}`) ?? deptNorm;
      const quota = Number(quotaTextResolved.replace(/,/g, ''));
      const finalApplicants = Number(applicantsTextResolved.replace(/,/g, ''));
      if (!Number.isFinite(quota) || quota <= 0 || !Number.isFinite(finalApplicants)) continue;
      const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
      const rowIndex = rowIndexByPage.get(page) ?? 0;
      rowIndexByPage.set(page, rowIndex + 1);
      records.push({ schoolName, department, quota, finalApplicants, finalRate, page, rowIndex });
    }
  }
  return records;
}
