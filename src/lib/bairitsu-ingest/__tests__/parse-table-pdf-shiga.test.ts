import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';
import { SHIGA_COMPETITION_RATES } from '@/data/competition-rates/shiga';
import shigaR8Geometry from '../__fixtures__/shiga-r8-geometry.json';

/**
 * T-Y11B 段階2-b: shiga(滋賀県)のR8倍率パーサ検証テスト。61/61件・44校・完全一致
 * （段階2-b31県目）。
 *
 * ⚠️着手時、`doc.get_text()`のプレーンテキスト出力に学校名が1件も現れず「ToUnicode欠落で
 * テキストパーサ対象外か」と誤認しかけたが、実際に使う`get_text("rawdict")`の文字単位抽出
 * では学校名（膳所・堅田等）が正しく取得できることを確認済み＝テキストパーサ対象内。
 *
 * 【資料の構造】列は[学校名/学科名/科名/選抜名/推薦の種類/募集人数a/学校独自検査受検者数/
 * 学力検査受検者数/確定募集人数a'/入学許可予定者数b]。選抜は「学校独自型」（自己推薦・
 * 中学校長推薦＝他県の特色選抜・推薦選抜と同じ理由でスコープ外）と「一般型」の2種があり、
 * 対象は一般型のみ。quota=確定募集人数a'（資料上「(304)」のように括弧書きで印字）、
 * finalApplicants=入学許可予定者数b（末尾の数値）。倍率は資料に印字されておらず、既存データも
 * 同様に`applicants÷quota`を自前算出しているため、パーサ側もT-Y11Cで確立した
 * `roundHalfUpScaled`（BigInt整数演算・floatの丸め誤差を踏まない）で算出し突合する。
 *
 * ⚠️罠1: 学校名ラベルは結合セルの**中央付近の行**に出現し先頭行には出現しない（ibaraki型）。
 * 罫線を見て「学校名列（x0が小さい側）をまたぐ完全な行」だけをブロック境界として使う
 * 必要がある。**ただしブロック内部は罫線でこれ以上細分化されない**（複数学科を持つ学校の
 * 各学科の「一般型」行同士の間に罫線が引かれない・瀬田工業の実例）ため、罫線でブロック
 * 境界を求めた後、ブロック内部はさらに文字y座標の近さだけで細かく行クラスタリングし直す
 * （罫線ベースの粗いブロック分割＋y座標ベースの細かい行復元、という2段階構成が必要）。
 *
 * ⚠️罠2: 「一般型」というラベル自体は、複数学科がある学校では該当学科の行に必ずしも
 * 乗らない（結合セルの都合で別の学科の行にラベルが寄ることがある）。学校独自型の行は
 * quota列が生数値（例:「60」）なのに対し、一般型の行は必ず確定募集人数が「(60)」という
 * 括弧書きで印字されるため、**ラベルではなく括弧の有無**で一般型行を判別する方が頑健
 * （瀬田工業の機械・化学工業で、選抜名ラベルが乗らない行でも括弧付きquotaは正しく検出できる
 * ことを実測確認済み）。
 *
 * ⚠️罠3: 「両方の学科」を持つ学校（膳所・草津東・守山北・高島・米原の5校）は、各学科の
 * 一般型行に加えて学科を特定しない「両方の学科」という追加行（quota列は「-」で空欄・
 * finalApplicants/finalRateだけを持つ）が存在する。既存データの方針は「一般型の全学科行＋
 * 両方の学科行のquota・finalApplicantsを単純合算して1レコードに統合する」（膳所の実例で
 * quota304+36=340・applicants363+2+109=474が既存データと完全一致することを検算済み）。
 *
 * ⚠️罠4: 学科名は「学科名」列（汎用カテゴリ）と「科名」列（具体名）の2つの副列が隣接した
 * x範囲に印字され、単一の列として結合抽出すると「家庭」+「家庭科学」→「家庭家庭科学」
 * のように前半が後半の接頭辞として重複することがある（理数理数→理数のような完全重複も
 * 同型）。列のx境界で機械的に2分割しようとすると単語の途中（「普　　通」等の均等割り付け
 * された1語）を誤って分断する事故が起きるため、**列を分けず結合したテキストに対して
 * 「最長の接頭辞Aで後半がAから始まるものを探し、後半だけを採用する」文字列側のdedupで
 * 解決する**（列のx分割ではなく文字列の構造で判定する点が他県と異なる）。
 *
 * ⚠️罠5: 全日制の表の後、同じPDF内に【定時制】セクションが続き、能登川など一部の学校名が
 * 全日制・定時制の両方に登場する（能登川は定時制で昼間部/夜間部の2レコードを持つ）。
 * 【定時制】という見出し文字列に到達したら以降を打ち切る必要がある（他県の定時制と同じ
 * 理由でスコープ外）。
 */

