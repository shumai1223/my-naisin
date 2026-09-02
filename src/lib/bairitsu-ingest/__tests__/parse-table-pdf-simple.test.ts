import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { TOCHIGI_COMPETITION_RATES } from '@/data/competition-rates/tochigi';
import tochigiR8Geometry from '../__fixtures__/tochigi-r8-geometry.json';

/**
 * T-Y11B 段階2-b: 「学校名セルの結合が無い県」向け組み立て（tochigi型）の検証テスト。
 * ibaraki型（`parse-table-pdf.test.ts`）とは別の組み立てパターンであることを示す実例。
 * フィクスチャは令和8年度公表PDF（全3ページ）を`extract-pdf-geometry.py`で抽出した
 * 文字座標データ（罫線は使わない・2026-09-02取得・実データそのもの）。
 */
const TOCHIGI_LAYOUT: GeneralColumnLayout = {
  boundaries: [50.4, 66.4, 111.4, 163.8, 185.9, 208.2, 236.7, 264.6, 287.0, 315.4, 343.4, 371.8, 399.8, 428.2, 456.2],
  // 列: 番号,学校名,学科名,男女,募集定員,特色選抜内定者数,A海外内定者数,一般選抜定員(=quota),
  //     出願人員(2/19),出願倍率(2/19),再出願人員,取下げ人員,変更後の出願人員(=applicants),出願倍率(2/25)(=rate)
  roles: { schoolName: 1, department: 2, quota: 7, finalApplicants: 12, finalRate: 13 },
};

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (tochigi R8 実データ検証)', () => {
  const allRowFields = (tochigiR8Geometry as PdfPageGeometry[]).flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => extractRowFields(row.chars, TOCHIGI_LAYOUT))
  );
  const parsed = assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('合計'),
  });

  const expectedR8Records = TOCHIGI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（107件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(107);
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

  test('文字の均等割り付け(トラッキング)による内部空白が学校名から除去される（宇都宮中央の実例）', () => {
    const record = parsed.find((r) => r.schoolName === '宇都宮中央' && r.department === '総合家庭');
    expect(record).toEqual({ schoolName: '宇都宮中央', department: '総合家庭', quota: 31, finalApplicants: 34, finalRate: 1.1 });
  });

  test('集計行「合計」が学校として混入しない（grand total 7,259/7,602を含まない）', () => {
    expect(parsed.some((r) => r.quota === 7259)).toBe(false);
  });

  test('一般選抜定員0（quota<=0）の学校は除外される（宇都宮東の実例）', () => {
    expect(parsed.some((r) => r.schoolName === '宇都宮東')).toBe(false);
  });

  test('グランドトータルが公式の合計行と一致する（7,259 / 7,602）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(7259);
    expect(sumApplicants).toBe(7602);
  });
});
