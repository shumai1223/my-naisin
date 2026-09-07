import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

// T-Y11F F-2: 「年度をまたいで生き続ける公表ハブページ」の定期監視。
//
// A-2（check-competition-rate-updates.mjs）が見張るR8の一次資料URLは、年度が変わると
// 別URLで出るため恒久的に検知不能になる（22県はURLに年度が埋まる・残りもCMS添付IDが年度依存）。
// このスクリプトは対象が別: src/data/publication-hubs.ts の hubUrl（判明県のみ）をGETし、
// 募集/志願/出願/倍率/進路希望/合格のいずれかを含む.pdf/.xlsxリンクを抽出、前回スナップショット
// （ops/state/hub-links/<pref>.json）と差分を取り、新規出現分を ops/state/hub-events.json に積む。
//
// 抽出/差分ロジック（extractRelevantLinks/diffHubLinks）は src/lib/bairitsu-ingest/hub-diff.ts に
// 純関数として実装されテスト済み。このスクリプトはNode単体実行のためTSを直接importできず
// （check-competition-rate-updates.mjsと同じ制約）、同じロジックをここに再実装している。
// ロジックを変更する場合は両方を同時に直すこと。
//
// ⚠️ 本文PDF自体はここでは取らない（ハブのHTMLだけを読む）。新規リンクが見つかったPDF/xlsxの
//    本文取得は既存の archive-changed-pdfs.mjs 系の仕組みへ引き継ぐ。
// ⚠️ hubUrlが判明していない県（null）はスキップする。推測でURLを作らない（Y-0）。
// ⚠️ 1県1日1回（stateのlastCheckedAtで判定）・リクエスト間隔900ms・UA明示・robots尊重。

const HUBS_SOURCE_PATH = resolve('src/data/publication-hubs.ts');
const STATE_DIR = resolve('ops/state/hub-links');
const EVENTS_PATH = resolve('ops/state/hub-events.json');
const TIMEOUT_MS = 20000;
const REQUEST_INTERVAL_MS = 900;
const MIN_INTERVAL_HOURS = 24;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 MyNaishinBot/1.0 (+https://my-naishin.com)';

// ⚠️src/lib/bairitsu-ingest/hub-diff.tsと同一定義（複製）。2026-09-07実測により
// 「令和9年度」（.htmlも対象）を追加済み。理由・季節限定であることの注記は同ファイル参照。
const RELEVANT_LINK_KEYWORDS = ['募集', '志願', '出願', '倍率', '進路希望', '合格', '令和9年度'];
const RELEVANT_EXTENSION_RE = /\.(pdf|xlsx|html?)$/i;

function stripQueryAndHash(url) {
  return url.split('?')[0].split('#')[0];
}

function safeDecodeUriComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** src/lib/bairitsu-ingest/hub-diff.ts の extractRelevantLinks と同一ロジック（複製）。 */
function extractRelevantLinks(html, baseUrl) {
  const results = [];
  const seen = new Set();
  const linkRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = linkRe.exec(html)) !== null) {
    const hrefRaw = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    const pathOnly = stripQueryAndHash(hrefRaw);
    if (!RELEVANT_EXTENSION_RE.test(pathOnly)) continue;

    const hrefDecoded = safeDecodeUriComponent(hrefRaw);
    const hasKeyword = RELEVANT_LINK_KEYWORDS.some((k) => text.includes(k) || hrefDecoded.includes(k));
    if (!hasKeyword) continue;

    let absoluteUrl;
    try {
      absoluteUrl = new URL(hrefRaw, baseUrl).toString();
    } catch {
      continue;
    }
    if (seen.has(absoluteUrl)) continue;
    seen.add(absoluteUrl);
    results.push({ href: absoluteUrl, text });
  }
  return results;
}

/** src/lib/bairitsu-ingest/hub-diff.ts の diffHubLinks と同一ロジック（複製）。 */
function diffHubLinks(previous, current) {
  const prevHrefs = new Set(previous.map((l) => l.href));
  const currHrefs = new Set(current.map((l) => l.href));
  const newLinks = current.filter((l) => !prevHrefs.has(l.href));
  const removedLinks = previous.filter((l) => !currHrefs.has(l.href));
  const unchangedCount = current.filter((l) => prevHrefs.has(l.href)).length;
  return { newLinks, removedLinks, unchangedCount };
}

/** publication-hubs.ts のオブジェクトリテラル配列を正規表現で機械抽出する（check-competition-rate-updates.mjsと同型の制約）。 */
async function loadHubs() {
  const content = await readFile(HUBS_SOURCE_PATH, 'utf-8');
  const entryRe =
    /prefecture:\s*'([^']*)',\s*\n\s*hubUrl:\s*(null|'[^']*'),\s*\n\s*hubKind:\s*'([^']*)',/g;
  const hubs = [];
  let m;
  while ((m = entryRe.exec(content)) !== null) {
    const hubUrl = m[2] === 'null' ? null : m[2].slice(1, -1);
    hubs.push({ prefecture: m[1], hubUrl, hubKind: m[3] });
  }
  return hubs;
}

