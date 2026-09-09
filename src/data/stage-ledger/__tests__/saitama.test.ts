import { sumStageLedger } from '@/lib/stage-ledger';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { SAITAMA_STAGE_LEDGER } from '../saitama';

/**
 * T-Y11F §5順序#7 DoD検証（埼玉県・段階台帳2県目パイロット・「全日制 普通科」102レコード＋
 * 「農業に関する学科」18レコード＋「工業に関する学科」45レコードの3区分・計165レコードを
 * 完全収録）: ①レコードの不変条件 ②quota/applicantsConfirmedは既存の倍率パイプライン
 * （competition-rates/saitama.ts）と同一値であること ③公表資料の「普通科 計」「農業科 計」
 * 「工業科 計」との完全突合（quota/testTakersConfirmed/finalPassersの3つ・
 * applicantsConfirmedはこの資料に印字が無いため対象外）。
 */
describe('埼玉県 段階台帳（T-Y11F §5順序#7・2県目・全日制普通科＋農業に関する学科＋工業に関する学科は完全収録）', () => {
  const { records, officialSubtotals } = SAITAMA_STAGE_LEDGER;
  // 農業に関する学科18レコード・工業に関する学科45レコードは、1〜2頁目（普通科102レコード）の
  // 後にそれぞれ3頁目分・4頁目分として追記されているため、配列順で分割する（department名だけ
  // では「情報コース」等の普通科内特別コースと区別できない）。
  const normalRecords = records.slice(0, 102);
  const agricultureRecords = records.slice(102, 120);
  const industrialRecords = records.slice(120);

  it('取り込み件数は普通科102＋農業に関する学科18＋工業に関する学科45（計165レコード）', () => {
    expect(normalRecords).toHaveLength(102);
    expect(agricultureRecords).toHaveLength(18);
    expect(industrialRecords).toHaveLength(45);
    expect(records).toHaveLength(165);
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

  function findSubtotal(label: string) {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === label);
    if (!subtotal) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return subtotal;
  }

  it('普通科102レコード全数の機械集計が「普通科 計」のquota/testTakersConfirmed/finalPassersと完全一致する', () => {
    const subtotal = findSubtotal('普通科 計');
    const sums = sumStageLedger(normalRecords);
    expect(sums.schoolCount).toBe(102);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
    // applicantsConfirmedはこの資料に印字が無い参考値のため、officialSubtotals側の値と
    // 一致することのみ確認する（別の一次資料との突合は別テストで実施）。
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
  });

  it('農業に関する学科18レコード全数の機械集計が「農業科 計」と完全一致する', () => {
    const subtotal = findSubtotal('農業科 計');
    const sums = sumStageLedger(agricultureRecords);
    expect(sums.schoolCount).toBe(18);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('工業に関する学科45レコード全数の機械集計が「工業科 計」と完全一致する', () => {
    const subtotal = findSubtotal('工業科 計');
    const sums = sumStageLedger(industrialRecords);
    expect(sums.schoolCount).toBe(45);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
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
    expect(matched).toBe(165);
  });
});
