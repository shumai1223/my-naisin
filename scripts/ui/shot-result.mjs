#!/usr/bin/env node
/**
 * 計算結果の画面（トップページで「結果を見る」を押したあと）を撮る。
 *
 *   node scripts/ui/shot-result.mjs --out <dir> [--base http://localhost:3100] [--widths 390,1280] [--slices 6] [--pref tokyo]
 *
 * /?pref=<県>&scores=... で計算モードに入り、「結果を見る」を押して、#result 以降を上から撮る。
 * ブラウザは shot.mjs と同じロックで同時に1つだけ。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { chromium } = require(path.join(ROOT, 'node_modules', 'playwright'));
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(ROOT, opt('--out', 'tmp/shots-result'));
const BASE = opt('--base', 'http://localhost:3100').replace(/\/$/, '');
const WIDTHS = opt('--widths', '390,1280').split(',').map(Number);
const SLICES = Number(opt('--slices', '6'));
const PREF = opt('--pref', 'tokyo');
const SLICE_H = 1000;
fs.mkdirSync(OUT, { recursive: true });

const LOCK = path.join(ROOT, 'tmp', 'shot.lock');
fs.mkdirSync(path.dirname(LOCK), { recursive: true });
for (let i = 0; ; i++) {
  try { fs.writeFileSync(LOCK, String(process.pid), { flag: 'wx' }); break; } catch {
    try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 10 * 60 * 1000) fs.unlinkSync(LOCK); } catch { /* 他が消した */ }
    if (i > 400) throw new Error('shot.lock を取得できません');
    await new Promise((r) => setTimeout(r, 3000));
  }
}
process.on('exit', () => { try { fs.unlinkSync(LOCK); } catch { /* 無し */ } });

const browser = await chromium.launch();
const report = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: SLICE_H }, deviceScaleFactor: w < 600 ? 2 : 1.5, ignoreHTTPSErrors: true, locale: 'ja-JP', reducedMotion: 'reduce', isMobile: w < 600, hasTouch: w < 600 });
  const page = await ctx.newPage();
  const row = { width: w, files: [] };
  try {
    await page.goto(`${BASE}/?pref=${PREF}&scores=4,4,5,4,5,3,4,4,4`, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3500);
    const cookie = page.getByText('必須のみ許可');
    if (await cookie.count()) { await cookie.first().click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500); }
    await page.addStyleTag({ content: '.google-auto-placed, ins.adsbygoogle, [id^="aswift"], iframe[id^="google_ads"], iframe[src*="googlesyndication"], iframe[src*="netstar"], nextjs-portal{display:none!important}' });
    const btn = page.getByRole('button', { name: /結果を見る/ });
    if (!(await btn.count())) throw new Error('「結果を見る」ボタンが見つかりません');
    await btn.first().click();
    await page.waitForTimeout(3500);
    // 結果の位置（スクロールするのは body）
    const top = await page.evaluate(() => { const el = document.getElementById('result'); if (!el) return null; const b = document.body; const r = el.getBoundingClientRect(); return r.top + (b.scrollHeight > b.clientHeight + 50 ? b.scrollTop : window.scrollY); });
    if (top == null) throw new Error('#result が見つかりません');
    const total = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    // 遅延描画を促す
    for (let y = top; y < Math.min(total, top + SLICES * SLICE_H + SLICE_H); y += 500) {
      await page.evaluate((yy) => { const b = document.body; if (b.scrollHeight > b.clientHeight + 50) b.scrollTo(0, yy); else window.scrollTo(0, yy); }, y);
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(1200);
    for (let i = 0; i < SLICES; i++) {
      const y = top + i * SLICE_H;
      if (y > total) break;
      await page.evaluate((yy) => { const b = document.body; if (b.scrollHeight > b.clientHeight + 50) b.scrollTo(0, yy); else window.scrollTo(0, yy); }, y);
      await page.waitForTimeout(900);
      const file = path.join(OUT, `result__w${w}__${i + 1}.png`);
      await page.screenshot({ path: file });
      row.files.push(path.relative(ROOT, file).replace(/\\/g, '/'));
    }
    row.overflowX = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  } catch (e) { row.error = String(e.message).split('\n')[0]; }
  report.push(row);
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
