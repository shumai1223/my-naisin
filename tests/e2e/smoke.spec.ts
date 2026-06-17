import { test, expect } from '@playwright/test';

/**
 * コアページの描画スモーク（回帰の土台）。
 * タイトル（metadata）と h1 の存在という壊れにくい指標で「ページが落ちていない」ことを保証する。
 * セレクタに依存しすぎないので、リファクタ（framer-motion撤去等）でも誤検知しにくい。
 */
const CORE_PAGES: { path: string; title: RegExp }[] = [
  { path: '/', title: /内申点/ },
  { path: '/hensachi', title: /偏差値/ },
  { path: '/hyotei-heikin', title: /評定平均/ },
  { path: '/total-score', title: /総合得点/ },
  { path: '/reverse', title: /逆算|志望校|内申/ },
  { path: '/hiyou', title: /費用|お金/ },
  { path: '/chousasho', title: /調査書/ },
  { path: '/sougou-gata-senbatsu', title: /総合型選抜/ },
  { path: '/juken-ryou', title: /受験料|模試代/ },
];

for (const p of CORE_PAGES) {
  test(`コアページが描画される: ${p.path}`, async ({ page }) => {
    const res = await page.goto(p.path, { waitUntil: 'domcontentloaded' });
    expect(res, `${p.path} のレスポンスが取得できること`).not.toBeNull();
    expect(res!.status(), `${p.path} は 4xx/5xx でないこと`).toBeLessThan(400);
    await expect(page).toHaveTitle(p.title);
    // 主要ランドマークが存在する（空ページでないこと）
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('main, #main-content').first()).toBeVisible();
  });
}

test('robots と sitemap が配信される', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBeLessThan(400);
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBeLessThan(400);
});
