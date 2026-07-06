/**
 * 学年別「内申点の上げ方」コンテンツ（A-4）の整合性テスト。
 * 3学年分を手書きするページのため、コピペ起因の重複（scaled content）が無いことを固定する。
 */
import { GRADE_CONTENTS, getGradeContent } from '@/lib/naishin-grade-content';

describe('GRADE_CONTENTS', () => {
  it('中1・中2・中3の3学年が揃う', () => {
    expect(GRADE_CONTENTS.map((g) => g.grade).sort()).toEqual([1, 2, 3]);
    expect(GRADE_CONTENTS.map((g) => g.slug).sort()).toEqual(['chu1', 'chu2', 'chu3']);
  });

  it('各学年のlead文はすべて異なる（コピペ重複なし）', () => {
    const leads = GRADE_CONTENTS.map((g) => g.lead);
    expect(new Set(leads).size).toBe(leads.length);
  });

  it('各学年は4件以上の優先事項と3件以上のFAQを持つ', () => {
    for (const g of GRADE_CONTENTS) {
      expect(g.priorities.length).toBeGreaterThanOrEqual(4);
      expect(g.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('FAQの質問文は学年をまたいで重複しない（コピペ重複なし）', () => {
    const allQuestions = GRADE_CONTENTS.flatMap((g) => g.faqs.map((f) => f.question));
    expect(new Set(allQuestions).size).toBe(allQuestions.length);
  });

  it('優先事項のtitleは学年をまたいで重複しない', () => {
    const allTitles = GRADE_CONTENTS.flatMap((g) => g.priorities.map((p) => p.title));
    expect(new Set(allTitles).size).toBe(allTitles.length);
  });

  it('getGradeContentは存在するslugを返し、存在しないslugはundefined', () => {
    expect(getGradeContent('chu3')?.label).toBe('中3');
    expect(getGradeContent('chu4')).toBeUndefined();
  });
});
