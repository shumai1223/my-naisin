import { sumStageLedger } from '@/lib/stage-ledger';
import { NAGANO_STAGE_LEDGER } from '../nagano';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（長野県・段階台帳5県目・第1〜2通学区62レコード）:
 * ①レコードの不変条件（quota>0等・篠ノ井犀峡校のみ0を許容する既知例外）②既存の倍率
 * パイプライン（competition-rates/nagano.ts）のquota・applicantsConfirmedと段階台帳が
 * 全件完全一致すること（本資料には志願者数列が存在しないため両方とも既存パイプラインを
 * 再利用する設計）③各通学区の機械集計が別紙1末尾の「◯通学区 合計」と3系列
 * （quota/testTakersConfirmed/finalPassers）完全一致すること④finalPassersが
 * applicantsConfirmed・testTakersConfirmedの両方を上回る新種の既知例外5件を明示的に許容すること。
 */
describe('長野県 段階台帳（T-Y11F §5順序#7・5県目・第1〜2通学区）', () => {
  const { records, officialSubtotals } = NAGANO_STAGE_LEDGER;
  const KNOWN_ZERO = new Set(['篠ノ井犀峡校|普通']);
  const KNOWN_EXCEEDS_TEST_AND_APPLICANTS = new Set([
    '須坂創成|工業（創造工学）',
    '長野工業|機械工学',
    '上田千曲|工業（電気）',
    '佐久平総合技術|創造実践',
    '野沢北|普通',
  ]);

  it('取り込み件数は第1〜2通学区62レコード', () => {
    expect(records).toHaveLength(62);
  });

  it('quotaはすべて0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
    }
  });

  it('applicantsConfirmed/testTakersConfirmed/finalPassersは既知の1件（篠ノ井犀峡校）を除き0より大きい', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_ZERO.has(key)) {
        expect(r.applicantsConfirmed).toBe(0);
        expect(r.testTakersConfirmed).toBe(0);
        expect(r.finalPassers).toBe(0);
        continue;
      }
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

  it('finalPassersがapplicantsConfirmed・testTakersConfirmedを上回るのは既知の5件のみ（特別選抜合格者の合算と推定）', () => {
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_EXCEEDS_TEST_AND_APPLICANTS.has(key)) {
        expect(r.finalPassers).toBeGreaterThan(r.applicantsConfirmed);
        expect(r.finalPassers).toBeGreaterThan(r.testTakersConfirmed);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/nagano.ts）と全件完全一致する（本資料に志願者数列が無いため両方とも再利用）', () => {
    const naganoCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.nagano;
    if (!naganoCompetitionFile) throw new Error('competition-rates/nagano.ts が見つかりません');
    const r8Records = naganoCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

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
    expect(matched).toBe(62);
  });

  it.each([
    { label: '第1通学区 合計', count: 37 },
    { label: '第2通学区 合計', count: 25 },
  ])('$labelの機械集計がquota/testTakersConfirmed/finalPassersの3系列とも完全一致する', ({ label, count }) => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === label);
    if (!subtotal) throw new Error(`officialSubtotals に "${label}" が見つかりません`);

    const districtRecords =
      label === '第1通学区 合計' ? records.slice(0, 37) : records.slice(37, 62);
    const sums = sumStageLedger(districtRecords);
    expect(sums.schoolCount).toBe(count);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
    // applicantsConfirmedはこの資料に印字が無い参考値のため、officialSubtotals側の値と
    // 一致することのみ確認する。
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
  });
});
