import { sumStageLedger } from '@/lib/stage-ledger';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { SAITAMA_STAGE_LEDGER } from '../saitama';

/**
 * T-Y11F §5順序#7 DoD検証（埼玉県・段階台帳2県目パイロット・「全日制 普通科」102レコード＋
 * 「農業に関する学科」18レコード＋「工業に関する学科」45レコード＋「商業に関する学科」
 * 26レコード＋6頁目7小区分（家庭8＋看護1＋外国語6＋美術3＋音楽3＋書道1＋体育2＝24）の
 * 計215レコードを完全収録）: ①レコードの不変条件 ②quota/applicantsConfirmedは既存の
 * 倍率パイプライン（competition-rates/saitama.ts）と同一値であること ③公表資料の各区分
 * 「計」との完全突合（quota/testTakersConfirmed/finalPassersの3つ・applicantsConfirmedは
 * この資料に印字が無いため対象外）。
 */
describe('埼玉県 段階台帳（T-Y11F §5順序#7・2県目・1〜6頁目11区分は完全収録）', () => {
  const { records, officialSubtotals } = SAITAMA_STAGE_LEDGER;
  // 3頁目以降の各区分は配列順で追記されているため、配列順で分割する（department名だけでは
  // 「情報コース」等の普通科内特別コースと区別できない）。
  const normalRecords = records.slice(0, 102);
  const agricultureRecords = records.slice(102, 120);
  const industrialRecords = records.slice(120, 165);
  const commerceRecords = records.slice(165, 191);
  const homeEconomicsRecords = records.slice(191, 199);
  const nursingRecords = records.slice(199, 200);
  const foreignLanguageRecords = records.slice(200, 206);
  const artRecords = records.slice(206, 209);
  const musicRecords = records.slice(209, 212);
  const calligraphyRecords = records.slice(212, 213);
  const peRecords = records.slice(213, 215);

  it('取り込み件数は普通科102＋農業18＋工業45＋商業26＋家庭8＋看護1＋外国語6＋美術3＋音楽3＋書道1＋体育2（計215レコード）', () => {
    expect(normalRecords).toHaveLength(102);
    expect(agricultureRecords).toHaveLength(18);
    expect(industrialRecords).toHaveLength(45);
    expect(commerceRecords).toHaveLength(26);
    expect(homeEconomicsRecords).toHaveLength(8);
    expect(nursingRecords).toHaveLength(1);
    expect(foreignLanguageRecords).toHaveLength(6);
    expect(artRecords).toHaveLength(3);
    expect(musicRecords).toHaveLength(3);
    expect(calligraphyRecords).toHaveLength(1);
    expect(peRecords).toHaveLength(2);
    expect(records).toHaveLength(215);
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

  it('商業に関する学科26レコード全数の機械集計が「商業科 計」のquota/testTakersConfirmed/finalPassersと完全一致する', () => {
    const subtotal = findSubtotal('商業科 計');
    const sums = sumStageLedger(commerceRecords);
    expect(sums.schoolCount).toBe(26);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
    // applicantsConfirmedはこの資料に印字が無い参考値のため、officialSubtotals側の値と
    // 一致することのみ確認する。
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
  });

  it.each([
    ['家庭科 計', () => homeEconomicsRecords, 8],
    ['看護科 計', () => nursingRecords, 1],
    ['外国語科 計', () => foreignLanguageRecords, 6],
    ['美術科 計', () => artRecords, 3],
    ['音楽科 計', () => musicRecords, 3],
    ['書道科 計', () => calligraphyRecords, 1],
    ['体育科 計', () => peRecords, 2],
  ] as const)('6頁目「%s」の機械集計がquota/testTakersConfirmed/finalPassersと完全一致する', (label, getRecords, count) => {
    const subtotal = findSubtotal(label);
    const sums = sumStageLedger(getRecords());
    expect(sums.schoolCount).toBe(count);
    expect(sums.quota).toBe(subtotal.quota);
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
    expect(matched).toBe(215);
  });
});
