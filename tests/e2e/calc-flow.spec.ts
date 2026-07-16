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

test('黄金導線（H-6）: 計算→結果→CTA→LINE友だち追加リンクまで到達できる', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  // ホームは初期状態が navigationMode==='select'（目的選択画面）で、入力フォームと
  // 「結果を見る」ボタンは「内申点を計算する」を押してcalculateモードに入るまで存在しない
  // （HomeClient.tsx/HeroNavigation.tsx）。
  await page.getByRole('button', { name: '内申点を計算する' }).click();
  // 結果はユーザーが「結果を見る」を押すまで表示されない設計（HomeClient.tsx showResult）。
  await page.getByRole('button', { name: '結果を見る' }).click();
  await expect(page.getByText(/点/).first()).toBeVisible();
  // 結果直後のCTA（堀A：LINE/メール名簿化）が描画される
  const lineLink = page.locator('a[href*="lin.ee"], a[href*="line.me"]').first();
  await expect(lineLink).toBeVisible();
  // クリックすると外部（LINE）へ飛ぶリンクであること（実際には遷移しない・href検証のみ）
  await expect(lineLink).toHaveAttribute('target', '_blank');
  const href = await lineLink.getAttribute('href');
  expect(href).toBeTruthy();
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

/**
 * 以下3件（TIER L-8）: 都道府県別の総合得点/S値/ランク計算機は、初期値が空文字で
 * 「入力するまで結果が出ない」設計（home/hensachi/juken-ryouと違い既定値では何も表示されない）。
 * L-10（a11y対応）で追加したid付きinput（htmlFor連携）をそのままロケータとして使い、
 * 実際に値を入力→結果と保護者CTAが出ることまで確認する黄金導線テスト。
 */
test('都立総合得点: 学力検査点を入力すると総合得点と保護者CTAが表示される', async ({ page }) => {
  await page.goto('/tokyo/total-score', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#tokyo-total-score-exam').fill('420');
  await expect(page.getByText('あなたの総合得点')).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});

test('神奈川S値: 内申点を入力するとS値と保護者CTAが表示される', async ({ page }) => {
  await page.goto('/kanagawa/s-value', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#kanagawa-naishin').fill('110');
  await expect(page.getByText(/あなたのS1値/)).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});

test('北海道内申ランク: 内申点を入力するとランクと保護者CTAが表示される', async ({ page }) => {
  await page.goto('/hokkaido/rank', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#hokkaido-naishin').fill('240');
  await expect(page.getByText('あなたの内申ランク')).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});

test('愛知総合得点: 評定合計を入力すると総合得点と保護者CTAが表示される', async ({ page }) => {
  await page.goto('/aichi/total-score', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#aichi-naishin-sum').fill('36');
  await expect(page.getByText(/あなたの総合得点/)).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});

test('千葉K値: 評定合計を入力すると総合得点と保護者CTAが表示される', async ({ page }) => {
  await page.goto('/chiba/total-score', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#chiba-hyotei-sum').fill('108');
  await expect(page.getByText(/あなたの総合得点/)).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});

test('福岡総合得点: 内申点を入力すると合計と保護者CTAが表示される', async ({ page }) => {
  await page.goto('/fukuoka/total-score', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#fukuoka-naishin').fill('36');
  await expect(page.getByText('内申＋当日点の合計（目安）')).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});

test('大阪総合得点: 内申点を入力すると総合点と保護者CTAが表示される', async ({ page }) => {
  await page.goto('/osaka/total-score', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('h1').first()).toBeVisible();
  await page.locator('#osaka-naishin').fill('350');
  await expect(page.getByText(/あなたの総合点/)).toBeVisible();
  await expect(page.getByText(/保護者/).first()).toBeVisible();
});
