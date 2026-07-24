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

  it('全日制の全レコード合計がPDF末尾のグランドトータル（全日制合計・quota13,400・applicants12,516・倍率0.93）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制課程のみ意図的にスコープ外）', () => {
    expect(MIYAGI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('129レコード・68校が収録されている（PDF冒頭の概要と一致）', () => {
    expect(records.length).toBe(129);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
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
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of MIYAGI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.miyagi\.jp\//);
    }
  });
});
