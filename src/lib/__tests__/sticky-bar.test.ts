/**
 * 常設換金バーの表示可否（純粋ロジック）の不変条件。
 * ツール/結果ページにだけ出し、情報/法務/計測系ページには出さない。
 */

import { shouldShowStickyBar } from '../sticky-bar';

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
    ]) {
      expect(shouldShowStickyBar(p)).toBe(true);
    }
  });

  test('情報/法務/計測/API ページで false', () => {
    for (const p of [
      '/blog/all-3-high-school-options-2026-update',
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
