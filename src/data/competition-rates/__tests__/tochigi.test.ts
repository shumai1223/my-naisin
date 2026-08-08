import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOCHIGI_COMPETITION_RATES } from '../tochigi';

/**
 * Y-6 DoD検証（栃木県・8県目・全日制完全達成）。
 *
 * 一次ソースは「出願変更状況」PDF（2/25変更後確定値）。出願倍率＝出願人員／一般選抜定員という
 * PDF自身の定義式が、他県で採用している競争率(志願倍率)の定義と一致することを確認済み。
 */
describe('栃木県 倍率パイプラインα（Y-6・全日制57校107レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = TOCHIGI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計がPDF末尾の合計行（quota7,259・applicants7,602・倍率1.05）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名+年度の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(TOCHIGI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('107レコード・57校が収録されている（一般選抜非実施の宇都宮東は対象外）', () => {
    expect(r8.length).toBe(107);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(57);
    expect(r8.some((r) => r.schoolName === '宇都宮東')).toBe(false);
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      宇都宮中央: 2,
      宇都宮白楊: 7,
      宇都宮工業: 4,
      宇都宮商業: 2,
      鹿沼南: 3,
      鹿沼商工: 2,
      今市工業: 3,
      小山: 2,
      小山南: 2,
      小山北桜: 4,
      栃木農業: 2,
      栃木工業: 3,
      栃木商業: 2,
      佐野松桜: 4,
      足利工業: 3,
      足利清風: 2,
      真岡北陵: 5,
      真岡工業: 3,
      馬頭: 2,
      那須拓陽: 5,
      那須清峰: 4,
      那須: 2,
      矢板: 4,
      高根沢: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが112件収録され、公式「計」行7,486/8,330と完全一致する。宇都宮東はR7では一般選抜定員7で1レコード存在するがR8では非実施のため対象外(学校の状況が年度で変化)。栃木農業/真岡工業/矢板の3校はR7→R8で学科が統合されているため学科数が異なる(実際の学科再編と判断・誤読ではない)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(112);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(58);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(7486);
    expect(sumApplicants).toBe(8330);

    expect(r7.filter((r) => r.schoolName === '宇都宮東')).toHaveLength(1);
    expect(r7.filter((r) => r.schoolName === '栃木農業')).toHaveLength(4);
    expect(r7.filter((r) => r.schoolName === '真岡工業')).toHaveLength(4);
    expect(r7.filter((r) => r.schoolName === '矢板')).toHaveLength(5);

    // 上記4校を除けば学校名+学科名の組み合わせはR8と完全一致する(学校再編なし)
    const reorganizedSchools = new Set(['宇都宮東', '栃木農業', '真岡工業', '矢板']);
    const r8Keys = new Set(r8.filter((r) => !reorganizedSchools.has(r.schoolName)).map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.filter((r) => !reorganizedSchools.has(r.schoolName)).map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度・3年度目): 令和6年度(R6)分レコードが113件収録され、公式「合計」行7,679/8,471と完全一致する。栃木農業/真岡工業/矢板はR6でもR7と同じ学科数(4/4/5)で収録され、宇都宮東は一般選抜定員0でR8と同型(R7のみ定員7の例外年)であることを確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(113);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(57);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(7679);
    expect(sumApplicants).toBe(8471);

    expect(r6.some((r) => r.schoolName === '宇都宮東')).toBe(false);
    expect(r6.filter((r) => r.schoolName === '栃木農業')).toHaveLength(4);
    expect(r6.filter((r) => r.schoolName === '真岡工業')).toHaveLength(4);
    expect(r6.filter((r) => r.schoolName === '矢板')).toHaveLength(5);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of TOCHIGI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.tochigi\.lg\.jp\//);
    }
  });
});
