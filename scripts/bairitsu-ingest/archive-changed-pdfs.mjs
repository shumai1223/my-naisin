import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

// T-Y11E E-2: A-2（`check-competition-rate-updates.mjs`）が`changed`と判定した県だけ、
// 実際のPDF本文をダウンロードして保存する（教委は旧年度の資料を予告なく削除するため）。
//
// 判定ロジック（pickArchiveCandidates/buildArchiveEntry）は src/lib/bairitsu-pdf-archive.ts に
// 純関数として実装されテスト済み。このスクリプトはNode単体実行のためTSを直接importできず
// （check-competition-rate-updates.mjsと同じ制約）、同じロジックをここに再実装している。
//
// ⚠️ 追加のポーリングは行わない。A-2の既存サイクル（1県1日1回・24時間間隔）に相乗りし、
//    「今回changedと判定された県」だけを対象にする＝相手サーバへの負荷は増えない。
// ⚠️ robots.txtは再確認する（A-2実行からこのスクリプト実行までの間隔で変わっている可能性を
//    排除しないため）。
// ⚠️ 保存先(ARCHIVE_DIR)はgit管理外（.gitignore登録済み）。台帳(MANIFEST_PATH)のみコミットする。

const WATCH_STATE_PATH = resolve('ops/state/competition-rate-watch.json');
const ARCHIVE_MANIFEST_PATH = resolve('ops/raw/bairitsu-pdf-archive-manifest.json');
const ARCHIVE_DIR = resolve('ops/raw/bairitsu-pdf-archive');
const TIMEOUT_MS = 30000;
const REQUEST_INTERVAL_MS = 900;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 MyNaishinBot/1.0 (+https://my-naishin.com)';

function pickArchiveCandidates(watchState, archiveState) {
  const candidates = [];
  for (const [prefecture, entry] of Object.entries(watchState.entries)) {
    if (entry.lastStatus !== 'changed') continue;
    if (!entry.fingerprint) continue;
    const archived = archiveState.entries[prefecture];
    if (archived && archived.fingerprintAtArchive === entry.fingerprint) continue;
    candidates.push(prefecture);
  }
  return candidates;
}

function buildArchiveEntry(prefecture, entry, outcome, nowIso) {
  return {
    prefecture,
    url: entry.url,
    sha256: outcome.sha256,
    byteLength: outcome.byteLength,
    fingerprintAtArchive: entry.fingerprint ?? '',
    archivedAt: nowIso,
  };
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
    return await fetch(url, { method, redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'application/pdf,*/*' }, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const watchState = await loadJson(WATCH_STATE_PATH, { entries: {} });
  const archiveState = await loadJson(ARCHIVE_MANIFEST_PATH, { entries: {} });

  const candidates = pickArchiveCandidates(watchState, archiveState);
  if (candidates.length === 0) {
    console.log('アーカイブ対象なし（changed判定の県が0件、または既に同一版を保存済み）');
    return;
  }

  await mkdir(ARCHIVE_DIR, { recursive: true });
  const nowIso = new Date().toISOString();
  const results = [];

  for (const prefecture of candidates) {
    const entry = watchState.entries[prefecture];
    const origin = new URL(entry.url).origin;
    const rules = await fetchRobotsRules(origin);
    if (isDisallowedByRobots(entry.url, rules)) {
      results.push({ prefecture, status: 'robots-blocked' });
      await sleep(REQUEST_INTERVAL_MS);
      continue;
    }

    try {
      const res = await fetchWithTimeout(entry.url, 'GET');
      if (!res.ok) {
        results.push({ prefecture, status: `http-${res.status}` });
        await sleep(REQUEST_INTERVAL_MS);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      const sha256 = createHash('sha256').update(buf).digest('hex');
      const prefDir = resolve(ARCHIVE_DIR, prefecture);
      await mkdir(prefDir, { recursive: true });
      const filePath = resolve(prefDir, `${sha256}.pdf`);
      await writeFile(filePath, buf);
      archiveState.entries[prefecture] = buildArchiveEntry(prefecture, entry, { sha256, byteLength: buf.length }, nowIso);
      results.push({ prefecture, status: 'saved', sha256, byteLength: buf.length });
    } catch (error) {
      results.push({ prefecture, status: 'error', note: error?.message ?? 'unknown fetch error' });
    }
    await sleep(REQUEST_INTERVAL_MS);
  }

  await saveJson(ARCHIVE_MANIFEST_PATH, archiveState);

  const saved = results.filter((r) => r.status === 'saved');
  console.log(`アーカイブ対象: ${candidates.length}県 / 保存成功: ${saved.length}県`);
  for (const r of results) {
    if (r.status !== 'saved') console.log(`  ${r.prefecture}: ${r.status}${r.note ? ` (${r.note})` : ''}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
