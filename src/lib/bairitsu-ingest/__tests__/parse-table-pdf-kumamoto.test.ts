import { normalizeExtractedText, type PdfPageGeometry } from '../parse-table-pdf';
import { KUMAMOTO_COMPETITION_RATES } from '@/data/competition-rates/kumamoto';
import kumamotoR8Geometry from '../__fixtures__/kumamoto-r8-geometry.json';

/**
 * T-Y11B 段階2-b: kumamoto(熊本県)のR8倍率パーサ検証テスト。ibaraki型（罫線ブロック・学校名列
 * は結合セル）をベースに、この県特有の2つの罠を追加で解決する。
 *
 * ⚠️罠1: 単一学科校は学科名を学校名列に「学校名（学科名）」として直接埋め込む
 * （例:「済々黌（普通）」）。長い学校名では閉じ括弧「）」が学科名列側に列境界を越えて
 * はみ出すことがある（例:「翔陽（総合学科）」）ため、学校名列・学科名列の生テキストを連結
 * してから括弧の対応を取る必要がある（片方の列だけを見ると判定できない）。
 *
 * ⚠️罠2: 分校（本校と独立した番号を持たない）は「〃」（同上記号）+分校名で学校名を表す
 * （例:「天草」の次のブロックが「〃倉岳校（普通）」→「天草倉岳校」）。この「〃」は学校名列
 * 側に出現する（罠1の学校名（学科名）パターンと同一行に同時出現することがある）。一方、
 * 学科名列側に出現する「〃」（例:「〃(キャリアコース)」）は学科の同上参照であり、直前の
 * 学科の基底名（括弧より前の部分）と連結する（意味が異なる2種類の「〃」を列の出現位置で
 * 判別する）。
 *
 * 罠1・2をまとめて解決する`resolveSingleDeptSchool`は、学校名列が「〃」で始まれば直前の
 * 学校名を前置してから、学校名列+学科名列の連結テキストに対して`/^([^（]*)（([^）]*)）$/`
 * （＝括弧の中身が丸ごと1つの学科名として完結し、後に何も続かない）を試みる。一致すれば
 * 単一学科校（分校の場合も含む）、一致しなければ通常の複数学科校の行として扱う。
 *
 * ⚠️学校集計行（学校名のみで学科名列が空・全学科の定員/志願者数の合計を示す）はレコード化
 * 不要のため、学科名が空の行は`quota<=0`と同じ扱いでスキップされる（`resolveSingleDeptSchool`
 * が学科名を復元できない限り、department文字列は空のまま）。
 *
 * ⚠️既存データ（`kumamoto.ts`）は学科名の括弧を半角`()`で統一している（okinawa/nara型と同型の
 * 例外）。列構成は[学校名/学科名/前期(特色)選抜等合格内定者数/後期(一般)募集人員(=quota)/
 * 当初出願者数/増減/出願確定者数(=finalApplicants)/学区外(内数)/8年度倍率(=finalRate)/
 * 7年度倍率]の10列（quota/finalApplicants/finalRateが学校名・学科名に隣接しないためroles指定
 * が必要・ishikawa型と同型）。
 *
 * くくり募集3組（矢部の食農科学2コース／大津の普通・理数／上天草の普通・グローカル文理コース）
 * は、広域ラベルを持つ行に数値が乗り、具体ラベルのみの行は数値を持たない（nagano/須坂創成型と
 * 同様に真の帰属ルールが幾何学的に決定できない）ため、`(学校名, quota, finalApplicants)`を
 * キーにした値ベースoverride（fukui/tottori型）で対応する。
 *
 * フィクスチャは令和8年度公表PDF（`kumamoto-r8.pdf`・全5頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。5頁目末尾の「計」行（グランドトータル）で機械的に打ち切り、以降の
 * 備考欄（脚注テキスト）は対象外とした。
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
}

function extractRows(geom: PdfPageGeometry): RawRow[] {
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

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function parseAllPages(geometries: PdfPageGeometry[]): ParsedRow[] {
  const allRecords: ParsedRow[] = [];
  let prevBlockSchoolName = '';
  for (const geom of geometries) {
    const scoped = extractRows(geom);
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
        allRecords.push({ schoolName: blockSchoolName, department: overridden ?? dept, quota, finalApplicants, finalRate });
      }
      blockRows = [];
    };
    for (const row of scoped) {
      blockRows.push(row);
      if (row.isBlockEnd) flush();
    }
    flush();
  }
  return allRecords;
}

describe('bairitsu-ingest parse-table-pdf 結合セル組み立て (kumamoto R8 実データ検証・単一学科校の括弧埋め込み+分校の同上記号)', () => {
  const geometries = kumamotoR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = KUMAMOTO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（162件・52校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(162);
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

  test('学校集計行・地区見出し行は収録されない（学科名を持たない行はスキップ）', () => {
    expect(parsed.every((r) => r.department.length > 0)).toBe(true);
    expect(parsed.some((r) => r.schoolName === '')).toBe(false);
  });

  test('機械集計のグランドトータルが公式資料の「計」行（quota8,322・applicants7,295）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(8322);
    expect(sumApplicants).toBe(7295);
  });
});
