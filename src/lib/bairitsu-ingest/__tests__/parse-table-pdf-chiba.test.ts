import { type PdfPageGeometry } from '../parse-table-pdf';
import { CHIBA_COMPETITION_RATES } from '@/data/competition-rates/chiba';
import chibaR8Geometry from '../__fixtures__/chiba-r8-geometry.json';
import { parseChiba } from '../parsers/chiba';

/**
 * T-Y11B 段階2-b: chiba(千葉県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）。既存データのヘッダコメント自身が「1行=1学校×1学科のシンプルな形式」
 * 「pdftotextで学校名を含む全行がそのままテキスト抽出できた」と明記しており、実際に最も
 * 単純な部類だった（罫線ブロック方式は不要）。
 *
 * 学校名列には行頭に「番号（市立校は「市」+番号）」が付与されており（例:「1 千葉」
 * 「＊2 千葉女子」「市1 市立千葉」）、schoolNameから正規表現で除去する。
 *
 * フィクスチャは令和8年度公表PDF（`chiba-r8.pdf`・全6頁のうち県立全日制+市立全日制の5頁分
 * [page index 0-4]）を`extract-pdf-geometry.py`で抽出した文字座標データ。6頁目は「県立定時制」
 * のためスコープ外。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/chiba.ts`の`parseChiba()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (chiba R8 実データ検証)', () => {
  const geometries = chibaR8Geometry as PdfPageGeometry[];
  const parsed = parseChiba(geometries);

  const expectedR8Records = CHIBA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（188件・県立121+市立12校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(188);
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

  test('「県立全日制合計」「市立全日制合計」「公立全日制合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 28880)).toBe(false);
  });

  test('機械集計のグランドトータルが公立全日制合計（quota28,880・applicants32,008）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(28880);
    expect(sumApplicants).toBe(32008);
  });
});
