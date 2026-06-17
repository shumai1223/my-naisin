import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 基盤（Task7）。
 *
 * 目的：framer-motion 撤去（バンドル削減・凍結中）や大規模リファクタの前に、
 * 「計算機の入力→結果→CTA」の主要フローとコアページの描画を回帰テストで保護する。
 *
 * 実行（初回のみブラウザ取得）:
 *   npx playwright install --with-deps chromium
 *   npm run test:e2e
 * 既存のサーバーに当てる場合: E2E_BASE_URL=https://my-naishin.com npm run test:e2e
 *
 * 既定は dev サーバーを自動起動（ビルド不要で素早く回す）。CI で本番同等にしたいときは
 * `npm run build` 後に E2E_BASE_URL を本番URLに向けるか、command を `npm run start` に変える。
 */

const PORT = Number(process.env.E2E_PORT || 3100);
const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  // jest が無視する tests/e2e/ に置く（jest.config.js testPathIgnorePatterns と整合）。
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'ja-JP',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
  // 外部URLを指定したときはサーバーを起動しない。未指定なら dev サーバーを立てる。
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run dev -- --port ${PORT}`,
        url: BASE_URL,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
      },
});
