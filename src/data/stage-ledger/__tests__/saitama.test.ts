import { sumStageLedger } from '@/lib/stage-ledger';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { SAITAMA_STAGE_LEDGER } from '../saitama';

/**
 * T-Y11F §5順序#7 DoD検証（埼玉県・段階台帳2県目パイロット・「全日制 普通科」102レコード＋
 * 3〜7頁目「全日制 専門学科」全18区分（農業18・工業45・商業26・家庭8・看護1・外国語6・
 * 美術3・音楽3・書道1・体育2・理数7・情報1・福祉1・人文1・国際関係3・映像芸術1・
 * 舞台芸術1・生物系環境系2＝計130）＋8頁目「全日制 総合学科」9校の計241レコードを完全
 * 収録）: ①レコードの不変条件 ②quota/applicantsConfirmedは既存の倍率パイプライン
 * （competition-rates/saitama.ts）と同一値であること ③公表資料の各区分「計」との完全突合
 * （quota/testTakersConfirmed/finalPassersの3つ）④3〜7頁目18区分の合計が7頁目末尾の
 * 総合計「専門学科 計」と一致すること ⑤普通科計＋専門学科計＋総合学科計の3段階集計が
 * 8頁目末尾の最上位総合計「全日制 普通・専門・総合学科 計」と一致すること。
 */
describe('埼玉県 段階台帳（T-Y11F §5順序#7・2県目・1〜8頁目「全日制」は完全収録）', () => {
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
  const scienceRecords = records.slice(215, 222);
  const infoRecords = records.slice(222, 223);
  const welfareRecords = records.slice(223, 224);
  const humanitiesRecords = records.slice(224, 225);
  const internationalRecords = records.slice(225, 228);
  const videoArtRecords = records.slice(228, 229);
  const stageArtRecords = records.slice(229, 230);
  const bioEnvRecords = records.slice(230, 232);
  const comprehensiveRecords = records.slice(232, 241);
  const specializedRecords = records.slice(102, 232);

  it('取り込み件数は普通科102＋専門学科18区分130（農業18/工業45/商業26/家庭8/看護1/外国語6/美術3/音楽3/書道1/体育2/理数7/情報1/福祉1/人文1/国際関係3/映像芸術1/舞台芸術1/生物環境2）＋総合学科9＝計241レコード', () => {
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
    expect(scienceRecords).toHaveLength(7);
    expect(infoRecords).toHaveLength(1);
    expect(welfareRecords).toHaveLength(1);
    expect(humanitiesRecords).toHaveLength(1);
    expect(internationalRecords).toHaveLength(3);
    expect(videoArtRecords).toHaveLength(1);
    expect(stageArtRecords).toHaveLength(1);
    expect(bioEnvRecords).toHaveLength(2);
    expect(comprehensiveRecords).toHaveLength(9);
    expect(records).toHaveLength(241);
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

  it.each([
    ['理数科 計', () => scienceRecords, 7],
    ['情報科 計', () => infoRecords, 1],
    ['福祉科 計', () => welfareRecords, 1],
    ['人文科 計', () => humanitiesRecords, 1],
    ['国際関係科 計', () => internationalRecords, 3],
    ['映像芸術科 計', () => videoArtRecords, 1],
    ['舞台芸術科 計', () => stageArtRecords, 1],
    ['生物系・環境系 計', () => bioEnvRecords, 2],
  ] as const)('7頁目「%s」の機械集計がquota/testTakersConfirmed/finalPassersと完全一致する', (label, getRecords, count) => {
    const subtotal = findSubtotal(label);
    const sums = sumStageLedger(getRecords());
    expect(sums.schoolCount).toBe(count);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('3〜7頁目「全日制 専門学科」18区分130レコード全数の機械集計が7頁目末尾の総合計「専門学科 計」（quota7,382/testTakersConfirmed6,757/finalPassers6,362）と完全一致する', () => {
    const sums = sumStageLedger(specializedRecords);
    expect(sums.schoolCount).toBe(130);
    expect(sums.quota).toBe(7_382);
    expect(sums.testTakersConfirmed).toBe(6_757);
    expect(sums.finalPassers).toBe(6_362);
  });

  it('総合学科9レコード全数の機械集計が「総合学科 計」と完全一致する', () => {
    const subtotal = findSubtotal('総合学科 計');
    const sums = sumStageLedger(comprehensiveRecords);
    expect(sums.schoolCount).toBe(9);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('普通科＋専門学科＋総合学科の241レコード全数の機械集計が8頁目末尾の最上位総合計「全日制 普通・専門・総合学科 計」（quota34,603/testTakersConfirmed35,872/finalPassers32,399）と完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(241);
    expect(sums.quota).toBe(34_603);
    expect(sums.testTakersConfirmed).toBe(35_872);
    expect(sums.finalPassers).toBe(32_399);
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
    expect(matched).toBe(241);
  });
});
