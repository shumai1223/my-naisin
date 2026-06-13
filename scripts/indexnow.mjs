#!/usr/bin/env node
/**
 * IndexNow 差分ping（Bing / Yandex 即時インデックス通知）。
 *
 * なぜ：ChatGPT Search は Bing インデックスを参照する。Google より速くAI送客経路に載せるには
 * 新規URLを公開直後に IndexNow へ通知するのが効く（堀B／GEOの入口）。
 *
 * 仕組み（lastmodが信用できない設計に強い「URL集合の差分」方式）：
 *  1) 本番 sitemap.xml を取得し <loc> を集合化。
 *  2) 既知スナップショット（.indexnow/known-urls.json）との差分＝新規URLを抽出。
 *  3) 新規URLを IndexNow に一括送信（最大10000/req）。
 *  4) スナップショットを現在の集合で更新（GitHub Action がコミット）。
 *  - sitemapの lastModified はビルド時刻で毎回変わるため lastmod 差分は使わない＝過剰pingを避ける。
 *  - --all で全URL再送信（初回/全面リインデックス用）、--dry で送信せず確認のみ。
 *
 * 使い方:
 *   node scripts/indexnow.mjs            # 新規URLのみ通知
 *   node scripts/indexnow.mjs --all      # sitemap全URLを通知
 *   node scripts/indexnow.mjs --dry      # 送信せず差分のみ表示
 *
 * env:
 *   INDEXNOW_KEY        … キー（未設定なら下のDEFAULT_KEY＝public/<key>.txt と一致）
 *   INDEXNOW_SITEMAP    … sitemap URL（既定 https://my-naishin.com/sitemap.xml）
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const HOST = 'my-naishin.com';
const DEFAULT_KEY = 'ea960451c8ba64488bdfe44efe8f7399'; // public/<DEFAULT_KEY>.txt と一致させること
const KEY = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = process.env.INDEXNOW_SITEMAP || `https://${HOST}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SNAPSHOT = resolve(ROOT, '.indexnow/known-urls.json');
const BATCH = 10000;

const argv = new Set(process.argv.slice(2));
const ALL = argv.has('--all');
const DRY = argv.has('--dry');

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL, { headers: { 'User-Agent': 'my-naishin-indexnow/1.0' } });
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].trim());
  return [...new Set(locs)];
}

async function loadSnapshot() {
  try {
    const raw = await readFile(SNAPSHOT, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveSnapshot(urls) {
  await mkdir(dirname(SNAPSHOT), { recursive: true });
  await writeFile(SNAPSHOT, JSON.stringify([...urls].sort(), null, 2) + '\n', 'utf8');
}

async function pingBatch(urlList) {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  return { status: res.status, ok: res.ok };
}

async function main() {
  const current = await fetchSitemapUrls();
  if (current.length === 0) throw new Error('sitemap に <loc> が見つかりません');
  const snapshot = await loadSnapshot();
  const known = new Set(snapshot);
  const newUrls = current.filter((u) => !known.has(u));
  const toPing = ALL ? current : newUrls;

  console.log(`[indexnow] sitemap=${current.length} url, known=${snapshot.length}, new=${newUrls.length}, mode=${ALL ? 'all' : 'diff'}`);

  if (toPing.length === 0) {
    console.log('[indexnow] 新規URLなし。送信スキップ。');
    await saveSnapshot(current); // sitemapから消えたURLの掃除も兼ねて同期
    return;
  }

  if (DRY) {
    console.log('[indexnow] --dry: 送信せず対象を表示:');
    toPing.slice(0, 50).forEach((u) => console.log('  ' + u));
    if (toPing.length > 50) console.log(`  …他 ${toPing.length - 50} 件`);
    return;
  }

  for (let i = 0; i < toPing.length; i += BATCH) {
    const chunk = toPing.slice(i, i + BATCH);
    const { status, ok } = await pingBatch(chunk);
    console.log(`[indexnow] POST ${chunk.length} URL → ${status} ${ok ? 'OK' : 'NG'}`);
    if (!ok && status !== 200 && status !== 202) {
      // 422=URL/keyの不一致など。CIを赤くして気づけるように。
      process.exitCode = 1;
    }
  }

  await saveSnapshot(current);
  console.log('[indexnow] スナップショット更新完了。');
}

main().catch((err) => {
  console.error('[indexnow] エラー:', err.message);
  process.exit(1);
});
