/**
 * generateDynamicFAQ の契約テスト。
 * 47都道府県の /{code}/naishin の可視FAQ＋FAQPageSchema は同じこの関数が正準ソース。
 * 追加した「オール3の確定値」「効率の良い教科」が検証済みデータと一致することを固定する。
 */

import { generateDynamicFAQ } from '../prefecture-guides';
import { getPrefectureByCode } from '../prefectures';
import { calculateTotalScore } from '../utils';
import { DEFAULT_SCORES } from '../constants';
import type { Scores, SubjectKey } from '../types';

const allThrees: Scores = (Object.keys(DEFAULT_SCORES) as SubjectKey[]).reduce(
  (acc, k) => ({ ...acc, [k]: 3 }),
  {} as Scores,
);

describe('generateDynamicFAQ', () => {
  test('5項目を返し、すべて非空のQ/A', () => {
    const p = getPrefectureByCode('tokyo')!;
    const faq = generateDynamicFAQ('tokyo', p);
    expect(faq.length).toBe(5);
    faq.forEach((f) => {
      expect(f.question.trim().length).toBeGreaterThan(0);
      expect(f.answer.trim().length).toBeGreaterThan(0);
      expect(f.question).toContain('東京都');
    });
  });

  test('オール3の値が検証済みデータと一致（東京=39・兵庫=150）', () => {
    for (const code of ['tokyo', 'hyogo', 'osaka', 'kanagawa']) {
      const p = getPrefectureByCode(code)!;
      const faq = generateDynamicFAQ(code, p);
      const all3 = calculateTotalScore(allThrees, code);
      const item = faq.find((f) => f.question.includes('オール3'));
      expect(item).toBeDefined();
      expect(item!.answer).toContain(`${all3}点`);
      expect(item!.answer).toContain(`${p.maxScore}点満点`);
    }
    // スポット値（回帰防止）
    expect(calculateTotalScore(allThrees, 'tokyo')).toBe(39);
    expect(calculateTotalScore(allThrees, 'hyogo')).toBe(150);
  });

  test('効率の良い教科は実技倍率で出し分け（東京=実技/埼玉=底上げ）', () => {
    const tokyo = generateDynamicFAQ('tokyo', getPrefectureByCode('tokyo')!);
    const tokyoEff = tokyo.find((f) => f.question.includes('効率'))!;
    expect(tokyoEff.answer).toContain('実技4教科');

    const saitama = generateDynamicFAQ('saitama', getPrefectureByCode('saitama')!);
    const saitamaEff = saitama.find((f) => f.question.includes('効率'))!;
    expect(saitamaEff.answer).toContain('全教科が同じ重み');
  });
});
