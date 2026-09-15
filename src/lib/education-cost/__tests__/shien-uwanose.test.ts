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

  it('prefecturesByStatusはconfirmed-yesでtokyoを含む', () => {
    expect(prefecturesByStatus(SHIEN_UWANOSE_BY_PREFECTURE, 'confirmed-yes')).toContain('tokyo');
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
