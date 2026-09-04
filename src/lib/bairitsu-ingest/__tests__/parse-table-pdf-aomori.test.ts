import { type PdfPageGeometry } from '../parse-table-pdf';
import { AOMORI_COMPETITION_RATES } from '@/data/competition-rates/aomori';
import aomoriR8Geometry from '../__fixtures__/aomori-r8-geometry.json';
import { parseAomori } from '../parsers/aomori';

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
 *
 * ⚠️2026-09-05(T-Y11E E-1): パース本体は`../parsers/aomori.ts`の`parseAomori()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (aomori R8 実データ検証・学科名/数値の行分離)', () => {
  const geometries = aomoriR8Geometry as PdfPageGeometry[];
  const parsed = parseAomori(geometries);

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
