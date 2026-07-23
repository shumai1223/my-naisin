#!/usr/bin/env node
/**
 * 統計分布監査（ZZ-1e）＝匿名統計（stats_submissions）のスパム流入・異常分布を
 * 週次でチェックするバッチ。backup-d1.ts と同じ設計方針を踏襲する：
 *
 *  - このスクリプトはCloudflare/wranglerを一切呼ばない（envもsecretも不要）。
 *  - 読むのは本人がwranglerでエクスポートしたローカルJSONのみ：
 *
 *      wr d1 execute my-naishin-leads --remote --json \
 *        --command "SELECT metric, prefecture_code, value, max_value, created_at FROM stats_submissions" \
 *        | Out-File -Encoding utf8 reports/stats-export-2026-07-24.json
 *
 *  - 実際の異常検知ロジック（バースト・極値集中）は src/lib/stats-audit.ts の純粋関数
 *    （unit test済み）。ここはファイルI/O・出力整形のみを担当する。
 *  - 検知結果は「報告のみ」。自動でのquarantine/削除は行わない
 *    （docs/zz-specs/zz1-quality-engine-spec.md §3の「本物の制度変更・季節要因の
 *    可能性があるため自動処理しない」原則。現行スキーマはquarantineフラグ自体を
 *    持たないため、対応が必要な場合は👤が手動で判断する）。
 *
 * 実行:
 *   npx tsx scripts/stats-distribution-audit.ts --file=reports/stats-export-2026-07-24.json
 *
 * ファイル未指定・未存在の場合はエラー終了せず、エクスポート手順を案内して終了する
 * （wranglerはローカル環境の本人認証が要るため、loop環境からは実行できない既知の制約）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { STATS_METRICS } from '@/lib/stats-aggregation';
import { runDistributionAudit, formatDistributionAuditReport, type StatsSubmissionRecord } from '@/lib/stats-audit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, '..', 'reports');

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

/** D1のJSONエクスポート形式（wrangler --json の出力）から生レコード配列を取り出す。 */
function extractRecords(raw: unknown): StatsSubmissionRecord[] {
  // wrangler --json は [{ results: [...] }] または { results: [...] } のいずれかで返ることがある。
  const container = Array.isArray(raw) ? raw[0] : raw;
  const rows = (container as { results?: unknown[] })?.results;
  if (!Array.isArray(rows)) return [];
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

function main() {
  const file = arg('file');
  if (!file || !fs.existsSync(file)) {
    console.log('■ 統計分布監査（ZZ-1e）');
    console.log('  stats_submissions のD1エクスポートJSONが見つかりません。');
    console.log('  wranglerはローカル環境の本人認証が要るため、loop環境からは直接実行できません。');
    console.log('  本人のローカル環境（PowerShell・wr関数経由）で以下を実行してエクスポートしてください:');
    console.log('');
    console.log('    wr d1 execute my-naishin-leads --remote --json \\');
    console.log('      --command "SELECT metric, prefecture_code, value, max_value, created_at FROM stats_submissions" \\');
    console.log(`      | Out-File -Encoding utf8 reports/stats-export-$(Get-Date -Format 'yyyy-MM-dd').json`);
    console.log('');
    console.log('  その後: npx tsx scripts/stats-distribution-audit.ts --file=reports/stats-export-YYYY-MM-DD.json');
    return;
  }

  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const records = extractRecords(raw);
  const report = runDistributionAudit(records, STATS_METRICS);
  const text = formatDistributionAuditReport(report);

  console.log(text);

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const outFile = path.join(REPORTS_DIR, `stats-distribution-audit-${report.generatedAt.slice(0, 10)}.txt`);
  fs.writeFileSync(outFile, text, 'utf8');
  console.log(`\n[saved] ${outFile}`);
}

main();
