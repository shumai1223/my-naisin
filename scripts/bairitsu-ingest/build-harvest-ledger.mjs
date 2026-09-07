import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

// T-Y11F DoD: 「検知時刻→取得sha256→検算→遅延h」の行を持つ台帳。
//
// F-2/F-3で既に収集済みの実データ（ops/state/hub-events.json・ops/state/r9-quota/<pref>.json）
// を突き合わせて構築する（新規のネットワークアクセスは行わない・derivedな集計のみ）。
//
// 「検知時刻」はハブ監視（watch-hubs.mjs）が新規リンクとして拾えた県は`hub-events.json`の
// `detectedAt`を使う。ハブ監視経由でなく直接調査（WebSearch等）で見つけた県は、検知と取得が
// 同時点とみなし`fetchedAt`をそのまま使う（正直に区別する・捏造しない）。
// 「遅延h」は取得時刻(fetchedAt)と一次資料のLast-Modifiedヘッダとの差（時間）＝
// 「公表から何時間後に収穫できたか」。
//
// 実行: `node scripts/bairitsu-ingest/build-harvest-ledger.mjs`

const HUB_EVENTS_PATH = resolve('ops/state/hub-events.json');
const R9_QUOTA_DIR = resolve('ops/state/r9-quota');
const LEDGER_PATH = resolve('ops/state/harvest-ledger.json');

async function loadJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf-8'));
  } catch {
    return fallback;
  }
}

function parseStatusToValidation(parseStatus) {
  if (parseStatus === 'parsed') return 'diffed-against-confirmed';
  if (parseStatus === 'metadata-only') return 'metadata-only-unvalidated';
  return 'unknown';
}

async function main() {
  const hubEvents = await loadJson(HUB_EVENTS_PATH, { events: [] });
  const files = (await readdir(R9_QUOTA_DIR)).filter((f) => f.endsWith('.json'));

  const detectedAtByPrefecture = new Map();
  for (const event of hubEvents.events) {
    const existing = detectedAtByPrefecture.get(event.prefecture);
    if (!existing || event.detectedAt < existing) {
      detectedAtByPrefecture.set(event.prefecture, event.detectedAt);
    }
  }

  const rows = [];
  for (const file of files) {
    const record = await loadJson(resolve(R9_QUOTA_DIR, file), null);
    if (!record) continue;

    const detectedAt = detectedAtByPrefecture.get(record.prefecture) ?? record.fetchedAt;
    const detectionSource = detectedAtByPrefecture.has(record.prefecture) ? 'hub-watch' : 'manual-investigation';

    const lastModifiedMs = record.lastModified ? new Date(record.lastModified).getTime() : null;
    const fetchedAtMs = new Date(record.fetchedAt).getTime();
    const latencyHours =
      lastModifiedMs !== null && !Number.isNaN(lastModifiedMs) ? Math.round(((fetchedAtMs - lastModifiedMs) / (1000 * 60 * 60)) * 10) / 10 : null;

    rows.push({
      prefecture: record.prefecture,
      detectedAt,
      detectionSource,
      sourceUrl: record.sourceUrl,
      fetchedAt: record.fetchedAt,
      sha256: record.sha256,
      validation: parseStatusToValidation(record.parseStatus),
      diffSummary: record.diff ? `${record.diff.diffCount}件差分（r9=${record.diff.r9SchoolCount}校・r8=${record.diff.r8SchoolCount}校）` : null,
      lastModified: record.lastModified,
      latencyHours,
    });
  }

  rows.sort((a, b) => a.prefecture.localeCompare(b.prefecture));

  const ledger = {
    generatedAt: new Date().toISOString(),
    generatedBy: 'scripts/bairitsu-ingest/build-harvest-ledger.mjs (T-Y11F DoD)',
    note: '検知時刻→取得sha256→検算→遅延hの行。ops/state/hub-events.json・ops/state/r9-quota/<pref>.jsonから導出（新規ネットワークアクセスなし）。',
    rows,
  };

  await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n', 'utf-8');
  console.log(`harvest-ledger.json: ${rows.length}行`);
  for (const r of rows) {
    console.log(`  ${r.prefecture}: detectionSource=${r.detectionSource} validation=${r.validation} latencyHours=${r.latencyHours}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
