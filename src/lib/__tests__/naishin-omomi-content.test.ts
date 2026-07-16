// 都道府県別「内申の重み」個別解説（W-13）の scaled-content（テンプレ量産）機械検出。
// total-score/__tests__/uniqueness.test.ts と同じ思想：各県の文章が互いに重複しないことを保証する。

import { NAISHIN_OMOMI_CONTENT, NAISHIN_OMOMI_CODES, getNaishinOmomiEntry } from '../naishin-omomi-content';
import { getPrefectureByCode } from '../prefectures';

function expectAllUnique(label: string, values: string[]) {
  const seen = new Map<string, number>();
  const dups: string[] = [];
  for (const v of values) {
    const n = (seen.get(v) ?? 0) + 1;
    seen.set(v, n);
    if (n === 2) dups.push(v.slice(0, 40));
  }
  expect({ label, dups }).toEqual({ label, dups: [] });
}

describe('naishin-omomi-content uniqueness（テンプレ流用＝scaled-content の機械検出）', () => {
  const entries = Object.values(NAISHIN_OMOMI_CONTENT);

  it('少なくとも1県は執筆済み', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('全県の angle が互いに重複しない', () => {
    expectAllUnique('angle', entries.map((e) => e.angle));
  });

  it('全県の skewPosition が互いに重複しない', () => {
    expectAllUnique('skewPosition', entries.map((e) => e.skewPosition));
  });

  it('全県の gradeComparison が互いに重複しない', () => {
    expectAllUnique('gradeComparison', entries.map((e) => e.gradeComparison));
  });

  it('全県の maxScoreNote が互いに重複しない', () => {
    expectAllUnique('maxScoreNote', entries.map((e) => e.maxScoreNote));
  });

  it('全県のFAQ回答が互いに重複しない', () => {
    expectAllUnique('faq.answer', entries.flatMap((e) => e.faqs.map((f) => f.answer)));
  });

  it('各県の登録キーはprefectures.tsの実在するcodeと一致する', () => {
    for (const code of NAISHIN_OMOMI_CODES) {
      expect(getPrefectureByCode(code)).toBeDefined();
    }
  });

  it('各エントリのskewPosition/gradeComparisonに自県名が含まれる（県固有である証明）', () => {
    for (const code of NAISHIN_OMOMI_CODES) {
      const entry = getNaishinOmomiEntry(code);
      const pref = getPrefectureByCode(code);
      expect(entry).toBeDefined();
      expect(pref).toBeDefined();
      if (!entry || !pref) continue;
      expect(entry.skewPosition).toContain(pref.name);
      expect(entry.gradeComparison).toContain(pref.name);
    }
  });
});
