import { type PdfPageGeometry } from '../parse-table-pdf';
import { YAMANASHI_COMPETITION_RATES } from '@/data/competition-rates/yamanashi';
import yamanashiR8Geometry from '../__fixtures__/yamanashi-r8-geometry.json';
import { parseYamanashi } from '../parsers/yamanashi';

/**
 * T-Y11B 段階2-b: yamanashi(山梨県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）。quota/applicants/rateがすべて印字済みでシンプル。くくり募集4組
 * （韮崎工業・青洲2組・塩山・都留興譲館）はいずれも「○○（一括）」という1行完結ラベルで
 * 資料上すでに表現されており、mie型のような複数行合成が不要（既存データは半角括弧に統一・
 * okinawa/nara型と同じpost-process）。
 *
 * 各校末尾の「計」行・県立高校計/市立高校計/全日制課程計の集計行は、department列が「計」に
 * 完全一致する行として一貫して現れる（nara型の教訓どおり部分一致ではなく完全一致で判定）。
 *
 * フィクスチャは令和8年度公表PDF（`yamanashi-r8.pdf`・全7頁のうち全日制後期募集の2頁分
 * [page index 1-2]）を`extract-pdf-geometry.py`で抽出した文字座標データ。2頁目は全日制課程計
 * 行より後（学科カテゴリ別の県全体集計表）を除外済み。
 *
 * ⚠️2026-09-06(T-Y11E E-1): パース本体は`../parsers/yamanashi.ts`の`parseYamanashi()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (yamanashi R8 実データ検証)', () => {
  const geometries = yamanashiR8Geometry as PdfPageGeometry[];
  const parsed = parseYamanashi(geometries);

  const expectedR8Records = YAMANASHI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（48件・26校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(48);
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

  test('学校別「計」行・県立高校計/市立高校計/全日制課程計は収録されない', () => {
    expect(parsed.some((r) => r.department === '計')).toBe(false);
    expect(parsed.some((r) => r.quota === 3356)).toBe(false);
  });

  test('機械集計のグランドトータルが既存noteの「全日制課程計」行（quota3,356・applicants3,037）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(3356);
    expect(sumApplicants).toBe(3037);
  });
});
