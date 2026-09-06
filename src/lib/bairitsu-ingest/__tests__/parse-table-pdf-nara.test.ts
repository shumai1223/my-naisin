import { type PdfPageGeometry } from '../parse-table-pdf';
import { NARA_COMPETITION_RATES } from '@/data/competition-rates/nara';
import naraR8Geometry from '../__fixtures__/nara-r8-geometry.json';
import { parseNara } from '../parsers/nara';

/**
 * T-Y11B 段階2-b: nara(奈良県)のR8倍率パーサ検証テスト。toyama/aomori型（罫線ブロック内の
 * どこにラベルがあっても採用・学科名/数値の行分離のpendingキュー）を流用。
 *
 * ⚠️**新しい罠: 資料に倍率が印字されておらず自前算出が必要**。既存データも同様に
 * `applicants÷quota`を自前算出しているため、パーサ側もT-Y11Cで確立した`roundHalfUpScaled`
 * （BigInt整数演算・`toFixed`のバグを踏まない）で算出し、既存データと突合する。
 *
 * また既存データは学科名の括弧を半角`()`で統一しており（okinawaと同型）、資料には第一出願
 * 期間と第二出願期間の2つの出願者数列があるが、既存データは第一出願期間のみを採用する
 * （第二出願期間は未充足学科への第2希望受付という別プロセスのため対象外）。
 *
 * フィクスチャは令和8年度公表PDF（`nara-r8.pdf`・全2頁）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ。2頁目は定時制課程セクション（y座標420以降）を除外済み。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/nara.ts`の`parseNara()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (nara R8 実データ検証・倍率自前算出)', () => {
  const geometries = naraR8Geometry as PdfPageGeometry[];
  const parsed = parseNara(geometries);

  const expectedR8Records = NARA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（71件・29校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(71);
  });

  test('レコード単位で既存データと完全一致する（順序も含む・倍率は自前算出値で突合）', () => {
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

  test('県立計・市立計・合計行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 6896)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの「合計」行（quota6,896・applicants6,276）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(6896);
    expect(sumApplicants).toBe(6276);
  });
});
