#!/usr/bin/env node
/**
 * Λ-1: 朝ブリーフィングへの収益導線生存監視。
 *
 * 前日の cta_view / lead_submit / line_friend_click / affiliate_click をGA4から取得し、
 * docs/daily-brief.md の最上段（マーカーコメント区間）へ自動挿入する。
 * いずれか0件なら赤で警告する（サイレント破損の早期検知）。
 *
 * 実行: npx tsx src/scripts/daily-brief-health.ts
 * GA4認証は scripts/lib/ga4-client.mjs と同じ .ga4/token.json を再利用する（`npm run ga4:auth`済み前提）。
 * ⚠️社内ネットワークのTLS傍受でOAuthトークン取得が失敗する場合（[[wrangler-corporate-network-workaround]]と
 * 同種の罠）は `NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx src/scripts/daily-brief-health.ts` で回避する
 * （Bashツールでは実行前に環境変数を別途exportせず、コマンド先頭に直接付与すること。npm run経由だと
 * Windows既定のcmd.exeがインライン環境変数代入を解釈できず失敗するため、npx tsxを直接呼ぶこと）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { analyticsdata } from '@googleapis/analyticsdata';
import { getAuthedClient, getPropertyId } from '../../scripts/lib/ga4-client.mjs';
import { buildHealthSection, injectHealthSection, HEALTH_EVENT_NAMES, type EventHealthCounts } from '@/lib/daily-brief-health';

function yesterdayUtc(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function fetchYesterdayCounts(date: string): Promise<EventHealthCounts> {
  const auth = getAuthedClient();
  const property = `properties/${getPropertyId()}`;
  const client = analyticsdata({ version: 'v1beta', auth });

  const { data } = await client.properties.runReport({
    property,
    requestBody: {
      dateRanges: [{ startDate: date, endDate: date }],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: { fieldName: 'eventName', inListFilter: { values: [...HEALTH_EVENT_NAMES] } },
      },
      limit: '10',
    },
  });

  const counts = { cta_view: 0, lead_submit: 0, line_friend_click: 0, affiliate_click: 0 } as EventHealthCounts;
  for (const row of data.rows ?? []) {
    const name = row.dimensionValues?.[0]?.value as keyof EventHealthCounts | undefined;
    const count = Number(row.metricValues?.[0]?.value ?? 0);
    if (name && name in counts) counts[name] = count;
  }
  return counts;
}

async function main() {
  const date = yesterdayUtc();
  const counts = await fetchYesterdayCounts(date);
  const section = buildHealthSection(counts, date);

  const filePath = path.resolve(process.cwd(), 'docs/daily-brief.md');
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '# 朝ブリーフィング（自動更新）\n';
  const updated = injectHealthSection(existing, section);
  fs.writeFileSync(filePath, updated, 'utf8');

  console.log(section);
}

main().catch((e) => {
  const msg = e?.errors?.[0]?.message || e?.message || String(e);
  console.error('daily-brief-health failed:', msg);
  process.exit(1);
});
