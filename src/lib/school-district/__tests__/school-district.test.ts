import {
  getSchoolDistrict,
  hasDistrictSystem,
  prefecturesBySystemType,
} from '@/lib/school-district';
import { SCHOOL_DISTRICT_BY_PREFECTURE } from '@/data/school-districts';

describe('T-Y15 学区（通学区域）DB', () => {
  it('getSchoolDistrictは未登録県にundefinedを返す', () => {
    expect(getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'tottori')).toBeUndefined();
  });

  it('prefecturesBySystemTypeはabolishedでakita/aomori/fukui/gifu/gunma/hiroshima/ibaraki/ishikawa/kanagawa/kochi/miyagi/miyazaki/nara/niigata/oita/osaka/saga/saitama/shiga/shimane/shizuoka/tochigi/tokyo/toyama/wakayama/yamaguchi/yamanashiを含む', () => {
    const abolished = prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'abolished');
    expect(abolished).toEqual(['akita', 'aomori', 'fukui', 'gifu', 'gunma', 'hiroshima', 'ibaraki', 'ishikawa', 'kanagawa', 'kochi', 'miyagi', 'miyazaki', 'nara', 'niigata', 'oita', 'osaka', 'saga', 'saitama', 'shiga', 'shimane', 'shizuoka', 'tochigi', 'tokyo', 'toyama', 'wakayama', 'yamaguchi', 'yamanashi']);
  });

  it('miyazakiは平成20年度(2008年度)に学区を廃止した(岩手県比較表で一次確認・niigataと同一行)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'miyazaki');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成20年度（2008年度）');
  });

  it('yamanashiは平成19年度(2007年度)に学区を廃止した(岩手県比較表で一次確認・総合選抜制も同時廃止)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'yamanashi');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成19年度（2007年度）');
    expect(record?.outOfDistrictCondition).toContain('総合選抜制');
  });

  it('fukuiは平成16年度(2004年度)に学区を廃止した(岩手県比較表で一次確認・学校群選抜制度の廃止は二次資料のみ)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'fukui');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成16年度（2004年度）');
    expect(record?.outOfDistrictCondition).toContain('学校群');
  });

  it('niigataは平成20年度(2008年度)に学区を廃止した(岩手県比較表で一次確認・廃止前の学区名は未確認)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'niigata');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成20年度（2008年度）');
  });

  it('akitaは平成17年度(2005年度)に3学区制を廃止した(岩手県比較表で一次確認・学区外枠なしが特徴)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'akita');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成17年度（2005年度）');
    expect(record?.outOfDistrictCondition).toContain('専門学科');
  });

  it('naraは平成17年度(2005年度)に北部/南部2学区制を廃止した(岩手県比較表で一次確認)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'nara');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成17年度（2005年度）');
    expect(record?.outOfDistrictCondition).toContain('十津川');
  });

  it('gifuは平成30年度(2018年度)に旧6学区制(岐阜/西濃/美濃/可茂/東濃/飛騨)を廃止した(教育委員会会議録で一次確認)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'gifu');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成30年度（2018年度）');
    expect(record?.outOfDistrictCondition).toContain('西濃');
  });

  it('gunmaは平成19年度(2007年度)に全県一区化した(一次資料は令和3年度実施要項の資料1・二次資料の2021年説とは食い違う)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'gunma');
    expect(record?.systemType).toBe('abolished');
    expect(record?.abolishedFiscalYear).toBe('平成19年度（2007年度）');
  });

  it('shimaneは学区制度が無く、松江市内3校・出雲高校のみ地域外入学制限(市外合格者10%/5%以内)を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'shimane');
    expect(record?.systemType).toBe('abolished');
    expect(record?.outOfDistrictCondition).toContain('松江');
    expect(record?.outOfDistrictCondition).toContain('10%');
    expect(record?.outOfDistrictCondition).toContain('5%');
  });

  it('yamaguchiは学区制度が無く、周防大島高校のみ県外受入30%枠という逆パターンの特例を持つ', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'yamaguchi');
    expect(record?.systemType).toBe('abolished');
    expect(record?.outOfDistrictCondition).toContain('周防大島');
    expect(record?.outOfDistrictCondition).toContain('30%');
  });

  it('ishikawaは平成17年度(2005年度)に学区を廃止した(一次資料で直接確認済み・廃止前3学区は二次資料のみ)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'ishikawa');
    expect(record?.abolishedFiscalYear).toBe('平成17年度（2005年度）');
    expect(record?.outOfDistrictCondition).toContain('加賀');
  });

  it('hiroshimaは平成18年度(2006年度)に6学区制(全日制普通科)を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'hiroshima');
    expect(record?.abolishedFiscalYear).toBe('平成18年度（2006年度）');
    expect(record?.outOfDistrictCondition).toContain('30%');
  });

  it('wakayamaは平成15年度(2003年度)に東京都と並び全国最速で学区を廃止した', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'wakayama');
    expect(record?.abolishedFiscalYear).toBe('平成15年度（2003年度）');
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
    expect(hasDistrictSystem(SCHOOL_DISTRICT_BY_PREFECTURE, 'tottori')).toBeNull();
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

  it('prefecturesBySystemTypeはdistrictedでaichi/chiba/ehime/fukuoka/fukushima/hokkaido/hyogo/iwate/kagawa/kagoshima/kumamoto/kyoto/mie/nagano/nagasaki/okayama/okinawa/tokushima/yamagataを含む', () => {
    expect(prefecturesBySystemType(SCHOOL_DISTRICT_BY_PREFECTURE, 'districted')).toEqual([
      'aichi',
      'chiba',
      'ehime',
      'fukuoka',
      'fukushima',
      'hokkaido',
      'hyogo',
      'iwate',
      'kagawa',
      'kagoshima',
      'kumamoto',
      'kyoto',
      'mie',
      'nagano',
      'nagasaki',
      'okayama',
      'okinawa',
      'tokushima',
      'yamagata',
    ]);
  });

  it('nagasakiは districted で県南/県央/島原/県北/五島/壱岐/対馬の7学区を持ち、学区外は定員7%以内(80%未満校は超過可)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'nagasaki');
    expect(record?.systemType).toBe('districted');
    expect(record?.districts?.length).toBe(7);
    expect(record?.districts?.map((d) => d.name)).toEqual(['県南学区', '県央学区', '島原学区', '県北学区', '五島学区', '壱岐学区', '対馬学区']);
    expect(record?.outOfDistrictCondition).toContain('7%');
    expect(record?.outOfDistrictCondition).toContain('80%');
  });

  it('ehimeは districted で東予/中予/南予の3学区を持ち、学区外は5%(教育長裁量で最大30%)まで', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'ehime');
    expect(record?.systemType).toBe('districted');
    expect(record?.districts?.length).toBe(3);
    expect(record?.districts?.map((d) => d.name)).toEqual(['東予学区', '中予学区', '南予学区']);
    expect(record?.outOfDistrictCondition).toContain('30%');
  });

  it('fukuokaは districted で13学区(中学区制)を持ち、福岡市は複数学区にまたがって分割される', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'fukuoka');
    expect(record?.systemType).toBe('districted');
    expect(record?.districts?.length).toBe(13);
    expect(record?.districts?.[3].name).toBe('第四学区');
    expect(record?.outOfDistrictCondition).toContain('教育長');
  });

  it('iwateは districted で8学区を持ち、学区外入学は定員10%の範囲内に制限される', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'iwate');
    expect(record?.systemType).toBe('districted');
    expect(record?.districts?.length).toBe(8);
    expect(record?.districts?.[0].name).toBe('盛岡学区');
    expect(record?.outOfDistrictCondition).toContain('10%');
  });

  it('kumamotoは districted で県北/県央/県南の3学区を持ち、対象は全日制普通科のみ(専門学科等は県下全域)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'kumamoto');
    expect(record?.systemType).toBe('districted');
    expect(record?.districts?.length).toBe(3);
    expect(record?.districts?.map((d) => d.name)).toEqual(['県央学区', '県北学区', '県南学区']);
    expect(record?.outOfDistrictCondition).toContain('総合学科');
  });

  it('kyotoは districted で全日制普通科(単位制除く)のみ5学区(通学圏)を持つ(専門学科・総合学科・定通は府全域)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'kyoto');
    expect(record?.districts?.length).toBe(5);
    expect(record?.districts?.map((d) => d.name)).toEqual([
      '京都市・乙訓通学圏',
      '山城通学圏',
      '口丹通学圏',
      '中丹通学圏',
      '丹後通学圏',
    ]);
    expect(record?.outOfDistrictCondition).toContain('普通科');
    expect(record?.outOfDistrictCondition).toContain('30');
  });

  it('fukushimaは districted で普通科8学区(県北/県中/県南/耶麻/会津/相馬/双葉/いわき)を持つ(それ以外の学科は県下一円)', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'fukushima');
    expect(record?.districts?.length).toBe(8);
    expect(record?.districts?.map((d) => d.name)).toEqual([
      '県北学区',
      '県中学区',
      '県南学区',
      '耶麻学区',
      '会津学区',
      '相馬学区',
      '双葉学区',
      'いわき学区',
    ]);
    expect(record?.outOfDistrictCondition).toContain('普通科のみ');
    expect(record?.outOfDistrictCondition).toContain('20%');
  });

  it('yamagataは districted で普通科4学区(東/北/南/西)を持ち、理数科は東・北を統合した3区分になる', () => {
    const record = getSchoolDistrict(SCHOOL_DISTRICT_BY_PREFECTURE, 'yamagata');
    expect(record?.districts?.length).toBe(4);
    expect(record?.districts?.map((d) => d.name)).toEqual(['東学区', '北学区', '南学区', '西学区']);
    expect(record?.outOfDistrictCondition).toContain('教育長の裁量');
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
