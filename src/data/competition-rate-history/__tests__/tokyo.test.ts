import { checkYearTotal } from '@/lib/competition-rate-history';
import { TOKYO_COMPETITION_RATE_HISTORY } from '../tokyo';

const CATEGORY_DETAIL_YEARS = TOKYO_COMPETITION_RATE_HISTORY.years.filter((y) => y.granularity === 'category-detail');
const GRAND_TOTAL_ONLY_YEARS = TOKYO_COMPETITION_RATE_HISTORY.years.filter((y) => y.granularity === 'grand-total-only');

/**
 * Λ-4パイロット（多年度アーカイブ・東京都）DoD検証: 各年度の区分別内訳を積み上げた合計が、
 * 一次ソース(総括表PDF)の「全日制合計」行と完全一致することを機械的に突合する。
 * 令和5・令和4年度は原資料に訂正履歴があり区分内訳の転記精度に自信が持てなかったため
 * grand-total-only（全日制合計のみ・二次情報源でクロスチェック済み）として別枠で検証する。
 */
describe('東京都 多年度アーカイブ（Λ-4パイロット・令和8〜令和2の7年度分）', () => {
  it('7年度分（令和8〜令和2年度）を収録している', () => {
    expect(TOKYO_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(TOKYO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  describe('category-detail年度（令和8・令和7・令和6）', () => {
    it.each(CATEGORY_DETAIL_YEARS)('$fiscalYear: 全区分の合計が公式「全日制合計」と完全一致する', (snapshot) => {
      const result = checkYearTotal(snapshot, snapshot.grandTotal, () => true);
      expect(result.matches).toBe(true);
      expect(result.actualQuota).toBe(snapshot.grandTotal.quota);
      expect(result.actualApplicants).toBe(snapshot.grandTotal.applicants);
    });

    it('令和8年度の全日制合計は一次PDF直読み値(募集30,439・応募38,148・倍率1.25)と一致する', () => {
      const r8 = CATEGORY_DETAIL_YEARS[0];
      expect(r8.grandTotal.quota).toBe(30439);
      expect(r8.grandTotal.applicants).toBe(38148);
      expect(r8.grandTotal.rate).toBeCloseTo(1.25, 2);
    });

    it('令和7年度の全日制合計は報道発表値(募集30,078・応募38,718・倍率1.29)と一致する', () => {
      const r7 = CATEGORY_DETAIL_YEARS[1];
      expect(r7.grandTotal.quota).toBe(30078);
      expect(r7.grandTotal.applicants).toBe(38718);
      expect(r7.grandTotal.rate).toBeCloseTo(1.29, 2);
    });

    it.each(CATEGORY_DETAIL_YEARS)(
      '$fiscalYear: 普通科5区分の合計が普通科合計相当(令和8=24,304/令和7=23,999/令和6=24,219)と一致する',
      (snapshot) => {
        const generalLabels = new Set([
          '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計',
          '普通科(島しょ)計',
          'コース制計',
          '単位制計',
          '海外帰国生徒対象計',
        ]);
        const expected = snapshot.fiscalYear.startsWith('令和8')
          ? { quota: 24304, applicants: 31950 }
          : snapshot.fiscalYear.startsWith('令和7')
            ? { quota: 23999, applicants: 32177 }
            : { quota: 24219, applicants: 35204 };
        const result = checkYearTotal(
          snapshot,
          { label: '普通科合計', ...expected, rate: 0 },
          (c) => generalLabels.has(c.label)
        );
        expect(result.matches).toBe(true);
      }
    );

    it.each(CATEGORY_DETAIL_YEARS)(
      '$fiscalYear: 専門学科16学科の合計が専門学科合計相当(令和8=4,509/令和7=4,453/令和6=4,498)と一致する',
      (snapshot) => {
        const excluded = new Set([
          '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計',
          '普通科(島しょ)計',
          'コース制計',
          '単位制計',
          '海外帰国生徒対象計',
          '総合学科',
        ]);
        const expected = snapshot.fiscalYear.startsWith('令和8')
          ? { quota: 4509, applicants: 4214 }
          : snapshot.fiscalYear.startsWith('令和7')
            ? { quota: 4453, applicants: 4505 }
            : { quota: 4498, applicants: 4658 };
        const result = checkYearTotal(
          snapshot,
          { label: '専門学科合計', ...expected, rate: 0 },
          (c) => !excluded.has(c.label)
        );
        expect(result.matches).toBe(true);
      }
    );
  });

  describe('grand-total-only年度（令和5・令和4・令和3・令和2）', () => {
    it.each(GRAND_TOTAL_ONLY_YEARS)('$fiscalYear: categoriesは空(内訳は未収録と正直に記録)', (snapshot) => {
      expect(snapshot.categories).toHaveLength(0);
    });

    it('令和5年度の全日制合計は二次情報源(よみうり進学メディア等)と一致する(募集30,825・応募42,238・倍率1.37)', () => {
      const r5 = GRAND_TOTAL_ONLY_YEARS[0];
      expect(r5.grandTotal.quota).toBe(30825);
      expect(r5.grandTotal.applicants).toBe(42238);
      expect(r5.grandTotal.rate).toBeCloseTo(1.37, 2);
    });

    it('令和4年度の全日制合計は二次情報源と一致する(募集30,306・応募41,489・倍率1.37)', () => {
      const r4 = GRAND_TOTAL_ONLY_YEARS[1];
      expect(r4.grandTotal.quota).toBe(30306);
      expect(r4.grandTotal.applicants).toBe(41489);
      expect(r4.grandTotal.rate).toBeCloseTo(1.37, 2);
    });

    it('令和3年度の全日制合計は令和4年度総括表の前年度欄と一致する(募集29,509・応募39,785・倍率1.35)', () => {
      const r3 = GRAND_TOTAL_ONLY_YEARS[2];
      expect(r3.grandTotal.quota).toBe(29509);
      expect(r3.grandTotal.applicants).toBe(39785);
      expect(r3.grandTotal.rate).toBeCloseTo(1.35, 2);
    });

    it('令和2年度の全日制合計は令和3年度公式発表PDFの前年度欄・リセモム確定記事の2ソースが一致する(募集30,501・応募42,577・倍率1.40)', () => {
      const r2 = GRAND_TOTAL_ONLY_YEARS[3];
      expect(r2.grandTotal.quota).toBe(30501);
      expect(r2.grandTotal.applicants).toBe(42577);
      expect(r2.grandTotal.rate).toBeCloseTo(1.4, 2);
    });
  });
});
