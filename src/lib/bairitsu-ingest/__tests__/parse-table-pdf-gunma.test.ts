import { type PdfPageGeometry } from '../parse-table-pdf';
import { GUNMA_COMPETITION_RATES } from '@/data/competition-rates/gunma';
import gunmaR8Geometry from '../__fixtures__/gunma-r8-geometry.json';
import { parseGunma } from '../parsers/gunma';

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
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/gunma.ts`の`parseGunma()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (gunma R8 実データ検証)', () => {
  const geometries = gunmaR8Geometry as PdfPageGeometry[];
  const parsed = parseGunma(geometries);

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
