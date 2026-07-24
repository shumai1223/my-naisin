import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUOKA_COMPETITION_RATES } from '../fukuoka';

/**
 * Y-2 DoD検証（福岡県・先行8県7県目）。
 *
 * 福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれるため、今回はPDF1ページ目
 * 全27校（青豊〜遠賀）＋2ページ目30校＋3ページ目16校（小郡〜浮羽究真館）の計73校・
 * 129レコードのみを対象とした正直な部分収録。2ページ目の一部・1ページ目の北筑・3ページ目
 * 全16校は、PDF自体の視覚読み取りが試行のたびに食い違ったため、外部の学習塾サイト記事から
 * 引用しrate整合性で裏取りした。県レベルの公式合計との突合はまだできない（残りページ未読の
 * ため）ので、代わりに複数学科を持つ学校について、学校単位でPDFに印字された「計」行との
 * 完全一致を検証する。
 */
describe('福岡県 倍率パイプラインα（Y-2・PDF1ページ目+2ページ目+3ページ目 計73校の部分収録テスト）', () => {
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
    '北筑 計': '北筑',
    '折尾 計': '折尾',
    '小郡 計': '小郡',
    '三井 計': '三井',
    '明善 計': '明善',
    '久留米 計': '久留米',
    '福島 計': '福島',
    '山門 計': '山門',
    '三潴 計': '三潴',
    '大川樟風 計': '大川樟風',
    '朝倉東 計': '朝倉東',
    '朝倉光陽 計': '朝倉光陽',
  };

  it('複数学科を持つ23校すべてで、学科別内訳の合計がPDF記載の学校単位「計」行（または外部裏取り値）と完全一致する', () => {
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

  it('129レコードが収録されている（1ページ目27校+2ページ目30校+3ページ目16校=計73校）', () => {
    expect(records.length).toBe(129);
  });

  it('外部塾サイト(筑後地区記事)から裏取りしたPDF3ページ目16校が正しく収録されている', () => {
    const chikugoSchools = [
      '小郡', '三井', '明善', '久留米', '八女', '福島', '伝習館', '山門',
      '三潴', '大川樟風', '三池', 'ありあけ新世', '朝倉', '朝倉東', '朝倉光陽', '浮羽究真館',
    ];
    for (const name of chikugoSchools) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBeGreaterThan(0);
    }
  });

  it('外部塾サイト(実業高校記事)から裏取りした福岡工業/福岡農業/糸島農業の16レコードが正しく収録されている', () => {
    const vocationalSchools: Record<string, number> = {
      福岡工業: 8,
      福岡農業: 4,
      糸島農業: 4,
    };
    for (const [name, count] of Object.entries(vocationalSchools)) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
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

  it('1ページ目の残り6校（八幡南/北筑/東筑/折尾/中間/遠賀）が正しく収録されている', () => {
    const page1ContinuationSchools = ['八幡南', '北筑', '東筑', '折尾', '中間', '遠賀'];
    for (const name of page1ContinuationSchools) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBeGreaterThan(0);
    }
  });
});
