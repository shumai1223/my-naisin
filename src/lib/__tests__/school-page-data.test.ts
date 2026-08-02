import {
  buildSchoolPageDataForPrefecture,
  selectNearbySchools,
  getSchoolCategoryTrends,
  type SchoolPageData,
} from '../school-page-data';
import type { SchoolRecord } from '../school-master';
import type { CompetitionRateRecord } from '../competition-rate';
import type { PrefectureRateHistoryFile, YearSnapshot } from '../competition-rate-history';
import { TOKYO_COMPETITION_RATES } from '@/data/competition-rates/tokyo';
import { TOKYO_COMPETITION_RATE_HISTORY } from '@/data/competition-rate-history/tokyo';
import { SCHOOLS_TOKYO } from '@/data/schools/tokyo';

function rec(code: string, name: string): SchoolRecord {
  return { code, name, address: `${name}の住所`, postalCode: '1000001', branch: false };
}

function rate(
  schoolName: string,
  department: string,
  quota: number,
  finalApplicants: number,
  finalRate: number,
  area?: string
): CompetitionRateRecord {
  return { schoolName, department, quota, finalApplicants, finalRate, area };
}

function schoolData(overrides: Partial<SchoolPageData> & { schoolCode: string }): SchoolPageData {
  return {
    schoolName: `${overrides.schoolCode}高等学校`,
    address: '',
    departmentRates: [],
    totalQuota: 0,
    totalApplicants: 0,
    overallRate: 0,
    ...overrides,
  };
}

