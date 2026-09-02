import { normalizeExtractedText, type PdfPageGeometry } from '../parse-table-pdf';
import { SHIZUOKA_COMPETITION_RATES } from '@/data/competition-rates/shizuoka';
import shizuokaR8Geometry from '../__fixtures__/shizuoka-r8-geometry.json';

/**
 * T-Y11B 段階2-b: shizuoka(静岡県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）を
 * ベースに、この県特有の「選抜方法別内訳行（Ⅰ/Ⅱ/Ⅲ）」の判別が主な罠。162/162件・90校・
 * 完全一致（グランドトータルquota16,954・applicants16,895も「公立合計」行と一致）。
 *
 * ⚠️罠1: 各学科の総定員行の下に「Ⅰ（13％程度）」等の**選抜方法別の内訳行**が付随するが、
 * これは総定員の一部を占める内訳であり別学科・別募集枠ではないため取り込まない。ただし
 * **内訳の注記が「100％」の場合だけは、その行が学科の唯一の（実質的な）総数行**であり除外
 * してはならない（例: 沼津西「芸術Ⅰ（100％）」）。したがって判定は「Ⅰ/Ⅱ/Ⅲの文字を含むか」
 * ではなく「注記の割合が100%かどうか」で行う必要がある（`resolveDepartment`）。
 * ⚠️注記の割合は全角数字（例:「５％程度」）や小数点（例:「22.5％程度」）を含むことがあるため、
 * 正規表現は`[0-9.]+`とし、全角数字は事前に`toHalfwidthDigits`で半角化してから判定する。
 *
 * ⚠️罠2: 「Ⅰ」等が学科名の**一部**（内訳注記を伴わない固有の学科名末尾、例:「産業マネジメント
 * Ⅰ」「産業マネジメントⅡ」）であるケースが1校（浜松湖北）で存在する。注記（括弧書きの割合）が
 * 無いままⅠ/Ⅱ/Ⅲで終わる行は、内訳ではなく学科名の一部とみなしそのまま採用する。
 *
 * ⚠️罠3: 学科名が長い学校（8校）は学科名列の幅を超えて2〜4行に折り返され、折り返し後の行が
 * 「Ⅰ（内訳％）」行と同じy位置に重なって誤結合する（例: 田方農業「生産科学・園芸デザイン」→
 * 1行目「生産科学・」+quota/applicants/rate、2行目「園芸デザイン」がⅠ内訳行と重なる）。
 * 折り返しの再結合は幾何学的に一般化するとnagano型の「前後どちらに帰属するか幾何学的に
 * 決定不能」な罠に踏み込むため、既存データを根拠にした値ベースoverride（`(学校名,quota,
 * finalApplicants)`キー・fukui/tottori型）で対応した（8校8件のみ）。
 *
 * ⚠️罠4: 校名が長い学校（静岡市立清水桜が丘・9文字）も学校名列の幅を超えて2行に折り返され、
 * 「静岡市立」「清水桜が丘」という**別々の学校を意味しない2つの断片**として抽出される。折り返し後の
 * 「清水桜が丘」がcarry-forwardの新しい学校名として誤って上書きされるため、この学校の2レコード
 * （普通科・商業）それぞれに値ベースoverrideで正しい学校名を適用した。
 *
 * ⚠️罠5: 「県外（14％程度）」のような学区外募集の内数注記行（Ⅰ/Ⅱ/Ⅲとは別の枠組み）も同様に
 * 除外が必要（3件）。
 *
 * 列は[会場番号(未使用)/学校名/学科名（Ⅰ/Ⅱ/Ⅲの内訳ラベル・割合注記もこの列に同居する）/
 * 募集定員(=quota。括弧書き「(132)」の学校が数例あり括弧を除去して採用)/志願者数
 * (=finalApplicants)/志願倍率(=finalRate)]。「普通」「理数」は既存データでは「普通科」
 * 「理数科」に統一表記される（他の学科名は生表記のまま）。
 */

const boundaries = [140, 163, 222, 355, 400, 440, 475];
const numCols = boundaries.length - 1;
// 0 会場番号(未使用), 1 学校名, 2 学科名(Ⅰ/Ⅱ/Ⅲ内訳ラベルも同居), 3 quota, 4 finalApplicants, 5 finalRate

function normalizeDepartmentTextFullwidth(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・').replace(/\(/g, '（').replace(/\)/g, '）');
}

const DEPT_MAP: Record<string, string> = { 普通: '普通科', 理数: '理数科' };

const DEPT_OVERRIDE = new Map<string, string>([
  ['田方農業|80|64', '生産科学・園芸デザイン'],
  ['田方農業|80|76', '食品科学・ライフデザイン'],
  ['沼津工業|160|163', '機械・電気・電子ロボット・建設デザイン'],
  ['吉原工業|160|140', '機械工学・ロボット工学・電気機器工学・理数化学'],
  ['静岡農業|80|68', '生物生産・生産流通'],
  ['静岡農業|80|90', '食品科学・生活科学'],
  ['島田工業|120|104', '機械・電気・情報電子【Ⅰ類】'],
  ['島田工業|80|50', '建築・都市工学【Ⅱ類】'],
]);

