import { type PdfPageGeometry } from '../parse-table-pdf';
import { KYOTO_COMPETITION_RATES } from '@/data/competition-rates/kyoto';
import kyotoR8Geometry from '../__fixtures__/kyoto-r8-geometry.json';
import { parseKyoto } from '../parsers/kyoto';

/**
 * T-Y11B 段階2-b: kyoto(京都府)のR8倍率パーサ検証テスト。toyama型（罫線ブロック内のどこに
 * ラベルがあっても採用）。多くの学校で学校名ラベルが結合セルの不規則な位置（先頭とは限らない）
 * に出現するため、tochigi型の単純carry-forwardでは大量の誤帰属が発生した。
 *
 * 学科名の副次コース表記は全角角括弧「［単位制］」を使い、既存データは半角角括弧`[単位制]`に
 * 統一している（okinawa/nara/yamanashi型の半角括弧post-processと同型・ここでは角括弧版）。
 *
 * フィクスチャは令和8年度公表PDF（`kyoto-r8.pdf`・全4頁のうち全日制の本体表2頁分[page index 1-2]）
 * を`extract-pdf-geometry.py`で抽出した文字座標データ。1頁目は県全体の集計サマリ（学校別データ
 * ではない）・4頁目は「定時制」のためいずれもスコープ外。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/kyoto.ts`の`parseKyoto()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (kyoto R8 実データ検証・第6パターン)', () => {
  const geometries = kyotoR8Geometry as PdfPageGeometry[];
  const parsed = parseKyoto(geometries);

  const expectedR8Records = KYOTO_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（75件・54校）', () => {
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

  test('「全日制計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 6048)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの「全日制計」行（quota6,048・applicants5,160）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(6048);
    expect(sumApplicants).toBe(5160);
  });
});
