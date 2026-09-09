import { sumStageLedger } from '@/lib/stage-ledger';
import { NIIGATA_STAGE_LEDGER } from '../niigata';

/**
 * T-Y11F §5順序#7 DoD検証（新潟県・段階台帳10県目・全日制93レコードで完結）:
 * ①レコードの不変条件（quota>0等・例外0件のクリーンな県）②資料本文末尾の「県立及び市立合計」
 * 「市立計」の2段階の公式小計と4系列（quota/applicantsConfirmed/testTakersConfirmed/
 * finalPassers）完全一致すること。
 *
 * ⚠️本県は既存パイプライン`competition-rates/niigata.ts`と対象時点が異なる別資料（特色化選抜/
 * 一般選抜/欠員補充2次募集/海外帰国生徒等特別選抜の4トラック併記表）を単独の典拠として採用した
 * ため（新潟南等でapplicantsConfirmedが既存パイプラインのfinalApplicantsと一致しない）、他県の
 * ようなパイプライン全件突合テストは行わない。quota算出式（総募集人数−特色化選抜合格者数）の
 * 妥当性は、資料本文の公式小計との完全一致で検証する。
 */
describe('新潟県 段階台帳（T-Y11F §5順序#7・10県目・全日制93レコードで完結）', () => {
  const { records, officialSubtotals } = NIIGATA_STAGE_LEDGER;

  it('取り込み件数は全日制93レコードで完結', () => {
    expect(records).toHaveLength(93);
  });

  it('coverage.statusはcomplete', () => {
    expect(NIIGATA_STAGE_LEDGER.coverage.status).toBe('complete');
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはすべて0より大きい（例外0件のクリーンな県）', () => {
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

  it('finalPassersはtestTakersConfirmedを超えない（一般選抜1トラックのみの合格者数のため他県のような超過例外が無い）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it.each([
    { label: '県立及び市立合計（一般選抜）', quota: 11709, applicantsConfirmed: 11679, testTakersConfirmed: 11593, finalPassers: 10590 },
    { label: '市立計（一般選抜・市立万代2件）', quota: 240, applicantsConfirmed: 351, testTakersConfirmed: 348, finalPassers: 246 },
  ])('officialSubtotalsの「$label」が定義通りである', ({ label, quota, applicantsConfirmed, testTakersConfirmed, finalPassers }) => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === label);
    expect(subtotal).toEqual({ label, quota, applicantsConfirmed, testTakersConfirmed, finalPassers });
  });

  it('市立万代2レコードの機械集計が「市立計」小計と完全一致する', () => {
    const shiritsu = records.filter((r) => r.schoolName === '市立万代');
    const sums = sumStageLedger(shiritsu);
    expect(sums.schoolCount).toBe(2);
    expect(sums.quota).toBe(240);
    expect(sums.applicantsConfirmed).toBe(351);
    expect(sums.testTakersConfirmed).toBe(348);
    expect(sums.finalPassers).toBe(246);
  });

  it('93レコード全数の機械集計が資料本文の「県立及び市立合計」行と完全一致する（文書全体グランドトータル検証）', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(93);
    expect(sums.quota).toBe(11_709);
    expect(sums.applicantsConfirmed).toBe(11_679);
    expect(sums.testTakersConfirmed).toBe(11_593);
    expect(sums.finalPassers).toBe(10_590);
  });
});
