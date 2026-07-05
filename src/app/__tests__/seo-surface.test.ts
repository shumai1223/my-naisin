/**
 * @jest-environment node
 *
 * SEO/PWA表層（sitemap・robots・manifest）の回帰テスト。
 * 新ページの登録漏れ・公開APIのrobots許可漏れ・マニフェスト破損を検知する。
 */
import fs from 'fs';
import path from 'path';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import manifest from '@/app/manifest';
import { PREFECTURES } from '@/lib/prefectures';
import { SITEMAP_EXCLUDED_ROUTES } from '@/lib/page-registry';

const BASE = 'https://my-naishin.com';

/** src/app 配下を再帰的に走査し、静的ページ（page.tsx）のURLを列挙する。 */
function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(full, acc);
    } else if (entry.name === 'page.tsx') {
      acc.push(full);
    }
  }
  return acc;
}

/** page.tsx のファイルパス → ルート。動的セグメント・APIはnull。 */
function pageFileToRoute(appDir: string, file: string): string | null {
  let rel = path.relative(appDir, file).replace(/\\/g, '/');
  rel = rel.replace(/\/?page\.tsx$/, '');
  rel = rel
    .split('/')
    .filter((seg) => !(seg.startsWith('(') && seg.endsWith(')')))
    .join('/');
  const route = '/' + rel;
  if (route.startsWith('/api')) return null;
  if (route.includes('[')) return null; // 動的ルートは prefecture/blog/total-score 経路で別途カバー
  return route === '/' ? '' : route.replace(/\/$/, '');
}

describe('sitemap()', () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  test('主要ツール・新ページが含まれる', () => {
    for (const path of ['', '/plan', '/hogosha', '/hensachi', '/hyotei-heikin', '/reverse', '/developers', '/tools']) {
      expect(urls).toContain(`${BASE}${path}`);
    }
  });

  test('保護者お金クラスタ（教育費・学費・塾代・無償化）が含まれる', () => {
    for (const path of ['/hiyou', '/kyouiku-hi', '/koukou-hiyou', '/juku-hiyou', '/shougakukin']) {
      expect(urls).toContain(`${BASE}${path}`);
    }
  });

  test('受験スケジュールページが含まれる', () => {
    expect(urls).toContain(`${BASE}/juken-schedule`);
  });

  test('47都道府県の内申点ページが揃う', () => {
    const naishinPages = urls.filter((u) => /\/[a-z]+\/naishin$/.test(u));
    expect(naishinPages).toHaveLength(PREFECTURES.length);
  });

  test('各エントリは url と priority を持つ', () => {
    for (const e of entries) {
      expect(e.url.startsWith(BASE)).toBe(true);
      expect(typeof e.priority).toBe('number');
    }
  });

  test('src/app配下の全静的ページがsitemapに登録されている（登録漏れの再発防止）', () => {
    const appDir = path.join(__dirname, '..');
    const pageFiles = walk(appDir);
    const routes = [...new Set(pageFiles.map((f) => pageFileToRoute(appDir, f)).filter((r): r is string => r !== null))];
    const missing = routes.filter(
      (route) => !SITEMAP_EXCLUDED_ROUTES.includes(route) && !urls.includes(`${BASE}${route}`)
    );
    expect(missing).toEqual([]);
  });
});

describe('robots()', () => {
  const r = robots();

  test('sitemapを指す', () => {
    expect(r.sitemap).toBe(`${BASE}/sitemap.xml`);
  });

  test('公開データAPI（/api/naishin・/api/mcp・/api/openapi）を許可', () => {
    const wildcard = (Array.isArray(r.rules) ? r.rules : [r.rules]).find(
      (rule) => rule.userAgent === '*'
    );
    const allow = wildcard?.allow ?? [];
    const allowList = Array.isArray(allow) ? allow : [allow];
    expect(allowList).toEqual(expect.arrayContaining(['/api/naishin', '/api/mcp', '/api/openapi']));
  });

  test('/admin/を拒否（page-registryのSITEMAP_EXCLUDED_ROUTESと対）', () => {
    const wildcard = (Array.isArray(r.rules) ? r.rules : [r.rules]).find(
      (rule) => rule.userAgent === '*'
    );
    const disallow = wildcard?.disallow ?? [];
    const disallowList = Array.isArray(disallow) ? disallow : [disallow];
    expect(disallowList).toEqual(expect.arrayContaining(['/admin/']));
  });
});

describe('manifest()', () => {
  const m = manifest();

  test('PWAの必須項目が揃う', () => {
    expect(m.name).toContain('My Naishin');
    expect(m.start_url).toBe('/');
    expect(m.display).toBe('standalone');
    expect((m.icons ?? []).length).toBeGreaterThan(0);
  });
});
