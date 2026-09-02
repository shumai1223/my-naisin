import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, normalizeExtractedText, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { GUNMA_COMPETITION_RATES } from '@/data/competition-rates/gunma';
import gunmaR8Geometry from '../__fixtures__/gunma-r8-geometry.json';

/**
 * T-Y11B 段階2-b: gunma(群馬県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）だが、gunma独自の罠として「department列の中に、学科名の主部分（例:
 * 「動物科学」）と副部分（例:「資源動物」）が同一行内で離れたx位置に印字され、既存データは
 * これを`カテゴリ（副部分）`の形に合成する」パターンと、「複数学科がquotaを共有する
 * くくり募集（高崎商業の商業4コース）」パターン、「department列に同じラベルが2回印字される
 * PDF側の冗長描画（前橋清陵・沼田・高崎経済大学附属で確認・quota A≠Bまたは複数課程を持つ
 * 学校の代表課程行で発生）」の3種の罠が見つかった。いずれも座標だけからは一意に合成規則を
 * 決定できないため、既存データ（`gunma.ts`）を根拠とした`GUNMA_DEPARTMENT_OVERRIDES`で対応する
 * （tokushima/akitaのrenameOverridesと同型の対応・2026-09-02）。
 *
 * フィクスチャは令和8年度公表PDF（`gunma-r8.pdf`・全3頁のうち全日制/フレックスの2頁分のみ）を
 * `extract-pdf-geometry.py`で抽出した文字座標データ。3頁目（定時制課程・連携型選抜）はスコープ外
 * のため含めていない。
 */
const GUNMA_LAYOUT: GeneralColumnLayout = {
  boundaries: [50, 160, 194, 318, 354, 389, 416, 460, 487, 540],
  // 列: 学校名,学校別募集定員(A),学科・コース等,性別,学科等別募集定員(B)=quota,
  //     学科等別志願者数(C)=finalApplicants,学科等別倍率(C/B)=finalRate,学校別志願者数(D),学校別倍率(D/A)
  roles: { schoolName: 0, department: 2, quota: 4, finalApplicants: 5, finalRate: 6 },
};

/**
 * department列に同一ラベルが前半/後半で連続して2回印字される行を1回分に畳む
 * （前橋清陵・沼田・高崎経済大学附属で確認。理由は不明だが、いずれも代表課程「普通」の
 * 行でのみ発生し、既存データの正解は単一の「普通」）。
 */
function collapseRepeatedLabel(s: string): string {
  if (s.length >= 2 && s.length % 2 === 0) {
    const half = s.length / 2;
    if (s.slice(0, half) === s.slice(half)) return s.slice(0, half);
  }
  return s;
}

const GUNMA_DEPARTMENT_OVERRIDES: Record<string, string> = {
  '勢多農林|動物科学資源動物': '動物科学（資源動物）',
  '勢多農林|応用動物': '動物科学（応用動物）',
  '前橋清陵|普通昼間部': '普通（昼間部）',
  '前橋清陵|普通夜間部': '普通（夜間部）',
  '高崎商業|グローバルビジネス': '商業（グローバル/会計/情報/総合ビジネス）',
  '桐生清桜|アドバンスト探究': '普通（アドバンスト探究）',
  '桐生工業|創造技術電気': '創造技術（電気）',
  '桐生工業|染織デザイン': '創造技術（染織デザイン）',
  '太田フレックス|普通Ⅰ部（昼）': '普通（Ⅰ部・昼）',
  '太田フレックス|普通Ⅱ部（昼）': '普通（Ⅱ部・昼）',
  '太田フレックス|普通Ⅲ部（夜）': '普通（Ⅲ部・夜）',
  '利根実業|創生工学機械': '創生工学（機械）',
  '利根実業|建設': '創生工学（建設）',
  '西邑楽|芸術音楽': '芸術（音楽）',
  '西邑楽|美術': '芸術（美術）',
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (gunma R8 実データ検証)', () => {
  const geometries = gunmaR8Geometry as PdfPageGeometry[];
  const allRowFields = geometries.flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, GUNMA_LAYOUT))
  );

  let currentSchoolForOverride = '';
  const rowFieldsWithOverrides = allRowFields.map((r) => {
    const schoolNameNorm = normalizeExtractedText(r.schoolName);
    if (schoolNameNorm) currentSchoolForOverride = schoolNameNorm;
    const deptKey = collapseRepeatedLabel(normalizeExtractedText(r.department));
    const overridden = GUNMA_DEPARTMENT_OVERRIDES[`${currentSchoolForOverride}|${deptKey}`];
    return { ...r, department: overridden ?? deptKey };
  });

  const parsed = assembleSimpleTableRows(rowFieldsWithOverrides, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });

  const expectedR8Records = GUNMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（106件・60校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(106);
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

  test('募集自体が無かった学科（前橋西「国際」・勢多農林「植物デザイン」等）は収録されない', () => {
    expect(parsed.some((r) => r.schoolName === '前橋西' && r.department === '国際')).toBe(false);
    expect(parsed.some((r) => r.schoolName === '勢多農林' && r.department.includes('植物デザイン'))).toBe(false);
  });

  test('連携型選抜実施校3校（尾瀬・万場・嬬恋）は本文にデータが無く収録されない', () => {
    expect(parsed.some((r) => r.schoolName === '尾瀬')).toBe(false);
    expect(parsed.some((r) => r.schoolName === '万場')).toBe(false);
    expect(parsed.some((r) => r.schoolName === '嬬恋')).toBe(false);
  });

  test('集計行「公立全日制・フレックススクール合計」が学校として混入しない（11,153を含まない）', () => {
    expect(parsed.some((r) => r.quota === 11153)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データのcoverage.noteと一致する（quota11,001・applicants10,698）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(11001);
    expect(sumApplicants).toBe(10698);
  });
});
