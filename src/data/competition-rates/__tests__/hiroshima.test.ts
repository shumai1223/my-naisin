import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { HIROSHIMA_COMPETITION_RATES } from '../hiroshima';

/**
 * Y-6 DoD検証（広島県・3県目）。
 *
 * 広島県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が正確に機能した
 * （OCR誤読リスクなし）。全日制本校（84校142学科・コース）＋分校（1校1学科）を完全収録し、
 * 機械集計（quota14,703・applicants13,759・倍率0.94）が公式資料の小計合算と完全一致する。
 * くくり募集5組（呉工業2組・福山工業1組・宮島工業2組）は学科名を連結した単一レコードとして
 * 記録したため、レコード数（138）はPDF記載の学科・コース数（143）より少ない。定時制・
 * フレキシブル課程は東京都・神奈川県・千葉県・埼玉県・福岡県・兵庫県・静岡県と同じ理由で
 * 意図的にスコープ外。
 */
describe('広島県 倍率パイプラインα（Y-6・全日制85校138レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = HIROSHIMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計がPDF末尾のグランドトータル（全日制本校＋分校・quota14,703・applicants13,759・倍率0.94）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制（本校＋分校）')!;
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

  it('coverageがcompleteを示している（定時制・フレキシブル課程のみ意図的にスコープ外）', () => {
    expect(HIROSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('138レコード・85校が収録されている（全日制本校84校＋分校1校）', () => {
    expect(r8.length).toBe(138);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(85);
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      広島国泰寺: 2,
      広島市立基町: 2,
      広島市立舟入: 2,
      広島皆実: 3,
      広島工業: 5,
      広島市立広島工業: 6,
      祇園北: 2,
      広島市立沼田: 2,
      呉工業: 2,
      竹原: 2,
      総合技術: 6,
      尾道東: 2,
      沼南: 2,
      大門: 2,
      神辺旭: 2,
      福山工業: 5,
      府中東: 3,
      庄原格致: 2,
      庄原実業: 4,
      黒瀬: 2,
      西条農業: 7,
      宮島工業: 4,
      吉田: 2,
      安芸府中: 2,
      海田: 2,
      世羅: 3,
      油木: 2,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('くくり募集（複数学科が定員を共有）が連結名の単一レコードとして収録されている', () => {
    const kukuriNames = [
      '機械・材料工学',
      '電気・電子機械',
      '工業化学・染織システム',
      '電気・情報技術',
      '建築・インテリア',
    ];
    for (const dept of kukuriNames) {
      const matches = r8.filter((r) => r.department === dept);
      expect(matches.length).toBe(1);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが138件収録され、全日制計(quota14,701・applicants14,438)と完全一致する。学校名・学科名のキー集合はR8と完全一致し、統廃合・学科再編は無かった', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(138);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(14701);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(14438);

    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys).toEqual(r8Keys);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(85);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが138件・85校収録され、全日制計(quota14,693・applicants14,762・倍率1.00)と完全一致する。学校名・学科名のキー集合はR7とほぼ完全一致し、差分は広島市立美鈴が丘の学科改称(R6「普通」→R7「グローカル探究」)の1件のみだった', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r6.length).toBe(138);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(14693);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(14762);

    const distinctSchools6 = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools6.size).toBe(85);

    const misuzugaokaR6 = r6.find((r) => r.schoolName === '広島市立美鈴が丘');
    expect(misuzugaokaR6?.department).toBe('普通');
    const misuzugaokaR7 = r7.find((r) => r.schoolName === '広島市立美鈴が丘');
    expect(misuzugaokaR7?.department).toBe('グローカル探究');
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが138件・85校収録され、全日制計(quota14,898・applicants14,974・倍率1.00)と完全一致する。学校名・学科名のキー集合はR6と完全一致し、統廃合・学科再編は無かった(広島市立美鈴が丘はR5時点でも「普通」のまま)', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r5.length).toBe(138);
    expect(r5.reduce((a, r) => a + r.quota, 0)).toBe(14898);
    expect(r5.reduce((a, r) => a + r.finalApplicants, 0)).toBe(14974);

    const distinctSchools5 = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools5.size).toBe(85);

    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r5Keys).toEqual(r6Keys);

    const misuzugaokaR5 = r5.find((r) => r.schoolName === '広島市立美鈴が丘');
    expect(misuzugaokaR5?.department).toBe('普通');
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of HIROSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.hiroshima\.lg\.jp\//);
    }
  });
});
