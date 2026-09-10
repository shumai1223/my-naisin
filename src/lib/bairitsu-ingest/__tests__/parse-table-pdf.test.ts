import { type PdfPageGeometry } from '../parse-table-pdf';
import { IBARAKI_COMPETITION_RATES } from '@/data/competition-rates/ibaraki';
import ibarakiR8Geometry from '../__fixtures__/ibaraki-r8-geometry.json';
import { parseIbaraki } from '../parsers/ibaraki';

/**
 * T-Y11B 段階2-b の検証テスト（唯一の正しい検証方法・タスクファイル参照）:
 * パーサの出力が、既存の手作業データ（`IBARAKI_COMPETITION_RATES`のR8分）と
 * レコード単位で完全一致するか。フィクスチャは令和8年度公表PDF（全3ページ）を
 * `scripts/bairitsu-ingest/extract-pdf-geometry.py`で抽出した文字座標+罫線データ
 * （2026-09-02取得・実データそのもの）。
 *
 * ⚠️2026-09-06(T-Y11E E-1/E-6): パース本体は`../parsers/ibaraki.ts`の`parseIbaraki()`へ純関数と
 * して抽出済み（レジストリ`registry.ts`から県コード経由で呼べる）。このテストはレジストリ経由でも
 * 同じ結果が出ることを確認する回帰テストとして継続する。
 */
describe('bairitsu-ingest parse-table-pdf (ibaraki R8 実データ検証)', () => {
  const parsed = parseIbaraki(ibarakiR8Geometry as PdfPageGeometry[]);

  const expectedR8Records = IBARAKI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（149件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(149);
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

  test('グランドトータルが公式「全日制計」行と一致する（16,647 / 15,211）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    const official = IBARAKI_COMPETITION_RATES.officialSubtotals[0];
    expect(sumQuota).toBe(official.quota);
    expect(sumApplicants).toBe(official.finalApplicants);
  });

  test('結合セル（学校名が中央行に配置される複数学科校）が正しく展開される（水戸桜ノ牧常北校の実例）', () => {
    // T-Y11F §5順序#8でpage/rowIndex（出典ロケータ用）が追加されたため、それ以外のフィールドで比較する
    const record = parsed.find((r) => r.schoolName === '水戸桜ノ牧常北校');
    expect({ schoolName: record?.schoolName, department: record?.department, quota: record?.quota, finalApplicants: record?.finalApplicants, finalRate: record?.finalRate }).toEqual({
      schoolName: '水戸桜ノ牧常北校',
      department: '普通',
      quota: 40,
      finalApplicants: 13,
      finalRate: 0.33,
    });
  });

  test('半角カタカナが全角へ正規化される（中央「普通〔スポーツ科学〕」の実例）', () => {
    const record = parsed.find((r) => r.schoolName === '中央' && r.department.includes('スポーツ'));
    expect(record?.department).toBe('普通〔スポーツ科学〕');
  });

  test('「全日制計」の集計行より後（定時制・連携型セクション）は含まれない', () => {
    expect(parsed.some((r) => r.department.includes('全日制計'))).toBe(false);
    expect(parsed.some((r) => r.department.includes('(午前)') || r.department.includes('(夜間)'))).toBe(false);
  });
});
