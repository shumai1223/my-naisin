import { sumStageLedger } from '@/lib/stage-ledger';
import { MIYAGI_STAGE_LEDGER } from '../miyagi';
import { MIYAGI_COMPETITION_RATES } from '@/data/competition-rates/miyagi';

/**
 * T-Y11F §5順序#7 DoD検証（宮城県・段階台帳25県目・全日制129レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい・testTakersConfirmed<=applicantsConfirmed）
 * ②既存の倍率パイプライン（competition-rates/miyagi.ts）のquotaと段階台帳が全件完全一致し、
 * applicantsConfirmedは既知の1件（仙台「普通科」・別時点スナップショット差）を除き完全一致すること
 * ③finalPassersがtestTakersConfirmedを上回るのは既知の7件（定員割れ学科）のみであること
 * ④quota・applicantsConfirmed・testTakersConfirmed・finalPassersの機械集計が資料本文の「全日制
 * 合計」行と完全一致すること。
 */
describe('宮城県 段階台帳（T-Y11F §5順序#7・25県目・全日制129レコードで完結）', () => {
  const { records, coverage } = MIYAGI_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '大河原産業|企画デザイン科',
    '仙台東|英語科',
    '宮城工|電子機械科',
    '松島|観光科',
    '登米総合産業|農業科',
    '宮城水産|生物環境科',
    '石巻工|化学技術科',
  ]);

  const KNOWN_APPLICANTS_DIFF = new Set(['仙台|普通科']);

  it('取り込み件数は全日制129レコードで完結', () => {
    expect(records).toHaveLength(129);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはすべて0より大きい（不変条件・既知の0値例外は無い）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('testTakersConfirmedはapplicantsConfirmedを超えない（受検者数は志願確定者数が上限）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('finalPassersがtestTakersConfirmedを上回るのは既知の7件（定員割れ学科）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quotaは既存の倍率パイプライン（competition-rates/miyagi.ts）と全件完全一致し、applicantsConfirmedは既知の1件を除き完全一致する', () => {
    const r8Records = MIYAGI_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(129);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      expect(counterpart).toBeDefined();
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      const key = `${stageRecord.schoolName}|${stageRecord.department}`;
      if (KNOWN_APPLICANTS_DIFF.has(key)) {
        expect(counterpart.finalApplicants).not.toBe(stageRecord.applicantsConfirmed);
        continue;
      }
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(matched).toBe(129);
  });

  it('129レコード全数の機械集計がquota・applicantsConfirmed・testTakersConfirmed・finalPassersで資料本文の「全日制合計」行と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(129);
    expect(sums.quota).toBe(13_400);
    expect(sums.applicantsConfirmed).toBe(12_517);
    expect(sums.testTakersConfirmed).toBe(12_346);
    expect(sums.finalPassers).toBe(11_004);
  });
});
