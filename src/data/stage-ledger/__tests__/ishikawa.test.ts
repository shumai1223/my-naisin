import { sumStageLedger } from '@/lib/stage-ledger';
import { ISHIKAWA_STAGE_LEDGER } from '../ishikawa';
import { ISHIKAWA_COMPETITION_RATES } from '@/data/competition-rates/ishikawa';

/**
 * T-Y11F §5順序#7 DoD検証（石川県・段階台帳16県目・全日制70レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/ishikawa.ts）のquotaと段階台帳が全件完全一致すること ③finalPassersが
 * testTakersConfirmedを上回るのは既知の6件（複数学科を持つ工業系学校）のみであること
 * ④quota・testTakersConfirmed・finalPassersの3系列すべての機械集計が資料本文の「全県合計」と
 * 完全一致すること。
 *
 * ⚠️他県と異なりtestTakersConfirmed<=applicantsConfirmedは検証しない——applicantsConfirmedは
 * 別時点（2月24日出願状況）のスナップショットで、石川県の「志願変更」制度により3月のtestTakers
 * がそれを上回る学科が実在するため（詳細はishikawa.tsのファイル冒頭コメント参照）。
 */
describe('石川県 段階台帳（T-Y11F §5順序#7・16県目・全日制70レコードで完結）', () => {
  const { records, coverage } = ISHIKAWA_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '小松工業|材料化学',
    '工業|電子情報',
    '工業|テキスタイル工学',
    '金沢市立工業|電気',
    '金沢市立工業|電子情報',
    '金沢市立工業|土木',
  ]);

  it('取り込み件数は全日制70レコードで完結', () => {
    expect(records).toHaveLength(70);
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の6件（複数学科を持つ工業系学校）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quotaは既存の倍率パイプライン（competition-rates/ishikawa.ts）と全件完全一致する', () => {
    const r8Records = ISHIKAWA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(70);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      expect(counterpart).toBeDefined();
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
    }
    expect(matched).toBe(70);
  });

  it('70レコード全数の機械集計がquota・testTakersConfirmed・finalPassersで資料本文の「全県合計」と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(70);
    expect(sums.quota).toBe(6_566);
    expect(sums.testTakersConfirmed).toBe(6_050);
    expect(sums.finalPassers).toBe(5_302);
  });
});