async function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(await readFile(path, 'utf-8'));
  } catch {
    return fallback;
  }
}

async function saveJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function shouldFetch(lastCheckedAt, now) {
  if (!lastCheckedAt) return true;
  const last = new Date(lastCheckedAt).getTime();
  if (Number.isNaN(last)) return true;
  return now.getTime() - last >= MIN_INTERVAL_HOURS * 60 * 60 * 1000;
}

const robotsCache = new Map();

async function fetchRobotsRules(origin) {
  if (robotsCache.has(origin)) return robotsCache.get(origin);
  const rules = [];
  try {
    const res = await fetchWithTimeout(`${origin}/robots.txt`, 'GET');
    if (res && res.ok) {
      const text = await res.text();
      let applies = false;
      for (const rawLine of text.split('\n')) {
        const line = rawLine.trim();
        if (/^user-agent:/i.test(line)) {
          applies = line.toLowerCase().includes('*');
          continue;
        }
        if (applies && /^disallow:/i.test(line)) {
          const path = line.split(':').slice(1).join(':').trim();
          if (path) rules.push(path);
        }
      }
    }
  } catch {
    // robots.txt自体が取得できない場合は「拒否ルールなし」として扱う。
  }
  robotsCache.set(origin, rules);
  return rules;
}

function isDisallowedByRobots(url, rules) {
  const path = new URL(url).pathname;
  return rules.some((rule) => path.startsWith(rule));
}

async function fetchWithTimeout(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { method, redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,*/*' }, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const hubs = await loadHubs();
  const targets = hubs.filter((h) => h.hubUrl !== null);
  if (targets.length === 0) {
    console.log('ハブURLが判明している県が0件のため何もしない');
    return;
  }

  await mkdir(STATE_DIR, { recursive: true });
  const events = await loadJson(EVENTS_PATH, { events: [] });
  const now = new Date();
  const nowIso = now.toISOString();
  const results = [];

  for (const hub of targets) {
    const snapshotPath = resolve(STATE_DIR, `${hub.prefecture}.json`);
    const snapshot = await loadJson(snapshotPath, { lastCheckedAt: null, links: [] });

    if (!shouldFetch(snapshot.lastCheckedAt, now)) {
      results.push({ prefecture: hub.prefecture, skipped: true });
      continue;
    }

    const origin = new URL(hub.hubUrl).origin;
    const rules = await fetchRobotsRules(origin);
    if (isDisallowedByRobots(hub.hubUrl, rules)) {
      results.push({ prefecture: hub.prefecture, status: 'robots-blocked' });
      await sleep(REQUEST_INTERVAL_MS);
      continue;
    }

    try {
      const res = await fetchWithTimeout(hub.hubUrl, 'GET');
      if (!res.ok) {
        results.push({ prefecture: hub.prefecture, status: `http-${res.status}` });
        await sleep(REQUEST_INTERVAL_MS);
        continue;
      }
      const html = await res.text();
      const currentLinks = extractRelevantLinks(html, hub.hubUrl);
      const diff = diffHubLinks(snapshot.links, currentLinks);

      await saveJson(snapshotPath, { lastCheckedAt: nowIso, links: currentLinks });

      if (diff.newLinks.length > 0) {
        for (const link of diff.newLinks) {
          events.events.push({ prefecture: hub.prefecture, href: link.href, text: link.text, detectedAt: nowIso });
        }
      }
      results.push({ prefecture: hub.prefecture, status: 'ok', newCount: diff.newLinks.length, removedCount: diff.removedLinks.length });
    } catch (error) {
      results.push({ prefecture: hub.prefecture, status: 'error', note: error?.message ?? 'unknown fetch error' });
    }
    await sleep(REQUEST_INTERVAL_MS);
  }

  await saveJson(EVENTS_PATH, events);

  const checked = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  const withNewLinks = checked.filter((r) => r.newCount > 0);
  console.log(`ハブ監視対象: ${targets.length}県 / 今回チェック: ${checked.length}県 / 24h未経過でskip: ${skipped.length}県`);
  if (withNewLinks.length > 0) {
    console.log(`⚠️ 新規リンクを検知: ${withNewLinks.map((r) => `${r.prefecture}(${r.newCount}件)`).join(', ')}`);
  } else {
    console.log('新規リンク: なし');
  }
  for (const r of results) {
    if (r.status && r.status !== 'ok') console.log(`  ${r.prefecture}: ${r.status}${r.note ? ` (${r.note})` : ''}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
