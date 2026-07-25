import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { AICHI_COMPETITION_RATES } from '../aichi';

/**
 * Y-6 DoD検証（愛知県・42県目・全日制完全達成）。
 */
describe('愛知県 倍率パイプラインα（Y-6・全日制155校1校舎241レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = AICHI_COMPETITION_RATES;

  it('全レコード合計が「合計」行（quota30,789・applicants53,196）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制・海外帰国生徒選抜は意図的にスコープ外）', () => {
    expect(AICHI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('241レコード・156校（155校+新城有教館作手校舎の1校舎）が収録されている', () => {
    expect(records.length).toBe(241);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(156);
  });

  it('くくり募集（愛知総合工科・7学科が単一quotaで束ねられる最大規模のくくり）が単一レコードとして正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '愛知総合工科')).toEqual({
      schoolName: '愛知総合工科',
      department: '理工・機械加工・機械制御・電気・電子情報・建設・デザイン工学(くくり)',
      quota: 249,
      finalApplicants: 573,
      finalRate: 2.3,
    });
  });

  it('別紙本表から丸ごと1行抜け落ちていた西尾（普通）が増減差分表との突合で発見・収録されている', () => {
    expect(records.find((r) => r.schoolName === '西尾')).toEqual({
      schoolName: '西尾',
      department: '普通',
      quota: 259,
      finalApplicants: 473,
      finalRate: 1.83,
    });
  });

  it('西尾東と西尾が別校として区別して収録されている', () => {
    const nishio = records.filter((r) => r.schoolName === '西尾');
    const nishioHigashi = records.filter((r) => r.schoolName === '西尾東');
    expect(nishio.length).toBe(1);
    expect(nishioHigashi.length).toBe(1);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of AICHI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.aichi\.jp\//);
    }
  });
});
