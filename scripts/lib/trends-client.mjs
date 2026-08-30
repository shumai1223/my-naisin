#!/usr/bin/env node
// Google Trends クライアント（scripts/trends-mcp.mjs と scripts/trends.mjs の共通土台）。
//
// 【なぜ自前実装か】
// Google Trends には無料で使える公式APIが無い（2025年発表の公式Trends APIはalpha・要申請）。
// npm の非公式ラッパ（google-trends-api 等）は数年メンテが止まっており、cookie取得・429対応・
// レスポンス形式の変更に追随できていない。ここでは trends.google.com 自身が使っている widget
// エンドポイントを直接叩き、「壊れやすい部分」を全部この層に閉じ込める。
//
// 【安定化のための設計（= 本ファイルの存在理由）】
//  1. 直列キュー + 最小間隔: Trends は並列アクセスに極端に弱く即429になる。全リクエストを
//     1本のPromiseチェーンに並べ、最短 minIntervalMs 間隔（既定1.5秒）でしか発射しない。
//  2. cookie自動管理: NIDクッキーが無いと403/429が激増する。トップページから採取して
//     .trends/cookie.json に保存し、期限切れ・429時に自動で取り直す。
//  3. 指数バックオフ + ジッタ: 429/5xx/ネットワーク断は最大 maxRetries 回まで待って再試行。
//     429のときは cookie を捨ててから再試行する（レート制限の主因がcookie失効のことがある）。
//  4. ディスクキャッシュ + stale-if-error: Trends の値は週次更新なので既定6時間キャッシュ。
//     さらに「取得に失敗したが古いキャッシュがある」場合は stale フラグ付きで古い値を返す。
//     → Google側が一時的に不調でもツールが無応答/エラーにならない（体感の安定性の本体）。
//  5. タイムアウト: AbortSignal で必ず打ち切る（既定20秒）。MCPクライアントを待たせない。
//  6. 会社ネットのTLS傍受対策は node --use-system-ca（他のMCPサーバーと同じ）。
//
// 鉄則: stdio MCP から使われるため stdout には絶対に書かない（ログは console.error のみ）。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIR = process.env.TRENDS_DIR || path.join(ROOT, '.trends');
const CACHE_DIR = path.join(DIR, 'cache');
const COOKIE_FILE = path.join(DIR, 'cookie.json');

const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

export const CFG = {
  hl: process.env.TRENDS_HL || 'ja',
  tz: num(process.env.TRENDS_TZ, -540), // 分単位。JST(UTC+9) は -540。
  geo: process.env.TRENDS_GEO || 'JP',
  minIntervalMs: num(process.env.TRENDS_MIN_INTERVAL_MS, 1500),
  timeoutMs: num(process.env.TRENDS_TIMEOUT_MS, 20000),
  maxRetries: num(process.env.TRENDS_MAX_RETRIES, 4),
  cookieTtlMs: num(process.env.TRENDS_COOKIE_TTL_MIN, 240) * 60_000,
  cacheTtlMs: num(process.env.TRENDS_CACHE_TTL_MIN, 360) * 60_000,
};

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

