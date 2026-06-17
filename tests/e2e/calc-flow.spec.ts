import { test, expect } from '@playwright/test';

/**
 * 換金ファネルの中心動線（計算→結果→CTA）の回帰テスト。
 * framer-motion 撤去や計算機リファクタの前後で「結果が出て・保護者CTAが残る」ことを保証する。
 *
 * セレクタの細部に依存せず、ユーザーに見える安定した文言（点／保護者）で確認する。
 * 入力レベルの厳密な回帰（評定を変えると合計が変わる）はコンポーネントに data-testid を足してから強化する。
 */

test('トップ: 内申点の結果と保護者リードCTAが表示される', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  // 既定スコアで結果（◯点）が即時表示される
  await expect(page.getByText(/点/).first()).toBeVisible();
  // 換金導線（保護者向けCTA）が存在する
  await expect(page.getByText(/保護者/).first()).toBeVisible();
  await page.screenshot({ path: 'test-results/home-full.png', fullPage: true });
});

test('偏差値ツール: 計算機ページが描画される', async ({ page }) => {
  await page.goto('/hensachi', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toContainText(/偏差値/);
  await expect(page.getByText(/偏差値/).first()).toBeVisible();
});

test('総合得点ハブ: 県別の計算へ遷移できる', async ({ page }) => {
  await page.goto('/total-score', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  // ハブから少なくとも1つの県別ページへのリンクがある
  const prefLink = page.locator('a[href*="/total-score"], a[href*="/naishin"], a[href*="/s-value"], a[href*="/rank"]').first();
  await expect(prefLink).toBeVisible();
});

test('共有導線: 受験料シミュが描画され費用目安が出る', async ({ page }) => {
  await page.goto('/juken-ryou', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  // シミュ結果の「円」表記が見える（既定値で即時表示）
  await expect(page.getByText(/¥|円/).first()).toBeVisible();
});
