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

  it('prefecturesBySystemTypeはabolishedでtokyo/osaka/saitamaを含む', () => {
    const abolished = prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'abolished');
    expect(abolished).toEqual(['osaka', 'saitama', 'tokyo']);
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

  it('prefecturesBySystemTypeはdistrictedでhyogoを含む', () => {
    expect(prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'districted')).toEqual(['hyogo']);
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
