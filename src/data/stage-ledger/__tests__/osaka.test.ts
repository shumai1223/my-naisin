import { sumStageLedger } from '@/lib/stage-ledger';
import { OSAKA_STAGE_LEDGER } from '../osaka';
import { OSAKA_COMPETITION_RATES } from '@/data/competition-rates/osaka';

/**
 * T-Y11F §5順序#7 DoD検証（大阪府・段階台帳8県目・165レコードで完結）:
 * ①レコードの不変条件（quota>0等・既知の0値1件を除く）②既存の倍率パイプライン
 * （competition-rates/osaka.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * （本資料は独自にtestTakersConfirmed/finalPassersのみを追加する設計）③資料本文末尾の
 * 4段階の公式小計と3系列（quota/testTakersConfirmed/finalPassers）完全一致すること
 * ④大阪府はfinalPassersがapplicantsConfirmed・testTakersConfirmedを上回るケースが0件
 * （既存の他県と異なる特徴）であること。
 */
describe('大阪府 段階台帳（T-Y11F §5順序#7・8県目・165レコードで完結）', () => {
  const { records, officialSubtotals } = OSAKA_STAGE_LEDGER;
  const KNOWN_ZERO_KEY = '東淀工業|理工学科';

  it('取り込み件数は165レコードで完結', () => {
    expect(records).toHaveLength(165);
  });

  it('coverage.statusはcomplete', () => {
    expect(OSAKA_STAGE_LEDGER.coverage.status).toBe('complete');
  });

  it('quotaはすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
    }
  });

  it('applicantsConfirmed/testTakersConfirmed/finalPassersは既知の1件（東淀工業・理工学科）を除き0より大きい', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (key === KNOWN_ZERO_KEY) {
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

  it('finalPassersはtestTakersConfirmedを超えない（大阪府は第1志望内のみの合格者数のため他県のような超過例外が無い）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/osaka.ts）と全件完全一致する', () => {
    const r8Records = OSAKA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(165);

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
    expect(matched).toBe(165);
  });

  it.each([
    { label: '普通教育を主とする学科の計', quota: 19347, applicantsConfirmed: 20134, testTakersConfirmed: 20102, finalPassers: 18264 },
    { label: '専門学科の計', quota: 9130, applicantsConfirmed: 10005, testTakersConfirmed: 9988, finalPassers: 8382 },
    { label: '総合学科（クリエイティブスクールを含む。）の計', quota: 3370, applicantsConfirmed: 3283, testTakersConfirmed: 3273, finalPassers: 3051 },
    { label: '総計', quota: 31847, applicantsConfirmed: 33422, testTakersConfirmed: 33363, finalPassers: 29697 },
  ])('officialSubtotalsの「$label」が定義通りである', ({ label, quota, applicantsConfirmed, testTakersConfirmed, finalPassers }) => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === label);
    expect(subtotal).toEqual({ label, quota, applicantsConfirmed, testTakersConfirmed, finalPassers });
  });

  it('165レコード全数の機械集計が資料本文の総計行と4系列とも完全一致する（文書全体グランドトータル検証）', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(165);
    expect(sums.quota).toBe(31_847);
    expect(sums.applicantsConfirmed).toBe(33_422);
    expect(sums.testTakersConfirmed).toBe(33_363);
    expect(sums.finalPassers).toBe(29_697);
  });
});
