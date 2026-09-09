import { sumStageLedger } from '@/lib/stage-ledger';
import { SHIMANE_STAGE_LEDGER } from '../shimane';
import { SHIMANE_COMPETITION_RATES } from '@/data/competition-rates/shimane';

/**
 * T-Y11F §5順序#7 DoD検証（島根県・段階台帳24県目・全日制64レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/shimane.ts・情報科学の学校名誤帰属バグ訂正後）のquota・applicantsConfirmedと
 * 段階台帳が全件完全一致すること ③testTakersConfirmed<=applicantsConfirmedが全件成立すること
 * ④finalPassersがtestTakersConfirmedを上回るのは既知の6件（定員割れ学科）のみであること
 * ⑤quota・applicantsConfirmed・testTakersConfirmed・finalPassersの機械集計が資料本文の「合計」
 * 「県立高校計」の両行と完全一致すること。
 */
describe('島根県 段階台帳（T-Y11F §5順序#7・24県目・全日制64レコードで完結）', () => {
  const { records, coverage } = SHIMANE_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '松江南|探究科学',
    '松江農林|環境土木',
    '出雲工業|機械',
    '出雲工業|電気',
    '出雲農林|植物科学',
    '江津工業|機械・ロボット',
  ]);

  it('取り込み件数は全日制64レコードで完結', () => {
    expect(records).toHaveLength(64);
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の6件（定員割れ学科）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/shimane.ts・訂正後）と全件完全一致する', () => {
    const r8Records = SHIMANE_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(64);

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
    expect(matched).toBe(64);
  });

  it('「情報科学」が「安来」とは別の独立校として収録されている（学校名誤帰属バグ訂正の反映）', () => {
    expect(records.some((r) => r.schoolName === '安来')).toBe(true);
    expect(records.some((r) => r.schoolName === '情報科学')).toBe(true);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(36);
  });

  it('64レコード全数の機械集計がquota・applicantsConfirmed・testTakersConfirmed・finalPassersで資料本文の「合計」行と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(64);
    expect(sums.quota).toBe(3_084);
    expect(sums.applicantsConfirmed).toBe(2_493);
    expect(sums.testTakersConfirmed).toBe(2_332);
    expect(sums.finalPassers).toBe(2_200);
  });

  it('県立高校分（皆美が丘女子を除く）の機械集計が資料本文の「県立高校計」行と完全一致する', () => {
    const kenritsu = records.filter((r) => r.schoolName !== '皆美が丘女子');
    const sums = sumStageLedger(kenritsu);
    expect(sums.quota).toBe(3_031);
    expect(sums.applicantsConfirmed).toBe(2_447);
    expect(sums.testTakersConfirmed).toBe(2_288);
    expect(sums.finalPassers).toBe(2_156);
  });
});
