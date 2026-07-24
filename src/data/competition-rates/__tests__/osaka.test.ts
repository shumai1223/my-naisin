import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { OSAKA_COMPETITION_RATES } from '../osaka';

/**
 * Y-2 DoD検証（大阪府・先行8県3県目）: xlsx版から新規npm依存ゼロで読み取った全165レコードの
 * 合計が、大阪府教育委員会公表の各表の「計」行および全体合計と一致することを機械的に突合する。
 *
 * 経緯: PDF版のビジョン解析で転記した1回目の試行で「桜塚」1校の丸ごと転記漏れ・「豊島」の
 * 志願者数取り違え・「北千里」の募集人員誤読という3件の実害ある誤りが発生し、一旦commitせず
 * 撤退した。今回はxlsx（テキストがXMLにそのまま格納される形式）を自前ZIPパーサ（Node標準の
 * zlibのみ・新規npm依存ゼロ）で読み、OCR誤読の可能性を完全に排除している。
 */
describe('大阪府 倍率パイプラインα（Y-2・全6表の突合テスト）', () => {
  const { records, officialSubtotals } = OSAKA_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('表1 普通科の合計が公式値と一致する（該当校のみ・表2以降は含まない）', () => {
    const table1End = records.findIndex((r) => r.schoolName === '市岡');
    const result = checkAgainstSubtotal(
      records.slice(0, table1End),
      findSubtotal('表1 普通科合計'),
      (r) => r.department === '普通科'
    );
    expect(result.matches).toBe(true);
  });

  it('表1 専門学科（理数/英語/グローバル/国際文化/商業）の合計が公式値と一致する', () => {
    const table1End = records.findIndex((r) => r.schoolName === '市岡');
    const result = checkAgainstSubtotal(
      records.slice(0, table1End),
      findSubtotal('表1 専門学科合計'),
      (r) => r.department !== '普通科'
    );
    expect(result.matches).toBe(true);
  });

  it('表2（単位制普通科4校）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('表2 合計'), (r) => r.department === '普通科（単位制）');
    expect(result.matches).toBe(true);
  });

  it('表3（文理探究科2校）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('表3 合計'), (r) => r.department === '文理探究科');
    expect(result.matches).toBe(true);
  });

  it('表6（総合学科クリエイティブスクール）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('表6 合計'), (r) => r.department === '総合学科（クリエイティブスクール）');
    expect(result.matches).toBe(true);
  });

  it('全165レコードの合計が公式「全体合計」31,847/33,422と完全一致する（Y-2大阪府の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('全体合計（表1+表2+表3+表4+表5+表6）'), () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(31847);
    expect(result.actualApplicants).toBe(33422);
  });

  it('前回のPDF読み取りで見落とした「桜塚」・修正した「豊島」「北千里」が正しい値で入っている', () => {
    const sakuratsuka = records.find((r) => r.schoolName === '桜塚');
    expect(sakuratsuka).toEqual({ schoolName: '桜塚', department: '普通科', quota: 360, finalApplicants: 419, finalRate: 1.16 });

    const toyoshima = records.find((r) => r.schoolName === '豊島');
    expect(toyoshima).toEqual({ schoolName: '豊島', department: '普通科', quota: 280, finalApplicants: 276, finalRate: 0.99 });

    const kitasenri = records.find((r) => r.schoolName === '北千里');
    expect(kitasenri).toEqual({ schoolName: '北千里', department: '普通科', quota: 320, finalApplicants: 415, finalRate: 1.3 });
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する（0除算を除く）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
    }
  });

  it('学校コード（重複するschoolName+department組み合わせ）が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageが全表完了を示している', () => {
    expect(OSAKA_COMPETITION_RATES.coverage.status).toBe('complete');
    expect(OSAKA_COMPETITION_RATES.coverage.pendingDepartments).toEqual([]);
  });

  it('sourcesが公式xlsx URLを正しく記録している', () => {
    for (const s of OSAKA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.osaka\.lg\.jp\//);
    }
  });
});
