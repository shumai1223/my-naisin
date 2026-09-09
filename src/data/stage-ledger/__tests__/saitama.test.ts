import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { SAITAMA_STAGE_LEDGER } from '../saitama';

/**
 * T-Y11F §5順序#7 DoD検証（埼玉県・段階台帳2県目パイロット・10レコード）:
 * ①レコードの不変条件 ②quota/applicantsConfirmedは既存の倍率パイプライン
 * （competition-rates/saitama.ts）と同一値であること（本ファイルが意図的に再利用しているため
 * 完全一致するはずで、値がずれていれば転記ミス）。
 */
describe('埼玉県 段階台帳 パイロット（T-Y11F §5順序#7・2県目）', () => {
  const { records } = SAITAMA_STAGE_LEDGER;

  it('取り込み件数は60レコード（1頁目全体）', () => {
    expect(records).toHaveLength(60);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
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

  it('quota/applicantsConfirmedは既存の倍率パイプライン（competition-rates/saitama.ts）と完全一致する（意図的な再利用）', () => {
    const saitamaCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.saitama;
    if (!saitamaCompetitionFile) throw new Error('competition-rates/saitama.ts が見つかりません');
    const r8Records = saitamaCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

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
    expect(matched).toBe(60);
  });
});
