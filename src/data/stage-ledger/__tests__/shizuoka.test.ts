import { sumStageLedger } from '@/lib/stage-ledger';
import { SHIZUOKA_STAGE_LEDGER } from '../shizuoka';
import { SHIZUOKA_COMPETITION_RATES } from '@/data/competition-rates/shizuoka';

/**
 * T-Y11F §5順序#7 DoD検証（静岡県・段階台帳9県目・全日制162レコードで完結）:
 * ①レコードの不変条件（quota>0等・例外0件のクリーンな県）②既存の倍率パイプライン
 * （competition-rates/shizuoka.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③資料本文末尾の「公立合計」行と3系列（quota/testTakersConfirmed/finalPassers）完全一致する
 * こと④finalPassersがtestTakersConfirmed・applicantsConfirmedを上回る既知の31件を許容すること。
 */
describe('静岡県 段階台帳（T-Y11F §5順序#7・9県目・全日制162レコードで完結）', () => {
  const { records, officialSubtotals } = SHIZUOKA_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '韮山|普通科',
    '沼津東|普通科',
    '沼津商業|情報ビジネス',
    '富士|理数科',
    '富士宮北|商業',
    '富士市立|ビジネス探究',
    '富士市立|総合探究',
    '清水東|普通科',
    '静岡市立清水桜が丘|普通科',
    '静岡城北|普通科',
    '静岡農業|生物生産・生産流通',
    '科学技術|電子物質工学',
    '静岡商業|情報処理',
    '静岡市立|科学探究',
    '焼津水産|栽培漁業',
    '焼津水産|食品科学',
    '相良|商業',
    '掛川工業|電気電子工学',
    '掛川工業|情報工学',
    '磐田南|普通科',
    '磐田農業|生産科学',
    '磐田農業|環境科学',
    '磐田西|総合ビジネス',
    '天竜|総合',
    '浜松工業|電気',
    '浜松工業|情報技術',
    '浜松工業|建築',
    '浜松城北工業|機械',
    '浜松城北工業|電気',
    '浜松城北工業|電子',
    '浜松商業|情報処理',
  ]);

  it('取り込み件数は全日制162レコードで完結', () => {
    expect(records).toHaveLength(162);
  });

  it('coverage.statusはcomplete', () => {
    expect(SHIZUOKA_STAGE_LEDGER.coverage.status).toBe('complete');
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはすべて0より大きい（例外0件のクリーンな県）', () => {
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の31件のみ（特別選抜等の合算による超過と推定）', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/shizuoka.ts）と全件完全一致する', () => {
    const r8Records = SHIZUOKA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(162);

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
    expect(matched).toBe(162);
  });

  it('officialSubtotalsの「公立合計」が定義通りである', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === '公立合計');
    expect(subtotal).toEqual({
      label: '公立合計',
      quota: 16954,
      applicantsConfirmed: 16895,
      testTakersConfirmed: 16826,
      finalPassers: 16078,
    });
  });

  it('162レコード全数の機械集計が資料本文の「公立合計」行と完全一致する（文書全体グランドトータル検証）', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(162);
    expect(sums.quota).toBe(16_954);
    expect(sums.applicantsConfirmed).toBe(16_895);
    expect(sums.testTakersConfirmed).toBe(16_826);
    expect(sums.finalPassers).toBe(16_078);
  });
});