const boundaries = [45, 85, 148, 196, 240, 267, 305, 340];
// 0 学校名, 1 学科名+科名(結合), 2 選抜名, 3 推薦の種類(未使用),
// 4 quota(確定募集人数a'・括弧書き), 5 学力検査受検者数(未使用), 6 入学許可予定者数b(=finalApplicants)
const numCols = boundaries.length - 1;
const fullLineX0Max = 60;

interface FineRow {
  y: number;
  schoolName: string;
  department: string;
  senbatsu: string;
  quotaText: string;
  num2Text: string;
}

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function cellTextFromChars(chars: PdfPageGeometry['chars'], colIdx: number): string {
  const inCol = chars.filter((c) => columnIndexForX((c.x0 + c.x1) / 2) === colIdx);
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

function fineRowsInRange(chars: PdfPageGeometry['chars'], yTop: number, yBottom: number): FineRow[] {
  const inRange = [...chars].filter((c) => c.y0 >= yTop - 0.5 && c.y0 < yBottom - 0.5).sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
  for (const c of inRange) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < 1.5);
    if (row) row.chars.push(c);
    else rows.push({ y: c.y0, chars: [c] });
  }
  rows.sort((a, b) => a.y - b.y);
  return rows.map((r) => ({
    y: r.y,
    schoolName: cellTextFromChars(r.chars, 0),
    department: cellTextFromChars(r.chars, 1),
    senbatsu: cellTextFromChars(r.chars, 2),
    quotaText: cellTextFromChars(r.chars, 4),
    num2Text: cellTextFromChars(r.chars, 6),
  }));
}

// フェーズ1: 罫線（学校名列をまたぐ完全な行のみ）でブロック（学校）境界のy範囲を求める。
function blockRangesForPage(geom: PdfPageGeometry): { yTop: number; yBottom: number }[] {
  const sortedLines = [...geom.hlines].sort((a, b) => a.y - b.y);
  const mergedLines: { y: number; x0: number }[] = [];
  for (const h of sortedLines) {
    const last = mergedLines[mergedLines.length - 1];
    if (last && Math.abs(last.y - h.y) < 1.0) {
      last.x0 = Math.min(last.x0, h.x0);
    } else {
      mergedLines.push({ y: h.y, x0: h.x0 });
    }
  }
  const fullLines = mergedLines.filter((l) => l.x0 <= fullLineX0Max);
  const ranges: { yTop: number; yBottom: number }[] = [];
  for (let i = 0; i < fullLines.length - 1; i++) {
    ranges.push({ yTop: fullLines[i].y, yBottom: fullLines[i + 1].y });
  }
  return ranges;
}

function dedupDoubledText(s: string): string {
  for (let len = Math.floor(s.length / 2); len >= 1; len--) {
    const a = s.slice(0, len);
    const rest = s.slice(len);
    if (rest.startsWith(a)) return rest;
  }
  return s;
}

