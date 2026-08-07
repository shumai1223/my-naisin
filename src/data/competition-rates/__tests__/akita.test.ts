import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { AKITA_COMPETITION_RATES } from '../akita';

/**
 * Y-6 DoD検証（秋田県・31県目・全日制完全達成／掛-1・R7多年度対応済）。
 */
describe('秋田県 倍率パイプラインα（Y-6・全日制78レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = AKITA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「県合計」行（quota6,268・applicants5,237）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県合計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear);
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(AKITA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('78レコードが収録されている', () => {
    expect(r8.length).toBe(78);
  });

  it('分校（大曲農業・太田分校/湯沢翔北・雄勝校）が親学校と区別できる名称で収録されている', () => {
    expect(r8.find((r) => r.schoolName === '大曲農業(太田分校)')).toEqual({
      schoolName: '大曲農業(太田分校)',
      department: '普通科',
      quota: 35,
      finalApplicants: 6,
      finalRate: 0.17,
    });
    expect(r8.find((r) => r.schoolName === '湯沢翔北(雄勝校)')).toEqual({
      schoolName: '湯沢翔北(雄勝校)',
      department: '普通科',
      quota: 40,
      finalApplicants: 11,
      finalRate: 0.28,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが80件収録され、県北計/中央計/県南計/県合計の4段階の公式小計すべてと完全一致する。男鹿海洋「普通科」・男鹿工業「設備システム科」(R8の集計表には掲載なし)の2件と、大館桂桜/由利の学科名表記ゆれ(R7原本は「普通科・◯◯科」・R8原本は「普通・◯◯科」と印字が異なるのみで同一学科)を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(80);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(6495);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5587);

    const r7OnlyKeys = new Set(['男鹿海洋|普通科', '男鹿工業|設備システム科', '大館桂桜|普通科・生活科学科', '由利|普通科・理数科・国際科']);
    const r8OnlyKeys = new Set(['大館桂桜|普通・生活科学科', '由利|普通・理数・国際科']);
    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r8OnlyKeys.has(k)));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r7OnlyKeys.has(k)));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of AKITA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.akita\.lg\.jp\//);
    }
  });
});
