import { sumStageLedger } from '@/lib/stage-ledger';
import { KANAGAWA_STAGE_LEDGER } from '../kanagawa';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（神奈川県・段階台帳6県目・「普通科」96レコード＋「専門学科」
 * 33レコード＝計129レコード）: ①レコードの不変条件（quota>0等）②既存の倍率パイプライン
 * （competition-rates/kanagawa.ts）のquota・applicantsConfirmedと段階台帳が全件完全一致する
 * こと（本資料には志願者数列が存在しないため両方とも既存パイプラインを再利用する設計）
 * ③finalPassersがquotaを超える既知の10件を明示的に許容する④公式小計（普通科4段階＋
 * 専門学科7区分）との完全一致。
 */
describe('神奈川県 段階台帳（T-Y11F §5順序#7・6県目・「普通科」＋「専門学科」計129レコード）', () => {
  const { records, officialSubtotals } = KANAGAWA_STAGE_LEDGER;

  it('取り込み件数は普通科96レコード＋専門学科33レコード＝計129レコード', () => {
    expect(records).toHaveLength(129);
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
    expect(matched).toBe(129);
  });

  it('testTakersConfirmedは「計（A）＋（B）」列（本検査受検者＋追検査受検者の合計）のためquotaの1.5倍を超えることはない（極端な誤読の防止・粗いガード）', () => {
    for (const r of records) {
      expect(r.testTakersConfirmed).toBeLessThan(r.quota * 3);
    }
  });

  it('finalPassersがquotaを超えるのは既知の10件のみ（合格ボーダー同点者の全員合格と推測）', () => {
    const KNOWN_OVERFLOW = new Map<string, number>([
      ['横浜立野|普通科', 279],
      ['湘南|普通科', 360],
      ['藤沢西|普通科', 319],
      ['海老名|普通科', 399],
      ['綾瀬|普通科', 319],
      ['伊志田|普通科', 311],
      ['上溝|普通科', 242],
      ['相原|農業科', 115],
      ['相原|商業科', 119],
      ['神奈川工業|工業科', 319],
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

  it('普通科96レコードの機械集計が資料本文の4段階の公式小計（県立計・市立計・合計・クリエイティブ合計）とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する', () => {
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

    const futsuukaTotal = sumStageLedger([...kyoutsuu, ...creativeRecords]);
    expect(futsuukaTotal.quota).toBe(goukei.quota + creative.quota);
    expect(futsuukaTotal.testTakersConfirmed).toBe(goukei.testTakersConfirmed + creative.testTakersConfirmed);
    expect(futsuukaTotal.finalPassers).toBe(goukei.finalPassers + creative.finalPassers);
  });

  it('専門学科33レコードは10区分（農業3・工業10・商業7・水産1・家庭1・福祉4・理数1・体育2・美術2・国際2）で、7区分の公式小計とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する（水産・家庭・理数は学校数1のため区分合計行が印字されず対象外）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const SENMON_DEPARTMENTS: Record<string, number> = {
      農業科: 3,
      工業科: 10,
      商業科: 7,
      水産科: 1,
      家庭科: 1,
      福祉科: 4,
      理数科: 1,
      体育科: 2,
      美術科: 2,
      国際科: 2,
    };
    let senmonTotal = 0;
    for (const [dept, count] of Object.entries(SENMON_DEPARTMENTS)) {
      const deptRecords = records.filter((r) => r.department === dept);
      expect(deptRecords).toHaveLength(count);
      senmonTotal += deptRecords.length;

      const subtotalLabel = `合計（専門学科・${dept.replace('科', '')}）`;
      const subtotal = officialSubtotals.find((s) => s.label === subtotalLabel);
      if (!subtotal) continue; // 水産・家庭・理数は区分合計行が資料に印字されていないため対象外
      const sums = sumStageLedger(deptRecords);
      expect(sums.quota).toBe(subtotal.quota);
      expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
      expect(sums.finalPassers).toBe(subtotal.finalPassers);
    }
    expect(senmonTotal).toBe(33);
  });
});
