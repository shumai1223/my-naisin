/**
 * ブログ記事メタデータの品質ゲート（SEO回帰防止）。
 *
 * <title>＝`${post.title} | My Naishin`、meta description＝post.description で出力されるため、
 * タイトル/ディスクリプションの欠落・重複（カニバリの芽）・極端な長さを CI で恒久的に止める。
 * 過去セッションで作り込んだ高CTRタイトルを「うっかり壊す」事故を防ぐ。
 */

import { BLOG_POSTS } from '@/lib/blog';

describe('blog metadata quality', () => {
  test('記事が存在する', () => {
    expect(BLOG_POSTS.length).toBeGreaterThan(20);
  });

  test('slug は a-z0-9- のみで一意', () => {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
    const dups = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dups).toEqual([]);
  });

  test('title は一意・非空・極端に長くない（SERP truncation 回避）', () => {
    const titles = BLOG_POSTS.map((p) => p.title);
    titles.forEach((t) => {
      expect(t.trim().length).toBeGreaterThanOrEqual(10);
      // ブランド「 | My Naishin」が後置される分、本文タイトルは短めに保つ
      expect(t.length).toBeLessThanOrEqual(80);
      // タイトルに自分でブランドを二重付与していない
      expect(t).not.toContain('| My Naishin');
    });
    const dups = titles.filter((t, i) => titles.indexOf(t) !== i);
    expect(dups).toEqual([]);
  });

  test('description は一意・非空・適切な長さ（カニバリ防止）', () => {
    const descs = BLOG_POSTS.map((p) => p.description);
    descs.forEach((d) => {
      expect(d.trim().length).toBeGreaterThanOrEqual(50);
      expect(d.length).toBeLessThanOrEqual(250);
    });
    // 同一ディスクリプション＝重複コンテンツのシグナル。完全一致は許さない。
    const dups = descs.filter((d, i) => descs.indexOf(d) !== i);
    expect(dups).toEqual([]);
  });

  test('category・tags・date が揃っている', () => {
    BLOG_POSTS.forEach((p) => {
      expect(p.category.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(p.tags)).toBe(true);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(Number.isFinite(Date.parse(p.date))).toBe(true);
      if (p.lastUpdated) expect(Number.isFinite(Date.parse(p.lastUpdated))).toBe(true);
    });
  });

  test('faqs を持つ記事は question/answer が非空', () => {
    BLOG_POSTS.forEach((p) => {
      if (!p.faqs) return;
      p.faqs.forEach((f) => {
        expect(f.question.trim().length).toBeGreaterThan(0);
        expect(f.answer.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
