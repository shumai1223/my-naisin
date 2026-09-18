import { SHIEN_UWANOSE_BY_PREFECTURE } from '@/data/shien-uwanose';
import {
  findUwanoseAmountForTierLabel,
  getShienUwanose,
  prefecturesByStatus,
} from '../shien-uwanose';

describe('T-Y13 都道府県独自上乗せ制度', () => {
  it('getShienUwanoseは登録済み県（tokyo）のレコードを返す', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'tokyo');
    expect(record).toBeDefined();
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.schemeType).toBe('household');
    expect(record?.source.url).toContain('shigaku-tokyo.or.jp');
  });

  it('getShienUwanoseは未登録県（例: akita）にundefinedを返す（unknown扱い）', () => {
    expect(getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'akita')).toBeUndefined();
  });

  it('findUwanoseAmountForTierLabelはtokyoの一律区分で年額43,800円を返す', () => {
    const amount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'tokyo',
      '所得制限なし（一律）'
    );
    expect(amount).toBe(43800);
  });

  it('findUwanoseAmountForTierLabelは存在しない区分ラベルにnullを返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'tokyo', '存在しない区分')
    ).toBeNull();
  });

  it('findUwanoseAmountForTierLabelは未登録県にnullを返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'akita', '所得制限なし（一律）')
    ).toBeNull();
  });

  it('prefecturesByStatusはconfirmed-yesでtokyo/osakaを含む', () => {
    const yesPrefs = prefecturesByStatus(SHIEN_UWANOSE_BY_PREFECTURE, 'confirmed-yes');
    expect(yesPrefs).toContain('tokyo');
    expect(yesPrefs).toContain('osaka');
  });

  it('osakaは合算後の標準授業料上限(63万円)を返す', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'osaka');
    expect(record?.status).toBe('confirmed-yes');
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'osaka', '世帯年収 約910万円未満（目安）')
    ).toBe(630000);
  });

  it('mieは授業料上乗せ(年額12,000円)と入学金補助(上限25,000円)を別tierで持つ', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'mie');
    expect(record?.tiers).toHaveLength(2);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'mie',
        '世帯年収 約590〜910万円未満（目安・授業料上乗せ）'
      )
    ).toBe(12000);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'mie',
        '道府県民税・市町村民税所得割合算8万5,500円未満（入学金補助）'
      )
    ).toBe(25000);
  });

  it('yamanashiは入学金サポート(20万円)と入学準備サポート(5万円)を別tierで持つ', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'yamanashi');
    expect(record?.tiers).toHaveLength(2);
    const amounts = record?.tiers?.map((t) => t.annualAmountJpy).sort((a, b) => a - b);
    expect(amounts).toEqual([50000, 200000]);
  });

  it('nagasakiは3所得区分(590-720万/270万未満通信制/生活保護)を持つ', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'nagasaki');
    expect(record?.tiers).toHaveLength(3);
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'nagasaki', '生活保護世帯等')
    ).toBe(63600);
  });

  it('hyogoは3所得区分(590/730/910万未満・兵庫県内校)を持つ', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'hyogo');
    expect(record?.tiers).toHaveLength(3);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'hyogo',
        '前年収入目安 730万円未満程度（兵庫県内の私立高校）'
      )
    ).toBe(120000);
  });

  it('kyotoは生活保護世帯で国+府合算年額98万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'kyoto', '生活保護世帯')
    ).toBe(980000);
  });

  it('kanagawaは年収750万円未満で授業料上乗せ年額22,800円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'kanagawa', '年収750万円未満（目安・授業料上乗せ）')
    ).toBe(22800);
  });

  it('aichiは全日制の入学納付金補助上限20万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'aichi', '全日制（所得制限なし・入学納付金補助）')
    ).toBe(200000);
  });

  it('oitaは年収590〜910万円未満世帯で年額12万円(月1万円上乗せ)を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'oita', '世帯年収 約590万円〜910万円未満')
    ).toBe(120000);
  });

  it('hiroshimaは年収270万円未満で就学支援金との合計上限年額60万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'hiroshima',
        '生活保護受給世帯・年収目安270万円未満（算定基準額0円）'
      )
    ).toBe(600000);
  });

  it('tottoriは生活保護受給世帯で年額86,400円(月7,200円上乗せ)を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'tottori', '生活保護受給世帯')
    ).toBe(86400);
  });

  it('yamaguchiは世帯年収350万円未満程度で入学時納付金補助7万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'yamaguchi', '世帯年収350万円未満程度（入学時納付金補助）')
    ).toBe(70000);
  });

  it('naraは所得制限なし(全日制)で就学支援金等合算上限年額63万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'nara', '所得制限なし（令和8年度から撤廃・全日制・定時制）')
    ).toBe(630000);
  });

  it('gunmaはイ区分(年収400万円未満)の授業料減免で年額33.6万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'gunma',
        'イ区分（年収400万円未満かつ資産700万円未満・授業料減免）'
      )
    ).toBe(336000);
  });

  it('tochigiは住民税非課税世帯(全日制)で入学料減免7万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'tochigi', '住民税非課税世帯（全日制・入学料減免）')
    ).toBe(70000);
  });

  it('ibarakiは年収約350万円未満世帯(全日制)で入学金減免9.6万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'ibaraki', '年収約350万円未満世帯（全日制・入学金減免）')
    ).toBe(96000);
  });

  it('fukuiは世帯年収約270万円未満で年額9万円(月7,500円上乗せ)を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'fukui', '世帯年収 約270万円未満')
    ).toBe(90000);
  });

  it('okayamaは年収270万円未満程度で年額6万円を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'okayama', '年収270万円未満程度')
    ).toBe(60000);
  });

  it('hokkaidoは世帯年収約590万円未満で年額2.4万円(月2,000円上乗せ)を返す', () => {
    expect(
      findUwanoseAmountForTierLabel(SHIEN_UWANOSE_BY_PREFECTURE, 'hokkaido', '世帯年収 約590万円未満')
    ).toBe(24000);
  });

  it('saitamaは基準②の2〜3年生で国の就学支援金のみ(457,200円)=県独自上乗せが実質ゼロになる', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'saitama');
    expect(record?.tiers).toHaveLength(5);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'saitama',
        '基準②（目安年収約500万円〜609万円未満）・2〜3年生'
      )
    ).toBe(457200);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'saitama',
        '生活保護受給・家計急変世帯、または基準①（目安年収約500万円未満）・1年生'
      )
    ).toBe(880200);
  });

  it('chibaの従来の授業料減免制度は令和8年度から廃止され、経過措置のみが令和8年度新入生・在校生に限り令和10年度まで続く', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'chiba');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.note).toContain('廃止');
    expect(record?.tiers?.[0].note).toContain('令和10年度');
  });

  it('shizuokaは世帯年収590〜700万円未満で最大の上乗せ幅(年額277,200円)を返す(非単調な所得階層)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'shizuoka');
    expect(record?.schemeType).toBe('school-subsidy');
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'shizuoka',
        '概ねの世帯年収 590万円以上700万円未満'
      )
    ).toBe(277200);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'shizuoka',
        '概ねの世帯年収 350万円以上590万円未満'
      )
    ).toBe(0);
  });

  it('niigataは「算定基準額」という技術的基準を用い、全額軽減分(全日制)で年額396,000円を返す', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'niigata');
    expect(record?.schemeType).toBe('school-subsidy');
    expect(record?.note).toContain('算定基準額');
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'niigata',
        '授業料軽減補助・全額軽減分・全日制（生活保護対象者、または算定基準額51,300円未満）'
      )
    ).toBe(396000);
  });

  it('toyamaは多子・ひとり親世帯で通常の3.5倍(年額277,200円)の授業料助成を返す', () => {
    const normal = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'toyama',
      '算定基準額154,500円以上304,200円未満（年収目安590万円以上910万円未満）・多子(3人以上)またはひとり親世帯以外'
    );
    const tashi = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'toyama',
      '算定基準額154,500円以上304,200円未満（年収目安590万円以上910万円未満）・多子(3人以上)またはひとり親世帯'
    );
    expect(normal).toBe(79200);
    expect(tashi).toBe(277200);
  });

  it('sagaは授業料の県独自上乗せは無く、入学金等補助（上限27,000円）のみ確認できる', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'saga');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.schemeType).toBe('school-subsidy');
    expect(record?.note).toContain('授業料上乗せ加算は、一次資料の範囲では確認できなかった');
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'saga',
        '入学金等補助（年収目安590万円未満世帯・新入生および転入学者）'
      )
    ).toBe(27000);
  });

  it('yamagataは算定額154,500円未満区分で月額1,000円(年額12,000円)の県単上乗せを返す', () => {
    const amount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'yamagata',
      '算定式による算出額（市町村民税課税標準額×6%－調整控除額）＜154,500円'
    );
    expect(amount).toBe(12000);
  });

  it('yamagataは算定額304,200円以上区分で県単上乗せが無い(0円)', () => {
    const amount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'yamagata',
      '算定式による算出額≧304,200円'
    );
    expect(amount).toBe(0);
  });

  it('fukushimaは授業料支援で国の就学支援金との合算上限額(生活保護546,000円/年収450万円以下471,000円)を返す(saitama/hiroshimaと同型の合算値方式)', () => {
    const seikatsuhogo = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'fukushima',
      '生活保護世帯（授業料支援・支給上限額）'
    );
    const nenshu450 = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'fukushima',
      '生活保護世帯を除く年収450万円以下の世帯等（被災世帯・家計急変世帯を含む・授業料支援・支給上限額）'
    );
    expect(seikatsuhogo).toBe(546000);
    expect(nenshu450).toBe(471000);
  });

  it('fukushimaは入学料支援(生活保護・非課税世帯50,000円/年収590万円未満25,000円)を授業料支援と別建てで持つ', () => {
    const amount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'fukushima',
      '入学料支援（生活保護・非課税世帯・私立高等学校新入生）'
    );
    expect(amount).toBe(50000);
  });

  it('kagawaは授業料への県独自上乗せは無く、入学金軽減補助(全日制50,000円/通信制15,000円)のみ確認できる', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'kagawa');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.note).toContain('授業料についての県独自上乗せ制度は、一次資料の範囲(このページ)では確認できなかった');
    const zennichi = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'kagawa',
      '（市町村民税課税標準額×6%－調整控除額）154,500円未満（世帯年収目安590万円未満程度）・全日制高校'
    );
    const tsushin = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'kagawa',
      '（市町村民税課税標準額×6%－調整控除額）154,500円未満（世帯年収目安590万円未満程度）・通信制高校'
    );
    expect(zennichi).toBe(50000);
    expect(tsushin).toBe(15000);
  });

  it('naganoは就学支援金の受給期間満了者向けに授業料軽減の上限337,200円を返す(在学中通常期間の上乗せとは異なる制度)', () => {
    const amount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'nagano',
      '授業料軽減(就学支援金の受給期間満了者、または単位制課程で支給対象単位数が74単位を超えた者・12月[通信制課程は24月]以内)'
    );
    expect(amount).toBe(337200);
  });

  it('naganoは入学金軽減(年収目安590万円未満)で24,500円を返す', () => {
    const amount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'nagano',
      '入学金軽減(保護者等の年収目安が約590万円未満)'
    );
    expect(amount).toBe(24500);
  });

  it('wakayamaは奨学のための給付金(私立)で非課税世帯152,000円・生活保護受給世帯52,600円を返す(授業料そのものへの県独自上乗せは未確認)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'wakayama');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.schemeType).toBe('household');
    expect(record?.tiers).toHaveLength(4);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'wakayama',
        '非課税世帯（全日制・定時制・通常申請のみの場合）'
      )
    ).toBe(152000);
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'wakayama',
        '生活保護受給世帯（全日制・定時制・通常申請のみの場合）'
      )
    ).toBe(52600);
  });

  it('ehimeは奨学のための給付金(私立)で非課税世帯152,000円を返し、wakayamaと完全一致する(国基準額の可能性を補強)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'ehime');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.schemeType).toBe('household');
    expect(record?.tiers).toHaveLength(4);
    const ehimeAmount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'ehime',
      '道府県民税所得割及び市町村民税所得割非課税世帯（通信制以外）'
    );
    const wakayamaAmount = findUwanoseAmountForTierLabel(
      SHIEN_UWANOSE_BY_PREFECTURE,
      'wakayama',
      '非課税世帯（全日制・定時制・通常申請のみの場合）'
    );
    expect(ehimeAmount).toBe(152000);
    expect(ehimeAmount).toBe(wakayamaAmount);
  });

  it('aomoriは就学支援費補助金(県独自の入学金補助・年収270万円未満新入生)で年額50,000円を返す', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'aomori');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.schemeType).toBe('school-subsidy');
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'aomori',
        '年収目安270万円未満（算出額0円・非課税相当世帯）・当該年度の新入生（入学金補助）'
      )
    ).toBe(50000);
  });

  it('shimaneは差額補填型(上限の定めなし)で基準点457,200円を返す(実際の補助額は授業料実費との差額)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'shimane');
    expect(record?.status).toBe('confirmed-yes');
    expect(record?.schemeType).toBe('school-subsidy');
    expect(record?.tiers?.[0].note).toContain('補助額そのもの」ではなく');
    expect(
      findUwanoseAmountForTierLabel(
        SHIEN_UWANOSE_BY_PREFECTURE,
        'shimane',
        '世帯年収目安270万円未満程度（生活保護受給、または算定基準額0円）（差額補填・上限の定めなし）'
      )
    ).toBe(457200);
  });

  it('tokushimaは一次資料を確認のうえ授業料への県独自上乗せが無いと確認できた(confirmed-none)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'tokushima');
    expect(record?.status).toBe('confirmed-none');
    expect(record?.tiers).toBeUndefined();
    expect(record?.note).toContain('確認できなかった');
  });

  it('kochiは一次資料を確認のうえ授業料への県独自上乗せが無いと確認できた(confirmed-none)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'kochi');
    expect(record?.status).toBe('confirmed-none');
    expect(record?.tiers).toBeUndefined();
    expect(record?.note).toContain('確認できなかった');
  });

  it('kumamotoは一次資料を確認のうえ授業料への県独自上乗せが無いと確認できた(confirmed-none)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'kumamoto');
    expect(record?.status).toBe('confirmed-none');
    expect(record?.tiers).toBeUndefined();
    expect(record?.note).toContain('確認できなかった');
  });

  it('miyazakiは一次資料を確認のうえ授業料への県独自上乗せが無いと確認できた(confirmed-none)', () => {
    const record = getShienUwanose(SHIEN_UWANOSE_BY_PREFECTURE, 'miyazaki');
    expect(record?.status).toBe('confirmed-none');
    expect(record?.tiers).toBeUndefined();
    expect(record?.note).toContain('確認できなかった');
  });

  it('登録済みレコードは全てfiscalYear・source.url・source.lastCheckedを持つ（Y-0: 1データ点1出典）', () => {
    for (const record of Object.values(SHIEN_UWANOSE_BY_PREFECTURE)) {
      expect(record?.fiscalYear.length).toBeGreaterThan(0);
      expect(record?.source.url.length).toBeGreaterThan(0);
      expect(record?.source.lastChecked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('confirmed-yesのレコードはtiersを持ち、各tierのannualAmountJpyは非負', () => {
    for (const record of Object.values(SHIEN_UWANOSE_BY_PREFECTURE)) {
      if (record?.status !== 'confirmed-yes') continue;
      expect(record.tiers?.length).toBeGreaterThan(0);
      for (const tier of record.tiers ?? []) {
        expect(tier.annualAmountJpy).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
