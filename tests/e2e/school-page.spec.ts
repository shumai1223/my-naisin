import { test, expect } from '@playwright/test';

/**
 * 個別学校ページ層（Λ-2・1県パイロット=東京都）の描画スモーク兼回帰保護。
 *
 * /pref/tokyo の学校ハブリンク（Λ+3・孤児化防止）から実際に1校のページへ遷移できることを
 * 確認する。schoolCodeをテストコード側にハードコードせず、ハブページ上の実リンクを
 * クリックすることで、ハブリンク自体の健全性(href生成ロジック)と学校ページ本体の描画を
 * 1本のテストで同時に保護する。
 */
test('東京都のページから学校ハブリンク経由で個別学校ページへ遷移できる', async ({ page }) => {
  const res = await page.goto('/pref/tokyo', { waitUntil: 'domcontentloaded' });
  expect(res, 'レスポンスが取得できること').not.toBeNull();
  expect(res!.status(), '404/5xxでないこと').toBeLessThan(400);

  const hubHeading = page.getByRole('heading', { name: /高校別・入試倍率/ });
  await expect(hubHeading).toBeVisible();

  const firstSchoolLink = page.locator('a[href*="/pref/tokyo/school/"]').first();
  await expect(firstSchoolLink).toBeVisible();
  await firstSchoolLink.scrollIntoViewIfNeeded();
  await firstSchoolLink.click();

  await expect(page).toHaveURL(/\/pref\/tokyo\/school\//, { timeout: 10000 });
  await expect(page.getByText('今季の入試倍率（学校全体）')).toBeVisible();
  await expect(page.locator('h1').first()).toBeVisible();
});