// 稼働状況（trends_health で見せる）。プロセス寿命の間だけ持つ。
export const STATS = {
  startedAt: new Date().toISOString(),
  requests: 0,
  retries: 0,
  rateLimited: 0,
  cacheHits: 0,
  staleServed: 0,
  cookieRefreshes: 0,
  lastError: null,
  lastRequestAt: null,
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.error('[trends]', ...a);

function ensureDirs() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// 純粋関数（scripts/__tests__/trends-client.test.mjs で検証する部分）
// ---------------------------------------------------------------------------

/** Trends のレスポンスは XSSI プレフィクス付きJSON。最初の { か [ から切り出す。 */
export function stripXssiPrefix(text) {
  if (typeof text !== 'string') throw new Error('レスポンスが文字列ではありません');
  const i = text.search(/[[{]/);
  if (i < 0) throw new Error(`JSONが見つかりません: ${text.slice(0, 120)}`);
  return text.slice(i);
}

export function parseTrendsJson(text) {
  return JSON.parse(stripXssiPrefix(text));
}

const TIMEFRAME_PRESETS = [
  'now 1-H',
  'now 4-H',
  'now 1-d',
  'now 7-d',
  'today 1-m',
  'today 3-m',
  'today 12-m',
  'today 5-y',
  'all',
];

/** 期間指定の検証。プリセット or "YYYY-MM-DD YYYY-MM-DD" のみ許す（打ち間違いを黙って空返しにしない）。 */
export function normalizeTimeframe(tf) {
  const t = String(tf ?? 'today 12-m').trim();
  if (TIMEFRAME_PRESETS.includes(t)) return t;
  if (/^\d{4}-\d{2}-\d{2} \d{4}-\d{2}-\d{2}$/.test(t)) return t;
  throw new Error(
    `timeframe が不正です: "${t}" / 使えるのは ${TIMEFRAME_PRESETS.join(', ')} または "YYYY-MM-DD YYYY-MM-DD"`,
  );
}

/** キーワードは Trends の比較上限に合わせて最大5件。空文字は落とす。 */
export function normalizeKeywords(keywords) {
  const list = (Array.isArray(keywords) ? keywords : [keywords])
    .map((k) => String(k ?? '').trim())
    .filter(Boolean);
  if (list.length === 0) throw new Error('keywords が空です');
  if (list.length > 5) throw new Error(`keywords は最大5件です（受領: ${list.length}件）`);
  return list;
}

/** 再試行の待ち時間: 指数バックオフ + ±25%ジッタ（リトライが同期しないように）。 */
export function backoffMs(attempt, base = 1200, cap = 30_000, rand = Math.random) {
  const raw = Math.min(cap, base * 2 ** attempt);
  return Math.round(raw * (0.75 + rand() * 0.5));
}

export function cacheKey(kind, params) {
  const json = JSON.stringify({ kind, params, hl: CFG.hl, tz: CFG.tz });
  return `${kind}-${crypto.createHash('sha1').update(json).digest('hex').slice(0, 16)}`;
}

/** multiline レスポンス → 日付×キーワードの素直な表に潰す。 */
export function shapeTimeline(payload, keywords) {
  return (payload?.default?.timelineData || []).map((p) => {
    const values = {};
    keywords.forEach((k, i) => {
      values[k] = Number(p.value?.[i] ?? 0);
    });
    return {
      date: new Date(Number(p.time) * 1000).toISOString().slice(0, 10),
      formattedTime: p.formattedTime,
      values,
      ...(p.isPartial ? { isPartial: true } : {}),
    };
  });
}

/** 5年分の週次データ → 月ごとの平均指数。季節性（何月に需要が立つか）を決定論的に出す。 */
export function summarizeSeasonality(rows, keyword) {
  const buckets = Array.from({ length: 12 }, () => []);
  for (const r of rows) {
    if (r.isPartial) continue;
    const m = Number(r.date.slice(5, 7)) - 1;
    const v = Number(r.values?.[keyword] ?? 0);
    if (Number.isFinite(v) && m >= 0 && m < 12) buckets[m].push(v);
  }
  const monthly = buckets.map((vals, i) => ({
    month: i + 1,
    samples: vals.length,
    avg: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null,
  }));
  const withData = monthly.filter((m) => m.avg !== null);
  const peak = withData.length ? withData.reduce((a, b) => (b.avg > a.avg ? b : a)) : null;
  const trough = withData.length ? withData.reduce((a, b) => (b.avg < a.avg ? b : a)) : null;
  return {
    monthly,
    peakMonth: peak?.month ?? null,
    troughMonth: trough?.month ?? null,
    // 「一番高い月は一番低い月の何倍か」= 季節係数。冬ピーク判断に使う。
    seasonalRatio: peak && trough && trough.avg > 0 ? Math.round((peak.avg / trough.avg) * 100) / 100 : null,
  };
}

// ---------------------------------------------------------------------------
// cookie
// ---------------------------------------------------------------------------

let cookieMem = null;

function readCookieFile() {
  try {
    return JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeCookieFile(rec) {
  try {
    ensureDirs();
    fs.writeFileSync(COOKIE_FILE, JSON.stringify(rec, null, 2));
  } catch (e) {
    log('cookie保存に失敗（続行）:', e?.message || e);
  }
}

async function fetchCookie() {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), CFG.timeoutMs);
  try {
    const res = await fetch(`https://trends.google.com/?geo=${encodeURIComponent(CFG.geo || 'JP')}`, {
      headers: { 'user-agent': UA, 'accept-language': `${CFG.hl},en;q=0.8` },
      signal: ac.signal,
      redirect: 'follow',
    });
    // getSetCookie() は Node 18.14+ で複数Set-Cookieを配列で取れる。
    const raw =
      typeof res.headers.getSetCookie === 'function'
        ? res.headers.getSetCookie().join('; ')
        : res.headers.get('set-cookie') || '';
    const nid = (raw.match(/NID=[^;]+/) || [])[0];
    if (!nid) throw new Error(`NIDクッキーを取得できません（status=${res.status}）`);
    return nid;
  } finally {
    clearTimeout(timer);
  }
}

async function getCookie(force = false) {
  const now = Date.now();
  if (!force) {
    if (cookieMem && now - cookieMem.at < CFG.cookieTtlMs) return cookieMem.value;
    const disk = readCookieFile();
    if (disk?.value && now - Number(disk.at || 0) < CFG.cookieTtlMs) {
      cookieMem = { value: disk.value, at: Number(disk.at) };
      return cookieMem.value;
    }
  }
  const value = await fetchCookie();
  cookieMem = { value, at: Date.now() };
  STATS.cookieRefreshes += 1;
  writeCookieFile({ value, at: cookieMem.at, note: 'Google Trends の NID クッキー（.gitignore 済み）' });
  log('cookieを更新しました');
  return value;
}

// ---------------------------------------------------------------------------
// 直列キュー付き HTTP（安定化の心臓部）
// ---------------------------------------------------------------------------

let chain = Promise.resolve();
let lastSentAt = 0;

/** 全リクエストを1本の鎖に並べ、最小間隔を守って発射する。 */
function enqueue(fn) {
  const run = chain.then(async () => {
    const wait = CFG.minIntervalMs - (Date.now() - lastSentAt);
    if (wait > 0) await sleep(wait);
    lastSentAt = Date.now();
    return fn();
  });
  // 失敗しても鎖を切らない（次のリクエストが道連れにならないように）
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function rawGet(url, cookie) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), CFG.timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': UA,
        'accept-language': `${CFG.hl},en;q=0.8`,
        accept: 'application/json, text/plain, */*',
        referer: 'https://trends.google.com/trends/explore',
        cookie,
      },
      signal: ac.signal,
    });
    const text = await res.text();
    return { status: res.status, text };
  } finally {
    clearTimeout(timer);
  }
}

