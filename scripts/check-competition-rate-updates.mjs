import { readFile, readdir, mkdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { existsSync } from 'node:fs';

// T-Y11 A-2: 47都道府県の倍率公表資料（令和8年度・一次ソース）の更新検知。
//
// 判定ロジック（shouldFetch/evaluateFetch/buildFingerprint）は src/lib/competition-rate-watch.ts に
// 純関数として実装されテスト済み。このスクリプトはNode単体実行のためTSを直接importできず
// （check-competition-rate-links.mjs と同じ制約）、同じロジックをここに再実装している。
// ロジックを変更する場合は両方を同時に直すこと（乖離するとテストの保証が実行時の挙動と一致しなくなる）。
//
// ⚠️ 本文はダウンロードしない（HEADのみ・ETag/Last-Modified/Content-Lengthで軽量フィンガープリント）。
// ⚠️ 相手サーバへの負荷を避けるため、1県1日1回まで（stateのlastCheckedAtで判定）・リクエスト間隔を空ける。
// ⚠️ robots.txtで拒否されている県は取得を見送り「robots-blocked」として台帳に残す（推測しない）。
// ⚠️ この環境ではTLS傍受でfetchが失敗することがある（[[fable5-loop-protocol]]既知の罠）。
//    ローカル実行時は `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run check:competition-updates` を使うこと。

const DATA_DIR = resolve('src/data/competition-rates');
const STATE_PATH = resolve('ops/state/competition-rate-watch.json');
const TIMEOUT_MS = 15000;
const REQUEST_INTERVAL_MS = 800;
const MIN_INTERVAL_HOURS = 24;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 MyNaishinBot/1.0 (+https://my-naishin.com)';

const OFFICIAL_TLD_RE = /\.(lg|go|ed)\.jp$/i;
const PREF_DOMAIN_RE = /(^|\.)pref\.[^.]+\.jp$/i;
const KNOWN_OFFICIAL_HOST_ALLOWLIST = new Set(['www.kyoto-be.ne.jp']);

function isOfficialUrl(url) {
  let hostname;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return OFFICIAL_TLD_RE.test(hostname) || PREF_DOMAIN_RE.test(hostname) || KNOWN_OFFICIAL_HOST_ALLOWLIST.has(hostname);
}

function westernYearOf(fiscalYear) {
  const m = fiscalYear.match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
}

/** 各県ファイルの`sources[]`から最新年度の一次ソースURL（複数あり得る）を機械抽出する。 */
async function extractLatestOfficialUrls() {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('__tests__'));
  const re = /url:\s*'([^']*)',\s*\n\s*docTitle:\s*'([^']*)',\s*\n\s*fiscalYear:\s*'([^']*)',\s*\n\s*fetchedAt:\s*'([^']*)',/g;
  const result = {};
  for (const file of files) {
    const pref = file.replace(/\.ts$/, '');
    const content = await readFile(join(DATA_DIR, file), 'utf-8');
    const sources = [];
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(content)) !== null) {
      sources.push({ url: m[1], docTitle: m[2], fiscalYear: m[3], fetchedAt: m[4] });
    }
    if (sources.length === 0) continue;
    const latestYear = Math.max(...sources.map((s) => westernYearOf(s.fiscalYear)));
    const latestSources = sources.filter((s) => westernYearOf(s.fiscalYear) === latestYear);
    const official = latestSources.filter((s) => isOfficialUrl(s.url));
    if (official.length === 0) continue;
    // 複数の一次ソースがある県（tokyo/fukuoka/aomori/gifu等）は先頭の1件のみ監視対象にする
    // （全部を監視すると請求が増える割に検知価値が薄い・まずは代表1件で十分）。
    result[pref] = official[0].url;
  }
  return result;
}

async function loadState() {
  if (!existsSync(STATE_PATH)) return { entries: {} };
  try {
    return JSON.parse(await readFile(STATE_PATH, 'utf-8'));
  } catch {
    return { entries: {} };
  }
}

