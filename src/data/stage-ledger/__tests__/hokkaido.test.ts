import { sumStageLedger } from '@/lib/stage-ledger';
import { HOKKAIDO_STAGE_LEDGER } from '../hokkaido';
import { HOKKAIDO_COMPETITION_RATES } from '@/data/competition-rates/hokkaido';

/**
 * T-Y11F §5順序#7 DoD検証（北海道・段階台帳28県目・全日制coverage='partial'・
 * 空知29＋石狩57＋市立札幌9＋後志18＋胆振27＋日高7＋渡島・普通10＝157レコードで着手）:
 * ①レコードの不変条件（quota等はすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/hokkaido.ts）のR8レコードとquota・applicantsConfirmedが全件完全一致
 * すること ③第2次募集による新規応募者分でtestTakersConfirmedがapplicantsConfirmedを僅かに
 * 上回る既知12件・追加合格と推測されるfinalPassers>testTakersConfirmedの既知7件を除き、
 * 両不変条件が成立すること（市立札幌9件・日高7件・渡島普通10件は例外0件）。
 */
describe('北海道 段階台帳（T-Y11F §5順序#7・28県目・全日制coverage=partial・空知29+石狩57+市立札幌9+後志18+胆振27+日高7+渡島普通10=157レコード）', () => {
  const { records, coverage } = HOKKAIDO_STAGE_LEDGER;

  // 第2次募集で新規応募した受検者が第1次出願者数に含まれないため+1〜+4の小差で超過（制度構造）
  const KNOWN_EXCEEDS_APPLICANTS = new Set([
    '月形|普通',
    '夕張|普通',
    '岩見沢農業|食品科学',
    '滝川工業|電気',
    '野幌|普通',
    '当別|普通',
    '札幌琴似工業|電気',
    '当別|家政',
    '小樽水産|水産食品',
    '追分|普通',
    '厚真|普通',
    '室蘭工業|建設',
  ]);

  // 資料脚注の「追加合格者」調整により、第2次募集の有無に関わらずfinalPassersが
  // testTakersConfirmedを僅かに上回る（+1〜+6の小差）
  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '岩見沢緑陵|普通',
    '千歳|国際教養',
    '札幌東商業|会計ビジネス',
    '千歳|国際流通',
    '小樽未来創造|情報会計マネジメント',
    '室蘭栄|理数',
    '苫小牧工業|情報技術',
  ]);

  it('取り込み件数は空知29+石狩57+市立札幌9+後志18+胆振27+日高7+渡島普通10=157レコード', () => {
    expect(records).toHaveLength(157);
  });

  it('coverage.statusはpartial（北海道は全14管内構成のため）', () => {
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

  it('testTakersConfirmedは既知12件（第2次募集の新規応募者分）を除きapplicantsConfirmed以下', () => {
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

  it('finalPassersは既知7件（追加合格と推測）を除きtestTakersConfirmed以下', () => {
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

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/hokkaido.ts）のR8レコードと全件完全一致する（滝川西「情報マネジメント」は両者ともスコープ外）', () => {
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
    expect(matched).toBe(157);
  });

  it('157レコード全数の機械集計値を記録する（北海道は公表側に管内単独の合計行が無いため機械集計のみ・回帰検知用）', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(157);
    expect(sums.quota).toBe(1_880 + 9_360 + 1_680 + 1_230 + 2_160 + 550 + 1_040);
    expect(sums.applicantsConfirmed).toBe(1_449 + 9_898 + 2_052 + 977 + 1_957 + 402 + 1_091);
    expect(sums.testTakersConfirmed).toBe(1_420 + 9_467 + 1_954 + 959 + 1_824 + 389 + 934);
    expect(sums.finalPassers).toBe(1_395 + 8_461 + 1_596 + 952 + 1_770 + 382 + 869);
  });
});
