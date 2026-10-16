#!/usr/bin/env node
/**
 * 画面確認用のスクリーンショット（Playwright）。
 *
 *   node scripts/ui/shot.mjs --out <dir> [--base http://localhost:3100] [--widths 390,1280] [--slices 3] [--slice-h 1000] [--keep-ads] <path> [<path> ...]
 *
 * - 各ページを幅ごとに、上から slice-h px ずつ slices 枚に分けて撮る（長いページを縮小せず、文字が読める大きさで見るため）。
 * - ファイル名: <out>/<ページ名>__w<幅>__<連番>.png（連番は1始まり）。
 * - Cookie同意バナーは「必須のみ許可」を押して閉じる。広告枠（AdSense）は空白に見えるので隠す（--keep-ads で残す）。
 * - 動きは止める（reducedMotion）。開発サーバーの初回コンパイルは遅いので、待ちは長め。
 * - 結果の最後に、ページごとの横スクロール（はみ出し）の有無と、12px未満の文字の数を JSON で出す。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { chromium } = require(path.join(ROOT, 'node_modules', 'playwright'));

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const flag = (name) => args.includes(name);
const valueFlags = new Set(['--out', '--base', '--widths', '--slices', '--slice-h']);
const pages = args.filter((a, i) => !a.startsWith('--') && !valueFlags.has(args[i - 1]));
const OUT = path.resolve(ROOT, opt('--out', 'tmp/shots'));
const BASE = opt('--base', 'http://localhost:3100').replace(/\/$/, '');
const WIDTHS = opt('--widths', '390,1280').split(',').map(Number);
const SLICES = Number(opt('--slices', '3'));
const SLICE_H = Number(opt('--slice-h', '1000'));
const KEEP_ADS = flag('--keep-ads');
const NO_DISMISS = flag('--no-dismiss'); // Cookie同意バナーを閉じずに撮る（バナー自体の確認用）

fs.mkdirSync(OUT, { recursive: true });

// 排他ロック: メモリが小さいPCなので、ブラウザは同時に1つだけ起動する（他の確認が終わるまで待つ）。
const LOCK = path.join(ROOT, 'tmp', 'shot.lock');
fs.mkdirSync(path.dirname(LOCK), { recursive: true });
async function acquire() {
  const start = Date.now();
  for (;;) {
    try { fs.writeFileSync(LOCK, String(process.pid), { flag: 'wx' }); return; } catch {
      try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 10 * 60 * 1000) fs.unlinkSync(LOCK); } catch { /* 他のプロセスが消した */ }
      if (Date.now() - start > 20 * 60 * 1000) throw new Error('shot.lock を取得できません（20分待ち）');
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}
await acquire();
const release = () => { try { fs.unlinkSync(LOCK); } catch { /* 無し */ } };
process.on('exit', release);
process.on('SIGINT', () => { release(); process.exit(1); });
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\//, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '')).slice(0, 60);

const browser = await chromium.launch();
const report = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: SLICE_H },
    deviceScaleFactor: w < 600 ? 2 : 1.5,
    ignoreHTTPSErrors: true,
    locale: 'ja-JP',
    reducedMotion: 'reduce',
    isMobile: w < 600,
    hasTouch: w < 600,
  });
  // 撮影のための上下スクロールで離脱モーダル（LINE）が出て画面が暗くならないように、このセッションは「表示済み」にしておく。
  await ctx.addInitScript(() => { try { window.sessionStorage.setItem('mn_exit_modal_seen', '1'); } catch (e) { /* 無し */ } });
  for (const p of pages) {
    const page = await ctx.newPage();
    const url = BASE + p;
    const row = { path: p, width: w, files: [] };
    try {
      const resp = await page.goto(url, { waitUntil: 'load', timeout: 180000 });
      row.status = resp ? resp.status() : null;
      await page.waitForTimeout(2500);
      const btn = page.getByText('必須のみ許可');
      if (!NO_DISMISS && (await btn.count())) { await btn.first().click({ timeout: 3000 }).catch(() => {}); await page.waitForTimeout(500); }
      if (!KEEP_ADS) {
        await page.addStyleTag({ content: '.google-auto-placed, ins.adsbygoogle, [id^="aswift"], iframe[id^="google_ads"], iframe[src*="googlesyndication"], iframe[src*="netstar"]{display:none!important}' });
      }
      await page.addStyleTag({ content: 'nextjs-portal, [data-nextjs-toast], [data-next-badge-root]{display:none!important}' });
      // 遅延描画（スクロールで現れる部分）を先に表示させる: 上から下まで少しずつスクロールして戻る
      const scrollTo = (yy) => page.evaluate((y) => { const b = document.body; if (b.scrollHeight > b.clientHeight + 50) b.scrollTo(0, y); else window.scrollTo(0, y); }, yy);
      const h0 = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
      for (let y = 0; y < Math.min(h0, SLICES * SLICE_H + SLICE_H); y += 500) { await scrollTo(y); await page.waitForTimeout(300); }
      await page.waitForTimeout(1200);
      await scrollTo(0);
      await page.waitForTimeout(500);
      const metrics = await page.evaluate(() => {
        const de = document.documentElement;
        const overflowX = de.scrollWidth > de.clientWidth + 1;
        let small = 0;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
          const n = walker.currentNode;
          if (!n.textContent.trim()) continue;
          const el = n.parentElement;
          if (!el || seen.has(el)) continue;
          seen.add(el);
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          if (parseFloat(cs.fontSize) < 11.9) small++;
        }
        return { overflowX, scrollW: de.scrollWidth, clientW: de.clientWidth, height: Math.max(de.scrollHeight, document.body.scrollHeight), smallTextEls: small, title: document.title };
      });
      Object.assign(row, metrics);
      const total = Math.min(SLICES, Math.max(1, Math.ceil(metrics.height / SLICE_H)));
      for (let i = 0; i < total; i++) {
        await scrollTo(i * SLICE_H);
        await page.waitForTimeout(900);
        const file = path.join(OUT, `${slug(p)}__w${w}__${i + 1}.png`);
        await page.screenshot({ path: file });
        row.files.push(path.relative(ROOT, file).replace(/\\/g, '/'));
      }
    } catch (e) {
      row.error = String(e.message).split('\n')[0];
    }
    report.push(row);
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