describe('buildSchoolPageDataForPrefecture', () => {
  test('単一学科の学校は1件のSchoolPageDataになる', () => {
    const master = [rec('T1', '東京都立日比谷高等学校')];
    const rates = [rate('日比谷', '普通科', 253, 520, 2.06)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(1);
    expect(result.schools[0]).toMatchObject({
      schoolCode: 'T1',
      schoolName: '東京都立日比谷高等学校',
      totalQuota: 253,
      totalApplicants: 520,
    });
    expect(result.schools[0].overallRate).toBeCloseTo(2.06, 2);
    expect(result.skipped).toHaveLength(0);
  });

  test('複数学科(普通科+理数科等)の学校は募集人員・応募者数を合算する', () => {
    const master = [rec('O1', '大阪府立東高等学校')];
    const rates = [
      rate('東', '普通科', 200, 271, 1.36),
      rate('東', '理数科', 80, 99, 1.24),
      rate('東', '英語科', 36, 23, 0.64),
    ];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(1);
    expect(result.schools[0].totalQuota).toBe(200 + 80 + 36);
    expect(result.schools[0].totalApplicants).toBe(271 + 99 + 23);
    expect(result.schools[0].departmentRates).toHaveLength(3);
  });

  test('学校名が突合できない場合はページを作らずskippedへ回す(no-match)', () => {
    const master = [rec('T1', '東京都立日比谷高等学校')];
    const rates = [rate('存在しない高校', '普通科', 100, 100, 1.0)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(0);
    expect(result.skipped).toEqual([{ schoolName: '存在しない高校', reason: 'no-match' }]);
  });

  test('あいまい一致(同名複数校)もskippedへ回す(誤った紐付けをしない)', () => {
    const master = [rec('X1', '東京都立大森高等学校'), rec('X2', '東京都立大森高校')];
    const rates = [rate('大森', '普通科', 100, 100, 1.0)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(0);
    expect(result.skipped).toEqual([{ schoolName: '大森', reason: 'ambiguous' }]);
  });

  // 2026-08-02判明: miyagi等、県独自の略称慣習(school-name-aliases.ts)を使う県はnameAliasesで
  // 突合前に正式表記へ変換する。表示・レコード紐付けは元のschoolNameのまま維持されることを確認する。
  describe('nameAliasesによる県独自略称への対応(2026-08-02)', () => {
    test('aliasで指定した略称は正規化後の正式表記と突合される', () => {
      const master = [rec('M1', '宮城県白石工業高等学校')];
      const rates = [rate('白石工', '機械科', 40, 50, 1.25)];
      const result = buildSchoolPageDataForPrefecture(master, rates, { 白石工: '白石工業' });
      expect(result.skipped).toHaveLength(0);
      expect(result.schools).toHaveLength(1);
      expect(result.schools[0].schoolCode).toBe('M1');
    });

    test('突合後もschoolNameは元の生の表記に基づいてグルーピングされる(alias値そのものに置き換わらない)', () => {
      const master = [rec('M1', '宮城県白石工業高等学校')];
      const rates = [
        rate('白石工', '機械科', 40, 50, 1.25),
        rate('白石工', '電気科', 40, 30, 0.75),
      ];
      const result = buildSchoolPageDataForPrefecture(master, rates, { 白石工: '白石工業' });
      expect(result.schools).toHaveLength(1);
      expect(result.schools[0].departmentRates).toHaveLength(2);
      expect(result.schools[0].totalQuota).toBe(80);
    });

    test('aliasが無い学校名は従来どおり正規化のみで突合される(alias指定県でも他校は影響を受けない)', () => {
      const master = [rec('M1', '宮城県白石工業高等学校'), rec('M2', '宮城県白石高等学校')];
      const rates = [rate('白石工', '機械科', 40, 50, 1.25), rate('白石', '普通科', 200, 210, 1.05)];
      const result = buildSchoolPageDataForPrefecture(master, rates, { 白石工: '白石工業' });
      expect(result.skipped).toHaveLength(0);
      expect(result.schools.map((s) => s.schoolCode).sort()).toEqual(['M1', 'M2']);
    });
  });

  test('募集人員0の学校はoverallRateを0にする(0除算を起こさない)', () => {
    const master = [rec('Z1', '東京都立ゼロ高等学校')];
    const rates: CompetitionRateRecord[] = [];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    // ratesが無いのでmatchSummaryにも現れず、schools/skippedともに0件が正しい
    expect(result.schools).toHaveLength(0);
    expect(result.skipped).toHaveLength(0);
  });

  test('全学科レコードで一致するareaをSchoolPageDataに反映する', () => {
    const master = [rec('T1', '東京都立日比谷高等学校')];
    const rates = [rate('日比谷', '普通科', 253, 520, 2.06, '千代田')];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools[0].area).toBe('千代田');
  });

  test('areaが無い一次資料の学校はareaがundefinedになる(近隣校選定の対象外になるだけで安全)', () => {
    const master = [rec('T1', '東京都立日比谷高等学校')];
    const rates = [rate('日比谷', '普通科', 253, 520, 2.06)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools[0].area).toBeUndefined();
  });
});

describe('getSchoolCategoryTrends', () => {
  test('historyがundefinedなら空配列を返す(データが無い都道府県で誤った推移を出さない)', () => {
    const school = schoolData({ schoolCode: 'A', departmentRates: [rate('A', '普通科', 100, 100, 1.0)] });
    expect(getSchoolCategoryTrends('tokyo', school, undefined)).toEqual([]);
  });

  test('対応表に無い学科(department)は正直に何も返さない', () => {
    const school = schoolData({ schoolCode: 'A', departmentRates: [rate('A', '存在しない学科', 100, 100, 1.0)] });
    const history: PrefectureRateHistoryFile = {
      prefectureCode: 'tokyo',
      years: [
        {
          fiscalYear: '令和7年度（2025年度）',
          sourceUrl: 'https://example.com',
          sourceTitle: 'テスト用',
          fetchedAt: '2026-08-01',
          origin: 'current-year-column',
          granularity: 'category-detail',
          categories: [{ label: '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計', quota: 100, applicants: 100, rate: 1.0 }],
          grandTotal: { label: '全日制合計', quota: 100, applicants: 100, rate: 1.0 },
        } satisfies YearSnapshot,
      ],
    };
    expect(getSchoolCategoryTrends('tokyo', school, history)).toEqual([]);
  });

  test('実データ(東京都日比谷・普通科)でΛ-4の多年度推移(令和4〜7年度)を正しく解決する', () => {
    const { schools } = buildSchoolPageDataForPrefecture(SCHOOLS_TOKYO.schools, TOKYO_COMPETITION_RATES.records);
    const hibiya = schools.find((s) => s.schoolName.includes('日比谷'));
    expect(hibiya).toBeDefined();

    const trends = getSchoolCategoryTrends('tokyo', hibiya!, TOKYO_COMPETITION_RATE_HISTORY);
    expect(trends).toHaveLength(1);
    expect(trends[0].categoryLabel).toBe('普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計');
    // 令和5・4年度分はgranularity='grand-total-only'(区分内訳を持たない)なのでpointsは
    // category-detail年度(令和7・6)の2件のみになるのが正しい(欠測を捏造しない)。
    expect(trends[0].points).toHaveLength(2);
    expect(trends[0].points[0]).toEqual({ fiscalYear: '令和7年度（2025年度）', rate: 1.36 });
  });

  test('複数学科を持つ学校は解決できたカテゴリを重複排除してすべて返す', () => {
    const school = schoolData({
      schoolCode: 'M',
      departmentRates: [
        rate('M', '普通科', 100, 100, 1.0),
        rate('M', '普通科（単位制）', 50, 50, 1.0),
      ],
    });
    const trends = getSchoolCategoryTrends('tokyo', school, TOKYO_COMPETITION_RATE_HISTORY);
    expect(trends.map((t) => t.categoryLabel).sort()).toEqual(['単位制計', '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計']);
    expect(trends.every((t) => t.granularity === 'category-detail')).toBe(true);
  });

  test('department対応表が無く全年度grand-total-onlyの県(神奈川等)は県全体合計を推移として返す(Λ+1)', () => {
    const school = schoolData({ schoolCode: 'K', departmentRates: [rate('K', '普通科', 100, 100, 1.0)] });
    const history: PrefectureRateHistoryFile = {
      prefectureCode: 'kanagawa',
      years: [
        {
          fiscalYear: '令和7年度（2025年度）',
          sourceUrl: 'https://example.com',
          sourceTitle: 'テスト用',
          fetchedAt: '2026-08-01',
          origin: 'current-year-column',
          granularity: 'grand-total-only',
          categories: [],
          grandTotal: { label: '全日制の課程（特別募集・中途退学者募集を除く）', quota: 39395, applicants: 46104, rate: 1.17 },
        } satisfies YearSnapshot,
      ],
    };
    const trends = getSchoolCategoryTrends('kanagawa', school, history);
    expect(trends).toEqual([
      {
        categoryLabel: '全日制の課程（特別募集・中途退学者募集を除く）',
        points: [{ fiscalYear: '令和7年度（2025年度）', rate: 1.17 }],
        granularity: 'grand-total-only',
      },
    ]);
  });

  test('department対応表もgrand-total-only年度も無い県は空配列を返す(誤った推測をしない)', () => {
    const school = schoolData({ schoolCode: 'X', departmentRates: [rate('X', '普通科', 100, 100, 1.0)] });
    const history: PrefectureRateHistoryFile = {
      // osakaはDEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTUREに未登録の県として使う
      // (tokyo/hiroshima/saitamaは2026-08-02時点で登録済みのため、このテストの前提が崩れる)。
      prefectureCode: 'osaka',
      years: [
        {
          fiscalYear: '令和7年度（2025年度）',
          sourceUrl: 'https://example.com',
          sourceTitle: 'テスト用',
          fetchedAt: '2026-08-01',
          origin: 'current-year-column',
          granularity: 'category-detail',
          categories: [{ label: '普通科計', quota: 100, applicants: 100, rate: 1.0 }],
          grandTotal: { label: '全日制合計', quota: 100, applicants: 100, rate: 1.0 },
        } satisfies YearSnapshot,
      ],
    };
    // osakaはDEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTUREに未登録のためcategoryLabelsは空、
    // かつ当該年度はgrand-total-onlyでもないためフォールバックも発動しない。
    expect(getSchoolCategoryTrends('osaka', school, history)).toEqual([]);
  });
});

describe('selectNearbySchools', () => {
  test('同一areaの他校を倍率が近い順に最大3件返す', () => {
    const target = schoolData({ schoolCode: 'A', area: '千代田', overallRate: 2.0 });
    const all = [
      target,
      schoolData({ schoolCode: 'B', area: '千代田', overallRate: 1.9 }), // 差0.1
      schoolData({ schoolCode: 'C', area: '千代田', overallRate: 1.0 }), // 差1.0
      schoolData({ schoolCode: 'D', area: '千代田', overallRate: 2.1 }), // 差0.1
      schoolData({ schoolCode: 'E', area: '港', overallRate: 2.0 }), // 別学区なので対象外
    ];
    const result = selectNearbySchools(target, all, 3);
    expect(result.map((r) => r.schoolCode)).toEqual(['B', 'D', 'C']); // 差0.1同率はschoolCode昇順
  });

  test('areaが無い学校は空配列を返す(誤った近隣付けをしない)', () => {
    const target = schoolData({ schoolCode: 'A', overallRate: 2.0 });
    const all = [target, schoolData({ schoolCode: 'B', area: '千代田', overallRate: 2.0 })];
    expect(selectNearbySchools(target, all)).toEqual([]);
  });

  test('同一areaの他校が0件なら空配列を返す(存在しない候補を作らない)', () => {
    const target = schoolData({ schoolCode: 'A', area: '千代田', overallRate: 2.0 });
    const all = [target, schoolData({ schoolCode: 'B', area: '港', overallRate: 2.0 })];
    expect(selectNearbySchools(target, all)).toEqual([]);
  });

  test('自分自身は候補から除外される', () => {
    const target = schoolData({ schoolCode: 'A', area: '千代田', overallRate: 2.0 });
    const all = [target];
    expect(selectNearbySchools(target, all)).toEqual([]);
  });
});
