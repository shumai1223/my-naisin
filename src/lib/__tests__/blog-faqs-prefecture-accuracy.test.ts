/**
 * blog/faqs.ts(POST_FAQS)は都道府県ごとの計算方式(満点・実技倍率・対象学年)を
 * 本文中に直接手書きしているため、prefectures.ts側の実データと静かに乖離するリスクがある
 * ([[feedback-verify-source-url-matches-pdf-read]]・home-faq-accuracy.test.tsと同種の
 * 「都道府県名+数値の手書きプローズはprefectures.tsと定期的に突合する」教訓の横展開)。
 * ここでは明示的な数値主張を含むFAQ(都道府県別カテゴリ・実技倍率比較記事)を対象に、
 * 実データとの整合性を固定する。
 */
import { POST_FAQS } from '../blog/faqs';
import { getPrefectureByCode } from '../prefectures';

describe('blog/faqs.ts の都道府県別計算方式の記述精度', () => {
  test('naishin-guide: 東京都/北海道/岩手県の満点表記が実データと一致する', () => {
    const faq = POST_FAQS['naishin-guide'].find((f) => f.question.includes('計算方法はどう違いますか'));
    expect(faq).toBeDefined();

    const tokyo = getPrefectureByCode('tokyo')!;
    const hokkaido = getPrefectureByCode('hokkaido')!;
    const iwate = getPrefectureByCode('iwate')!;

    expect(faq!.answer).toContain(`東京都は中3のみ${tokyo.maxScore}点満点`);
    expect(faq!.answer).toContain(`北海道は中1〜中3で${hokkaido.maxScore}点満点`);
    expect(faq!.answer).toContain(`岩手県は${iwate.maxScore}点満点`);
  });

  test('tokyo-naishin-calculation-guide: 換算内申の式・満点・実技倍率が実データと一致する', () => {
    const faq = POST_FAQS['tokyo-naishin-calculation-guide'].find((f) => f.question.includes('計算式を教えてください'));
    expect(faq).toBeDefined();
    const tokyo = getPrefectureByCode('tokyo')!;

    expect(tokyo.coreMultiplier).toBe(1);
    expect(faq!.answer).toContain(`実技4教科の評定合計×${tokyo.practicalMultiplier}）`);
    expect(faq!.answer).toContain(`最大${tokyo.maxScore}点`);
  });

  test('kanagawa-naishin-calculation-guide: 中2+中3×2倍・135点満点が実データと一致する', () => {
    const faq = POST_FAQS['kanagawa-naishin-calculation-guide'].find((f) => f.question.includes('何点満点ですか'));
    expect(faq).toBeDefined();
    const kanagawa = getPrefectureByCode('kanagawa')!;

    // 神奈川はtargetGrades=[2,3]・gradeMultipliers={2:1,3:2}という制度構造そのものを検証する
    expect(kanagawa.targetGrades).toEqual([2, 3]);
    expect(kanagawa.gradeMultipliers[3]).toBe(2 * kanagawa.gradeMultipliers[2]);
    expect(faq!.answer).toContain(`${kanagawa.maxScore}点満点`);
  });

  test('fukukyoka-bairitsu-by-prefecture: 兵庫・岩手の倍率、山形・福岡・青森の等倍/満点表記が実データと一致する', () => {
    const faq = POST_FAQS['fukukyoka-bairitsu-by-prefecture'].find((f) => f.question.includes('倍率が一番高い'));
    expect(faq).toBeDefined();
    const hyogo = getPrefectureByCode('hyogo')!;
    const iwate = getPrefectureByCode('iwate')!;

    expect(faq!.answer).toContain(`兵庫県（${hyogo.practicalMultiplier}倍）`);
    expect(faq!.answer).toContain(`岩手県（${iwate.practicalMultiplier}倍）`);

    const equalRateFaq = POST_FAQS['fukukyoka-bairitsu-by-prefecture'].find((f) => f.question.includes('等倍の都道府県はありますか'));
    expect(equalRateFaq).toBeDefined();

    const yamagata = getPrefectureByCode('yamagata')!;
    const fukuoka = getPrefectureByCode('fukuoka')!;
    const aomori = getPrefectureByCode('aomori')!;
    expect(yamagata.practicalMultiplier).toBe(yamagata.coreMultiplier); // 等倍
    expect(fukuoka.practicalMultiplier).toBe(fukuoka.coreMultiplier);
    expect(aomori.practicalMultiplier).toBe(aomori.coreMultiplier);

    expect(equalRateFaq!.answer).toContain(`山形県（中3のみ等倍、${yamagata.maxScore}点満点）`);
    expect(equalRateFaq!.answer).toContain(`福岡県（中3のみ等倍、${fukuoka.maxScore}点満点）`);
    expect(equalRateFaq!.answer).toContain(`青森県（中1〜中3等倍、${aomori.maxScore}点満点）`);
  });
});

describe('POST_FAQSの構造的な健全性', () => {
  it('全記事キーで質問・回答とも空文字が無い', () => {
    for (const [slug, faqs] of Object.entries(POST_FAQS)) {
      for (const faq of faqs) {
        expect(faq.question.trim().length).toBeGreaterThan(0);
        expect(faq.answer.trim().length).toBeGreaterThan(0);
      }
      expect(faqs.length).toBeGreaterThan(0);
    }
  });

  it('同一記事内で質問文が重複していない(コピペミスの検出)', () => {
    for (const [slug, faqs] of Object.entries(POST_FAQS)) {
      const questions = faqs.map((f) => f.question);
      const unique = new Set(questions);
      expect(unique.size).toBe(questions.length);
    }
  });
});
