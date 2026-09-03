import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

// T-Y11B 段階2-c: 「通らない県」（ToUnicodeマッピング欠落によりテキスト抽出が不能な県）向けの
// 半自動ハーネス。ダウンロード → pdftoppmでのページ画像レンダリング → 「要ビジョン解析」キューへ
// 積む、までを自動化する。ビジョン解析そのものは自動化しない（人・またはloopが画像を読む前提）。
//
// 対象は段階2-bで「ToUnicodeマッピング欠落のためテキストパーサ対象外」と確定した5県
// （hokkaido/tokyo/aichi/miyazaki/yamaguchi・ops/tasks/T-Y11B-bairitsu-ingest-parsers.md参照）。
// これらは既にR8データを別経路（過去セッションのビジョン解析）で保持しているため、本ハーネスの
// 主目的は「今すぐR8を読み直すこと」ではなく「次年度（R9等）の資料が公表された時に、
// 即座に画像化してキューへ積める状態を整えておくこと」。
//
// 使い方:
//   node scripts/bairitsu-ingest/queue-vision-review.mjs           # 既存キューの再検証のみ（フェッチ無し）
//   node scripts/bairitsu-ingest/queue-vision-review.mjs --fetch   # 未取得のPDFを実際にダウンロード+レンダリング
//
// ⚠️ 相手サーバへの負荷を避けるため、check-competition-rate-updates.mjsと同じ作法
//    （UA名乗る・robots.txt尊重・1件800ms以上間隔・タイムアウト15秒）を踏襲する。
// ⚠️ この環境ではTLS傍受でfetchが失敗することがある。ローカル実行時は
//    `NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/bairitsu-ingest/queue-vision-review.mjs --fetch` を使うこと。

const TARGET_PREFECTURES = ['hokkaido', 'tokyo', 'aichi', 'miyazaki', 'yamaguchi'];
const DATA_DIR = resolve('src/data/competition-rates');
const OUT_DIR = resolve('ops/state/bairitsu-vision-queue');
const QUEUE_PATH = resolve('ops/state/bairitsu-vision-queue.json');
const TIMEOUT_MS = 15000;
const REQUEST_INTERVAL_MS = 800;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 MyNaishinBot/1.0 (+https://my-naishin.com)';

function westernYearOf(fiscalYear) {
  const m = fiscalYear.match(/(\d{4})/);
  return m ? Number(m[1]) : 0;
}

/** 県ファイルの生テキストからsources[]（url/docTitle/fiscalYear/fetchedAt）を機械抽出する。
 *  check-competition-rate-updates.mjsのextractLatestOfficialUrls()と同じ正規表現（TS直import不可のため
 *  ロジックを再実装している。変更する場合は両方を同時に直すこと）。 */
async function extractSources(prefecture) {
  const content = await readFile(join(DATA_DIR, `${prefecture}.ts`), 'utf-8');
  const re = /url:\s*'([^']*)',\s*\n\s*docTitle:\s*'([^']*)',\s*\n\s*fiscalYear:\s*'([^']*)',\s*\n\s*fetchedAt:\s*'([^']*)',/g;
  const sources = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    sources.push({ url: m[1], docTitle: m[2], fiscalYear: m[3], fetchedAt: m[4] });
  }
  return { content, sources };
}

/** 最新年度のレコード件数を数える（fiscalYear明記行 + 省略時に最新年度を指すレコードの両方を数える）。
 *  省略時のレコードは`fiscalYear:`を持たない行として現れるため、schoolName行のうち
 *  「同一行に他年度のfiscalYearが明記されていない」ものを最新年度としてカウントする近似。 */
function countLatestYearRecords(content, latestFiscalYear, allFiscalYears) {
  const recordLineRe = /\{\s*schoolName:[^}]*\}/g;
  const lines = content.match(recordLineRe) ?? [];
  let count = 0;
  for (const line of lines) {
    const fyMatch = line.match(/fiscalYear:\s*'([^']*)'/);
    const fy = fyMatch ? fyMatch[1] : latestFiscalYear; // 省略時は最新年度扱い（インターフェース仕様どおり）
    if (fy === latestFiscalYear) count += 1;
  }
  return count;
}

async function loadQueue() {
  if (!existsSync(QUEUE_PATH)) return { generatedAt: null, entries: [] };
  try {
    return JSON.parse(await readFile(QUEUE_PATH, 'utf-8'));
  } catch {
    return { generatedAt: null, entries: [] };
  }
}

