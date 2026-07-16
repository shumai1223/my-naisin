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
 * ローカル既定は dev サーバーを自動起動（ビルド不要で素早く回す）。
 * CI（process.env.CI）では `next build` 済みの成果物を `next start` で配信する
 * （事前 `npm run build` はワークフロー側のステップで実行。dev サーバーの
 * コールドコンパイルによるタイムアウト不安定化を避けるのが目的＝W-18①）。
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
  // 外部URLを指定したときはサーバーを起動しない。CIは本番同等のnext start、
  // ローカル既定はdevサーバーを自動起動する。
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: process.env.CI ? `npm run start -- --port ${PORT}` : `npm run dev -- --port ${PORT}`,
        url: BASE_URL,
        timeout: 180_000,
        reuseExistingServer: !process.env.CI,
      },
});
