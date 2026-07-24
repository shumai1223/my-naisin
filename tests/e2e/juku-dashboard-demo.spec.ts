import { test, expect } from '@playwright/test';

/**
 * 塾ダッシュボード・デモ環境(ZZ-4e)のスクリーンショットツアー（営業資料素材化）。
 *
 * /juku/dashboard/demo はD1・招待トークン不要の決定論シードデータのみで完動するため、
 * NEXT_PUBLIC_JUKU_SAAS_ENABLED=1 さえ立てればどの環境でも同じ画面が撮れる
 * （playwright.config.ts のCI向けwebServerコマンドで旗を有効化している）。
 * chromium(デスクトップ)・mobile-chrome(Pixel 5)の両プロジェクトで実行され、
 * 各プロジェクト名をファイル名に含めることでデスクトップ/モバイル2枚のツアーになる。
 * 生成物は sales-screenshots/ に保存し、ci.yml でCI artifactとしてアップロードする。
 */
test('塾ダッシュボード・デモが完動しスクリーンショットを撮れる', async ({ page }, testInfo) => {
  const res = await page.goto('/juku/dashboard/demo', { waitUntil: 'domcontentloaded' });
  expect(res, 'レスポンスが取得できること').not.toBeNull();
  expect(res!.status(), '404/5xxでないこと（旗が有効な環境であること）').toBeLessThan(400);

  // 30人分の生徒カードが描画されている（DoD「生徒30人分が完動」の実地確認）。
  await expect(page.getByText('生徒01')).toBeVisible();
  await expect(page.getByText('生徒30')).toBeVisible();
  await expect(page.getByText(/低下アラート/)).toBeVisible();

  await page.screenshot({
    path: `sales-screenshots/juku-dashboard-demo-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
