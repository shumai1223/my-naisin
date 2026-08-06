import { COMPETITION_RATE_HISTORY_BY_PREFECTURE, COMPETITION_RATE_HISTORY_FILES } from '../index';
import { sumCategories } from '@/lib/competition-rate-history';

/**
 * Λ-4（多年度アーカイブ）横断の不変条件検証。個別県ファイルのテストは各県の固定値を
 * 検証するが、こちらは46都道府県すべてに共通する構造的な整合性を機械的にチェックする
 * （新しい年度を追加した際に個別県テストの更新漏れがあっても、こちらが最低限の
 * データ健全性を担保する）。
 */
describe('多年度アーカイブ index 横断不変条件', () => {
  it('マップのキーとprefectureCodeが一致する', () => {
    for (const [code, file] of Object.entries(COMPETITION_RATE_HISTORY_BY_PREFECTURE)) {
      expect(file?.prefectureCode).toBe(code);
    }
  });

  it('全ファイルで少なくとも1年度分は収録している', () => {
    for (const file of COMPETITION_RATE_HISTORY_FILES) {
      expect(file.years.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('全年度でquota/applicants/rateが正の数値である', () => {
    for (const file of COMPETITION_RATE_HISTORY_FILES) {
      for (const year of file.years) {
        expect(year.grandTotal.quota).toBeGreaterThan(0);
        expect(year.grandTotal.applicants).toBeGreaterThan(0);
        expect(year.grandTotal.rate).toBeGreaterThan(0);
      }
    }
  });

  /**
   * precision=1(誤差0.05未満)で緩め: 一部県(niigata R8等)は原資料自体が四捨五入でなく
   * 切り捨て等の非標準的な丸め方をしているため、単純な志願者数÷募集人員では標準的な
   * 四捨五入と最大1分点ずれることがある(niigata.tsのR4/R3コメント参照・原資料の印字値を
   * 正直に転記する方針のため意図的な差)。個別県テストでは既知の年度ごとにprecision=2の
   * 厳密チェックを行っており、こちらは横断的な「桁が丸ごと間違っていないか」の粗い検証。
   */
  it('全年度で志願者数÷募集人員が公表倍率とおおむね一致する(誤差0.05未満・原資料の非標準丸めを許容)', () => {
    for (const file of COMPETITION_RATE_HISTORY_FILES) {
      for (const year of file.years) {
        const computed = year.grandTotal.applicants / year.grandTotal.quota;
        expect(computed).toBeCloseTo(year.grandTotal.rate, 1);
      }
    }
  });

  it('granularity=category-detailの年度はcategories合計がgrandTotalと一致する', () => {
    for (const file of COMPETITION_RATE_HISTORY_FILES) {
      for (const year of file.years) {
        if (year.granularity !== 'category-detail') continue;
        const sums = sumCategories(year.categories);
        expect(sums.quota).toBe(year.grandTotal.quota);
        expect(sums.applicants).toBe(year.grandTotal.applicants);
      }
    }
  });

  it('granularity=grand-total-onlyの年度はcategoriesが空である', () => {
    for (const file of COMPETITION_RATE_HISTORY_FILES) {
      for (const year of file.years) {
        if (year.granularity !== 'grand-total-only') continue;
        expect(year.categories).toHaveLength(0);
      }
    }
  });

  it('sourceUrl/sourceTitle/fetchedAtが全年度で空文字でない(1データ点1出典の機械的担保)', () => {
    for (const file of COMPETITION_RATE_HISTORY_FILES) {
      for (const year of file.years) {
        expect(year.sourceUrl.length).toBeGreaterThan(0);
        expect(year.sourceTitle.length).toBeGreaterThan(0);
        expect(year.fetchedAt.length).toBeGreaterThan(0);
      }
    }
  });

  it('目標(47都道府県×5年度=235県年)に対する現在の収録合計県年数を記録する(hokkaidoは恒久ブロック済みのため対象外)', () => {
    const totalYears = COMPETITION_RATE_HISTORY_FILES.reduce((sum, f) => sum + f.years.length, 0);
    expect(totalYears).toBeGreaterThan(0);
    // eslint-disable-next-line no-console
    console.log(`Λ-4 収録合計: ${COMPETITION_RATE_HISTORY_FILES.length}県 / ${totalYears}県年`);
  });
});
