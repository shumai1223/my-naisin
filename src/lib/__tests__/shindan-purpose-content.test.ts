/**
 * 目的別「偏差値診断」コンテンツ（S-2②）の整合性テスト。
 * 3目的分を手書きするページのため、コピペ起因の重複（scaled content）が無いことを固定する。
 */
import { SHINDAN_PURPOSE_CONTENTS, getShindanPurposeContent } from '@/lib/shindan-purpose-content';

describe('SHINDAN_PURPOSE_CONTENTS', () => {
  it('志望校の決め方・内申挽回・塾要否の3目的が揃う', () => {
    expect(SHINDAN_PURPOSE_CONTENTS.map((p) => p.slug).sort()).toEqual(['juku', 'naishin-bankai', 'shiboukou']);
  });

  it('各目的のconcernはShindanQuizのQ5選択肢の値と一致する', () => {
    const validConcerns = ['reach', 'improve', 'juku', 'futoukou'];
    for (const p of SHINDAN_PURPOSE_CONTENTS) {
      expect(validConcerns).toContain(p.concern);
    }
  });

  it('各目的のlead文はすべて異なる（コピペ重複なし）', () => {
    const leads = SHINDAN_PURPOSE_CONTENTS.map((p) => p.lead);
    expect(new Set(leads).size).toBe(leads.length);
  });

  it('各目的は3件以上のuseCaseと3件以上のFAQを持つ', () => {
    for (const p of SHINDAN_PURPOSE_CONTENTS) {
      expect(p.useCase.length).toBeGreaterThanOrEqual(3);
      expect(p.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('FAQの質問文は目的をまたいで重複しない（コピペ重複なし）', () => {
    const allQuestions = SHINDAN_PURPOSE_CONTENTS.flatMap((p) => p.faqs.map((f) => f.question));
    expect(new Set(allQuestions).size).toBe(allQuestions.length);
  });

  it('useCaseのtitleは目的をまたいで重複しない', () => {
    const allTitles = SHINDAN_PURPOSE_CONTENTS.flatMap((p) => p.useCase.map((u) => u.title));
    expect(new Set(allTitles).size).toBe(allTitles.length);
  });

  it('getShindanPurposeContentは存在するslugを返し、存在しないslugはundefined', () => {
    expect(getShindanPurposeContent('juku')?.label).toBe('塾要否');
    expect(getShindanPurposeContent('nonexistent')).toBeUndefined();
  });
});
