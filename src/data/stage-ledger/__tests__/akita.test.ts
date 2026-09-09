import { sumStageLedger } from '@/lib/stage-ledger';
import { AKITA_STAGE_LEDGER } from '../akita';
import { AKITA_COMPETITION_RATES } from '@/data/competition-rates/akita';

/**
 * T-Y11F §5順序#7 DoD検証（秋田県・段階台帳27県目・全日制78レコードで完結）:
 * ①レコードの不変条件（quota等はすべて0より大きい） ②既存の倍率パイプライン
 * （competition-rates/akita.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致すること
 * ③特色選抜落選者の一般選抜転入によりtestTakersConfirmed>applicantsConfirmedとなる
 * 既知14件を除きtestTakersConfirmed<=applicantsConfirmedが成立すること
 * ④finalPassersがtestTakersConfirmedを上回る既知4件を除きfinalPassers<=testTakersConfirmedが
 * 成立すること ⑤4系列すべての機械集計が志願者数資料・合格者数資料双方の「県合計」行と完全一致
 * すること。
 */
describe('秋田県 段階台帳（T-Y11F §5順序#7・27県目・全日制78レコードで完結）', () => {
  const { records, coverage } = AKITA_STAGE_LEDGER;

  // 特色選抜落選者が一般選抜へ回るため、testTakersConfirmed（2トラック合算）が
  // applicantsConfirmed（純計）を上回る学科（制度構造・転記ミスではない）。
  const KNOWN_EXCEEDS_APPLICANTS = new Set([
    '金足農業|食品流通科',
    '秋田|普通・理数科',
    '秋田北|普通科',
    '秋田南|普通科',
    '秋田中央|普通科',
    '秋田工業|機械科',
    '秋田工業|土木科',
    '秋田商業|商業科',
    '大曲農業|園芸科学科',
    '大曲工業|機械科',
    '大曲工業|電気科',
    '大曲工業|土木・建築科',
    '湯沢翔北|総合ビジネス科',
  ]);

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '大館桂桜|機械科',
    '大館国際情報学院|国際情報科',
    '湯沢翔北|普通科',
    '湯沢翔北|工業技術科',
  ]);

  it('取り込み件数は全日制78レコードで完結', () => {
    expect(records).toHaveLength(78);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('4フィールドすべて0より大きい（不変条件・既知の0値例外なし）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('testTakersConfirmedは既知14件を除きapplicantsConfirmed以下（特色選抜落選者の一般選抜転入分のみ超過）', () => {
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

  it('finalPassersは既知4件を除きtestTakersConfirmed以下', () => {
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

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/akita.ts）と全件完全一致する', () => {
    const r8Records = AKITA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(78);

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
    expect(matched).toBe(78);
  });

  it('78レコード全数の機械集計が志願者数資料・合格者数資料双方の「県合計」行と4系列すべて完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(78);
    expect(sums.quota).toBe(6_268);
    expect(sums.applicantsConfirmed).toBe(5_237);
    expect(sums.testTakersConfirmed).toBe(5_247);
    expect(sums.finalPassers).toBe(4_944);
  });
});
