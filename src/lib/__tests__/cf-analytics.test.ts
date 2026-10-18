import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { isCfAnalyticsExcludedPath } from '../cf-analytics';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

describe('isCfAnalyticsExcludedPath（URLにトークン・成績が載るページでは計測しない）', () => {
  it.each(['/admin', '/admin/report', '/juku/dashboard', '/hogosha', '/api/unsubscribe'])('%s は除外', (p) => {
    expect(isCfAnalyticsExcludedPath(p)).toBe(true);
  });

  it.each(['/', '/hensachi', '/privacy', '/contact', '/blog/naishin-guide', '/juku-shindan', '/hogosha-guide', '/administrator'])('%s は計測する', (p) => {
    expect(isCfAnalyticsExcludedPath(p)).toBe(false);
  });

  it('null・undefined は除外しない', () => {
    expect(isCfAnalyticsExcludedPath(null)).toBe(false);
    expect(isCfAnalyticsExcludedPath(undefined)).toBe(false);
  });
});

describe('配線の契約', () => {
  it('layout.tsx がビーコンを読み込んでいる', () => {
    expect(read('src/app/layout.tsx')).toContain('<CloudflareAnalytics />');
  });

  it('トークンが空なら何も描画しない・読み込むのは Cloudflare の公式ビーコンだけ', () => {
    const s = read('src/components/CloudflareAnalytics.tsx');
    expect(s).toMatch(/if \(!CF_BEACON_TOKEN \|\|/);
    expect(s).toContain('https://static.cloudflareinsights.com/beacon.min.js');
  });

  it('プライバシーポリシーの記載は、トークンがあるときだけ出る（読み込んでいないのに「使っている」と書かない）', () => {
    const s = read('src/app/privacy/page.tsx');
    expect(s).toContain('CF_BEACON_TOKEN &&');
    expect(s).toContain('Cloudflare Web Analytics');
  });
});
