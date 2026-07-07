#!/usr/bin/env node
/**
 * EV表（affiliate-economics.ts）の月次「仮定→実測」上書き運用（D-6）。
 *
 * 使い方：
 *   1) `data/affiliate-actuals.template.json` を `data/affiliate-actuals.json` にコピーし、
 *      ASP管理画面（もしも/A8/AT等）の実績（クリック/発生/確定）を月次で転記する
 *      （data/affiliate-actuals.json はPII/事業非公開数値のため .gitignore 済み）。
 *   2) `npx tsx scripts/reconcile-affiliate-economics.ts --file=data/affiliate-actuals.json` を実行。
 *   3) クリック数が十分（既定30件以上）の行だけ「貼るだけで済む」TSスニペットが出力されるので、
 *      レビューの上で affiliate-economics.ts の AFFILIATE_ECONOMICS へ手で反映する
 *      （自動書き換えはしない＝外れ値の過学習と誤事業判断を防ぐガード）。
 *
 * 安全設計：Cloudflare/wrangler/envを一切呼ばない。読むのはローカルJSONのみ。
 */
import { existsSync, readFileSync } from 'node:fs';

import {
  reconcileAffiliateEconomics,
  formatEconomicsSnippet,
  type AffiliateActualRow,
} from '@/lib/affiliate-actuals-reconciliation';

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

function main() {
  const file = arg('file') ?? 'data/affiliate-actuals.json';
  const minSample = Number(arg('min-sample') ?? '30');

  if (!existsSync(file)) {
    console.error(`✗ ${file} が見つかりません。data/affiliate-actuals.template.json をコピーして実績を転記してください。`);
    process.exit(1);
  }

  let actuals: AffiliateActualRow[];
  try {
    actuals = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`✗ ${file} のJSONが不正です: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const rows = reconcileAffiliateEconomics(actuals, minSample);

  console.log(`\n📊 EV表 実測突合レポート（${file}）\n`);

  const updatable = rows.filter((r) => r.recommendation === 'update');
  const insufficient = rows.filter((r) => r.recommendation === 'insufficient-sample');
  const noData = rows.filter((r) => r.recommendation === 'no-data');

  for (const r of rows) {
    const deltaLabel = r.deltaPercent === null ? '-' : `${r.deltaPercent >= 0 ? '+' : ''}${r.deltaPercent.toFixed(0)}%`;
    const actualLabel = r.actual
      ? `実測convRateLow=${(r.actual.convRateLow * 100).toFixed(2)}% (仮定比${deltaLabel})`
      : '実測なし';
    console.log(`  ${r.affiliateId}: クリック${r.sampleClicks}件 / ${actualLabel} / ${r.recommendation}`);
  }

  if (updatable.length > 0) {
    console.log(`\n✅ 反映候補（クリック${minSample}件以上・レビュー後に手で反映）:\n`);
    console.log("export const AFFILIATE_ECONOMICS: Partial<Record<AffiliateId, AffiliateEconomics>> = {");
    for (const r of updatable) {
      const snippet = formatEconomicsSnippet(r);
      if (snippet) console.log(snippet);
    }
    console.log('  // ...既存の他プログラムはそのまま維持');
    console.log('};');
  }

  if (insufficient.length > 0) {
    console.log(`\n⚠ サンプル不足（クリック${minSample}件未満・参考値のみ・上書き不可）: ${insufficient.map((r) => r.affiliateId).join(', ')}`);
  }
  if (noData.length > 0) {
    console.log(`\n・実績データなし（クリック0件）: ${noData.map((r) => r.affiliateId).join(', ')}`);
  }
  console.log('');
}

main();
