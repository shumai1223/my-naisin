import { sumStageLedger } from '@/lib/stage-ledger';
import { TOTTORI_STAGE_LEDGER } from '../tottori';
import { TOTTORI_COMPETITION_RATES } from '@/data/competition-rates/tottori';

/**
 * T-Y11F §5順序#7 DoD検証（鳥取県・段階台帳14県目・全日制43レコードで完結）:
 * ①レコードの不変条件（quota>0等・既知の1件の0値を除く） ②既存の倍率パイプライン
 * （competition-rates/tottori.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③testTakersConfirmed<=applicantsConfirmedが全件成立すること
 * ④finalPassersがtestTakersConfirmedを上回るのは米子南「ＩＴビジネス」1件のみであること
 * ⑤4系列すべての機械集計が資料本文の「県計」行と完全一致すること。
 */
describe('鳥取県 段階台帳（T-Y11F §5順序#7・14県目・全日制43レコードで完結）', () => {
  const { records, coverage } = TOTTORI_STAGE_LEDGER;

  const KNOWN_ZERO = new Set(['境港総合技術|電気電子']);
  const KNOWN_EXCEEDS_TEST_TAKERS = new Set(['米子南|ＩＴビジネス']);

  it('取り込み件数は全日制43レコードで完結', () => {
    expect(records).toHaveLength(43);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('quotaはすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
    }
  });

  it('applicantsConfirmed/testTakersConfirmed/finalPassersは既知の1件を除き0より大きい', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_ZERO.has(key)) {
        expect(r.applicantsConfirmed).toBe(0);
        expect(r.testTakersConfirmed).toBe(0);
        expect(r.finalPassers).toBe(0);
        continue;
      }
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

  it('finalPassersがtestTakersConfirmedを上回るのは米子南「ＩＴビジネス」1件のみ（学校計では整合・学科間の合格者再配分と推測）', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/tottori.ts）と全件完全一致する', () => {
    const r8Records = TOTTORI_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(43);

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
    expect(matched).toBe(43);
  });

  it('43レコード全数の機械集計が「合格者数等について」資料の県計行と4系列すべて完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(43);
    expect(sums.quota).toBe(2_937);
    expect(sums.applicantsConfirmed).toBe(2_334);
    expect(sums.testTakersConfirmed).toBe(2_234);
    expect(sums.finalPassers).toBe(2_159);
  });
});
