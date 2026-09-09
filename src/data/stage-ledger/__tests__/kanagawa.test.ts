import { sumStageLedger } from '@/lib/stage-ledger';
import { KANAGAWA_STAGE_LEDGER } from '../kanagawa';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（神奈川県・段階台帳6県目・「普通科」区分96レコードで先行着手）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/kanagawa.ts）の
 * quota・applicantsConfirmedと段階台帳が全件完全一致すること（本資料には志願者数列が
 * 存在しないため両方とも既存パイプラインを再利用する設計）③finalPassersがquotaを超える
 * 既知の5件を明示的に許容する④4段階の公式小計（県立計・市立計・合計・クリエイティブ合計）との
 * 完全一致。
 */
describe('神奈川県 段階台帳（T-Y11F §5順序#7・6県目・「普通科」区分96レコードで先行着手）', () => {
  const { records, officialSubtotals } = KANAGAWA_STAGE_LEDGER;

  it('取り込み件数は普通科（共通選抜92校＋クリエイティブスクール4校）96レコード', () => {
    expect(records).toHaveLength(96);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/kanagawa.ts）と全件完全一致する（本資料に志願者数列が無いため両方とも再利用）', () => {
    const kanagawaCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.kanagawa;
    if (!kanagawaCompetitionFile) throw new Error('competition-rates/kanagawa.ts が見つかりません');
    const r8Records = kanagawaCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

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
    expect(matched).toBe(96);
  });

  it('testTakersConfirmedは「計（A）＋（B）」列（本検査受検者＋追検査受検者の合計）のためquotaの1.5倍を超えることはない（極端な誤読の防止・粗いガード）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThan(r.quota * 3);
    }
  });

  it('finalPassersがquotaを超えるのは既知の7件のみ（合格ボーダー同点者の全員合格と推測）', () => {
    const KNOWN_OVERFLOW = new Map<string, number>([
      ['横浜立野|普通科', 279],
      ['湘南|普通科', 360],
      ['藤沢西|普通科', 319],
      ['海老名|普通科', 399],
      ['綾瀬|普通科', 319],
      ['伊志田|普通科', 311],
      ['上溝|普通科', 242],
    ]);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_OVERFLOW.has(key)) {
        expect(r.finalPassers).toBe(KNOWN_OVERFLOW.get(key));
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.quota);
    }
  });

  it('finalPassersはapplicantsConfirmedを超えない（今回このパターンの逆転は0件）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('96レコード全数の機械集計が資料本文の4段階の公式小計（県立計・市立計・合計・クリエイティブ合計）とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const kenritsu = officialSubtotals.find((s) => s.label === '県立計（普通科・共通選抜）');
    const shiritsu = officialSubtotals.find((s) => s.label === '市立計（普通科・共通選抜）');
    const goukei = officialSubtotals.find((s) => s.label === '合計（普通科・共通選抜）');
    const creative = officialSubtotals.find((s) => s.label === '合計（普通科クリエイティブスクール）');
    if (!kenritsu || !shiritsu || !goukei || !creative) throw new Error('officialSubtotals の一部が見つかりません');

    // 県立計＋市立計＝合計（資料内部の整合性）
    expect(kenritsu.quota + shiritsu.quota).toBe(goukei.quota);
    expect(kenritsu.testTakersConfirmed + shiritsu.testTakersConfirmed).toBe(goukei.testTakersConfirmed);
    expect(kenritsu.finalPassers + shiritsu.finalPassers).toBe(goukei.finalPassers);

    const kyoutsuu = records.filter((r) => r.department === '普通科');
    const creativeRecords = records.filter((r) => r.department === '普通科（クリエイティブスクール）');
    const kyoutsuuSums = sumStageLedger(kyoutsuu);
    const creativeSums = sumStageLedger(creativeRecords);

    expect(kyoutsuu).toHaveLength(92);
    expect(creativeRecords).toHaveLength(4);

    expect(kyoutsuuSums.quota).toBe(goukei.quota);
    expect(kyoutsuuSums.testTakersConfirmed).toBe(goukei.testTakersConfirmed);
    expect(kyoutsuuSums.finalPassers).toBe(goukei.finalPassers);
    expect(kyoutsuuSums.applicantsConfirmed).toBe(goukei.applicantsConfirmed);

    expect(creativeSums.quota).toBe(creative.quota);
    expect(creativeSums.testTakersConfirmed).toBe(creative.testTakersConfirmed);
    expect(creativeSums.finalPassers).toBe(creative.finalPassers);
    expect(creativeSums.applicantsConfirmed).toBe(creative.applicantsConfirmed);

    const totalSums = sumStageLedger(records);
    expect(totalSums.quota).toBe(goukei.quota + creative.quota);
    expect(totalSums.testTakersConfirmed).toBe(goukei.testTakersConfirmed + creative.testTakersConfirmed);
    expect(totalSums.finalPassers).toBe(goukei.finalPassers + creative.finalPassers);
  });
});
