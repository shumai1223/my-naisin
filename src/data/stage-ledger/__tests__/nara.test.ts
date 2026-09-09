import { sumStageLedger } from '@/lib/stage-ledger';
import { NARA_STAGE_LEDGER } from '../nara';
import { NARA_COMPETITION_RATES } from '@/data/competition-rates/nara';

/**
 * T-Y11F §5順序#7 DoD検証（奈良県・段階台帳22県目・全日制71レコードで完結）:
 * ①レコードの不変条件（quota等がすべて0より大きい・testTakersConfirmed<=applicantsConfirmed）
 * ②既存の倍率パイプライン（competition-rates/nara.ts）のquota・applicantsConfirmedと段階台帳が
 * 全件完全一致すること ③finalPassersがtestTakersConfirmedを上回るのは既知の24件（一次選抜の
 * 第2希望校合格による定員割れ学科の充足）のみであること ④quota・testTakersConfirmed・finalPassers
 * の機械集計が両資料本文の「合計」行と完全一致すること。
 */
describe('奈良県 段階台帳（T-Y11F §5順序#7・22県目・全日制71レコードで完結）', () => {
  const { records, coverage } = NARA_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '奈良商工|機械工学',
    '奈良商工|総合ビジネス',
    '奈良商工|情報ビジネス',
    '奈良商工|観光',
    '高円芸術|普通',
    '高円芸術|美術',
    '添上|普通(人文探究以外)',
    '橿原|普通',
    '商業|会計・情報ビジネス・経営ビジネス・総合ビジネス(くくり募集)',
    '桜井|普通(書芸)',
    '五條|普通',
    '奈良北|数理情報',
    '香芝|普通(表現探究)',
    '宇陀|普通',
    '西和清陵|普通',
    '法隆寺国際|歴史文化',
    '法隆寺国際|総合英語',
    '磯城野|農業科学(食料生産)',
    '磯城野|施設園芸(施設野菜)',
    '磯城野|ファッションクリエイト',
    '高取国際|国際英語',
    '高取国際|国際コミュニケーション',
    '大和広陵|普通',
    '高田商業|商業',
  ]);

  it('取り込み件数は全日制71レコードで完結', () => {
    expect(records).toHaveLength(71);
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

  it('finalPassersがtestTakersConfirmedを上回るのは既知の24件（一次選抜の第2希望校合格による定員割れ学科の充足）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/nara.ts）と全件完全一致する', () => {
    const r8Records = NARA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    expect(r8Records).toHaveLength(71);

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
    expect(matched).toBe(71);
  });

  it('71レコード全数の機械集計がquota・testTakersConfirmed・finalPassersで両資料本文の「合計」行と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(71);
    expect(sums.quota).toBe(6_896);
    expect(sums.applicantsConfirmed).toBe(6_276);
    expect(sums.testTakersConfirmed).toBe(6_238);
    expect(sums.finalPassers).toBe(5_882);
  });
});