/** 429/5xx/断線を吸収するGET。429時は cookie を取り直してから再試行する。 */
async function get(url, label) {
  let lastErr = null;
  for (let attempt = 0; attempt <= CFG.maxRetries; attempt += 1) {
    try {
      const cookie = await getCookie(attempt > 0 && lastErr?.rateLimited === true);
      const { status, text } = await enqueue(() => rawGet(url, cookie));
      STATS.requests += 1;
      STATS.lastRequestAt = new Date().toISOString();
      if (status === 200) return text;
      if (status === 429) {
        STATS.rateLimited += 1;
        lastErr = Object.assign(new Error(`${label}: レート制限(429)`), { rateLimited: true });
      } else if (status === 403) {
        lastErr = Object.assign(new Error(`${label}: 拒否(403)`), { rateLimited: true });
      } else if (status >= 500) {
        lastErr = new Error(`${label}: Google側エラー(${status})`);
      } else {
        // 400等は再試行しても直らない（リクエスト内容の誤り）ので即座に投げる
        throw Object.assign(new Error(`${label}: HTTP ${status} / ${text.slice(0, 200)}`), { fatal: true });
      }
    } catch (e) {
      if (e?.fatal) throw e;
      if (e?.name === 'AbortError') lastErr = new Error(`${label}: タイムアウト(${CFG.timeoutMs}ms)`);
      else lastErr = e;
    }
    if (attempt < CFG.maxRetries) {
      const wait = backoffMs(attempt);
      STATS.retries += 1;
      log(`再試行 ${attempt + 1}/${CFG.maxRetries} (${lastErr?.message}) → ${wait}ms待機`);
      await sleep(wait);
    }
  }
  STATS.lastError = { at: new Date().toISOString(), message: lastErr?.message || String(lastErr) };
  throw lastErr || new Error(`${label}: 不明なエラー`);
}

