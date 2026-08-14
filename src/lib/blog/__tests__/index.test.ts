// blog/index.ts: getPostBySlug/getAllPostsが無テストと判明。
// blog-metadata-quality.test.tsはBLOG_POSTS配列のデータ品質(slug一意性等)のみを検証しており、
// この2つの公開関数自体の挙動(検索・ソート)は未検証だった。

import { BLOG_POSTS, getPostBySlug, getAllPosts } from '../index';

describe('getPostBySlug', () => {
  it('実在するslugで該当する記事を返す', () => {
    const [first] = BLOG_POSTS;
    const result = getPostBySlug(first.slug);
    expect(result).toBeDefined();
    expect(result?.slug).toBe(first.slug);
  });

  it('存在しないslugはundefinedを返す（/blog/[slug]のnotFound判定に使われる）', () => {
    expect(getPostBySlug('not-a-real-slug')).toBeUndefined();
  });

  it('全記事がslugで正しく引ける（往復一致）', () => {
    for (const post of BLOG_POSTS) {
      expect(getPostBySlug(post.slug)).toEqual(post);
    }
  });
});

describe('getAllPosts', () => {
  it('BLOG_POSTSと同じ件数を返す', () => {
    expect(getAllPosts().length).toBe(BLOG_POSTS.length);
  });

  it('日付の新しい順(降順)にソートして返す', () => {
    const posts = getAllPosts();
    for (let i = 0; i < posts.length - 1; i++) {
      expect(new Date(posts[i].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i + 1].date).getTime());
    }
  });

  it('元のBLOG_POSTS配列を破壊的変更しない', () => {
    const before = BLOG_POSTS.map((p) => p.slug);
    getAllPosts();
    const after = BLOG_POSTS.map((p) => p.slug);
    expect(after).toEqual(before);
  });

  it('呼び出すたびに新しい配列を返す（同一参照ではない）', () => {
    expect(getAllPosts()).not.toBe(getAllPosts());
  });
});

describe('BLOG_POSTS enrichment (enrichPost の効果を公開APIから観測)', () => {
  it('全記事のdateが有効な日付文字列である', () => {
    for (const post of BLOG_POSTS) {
      expect(Number.isNaN(new Date(post.date).getTime())).toBe(false);
    }
  });

  it('faqsが存在する記事は質問・回答とも空でない', () => {
    for (const post of BLOG_POSTS) {
      if (!post.faqs) continue;
      for (const faq of post.faqs) {
        expect(faq.question.length).toBeGreaterThan(0);
        expect(faq.answer.length).toBeGreaterThan(0);
      }
    }
  });
});
