import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { HYOGO_COMPETITION_RATES } from '../hyogo';

/**
 * Y-2/Y-6 DoD検証（兵庫県・Y-6先行着手1県目）。
 *
 * 兵庫県は全日制127校（PDF2〜5ページ目）を完全収録した（190レコード）。機械集計
 * （quota21,150・applicants20,567・倍率0.97）はPDF5ページ目末尾のグランドトータル
 * （全日制127校計）と完全に一致する。学校単位の「計」行が個別にはPDF上に存在しないため、
 * 学校単位のofficialSubtotalsによる突合は行わず、レコード単体の整合性
 * （quota>0・finalApplicants>=0・finalRate概算一致）と学校名+学科名の重複が無いことに加え、
 * 全体のグランドトータル突合のみを検証する。「農業」はPDF記載どおりの学校名（兵庫県立
 * 農業高等学校の通称表記・WebSearchで実在確認済み）。定時制（6〜10ページ目）は東京都・
 * 神奈川県・千葉県・埼玉県・福岡県と同じ理由で意図的にスコープ外。
 */
describe('兵庫県 倍率パイプラインα（Y-6・全日制127校190レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = HYOGO_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計がPDF末尾のグランドトータル（127校・quota21,150・applicants20,567・倍率0.97）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制127校計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
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
    expect(HYOGO_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('190レコード・127校が収録されている（PDF2〜5ページ目・東灘〜浜坂＝全日制全校）', () => {
    expect(r8.length).toBe(190);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(127);
  });

  it('学科横断の専門学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      兵庫工業: 7,
      洲本実業: 2,
      市科学技術: 4,
      氷上: 3,
      尼崎工業: 4,
      篠山産業: 4,
      市尼崎双星: 4,
      市伊丹: 2,
      有馬: 2,
      農業: 7,
      播磨農業: 3,
      東播工業: 4,
      西脇工業: 4,
      小野工業: 3,
      松陽: 3,
      上郡: 3,
      佐用: 3,
      山崎: 2,
      飾磨工業: 3,
      姫路工業: 5,
      相生産業: 3,
      龍野北: 3,
      香住: 2,
      豊岡総合: 3,
      但馬農業: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが192件収録され、129校・全日制計(quota21,252・applicants21,596)と完全一致する。姫路市立3校(市姫路・市琴丘・市飾磨)がR8で統合し「姫路市立」1校になった実在の学校再編を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(192);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(21252);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(21596);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(129);

    expect(r7.some((r) => r.schoolName === '市姫路')).toBe(true);
    expect(r7.some((r) => r.schoolName === '市琴丘')).toBe(true);
    expect(r7.some((r) => r.schoolName === '市飾磨')).toBe(true);
    expect(r8.some((r) => r.schoolName === '姫路市立')).toBe(true);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of HYOGO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www2\.hyogo-c\.ed\.jp\//);
    }
  });
});
