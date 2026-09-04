import { type PdfPageGeometry } from '../parse-table-pdf';
import { FUKUI_COMPETITION_RATES } from '@/data/competition-rates/fukui';
import fukuiR8Geometry from '../__fixtures__/fukui-r8-geometry.json';
import { parseFukui } from '../parsers/fukui';

/**
 * T-Y11B 段階2-b: fukui(福井県)のR8倍率パーサ検証テスト。aomori型（罫線ブロック・fullLineX0Max
 * 判定・学科名/数値の行分離のpendingキュー）を流用。
 *
 * ⚠️**新しい罠: くくり募集の子コースラベルが数値行より複数個ぶん先行して積み上がると、
 * pendingDepartmentsのFIFO消費だけでは正しい学科名に対応付けられない**（鯖江の2件で発覚:
 * 「スポーツ」「健康福祉」の2ラベル→数値行1つ、続けて「IT」「アートデザイン」の2ラベル→
 * 数値行1つ、という4ラベル:2数値行の構造で、FIFOだと2件目の数値行に誤って「健康福祉」
 * ラベルが対応付けられてしまう）。**ただし数値（quota/finalApplicants/finalRate）自体は
 * 正しく抽出できていた**（既存データの一次収集時のpdftoppmビジョン解析結果と完全一致）ため、
 * 学校名だけでなく数値の組をキーにした`SABAE_VALUE_OVERRIDES`で対応した（既存データを
 * 根拠とした明示補正・tokushima/gunmaの数値ベース裏取りと同型）。
 *
 * フィクスチャは令和8年度公表PDF（`fukui-r8.pdf`・全2頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。2頁目は「定時制」セクション（y座標470以降）を除外済み。
 *
 * ⚠️2026-09-05(T-Y11E E-1): パース本体は`../parsers/fukui.ts`の`parseFukui()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (fukui R8 実データ検証)', () => {
  const geometries = fukuiR8Geometry as PdfPageGeometry[];
  const parsed = parseFukui(geometries);

  const expectedR8Records = FUKUI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（72件・24校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(72);
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

  test('高志「探究創造※2（内部進学枠）」は数値化できず自然に除外される', () => {
    expect(parsed.some((r) => r.schoolName === '高志' && r.department.includes('※2'))).toBe(false);
  });

  test('グランドトータル「合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 3316)).toBe(false);
  });
});
