import { sumStageLedger } from '@/lib/stage-ledger';
import { TOKYO_STAGE_LEDGER } from '../tokyo';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（東京都・段階台帳7県目・「普通科（コース・単位制以外）」107レコード＋
 * 「普通科（コース制）」4レコード＋「普通科（単位制）」12レコード＝計123レコード）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/tokyo.ts）の
 * quota・applicantsConfirmedと段階台帳が全件完全一致すること（本資料には志願者数列が存在
 * しないため両方とも既存パイプラインを再利用する設計）③finalPassers>quotaが東京都では
 * 極めて高頻度（推薦選抜の未消化枠繰り上げが原因と推測）のため他県のような個別例外列挙はせず、
 * 代わりにfinalPassers<=applicantsConfirmedの逆側の不変条件のみ検証する④公式小計（区部計・
 * 多摩部計・コース単位制以外計・島しょ計・コース制計・単位制計）との完全一致。
 */
describe('東京都 段階台帳（T-Y11F §5順序#7・7県目・「普通科」系123レコード）', () => {
  const { records, officialSubtotals } = TOKYO_STAGE_LEDGER;

  it('取り込み件数は区部57校＋多摩部44校＋島しょ6校＋コース制4校＋単位制12校＝計123レコード', () => {
    expect(records).toHaveLength(123);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('quota・applicantsConfirmedは既存の倍率パイプライン（competition-rates/tokyo.ts）と全件完全一致する（本資料に志願者数列が無いため両方とも再利用）', () => {
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
    expect(matched).toBe(123);
  });

  it('finalPassersはapplicantsConfirmedを超えない（東京都でもこのパターンの逆転は0件）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.applicantsConfirmed);
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

    // 区部57校・多摩部44校の境界は資料の掲載順（区部計行の直前まで）で区切る
    const futsuuIjai = records.filter((r) => r.department === '普通科');
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
});
