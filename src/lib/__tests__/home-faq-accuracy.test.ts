/**
 * ホームページ(src/app/page.tsx)のHOME_FAQSは都道府県ごとの実技倍率を本文中に直接
 * 手書きしているため、prefectures.ts側の実データと静かに乖離するリスクがある。
 * 2026-07-23実際に発生した事故（群馬/宮崎=1倍を「2倍」と誤記・沖縄=1.5倍を「2倍」と誤記・
 * 大分=4倍を「2倍」と誤記・鹿児島=20倍を「実技50点換算」という実データに存在しない表現で誤記）
 * の再発を防ぐ回帰テスト。
 */
import { HOME_FAQS } from '../home-faq-content';
import { getPrefectureByCode } from '../prefectures';

describe('ホームページFAQの都道府県別実技倍率の記述精度', () => {
  const practicalFaq = HOME_FAQS.find((f) => f.question.includes('2倍計算'));

  test('該当FAQが存在する', () => {
    expect(practicalFaq).toBeDefined();
  });

  test('「実技4教科を2倍計算する」と明言された都道府県は実際にpracticalMultiplier===2である', () => {
    // 「はい、東京都・宮城県・秋田県・福島県など、実技4教科を2倍計算する都道府県の方式に」の
    // ような文から、「2倍」の直前に列挙された都道府県名を抽出して検証する。
    const twoTimesClause = practicalFaq!.answer.split('実技4教科を2倍計算する')[0];
    const names = twoTimesClause.match(/[一-龥]+[都道府県]/g) ?? [];
    expect(names.length).toBeGreaterThan(0);

    const nameToCode: Record<string, string> = {
      東京都: 'tokyo', 宮城県: 'miyagi', 秋田県: 'akita', 福島県: 'fukushima',
      群馬県: 'gunma', 大分県: 'oita', 宮崎県: 'miyazaki', 沖縄県: 'okinawa', 兵庫県: 'hyogo',
    };
    for (const name of names) {
      const code = nameToCode[name];
      expect(code).toBeDefined();
      const pref = getPrefectureByCode(code)!;
      expect(pref.practicalMultiplier).toBe(2);
    }
  });

  test('兵庫・大分・鹿児島の「特殊な方式」の倍率表記が実データと一致する', () => {
    const hyogo = getPrefectureByCode('hyogo')!;
    const oita = getPrefectureByCode('oita')!;
    const kagoshima = getPrefectureByCode('kagoshima')!;

    expect(practicalFaq!.answer).toContain(`兵庫県（実技${hyogo.practicalMultiplier}倍）`);
    expect(practicalFaq!.answer).toContain(`大分県（実技${oita.practicalMultiplier}倍）`);
    expect(practicalFaq!.answer).toContain(`鹿児島県（実技${kagoshima.practicalMultiplier}倍`);
    expect(practicalFaq!.answer).toContain(`${kagoshima.maxScore}点満点`);
  });
});