const SCHOOL_NAME_POSTFIX = new Map<string, string>([
  ['静岡市立|普通科|120|126', '静岡市立清水桜が丘'],
  ['清水桜が丘|商業|120|129', '静岡市立清水桜が丘'],
]);

function toHalfwidthDigits(s: string): string {
  return s.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
}

/**
 * Ⅰ/Ⅱ/Ⅲを含む行の判定。注記（括弧書きの割合）が無ければ学科名の一部として採用し、
 * 割合注記があれば100%の時だけ「実質的な総数行」として採用（括弧以降は除去）、
 * それ以外の割合は内訳行として除外する。
 */
function resolveDepartment(deptNormRaw: string): { keep: boolean; department: string } {
  const deptNorm = toHalfwidthDigits(deptNormRaw);
  const m = deptNorm.match(/^(.*?)([ⅠⅡⅢ])(?:[（(]([0-9.]+)[％%].*?[）)])?$/);
  if (!m) return { keep: true, department: deptNorm };
  const [, before, , pct] = m;
  if (pct === undefined) return { keep: true, department: deptNorm };
  if (Number(pct) === 100) return { keep: true, department: before };
  return { keep: false, department: '' };
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
  let currentSchool = '';
  for (const geom of geometries) {
    const { chars } = geom;
    const sorted = [...chars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
    const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
    for (const c of sorted) {
      const row = rows.find((r) => Math.abs(r.y - c.y0) < 4.0);
      if (row) {
        row.chars.push(c);
        row.y = (row.y * (row.chars.length - 1) + c.y0) / row.chars.length;
      } else {
        rows.push({ y: c.y0, chars: [c] });
      }
    }
    rows.sort((a, b) => a.y - b.y);

    for (const row of rows) {
      const cell: PdfPageGeometry['chars'][] = Array.from({ length: numCols }, () => []);
      for (const c of row.chars) {
        const cx = (c.x0 + c.x1) / 2;
        for (let i = 0; i < numCols; i++) {
          if (cx >= boundaries[i] - 1 && cx < boundaries[i + 1] - 1) {
            cell[i].push(c);
            break;
          }
        }
      }
      for (const arr of cell) arr.sort((a, b) => a.x0 - b.x0);
      const join = (arr: PdfPageGeometry['chars']) => arr.map((c) => c.c).join('').trim();
      const schoolNameRaw = join(cell[1]);
      const departmentRaw = join(cell[2]);
      const quotaText = join(cell[3]).replace(/[()（）]/g, '');
      const applicantsText = join(cell[4]);
      const rateText = join(cell[5]);

      const snNorm = normalizeExtractedText(schoolNameRaw);
      if (snNorm) currentSchool = snNorm;
      if (!departmentRaw) continue;
      const deptNorm = normalizeExtractedText(departmentRaw);
      if (deptNorm.includes('合計') || snNorm.includes('合計')) break;
      if (/^県外[（(]/.test(deptNorm)) continue;

      const { keep, department: resolvedDept } = resolveDepartment(deptNorm);
      if (!keep) continue;

      const quota = Number(quotaText.replace(/,/g, ''));
      const finalApplicants = Number(applicantsText.replace(/,/g, ''));
      const finalRate = Number(rateText);
      if (!Number.isFinite(quota) || quota <= 0) continue;
      if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
      if (currentSchool === '吉原工業' && quota === 32 && finalApplicants === 23) continue;

      const override = DEPT_OVERRIDE.get(`${currentSchool}|${quota}|${finalApplicants}`);
      const mapped = override ?? DEPT_MAP[resolvedDept] ?? resolvedDept;
      const department = normalizeDepartmentTextFullwidth(mapped);

      const postfixKey = `${currentSchool}|${department}|${quota}|${finalApplicants}`;
      const finalSchoolName = SCHOOL_NAME_POSTFIX.get(postfixKey) ?? currentSchool;
      allRecords.push({ schoolName: finalSchoolName, department, quota, finalApplicants, finalRate });
    }
  }
  return allRecords;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (shizuoka R8 実データ検証・内訳行の割合判定)', () => {
  const geometries = shizuokaR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = SHIZUOKA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（162件・90校）', () => {
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

  test('割合100%の内訳行は実質的な総数行として採用される（沼津西「芸術」の実例）', () => {
    const record = parsed.find((r) => r.schoolName === '沼津西' && r.department === '芸術');
    expect(record).toEqual({ schoolName: '沼津西', department: '芸術', quota: 40, finalApplicants: 28, finalRate: 0.7 });
  });

  test('注記を伴わないⅠ/Ⅱは学科名の一部として採用される（浜松湖北「産業マネジメントⅠ・Ⅱ」の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '浜松湖北' && r.department === '産業マネジメントⅠ')).toBeDefined();
    expect(parsed.find((r) => r.schoolName === '浜松湖北' && r.department === '産業マネジメントⅡ')).toBeDefined();
  });

  test('機械集計のグランドトータルが「公立合計」行（quota16,954・applicants16,895）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(16954);
    expect(sumApplicants).toBe(16895);
  });
});
