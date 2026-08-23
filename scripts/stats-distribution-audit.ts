#!/usr/bin/env node
/**
 * 統計分布監査（ZZ-1e）＝匿名統計（stats_submissions）のスパム流入・異常分布を
 * 週次でチェックするバッチ。backup-d1.ts と同じ設計方針を踏襲する：
 *
 *  - 実際の異常検知ロジック（バースト・極値集中）は src/lib/stats-audit.ts の純粋関数
 *    （unit test済み）。ここはデータ取得・出力整形のみを担当する。
 *  - 検知結果は「報告のみ」。自動でのquarantine/削除は行わない（対応が必要な場合は👤が手動で判断する）。
 *
 * データ取得（DW-8・DEADWIRE 2026-08-10監査→2026-08-23対応）:
 *  - 既定は scripts/d1q.mjs（読み取り専用・書き込みSQLは拒否）経由で本番D1を直接読む
 *    （check-click-fraud-burst.mjsと同型のパターン）。
 *  - `--file=` を渡した場合のみ、本人がwranglerで事前エクスポートしたローカルJSON
 *    （[{results:[...]}] 形式）を使う（オフライン確認・過去スナップショットの再検証用）。
 *
 * ⚠️ `trusted = 1` の行のみを対象にする（2026-08-23判明・DW-1/DW-2以降の設計）:
 *   migration 0019 で `trusted`/`trust_class` 列が追加され、`stats-db.ts` の集計クエリは
 *   既に `trusted = 1` の行だけを公開集計の対象にしている（trusted=0はリアルタイム自動検知
 *   のburst・過去に手動で隔離した既知事件を含む・テストで固定された不変条件）。この監査の
 *   実行で最初に本番実行したところ、2026-08-12の既知バースト198件（`trust_class=
 *   'excluded-dw2-burst'`・当時Opus 5セッションが手動で隔離し既にworklog記録済み）を
 *   「新規異常」として再検知してしまった。これは公開集計に一切影響しない解決済みデータで、
 *   このまま放置すると監査が同じ古い警告を無限に出し続け「オオカミ少年」化する
 *   （[[ga4-undercounts-conversions]]と同型の教訓）。`trusted = 1` に絞ることで、
 *   この監査は「公開集計に実際に入っている行の中に、まだ誰も気づいていない異常が
 *   無いか」だけを見る設計に揃えた。
 *
 * 実行:
 *   npx tsx scripts/stats-distribution-audit.ts                              （既定・本番D1を直接読む）
 *   npx tsx scripts/stats-distribution-audit.ts --file=reports/stats-export-2026-07-24.json
 *
 * 異常検知時（report.hasFlags）は exit 1、異常なしは exit 0（他のcheck:*スクリプトと同じ規約）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { STATS_METRICS } from '@/lib/stats-aggregation';
import { runDistributionAudit, formatDistributionAuditReport, type StatsSubmissionRecord } from '@/lib/stats-audit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, '..', 'reports');
const SELECT_SQL = 'SELECT metric, prefecture_code, value, max_value, created_at FROM stats_submissions WHERE trusted = 1';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

/** 生の行配列（型が緩いJSON）を StatsSubmissionRecord[] へ絞り込みつつ整形する。 */
function recordsFromRows(rows: unknown[]): StatsSubmissionRecord[] {
  return rows
    .filter((r): r is Record<string, unknown> => typeof r === 'object' && r !== null)
    .filter((r) => typeof r.metric === 'string' && typeof r.value === 'number' && typeof r.created_at === 'string')
    .map((r) => ({
      metric: r.metric as StatsSubmissionRecord['metric'],
      prefecture_code: typeof r.prefecture_code === 'string' ? r.prefecture_code : null,
      value: r.value as number,
      max_value: typeof r.max_value === 'number' ? r.max_value : null,
      created_at: r.created_at as string,
    }));
}

/** D1のJSONエクスポート形式（wrangler --json の出力）から生レコード配列を取り出す（--fileパス用）。 */
function extractRecordsFromExport(raw: unknown): StatsSubmissionRecord[] {
  // wrangler --json は [{ results: [...] }] または { results: [...] } のいずれかで返ることがある。
  const container = Array.isArray(raw) ? raw[0] : raw;
  const rows = (container as { results?: unknown[] })?.results;
  return Array.isArray(rows) ? recordsFromRows(rows) : [];
}

/** scripts/d1q.mjs 経由で本番D1を読み取り専用で直接取得する（失敗時はnull）。 */
function fetchRecordsFromD1(): StatsSubmissionRecord[] | null {
  const res = spawnSync(process.execPath, ['scripts/d1q.mjs', SELECT_SQL], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' },
  });
  if (res.status !== 0) return null;
  try {
    const rows = JSON.parse(res.stdout);
    return Array.isArray(rows) ? recordsFromRows(rows) : null;
  } catch {
    return null;
  }
}

function main() {
  const file = arg('file');
  let records: StatsSubmissionRecord[];

  if (file) {
    if (!fs.existsSync(file)) {
      console.error(`ファイルが見つかりません: ${file}`);
      process.exit(2);
    }
    records = extractRecordsFromExport(JSON.parse(fs.readFileSync(file, 'utf8')));
  } else {
    const fetched = fetchRecordsFromD1();
    if (fetched === null) {
      console.log('■ 統計分布監査（ZZ-1e）');
      console.log('  scripts/d1q.mjs 経由の本番D1読み取りに失敗しました（wrangler認証切れ・ネットワーク等）。');
      console.log('  本人のローカル環境（PowerShell・wr関数経由）で事前エクスポートし --file= で渡してください:');
      console.log('');
      console.log('    wr d1 execute my-naishin-leads --remote --json \\');
      console.log(`      --command "${SELECT_SQL}" \\`);
      console.log(`      | Out-File -Encoding utf8 reports/stats-export-$(Get-Date -Format 'yyyy-MM-dd').json`);
      console.log('');
      console.log('  その後: npx tsx scripts/stats-distribution-audit.ts --file=reports/stats-export-YYYY-MM-DD.json');
      process.exit(2);
    }
    records = fetched;
  }

  const report = runDistributionAudit(records, STATS_METRICS);
  const text = formatDistributionAuditReport(report);

  console.log(text);

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const outFile = path.join(REPORTS_DIR, `stats-distribution-audit-${report.generatedAt.slice(0, 10)}.txt`);
  fs.writeFileSync(outFile, text, 'utf8');
  console.log(`\n[saved] ${outFile}`);

  process.exit(report.hasFlags ? 1 : 0);
}

main();
