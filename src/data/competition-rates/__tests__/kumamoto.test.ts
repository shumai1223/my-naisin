import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KUMAMOTO_COMPETITION_RATES } from '../kumamoto';

/**
 * Y-6 DoD検証（熊本県・4県目）。
 *
 * 熊本県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した。学校集計行
 * （学科別内訳の合計）と学科別内訳行が両方PDF上に存在するため、学科別内訳行のみを採用し学校
 * 集計行は二重計上を避けるため除外した。くくり募集3組（矢部・大津・上天草）は学科名を連結した
 * 単一レコードとして記録。機械集計（quota8,322・applicants7,295・倍率0.88）が公式資料巻末の
 * 「計」行と完全一致する。定時制課程・前期（特色）選抜は他県と同じ理由で意図的にスコープ外。
 */
describe('熊本県 倍率パイプラインα（Y-6・全日制52校162レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KUMAMOTO_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計がPDF末尾のグランドトータル（後期・一般選抜計・quota8,322・applicants7,295・倍率0.88）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制（後期・一般選抜）計')!;
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

  it('coverageがcompleteを示している（定時制課程・前期選抜のみ意図的にスコープ外）', () => {
    expect(KUMAMOTO_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('162レコード・52校が収録されている', () => {
    expect(r8.length).toBe(162);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(52);
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      第一: 2,
      第二: 3,
      熊本西: 3,
      熊本北: 3,
      東稜: 3,
      湧心館: 2,
      熊本商業: 4,
      熊本工業: 10,
      熊本農業: 7,
      松橋: 3,
      小川工業: 5,
      御船: 3,
      甲佐: 3,
      矢部: 3,
      岱志: 4,
      玉名工業: 5,
      北稜: 4,
      鹿本: 3,
      鹿本商工: 4,
      鹿本農業: 3,
      菊池: 3,
      菊池農業: 5,
      阿蘇中央: 6,
      大津: 3,
      高森: 2,
      八代東: 3,
      八代工業: 5,
      八代農業: 3,
      球磨工業: 5,
      水俣: 5,
      天草工業: 4,
      天草拓心: 8,
      上天草: 3,
      芦北: 3,
      球磨中央: 3,
      南稜: 5,
      必由館: 3,
      千原台: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('くくり募集（複数学科が募集人員を共有）が連結名の単一レコードとして収録されている', () => {
    const kukuriNames = ['食農科学(農業科学コース)・(食・生活コース)', '普通・理数', '普通・(グローカル文理コース)'];
    for (const dept of kukuriNames) {
      const matches = r8.filter((r) => r.department === dept);
      expect(matches.length).toBe(1);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが162件収録され、全日制「計」行(quota8,258・applicants7,594・倍率0.92)と完全一致する。学校名・学科名のキー集合はR8と完全一致(統廃合・学科再編なし)・くくり募集3組(矢部・大津・上天草)もR8と同一パターンで存在する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(162);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(8258);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(7594);

    const r7Schools = new Set(r7.map((r) => r.schoolName));
    const r8Schools = new Set(r8.map((r) => r.schoolName));
    expect(r7Schools.size).toBe(52);
    expect([...r7Schools].every((s) => r8Schools.has(s))).toBe(true);

    const kukuriNames = ['食農科学(農業科学コース)・(食・生活コース)', '普通・理数', '普通・(グローカル文理コース)'];
    for (const dept of kukuriNames) {
      expect(r7.filter((r) => r.department === dept).length).toBe(1);
    }
  });

  it('掛-1(学校別×多年度・3年度目): 令和6年度(R6)分レコードが161件・52校収録され、全日制「計」行(quota8,250・applicants7,760・倍率0.94)と完全一致する。くくり募集3組(矢部・大津・上天草)もR7/R8と同一パターンで存在する。水俣高校のみ実在の学科改編を確認: R6は「電気建築システム」1学科(電気コース/建築コースの2コース制)だったが、R7/R8では「半導体情報」「建築」という2つの独立学科に分割されている', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(161);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(52);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(8250);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(7760);

    const kukuriNames = ['食農科学(農業科学コース)・(食・生活コース)', '普通・理数', '普通・(グローカル文理コース)'];
    for (const dept of kukuriNames) {
      expect(r6.filter((r) => r.department === dept).length).toBe(1);
    }

    const mizumata = r6.filter((r) => r.schoolName === '水俣');
    expect(mizumata.map((r) => r.department)).toEqual(
      expect.arrayContaining(['電気建築システム(電気コース)', '電気建築システム(建築コース)']),
    );
    expect(r6.some((r) => r.schoolName === '水俣' && r.department === '半導体情報')).toBe(false);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KUMAMOTO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kumamoto\.jp\//);
    }
  });
});
