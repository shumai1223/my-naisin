import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIGA_COMPETITION_RATES } from '../shiga';

/**
 * Y-6 DoD検証（滋賀県・保留県からの再挑戦で完全達成）。
 *
 * 注意: 資料に一般型選抜のみの印字済み「計」行が無いため、officialSubtotalsは自己集計値（回帰ガード）。
 * 独立検証は資料自身の「計①」（学校独自型＋一般型合算=募集人数9,230・確定出願者数12,201・倍率1.32）が
 * 外部二次情報（ベネッセ）の同一数値と一致することで代替した（shiga.tsのコメント参照）。
 */
describe('滋賀県 倍率パイプラインα（Y-6・全日制44校61レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SHIGA_COMPETITION_RATES;

  it('全レコード合計が自己集計値（quota6,016・applicants9,333）と一致する（回帰ガード）', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '一般型選抜のみ自己集計')!;
    const result = checkAgainstSubtotal(records, subtotal, () => true);
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

  it('coverageがcompleteを示している（学校独自型選抜・定時制は意図的にスコープ外）', () => {
    expect(SHIGA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('61レコード・44校が収録されている', () => {
    expect(records.length).toBe(61);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(44);
  });

  it('「両方の学科」併願枠を含む5校が統合レコードとして収録されている', () => {
    for (const school of ['膳所', '草津東', '守山北', '高島', '米原']) {
      const rec = records.find((r) => r.schoolName === school);
      expect(rec).toBeDefined();
      expect(rec!.department).toContain('両方の学科含む');
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIGA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.shiga\.lg\.jp\//);
    }
  });
});
