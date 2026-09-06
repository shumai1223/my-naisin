import { type PdfPageGeometry } from '../parse-table-pdf';
import { SAGA_COMPETITION_RATES } from '@/data/competition-rates/saga';
import sagaR8Geometry from '../__fixtures__/saga-r8-geometry.json';
import { parseSaga } from '../parsers/saga';

/**
 * T-Y11B 段階2-b: saga(佐賀県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）を
 * ベースに、この県特有の「学科別/学校別が全項目で2列併記される」構造への対応が主な罠。
 * 71/71件・32校・完全一致（グランドトータルquota4,212・applicants4,191も「合計」行と一致）。
 *
 * 列は[番号(未使用)/学校名/学科名/募集定員a・b(未使用)/一般選抜募集人員c(=quota)・d(未使用)/
 * 志願者数変更前e・f(未使用)/志願変更g出た数・h入った数(未使用)/志願者数変更後i(=finalApplicants)・
 * j(未使用)/志願倍率k(=finalRate)・l(未使用)/前年度倍率m・n(未使用)]という、ほぼ全ての数値項目が
 * 「学科別」（採用する側）と「学校別」（複数学科の合算値・不採用）の2列ペアで構成される独自構造。
 * quota/applicants/rateはいずれも**学科別側（各ペアの左列）だけを採用**する必要がある。
 *
 * ⚠️罠1: 番号列（1〜32の学校通し番号）が2桁になると（10〜32）、学校名列の境界にわずかに
 * かかり数字の下1桁が学校名の先頭に混入する（例:「10唐津西」）。`sn.replace(/^[0-9]+/, '')`
 * で先頭の数字列を機械的に除去して対応した。
 *
 * ⚠️罠2: くくり募集10組のうち9組は文末の凡例に明記されているが、**嬉野「電気科、建築科」は
 * 凡例に無いにもかかわらず学科名自体が読点（、）で連結表記されている**（他県のくくり募集は
 * 中黒「・」表記が多いが、この県は読点表記の実例がある。正規化前の生テキストを確認しないと
 * 中黒版のキーでは一致しない）。10組すべてを既存データを根拠にした値ベースoverride
 * （`(学校名,department,quota,finalApplicants)`キー・fukui/tottori型）で対応した。
 *
 * ⚠️罠3: くくり募集10組のうち4組（白石「商業科・情報ビジネス科」／鳥栖商業「商業科・
 * 流通経済科」／佐賀商業「商業科・グローバルビジネス科」／唐津商業「商業科・会計科」）は
 * 学科名が長く学科名列の幅を超えて座標抽出そのものが1件も検出できなかった（hiroshima型と
 * 同じ「抽出漏れ」の罠）。既存データの位置（各校の該当箇所）と値を根拠に、該当校の直前/直後の
 * 通常レコードを検出したタイミングで1件だけ追記する形で対応した。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/saga.ts`の`parseSaga()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (saga R8 実データ検証・学科別/学校別2列ペア構造)', () => {
  const geometries = sagaR8Geometry as PdfPageGeometry[];
  const parsed = parseSaga(geometries);
  const expectedR8Records = SAGA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（71件・32校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(71);
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

  test('凡例に無い読点表記のくくり募集も検出される（嬉野「電気科・建築科」の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '嬉野' && r.department.includes('建築科'))).toEqual({
      schoolName: '嬉野',
      department: '電気科・建築科（くくり募集）',
      quota: 25,
      finalApplicants: 20,
      finalRate: 0.8,
    });
  });

  test('機械集計のグランドトータルが「合計」行（quota4,212・applicants4,191）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(4212);
    expect(sumApplicants).toBe(4191);
  });
});
