import { normalizeExtractedText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1: shizuoka(静岡県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-shizuoka.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（単純carry-forward）をベースに、この県特有の「選抜方法別内訳行（Ⅰ/Ⅱ/Ⅲ）」の
 * 判別が主な罠。注記の割合が100%かどうかで採否を判定する`resolveDepartment`・注記無しⅠ/Ⅱが
 * 学科名の一部になるケース・学科名折り返し8校のoverride・校名折り返しの学校名postfix補正
 * などを含む（詳細はテストファイル側のコメントを参照）。
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

/** 静岡県R8倍率PDFの学校別データ全頁分（`shizuoka-r8-geometry.json`）を解析する。 */
export function parseShizuoka(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRecords: ParsedCompetitionRow[] = [];
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
