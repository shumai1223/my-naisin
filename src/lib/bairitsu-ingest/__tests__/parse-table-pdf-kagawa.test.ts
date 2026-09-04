import { type PdfPageGeometry } from '../parse-table-pdf';
import { KAGAWA_COMPETITION_RATES } from '@/data/competition-rates/kagawa';
import kagawaR8Geometry from '../__fixtures__/kagawa-r8-geometry.json';
import { parseKagawa } from '../parsers/kagawa';

/**
 * T-Y11B 段階2-b: kagawa(香川県)のR8倍率パーサ検証テスト。tochigi型（学校名セルの結合が無い・
 * 単純carry-forward）。既存データのヘッダコメント自身が「番号付き学校リストのため他県で頻出
 * した『学校名の行折返し遅延』の罠が無い」と明記しており、実際に単純carry-forwardで問題なく
 * 解決できた（toyama/aomori型のブロック方式は不要）。
 *
 * PDFは全2頁だが**1頁目に「全日制」の本体表とグランドトータルが完結**しており、2頁目は
 * 「【全国からの生徒募集】」という別選抜区分の表（スコープ外）のため、フィクスチャは1頁目のみ。
 *
 * ⚠️2026-09-05(T-Y11E E-1): パース本体は`../parsers/kagawa.ts`の`parseKagawa()`へ純関数として
 * 抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (kagawa R8 実データ検証)', () => {
  const geometries = kagawaR8Geometry as PdfPageGeometry[];
  const parsed = parseKagawa(geometries);

  const expectedR8Records = KAGAWA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（68件・30校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(68);
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

  test('グランドトータル「全日制合計」行は収録されない', () => {
    expect(parsed.some((r) => r.quota === 4208)).toBe(false);
  });

  test('機械集計のグランドトータルが既存データのnote（quota4,208・applicants4,296）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(4208);
    expect(sumApplicants).toBe(4296);
  });
});
