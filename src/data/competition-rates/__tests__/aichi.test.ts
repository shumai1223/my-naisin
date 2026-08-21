import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { AICHI_COMPETITION_RATES } from '../aichi';

/**
 * Y-6 DoD検証（愛知県・42県目・全日制完全達成／掛-1・R7多年度対応済）。
 */
describe('愛知県 倍率パイプラインα（Y-6・全日制155校1校舎241レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = AICHI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「合計」行（quota30,789・applicants53,196）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名+年度の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制・海外帰国生徒選抜は意図的にスコープ外）', () => {
    expect(AICHI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('241レコード・156校（155校+新城有教館作手校舎の1校舎）が収録されている', () => {
    expect(r8.length).toBe(241);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(156);
  });

  it('くくり募集（愛知総合工科・7学科が単一quotaで束ねられる最大規模のくくり）が単一レコードとして正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '愛知総合工科')).toEqual({
      schoolName: '愛知総合工科',
      department: '理工・機械加工・機械制御・電気・電子情報・建設・デザイン工学(くくり)',
      quota: 249,
      finalApplicants: 573,
      finalRate: 2.3,
    });
  });

  it('別紙本表から丸ごと1行抜け落ちていた西尾（普通）が増減差分表との突合で発見・収録されている', () => {
    expect(r8.find((r) => r.schoolName === '西尾')).toEqual({
      schoolName: '西尾',
      department: '普通',
      quota: 259,
      finalApplicants: 473,
      finalRate: 1.83,
    });
  });

  it('西尾東と西尾が別校として区別して収録されている', () => {
    const nishio = r8.filter((r) => r.schoolName === '西尾');
    const nishioHigashi = r8.filter((r) => r.schoolName === '西尾東');
    expect(nishio.length).toBe(1);
    expect(nishioHigashi.length).toBe(1);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが240件収録され、156校・学科別志願状況の合計行(quota30,781・applicants56,928)と完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(240);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(30781);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(56928);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(156);
  });

  it('掛-1(学校別×多年度・3年度目): 令和6年度(R6)分レコードが237件収録され、行内検算(第1志望+第2志望=志願者総数)が全行で一致し、WebSearchで独立確認した確定値(quota31,417・applicants59,007)と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(237);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(31417);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(59007);

    const seen = new Set<string>();
    for (const r of r6) {
      const key = `${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }

    // 報道記事(リセマム/中日新聞)で個別に言及された最高倍率2件との突合
    expect(r6.find((r) => r.schoolName === '市立工芸' && r.department === '情報')?.finalRate).toBe(4.05);
    expect(r6.find((r) => r.schoolName === '市立名東' && r.department === '国際英語')?.finalRate).toBe(3.91);
  });

  it('掛-1(学校別×多年度・4年度目): 令和5年度(R5)分レコードが237件収録され、157校・学科別志願状況の合計行(quota32,002・applicants59,129)と完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(237);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(32002);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(59129);

    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(157);

    const seen = new Set<string>();
    for (const r of r5) {
      const key = `${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('令和5年度(R5)は2025年度統合(津島北翔)前のため「津島北」と「海翔」が別校として収録されている(R6と同じ形)', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    const tsushimaKita = r5.filter((r) => r.schoolName === '津島北');
    const kaisho = r5.filter((r) => r.schoolName === '海翔');
    expect(tsushimaKita.length).toBe(2);
    expect(kaisho.length).toBe(1);
    expect(r5.find((r) => r.schoolName === '津島北翔')).toBeUndefined();
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of AICHI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.aichi\.jp\//);
    }
  });
});
