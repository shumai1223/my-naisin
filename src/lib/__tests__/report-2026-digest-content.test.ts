// 内申点白書2026 都道府県別ダイジェスト版(X-30)のscaled-content(テンプレ量産)機械検出。
// naishin-omomi-content.test.ts / total-score/__tests__/uniqueness.test.ts と同じ思想:
// 各県の文章が互いに重複しない(=mad-libs型量産でない)ことを保証する。
// ファイル冒頭のコメント自身が「県名を差し替えただけの量産を避ける」と明記しているため、
// この不変条件を機械で固定する。

import {
  REPORT_2026_DIGEST_CONTENT,
  REPORT_2026_DIGEST_CODES,
  getReport2026DigestEntry,
} from '../report-2026-digest-content';
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

describe('report-2026-digest-content uniqueness（テンプレ流用＝scaled-content の機械検出）', () => {
  const entries = Object.values(REPORT_2026_DIGEST_CONTENT);

  it('少なくとも1県は執筆済み', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('全県のhighlightが互いに重複しない', () => {
    expectAllUnique('highlight', entries.map((e) => e.highlight));
  });

  it('全県のcontextが互いに重複しない', () => {
    expectAllUnique('context', entries.map((e) => e.context));
  });

  it('全県のFAQ質問が互いに重複しない', () => {
    expectAllUnique('faq.question', entries.flatMap((e) => e.faqs.map((f) => f.question)));
  });

  it('全県のFAQ回答が互いに重複しない', () => {
    expectAllUnique('faq.answer', entries.flatMap((e) => e.faqs.map((f) => f.answer)));
  });

  it('登録キーはprefectures.tsの実在するcodeと一致する', () => {
    for (const code of REPORT_2026_DIGEST_CODES) {
      expect(getPrefectureByCode(code)).toBeDefined();
    }
  });

  it('REPORT_2026_DIGEST_CODESに重複コードがない', () => {
    expect(new Set(REPORT_2026_DIGEST_CODES).size).toBe(REPORT_2026_DIGEST_CODES.length);
  });

  it('各県のhighlight/contextが空でなく、FAQが最低1問ある(県固有の内容である証明)', () => {
    for (const code of REPORT_2026_DIGEST_CODES) {
      const entry = getReport2026DigestEntry(code);
      expect(entry).toBeDefined();
      if (!entry) continue;
      expect(entry.highlight.length).toBeGreaterThan(10);
      expect(entry.context.length).toBeGreaterThan(10);
      expect(entry.faqs.length).toBeGreaterThan(0);
      for (const faq of entry.faqs) {
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it('各県のcontextに自県名が含まれる（テンプレの県名差し替え漏れを検知）', () => {
    for (const code of REPORT_2026_DIGEST_CODES) {
      const entry = getReport2026DigestEntry(code);
      const pref = getPrefectureByCode(code);
      expect(entry).toBeDefined();
      expect(pref).toBeDefined();
      if (!entry || !pref) continue;
      expect(entry.context).toContain(pref.name);
    }
  });
});

describe('getReport2026DigestEntry', () => {
  it('未登録の県コードはundefinedを返す（notFound判定に使われるため）', () => {
    expect(getReport2026DigestEntry('not-a-real-prefecture')).toBeUndefined();
  });

  it('登録済みの県コードはREPORT_2026_DIGEST_CONTENTの当該エントリと同一オブジェクトを返す', () => {
    const [firstCode] = REPORT_2026_DIGEST_CODES;
    expect(getReport2026DigestEntry(firstCode)).toBe(REPORT_2026_DIGEST_CONTENT[firstCode]);
  });
});
