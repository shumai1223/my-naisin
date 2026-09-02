import { groupCharsIntoRows, extractRowFields, assembleNumberedBlockRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { AKITA_COMPETITION_RATES } from '@/data/competition-rates/akita';
import akitaR8Geometry from '../__fixtures__/akita-r8-geometry.json';

/**
 * T-Y11B 段階2-b: 「学校名が複数行に折り返す県」向け組み立て（akita型）の検証テスト。
 * ibaraki型（結合セル）・tochigi型（単純carry-forward）とも異なる第3のパターン。
 * フィクスチャは令和8年度公表PDF（全2ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（2026-09-02取得・実データそのもの）。
 */
const AKITA_LAYOUT: GeneralColumnLayout = {
  boundaries: [95, 126.1, 188.5, 347.7, 397.8, 448.0, 498.2, 548.4, 598.6, 648.7, 698.9, 749.1, 800.4, 851.8],
  // 列: №,学校名,学科名,募集定員(=quota),特色選抜募集人員,一般選抜募集人員,特色選抜志願者数,
  //     一般選抜志願者数,総志願者(=applicants),特色選抜倍率,総志願者倍率(=rate),昨年特色倍率,昨年総倍率
  roles: { number: 0, schoolName: 1, department: 2, quota: 3, finalApplicants: 8, finalRate: 10 },
};

describe('bairitsu-ingest parse-table-pdf №列ブロック組み立て (akita R8 実データ検証)', () => {
  const allRowFields = (akitaR8Geometry as PdfPageGeometry[]).flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, AKITA_LAYOUT))
  );
  const parsed = assembleNumberedBlockRows(allRowFields, {
    excludeRow: (department) => department.includes('計'),
    stopAt: (department) => department.includes('県合計'),
    renameOverrides: { 太田分校: '大曲農業(太田分校)', 雄勝校: '湯沢翔北(雄勝校)' },
  });

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
    const record = parsed.find((r) => r.schoolName === '大曲農業(太田分校)');
    expect(record).toEqual({ schoolName: '大曲農業(太田分校)', department: '普通科', quota: 35, finalApplicants: 6, finalRate: 0.17 });
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
