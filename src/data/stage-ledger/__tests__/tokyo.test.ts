import { sumStageLedger } from '@/lib/stage-ledger';
import { TOKYO_STAGE_LEDGER } from '../tokyo';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { TEIJI_COMPETITION_RATE_BY_PREFECTURE } from '@/data/teiji-competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（東京都・段階台帳7県目・189レコード=「普通科」系123＋商業7＋
 * ビジネスコミュ2＋工業16＋科学技術2＋農業5＋水産1＋家庭単位制以外3＋家庭単位制1＋福祉2＋
 * 理数2＋芸術1＋体育2＋併合科3＋産業科2＋総合学科10＋定時制課程単位制7）: ①レコードの不変
 * 条件（quota>0等）②既存の倍率パイプライン（普通科〜総合学科はcompetition-rates/tokyo.ts、
 * 定時制課程はteiji-competition-rates/tokyo.ts）のquota・applicantsConfirmedと段階台帳が
 * 全件完全一致すること（本資料には志願者数列が存在しないため両方とも既存パイプラインを再利用
 * する設計）③finalPassers>quotaが普通科系では極めて高頻度（推薦選抜の未消化枠繰り上げが
 * 原因と推測）のため他県のような個別例外列挙はせず、代わりにfinalPassers<=applicants
 * Confirmedの逆側の不変条件のみ検証する④公式小計（24段階）との完全一致。
 */
