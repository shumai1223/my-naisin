/**
 * 学年別「内申点の上げ方」コンテンツ（A-4）の整合性テスト。
 * 3学年分を手書きするページのため、コピペ起因の重複（scaled content）が無いことを固定する。
 */
import { GRADE_CONTENTS, getGradeContent } from '@/lib/naishin-grade-content';
import { PREFECTURES } from '@/lib/prefectures';

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

  // 2026-08-17: lead/FAQ文中の「34県」「11県」「36県」等の集計値はprefectures.tsから手書きで
  // 転記されたもの（naishin-kakusa等の新しいページのような動的算出ではない）。iwate/PrefectureFAQ
  // 等で同種の手書き数値ドリフトが繰り返し発生している教訓を踏まえ、実データから再計算した値と
  // 突合する不変条件を張る。
  it('本文中の都道府県別集計値(34県/11県/2県/36県)がprefectures.tsの実データと一致する', () => {
    const all3 = PREFECTURES.filter((p) => JSON.stringify(p.targetGrades) === JSON.stringify([1, 2, 3])).length;
    const grade3only = PREFECTURES.filter((p) => JSON.stringify(p.targetGrades) === JSON.stringify([3])).length;
    const grade23 = PREFECTURES.filter((p) => JSON.stringify(p.targetGrades) === JSON.stringify([2, 3])).length;

    expect(all3).toBe(34);
    expect(grade3only).toBe(11);
    expect(grade23).toBe(2);
    expect(all3 + grade3only + grade23).toBe(PREFECTURES.length);

    const allText = GRADE_CONTENTS.flatMap((g) => [g.lead, ...g.faqs.map((f) => f.answer)]).join('');
    expect(allText).toContain(`${all3}県`);
    expect(allText).toContain(`${grade3only}県`);
    expect(allText).toContain(`${all3 + grade23}県`);
  });
});
