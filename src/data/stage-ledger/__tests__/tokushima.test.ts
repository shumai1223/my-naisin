import { sumStageLedger } from '@/lib/stage-ledger';
import { TOKUSHIMA_STAGE_LEDGER } from '../tokushima';
import { TOKUSHIMA_COMPETITION_RATES } from '@/data/competition-rates/tokushima';

/**
 * T-Y11F §5順序#7 DoD検証（徳島県・段階台帳17県目・全日制69レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/tokushima.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致する
 * こと（本台帳の調査中に発見した那賀/海部の学校名取り違えバグは既存パイプライン側で訂正済み）
 * ③quota・testTakersConfirmed・finalPassersの3系列すべての機械集計が両資料の「合計」行と
 * 完全一致すること。
 */
describe('徳島県 段階台帳（T-Y11F §5順序#7・17県目・全日制69レコードで完結）', () => {
  const { records, coverage } = TOKUSHIMA_STAGE_LEDGER;

  it('取り込み件数は全日制69レコードで完結', () => {
    expect(records).toHaveLength(69);
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

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/tokushima.ts・那賀/海部の学校名取り違えバグを訂正済み）と全件完全一致する', () => {
    const r8Records = TOKUSHIMA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(69);

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
    expect(matched).toBe(69);
  });

  it('69レコード全数の機械集計が両資料本文の「合計」行と3系列すべて完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(69);
    expect(sums.quota).toBe(4_165);
    expect(sums.testTakersConfirmed).toBe(4_152);
    expect(sums.finalPassers).toBe(4_010);
  });
});
