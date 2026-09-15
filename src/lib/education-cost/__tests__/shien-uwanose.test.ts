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
