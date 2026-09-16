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

  it('prefecturesBySystemTypeはabolishedでaomori/ibaraki/kanagawa/kochi/miyagi/oita/osaka/saga/saitama/shiga/shizuoka/tochigi/tokyo/toyamaを含む', () => {
    const abolished = prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'abolished');
    expect(abolished).toEqual(['aomori', 'ibaraki', 'kanagawa', 'kochi', 'miyagi', 'oita', 'osaka', 'saga', 'saitama', 'shiga', 'shizuoka', 'tochigi', 'tokyo', 'toyama']);
  });

  it('ibarakiは平成18年度(2006年度)に5学区制を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'ibaraki');
    expect(record?.abolishedFiscalYear).toBe('平成18年度（2006年度）');
  });

  it('shizuokaは平成20年度(2008年度)に10学区制(賀茂〜西遠)を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'shizuoka');
    expect(record?.abolishedFiscalYear).toBe('平成20年度（2008年度）');
    expect(record?.outOfDistrictCondition).toContain('10学区');
  });

  it('shigaは平成18年度(2006年度)に学区を廃止した(信楽/伊香/虎姫は全国募集の特例)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'shiga');
    expect(record?.abolishedFiscalYear).toBe('平成18年度（2006年度）');
    expect(record?.outOfDistrictCondition).toContain('全国募集');
  });

  it('tochigiは平成26年度(2014年度)に7学区制を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'tochigi');
    expect(record?.abolishedFiscalYear).toBe('平成26年度（2014年度）');
    expect(record?.outOfDistrictCondition).toContain('25%');
  });

  it('aomoriは平成17年度(2005年度)に6学区制を廃止した(区割りの名称は未確認)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'aomori');
    expect(record?.abolishedFiscalYear).toBe('平成17年度（2005年度）');
  });

  it('kochiは平成24年度(2012年度)に学区を廃止した(4学区→全県一区)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'kochi');
    expect(record?.abolishedFiscalYear).toBe('平成24年度（2012年度）');
  });

  it('sagaは令和5年度(2023年度)に学区を廃止した(4学区→2学区を経て全県1区)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'saga');
    expect(record?.abolishedFiscalYear).toBe('令和5年度（2023年度）');
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

  it('prefecturesBySystemTypeはdistrictedでaichi/chiba/hokkaido/hyogo/kagawa/kagoshima/mie/nagano/okayama/okinawa/tokushimaを含む', () => {
    expect(prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'districted')).toEqual([
      'aichi',
      'chiba',
      'hokkaido',
      'hyogo',
      'kagawa',
      'kagoshima',
      'mie',
      'nagano',
      'okayama',
      'okinawa',
      'tokushima',
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

  it('okinawaは districted で7学区(国頭/中頭/那覇/島尻/久米島/宮古/八重山)を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'okinawa');
    expect(record?.districts?.length).toBe(7);
    expect(record?.districts?.map((d) => d.name)).toEqual([
      '国頭学区',
      '中頭学区',
      '那覇学区',
      '島尻学区',
      '久米島学区',
      '宮古学区',
      '八重山学区',
    ]);
    expect(record?.outOfDistrictCondition).toContain('10%');
  });

  it('okayamaは districted で6学区(備北学区は対象校0)を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'okayama');
    expect(record?.districts?.length).toBe(6);
    const bihoku = record?.districts?.find((d) => d.name === '備北学区');
    expect(bihoku?.note).toContain('無い');
  });

  it('tokushimaは districted で3学区を持ち、学区外上限は学校ごとに異なる', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'tokushima');
    expect(record?.districts?.length).toBe(3);
    expect(record?.districts?.map((d) => d.name)).toEqual(['第1学区', '第2学区', '第3学区']);
    expect(record?.outOfDistrictCondition).toContain('城東');
  });

  it('mieは districted で北部/中部/南部の3学区を持ち隣接学区への出願も認める', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'mie');
    expect(record?.districts?.length).toBe(3);
    expect(record?.districts?.map((d) => d.name)).toEqual(['北部学区', '中部学区', '南部学区']);
    expect(record?.outOfDistrictCondition).toContain('隣接する学区');
  });

  it('kagawaは districted で2学区を持ち、自己推薦選抜に限り他学区枠5%を認める', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'kagawa');
    expect(record?.districts?.length).toBe(2);
    expect(record?.outOfDistrictCondition).toContain('5%');
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
