import { test, expect } from '@playwright/test';

test('top page renders guide and prefecture badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('内申点ガイド')).toBeVisible();
  await expect(page.getByText('2026年度入試対応')).toBeVisible();
});

test('prefectures page renders header badge', async ({ page }) => {
  await page.goto('/prefectures');
  await expect(page.getByRole('heading', { name: '都道府県別 内申点計算' })).toBeVisible();
  await expect(page.getByText('2026年度入試対応')).toBeVisible();
});
