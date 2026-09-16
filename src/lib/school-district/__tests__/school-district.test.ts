import {
  getSchoolDistrict,
  hasDistrictSystem,
  prefecturesBySystemType,
} from '@/lib/school-district';
import { SCHOOL_DISTRICT_BY_PREFECTURE } from '@/data/school-districts';

describe('T-Y15 学区（通学区域）DB', () => {
  it('getSchoolDistrictは未登録県にundefinedを返す', () => {
    expect(getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'akita')).toBeUndefined();
  });

  it('prefecturesBySystemTypeはabolishedでkanagawa/miyagi/oita/osaka/saitama/tokyo/toyamaを含む', () => {
    const abolished = prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'abolished');
    expect(abolished).toEqual(['kanagawa', 'miyagi', 'oita', 'osaka', 'saitama', 'tokyo', 'toyama']);
  });

  it('oitaは平成20年度(2008年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'oita');
    expect(record?.abolishedFiscalYear).toBe('平成20年度（2008年度）');
  });

  it('toyamaは令和6年度(2024年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'toyama');
    expect(record?.abolishedFiscalYear).toBe('令和6年度（2024年度）');
  });

  it('kanagawaは平成17年度(2005年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'kanagawa');
    expect(record?.abolishedFiscalYear).toBe('平成17年度（2005年度）');
  });

  it('miyagiは平成22年度(2010年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'miyagi');
    expect(record?.abolishedFiscalYear).toBe('平成22年度（2010年度）');
  });

  it('tokyoは平成15年度(2003年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'tokyo');
    expect(record?.abolishedFiscalYear).toBe('平成15年度（2003年度）');
  });

  it('osakaは平成26年度(2014年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'osaka');
    expect(record?.abolishedFiscalYear).toBe('平成26年度（2014年度）');
  });

  it('saitamaは平成16年度(2004年度)に学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'saitama');
    expect(record?.abolishedFiscalYear).toBe('平成16年度（2004年度）');
  });

  it('hasDistrictSystemはabolished県にfalseを返す', () => {
    expect(hasDistrictSystem(SCHOOL_DISTRICT_BY_PREFECTURE, 'tokyo')).toBe(false);
  });

  it('hasDistrictSystemは未登録県にnullを返す', () => {
    expect(hasDistrictSystem(SCHOOL_DISTRICT_BY_PREFECTURE, 'akita')).toBeNull();
  });

  it('登録済みレコードは全てfiscalYear・source.url・source.lastCheckedを持つ（Y-0: 1データ点1出典）', () => {
    for (const record of Object.values(SCHOOL_DISTRICT_BY_PREFECTURE)) {
      expect(record?.fiscalYear.length).toBeGreaterThan(0);
      expect(record?.source.url.startsWith('https://')).toBe(true);
      expect(record?.source.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('hyogoは districted で5学区を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'hyogo');
    expect(record?.systemType).toBe('districted');
    expect(record?.districts?.length).toBe(5);
    expect(record?.districts?.[0].name).toBe('第1学区');
  });

  it('hasDistrictSystemはhyogoにtrueを返す', () => {
    expect(hasDistrictSystem(SCHOOL_DISTRICT_BY_PREFECTURE, 'hyogo')).toBe(true);
  });

  it('prefecturesBySystemTypeはdistrictedでaichi/chiba/hokkaido/hyogo/kagoshima/naganoを含む', () => {
    expect(prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'districted')).toEqual([
      'aichi',
      'chiba',
      'hokkaido',
      'hyogo',
      'kagoshima',
      'nagano',
    ]);
  });

  it('naganoは districted で4学区を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'nagano');
    expect(record?.districts?.length).toBe(4);
    expect(record?.districts?.[0].municipalities).toContain('長野市');
  });

  it('hokkaidoは districted で19学区を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'hokkaido');
    expect(record?.districts?.length).toBe(19);
    expect(record?.districts?.[2].name).toBe('石狩学区');
    expect(record?.districts?.[2].municipalities).toContain('札幌市');
  });

  it('chibaは districted で9学区を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'chiba');
    expect(record?.districts?.length).toBe(9);
    expect(record?.districts?.[0].municipalities).toEqual(['千葉市']);
  });

  it('aichiは districted で尾張学区・三河学区の2学区を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'aichi');
    expect(record?.districts?.map((d) => d.name)).toEqual(['尾張学区', '三河学区']);
    expect(record?.districts?.[0].municipalities).toContain('名古屋市');
    expect(record?.districts?.[1].municipalities).toContain('豊橋市');
  });

  it('kagoshimaは districted で8学区(熊毛/大島/全県学区含む)を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'kagoshima');
    expect(record?.districts?.length).toBe(8);
    expect(record?.districts?.map((d) => d.name)).toEqual([
      '鹿児島学区',
      '南薩学区',
      '北薩学区',
      '姶良・伊佐学区',
      '大隅学区',
      '熊毛学区',
      '大島学区',
      '全県学区',
    ]);
    expect(record?.districts?.[0].municipalities).toContain('鹿児島市');
  });

  it('districtedのレコードはdistricts配列を持つ', () => {
    for (const record of Object.values(SCHOOL_DISTRICT_BY_PREFECTURE)) {
      if (record?.systemType === 'districted') {
        expect(record.districts?.length).toBeGreaterThan(0);
      }
    }
  });

  it('systemType=abolishedのレコードは全てabolishedFiscalYearを持つ', () => {
    for (const record of Object.values(SCHOOL_DISTRICT_BY_PREFECTURE)) {
      if (record?.systemType === 'abolished') {
        expect(record.abolishedFiscalYear?.length).toBeGreaterThan(0);
      }
    }
  });
});
