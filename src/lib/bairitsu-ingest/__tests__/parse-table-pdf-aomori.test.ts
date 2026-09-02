import { groupCharsIntoRows, extractRowFields, normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { AOMORI_COMPETITION_RATES } from '@/data/competition-rates/aomori';
import aomoriR8Geometry from '../__fixtures__/aomori-r8-geometry.json';

/**
 * T-Y11B 段階2-b: aomori(青森県)のR8倍率パーサ検証テスト。toyama型（罫線ブロック内のどこに
 * 学校名ラベルがあっても採用）に加え、**学科名テキストと数値が別の行に分離することがある**
 * という新しい罠が見つかった（例:「商業」という学科名だけの行の直後に、数値付きだが学科名列が
 * 空欄の行が続く）。新しいエリア（地域）の最初の学校で発生しやすい（エリアラベル行と学科名が
 * 同じy座標にまとまり、学校名・数値の行が1つ後にずれる）。
 *
 * **解法**: ブロック内を先頭から走査し、数値を持たない「学科名のみの行」をpendingキューに
 * 積んでおき、数値を持つ行で学科名列が空欄だった場合はpendingキューから１件消費する
 * （同一ブロック内で出現順が保たれている前提。トヨタ型のラベル探索とは独立した仕組み）。
 *
 * フィクスチャは令和8年度公表PDF（`aomori-r8.pdf`・全2頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。
 */
const AOMORI_LAYOUT: GeneralColumnLayout = {
  boundaries: [55, 105, 190, 315, 388, 455, 515, 560],
  // 列: 地域(未使用),学校名,学科,入学者募集人員(未使用),入学者選抜募集人員(=quota),
  //     学科別出願者数(=finalApplicants),学科別倍率(=finalRate)
  roles: { schoolName: 1, department: 2, quota: 4, finalApplicants: 5, finalRate: 6 },
};

const AOMORI_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '青森商業|商業': '商業・情報処理(くくり)',
  '五所川原|普通': '普通・理数(くくり)',
  '三沢商業|商業': '商業・情報処理(くくり)',
};

interface ClusteredRow {
  y: number;
  chars: PdfPageGeometry['chars'];
}

/**
 * ⚠️aomoriではtoyamaと異なり、学科ごとの内部区切り線が実在する（ibaraki型と同じ）。
 * 区切り線のx0が学校名列に届いていない（x0≈181.8＝部分線）ものは「学科の内部区切り」であり
 * ブロック境界ではない。学校名列を跨ぐ完全線（x0≈108.9）だけが真のブロック境界。
 * `fullLineX0Max`未満のx0を持つ線だけをブロック境界として採用する。
 */
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

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (aomori R8 実データ検証・学科名/数値の行分離)', () => {
  const geometries = aomoriR8Geometry as PdfPageGeometry[];

  const blocks = geometries.flatMap((geom) => {
    const rows = groupCharsIntoRows(geom.chars, 3.0);
    return groupRowsIntoBlocks(rows, geom.hlines, 150);
  });

  const parsed: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }[] = [];
  for (const block of blocks) {
    const fields = block.map((row) => extractRowFields(row.chars, AOMORI_LAYOUT));
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
      const department = AOMORI_DEPARTMENT_OVERRIDES[`${schoolName}|${resolvedRawDept}`] ?? normalizeDepartmentText(resolvedRawDept);
      parsed.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }

  const expectedR8Records = AOMORI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（89件・43校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(89);
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

  test('グランドトータル「全日制の課程合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 6980)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データのnote（quota6,980・applicants6,436）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(6980);
    expect(sumApplicants).toBe(6436);
  });
});
