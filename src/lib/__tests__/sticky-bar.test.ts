/**
 * 常設換金バーの表示可否・カテゴリ分類（純粋ロジック）の不変条件。
 * ツール/結果/ブログページにだけ出し、法務・計測系ページには出さない。
 */

import { shouldShowStickyBar, stickyBarCategoryOf } from '../sticky-bar';

describe('shouldShowStickyBar', () => {
  test('ツール/結果ページで true', () => {
    for (const p of [
      '/',
      '/hensachi',
      '/hensachi/shiboukou',
      '/hyotei-heikin',
      '/reverse',
      '/tools',
      '/tokyo/naishin',
      '/tokyo/total-score',
      '/kanagawa/s-value',
      '/hokkaido/rank',
      '/koukou-hiyou',
      '/hiyou',
      '/pref/tokyo/school/131234',
      '/pref/hokkaido/school/abc',
    ]) {
      expect(shouldShowStickyBar(p)).toBe(true);
    }
  });

  test('ブログページで true（S8-1・除外解除）', () => {
    expect(shouldShowStickyBar('/blog/all-3-high-school-options-2026-update')).toBe(true);
    expect(shouldShowStickyBar('/blog')).toBe(true);
  });

  test('法務/計測/API ページで false', () => {
    for (const p of [
      '/api/naishin',
      '/admin/report',
      '/developers',
      '/privacy',
      '/terms',
      '/disclaimer',
      '/contact',
      '/about',
      '/partner',
      '/embed/hensachi',
    ]) {
      expect(shouldShowStickyBar(p)).toBe(false);
    }
  });

  test('null/undefined/未知は false', () => {
    expect(shouldShowStickyBar(null)).toBe(false);
    expect(shouldShowStickyBar(undefined)).toBe(false);
    expect(shouldShowStickyBar('/nonexistent-info-page')).toBe(false);
  });
});

describe('stickyBarCategoryOf（S8-2・「閉じる」の抑制範囲をカテゴリ単位に分割）', () => {
  test('トップは home', () => {
    expect(stickyBarCategoryOf('/')).toBe('home');
  });
  test('全国共通ツールは tool', () => {
    for (const p of ['/hensachi', '/hyotei-heikin', '/reverse', '/tools', '/hiyou', '/koukou-hiyou', '/mendan']) {
      expect(stickyBarCategoryOf(p)).toBe('tool');
    }
  });
  test('県別ツールは prefecture-tool', () => {
    for (const p of ['/tokyo/naishin', '/kanagawa/s-value', '/hokkaido/rank', '/osaka/total-score']) {
      expect(stickyBarCategoryOf(p)).toBe('prefecture-tool');
    }
  });
  test('学校別ページは school', () => {
    expect(stickyBarCategoryOf('/pref/tokyo/school/131234')).toBe('school');
  });
  test('ブログは blog', () => {
    expect(stickyBarCategoryOf('/blog/all-3-high-school-options-2026-update')).toBe('blog');
  });
  test('対象外ページは null', () => {
    expect(stickyBarCategoryOf('/privacy')).toBeNull();
    expect(stickyBarCategoryOf('/api/naishin')).toBeNull();
    expect(stickyBarCategoryOf(null)).toBeNull();
    expect(stickyBarCategoryOf(undefined)).toBeNull();
  });
});
