import { sumStageLedger } from '@/lib/stage-ledger';
import { MIE_STAGE_LEDGER } from '../mie';
import { MIE_COMPETITION_RATES } from '@/data/competition-rates/mie';

/**
 * T-Y11F §5順序#7 DoD検証（三重県・段階台帳11県目・全日制108レコードで完結）:
 * ①レコードの不変条件（quota>0等・0値例外0件）②既存の倍率パイプライン（competition-rates/mie.ts）
 * のquota・applicantsConfirmedと段階台帳が全件完全一致すること③quota・testTakersConfirmedの
 * 機械集計が「後期選抜受検状況」資料の総計行と完全一致すること④finalPassersが
 * testTakersConfirmedを上回る既知の24件を許容すること（合格者数資料が連携型・欠員補充等を
 * 含む最終入学予定者数を表しているためと推測される三重県固有の特徴）。
 */
describe('三重県 段階台帳（T-Y11F §5順序#7・11県目・全日制108レコードで完結）', () => {
  const { records, officialSubtotals } = MIE_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '桑名工業|電気・電子（くくり募集）',
    '四日市|普通',
    '四日市南|普通',
    '四日市西|普通',
    '朝明|ふくし',
    '四日市工業|自動車',
    '四日市中央工業|設備システム',
    '四日市農芸|農業科学・食品科学・環境造園（くくり募集）',
    '神戸|普通',
    '亀山|普通',
    '津西|普通',
    '津工業|電気',
    '伊賀白鳳|機械・電子機械・建築デザイン（くくり募集）',
    '伊賀白鳳|経営',
    '伊賀白鳳|ヒューマンサービス',
    '名張青峰|普通',
    '松阪|普通',
    '松阪工業|自動車',
    '松阪商業|総合ビジネス',
    '相可|普通',
    '明野|食品科学',
    '伊勢|普通',
    '伊勢工業|機械',
    '熊野青藍（木本校舎）|普通',
  ]);

  it('取り込み件数は全日制108レコードで完結', () => {
    expect(records).toHaveLength(108);
  });

  it('coverage.statusはcomplete', () => {
    expect(MIE_STAGE_LEDGER.coverage.status).toBe('complete');
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはすべて0より大きい（例外0件）', () => {
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の24件のみ（合格者数資料が連携型・欠員補充等を含む最終入学予定者数を表すためと推定）', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/mie.ts）と全件完全一致する', () => {
    const r8Records = MIE_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(108);

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
    expect(matched).toBe(108);
  });

  it('officialSubtotalsの「総計（後期選抜・受検状況）」が定義通りである', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === '総計（後期選抜・受検状況）');
    expect(subtotal).toEqual({
      label: '総計（後期選抜・受検状況）',
      quota: 6419,
      applicantsConfirmed: 6636,
      testTakersConfirmed: 6566,
      finalPassers: 5982,
    });
  });

  it('108レコード全数の機械集計がquota・testTakersConfirmedで資料本文の総計行と、finalPassersで独立算出した差分と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(108);
    expect(sums.quota).toBe(6_419);
    expect(sums.testTakersConfirmed).toBe(6_566);
    expect(sums.finalPassers).toBe(5_982);
  });
});
