import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUOKA_COMPETITION_RATES } from '../fukuoka';

/**
 * Y-2 DoD検証（福岡県・先行8県7県目）。
 *
 * 福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれるため、今回はPDF1ページ目
 * 全21校＋2ページ目12校（宗像〜福岡）の計33校・55レコードのみを対象とした正直な部分収録。
 * 2ページ目の筑紫丘以降は視覚読み取りが試行のたびに食い違ったため誤読リスクを避けて
 * 意図的に保留。県レベルの公式合計との突合はまだできない（残りページ未読のため）ので、
 * 代わりに複数学科を持つ学校について、学校単位でPDFに印字された「計」行、
 * または外部の学習塾サイトの入試速報記事で裏取りした値との完全一致を検証する。
 */
describe('福岡県 倍率パイプラインα（Y-2・PDF1ページ目+2ページ目 計33校の部分収録テスト）', () => {
  const { records, officialSubtotals } = FUKUOKA_COMPETITION_RATES;
  const schoolFilters: Record<string, string> = {
    '苅田工業 計': '苅田工業',
    '行橋 計': '行橋',
    '小倉工業 計': '小倉工業',
    '戸畑工業 計': '戸畑工業',
    '八幡 計': '八幡',
    '八幡中央 計': '八幡中央',
    '八幡工業 計': '八幡工業',
    '新宮 計': '新宮',
    '香住丘 計': '香住丘',
    '香椎 計': '香椎',
    '香椎工業 計': '香椎工業',
  };

  it('複数学科を持つ11校すべてで、学科別内訳の合計がPDF記載の学校単位「計」行（または外部裏取り値）と完全一致する', () => {
    for (const sub of officialSubtotals) {
      const schoolName = schoolFilters[sub.label];
      const result = checkAgainstSubtotal(records, sub, (r) => r.schoolName === schoolName);
      expect(result.matches).toBe(true);
    }
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.011);
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

  it('coverageが正直に部分収録を示している', () => {
    expect(FUKUOKA_COMPETITION_RATES.coverage.status).toBe('partial');
    expect(FUKUOKA_COMPETITION_RATES.coverage.pendingDepartments.length).toBeGreaterThan(0);
  });

  it('55レコードが収録されている（1ページ目21校+2ページ目12校=計33校）', () => {
    expect(records.length).toBe(55);
  });
});
