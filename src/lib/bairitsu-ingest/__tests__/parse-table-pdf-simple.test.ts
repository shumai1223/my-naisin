import { type PdfPageGeometry } from '../parse-table-pdf';
import { TOCHIGI_COMPETITION_RATES } from '@/data/competition-rates/tochigi';
import tochigiR8Geometry from '../__fixtures__/tochigi-r8-geometry.json';
import { parseTochigi } from '../parsers/tochigi';

/**
 * T-Y11B 段階2-b: 「学校名セルの結合が無い県」向け組み立て（tochigi型）の検証テスト。
 * ibaraki型（`parse-table-pdf.test.ts`）とは別の組み立てパターンであることを示す実例。
 * フィクスチャは令和8年度公表PDF（全3ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（罫線は使わない・2026-09-02取得・実データそのもの）。
 *
 * ⚠️2026-09-06(T-Y11E E-1/E-6): パース本体は`../parsers/tochigi.ts`の`parseTochigi()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (tochigi R8 実データ検証)', () => {
  const parsed = parseTochigi(tochigiR8Geometry as PdfPageGeometry[]);

  const expectedR8Records = TOCHIGI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（107件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(107);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p.schoolName, department: p.department, quota: p.quota, finalApplicants: p.finalApplicants, finalRate: p.finalRate }).toEqual({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('文字の均等割り付け(トラッキング)による内部空白が学校名から除去される（宇都宮中央の実例）', () => {
    const record = parsed.find((r) => r.schoolName === '宇都宮中央' && r.department === '総合家庭');
    // T-Y11F §5順序#8: page/rowIndexは出典ロケータ用に追加されたフィールド
    expect(record).toEqual({ schoolName: '宇都宮中央', department: '総合家庭', quota: 31, finalApplicants: 34, finalRate: 1.1, page: 1, rowIndex: 6 });
  });

  test('集計行「合計」が学校として混入しない（grand total 7,259/7,602を含まない）', () => {
    expect(parsed.some((r) => r.quota === 7259)).toBe(false);
  });

  test('一般選抜定員0（quota<=0）の学校は除外される（宇都宮東の実例）', () => {
    expect(parsed.some((r) => r.schoolName === '宇都宮東')).toBe(false);
  });

  test('グランドトータルが公式の合計行と一致する（7,259 / 7,602）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(7259);
    expect(sumApplicants).toBe(7602);
  });
});