async function saveQueue(queue) {
  await mkdir(resolve('ops/state'), { recursive: true });
  await writeFile(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf-8');
}

const robotsCache = new Map();

async function fetchWithTimeout(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { method, redirect: 'follow', headers: { 'User-Agent': UA, Accept: '*/*' }, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** pdfinfoが無い環境向けにpdftoppmの標準エラー出力からページ数を数える簡易フォールバックは使わず、
 *  実際にレンダリングして生成されたPNGファイル数をページ数として採用する（最も確実）。 */
function renderPdfToPng(pdfPath, outDir) {
  mkdirSync(outDir, { recursive: true });
  const res = spawnSync('pdftoppm', ['-r', '150', '-png', pdfPath, join(outDir, 'page')], { encoding: 'utf8' });
  if (res.status !== 0) {
    return { ok: false, error: res.stderr || res.error?.message || 'pdftoppm failed' };
  }
  return { ok: true };
}

async function main() {
  const doFetch = process.argv.includes('--fetch');
  await mkdir(OUT_DIR, { recursive: true });
  const queue = await loadQueue();
  const byPref = new Map(queue.entries.map((e) => [e.prefecture, e]));

  for (const prefecture of TARGET_PREFECTURES) {
    const { content, sources } = await extractSources(prefecture);
    if (sources.length === 0) {
      console.log(`[skip] ${prefecture}: sources[]が抽出できなかった（正規表現の前提が崩れている可能性）`);
      continue;
    }
    const allFiscalYears = [...new Set(sources.map((s) => s.fiscalYear))];
    const latestYear = Math.max(...sources.map((s) => westernYearOf(s.fiscalYear)));
    const latest = sources.filter((s) => westernYearOf(s.fiscalYear) === latestYear);
    const primary = latest[0];
    const expectedRecordCount = countLatestYearRecords(content, primary.fiscalYear, allFiscalYears);

    const prefDir = join(OUT_DIR, prefecture);
    const pdfPath = join(prefDir, `${prefecture}-latest.pdf`);
    let pageCount = byPref.get(prefecture)?.pageCount ?? null;
    let status = byPref.get(prefecture)?.status ?? 'not_fetched';

    if (doFetch) {
      await mkdir(prefDir, { recursive: true });
      const origin = new URL(primary.url).origin;
      const rules = await fetchRobotsRules(origin);
      if (isDisallowedByRobots(primary.url, rules)) {
        status = 'robots_blocked';
        console.log(`[robots-blocked] ${prefecture}: ${primary.url}`);
      } else {
        try {
          const res = await fetchWithTimeout(primary.url, 'GET');
          if (!res.ok) {
            status = `fetch_failed_http_${res.status}`;
            console.log(`[fetch-failed] ${prefecture}: HTTP ${res.status}`);
          } else {
            const buf = Buffer.from(await res.arrayBuffer());
            await writeFile(pdfPath, buf);
            const render = renderPdfToPng(pdfPath, prefDir);
            if (render.ok) {
              const files = (await readdir(prefDir)).filter((f) => f.endsWith('.png'));
              pageCount = files.length;
              status = 'ready_for_vision_review';
              console.log(`[ok] ${prefecture}: ${pageCount}ページをレンダリング済み（${prefDir}）`);
            } else {
              status = 'render_failed';
              console.log(`[render-failed] ${prefecture}: ${render.error}`);
            }
          }
        } catch (error) {
          status = 'fetch_error';
          console.log(`[fetch-error] ${prefecture}: ${error?.message ?? error}`);
        }
      }
      await sleep(REQUEST_INTERVAL_MS);
    } else {
      console.log(`[dry-run] ${prefecture}: --fetchを付けずに実行したためダウンロード・レンダリングはスキップ`);
    }

    byPref.set(prefecture, {
      prefecture,
      fiscalYear: primary.fiscalYear,
      docTitle: primary.docTitle,
      sourceUrl: primary.url,
      expectedRecordCount,
      pageCount,
      pdfPath:
        doFetch || status === 'ready_for_vision_review'
          ? relative(process.cwd(), pdfPath).split('\\').join('/')
          : byPref.get(prefecture)?.pdfPath ?? null,
      status,
      queuedAt: new Date().toISOString(),
    });
  }

  queue.entries = TARGET_PREFECTURES.map((p) => byPref.get(p)).filter(Boolean);
  queue.generatedAt = new Date().toISOString();
  await saveQueue(queue);

  console.log('');
  console.log(`キュー件数: ${queue.entries.length}（${QUEUE_PATH}）`);
  for (const e of queue.entries) {
    console.log(`  - ${e.prefecture}: ${e.fiscalYear} / 期待レコード数=${e.expectedRecordCount} / ページ数=${e.pageCount ?? '未取得'} / ${e.status}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
