import { sumRecords } from '@/lib/competition-rate';
import { GIFU_TEIJI_COMPETITION_RATES } from '../gifu';

/**
 * T-P1 P1-3 DoD検証（岐阜県・定時制11校16レコード＋通信制2校2レコード）:
 * このページには印字済み「計」行が無いため公式合計との突合はできない。代わりに
 * ①レコード件数・学校数が一次ソースの表と一致すること ②個票の機械集計値が
 * ヘッダコメントに明記した値と一致すること ③finalRateが自己整合していること、を検証する。
 */
describe('岐阜県 定時制・通信制 倍率パイプライン（T-P1 P1-3）', () => {
  const { records } = GIFU_TEIJI_COMPETITION_RATES;
  const teiji = records.filter((r) => !r.department.includes('通信制'));
  const tsushin = records.filter((r) => r.department.includes('通信制'));

  it('取り込み件数は定時制16レコード＋通信制2レコード=計18レコード', () => {
    expect(records).toHaveLength(18);
    expect(teiji).toHaveLength(16);
    expect(tsushin).toHaveLength(2);
  });

  it('定時制は11校（複数部制を持つ学校は部ごとに別レコード）', () => {
    const schoolNames = new Set(teiji.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(11);
  });

  it('通信制は2校（華陽フロンティア・飛騨高山）', () => {
    const schoolNames = new Set(tsushin.map((r) => r.schoolName));
    expect(schoolNames).toEqual(new Set(['華陽フロンティア', '飛騨高山']));
  });

  it('個票の機械集計値がヘッダコメント記載の自己検算値と一致する（公式「計」行が無いため）', () => {
    const teijiSum = sumRecords(teiji);
    expect(teijiSum.quota).toBe(740);
    expect(teijiSum.finalApplicants).toBe(335);

    const tsushinSum = sumRecords(tsushin);
    expect(tsushinSum.quota).toBe(320);
    expect(tsushinSum.finalApplicants).toBe(132);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の1桁目まで丸められている（±0.01の誤差内で自己整合）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
