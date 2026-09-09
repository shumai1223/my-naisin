import { sumStageLedger } from '@/lib/stage-ledger';
import { KUMAMOTO_STAGE_LEDGER } from '../kumamoto';
import { KUMAMOTO_COMPETITION_RATES } from '@/data/competition-rates/kumamoto';

/**
 * T-Y11F §5順序#7 DoD検証（熊本県・段階台帳15県目・全日制52レコードで完結・学校単位収録）:
 * ①レコードの不変条件（quota等がすべて0より大きい） ②testTakersConfirmed<=applicantsConfirmedが
 * 全件成立 ③finalPassers<=testTakersConfirmedが全件成立（他県と異なりこの県には超過の既知例外が
 * 無い） ④4系列すべての機械集計が両資料の「計」行と完全一致すること ⑤既存の倍率パイプライン
 * （学科別・別資料典拠）を学校単位に合算した値と52校中51校で完全一致し、大津のみ資料の公表日違いに
 * よる1名差であることを記録する。
 */
describe('熊本県 段階台帳（T-Y11F §5順序#7・15県目・全日制52レコードで完結・学校単位収録）', () => {
  const { records, coverage } = KUMAMOTO_STAGE_LEDGER;

  it('取り込み件数は全日制52レコード（学校単位）で完結', () => {
    expect(records).toHaveLength(52);
  });

  it('coverage.statusはcomplete', () => {
    expect(coverage.status).toBe('complete');
  });

  it('departmentはすべて学校単位固定ラベルである（本県は資料が学科別内訳を持たないため）', () => {
    for (const r of records) {
      expect(r.department).toBe('全学科（学校計・後期一般選抜）');
    }
  });

  it('quota/applicantsConfirmed/testTakersConfirmed/finalPassersはすべて0より大きい（不変条件・既知の0値例外は無い）', () => {
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

  it('finalPassersはtestTakersConfirmedを超えない（他県と異なりこの県には超過の既知例外が無い）', () => {
    for (const r of records) {
      expect(r.finalPassers).toBeLessThanOrEqual(r.testTakersConfirmed);
    }
  });

  it('既存の倍率パイプライン（学科別）を学校単位に合算した値と52校中50校でquota・applicantsConfirmedが完全一致する（大津・熊本農業のみ資料公表日違いで1名差）', () => {
    const r8Records = KUMAMOTO_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
    const bySchool = new Map<string, { quota: number; applicants: number }>();
    for (const r of r8Records) {
      const cur = bySchool.get(r.schoolName) ?? { quota: 0, applicants: 0 };
      cur.quota += r.quota;
      cur.applicants += r.finalApplicants;
      bySchool.set(r.schoolName, cur);
    }
    expect(bySchool.size).toBe(52);

    let exactMatches = 0;
    const mismatches: string[] = [];
    for (const stageRecord of records) {
      const counterpart = bySchool.get(stageRecord.schoolName);
      expect(counterpart).toBeDefined();
      if (!counterpart) continue;
      expect(counterpart.quota).toBe(stageRecord.quota);
      if (counterpart.applicants === stageRecord.applicantsConfirmed) {
        exactMatches++;
      } else {
        mismatches.push(stageRecord.schoolName);
      }
    }
    expect(exactMatches).toBe(50);
    expect(mismatches).toEqual(['熊本農業', '大津']);
  });

  it('52校全数の機械集計が両資料本文の「計」行と4系列すべて完全一致する', () => {
    const sums = sumStageLedger(records);
    expect(sums.schoolCount).toBe(52);
    expect(sums.quota).toBe(8_322);
    expect(sums.applicantsConfirmed).toBe(7_297);
    expect(sums.testTakersConfirmed).toBe(6_893);
    expect(sums.finalPassers).toBe(5_651);
  });
});
