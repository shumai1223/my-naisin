import { sumStageLedger } from '@/lib/stage-ledger';
import { KOCHI_STAGE_LEDGER } from '../kochi';
import { KOCHI_COMPETITION_RATES } from '@/data/competition-rates/kochi';

/**
 * T-Y11F §5順序#7 DoD検証（高知県・段階台帳21県目・全日制75レコードで完結）:
 * ①レコードの不変条件（quota等が0より大きい・既知の0値例外を除く） ②既存の倍率パイプライン
 * （competition-rates/kochi.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③quota・testTakersConfirmed・finalPassersの機械集計が資料本文の「合計」行から高知国際
 * グローバル探究学科分（5/5）を差し引いた値と一致すること。
 */
describe('高知県 段階台帳（T-Y11F §5順序#7・21県目・全日制75レコードで完結）', () => {
  const { records, coverage } = KOCHI_STAGE_LEDGER;

  const KNOWN_ZERO = new Set(['安芸|工業(土木)', '四万十|普通(自環コース)', '清水|普通(未来)']);

  it('取り込み件数は全日制75レコードで完結', () => {
    expect(records).toHaveLength(75);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('quotaはすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
    }
  });

  it('testTakersConfirmed/finalPassersは既知の3件（受検者なし）を除き0より大きい', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_ZERO.has(key)) {
        expect(r.testTakersConfirmed).toBe(0);
        expect(r.finalPassers).toBe(0);
        continue;
      }
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('testTakersConfirmedはapplicantsConfirmedを超えない（受検者数は志願確定者数が上限）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/kochi.ts）と全件完全一致する', () => {
    const r8Records = KOCHI_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(75);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      expect(counterpart).toBeDefined();
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(matched).toBe(75);
  });

  it('75レコード全数の機械集計がquota・testTakersConfirmed・finalPassersで自己集計値と完全一致する（資料の「合計」行からは高知国際グローバル探究学科分5/5を除く）', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(75);
    expect(sums.quota).toBe(4_372);
    expect(sums.applicantsConfirmed).toBe(3_144);
    expect(sums.testTakersConfirmed).toBe(3_099);
    expect(sums.finalPassers).toBe(2_958);
  });
});
