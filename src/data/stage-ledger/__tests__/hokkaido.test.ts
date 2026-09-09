import { sumStageLedger } from '@/lib/stage-ledger';
import { HOKKAIDO_STAGE_LEDGER } from '../hokkaido';
import { HOKKAIDO_COMPETITION_RATES } from '@/data/competition-rates/hokkaido';

/**
 * T-Y11F §5順序#7 DoD検証（北海道・段階台帳28県目・全日制coverage='partial'・
 * 空知地区29レコードで着手・全14管内中の1管内目）:
 * ①レコードの不変条件（quota等はすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/hokkaido.ts）のR8空知地区レコードとquota・applicantsConfirmedが
 * 全件完全一致すること ③第2次募集による新規応募者分でtestTakersConfirmedが
 * applicantsConfirmedを僅かに上回る既知4件・追加合格と推測される岩見沢緑陵「普通」1件を
 * 除き、両不変条件が成立すること。
 */
describe('北海道 段階台帳（T-Y11F §5順序#7・28県目・全日制coverage=partial・空知地区29レコードで着手）', () => {
  const { records, coverage } = HOKKAIDO_STAGE_LEDGER;

  const KNOWN_EXCEEDS_APPLICANTS = new Set(['月形|普通', '夕張|普通', '岩見沢農業|食品科学', '滝川工業|電気']);
  const KNOWN_EXCEEDS_TEST_TAKERS = new Set(['岩見沢緑陵|普通']);

  it('取り込み件数は空知地区29レコード', () => {
    expect(records).toHaveLength(29);
  });

  it('coverage.statusはpartial（全14管内中1管内目のため）', () => {
    expect(coverage.status).toBe('partial');
  });

  it('4フィールドすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('testTakersConfirmedは既知4件（第2次募集の新規応募者分）を除きapplicantsConfirmed以下', () => {
    let exceedCount = 0;
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (r.testTakersConfirmed > r.applicantsConfirmed) {
        expect(KNOWN_EXCEEDS_APPLICANTS.has(key)).toBe(true);
        exceedCount++;
      }
    }
    expect(exceedCount).toBe(KNOWN_EXCEEDS_APPLICANTS.size);
  });

  it('finalPassersは既知1件（岩見沢緑陵「普通」・追加合格と推測）を除きtestTakersConfirmed以下', () => {
    let exceedCount = 0;
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (r.finalPassers > r.testTakersConfirmed) {
        expect(KNOWN_EXCEEDS_TEST_TAKERS.has(key)).toBe(true);
        exceedCount++;
      }
    }
    expect(exceedCount).toBe(KNOWN_EXCEEDS_TEST_TAKERS.size);
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/hokkaido.ts）のR8空知地区レコードと全件完全一致する（滝川西「情報マネジメント」は両者ともスコープ外）', () => {
    const r8Records = HOKKAIDO_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);

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
    expect(matched).toBe(29);
  });

  it('29レコード全数の機械集計値を記録する（北海道は公表側に空知単独の合計行が無いため機械集計のみ・回帰検知用）', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(29);
    expect(sums.quota).toBe(1_880);
    expect(sums.applicantsConfirmed).toBe(1_449);
    expect(sums.testTakersConfirmed).toBe(1_420);
    expect(sums.finalPassers).toBe(1_395);
  });
});
