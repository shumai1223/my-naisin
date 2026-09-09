import { TOCHIGI_STAGE_LEDGER } from '../tochigi';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（栃木県・段階台帳3県目パイロット・1〜2頁目75レコード）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/tochigi.ts）の
 * quotaと段階台帳のquotaが全件完全一致すること（一般選抜定員は試験日まで不変のため）
 * ③applicantsConfirmedは既存パイプライン（2/25時点）以下でなければならない（本資料は試験
 * 直前の実測値のため、志願取消により既存パイプラインより減ることはあっても増えることは
 * ない、という方向性の不変条件で検証する。実際に75件中13件で1〜2名の減少を確認済み）。
 */
describe('栃木県 段階台帳（T-Y11F §5順序#7・3県目・1〜2頁目）', () => {
  const { records } = TOCHIGI_STAGE_LEDGER;

  it('取り込み件数は1〜2頁目75レコード', () => {
    expect(records).toHaveLength(75);
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

  it('quotaは既存の倍率パイプライン（competition-rates/tochigi.ts）と全件完全一致する（一般選抜定員は試験日まで不変）', () => {
    const tochigiCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.tochigi;
    if (!tochigiCompetitionFile) throw new Error('competition-rates/tochigi.ts が見つかりません');
    const r8Records = tochigiCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

    let matched = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
    }
    expect(matched).toBe(75);
  });

  it('applicantsConfirmedは既存パイプライン（2/25時点）を超えない（試験直前の志願取消のみが差異の原因という方向性の不変条件）', () => {
    const tochigiCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.tochigi;
    if (!tochigiCompetitionFile) throw new Error('competition-rates/tochigi.ts が見つかりません');
    const r8Records = tochigiCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

    let matched = 0;
    let driftCount = 0;
    for (const stageRecord of records) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(stageRecord.applicantsConfirmed).toBeLessThanOrEqual(counterpart.finalApplicants);
      // ドリフトは数名以内（志願取消の実数）に収まるはず。大きく外れたら誤読を疑う。
      expect(counterpart.finalApplicants - stageRecord.applicantsConfirmed).toBeLessThanOrEqual(3);
      if (stageRecord.applicantsConfirmed !== counterpart.finalApplicants) driftCount++;
    }
    expect(matched).toBe(75);
    // 実測: 75件中13件（1頁目7件: 宇都宮南・宇都宮清陵・宇都宮女子・宇都宮白楊食品科学・
    // 宇都宮工業機械システム・宇都宮商業商業・小山南スポーツ／2頁目6件: 小山城南・栃木翔南・
    // 足利南・足利工業機械・足利清風普通・真岡）で1〜2名の減少を確認済み。
    expect(driftCount).toBe(13);
  });

  it('宇都宮東（一般選抜非実施・quota=0）は収録しない', () => {
    expect(records.find((r) => r.schoolName === '宇都宮東')).toBeUndefined();
  });
});
