import { type PdfPageGeometry } from '../parse-table-pdf';
import { AKITA_COMPETITION_RATES } from '@/data/competition-rates/akita';
import akitaR8Geometry from '../__fixtures__/akita-r8-geometry.json';
import { parseAkita } from '../parsers/akita';

/**
 * T-Y11B 段階2-b: 「学校名が複数行に折り返す県」向け組み立て（akita型）の検証テスト。
 * ibaraki型（結合セル）・tochigi型（単純carry-forward）とも異なる第3のパターン。
 * フィクスチャは令和8年度公表PDF（全2ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（2026-09-02取得・実データそのもの）。
 *
 * ⚠️2026-09-06(T-Y11E E-1/E-6): パース本体は`../parsers/akita.ts`の`parseAkita()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf №列ブロック組み立て (akita R8 実データ検証)', () => {
  const parsed = parseAkita(akitaR8Geometry as PdfPageGeometry[]);

  const expectedR8Records = AKITA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（78件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(78);
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

  test('学校名の2行折り返しが正しく連結される（大館国際情報学院・能代科学技術の実例）', () => {
    expect(parsed.find((r) => r.department === '国際情報科')?.schoolName).toBe('大館国際情報学院');
    expect(parsed.find((r) => r.department === '生物資源・生活福祉科')?.schoolName).toBe('能代科学技術');
  });

  test('分校は独立した番号を持たず直前の学校ブロックに紛れ込むが、renameOverridesで区別される', () => {
    // T-Y11F §5順序#8でpage/rowIndex（出典ロケータ用）が追加されたため、それ以外のフィールドで比較する
    const record = parsed.find((r) => r.schoolName === '大曲農業(太田分校)');
    expect({ schoolName: record?.schoolName, department: record?.department, quota: record?.quota, finalApplicants: record?.finalApplicants, finalRate: record?.finalRate }).toEqual({
      schoolName: '大曲農業(太田分校)',
      department: '普通科',
      quota: 35,
      finalApplicants: 6,
      finalRate: 0.17,
    });
    // 分校の断片名は親学校名の連結には混入しない
    expect(parsed.some((r) => r.schoolName === '大曲農業太田分校')).toBe(false);
  });

  test('地区計・県北計・中央計・県南計・県合計が学校として混入しない', () => {
    expect(parsed.some((r) => r.department.includes('計'))).toBe(false);
    expect(parsed.some((r) => r.quota === 6268)).toBe(false); // 県合計自身
  });

  test('グランドトータルが公式の県合計と一致する（6,268 / 5,237）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(6268);
    expect(sumApplicants).toBe(5237);
  });
});
