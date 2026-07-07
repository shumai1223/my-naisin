#!/usr/bin/env node
/**
 * ASP確定⇔GA4⇔D1 三面照合・月次レポート（I-4）。
 *
 * D1（一次データ）は generate-sales-report.ts と同じ手順でエクスポートしたJSONを使う：
 *   wrangler d1 execute my-naishin-leads --remote --json \
 *     --command "SELECT affiliate_id, COUNT(*) AS clicks FROM clicks
 *                WHERE created_at >= datetime('now','-30 days')
 *                GROUP BY affiliate_id" > d1-clicks.json
 *
 * GA4・ASP確定は本人がGA4/各ASP管理画面から手で読み取って渡す（両者ともOAuth/外部画面が
 * 一次情報でAPI化されていないため。GA4は[[ga4-mcp-integration]]同様MCP/手動、ASPは常に手動）：
 *
 *   npx tsx scripts/reconcile-clicks.ts --d1=d1-clicks.json \
 *     --ga4=zkai-text-request:12,sora-juku-text:5 \
 *     --asp=zkai-text-request:2,sora-juku-text:1
 *
 * 安全：Cloudflare/wranglerを一切呼ばない（envもsecretも不要）。読むのはローカルJSON＋CLI引数のみ。
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import { summarizeReconciliation, type ReconciliationRow } from '@/lib/click-reconciliation';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

/** "id1:n1,id2:n2" を Map<string, number> にパースする。不正行は無視。 */
function parseCounts(raw: string | undefined): Map<string, number> {
  const map = new Map<string, number>();
  if (!raw) return map;
  for (const part of raw.split(',')) {
    const [id, nStr] = part.split(':');
    const n = Number(nStr);
    if (!id || !Number.isFinite(n)) continue;
    map.set(id.trim(), n);
  }
  return map;
}

interface D1ClickRow {
  affiliate_id: string;
  clicks: number;
}

function loadD1Clicks(path: string): Map<string, number> {
  const raw = JSON.parse(readFileSync(path, 'utf8'));
  const rows: D1ClickRow[] = Array.isArray(raw) ? raw[0]?.results ?? [] : raw?.results ?? [];
  const map = new Map<string, number>();
  for (const r of rows) {
    if (r && typeof r.affiliate_id === 'string') map.set(r.affiliate_id, Number(r.clicks) || 0);
  }
  return map;
}

function main() {
  const d1Path = arg('d1');
  if (!d1Path) {
    console.error('✗ --d1=<エクスポート済みJSON> を指定してください（docstring参照）。');
    process.exit(1);
  }

  const d1Map = loadD1Clicks(d1Path);
  const ga4Map = parseCounts(arg('ga4'));
  const aspMap = parseCounts(arg('asp'));

  const affiliateIds = new Set<string>([...d1Map.keys(), ...ga4Map.keys(), ...aspMap.keys()]);
  const rows: ReconciliationRow[] = [...affiliateIds].map((affiliateId) => ({
    affiliateId,
    d1Clicks: d1Map.get(affiliateId) ?? 0,
    ga4Clicks: ga4Map.get(affiliateId) ?? 0,
    aspConfirmed: aspMap.get(affiliateId) ?? 0,
  }));

  const summary = summarizeReconciliation(rows);

  console.log('■ ASP確定⇔GA4⇔D1 三面照合');
  console.log(`  合計: D1=${summary.totalD1} / GA4=${summary.totalGa4} / ASP確定=${summary.totalAspConfirmed}`);
  console.log(
    `  GA4捕捉率(送客版): ${summary.ga4CaptureRatePercent !== null ? `${summary.ga4CaptureRatePercent.toFixed(1)}%` : '—（D1が0件）'}`
  );
  console.log('');
  for (const r of summary.rows) {
    console.log(`  ${r.affiliateId}: D1=${r.d1Clicks} / GA4=${r.ga4Clicks} / ASP確定=${r.aspConfirmed}`);
  }
  if (summary.flags.length > 0) {
    console.log('\n⚠ 不整合フラグ:');
    for (const f of summary.flags) {
      console.log(`  [${f.severity}] ${f.affiliateId}: ${f.issue}`);
    }
  } else {
    console.log('\n✓ 不整合なし。');
  }

  const outPath = arg('out') ?? `reports/reconcile-clicks-${new Date().toISOString().slice(0, 10)}.json`;
  const outDir = dirname(outPath);
  if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`\n[saved] ${outPath}`);
}

main();
