import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { MIYAGI_COMPETITION_RATES } from '../miyagi';

/**
 * Y-6 DoD検証（宮城県・5県目）。
 *
 * 宮城県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した。表には学校別
 * 行の他に「○○地区計」「○○地区合計」という2階層の地区別小計行が多数挟まっており、全角スペース
 * 区切りの地区名を検出する正規表現で除外している（除外漏れがあると集計が水増しされるため回帰的に
 * 重要）。機械集計（quota13,400・applicants12,516・倍率0.93）がPDF末尾の「全日制合計」行と完全
 * 一致し、学校数・学科数もPDF冒頭の概要（68校129学科）と完全一致する。定時制課程は他県と同じ
 * 理由でスコープ外。
 */
describe('宮城県 倍率パイプラインα（Y-6・全日制68校129レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = MIYAGI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計がPDF末尾のグランドトータル（全日制合計・quota13,400・applicants12,516・倍率0.93）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制合計')!;
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

  it('coverageがcompleteを示している（定時制課程のみ意図的にスコープ外）', () => {
    expect(MIYAGI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('129レコード・68校が収録されている（PDF冒頭の概要と一致）', () => {
    expect(r8.length).toBe(129);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが130件収録され、公式「全日制合計」13,440/13,349と完全一致する。岩ヶ崎のみR7では文系教養/理系教養の2コースだったがR8で普通科1レコードに統合(quota計80は不変・誤読ではなく実際のコース統合)のためこの1校を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(130);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(13440);
    expect(sumApplicants).toBe(13349);

    expect(r7.filter((r) => r.schoolName === '岩ヶ崎')).toHaveLength(2);
    expect(r8.filter((r) => r.schoolName === '岩ヶ崎')).toHaveLength(1);
    const r8Keys = new Set(r8.filter((r) => r.schoolName !== '岩ヶ崎').map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.filter((r) => r.schoolName !== '岩ヶ崎').map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('複数学科校が正しく収録されている', () => {
    const multiDeptSchools: Record<string, number> = {
      白石: 2,
      白石工: 5,
      大河原産業: 3,
      柴田: 2,
      名取: 2,
      亘理: 3,
      宮城農: 4,
      仙台向山: 2,
      仙台東: 2,
      宮城工: 6,
      仙台工: 5,
      仙台三: 2,
      宮城一: 2,
      泉: 2,
      宮城野: 2,
      塩釜: 2,
      多賀城: 2,
      松島: 2,
      利府: 2,
      黒川: 4,
      松山: 2,
      加美農: 3,
      古川工: 5,
      小牛田農林: 3,
      南郷: 2,
      登米総合産業: 6,
      宮城水産: 3,
      石巻工: 5,
      桜坂: 2,
      南三陸: 2,
      気仙沼向洋: 3,
    };
    for (const [name, count] of Object.entries(multiDeptSchools)) {
      const schoolRecords = r8.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('掛-1(学校別×多年度・3年度目): 令和6年度(R6)分レコードが128件・68校収録され、総括表(quota13,640・applicants13,609・倍率1.00)と完全一致する。仙台工はR6時点で建築科/機械科/電気科/土木科の4学科構成(情報科が無い)で収録されており、R7以降の「情報科新設」がR6→R7間の実際の学科新設であることを確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(128);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(13640);
    expect(sumApplicants).toBe(13609);

    const sendaikou = r6.filter((r) => r.schoolName === '仙台工');
    expect(sendaikou).toHaveLength(4);
    expect(sendaikou.some((r) => r.department === '情報科')).toBe(false);
    expect(r6.filter((r) => r.schoolName === '宮城水産')).toHaveLength(1);
  });

  it('掛-1(学校別×多年度・4年度目): 令和5年度(R5)分レコードが130件・68校収録され、総括表(quota13,760・applicants14,095・倍率1.02)と完全一致する。仙台工はR5時点でもR6と同じ建築科/機械科/電気科/土木科の4学科構成、宮城水産も海洋総合科1学科構成(分割前)で、亘理のみR5では普通科・普通コース/普通科・園芸コース/食品化学科/商業科/家政科の5学科構成(R6は普通科/食品科学科/家政科の3学科構成に再編済み)という相違がある', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    expect(r5.length).toBe(130);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(13760);
    expect(sumApplicants).toBe(14095);

    const sendaikou = r5.filter((r) => r.schoolName === '仙台工');
    expect(sendaikou).toHaveLength(4);
    expect(sendaikou.some((r) => r.department === '情報科')).toBe(false);
    expect(r5.filter((r) => r.schoolName === '宮城水産')).toHaveLength(1);

    const watari = r5.filter((r) => r.schoolName === '亘理');
    expect(watari).toHaveLength(5);
    const watariQuota = watari.reduce((a, r) => a + r.quota, 0);
    const watariApplicants = watari.reduce((a, r) => a + r.finalApplicants, 0);
    expect(watariQuota).toBe(200);
    expect(watariApplicants).toBe(106);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of MIYAGI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.miyagi\.jp\//);
    }
  });
});
