#!/usr/bin/env node
/**
 * スクロール後に出る固定要素（常設LINEバー・先頭へ戻る・読書進捗・Cookie同意・離脱モーダル）の確認用。
 *
 *   node scripts/ui/shot-fixed.mjs --out <dir> [--base http://localhost:3100] [--widths 390,1280] [--cookie] [--exit-modal] <path> [<path> ...]
 *
 * 各ページを新しいブラウザ文脈（保存データなし）で開き、
 *   1) 6回ホイールで下へスクロール → window.scrollY と、先頭へ戻るボタン・読書進捗・常設バーの有無を JSON で出す
 *   2) その時点の画面（ビューポート）を撮る  … <out>/<ページ名>__w<幅>__scrolled.png
 *   3) --exit-modal のとき、8秒待ってから離脱の合図を送り、モーダルが出たら撮る … __exit.png
 * Cookie同意は既定で閉じる。--cookie を付けると閉じずに（バナーが出た状態で）撮る。
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
const flag = (n) => args.includes(n);
const valueFlags = new Set(['--out', '--base', '--widths']);
const pages = args.filter((a, i) => !a.startsWith('--') && !valueFlags.has(args[i - 1]));
const OUT = path.resolve(ROOT, opt('--out', 'tmp/shots-fixed'));
const BASE = opt('--base', 'http://localhost:3100').replace(/\/$/, '');
const WIDTHS = opt('--widths', '390,1280').split(',').map(Number);
const KEEP_COOKIE = flag('--cookie');
const EXIT = flag('--exit-modal');
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

const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '_'));
const browser = await chromium.launch();
const report = [];
for (const route of pages) {
  for (const w of WIDTHS) {
    const mobile = w < 600;
    const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : 800 }, deviceScaleFactor: mobile ? 2 : 1.5, ignoreHTTPSErrors: true, locale: 'ja-JP', reducedMotion: 'reduce', isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    const row = { route, width: w };
    try {
      await page.goto(BASE + route, { waitUntil: 'load', timeout: 180000 });
      await page.waitForTimeout(2500);
      if (!KEEP_COOKIE) {
        const btn = page.getByText('必須のみ許可');
        if (await btn.count()) { await btn.first().click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(400); }
      }
      await page.mouse.move(mobile ? 195 : 640, 400);
      for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 700); await page.waitForTimeout(250); }
      await page.waitForTimeout(900);
      Object.assign(row, await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="ページ先頭へ戻る"]');
        const bar = document.querySelector('[role="progressbar"]');
        const fixedEls = [...document.querySelectorAll('body *')].filter((e) => { const s = getComputedStyle(e); return s.position === 'fixed' && e.getBoundingClientRect().height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; }).map((e) => (e.getAttribute('aria-label') || e.id || e.className || e.tagName).toString().slice(0, 60));
        return {
          windowScrollY: Math.round(window.scrollY),
          bodyScrollTop: Math.round(document.body.scrollTop),
          backToTopVisible: btn ? !String(btn.className).includes('invisible') : null,
          progressNow: bar ? bar.getAttribute('aria-valuenow') : null,
          fixedElements: fixedEls,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        };
      }));
      const f1 = path.join(OUT, `${slug(route)}__w${w}__scrolled.png`);
      await page.screenshot({ path: f1 });
      row.scrolledShot = path.relative(ROOT, f1);
      if (EXIT) {
        await page.waitForTimeout(8500);
        await page.evaluate(() => { document.dispatchEvent(new MouseEvent('mouseout', { clientY: -1, relatedTarget: null, bubbles: true })); });
        await page.waitForTimeout(800);
        // モバイルの合図（タブが隠れる）も試す
        let dialog = await page.locator('[role="dialog"]').count();
        if (!dialog) {
          await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
          await page.waitForTimeout(800);
          dialog = await page.locator('[role="dialog"]').count();
        }
        row.exitModal = dialog > 0;
        if (dialog) {
          const f2 = path.join(OUT, `${slug(route)}__w${w}__exit.png`);
          await page.screenshot({ path: f2 });
          row.exitShot = path.relative(ROOT, f2);
        }
      }
    } catch (e) {
      row.error = String(e && e.message ? e.message : e).slice(0, 200);
    }
    report.push(row);
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
