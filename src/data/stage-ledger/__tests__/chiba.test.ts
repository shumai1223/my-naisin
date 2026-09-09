import { sumStageLedger } from '@/lib/stage-ledger';
import { CHIBA_STAGE_LEDGER } from '../chiba';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（千葉県・段階台帳・資料全体210レコード完全収録）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/chiba.ts）の
 * quota/finalApplicantsと、段階台帳のquota/applicantsConfirmedが独立した情報源にも
 * かかわらず一致することを機械的に突合する（相互裏取り）③公表資料の「県立全日制 合計」
 * 「市立全日制 合計」「県立定時制 合計」「総合計」の4段階すべてとの完全突合（DoDの本体）。
 */
describe('千葉県 段階台帳（T-Y11F §5順序#7・資料全体は完全収録）', () => {
  const { records, officialSubtotals } = CHIBA_STAGE_LEDGER;

  it('取り込み件数は210レコード（県立全日制176+市立全日制12+県立定時制22）', () => {
    expect(records).toHaveLength(210);
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

  function findSubtotal(label: string) {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === label);
    if (!subtotal) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return subtotal;
  }

  it('県立全日制176レコードが「県立全日制 合計」と完全一致する', () => {
    const subtotal = findSubtotal('県立全日制 合計');
    const prefecturalFullTime = records.filter(
      (r) => !r.schoolName.startsWith('市立') && !r.department.includes('定時制')
    );
    expect(prefecturalFullTime).toHaveLength(176);
    const sums = sumStageLedger(prefecturalFullTime);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('市立全日制12レコードが「市立全日制 合計」と完全一致する', () => {
    const subtotal = findSubtotal('市立全日制 合計');
    const municipal = records.filter((r) => r.schoolName.startsWith('市立'));
    expect(municipal).toHaveLength(12);
    const sums = sumStageLedger(municipal);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('県立定時制22レコードが「県立定時制 合計」と完全一致する', () => {
    const subtotal = findSubtotal('県立定時制 合計');
    const teiji = records.filter((r) => r.department.includes('定時制'));
    expect(teiji).toHaveLength(22);
    const sums = sumStageLedger(teiji);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('210レコード全数の機械集計が「総合計」と完全一致する', () => {
    const subtotal = findSubtotal('総合計');
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(210);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('既存の倍率パイプライン（competition-rates/chiba.ts）とquota/applicantsConfirmedが独立に一致する（全日制のみ・定時制は対象外）', () => {
    const chibaCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.chiba;
    if (!chibaCompetitionFile) throw new Error('competition-rates/chiba.ts が見つかりません');
    // R8（デフォルト年度・fiscalYear未指定）のレコードのみと突合する
    const r8Records = chibaCompetitionFile.records.filter((r) => r.fiscalYear === undefined);
    const fullTimeRecords = records.filter((r) => !r.department.includes('定時制'));

    let matched = 0;
    for (const stageRecord of fullTimeRecords) {
      const counterpart = r8Records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    // 少なくとも大半のレコードが既存データと突合できること（両ファイルの学校名表記が完全一致する前提の確認）
    expect(matched).toBeGreaterThanOrEqual(160);
  });
});
