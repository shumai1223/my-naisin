import { sumStageLedger } from '@/lib/stage-ledger';
import { CHIBA_STAGE_LEDGER } from '../chiba';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';

/**
 * T-Y11F §5順序#7 DoD検証（千葉県・段階台帳・R8は資料全体210レコード完全収録・R7は
 * 掛-1・1〜2頁目70レコード）:
 * ①レコードの不変条件（quota>0等）②既存の倍率パイプライン（competition-rates/chiba.ts）の
 * quota/finalApplicantsと、段階台帳のquota/applicantsConfirmedが独立した情報源にも
 * かかわらず一致することを機械的に突合する（相互裏取り・R7/R8とも）③R8公表資料の
 * 「県立全日制 合計」「市立全日制 合計」「県立定時制 合計」「総合計」の4段階すべてとの
 * 完全突合（DoDの本体）。
 */
describe('千葉県 段階台帳（T-Y11F §5順序#7・R8は資料全体完全収録・R7は掛-1）', () => {
  const { records, officialSubtotals } = CHIBA_STAGE_LEDGER;
  const r8Records = records.filter((r) => r.fiscalYear === undefined);
  const r7Records = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');

  it('取り込み件数はR8=210レコード・R7=70レコード（計280レコード）', () => {
    expect(r8Records).toHaveLength(210);
    expect(r7Records).toHaveLength(70);
    expect(records).toHaveLength(280);
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはいずれも0より大きい（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.applicantsConfirmed).toBeGreaterThan(0);
      expect(r.testTakersConfirmed).toBeGreaterThan(0);
      expect(r.finalPassers).toBeGreaterThan(0);
    }
  });

  it('finalPassersがquotaを超えるのは既知の1件（千葉R7・合格ボーダー同点者の全員合格と推測）のみ', () => {
    // R8では全210レコードでfinalPassers<=quotaが厳密に成立していたが、R7データを追加した
    // ところ「千葉 普通科」（quota240・finalPassers241）で1名だけ超過することが判明した
    // （saitamaの上尾と同型の現象）。全県共通の不変条件ではないと確定したため、既知の1件を
    // 明示的な例外として許容しつつ、それ以外に新たな超過が紛れ込んだら検知できるようにする。
    const KNOWN_OVERFLOW = new Set(['千葉|普通科|令和7年度（2025年度）']);
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (KNOWN_OVERFLOW.has(key)) {
        expect(r.finalPassers).toBe(r.quota + 1);
        continue;
      }
      expect(r.finalPassers).toBeLessThanOrEqual(r.quota);
    }
  });

  function findSubtotal(label: string) {
    if (!officialSubtotals) throw new Error('officialSubtotals が定義されていません');
    const subtotal = officialSubtotals.find((s) => s.label === label);
    if (!subtotal) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return subtotal;
  }

  it('R8: 県立全日制176レコードが「県立全日制 合計」と完全一致する', () => {
    const subtotal = findSubtotal('県立全日制 合計');
    const prefecturalFullTime = r8Records.filter(
      (r) => !r.schoolName.startsWith('市立') && !r.department.includes('定時制')
    );
    expect(prefecturalFullTime).toHaveLength(176);
    const sums = sumStageLedger(prefecturalFullTime);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('R8: 市立全日制12レコードが「市立全日制 合計」と完全一致する', () => {
    const subtotal = findSubtotal('市立全日制 合計');
    const municipal = r8Records.filter((r) => r.schoolName.startsWith('市立'));
    expect(municipal).toHaveLength(12);
    const sums = sumStageLedger(municipal);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('R8: 県立定時制22レコードが「県立定時制 合計」と完全一致する', () => {
    const subtotal = findSubtotal('県立定時制 合計');
    const teiji = r8Records.filter((r) => r.department.includes('定時制'));
    expect(teiji).toHaveLength(22);
    const sums = sumStageLedger(teiji);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('R8: 210レコード全数の機械集計が「総合計」と完全一致する', () => {
    const subtotal = findSubtotal('総合計');
    const sums = sumStageLedger(r8Records);
    expect(sums.schoolCount).toBe(210);
    expect(sums.quota).toBe(subtotal.quota);
    expect(sums.applicantsConfirmed).toBe(subtotal.applicantsConfirmed);
    expect(sums.testTakersConfirmed).toBe(subtotal.testTakersConfirmed);
    expect(sums.finalPassers).toBe(subtotal.finalPassers);
  });

  it('既存の倍率パイプライン（competition-rates/chiba.ts）とquota/applicantsConfirmedがR8・R7とも独立に一致する（全日制のみ・定時制は対象外）', () => {
    const chibaCompetitionFile = COMPETITION_RATE_BY_PREFECTURE.chiba;
    if (!chibaCompetitionFile) throw new Error('competition-rates/chiba.ts が見つかりません');

    function crossCheck(stageSubset: typeof records, compFilter: (r: { fiscalYear?: string }) => boolean, minMatched: number) {
      const compRecords = chibaCompetitionFile!.records.filter(compFilter);
      const fullTimeStage = stageSubset.filter((r) => !r.department.includes('定時制'));
      let matched = 0;
      for (const stageRecord of fullTimeStage) {
        const counterpart = compRecords.find(
          (r) => r.schoolName === stageRecord.schoolName && r.department === stageRecord.department
        );
        if (!counterpart) continue;
        matched++;
        expect(counterpart.quota).toBe(stageRecord.quota);
        expect(counterpart.finalApplicants).toBe(stageRecord.applicantsConfirmed);
      }
      expect(matched).toBeGreaterThanOrEqual(minMatched);
    }

    crossCheck(r8Records, (r) => r.fiscalYear === undefined, 160);
    crossCheck(r7Records, (r) => r.fiscalYear === '令和7年度（2025年度）', 70);
  });
});
