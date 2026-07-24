import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { CHIBA_COMPETITION_RATES } from '../chiba';

/**
 * Y-2 DoD検証（千葉県・先行8県6県目）: 全188レコードの合計が千葉県教育委員会公表の
 * 「県立全日制合計」「市立全日制合計」「公立全日制合計」と一致することを機械的に突合する。
 */
describe('千葉県 倍率パイプラインα（Y-2・県立+市立全日制の突合テスト）', () => {
  const { records, officialSubtotals } = CHIBA_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('市立全日制の学校名（"市立"を含む6校12レコード）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('市立全日制合計'), (r) => r.schoolName.startsWith('市立'));
    expect(result.matches).toBe(true);
  });

  it('県立全日制（"市立"以外）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('県立全日制合計'), (r) => !r.schoolName.startsWith('市立'));
    expect(result.matches).toBe(true);
  });

  it('全188レコードの合計が公式「公立全日制合計」28,880/32,008と完全一致する（Y-2千葉県の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('公立全日制合計'), () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(28880);
    expect(result.actualApplicants).toBe(32008);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
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

  it('coverageが完了を示している', () => {
    expect(CHIBA_COMPETITION_RATES.coverage.status).toBe('complete');
    expect(CHIBA_COMPETITION_RATES.coverage.pendingDepartments).toEqual([]);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of CHIBA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.chiba\.lg\.jp\//);
    }
  });
});
