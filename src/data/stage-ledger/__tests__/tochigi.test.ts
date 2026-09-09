import { sumStageLedger } from '@/lib/stage-ledger';
import { TOCHIGI_STAGE_LEDGER } from '../tochigi';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（栃木県・段階台帳3県目・全3頁107レコードで完結）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/tochigi.ts）の
 * quotaと段階台帳のquotaが全件完全一致すること（一般選抜定員は試験日まで不変のため）
 * ③applicantsConfirmedは既存パイプライン（2/25時点）以下でなければならない（本資料は試験
 * 直前の実測値のため、志願取消により既存パイプラインより減ることはあっても増えることは
 * ない、という方向性の不変条件で検証する。実際に107件中14件で1〜2名の減少を確認済み）
 * ④3頁目末尾の資料自体の「合計」行との4系列完全一致。
 */
describe('栃木県 段階台帳（T-Y11F §5順序#7・3県目・全3頁で完結）', () => {
  const { records, officialSubtotals } = TOCHIGI_STAGE_LEDGER;

  it('取り込み件数は全3頁107レコード', () => {
    expect(records).toHaveLength(107);
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
    expect(matched).toBe(107);
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
    expect(matched).toBe(107);
    // 実測: 107件中14件（1頁目7件・2頁目6件・3頁目1件: 那須清峰機械システム）で
    // 1〜2名の減少を確認済み。
    expect(driftCount).toBe(14);
  });

  it('宇都宮東（一般選抜非実施・quota=0）は収録しない', () => {
    expect(records.find((r) => r.schoolName === '宇都宮東')).toBeUndefined();
  });

  it('107レコード全数の機械集計が3頁目末尾の「合計」行と4系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(107);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });
});
