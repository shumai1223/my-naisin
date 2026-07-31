import { test, expect } from '@playwright/test';

/**
 * build-not-launch機能（Λ-7/Λ-8）の非公開不変条件を守る回帰テスト（Λ+2）。
 *
 * この種のページは「実装は完成しているが公開判断は👤専権」という前提が肝であり、
 * 事故で公開状態になっていないことを機械的に固定する価値が特に高い。
 *
 * 1) NEXT_PUBLIC_JUKU_SAAS_ENABLED旗が立っていない環境（=ローカルdevの既定）では、
 *    旗で守られたページは実装内容を一切見せず404を返す（isJukuSaasEnabled）。
 * 2) トークン認証のみで守られた管理画面（admin/*）は旗と無関係に常時到達可能だが、
 *    正しいトークンが無ければ「認証が必要です」ゲートを表示し、実データを一切出さない。
 */

test.describe('旗で守られたページ(NEXT_PUBLIC_JUKU_SAAS_ENABLED)は旗off環境で404になる', () => {
  const FLAGGED_ROUTES = [
    '/juku/dashboard/simulator',
    '/juku/dashboard/report?studentId=1',
    '/juku/matching/dashboard',
  ];

  for (const path of FLAGGED_ROUTES) {
    test(`${path} は旗off環境で404`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res, 'レスポンスが取得できること').not.toBeNull();
      expect(res!.status()).toBe(404);
    });
  }
});

test.describe('トークン認証のみの管理画面は未認証時に実データを出さずゲートを表示する', () => {
  const ADMIN_ROUTES = ['/admin/juku-matching', '/admin/community-posts'];

  for (const path of ADMIN_ROUTES) {
    test(`${path} はtoken未指定で認証ゲートを表示する`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(res, 'レスポンスが取得できること').not.toBeNull();
      expect(res!.status(), '500等でクラッシュしないこと').toBeLessThan(500);
      await expect(page.getByText('認証が必要です')).toBeVisible();
    });

    test(`${path} は不正なtokenでも認証ゲートを表示する`, async ({ page }) => {
      const res = await page.goto(`${path}?token=wrong-token-e2e-check`, { waitUntil: 'domcontentloaded' });
      expect(res, 'レスポンスが取得できること').not.toBeNull();
      await expect(page.getByText('認証が必要です')).toBeVisible();
    });
  }
});
