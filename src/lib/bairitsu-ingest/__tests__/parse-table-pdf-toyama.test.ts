import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { TOYAMA_COMPETITION_RATES } from '@/data/competition-rates/toyama';
import toyamaR8Geometry from '../__fixtures__/toyama-r8-geometry.json';

/**
 * T-Y11B 段階2-b: toyama(富山県)のR8倍率パーサ検証テスト。
 *
 * ⚠️**第6のパターン「ブロック内のどこにラベルが来るか予測できない」**（2026-09-02発見）:
 * ibaraki型は「結合セルの中央付近」・tochigi型は「先頭行」に学校名ラベルが固定的に出現する
 * 前提だったが、toyamaは**同じ表の中で学校ごとにラベルの出現位置が不規則**（入善は3行中2行目、
 * 桜井は3行中2行目だが学科名と同居、魚津・魚津工業・上市は先頭行に学科名と同居、滑川は5行中
 * 3行目）。単純なcarry-forwardでは先頭行に学科ラベルが無い学校（入善等）で直前の学校名を
 * 誤って引き継いでしまう。
 *
 * **解法**: 罫線（hlines）は「学校の境界」を正確にマークしている（結合セル内部を分割する線は
 * 存在しない＝ibaraki型と違い内部罫線に頼れないが、外周の罫線は信頼できる）。罫線のy座標だけで
 * 「ブロック」（1校ぶんの行の集合）を機械的に決定し、**ブロック内のどの行にラベルがあっても
 * そのブロック全体の学校名として採用する**（位置に依存しない）。
 *
 * フィクスチャは令和8年度公表PDF（`toyama-r8.pdf`・全3頁のうち学校別データの2頁分[page index
 * 0-1]）。3頁目は「(大学科別)」という学科ごとの県全体集計表（学校別ではない）のためスコープ外。
 */
const TOYAMA_LAYOUT: GeneralColumnLayout = {
  boundaries: [75, 310, 600, 690, 780, 870, 960, 1050],
  // 列: 学校名,学科・コース,募集定員(A・未使用),推薦内定等数(B・未使用),
  //     推薦内定等を除いた募集人数(A-B=quota),志願者数(=finalApplicants),倍率(=finalRate)
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

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (toyama R8 実データ検証・第6パターン: ブロック内ラベル位置不定)', () => {
  const geometries = toyamaR8Geometry as PdfPageGeometry[];

  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines);
  });

  const parsed: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }[] = [];
  for (const block of blocks) {
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
      parsed.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }

  const expectedR8Records = TOYAMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（75件・34校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(75);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p?.schoolName, department: p?.department, quota: p?.quota, finalApplicants: p?.finalApplicants, finalRate: p?.finalRate }).toEqual({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('内数コース（普通科(体育コース)等・括弧で囲まれた印字）は二重計上を避けるため収録されない', () => {
    expect(parsed.some((r) => r.department.includes('体育コース') || r.department.includes('自然科学コース') || r.department.includes('音楽コース'))).toBe(false);
  });

  test('探究科学科の人文社会科学科（数値が印字されない側）は収録されない', () => {
    expect(parsed.some((r) => r.department.includes('人文社会科学科'))).toBe(false);
  });

  test('グランドトータル「合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 5020)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データの「合計」行（quota5,020・applicants4,482）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(5020);
    expect(sumApplicants).toBe(4482);
  });
});
