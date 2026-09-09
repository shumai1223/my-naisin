import { sumStageLedger } from '@/lib/stage-ledger';
import { WAKAYAMA_STAGE_LEDGER } from '../wakayama';
import { WAKAYAMA_COMPETITION_RATES } from '@/data/competition-rates/wakayama';

/**
 * T-Y11F §5順序#7 DoD検証（和歌山県・段階台帳18県目・全日制57レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/wakayama.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③finalPassersがtestTakersConfirmedを上回るのは既知の4件のみであること ④quota・
 * testTakersConfirmed・finalPassersの3系列すべての機械集計が資料本文の「合計」行と完全一致する
 * こと。
 */
describe('和歌山県 段階台帳（T-Y11F §5順序#7・18県目・全日制57レコードで完結）', () => {
  const { records, coverage } = WAKAYAMA_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '紀北農芸|施設園芸科',
    '和歌山工業|化学技術科',
    '熊野|看護科',
    '新宮|総合学科',
  ]);

  it('取り込み件数は全日制57レコードで完結', () => {
    expect(records).toHaveLength(57);
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の4件のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/wakayama.ts）と全件完全一致する', () => {
    const r8Records = WAKAYAMA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(57);

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
    expect(matched).toBe(57);
  });

  it('57レコード全数の機械集計が資料本文の「合計」行と3系列すべて完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(57);
    expect(sums.quota).toBe(5_761);
    expect(sums.testTakersConfirmed).toBe(4_867);
    expect(sums.finalPassers).toBe(4_733);
  });
});
