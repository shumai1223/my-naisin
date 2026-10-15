#!/usr/bin/env node
/**
 * ブランド素材の生成: favicon.svg / favicon.ico / og-image.png（1200×630）。
 * 本番の og-image.png と favicon.ico は 0 バイト（空）だったため、実物を作る。
 *   node scripts/ui/make-brand-assets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const { chromium } = require(path.join(ROOT, 'node_modules', 'playwright'));
const PUB = path.join(ROOT, 'public');

// 排他ロック（shot.mjs と同じ）
const LOCK = path.join(ROOT, 'tmp', 'shot.lock');
fs.mkdirSync(path.dirname(LOCK), { recursive: true });
for (let i = 0; ; i++) {
  try { fs.writeFileSync(LOCK, String(process.pid), { flag: 'wx' }); break; } catch {
    if (i > 400) throw new Error('lock timeout');
    await new Promise((r) => setTimeout(r, 3000));
  }
}
process.on('exit', () => { try { fs.unlinkSync(LOCK); } catch { /* 無し */ } });

const BRAND = '#17543e';
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${BRAND}" />
  <path d="M19 47V17l26 30V17" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`;
fs.writeFileSync(path.join(PUB, 'favicon.svg'), favicon);

const browser = await chromium.launch();

// ---- favicon.ico（PNG埋め込み。16/32/48） ----
async function pngOf(size) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent">${favicon.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  await page.close();
  return buf;
}
const sizes = [16, 32, 48];
const pngs = [];
for (const s of sizes) pngs.push(await pngOf(s));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0); e.writeUInt8(s === 256 ? 0 : s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
fs.writeFileSync(path.join(PUB, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

// ---- og-image.png（1200×630） ----
const og = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;background:#f4f7f5;color:#17231d;font-family:'BIZ UDPGothic','Yu Gothic','Meiryo',sans-serif;position:relative}
  .frame{position:absolute;inset:36px;border:2px solid #cddad3;background:#fff}
  .mark{position:absolute;left:84px;top:84px;width:72px;height:72px;border-radius:12px;background:${BRAND}}
  .brand{position:absolute;left:176px;top:96px;font-size:44px;font-weight:700;color:${BRAND};letter-spacing:.01em}
  h1{position:absolute;left:84px;top:210px;font-size:76px;line-height:1.28;font-weight:700;width:1000px}
  .sub{position:absolute;left:84px;top:440px;font-size:30px;line-height:1.5;color:#4f6158;width:1040px;white-space:nowrap}
  .url{position:absolute;left:84px;bottom:72px;font-size:28px;color:#4f6158}
  .rule{position:absolute;left:84px;right:84px;bottom:140px;height:2px;background:#cddad3}
</style></head><body>
  <div class="frame"></div>
  <div class="mark"><svg viewBox="0 0 64 64" width="72" height="72"><path d="M19 47V17l26 30V17" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
  <div class="brand">My Naishin</div>
  <h1>内申点の計算と、<br>高校入試のデータ。</h1>
  <p class="sub">全国47都道府県。教育委員会の公表資料をもとに、無料で確認できます。</p>
  <div class="rule"></div>
  <div class="url">my-naishin.com</div>
</body></html>`;
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(og, { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.screenshot({ path: path.join(PUB, 'og-image.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log('written: favicon.svg, favicon.ico, og-image.png');
