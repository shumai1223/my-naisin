/**
 * @jest-environment node
 *
 * SEO/PWA表層（sitemap・robots・manifest）の回帰テスト。
 * 新ページの登録漏れ・公開APIのrobots許可漏れ・マニフェスト破損を検知する。
 */
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import manifest from '@/app/manifest';
import { PREFECTURES } from '@/lib/prefectures';

const BASE = 'https://my-naishin.com';

describe('sitemap()', () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  test('主要ツール・新ページが含まれる', () => {
    for (const path of ['', '/plan', '/hogosha', '/hensachi', '/hyotei-heikin', '/reverse', '/developers', '/tools']) {
      expect(urls).toContain(`${BASE}${path}`);
    }
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
