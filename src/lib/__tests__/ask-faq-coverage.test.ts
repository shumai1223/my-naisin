/**
 * /ask 機械列挙Q&A（S-4①）のテスト。
 */
import { buildPrefectureMaxScoreFaqs } from '../ask-faq-coverage';
import { PREFECTURES } from '../prefectures';

describe('buildPrefectureMaxScoreFaqs', () => {
  const faqs = buildPrefectureMaxScoreFaqs();

  it('47都道府県すべて分生成される', () => {
    expect(faqs.length).toBe(PREFECTURES.length);
    expect(faqs.length).toBe(47);
  });

  it('質問文はすべて異なる（重複なし）', () => {
    const questions = faqs.map((f) => f.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it('すべての回答が空でなく、都道府県名を含む', () => {
    for (let i = 0; i < faqs.length; i++) {
      const p = PREFECTURES[i];
      expect(faqs[i].answer.length).toBeGreaterThan(0);
      expect(faqs[i].answer).toContain(p.name);
    }
  });

  it('回答は満点の数値（◯点）を含む', () => {
    for (const f of faqs) {
      expect(f.answer).toMatch(/[0-9]+点/);
    }
  });
});
