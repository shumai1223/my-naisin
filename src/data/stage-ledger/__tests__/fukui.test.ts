import { sumStageLedger } from '@/lib/stage-ledger';
import { FUKUI_STAGE_LEDGER } from '../fukui';
import { FUKUI_COMPETITION_RATES } from '@/data/competition-rates/fukui';

/**
 * T-Y11F §5順序#7 DoD検証（福井県・段階台帳20県目・全日制72レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/fukui.ts）のquotaと段階台帳が全件完全一致すること ③testTakersConfirmed
 * <=applicantsConfirmedが全件成立すること ④finalPassersがtestTakersConfirmedを上回るのは
 * 既知の19件（定員割れ学科）のみであること ⑤quota・testTakersConfirmed・finalPassersの3系列
 * すべての機械集計が資料本文の「合計」行と完全一致すること。
 */
describe('福井県 段階台帳（T-Y11F §5順序#7・20県目・全日制72レコードで完結）', () => {
  const { records, coverage } = FUKUI_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '羽水|普通',
    '丸岡|普通（みらい共創）',
    '勝山|普通',
    '鯖江|普通（スタンダード）',
    '武生|普通',
    '若狭|普通',
    '福井農林|環境工学',
    '福井農林|食品流通',
    '敦賀工業|電子機械',
    '敦賀工業|電気',
    '敦賀工業|情報ケミカル',
    '福井商業|会計',
    '福井商業|国際経済',
    '坂井|食農科学（農業）',
    '坂井|機械・自動車（機械）',
    '坂井|電気・情報システム（電気）',
    '武生商工|電気情報',
    '武生商工|都市・建築',
    '若狭東|地域創造',
  ]);

  it('取り込み件数は全日制72レコードで完結', () => {
    expect(records).toHaveLength(72);
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の19件（定員割れ学科）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quotaは既存の倍率パイプライン（competition-rates/fukui.ts）と全件完全一致する', () => {
    const r8Records = FUKUI_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(72);

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
    expect(matched).toBe(72);
  });

  it('72レコード全数の機械集計がquota・testTakersConfirmed・finalPassersで資料本文の「合計」行と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(72);
    expect(sums.quota).toBe(3_316);
    expect(sums.testTakersConfirmed).toBe(3_426);
    expect(sums.finalPassers).toBe(3_108);
  });
});
