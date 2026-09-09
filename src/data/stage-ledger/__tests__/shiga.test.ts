import { sumStageLedger } from '@/lib/stage-ledger';
import { SHIGA_STAGE_LEDGER } from '../shiga';
import { SHIGA_COMPETITION_RATES } from '@/data/competition-rates/shiga';

/**
 * T-Y11F §5順序#7 DoD検証（滋賀県・段階台帳13県目・全日制61レコードで完結）:
 * ①レコードの不変条件（quota>0等） ②既存の倍率パイプライン（competition-rates/shiga.ts・
 * 一般型選抜のみを自己集計）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③testTakersConfirmed<=applicantsConfirmed・finalPassers<=testTakersConfirmedが全件成立する
 * （滋賀県は他県と異なりfinalPassersがtestTakersConfirmedを上回る既知例外が0件）
 * ④「両方の学科」併願枠を持つ5校（膳所・草津東・守山北・高島・米原）の合算値が既存パイプラインと一致すること。
 */
describe('滋賀県 段階台帳（T-Y11F §5順序#7・13県目・全日制61レコードで完結）', () => {
  const { records, coverage } = SHIGA_STAGE_LEDGER;

  const COMBINED_SCHOOLS = new Set(['膳所', '草津東', '守山北', '高島', '米原']);

  it('取り込み件数は全日制61レコードで完結', () => {
    expect(records).toHaveLength(61);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはすべて0より大きい（不変条件）', () => {
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

  it('finalPassersはtestTakersConfirmedを超えない（他県と異なりこの県には超過の既知例外が無い）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/shiga.ts・一般型選抜のみ自己集計）と全件完全一致する', () => {
    const r8Records = SHIGA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(61);

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
    expect(matched).toBe(61);
  });

  it('「両方の学科」併願枠を持つ5校は既存パイプラインの合算department名で1レコードに集約されている', () => {
    for (const r of records) {
      if (!COMBINED_SCHOOLS.has(r.schoolName)) continue;
      expect(r.department).toContain('一般型・両方の学科含む');
    }
    const combinedCount = records.filter((r) => COMBINED_SCHOOLS.has(r.schoolName)).length;
    expect(combinedCount).toBe(5);
  });

  it('61レコード全数の機械集計が既存パイプラインの自己集計合計（quota6,016・applicants9,333）と、testTakersConfirmed・finalPassersは新規の自己集計値と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(61);
    expect(sums.quota).toBe(6_016);
    expect(sums.applicantsConfirmed).toBe(9_333);
    expect(sums.testTakersConfirmed).toBe(8_938);
    expect(sums.finalPassers).toBe(6_000);
  });
});
