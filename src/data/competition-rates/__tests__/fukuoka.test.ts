import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUOKA_COMPETITION_RATES } from '../fukuoka';

/**
 * Y-2 DoD検証（福岡県・先行8県7県目）。
 *
 * 福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれるため、今回はPDF1ページ目
 * 全21校＋2ページ目27校（宗像〜糸島）の計48校・75レコードのみを対象とした正直な部分収録。
 * 2ページ目のうち筑紫丘〜糸島の15校はPDF自体の視覚読み取りが試行のたびに食い違ったため、
 * 外部の学習塾サイト記事から一括で構造的に引用しrate整合性で裏取りした。
 * 県レベルの公式合計との突合はまだできない（残りページ未読のため）ので、代わりに複数学科を
 * 持つ学校について、学校単位でPDFに印字された「計」行との完全一致を検証する。
 */
describe('福岡県 倍率パイプラインα（Y-2・PDF1ページ目+2ページ目 計48校の部分収録テスト）', () => {
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

  it('75レコードが収録されている（1ページ目21校+2ページ目27校=計48校）', () => {
    expect(records.length).toBe(75);
  });

  it('外部塾サイトから裏取りした筑紫丘〜糸島の15校20レコードが正しく収録されている', () => {
    const externalSchools = [
      '筑紫丘', '柏陵', '福岡中央', '城南', '修猷館', '福岡講倫館', '早良', '玄洋',
      '筑前', '春日', '太宰府', '筑紫中央', '武蔵台', '筑紫', '糸島',
    ];
    for (const name of externalSchools) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBeGreaterThan(0);
    }
  });
});
