/**
 * 教科別「偏差値の上げ方」コンテンツ（A-3）の整合性テスト。
 * 5教科分を手書きするページのため、コピペ起因の重複（scaled content）が無いことを固定する。
 */
import { SUBJECT_CONTENTS, getSubjectContent } from '@/lib/hensachi-subject-content';
import { SUBJECTS } from '@/lib/hensachi';

describe('SUBJECT_CONTENTS', () => {
  it('hensachi.tsのSUBJECTSと同じ5教科・同じkey/slugが揃う', () => {
    const contentSlugs = SUBJECT_CONTENTS.map((s) => s.slug).sort();
    const subjectKeys = SUBJECTS.map((s) => s.key).sort();
    expect(contentSlugs).toEqual(subjectKeys);
  });

  it('各教科のlead文はすべて異なる（コピペ重複なし）', () => {
    const leads = SUBJECT_CONTENTS.map((s) => s.lead);
    expect(new Set(leads).size).toBe(leads.length);
  });

  it('各教科は4件以上の上げ方メソッドと3件以上のFAQを持つ', () => {
    for (const s of SUBJECT_CONTENTS) {
      expect(s.methods.length).toBeGreaterThanOrEqual(4);
      expect(s.faqs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('FAQの質問文は教科をまたいで重複しない（コピペ重複なし）', () => {
    const allQuestions = SUBJECT_CONTENTS.flatMap((s) => s.faqs.map((f) => f.question));
    expect(new Set(allQuestions).size).toBe(allQuestions.length);
  });

  it('methodのtitleは教科をまたいで重複しない', () => {
    const allTitles = SUBJECT_CONTENTS.flatMap((s) => s.methods.map((m) => m.title));
    expect(new Set(allTitles).size).toBe(allTitles.length);
  });

  it('getSubjectContentは存在するslugを返し、存在しないslugはundefined', () => {
    expect(getSubjectContent('sugaku')?.label).toBe('数学');
    expect(getSubjectContent('not-a-subject')).toBeUndefined();
  });
});
