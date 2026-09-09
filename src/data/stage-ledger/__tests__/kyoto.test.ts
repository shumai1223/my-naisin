import { sumStageLedger } from '@/lib/stage-ledger';
import { KYOTO_STAGE_LEDGER } from '../kyoto';
import { KYOTO_COMPETITION_RATES } from '@/data/competition-rates/kyoto';

/**
 * T-Y11F §5順序#7 DoD検証（京都府・段階台帳26県目・全日制75レコードで完結）:
 * ①レコードの不変条件（quota等が0以上・testTakersConfirmed<=applicantsConfirmed）
 * ②既存の倍率パイプライン（competition-rates/kyoto.ts）のquota・applicantsConfirmedと段階台帳が
 * 全件完全一致すること ③finalPassersがtestTakersConfirmedを上回るのは京都府の中期選抜（第1〜第3
 * 志望制度）による既知の27件のみであること ④quota・applicantsConfirmed・testTakersConfirmed・
 * finalPassersの機械集計が資料本文の「全日制計」行と完全一致すること。
 */
describe('京都府 段階台帳（T-Y11F §5順序#7・26県目・全日制75レコードで完結）', () => {
  const { records, coverage } = KYOTO_STAGE_LEDGER;

  const KNOWN_ZERO = new Set([
    '京都八幡(南)|人間科学',
    '北桑田|普通',
    '京都フォレスト|京都フォレスト',
    '丹後緑風(久美浜学舎)|アグリサイエンス[単位制]',
  ]);

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '北稜|普通',
    '朱雀|普通',
    '洛東|普通',
    '北嵯峨|普通',
    '桂|植物クリエイト',
    '洛西|普通',
    '東稜|普通',
    '洛水|普通',
    '向陽|普通',
    '乙訓|普通',
    '西乙訓|普通',
    '莵道|普通',
    '城陽|普通',
    '西城陽|普通',
    '京都八幡|普通(総合選択制)',
    '久御山|普通',
    '田辺|工学探究',
    '田辺|電気技術',
    '木津|普通',
    '木津|情報企画',
    '南丹|総合学科[単位制]',
    '園部|普通',
    '農芸|農業学科群',
    '工業|ロボット技術',
    '工業|環境デザイン',
    '工業|情報テクノロジー',
    '大江|地域創生[単位制]',
  ]);

  it('取り込み件数は全日制75レコードで完結', () => {
    expect(records).toHaveLength(75);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('quotaはすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
    }
  });

  it('applicantsConfirmed/testTakersConfirmed/finalPassersは既知の4件（完全未充足学科）を除き0より大きい', () => {
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の27件（中期選抜の第1〜第3志望制度による再配分）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/kyoto.ts）と全件完全一致する', () => {
    const r8Records = KYOTO_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(75);

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
    expect(matched).toBe(75);
  });

  it('75レコード全数の機械集計がquota・applicantsConfirmed・testTakersConfirmed・finalPassersで資料本文の「全日制計」行と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(75);
    expect(sums.quota).toBe(6_048);
    expect(sums.applicantsConfirmed).toBe(5_160);
    expect(sums.testTakersConfirmed).toBe(5_146);
    expect(sums.finalPassers).toBe(4_906);
  });
});