function normalizeDept(s: string): string {
  return normalizeDepartmentText(dedupDoubledText(normalizeExtractedText(s)));
}

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function parseAllPages(geometries: PdfPageGeometry[]): ParsedRow[] {
  type RowWithBlockEnd = FineRow & { isBlockEnd: boolean; effectiveDepartment: string };
  const allRows: RowWithBlockEnd[] = [];
  for (const geom of geometries) {
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom);
      for (const r of fine) allRows.push({ ...r, isBlockEnd: false, effectiveDepartment: '' });
      if (allRows.length) allRows[allRows.length - 1].isBlockEnd = true;
    }
  }

  // 【定時制】は他県の定時制と同じ理由でスコープ外（能登川が定時制に再登場し重複する事故を実測で発見）。
  const cutIdx = allRows.findIndex((r) => (r.schoolName + r.department).includes('定時制'));
  const scopedRows = cutIdx === -1 ? allRows : allRows.slice(0, cutIdx);

  const blocks: RowWithBlockEnd[][] = [];
  let currentBlock: RowWithBlockEnd[] = [];
  for (const r of scopedRows) {
    currentBlock.push(r);
    if (r.isBlockEnd) {
      blocks.push(currentBlock);
      currentBlock = [];
    }
  }
  if (currentBlock.length) blocks.push(currentBlock);

  const records: ParsedRow[] = [];
  for (const block of blocks) {
    const schoolNameRaw = block.map((r) => r.schoolName).find((s) => s.length > 0) ?? '';
    const schoolName = normalizeExtractedText(schoolNameRaw);
    if (!schoolName) continue;

    // 単科校は一般型行自身のdepartment列が空欄（学科名は学校独自型セクションの行にしか
    // 印字されない）ため、ブロック内で直前に見えた非空の学科名をcarry-forwardする。
    let lastDept = '';
    for (const r of block) {
      if (r.department) lastDept = r.department;
      r.effectiveDepartment = r.department || lastDept;
    }

    const targetRows = block.filter((r) => /\([0-9,]+\)/.test(r.quotaText) || normalizeExtractedText(r.department).includes('両方の学科'));
    if (targetRows.length === 0) continue;

    const parsed = targetRows.map((r) => {
      const quotaMatch = r.quotaText.match(/\(([0-9,]+)\)/);
      const quota = quotaMatch ? Number(quotaMatch[1].replace(/,/g, '')) : 0;
      const finalApplicants = Number(r.num2Text.replace(/,/g, ''));
      return { department: normalizeDept(r.effectiveDepartment), quota, finalApplicants };
    });

    const hasBothDepartments = parsed.some((p) => p.department.includes('両方の学科'));
    if (hasBothDepartments) {
      const quota = parsed.reduce((acc, p) => acc + (Number.isFinite(p.quota) ? p.quota : 0), 0);
      const finalApplicants = parsed.reduce((acc, p) => acc + (Number.isFinite(p.finalApplicants) ? p.finalApplicants : 0), 0);
      const deptNames = [...new Set(parsed.filter((p) => !p.department.includes('両方の学科')).map((p) => p.department))];
      const department = `${deptNames.join('・')}(一般型・両方の学科含む)`;
      records.push({ schoolName, department, quota, finalApplicants, finalRate: Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100 });
    } else {
      for (const p of parsed) {
        if (!Number.isFinite(p.quota) || !Number.isFinite(p.finalApplicants) || p.quota <= 0) continue;
        records.push({ schoolName, department: p.department, quota: p.quota, finalApplicants: p.finalApplicants, finalRate: Number(roundHalfUpScaled(p.finalApplicants, p.quota, 2)) / 100 });
      }
    }
  }
  return records;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (shiga R8 実データ検証・罫線ブロック境界＋y座標細分の2段階構成)', () => {
  const geometries = shigaR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = SHIGA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（61件・44校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(61);
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

  test('「両方の学科」を持つ膳所は各学科行＋両方の学科行のquota・finalApplicantsを合算した1レコードになる', () => {
    expect(parsed.find((r) => r.schoolName === '膳所')).toEqual({
      schoolName: '膳所',
      department: '普通・理数(一般型・両方の学科含む)',
      quota: 340,
      finalApplicants: 474,
      finalRate: 1.39,
    });
  });

  test('学科名+科名の結合による前半重複（家庭→家庭科学）が正しく解消される', () => {
    expect(parsed.find((r) => r.schoolName === '大津' && r.department === '家庭科学')).toEqual({
      schoolName: '大津',
      department: '家庭科学',
      quota: 48,
      finalApplicants: 80,
      finalRate: 1.67,
    });
  });

  test('括弧を持たない「一般型」ラベル未整列行でも括弧の有無だけで学校独自型と区別できる（瀬田工業の実例）', () => {
    const seta = parsed.filter((r) => r.schoolName === '瀬田工業');
    expect(seta).toEqual([
      { schoolName: '瀬田工業', department: '機械', quota: 60, finalApplicants: 133, finalRate: 2.22 },
      { schoolName: '瀬田工業', department: '電気', quota: 60, finalApplicants: 119, finalRate: 1.98 },
      { schoolName: '瀬田工業', department: '化学工業', quota: 20, finalApplicants: 45, finalRate: 2.25 },
    ]);
  });

  test('【定時制】以降が打ち切られ能登川が全日制の1件のみになる', () => {
    const notogawa = parsed.filter((r) => r.schoolName === '能登川');
    expect(notogawa).toHaveLength(1);
    expect(notogawa[0]).toEqual({ schoolName: '能登川', department: '普通', quota: 84, finalApplicants: 116, finalRate: 1.38 });
  });
});
