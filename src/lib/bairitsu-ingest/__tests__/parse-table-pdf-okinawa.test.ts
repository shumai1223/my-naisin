import { type PdfPageGeometry } from '../parse-table-pdf';
import { OKINAWA_COMPETITION_RATES } from '@/data/competition-rates/okinawa';
import okinawaR8Geometry from '../__fixtures__/okinawa-r8-geometry.json';
import { parseOkinawa } from '../parsers/okinawa';

/**
 * T-Y11B 段階2-b: okinawa(沖縄県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）だが、**全日制・定時制が同一表に混在**しており、他県のような「全日制計」の
 * 独立行が存在しない（既存データのヘッダコメントに明記済み）。
 *
 * 解法: 表には「課程」列（全日/定時）が独立して存在するため、この列の値で機械的に絞り込める
 * （既存データのヘッダコメントが挙げる6校の名前リストに頼る必要はない・列の値で判定する方が
 * 頑健）。学校別「◯◯ 集計」小計行は課程列の中に収まり学科名列が空になるため、既存の
 * `!department`チェックで自然に除外される。
 *
 * フィクスチャは令和8年度公表PDF（`okinawa-r8.pdf`・全4頁）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/okinawa.ts`の`parseOkinawa()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (okinawa R8 実データ検証・全日制/定時制混在)', () => {
  const geometries = okinawaR8Geometry as PdfPageGeometry[];
  const parsed = parseOkinawa(geometries);

  const expectedR8Records = OKINAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（156件・58校・全日制のみ）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(156);
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

  test('定時制単独校「泊」は課程列フィルタで除外される', () => {
    expect(parsed.some((r) => r.schoolName === '泊')).toBe(false);
  });

  test('定時制と全日制が混在する学校（コザ・那覇工業等）の定時制ぶんは除外される', () => {
    expect(parsed.some((r) => r.department.includes('定時'))).toBe(false);
  });

  test('学校別「◯◯集計」小計行・総計行は収録されない', () => {
    expect(parsed.some((r) => r.department.includes('集計'))).toBe(false);
    expect(parsed.some((r) => r.quota === 14484)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの自己算出値（quota14,084・applicants13,522）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(14084);
    expect(sumApplicants).toBe(13522);
  });
});
