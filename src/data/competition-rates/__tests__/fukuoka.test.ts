import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUOKA_COMPETITION_RATES } from '../fukuoka';

/**
 * Y-2 DoD検証（福岡県・先行8県7県目）。
 *
 * 福岡県は資料が複数ページ＋県立/市組合立の別PDFに分かれるが、両方とも全日制を完全収録した
 * （県立90校・市組合立8校＝計98校・191レコード）。機械集計は両方のPDF末尾グランドトータル
 * （県立: quota22,200・applicants22,854・倍率1.03／市組合立: quota2,120・applicants2,350・
 * 倍率1.11）と完全一致する（＝福岡県全日制の完全性を検証済み・先行8県の6県目完了）。
 * 県立分の統合過程で「小倉東」（quota160/applicants173/rate1.08）と「戸畑」（quota240/
 * applicants276/rate1.15）という別々の2校を誤って「戸畑」1校のレコードに統合していたミスを
 * 発見・修正した（詳細はfukuoka.tsのファイル冒頭コメント参照）。市組合立分はPDFのテキスト
 * 抽出に成功し視覚読み取りより高信頼度。久留米商業の経営科学科3コースはPDF注釈により志願者数が
 * 合算でのみ公表されているため学校単位1レコードとして記録。複数学科を持つ学校について、
 * 学校単位でPDFに印字された「計」行との完全一致、および県立/市組合立それぞれのグランド
 * トータルとの完全一致を検証する。
 */
const MUNICIPAL_UNION_SCHOOLS = [
  '福翔', '博多工業', '福岡女子', '福岡西陵', '北九州市立高等学校', '南筑', '久留米商業', '古賀竟成館',
];

describe('福岡県 倍率パイプラインα（Y-2・全日制98校の完全収録テスト）', () => {
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
    '東鷹 計': '東鷹',
    '嘉穂 計': '嘉穂',
    '嘉穂東 計': '嘉穂東',
    '嘉穂総合 計': '嘉穂総合',
    '鞍手 計': '鞍手',
    '直方 計': '直方',
    '田川科学技術 計': '田川科学技術',
    '筑豊 計': '筑豊',
    '博多工業 計': '博多工業',
    '福岡女子 計': '福岡女子',
    '古賀竟成館 計': '古賀竟成館',
  };
  const GRAND_TOTAL_LABELS = ['県立全日制合計', '市組合立全日制合計'];

  it('県立全日制の合計がPDF末尾のグランドトータル（90校・quota22,200・applicants22,854・倍率1.03）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '県立全日制合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !MUNICIPAL_UNION_SCHOOLS.includes(r.schoolName));
    expect(result.matches).toBe(true);
  });

  it('市組合立全日制の合計がPDF末尾のグランドトータル（8校・quota2,120・applicants2,350・倍率1.11）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '市組合立全日制合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => MUNICIPAL_UNION_SCHOOLS.includes(r.schoolName));
    expect(result.matches).toBe(true);
  });

  it('複数学科を持つ34校すべてで、学科別内訳の合計がPDF記載の学校単位「計」行（または外部裏取り値）と完全一致する', () => {
    for (const sub of officialSubtotals) {
      if (GRAND_TOTAL_LABELS.includes(sub.label)) continue;
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(FUKUOKA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('191レコード・98校が収録されている（県立全日制90校+市組合立全日制8校）', () => {
    expect(records.length).toBe(191);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(98);
  });

  it('市組合立全日制8校が正しく収録されている', () => {
    for (const name of MUNICIPAL_UNION_SCHOOLS) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBeGreaterThan(0);
    }
  });

  it('「小倉東」と「戸畑」が正しく別々の学校として収録されている（統合ミスの回帰防止）', () => {
    const kokuraHigashi = records.find((r) => r.schoolName === '小倉東');
    const tobata = records.find((r) => r.schoolName === '戸畑');
    expect(kokuraHigashi).toMatchObject({ quota: 160, finalApplicants: 173, finalRate: 1.08 });
    expect(tobata).toMatchObject({ quota: 240, finalApplicants: 276, finalRate: 1.15 });
  });

  it('外部塾サイト(筑豊地区記事)から裏取りしたPDF4ページ目11校が正しく収録されている', () => {
    const chikuhoSchools = [
      '田川', '東鷹', '嘉穂', '嘉穂東', '嘉穂総合', '鞍手', '直方',
      '稲築志耕館', '鞍手竜徳', '田川科学技術', '筑豊',
    ];
    for (const name of chikuhoSchools) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBeGreaterThan(0);
    }
  });

  it('外部塾サイト(実業高校記事)から裏取りした久留米筑水/三池工業/八女工業/八女農業/浮羽工業の15レコードが正しく収録されている', () => {
    const remainingVocationalSchools: Record<string, number> = {
      久留米筑水: 3,
      三池工業: 3,
      八女工業: 6,
      八女農業: 1,
      浮羽工業: 2,
    };
    for (const [name, count] of Object.entries(remainingVocationalSchools)) {
      const schoolRecords = records.filter((r) => r.schoolName === name);
      expect(schoolRecords.length).toBe(count);
    }
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
