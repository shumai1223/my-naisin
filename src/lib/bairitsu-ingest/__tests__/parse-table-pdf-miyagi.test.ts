import { groupCharsIntoRows, extractRowFields, assembleSimpleTableRows, type PdfPageGeometry, type GeneralColumnLayout } from '../parse-table-pdf';
import { MIYAGI_COMPETITION_RATES } from '@/data/competition-rates/miyagi';
import miyagiR8Geometry from '../__fixtures__/miyagi-r8-geometry.json';

/**
 * T-Y11B 段階2-b: miyagi(R8)はtochigi型（y座標クラスタリング・単純carry-forward）の応用だが、
 * 2つの追加の罠を持つ。①「○○地区計」「○○地区合計」という地区別小計行が学校の行に混入する
 * （`excludeRow`で除外）。②市立高等学校等を示す脚注記号「※」「■」「☆」が学校名・学科名の
 * どちらにも付着することがあるため、`extractRowFields`の生テキストの時点で除去してから
 * `assembleSimpleTableRows`に渡す必要がある（normalizeExtractedTextはこれらを除去しない）。
 * フィクスチャは令和8年度公表PDF（全4ページ・表本体はp1〜4）を`extract-pdf-geometry.py`で
 * 抽出した文字座標データ（2026-09-02取得・実データそのもの）。
 *
 * ⚠️finalRateの7件はミス転記ではなく浮動小数点丸めバグによる既存データ側の誤りと判明したため
 * `miyagi.ts`本体を訂正済み（詳細はmiyagi.tsのヘッダコメント参照）。
 */
const MIYAGI_LAYOUT: GeneralColumnLayout = {
  boundaries: [46, 56, 115, 245, 290, 335, 385, 430, 478, 525, 550],
  // 列: (空白),学校名,学科名,募集定員(=quota),R8出願志願者数(=finalApplicants),R8出願倍率(=finalRate),
  //     R8出願希望調査志願者数,R8出願希望調査倍率,R7出願希望調査志願者数,R7出願希望調査倍率
  roles: { schoolName: 1, department: 2, quota: 3, finalApplicants: 4, finalRate: 5 },
};

/** 市立高等学校等を示す脚注記号。学校名・学科名のどちらにも付着しうる。 */
function stripFootnoteMarks(s: string): string {
  return s.replace(/[※■☆]/g, '');
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (miyagi R8 実データ検証)', () => {
  const allRowFields = (miyagiR8Geometry as PdfPageGeometry[]).flatMap((geom) =>
    groupCharsIntoRows(geom.chars, 3.0).map((row) => {
      const fields = extractRowFields(row.chars, MIYAGI_LAYOUT);
      return { ...fields, schoolName: stripFootnoteMarks(fields.schoolName), department: stripFootnoteMarks(fields.department) };
    })
  );
  const parsed = assembleSimpleTableRows(allRowFields, {
    excludeRow: (schoolName, department) => (schoolName + department).includes('地区計') || (schoolName + department).includes('合計'),
  });

  const expectedR8Records = MIYAGI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（129件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(129);
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

  test('脚注記号「※」が学校名から除去される（仙台工の実例）', () => {
    expect(parsed.some((r) => r.schoolName === '仙台工')).toBe(true);
    expect(parsed.some((r) => r.schoolName.includes('※'))).toBe(false);
  });

  test('脚注記号「☆」が学科名から除去される（南三陸の実例）', () => {
    const record = parsed.find((r) => r.schoolName === '南三陸' && r.department === '情報ビジネス科');
    expect(record).toEqual({ schoolName: '南三陸', department: '情報ビジネス科', quota: 40, finalApplicants: 11, finalRate: 0.28 });
  });

  test('地区別小計行「○○地区計」「○○地区合計」が学校として混入しない', () => {
    expect(parsed.some((r) => r.department.includes('地区計') || r.department.includes('地区合計'))).toBe(false);
  });

  test('グランドトータルが公式の「全日制合計」行と一致する（13,400 / 12,516）', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(13400);
    expect(sumApplicants).toBe(12516);
  });
});
