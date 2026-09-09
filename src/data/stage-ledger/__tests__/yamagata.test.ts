import { sumStageLedger } from '@/lib/stage-ledger';
import { YAMAGATA_STAGE_LEDGER } from '../yamagata';

/**
 * T-Y11F §5順序#7 DoD検証（山形県・段階台帳19県目・全日制90レコードで完結・既存パイプライン非依存）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②finalPassersがtestTakersConfirmedを
 * 上回るのは既知の14件（併設型中学校からの入学予定者を含む学校）のみであること ③quota・
 * applicantsConfirmed・testTakersConfirmed・finalPassersの4系列すべての機械集計が資料本文の
 * 「全日制公立合計」行と完全一致すること。
 *
 * ⚠️他県と異なり既存パイプライン（competition-rates/yamagata.ts）との突合テストは行わない——
 * 定義が別物（既存は後期選抜のみ、本台帳は前期(特色)+後期(一般)等の全トラック合算）のため
 * 意図的に独立収録した設計（詳細はyamagata.tsのファイル冒頭コメント参照）。
 */
describe('山形県 段階台帳（T-Y11F §5順序#7・19県目・全日制90レコードで完結）', () => {
  const { records, coverage } = YAMAGATA_STAGE_LEDGER;

  const KNOWN_EXCEEDS_TEST_TAKERS = new Set([
    '山形東|普通',
    '山形工業|土木・化学',
    '山形中央|普通',
    '寒河江|普通(一般コース)',
    '長井|普通(一般コース)',
    '鶴岡工業|機械',
    '鶴岡工業|電気電子',
    '鶴岡工業|環境化学',
    '酒田光陵|工業(電気電子)',
    '酒田光陵|工業(環境技術)',
    '酒田光陵|商業(ビジネス流通)',
    '酒田光陵|商業(ビジネス会計)',
    '山形市立商業|商業(情報)',
    '山形市立商業|商業(経済)',
  ]);

  it('取り込み件数は全日制90レコードで完結', () => {
    expect(records).toHaveLength(90);
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

  it('testTakersConfirmedはapplicantsConfirmedを超えない（受検者等の数=入学志願者等の数−取消欠席者数のため）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('finalPassersがtestTakersConfirmedを上回るのは既知の14件（併設型中学校からの入学予定者を含む学校）のみ', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_TAKERS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('90レコード全数の機械集計が資料本文の「全日制公立合計」行と4系列すべて完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(90);
    expect(sums.quota).toBe(6_520);
    expect(sums.applicantsConfirmed).toBe(5_088);
    expect(sums.testTakersConfirmed).toBe(5_072);
    expect(sums.finalPassers).toBe(4_971);
  });
});
