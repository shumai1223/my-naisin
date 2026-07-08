/**
 * @jest-environment node
 *
 * 動的ルート（[param]）の発見可能性監査（TIER L・2026-07-09新設）。
 *
 * P-1で /pref/[code]（47県）がsitemap.tsに一切登録されておらず、サイト内のどこからも
 * リンクされていない完全な孤立ページ群だったことが判明した。既存の内部リンク/sitemap監査
 * （internal-link-graph.test.ts・seo-surface.test.ts）は静的page.tsxのみを対象にしており、
 * 動的ルートはそもそも監査対象外という盲点があった。このテストはその再発防止。
 *
 * 完全な数学的検証ではなく「静的セグメントの文字列がsitemap.ts・他コンポーネントの両方に
 * 現れるか」という緩めのテキスト走査（internal-link-graph.tsと同じ設計思想）。
 */
import fs from 'fs';
import path from 'path';
import sitemap from '@/app/sitemap';
import {
  walkDynamicPageFiles,
  routeFromDynamicFile,
  staticSegmentsOf,
  segmentsAppearIn,
  segmentsCoveredBySitemapUrls,
} from '@/lib/dynamic-route-audit';

/**
 * sitemap登録・内部リンクが無くても正当と判断済みの例外。
 * 追加する場合は「なぜ不要か」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const DISCOVERABILITY_EXEMPT_ROUTES: Record<string, string> = {
  '/[prefecture]': '静的セグメントが無い単独動的ルート（本チェックの対象外・[prefecture]/naishin等の兄弟ルートで実質カバー）',
  '/[prefecture]/reverse': 'permanentRedirectのみのリダイレクトページ（[[opennext-ssg-1102-gotcha]]でsitemap対象外と確認済み）',
  '/blog/tag/[tag]': '意図的にnoindex設定（robots: { index: false }）のタグ一覧ページ',
};

describe('動的ルートの発見可能性監査（sitemap登録+内部リンク・TIER L）', () => {
  const appDir = path.join(__dirname, '..');
  const srcDir = path.join(__dirname, '..', '..');
  const dynamicPageFiles = walkDynamicPageFiles(appDir);
  const sitemapUrls = sitemap().map((e) => e.url);

  const NON_NAVIGATIONAL_FILENAMES = ['page-registry.ts', 'sitemap.ts', 'robots.ts'];
  function walkSourceFiles(dir: string, acc: { path: string; content: string }[] = []): { path: string; content: string }[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === '.next') continue;
        walkSourceFiles(full, acc);
      } else if (/\.(tsx?|mjs|js)$/.test(entry.name) && !NON_NAVIGATIONAL_FILENAMES.includes(entry.name)) {
        acc.push({ path: full, content: fs.readFileSync(full, 'utf8') });
      }
    }
    return acc;
  }
  const candidateFiles = walkSourceFiles(srcDir);

  test('動的ルート（[param]）のpage.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(dynamicPageFiles.length).toBeGreaterThan(0);
  });

  test.each(dynamicPageFiles.map((file) => [routeFromDynamicFile(appDir, file), file] as const))(
    '%s: sitemap.tsに静的セグメントの記載がある、または理由付きの例外リストに登録されている',
    (route, file) => {
      const segments = staticSegmentsOf(route);
      if (DISCOVERABILITY_EXEMPT_ROUTES[route]) {
        expect(true).toBe(true); // 例外登録済み・審査済み
        return;
      }
      const inSitemap = segmentsCoveredBySitemapUrls(segments, sitemapUrls);
      expect(inSitemap).toBe(true);
    },
  );

  test.each(dynamicPageFiles.map((file) => [routeFromDynamicFile(appDir, file), file] as const))(
    '%s: 他の実コンポーネントから静的セグメントを含む文脈的リンクがある、または理由付きの例外リストに登録されている',
    (route, file) => {
      const segments = staticSegmentsOf(route);
      if (DISCOVERABILITY_EXEMPT_ROUTES[route]) {
        expect(true).toBe(true);
        return;
      }
      const relFile = path.relative(srcDir, file).replace(/\\/g, '/');
      const hasLink = segmentsAppearIn(segments, candidateFiles.map((f) => ({ path: path.relative(srcDir, f.path).replace(/\\/g, '/'), content: f.content })), [relFile]);
      expect(hasLink).toBe(true);
    },
  );

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(dynamicPageFiles.map((f) => routeFromDynamicFile(appDir, f)));
    for (const route of Object.keys(DISCOVERABILITY_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });
});
