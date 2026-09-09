import { sumStageLedger } from '@/lib/stage-ledger';
import { CHIBA_STAGE_LEDGER } from '../chiba';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（千葉県・段階台帳パイロット・35レコード）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/chiba.ts）の
 * quota/finalApplicantsと、段階台帳のquota/applicantsConfirmedが独立した情報源にも
 * かかわらず一致することを機械的に突合する（相互裏取り）。
 */
describe('千葉県 段階台帳 パイロット（T-Y11F §5順序#7）', () => {
  const { records } = CHIBA_STAGE_LEDGER;

  it('取り込み件数は70レコード（1〜2頁目）', () => {
    expect(records).toHaveLength(70);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('finalPassersはquotaを超えない（合格者数は募集人員が上限）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.quota);
    }
  });

  it('sumStageLedgerが70校分の合計を返す', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(70);
    expect(sums.quota).toBeGreaterThan(0);
  });

  it('既存の倍率パイプライン（competition-rates/chiba.ts）とquota/applicantsConfirmedが独立に一致する', () => {
    const chibaCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.chiba;
    if (!chibaCompetitionFile) throw new Error('competition-rates/chiba.ts が見つかりません');
    // R8（デフォルト年度・fiscalYear未指定）のレコードのみと突合する
    const r8Records = chibaCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    // 少なくとも大半のレコードが既存データと突合できること（両ファイルの学校名表記が完全一致する前提の確認）
    expect(matched).toBeGreaterThanOrEqual(60);
  });
});