async function saveState(state) {
  await mkdir(dirname(STATE_PATH), { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8');
}

function shouldFetch(entry, now, minIntervalHours = MIN_INTERVAL_HOURS) {
  if (!entry || !entry.lastCheckedAt) return true;
  const last = new Date(entry.lastCheckedAt).getTime();
  if (Number.isNaN(last)) return true;
  return now.getTime() - last >= minIntervalHours * 60 * 60 * 1000;
}

function buildFingerprint(headers) {
  return [headers.etag ?? '', headers.lastModified ?? '', headers.contentLength ?? ''].join('|');
}

function evaluateFetch(prefecture, url, prev, outcome, nowIso) {
  if (outcome.fingerprint === undefined) {
    return {
      prefecture,
      url,
      lastCheckedAt: nowIso,
      lastStatus: 'robots-blocked',
      fingerprint: prev?.fingerprint ?? null,
      changedAt: prev?.changedAt ?? null,
      note: outcome.note ?? 'robots.txtで拒否されたため取得を見送った',
    };
  }
  if (outcome.fingerprint === null) {
    return {
      prefecture,
      url,
      lastCheckedAt: nowIso,
      lastStatus: 'unreachable',
      fingerprint: prev?.fingerprint ?? null,
      changedAt: prev?.changedAt ?? null,
      note: outcome.note ?? '到達不能（DNS解決不可・タイムアウト等）',
    };
  }
  if (outcome.fingerprint === '') {
    return {
      prefecture,
      url,
      lastCheckedAt: nowIso,
      lastStatus: 'ok',
      fingerprint: prev?.fingerprint ?? null,
      changedAt: prev?.changedAt ?? null,
      note: 'ETag/Last-Modified/Content-Lengthのいずれも取得できず判定不能（変化なしとして扱う）',
    };
  }
  const isFirstObservation = !prev || prev.fingerprint === null;
  const changed = !isFirstObservation && prev.fingerprint !== outcome.fingerprint;
  return {
    prefecture,
    url,
    lastCheckedAt: nowIso,
    lastStatus: changed ? 'changed' : 'ok',
    fingerprint: outcome.fingerprint,
    changedAt: changed ? nowIso : prev?.changedAt ?? null,
    note: changed ? '前回チェック時からヘッダのフィンガープリントが変化した（内容更新の可能性）' : null,
  };
}

const robotsCache = new Map();

/** ホストのrobots.txtを取得し、User-agent:*向けのdisallowパス一覧を返す（キャッシュ付き）。 */
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
    // robots.txt自体が取得できない場合は「拒否ルールなし」として扱う（過度に保守的にしない）。
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
    return await fetch(url, { method, redirect: 'follow', headers: { 'User-Agent': UA, Accept: '*/*' }, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const urlByPrefecture = await extractLatestOfficialUrls();
  const state = await loadState();
  const now = new Date();
  const nowIso = now.toISOString();

  const results = [];
  for (const [prefecture, url] of Object.entries(urlByPrefecture)) {
    const prev = state.entries[prefecture];
    if (!shouldFetch(prev, now)) {
      results.push({ prefecture, skipped: true });
      continue;
    }

    const origin = new URL(url).origin;
    const rules = await fetchRobotsRules(origin);
    if (isDisallowedByRobots(url, rules)) {
      state.entries[prefecture] = evaluateFetch(prefecture, url, prev, { fingerprint: undefined }, nowIso);
      results.push({ prefecture, status: 'robots-blocked' });
      await sleep(REQUEST_INTERVAL_MS);
      continue;
    }

    let outcome;
    try {
      let res = await fetchWithTimeout(url, 'HEAD');
      if (!res.ok && res.status !== 405) {
        // 一部サーバはHEADを405/501で拒否する。GETにフォールバックするが、body自体は読まない
        // （fetchのstreamを閉じるだけでダウンロードは完了しない）。
      }
      if (res.status === 403 || res.status === 405 || res.status === 501 || res.status >= 500) {
        res = await fetchWithTimeout(url, 'GET');
        res.body?.cancel?.();
      }
      if (res.status === 404 || res.status === 410) {
        outcome = { fingerprint: null, note: `HTTP ${res.status}（資料が削除された可能性）` };
      } else {
        outcome = {
          fingerprint: buildFingerprint({
            etag: res.headers.get('etag'),
            lastModified: res.headers.get('last-modified'),
            contentLength: res.headers.get('content-length'),
          }),
        };
      }
    } catch (error) {
      outcome = { fingerprint: null, note: error?.message ?? 'unknown fetch error' };
    }

    state.entries[prefecture] = evaluateFetch(prefecture, url, prev, outcome, nowIso);
    results.push({ prefecture, status: state.entries[prefecture].lastStatus });
    await sleep(REQUEST_INTERVAL_MS);
  }

  await saveState(state);

  const checked = results.filter((r) => !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  const changed = checked.filter((r) => r.status === 'changed');
  console.log(`監視対象: ${results.length}県 / 今回チェック: ${checked.length}県 / 24h未経過でskip: ${skipped.length}県`);
  if (changed.length > 0) {
    console.log(`⚠️ 更新を検知: ${changed.map((r) => r.prefecture).join(', ')}`);
  } else {
    console.log('更新検知: なし');
  }
  const unreachable = checked.filter((r) => r.status === 'unreachable');
  if (unreachable.length > 0) console.log(`到達不能: ${unreachable.map((r) => r.prefecture).join(', ')}`);
  const robotsBlocked = checked.filter((r) => r.status === 'robots-blocked');
  if (robotsBlocked.length > 0) console.log(`robots.txtで拒否: ${robotsBlocked.map((r) => r.prefecture).join(', ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
