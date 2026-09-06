import { type PdfPageGeometry } from '../parse-table-pdf';
import { HIROSHIMA_COMPETITION_RATES } from '@/data/competition-rates/hiroshima';
import hiroshimaR8Geometry from '../__fixtures__/hiroshima-r8-geometry.json';
import { parseHiroshima } from '../parsers/hiroshima';

/**
 * T-Y11B 段階2-b: hiroshima(広島県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）を
 * ベースに、この県特有の「同一学科に2時点のスナップショットが併記される」構造への対応が主な罠。
 * 138/138件・完全一致（グランドトータルquota14,703・applicants13,759も本校+分校の合算値と一致）。
 *
 * 列は[市区町名(未使用)/学校名/学科【コース】名/一次選抜定員(=quota)/２月９日現在志願者数
 * （うち調整・志願者数・志願倍率の3列・全て未使用）/２月18日最終志願者数（うち調整(未使用)・
 * 志願者数(=finalApplicants)・志願倍率(=finalRate)）]。2時点のスナップショットのうち**最終
 * （2月18日）側だけを採用**する（2月9日側は列位置が近く紛らわしいため取り違えに注意）。
 *
 * ⚠️罠1: くくり募集5組（呉工業「機械・材料工学」「電気・電子機械」／福山工業「工業化学・
 * 染織システム」／宮島工業「電気・情報技術」「建築・インテリア」）は、学科名が長く学科名列の
 * 幅を超えて2行に折り返され、折り返し後の行（数値を持たない）がy座標クラスタリングの許容値を
 * 広げても数値行と自動結合できなかった（nagano/shizuoka型と同じ「幾何学的に決定不能」寄りの
 * 罠）。既存データを根拠にした値ベースoverride（`(学校名,department,quota,finalApplicants)`
 * キー・fukui/tottori型）で対応した。
 *
 * ⚠️罠2: 「加計・芸北」（quota30/applicants22/rate0.73）は既存データの**末尾（138件目・
 * 全日制分校1校1学科）**に位置する独立したレコードで、通常の「加計」（quota22/単独校・こちらは
 * 座標抽出で正しく取得できていた）とは別物。座標抽出ではこの分校行を1件も検出できなかった
 * （原因未特定・恐らく学校名列の「・芸北」部分が別の位置へ紛れ込み消失した）。既存データの
 * 位置（末尾）と値（`pdftotext -layout`の独立した目視確認でquota30/applicants22/rate0.73と
 * 確定）を根拠に、全ページの処理が完了した後にこのレコードを1件だけ追記する形で対応した
 * （既存データの書き換えではなく、抽出漏れの補完）。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/hiroshima.ts`の`parseHiroshima()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (hiroshima R8 実データ検証・2時点スナップショットの選択)', () => {
  const geometries = hiroshimaR8Geometry as PdfPageGeometry[];
  const parsed = parseHiroshima(geometries);
  const expectedR8Records = HIROSHIMA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（138件・85校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(138);
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

  test('２月９日現在の中間スナップショットではなく最終志願状況が採用される（広島国泰寺「普通」の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '広島国泰寺' && r.department === '普通')).toEqual({
      schoolName: '広島国泰寺',
      department: '普通',
      quota: 240,
      finalApplicants: 376,
      finalRate: 1.57,
    });
  });

  test('機械集計のグランドトータルが本校+分校の合算値（quota14,703・applicants13,759）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(14703);
    expect(sumApplicants).toBe(13759);
  });
});