// ---------------------------------------------------------------------------
// キャッシュ（stale-if-error 付き）
// ---------------------------------------------------------------------------

function cachePath(key) {
  return path.join(CACHE_DIR, `${key}.json`);
}

function readCache(key) {
  try {
    return JSON.parse(fs.readFileSync(cachePath(key), 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(key, payload) {
  try {
    ensureDirs();
    fs.writeFileSync(cachePath(key), JSON.stringify({ savedAt: Date.now(), payload }, null, 2));
  } catch (e) {
    log('キャッシュ保存に失敗（続行）:', e?.message || e);
  }
}

/**
 * キャッシュ経由で producer を実行する。
 *  - TTL内 → そのまま返す（_cache: 'hit'）
 *  - TTL外 → 取り直す。失敗したら古い値を stale として返す（_cache: 'stale'）。
 */
async function withCache(key, ttlMs, producer, { noCache = false, shouldCache = () => true } = {}) {
  const cached = readCache(key);
  const age = cached ? Date.now() - Number(cached.savedAt || 0) : Infinity;
  if (!noCache && cached && age < ttlMs) {
    STATS.cacheHits += 1;
    return { ...cached.payload, _cache: 'hit', _ageMinutes: Math.round(age / 60_000) };
  }
  try {
    const fresh = await producer();
    // 「取れなかったが例外でもない」結果（例: Google側が空配列を返すRELATED_TOPICS）は
    // キャッシュしない。復旧したときに古い空データを掴み続けないため。
    if (shouldCache(fresh)) writeCache(key, fresh);
    return { ...fresh, _cache: 'miss' };
  } catch (e) {
    if (cached) {
      STATS.staleServed += 1;
      log(`取得失敗のため古いキャッシュを返します (${Math.round(age / 60_000)}分前): ${e?.message || e}`);
      return {
        ...cached.payload,
        _cache: 'stale',
        _ageMinutes: Math.round(age / 60_000),
        _error: e?.message || String(e),
      };
    }
    throw e;
  }
}

// ---------------------------------------------------------------------------
// Trends API 本体
// ---------------------------------------------------------------------------

function commonQs() {
  return `hl=${encodeURIComponent(CFG.hl)}&tz=${CFG.tz}`;
}

/** explore を叩いてウィジェット（token付き）一式を得る。以降の全データはここが起点。 */
async function explore({ keywords, geo, timeframe, category, property }) {
  const req = {
    comparisonItem: keywords.map((keyword) => ({ keyword, geo, time: timeframe })),
    category: Number(category ?? 0),
    property: property ?? '',
  };
  const url = `https://trends.google.com/trends/api/explore?${commonQs()}&req=${encodeURIComponent(
    JSON.stringify(req),
  )}`;
  const data = parseTrendsJson(await get(url, 'explore'));
  const widgets = data?.widgets || [];
  if (!widgets.length) throw new Error('explore がウィジェットを返しませんでした（データ不足の可能性）');
  return widgets;
}

/** 複数キーワード時は id が "GEO_MAP_0" のように連番になるので前方一致で拾う。 */
function pickWidget(widgets, id, index = 0) {
  const exact = widgets.filter((w) => w.id === id);
  if (exact.length) return exact[Math.min(index, exact.length - 1)];
  const prefixed = widgets.filter((w) => String(w.id).startsWith(`${id}_`));
  if (prefixed.length) return prefixed[Math.min(index, prefixed.length - 1)];
  throw new Error(`ウィジェット ${id} が見つかりません（利用可: ${widgets.map((w) => w.id).join(', ')}）`);
}

async function widgetData(widget, endpoint, overrides = {}) {
  const request = { ...widget.request, ...overrides };
  const url = `https://trends.google.com/trends/api/widgetdata/${endpoint}?${commonQs()}&req=${encodeURIComponent(
    JSON.stringify(request),
  )}&token=${encodeURIComponent(widget.token)}`;
  return parseTrendsJson(await get(url, endpoint));
}

function baseParams(args) {
  return {
    keywords: normalizeKeywords(args.keywords ?? args.keyword),
    geo: args.geo === undefined ? CFG.geo : String(args.geo),
    timeframe: normalizeTimeframe(args.timeframe),
    category: Number(args.category ?? 0),
    property: String(args.property ?? ''),
  };
}

function ttlOf(args, fallbackMinutes) {
  return num(args.cacheTtlMinutes, fallbackMinutes) * 60_000;
}

/** 時系列（Interest over time）。0-100の相対指数。 */
export async function interestOverTime(args = {}) {
  const p = baseParams(args);
  return withCache(
    cacheKey('iot', p),
    ttlOf(args, CFG.cacheTtlMs / 60_000),
    async () => {
      const widgets = await explore(p);
      const payload = await widgetData(pickWidget(widgets, 'TIMESERIES'), 'multiline');
      const rows = shapeTimeline(payload, p.keywords);
      const averages = {};
      for (const k of p.keywords) {
        const vals = rows.filter((r) => !r.isPartial).map((r) => r.values[k]);
        averages[k] = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
      }
      return { ...p, rowCount: rows.length, averages, rows, fetchedAt: new Date().toISOString() };
    },
    { noCache: !!args.noCache },
  );
}

/** 地域別（Interest by region）。日本なら resolution=REGION で47都道府県。 */
export async function interestByRegion(args = {}) {
  const p = baseParams(args);
  const resolution = String(args.resolution || (p.geo ? 'REGION' : 'COUNTRY')).toUpperCase();
  return withCache(
    cacheKey('geo', { ...p, resolution }),
    ttlOf(args, CFG.cacheTtlMs / 60_000),
    async () => {
      const widgets = await explore(p);
      const payload = await widgetData(pickWidget(widgets, 'GEO_MAP'), 'comparedgeo', { resolution });
      const regions = (payload?.default?.geoMapData || [])
        .filter((g) => (g.hasData || []).some(Boolean))
        .map((g) => {
          const values = {};
          p.keywords.forEach((k, i) => {
            values[k] = Number(g.value?.[i] ?? 0);
          });
          return { geoCode: g.geoCode, geoName: g.geoName, values };
        });
      return { ...p, resolution, rowCount: regions.length, regions, fetchedAt: new Date().toISOString() };
    },
    { noCache: !!args.noCache },
  );
}

export function shapeRanked(payload, kind) {
  const lists = payload?.default?.rankedList || [];
  const take = (idx) =>
    (lists[idx]?.rankedKeyword || []).map((r) => ({
      ...(kind === 'topic'
        ? { topic: r.topic?.title, topicType: r.topic?.type, mid: r.topic?.mid }
        : { query: r.query }),
      value: r.value,
      // 急上昇は数値でなく "Breakout"（+5000%超）が入ることがあるのでそのまま出す
      formattedValue: r.formattedValue,
    }));
  return { top: take(0), rising: take(1) };
}

/** 関連キーワード（top / rising）。rising は新規需要の発見に使う。 */
export async function relatedQueries(args = {}) {
  const p = baseParams(args);
  return withCache(
    cacheKey('rq', p),
    ttlOf(args, CFG.cacheTtlMs / 60_000),
    async () => {
      const widgets = await explore(p);
      const results = {};
      for (let i = 0; i < p.keywords.length; i += 1) {
        const payload = await widgetData(pickWidget(widgets, 'RELATED_QUERIES', i), 'relatedsearches');
        results[p.keywords[i]] = shapeRanked(payload, 'query');
      }
      return { ...p, results, fetchedAt: new Date().toISOString() };
    },
    { noCache: !!args.noCache },
  );
}

/**
 * 関連トピック（エンティティ単位）。
 *
 * ⚠️ 2026-08-30 実測: Google 側が RELATED_TOPICS ウィジェットに対して常に
 * `{"default":{"rankedList":[]}}` を返す（素のキーワード・mid指定・英語語のいずれでも同じ）。
 * つまり現在このエンドポイントは事実上死んでいる。呼び出し側が「このキーワードには関連トピックが
 * 無いんだな」と誤読しないよう、空だったときは available:false と理由を明示して返す
 * （関連語が欲しい場合は relatedQueries を使う）。復旧したら自動的に available:true に戻る。
 */
export async function relatedTopics(args = {}) {
  const p = baseParams(args);
  return withCache(
    cacheKey('rt', p),
    ttlOf(args, CFG.cacheTtlMs / 60_000),
    async () => {
      const widgets = await explore(p);
      const results = {};
      let total = 0;
      for (let i = 0; i < p.keywords.length; i += 1) {
        const payload = await widgetData(pickWidget(widgets, 'RELATED_TOPICS', i), 'relatedsearches');
        const shaped = shapeRanked(payload, 'topic');
        total += shaped.top.length + shaped.rising.length;
        results[p.keywords[i]] = shaped;
      }
      const base = { ...p, results, fetchedAt: new Date().toISOString() };
      if (total === 0) {
        return {
          ...base,
          available: false,
          note:
            'Google が RELATED_TOPICS に空配列を返しました（2026-08-30時点でキーワード・地域を問わず再現）。' +
            'このキーワードに関連トピックが存在しないという意味ではありません。trends_related_queries を使ってください。',
        };
      }
      return { ...base, available: true };
    },
    { noCache: !!args.noCache, shouldCache: (r) => r.available !== false },
  );
}

/** 5年分から月別平均を出す（季節性の把握用）。単一キーワード専用。 */
export async function seasonality(args = {}) {
  const keyword = normalizeKeywords(args.keywords ?? args.keyword)[0];
  const timeframe = args.timeframe ? normalizeTimeframe(args.timeframe) : 'today 5-y';
  const iot = await interestOverTime({ ...args, keywords: [keyword], timeframe });
  return {
    keyword,
    geo: iot.geo,
    timeframe,
    ...summarizeSeasonality(iot.rows || [], keyword),
    sampleWeeks: (iot.rows || []).length,
    _cache: iot._cache,
    ...(iot._error ? { _error: iot._error } : {}),
  };
}

/** 急上昇（Trending now）。RSSは仕様が安定していてトークン不要なので別扱い。 */
export async function trendingNow(args = {}) {
  const geo = String(args.geo ?? CFG.geo ?? 'JP') || 'JP';
  const limit = Math.max(1, Math.min(50, num(args.limit, 20)));
  const res = await withCache(
    cacheKey('trending', { geo }),
    ttlOf(args, 20),
    async () => {
      const text = await get(`https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`, 'trending-rss');
      const items = [];
      for (const block of text.split('<item>').slice(1)) {
        const pick = (tag) => {
          const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
          if (!m) return null;
          return m[1]
            .replace(/^<!\[CDATA\[/, '')
            .replace(/\]\]>$/, '')
            .trim();
        };
        items.push({
          title: pick('title'),
          approxTraffic: pick('ht:approx_traffic'),
          pubDate: pick('pubDate'),
          newsTitle: pick('ht:news_item_title'),
          newsUrl: pick('ht:news_item_url'),
        });
      }
      return { geo, count: items.length, items, fetchedAt: new Date().toISOString() };
    },
    { noCache: !!args.noCache },
  );
  return { ...res, items: (res.items || []).slice(0, limit) };
}

/** サジェスト/トピック候補。同名異義（例「大阪」）を切り分けるのに使う。 */
export async function suggestions(args = {}) {
  const keyword = String(args.keyword ?? '').trim();
  if (!keyword) throw new Error('keyword が空です');
  return withCache(
    cacheKey('sugg', { keyword }),
    ttlOf(args, 24 * 60),
    async () => {
      const url = `https://trends.google.com/trends/api/autocomplete/${encodeURIComponent(keyword)}?${commonQs()}`;
      const payload = parseTrendsJson(await get(url, 'autocomplete'));
      const topics = (payload?.default?.topics || []).map((t) => ({ mid: t.mid, title: t.title, type: t.type }));
      return { keyword, count: topics.length, topics, fetchedAt: new Date().toISOString() };
    },
    { noCache: !!args.noCache },
  );
}

/** 疎通・設定・キャッシュの健康診断。詰まったときはまずこれを見る。 */
export async function health({ probe = true } = {}) {
  // 統計・cookie・キャッシュは「プローブを撃った後」の状態を見せる（先に集めると
  // 初回起動時に requests:0 / cookie:null と表示されて診断の役に立たない）。
  let probeResult = null;
  if (probe) {
    const t0 = Date.now();
    try {
      const r = await interestOverTime({ keywords: ['内申点'], timeframe: 'today 3-m', noCache: true });
      probeResult = { ok: true, ms: Date.now() - t0, rowCount: r.rowCount };
    } catch (e) {
      probeResult = { ok: false, ms: Date.now() - t0, error: e?.message || String(e) };
    }
  }

  let cacheFiles = 0;
  let cacheBytes = 0;
  try {
    for (const f of fs.readdirSync(CACHE_DIR)) {
      cacheFiles += 1;
      cacheBytes += fs.statSync(path.join(CACHE_DIR, f)).size;
    }
  } catch {
    /* キャッシュ未作成 */
  }
  const cookie = cookieMem || readCookieFile();
  const out = {
    ok: true,
    config: { ...CFG, dir: DIR },
    stats: { ...STATS },
    cookie: cookie
      ? {
          ageMinutes: Math.round((Date.now() - Number(cookie.at || 0)) / 60_000),
          valid: Date.now() - Number(cookie.at || 0) < CFG.cookieTtlMs,
        }
      : null,
    cache: { files: cacheFiles, kilobytes: Math.round(cacheBytes / 1024) },
  };
  if (probeResult) {
    out.probe = probeResult;
    out.ok = probeResult.ok;
  }
  return out;
}

/** キャッシュを捨てる（レスポンス形式変更でおかしくなったときの復旧手段）。 */
export function clearCache() {
  let removed = 0;
  try {
    for (const f of fs.readdirSync(CACHE_DIR)) {
      fs.unlinkSync(path.join(CACHE_DIR, f));
      removed += 1;
    }
  } catch {
    /* 何もない */
  }
  return { removed };
}
