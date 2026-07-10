/**
 * 学年別「偏差値診断」コンテンツ（S-2①）の整合性テスト。
 * 3学年分を手書きするページのため、コピペ起因の重複（scaled content）が無いことを固定する。
 */
import { SHINDAN_GRADE_CONTENTS, getShindanGradeContent } from '@/lib/shindan-grade-content';

describe('SHINDAN_GRADE_CONTENTS', () => {
  it('中1・中2・中3の3学年が揃う', () => {
    expect(SHINDAN_GRADE_CONTENTS.map((g) => g.grade).sort()).toEqual([1, 2, 3]);
    expect(SHINDAN_GRADE_CONTENTS.map((g) => g.slug).sort()).toEqual(['chu1', 'chu2', 'chu3']);
  });

  it('各学年のlead文はすべて異なる（コピペ重複なし）', () => {
    const leads = SHINDAN_GRADE_CONTENTS.map((g) => g.lead);
    expect(new Set(leads).size).toBe(leads.length);
  });

  it('各学年は3件以上のuseCaseと3件以上のFAQを持つ', () => {
    for (const g of SHINDAN_GRADE_CONTENTS) {
      expect(g.useCase.length).toBeGreaterThanOrEqual(3);
      expect(g.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('FAQの質問文は学年をまたいで重複しない（コピペ重複なし）', () => {
    const allQuestions = SHINDAN_GRADE_CONTENTS.flatMap((g) => g.faqs.map((f) => f.question));
    expect(new Set(allQuestions).size).toBe(allQuestions.length);
  });

  it('useCaseのtitleは学年をまたいで重複しない', () => {
    const allTitles = SHINDAN_GRADE_CONTENTS.flatMap((g) => g.useCase.map((u) => u.title));
    expect(new Set(allTitles).size).toBe(allTitles.length);
  });

  it('getShindanGradeContentは存在するslugを返し、存在しないslugはundefined', () => {
    expect(getShindanGradeContent('chu3')?.label).toBe('中3');
    expect(getShindanGradeContent('chu4')).toBeUndefined();
  });
});
