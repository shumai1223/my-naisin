import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOYAMA_COMPETITION_RATES } from '../toyama';

/**
 * Y-6 DoD検証（富山県・13県目・全日制完全達成／掛-1・R7多年度対応済）。
 */
describe('富山県 倍率パイプラインα（Y-6・全日制34校75レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = TOYAMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「合計」行（quota5,020・applicants4,482・倍率0.89）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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

  it('coverageがcompleteを示している（定時制・通信制のみ意図的にスコープ外）', () => {
    expect(TOYAMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('75レコード・34校が収録されている', () => {
    expect(r8.length).toBe(75);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
  });

  it('探究科学科(理数科学科のみ)・人文社会科学科の除外・括弧内数コースの除外が正しく反映されている', () => {
    expect(r8.some((r) => r.schoolName === '富山' && r.department === '人文社会科学科')).toBe(false);
    expect(r8.some((r) => r.schoolName === '富山北部' && r.department.includes('体育コース'))).toBe(false);
    expect(r8.some((r) => r.schoolName === '富山東' && r.department.includes('自然科学コース'))).toBe(false);
    expect(r8.some((r) => r.schoolName === '呉羽' && r.department.includes('音楽コース'))).toBe(false);
  });

  it('くくり募集（複数学科が募集人員を共有）が正しく収録されている', () => {
    const uozuKogyo = r8.find((r) => r.schoolName === '魚津工業');
    expect(uozuKogyo).toEqual({
      schoolName: '魚津工業',
      department: '機械創造科・電気情報科・ＩＴ環境化学科（くくり募集）',
      quota: 85,
      finalApplicants: 41,
      finalRate: 0.48,
    });
  });

  it('掛-1で発見した「海洋科」の学校名誤帰属バグが訂正され、滑川に正しく収録されている（上市には海洋科が無い）', () => {
    expect(r8.find((r) => r.schoolName === '滑川' && r.department === '海洋科')).toEqual({
      schoolName: '滑川',
      department: '海洋科',
      quota: 31,
      finalApplicants: 21,
      finalRate: 0.68,
    });
    expect(r8.some((r) => r.schoolName === '上市' && r.department === '海洋科')).toBe(false);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが77件・34校収録され、公式「合計」5,097/5,044と完全一致する。魚津工業はR7時点で機械科・電気科・情報環境科の3学科制(R8でくくり募集の機械創造科・電気情報科・IT環境化学科へ改編・WebSearchで裏取り済み)のため、この3件を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(77);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(5097);
    expect(sumApplicants).toBe(5044);

    const r7OnlyKeys = new Set(['魚津工業|機械科', '魚津工業|電気科', '魚津工業|情報環境科']);
    const r8OnlyKeys = new Set(['魚津工業|機械創造科・電気情報科・ＩＴ環境化学科（くくり募集）']);
    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r8OnlyKeys.has(k)));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r7OnlyKeys.has(k)));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが77件・34校収録され、公式「合計 34校82学科」行(quota5,188・applicants5,248・倍率1.01)と完全一致する。R6の魚津工業もR7と同じ機械科・電気科・情報環境科の3学科制のため、学校名+学科名のキー集合はR7と完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(77);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(5188);
    expect(sumApplicants).toBe(5248);

    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys.size).toBe(r7Keys.size);
    for (const key of r6Keys) {
      expect(r7Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが77件・34校収録され、公式「合計 34校82学科」行(quota5,226・applicants5,327・倍率1.02)と完全一致する。R5の魚津工業もR6/R7と同じ機械科・電気科・情報環境科の3学科制のため、学校名+学科名のキー集合はR6/R7と完全一致する', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(77);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(5226);
    expect(sumApplicants).toBe(5327);

    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r5Keys.size).toBe(r6Keys.size);
    for (const key of r5Keys) {
      expect(r6Keys.has(key)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している（R5分はpref.toyama.jp原本削除済みのため富山県教育委員会県立高校課の公式ミラーkengaku.tym.ed.jpを許容）', () => {
    for (const s of TOYAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.(pref\.toyama\.jp|kengaku\.tym\.ed\.jp)\//);
    }
  });
});