describe('東京都 段階台帳（T-Y11F §5順序#7・7県目・189レコード）', () => {
  const { records, officialSubtotals } = TOKYO_STAGE_LEDGER;

  it('取り込み件数は189レコード（普通科系123＋商業7＋ビジネスコミュ2＋工業16＋科学技術2＋農業5＋水産1＋家庭単位制以外3＋家庭単位制1＋福祉2＋理数2＋芸術1＋体育2＋併合科3＋産業科2＋総合学科10＋定時制課程単位制7）', () => {
    expect(records).toHaveLength(189);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/tokyo.ts）と182件完全一致する（本資料に志願者数列が無いため両方とも再利用）', () => {
    const tokyoCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.tokyo;
    if (!tokyoCompetitionFile) throw new Error('competition-rates/tokyo.ts が見つかりません');
    const r8Records = tokyoCompetitionFile.records.filter((r) => r.fiscalYear === undefined);

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
    expect(matched).toBe(182);
  });

  it('定時制課程（単位制）7レコードのquota・applicantsConfirmedは既存の倍率パイプライン（teiji-competition-rates/tokyo.ts）と全件完全一致する', () => {
    const teijiFile = TEIJI_COMPETITION_RATE_BY_PREFECTURE.tokyo;
    if (!teijiFile) throw new Error('teiji-competition-rates/tokyo.ts が見つかりません');
    const teijiRecords = records.filter(
      (r) =>
        (r.schoolName === '一橋' && r.department === '普通科') ||
        (r.schoolName === '新宿山吹' && (r.department === '普通科1〜4部' || r.department === '情報科2・4部')) ||
        (r.schoolName === '浅草' && r.department === '普通科') ||
        (r.schoolName === '荻窪' && r.department === '普通科') ||
        (r.schoolName === '八王子拓真' && r.department === '普通科') ||
        (r.schoolName === '砂川' && r.department === '普通科1〜3部')
    );
    expect(teijiRecords).toHaveLength(7);

    let matched = 0;
    for (const stageRecord of teijiRecords) {
      const counterpart = teijiFile.records.find(
        (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
      );
      if (!counterpart) continue;
      matched++;
      expect(counterpart.quota).toBe(stageRecord.quota);
      expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
    }
    expect(matched).toBe(7);
  });

  it('finalPassersはapplicantsConfirmedを超えない（東京都でもこのパターンの逆転は0件）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
    }
  });

  it('finalPassersがtestTakersConfirmedを超えるのは既知の1件のみ（江東・科学技術＝創造理数科第1志望者の2志望合流と推測・資料脚注に根拠あり）', () => {
    const KNOWN_TESTTAKERS_OVERFLOW = new Map<string, number>([['科学技術|科学技術科', 66]]);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (KNOWN_TESTTAKERS_OVERFLOW.has(key)) {
        expect(r.finalPassers).toBe(KNOWN_TESTTAKERS_OVERFLOW.get(key));
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('finalPassersがquotaを超える校数は東京都特有の高頻度パターンで70件以上（推薦選抜の未消化枠繰り上げと推測・他県の稀な「合格ボーダー同点者」型とは異質）', () => {
    const overflowCount = records.filter((r) => r.finalPassers > r.quota).length;
    // 実測77件（107件中72%）。個別列挙が非現実的なほど高頻度なため、下限のみを固定して
    // 「稀な例外ではなく構造的な現象である」ことをこのテストで機械的に保証する。
    expect(overflowCount).toBeGreaterThanOrEqual(70);
    // 超過量は小幅（最大+17・日比谷）であることも確認し、桁違いの誤読が無いことを保証する。
    const maxOverflow = Math.max(...records.map((r) => r.finalPassers - r.quota));
    expect(maxOverflow).toBeLessThanOrEqual(30);
  });

  it('「普通科（コース・単位制以外）」107レコードの機械集計が資料本文の4段階の公式小計（区部計・多摩部計・コース単位制以外計・島しょ計）とquota/testTakersConfirmed/finalPassersの3系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const kubu = officialSubtotals.find((s) => s.label === '区部計');
    const tama = officialSubtotals.find((s) => s.label === '多摩部計');
    const goukei = officialSubtotals.find((s) => s.label === 'コース、単位制以外計');
    const shima = officialSubtotals.find((s) => s.label === '島しょ計');
    if (!kubu || !tama || !goukei || !shima) throw new Error('officialSubtotals の一部が見つかりません');

    // 区部計＋多摩部計＝コース単位制以外計（資料内部の整合性）
    expect(kubu.quota + tama.quota).toBe(goukei.quota);
    expect(kubu.testTakersConfirmed + tama.testTakersConfirmed).toBe(goukei.testTakersConfirmed);
    expect(kubu.finalPassers + tama.finalPassers).toBe(goukei.finalPassers);

    // 区部57校・多摩部44校の境界は資料の掲載順（区部計行の直前まで）で区切る。
    // department==='普通科'は定時制課程（単位制）の一橋/浅草/荻窪/八王子拓真とも同名のため、
    // records配列の先頭107件（sheet1の掲載順）を直接スライスして区別する。
    const futsuuIjai = records.slice(0, 107);
    expect(futsuuIjai.every((r) => r.department === '普通科')).toBe(true);
    expect(futsuuIjai).toHaveLength(107);
    const kubuRecords = futsuuIjai.slice(0, 57);
    const tamaRecords = futsuuIjai.slice(57, 101);
    const shimaRecords = futsuuIjai.slice(101);

    expect(kubuRecords).toHaveLength(57);
    expect(tamaRecords).toHaveLength(44);
    expect(shimaRecords).toHaveLength(6);

    const kubuSums = sumStageLedger(kubuRecords);
    expect(kubuSums.quota).toBe(kubu.quota);
    expect(kubuSums.testTakersConfirmed).toBe(kubu.testTakersConfirmed);
    expect(kubuSums.finalPassers).toBe(kubu.finalPassers);
    expect(kubuSums.applicantsConfirmed).toBe(kubu.applicantsConfirmed);

    const tamaSums = sumStageLedger(tamaRecords);
    expect(tamaSums.quota).toBe(tama.quota);
    expect(tamaSums.testTakersConfirmed).toBe(tama.testTakersConfirmed);
    expect(tamaSums.finalPassers).toBe(tama.finalPassers);
    expect(tamaSums.applicantsConfirmed).toBe(tama.applicantsConfirmed);

    const shimaSums = sumStageLedger(shimaRecords);
    expect(shimaSums.quota).toBe(shima.quota);
    expect(shimaSums.testTakersConfirmed).toBe(shima.testTakersConfirmed);
    expect(shimaSums.finalPassers).toBe(shima.finalPassers);
    expect(shimaSums.applicantsConfirmed).toBe(shima.applicantsConfirmed);

    const totalSums = sumStageLedger(futsuuIjai);
    expect(totalSums.quota).toBe(goukei.quota + shima.quota);
    expect(totalSums.testTakersConfirmed).toBe(goukei.testTakersConfirmed + shima.testTakersConfirmed);
    expect(totalSums.finalPassers).toBe(goukei.finalPassers + shima.finalPassers);
  });

  it('「普通科（コース制）」4レコード＋「普通科（単位制）」12レコードの機械集計が資料本文の公式小計（コース制計・単位制計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const kousei = officialSubtotals.find((s) => s.label === 'コース制計');
    const tan_i = officialSubtotals.find((s) => s.label === '単位制計');
    if (!kousei || !tan_i) throw new Error('officialSubtotals の一部が見つかりません');

    const kouseiRecords = records.filter((r) => r.department.startsWith('普通科（コース制'));
    const tan_iRecords = records.filter((r) => r.department === '普通科（単位制）');
    expect(kouseiRecords).toHaveLength(4);
    expect(tan_iRecords).toHaveLength(12);

    const kouseiSums = sumStageLedger(kouseiRecords);
    expect(kouseiSums.quota).toBe(kousei.quota);
    expect(kouseiSums.testTakersConfirmed).toBe(kousei.testTakersConfirmed);
    expect(kouseiSums.finalPassers).toBe(kousei.finalPassers);
    expect(kouseiSums.applicantsConfirmed).toBe(kousei.applicantsConfirmed);

    const tan_iSums = sumStageLedger(tan_iRecords);
    expect(tan_iSums.quota).toBe(tan_i.quota);
    expect(tan_iSums.testTakersConfirmed).toBe(tan_i.testTakersConfirmed);
    expect(tan_iSums.finalPassers).toBe(tan_i.finalPassers);
    expect(tan_iSums.applicantsConfirmed).toBe(tan_i.applicantsConfirmed);
  });

  it('「商業に関する学科」7レコード＋「ビジネスコミュニケーション科」2レコードの機械集計が資料本文の公式小計（商業計・ビジネスコミュニケーション科計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する（本区分はfinalPassers>quotaが少数派＝3/9件のみ）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const shougyou = officialSubtotals.find((s) => s.label === '商業計');
    const bijicomi = officialSubtotals.find((s) => s.label === 'ビジネスコミュニケーション科計');
    if (!shougyou || !bijicomi) throw new Error('officialSubtotals の一部が見つかりません');

    const shougyouRecords = records.filter((r) => r.department === '商業科');
    const bijicomiRecords = records.filter((r) => r.department === 'ビジネスコミュニケーション科');
    expect(shougyouRecords).toHaveLength(7);
    expect(bijicomiRecords).toHaveLength(2);

    const shougyouSums = sumStageLedger(shougyouRecords);
    expect(shougyouSums.quota).toBe(shougyou.quota);
    expect(shougyouSums.testTakersConfirmed).toBe(shougyou.testTakersConfirmed);
    expect(shougyouSums.finalPassers).toBe(shougyou.finalPassers);
    expect(shougyouSums.applicantsConfirmed).toBe(shougyou.applicantsConfirmed);

    const bijicomiSums = sumStageLedger(bijicomiRecords);
    expect(bijicomiSums.quota).toBe(bijicomi.quota);
    expect(bijicomiSums.testTakersConfirmed).toBe(bijicomi.testTakersConfirmed);
    expect(bijicomiSums.finalPassers).toBe(bijicomi.finalPassers);
    expect(bijicomiSums.applicantsConfirmed).toBe(bijicomi.applicantsConfirmed);

    const overflowCount = [...shougyouRecords, ...bijicomiRecords].filter((r) => r.finalPassers > r.quota).length;
    expect(overflowCount).toBe(3);
  });

  it('「工業に関する学科」16レコード（単位制以外15＋単位制1）＋「科学技術科」2レコードの機械集計が資料本文の4段階の公式小計（工業計・単位制計〈工業〉・工業合計・科学技術科計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する（工業16件中finalPassers>quotaは工芸1件のみ＝工業系は総じて低倍率）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const kougyou = officialSubtotals.find((s) => s.label === '工業計');
    const kougyouTani = officialSubtotals.find((s) => s.label === '単位制計（工業）');
    const kougyouGoukei = officialSubtotals.find((s) => s.label === '工業合計');
    const kagakuGijutsu = officialSubtotals.find((s) => s.label === '科学技術科計');
    if (!kougyou || !kougyouTani || !kougyouGoukei || !kagakuGijutsu) throw new Error('officialSubtotals の一部が見つかりません');

    // 工業計＋単位制計（工業）＝工業合計（資料内部の整合性）
    expect(kougyou.quota + kougyouTani.quota).toBe(kougyouGoukei.quota);
    expect(kougyou.testTakersConfirmed + kougyouTani.testTakersConfirmed).toBe(kougyouGoukei.testTakersConfirmed);
    expect(kougyou.finalPassers + kougyouTani.finalPassers).toBe(kougyouGoukei.finalPassers);

    const kougyouRecords = records.filter((r) => r.department === '工業科');
    const kougyouTaniRecords = records.filter((r) => r.department === '工業科（単位制）');
    const kagakuGijutsuRecords = records.filter((r) => r.department === '科学技術科');
    expect(kougyouRecords).toHaveLength(15);
    expect(kougyouTaniRecords).toHaveLength(1);
    expect(kagakuGijutsuRecords).toHaveLength(2);

    const kougyouSums = sumStageLedger(kougyouRecords);
    expect(kougyouSums.quota).toBe(kougyou.quota);
    expect(kougyouSums.testTakersConfirmed).toBe(kougyou.testTakersConfirmed);
    expect(kougyouSums.finalPassers).toBe(kougyou.finalPassers);
    expect(kougyouSums.applicantsConfirmed).toBe(kougyou.applicantsConfirmed);

    const kougyouTaniSums = sumStageLedger(kougyouTaniRecords);
    expect(kougyouTaniSums.quota).toBe(kougyouTani.quota);
    expect(kougyouTaniSums.testTakersConfirmed).toBe(kougyouTani.testTakersConfirmed);
    expect(kougyouTaniSums.finalPassers).toBe(kougyouTani.finalPassers);
    expect(kougyouTaniSums.applicantsConfirmed).toBe(kougyouTani.applicantsConfirmed);

    const kagakuGijutsuSums = sumStageLedger(kagakuGijutsuRecords);
    expect(kagakuGijutsuSums.quota).toBe(kagakuGijutsu.quota);
    expect(kagakuGijutsuSums.testTakersConfirmed).toBe(kagakuGijutsu.testTakersConfirmed);
    expect(kagakuGijutsuSums.finalPassers).toBe(kagakuGijutsu.finalPassers);
    expect(kagakuGijutsuSums.applicantsConfirmed).toBe(kagakuGijutsu.applicantsConfirmed);

    const overflowCount = [...kougyouRecords, ...kougyouTaniRecords].filter((r) => r.finalPassers > r.quota).length;
    expect(overflowCount).toBe(1); // 工芸のみ（+6）
  });

  it('「農業に関する学科」5レコード＋「水産に関する学科」1レコード＋「家庭に関する学科（単位制以外）」3レコードの機械集計が資料本文の公式小計（農業計・水産計・家庭計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する（本区分はfinalPassers>quotaが6/9件と普通科系に近い高頻度）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const nougyou = officialSubtotals.find((s) => s.label === '農業計');
    const suisan = officialSubtotals.find((s) => s.label === '水産計');
    const katei = officialSubtotals.find((s) => s.label === '家庭計');
    if (!nougyou || !suisan || !katei) throw new Error('officialSubtotals の一部が見つかりません');

    const nougyouRecords = records.filter((r) => r.department === '農業科');
    const suisanRecords = records.filter((r) => r.department === '水産科');
    const kateiRecords = records.filter((r) => r.department === '家庭科');
    expect(nougyouRecords).toHaveLength(5);
    expect(suisanRecords).toHaveLength(1);
    expect(kateiRecords).toHaveLength(3);

    // 府中の「農業」という学校名の学校が農業科・家庭科の両方に登場する（同一校が複数専門学科を併設）
    expect(nougyouRecords.filter((r) => r.schoolName === '農業')).toHaveLength(1);
    expect(kateiRecords.filter((r) => r.schoolName === '農業')).toHaveLength(1);

    const nougyouSums = sumStageLedger(nougyouRecords);
    expect(nougyouSums.quota).toBe(nougyou.quota);
    expect(nougyouSums.testTakersConfirmed).toBe(nougyou.testTakersConfirmed);
    expect(nougyouSums.finalPassers).toBe(nougyou.finalPassers);
    expect(nougyouSums.applicantsConfirmed).toBe(nougyou.applicantsConfirmed);

    const suisanSums = sumStageLedger(suisanRecords);
    expect(suisanSums.quota).toBe(suisan.quota);
    expect(suisanSums.testTakersConfirmed).toBe(suisan.testTakersConfirmed);
    expect(suisanSums.finalPassers).toBe(suisan.finalPassers);
    expect(suisanSums.applicantsConfirmed).toBe(suisan.applicantsConfirmed);

    const kateiSums = sumStageLedger(kateiRecords);
    expect(kateiSums.quota).toBe(katei.quota);
    expect(kateiSums.testTakersConfirmed).toBe(katei.testTakersConfirmed);
    expect(kateiSums.finalPassers).toBe(katei.finalPassers);
    expect(kateiSums.applicantsConfirmed).toBe(katei.applicantsConfirmed);

    const overflowCount = [...nougyouRecords, ...suisanRecords, ...kateiRecords].filter((r) => r.finalPassers > r.quota).length;
    expect(overflowCount).toBe(6);
  });

  it('「家庭（単位制）」1レコード＋「福祉」2レコード＋「理数」2レコード＋「芸術」1レコード＋「体育」2レコードの機械集計が資料本文の公式小計（単位制計〈家庭〉・家庭合計・福祉計・理数計・芸術計・体育計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する（本区分はfinalPassers>quotaが4/8件）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const kateiTani = officialSubtotals.find((s) => s.label === '単位制計（家庭）');
    const kateiGoukei = officialSubtotals.find((s) => s.label === '家庭合計');
    const fukushi = officialSubtotals.find((s) => s.label === '福祉計');
    const risuu = officialSubtotals.find((s) => s.label === '理数計');
    const geijutsu = officialSubtotals.find((s) => s.label === '芸術計');
    const taiiku = officialSubtotals.find((s) => s.label === '体育計');
    const kateiIjai = officialSubtotals.find((s) => s.label === '家庭計');
    if (!kateiTani || !kateiGoukei || !fukushi || !risuu || !geijutsu || !taiiku || !kateiIjai) {
      throw new Error('officialSubtotals の一部が見つかりません');
    }

    // 家庭計（単位制以外）＋単位制計（家庭）＝家庭合計（資料内部の整合性）
    expect(kateiIjai.quota + kateiTani.quota).toBe(kateiGoukei.quota);
    expect(kateiIjai.testTakersConfirmed + kateiTani.testTakersConfirmed).toBe(kateiGoukei.testTakersConfirmed);
    expect(kateiIjai.finalPassers + kateiTani.finalPassers).toBe(kateiGoukei.finalPassers);

    const kateiTaniRecords = records.filter((r) => r.department === '家庭科（単位制）');
    const fukushiRecords = records.filter((r) => r.department === '福祉科');
    const risuuRecords = records.filter((r) => r.department === '理数科');
    const geijutsuRecords = records.filter((r) => r.department === '芸術科');
    const taiikuRecords = records.filter((r) => r.department === '体育科');
    expect(kateiTaniRecords).toHaveLength(1);
    expect(fukushiRecords).toHaveLength(2);
    expect(risuuRecords).toHaveLength(2);
    expect(geijutsuRecords).toHaveLength(1);
    expect(taiikuRecords).toHaveLength(2);

    const kateiTaniSums = sumStageLedger(kateiTaniRecords);
    expect(kateiTaniSums.quota).toBe(kateiTani.quota);
    expect(kateiTaniSums.testTakersConfirmed).toBe(kateiTani.testTakersConfirmed);
    expect(kateiTaniSums.finalPassers).toBe(kateiTani.finalPassers);
    expect(kateiTaniSums.applicantsConfirmed).toBe(kateiTani.applicantsConfirmed);

    const fukushiSums = sumStageLedger(fukushiRecords);
    expect(fukushiSums.quota).toBe(fukushi.quota);
    expect(fukushiSums.testTakersConfirmed).toBe(fukushi.testTakersConfirmed);
    expect(fukushiSums.finalPassers).toBe(fukushi.finalPassers);
    expect(fukushiSums.applicantsConfirmed).toBe(fukushi.applicantsConfirmed);

    const risuuSums = sumStageLedger(risuuRecords);
    expect(risuuSums.quota).toBe(risuu.quota);
    expect(risuuSums.testTakersConfirmed).toBe(risuu.testTakersConfirmed);
    expect(risuuSums.finalPassers).toBe(risuu.finalPassers);
    expect(risuuSums.applicantsConfirmed).toBe(risuu.applicantsConfirmed);

    const geijutsuSums = sumStageLedger(geijutsuRecords);
    expect(geijutsuSums.quota).toBe(geijutsu.quota);
    expect(geijutsuSums.testTakersConfirmed).toBe(geijutsu.testTakersConfirmed);
    expect(geijutsuSums.finalPassers).toBe(geijutsu.finalPassers);
    expect(geijutsuSums.applicantsConfirmed).toBe(geijutsu.applicantsConfirmed);

    const taiikuSums = sumStageLedger(taiikuRecords);
    expect(taiikuSums.quota).toBe(taiiku.quota);
    expect(taiikuSums.testTakersConfirmed).toBe(taiiku.testTakersConfirmed);
    expect(taiikuSums.finalPassers).toBe(taiiku.finalPassers);
    expect(taiikuSums.applicantsConfirmed).toBe(taiiku.applicantsConfirmed);

    const overflowCount = [...kateiTaniRecords, ...fukushiRecords, ...risuuRecords, ...geijutsuRecords, ...taiikuRecords].filter(
      (r) => r.finalPassers > r.quota
    ).length;
    expect(overflowCount).toBe(4);
  });

  it('「併合科」3レコード＋「産業科」2レコード＋「総合学科」10レコードの機械集計が資料本文の公式小計（併合科計・産業科計・総合学科計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する（本区分はfinalPassers>quotaが8/15件）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const heigou = officialSubtotals.find((s) => s.label === '併合科計');
    const sangyou = officialSubtotals.find((s) => s.label === '産業科計');
    const sougou = officialSubtotals.find((s) => s.label === '総合学科計');
    if (!heigou || !sangyou || !sougou) throw new Error('officialSubtotals の一部が見つかりません');

    const heigouRecords = records.filter((r) => r.department.startsWith('併合科'));
    const sangyouRecords = records.filter((r) => r.department === '産業科');
    const sougouRecords = records.filter((r) => r.department === '総合学科');
    expect(heigouRecords).toHaveLength(3);
    expect(sangyouRecords).toHaveLength(2);
    expect(sougouRecords).toHaveLength(10);

    const heigouSums = sumStageLedger(heigouRecords);
    expect(heigouSums.quota).toBe(heigou.quota);
    expect(heigouSums.testTakersConfirmed).toBe(heigou.testTakersConfirmed);
    expect(heigouSums.finalPassers).toBe(heigou.finalPassers);
    expect(heigouSums.applicantsConfirmed).toBe(heigou.applicantsConfirmed);

    const sangyouSums = sumStageLedger(sangyouRecords);
    expect(sangyouSums.quota).toBe(sangyou.quota);
    expect(sangyouSums.testTakersConfirmed).toBe(sangyou.testTakersConfirmed);
    expect(sangyouSums.finalPassers).toBe(sangyou.finalPassers);
    expect(sangyouSums.applicantsConfirmed).toBe(sangyou.applicantsConfirmed);

    const sougouSums = sumStageLedger(sougouRecords);
    expect(sougouSums.quota).toBe(sougou.quota);
    expect(sougouSums.testTakersConfirmed).toBe(sougou.testTakersConfirmed);
    expect(sougouSums.finalPassers).toBe(sougou.finalPassers);
    expect(sougouSums.applicantsConfirmed).toBe(sougou.applicantsConfirmed);

    const overflowCount = [...heigouRecords, ...sangyouRecords, ...sougouRecords].filter((r) => r.finalPassers > r.quota).length;
    expect(overflowCount).toBe(8);
  });

  it('「国際関係に関する学科」（目黒・国際）はquota不一致のため段階台帳に含まれない', () => {
    const kokusai = records.filter((r) => r.schoolName === '国際' && r.department === '国際科');
    expect(kokusai).toHaveLength(0);
  });

  it('「定時制課程（単位制）」7レコードの機械集計が資料本文の公式小計（定時制課程単位制計）とquota/testTakersConfirmed/finalPassers/applicantsConfirmedの4系列とも完全一致する（本区分はfinalPassers>quotaが新宿山吹・情報科2・4部の1件のみ）', () => {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const teijiSubtotal = officialSubtotals.find((s) => s.label === '定時制課程単位制計');
    if (!teijiSubtotal) throw new Error('officialSubtotals に「定時制課程単位制計」が見つかりません');

    const teijiRecords = records.filter(
      (r) =>
        (r.schoolName === '一橋' && r.department === '普通科') ||
        (r.schoolName === '新宿山吹' && (r.department === '普通科1〜4部' || r.department === '情報科2・4部')) ||
        (r.schoolName === '浅草' && r.department === '普通科') ||
        (r.schoolName === '荻窪' && r.department === '普通科') ||
        (r.schoolName === '八王子拓真' && r.department === '普通科') ||
        (r.schoolName === '砂川' && r.department === '普通科1〜3部')
    );
    expect(teijiRecords).toHaveLength(7);

    const teijiSums = sumStageLedger(teijiRecords);
    expect(teijiSums.quota).toBe(teijiSubtotal.quota);
    expect(teijiSums.testTakersConfirmed).toBe(teijiSubtotal.testTakersConfirmed);
    expect(teijiSums.finalPassers).toBe(teijiSubtotal.finalPassers);
    expect(teijiSums.applicantsConfirmed).toBe(teijiSubtotal.applicantsConfirmed);

    const overflowCount = teijiRecords.filter((r) => r.finalPassers > r.quota).length;
    expect(overflowCount).toBe(1);
    const overflowRecord = teijiRecords.find((r) => r.finalPassers > r.quota);
    expect(overflowRecord?.schoolName).toBe('新宿山吹');
    expect(overflowRecord?.department).toBe('情報科2・4部');
  });
});
