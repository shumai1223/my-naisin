import { sumStageLedger } from '@/lib/stage-ledger';
import { YAMANASHI_STAGE_LEDGER } from '../yamanashi';
import { YAMANASHI_COMPETITION_RATES } from '@/data/competition-rates/yamanashi';

/**
 * T-Y11F §5順序#7 DoD検証（山梨県・段階台帳23県目・全日制48レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい・testTakersConfirmed<=applicantsConfirmed）
 * ②既存の倍率パイプライン（competition-rates/yamanashi.ts）のquota・applicantsConfirmedと段階台帳が
 * 全件完全一致すること ③finalPassersがtestTakersConfirmedを上回るのは既知の4件（資料が明記する
 * 「第２希望」制度による他学科からの合格者流入）のみであること ④quota・testTakersConfirmed・
 * finalPassersの機械集計が資料本文の「全日制課程計」行と完全一致すること。
 */
describe('山梨県 段階台帳（T-Y11F §5順序#7・23県目・全日制48レコードで完結）', () => {
  const { records, coverage } = YAMANASHI_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '北杜|総合学科',
    '甲府南|普通',
    '青洲|工業(一括)',
    '吉田|普通',
  ]);

  it('取り込み件数は全日制48レコードで完結', () => {
    expect(records).toHaveLength(48);
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の4件（「第２希望」制度による他学科からの合格者流入）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/yamanashi.ts）と全件完全一致する', () => {
    const r8Records = YAMANASHI_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(48);

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
    expect(matched).toBe(48);
  });

  it('48レコード全数の機械集計がquota・testTakersConfirmed・finalPassersで資料本文の「全日制課程計」行と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(48);
    expect(sums.quota).toBe(3_356);
    expect(sums.applicantsConfirmed).toBe(3_037);
    expect(sums.testTakersConfirmed).toBe(3_021);
    expect(sums.finalPassers).toBe(2_897);
  });
});
