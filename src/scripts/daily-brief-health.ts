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
import { execFileSync } from 'node:child_process';
import { analyticsdata } from '@googleapis/analyticsdata';
import { getAuthedClient, getPropertyId } from '../../scripts/lib/ga4-client.mjs';
import {
  buildHealthSection,
  injectHealthSection,
  HEALTH_EVENT_NAMES,
  type EventHealthCounts,
  type TruthCounts,
} from '@/lib/daily-brief-health';

/**
 * D1（本番・読み取り専用）から確定値を取る。
 *
 * GA4はイベントを取りこぼすため、判定の主語はこちらに置く（2026-07-31の設計変更）。
 * 会社ネットワークではTLS傍受でfetchが落ちるため NODE_TLS_REJECT_UNAUTHORIZED=0 を渡し、
 * npxが使えない環境向けに wrangler.js を直接叩く（[[wrangler-corporate-network-workaround]]）。
 * 取得に失敗しても監視全体は落とさず null を返す（判定は🟡保留に丸める）。
 */
function fetchTruthCounts(): TruthCounts | null {
  const sql = [
    "SELECT (SELECT COUNT(*) FROM stats_submissions WHERE created_at >= datetime('now','-7 days')) AS s7,",
    "(SELECT COUNT(*) FROM stats_submissions) AS stotal,",
    "(SELECT COUNT(*) FROM leads WHERE created_at >= datetime('now','-7 days')) AS l7",
  ].join(' ');
  try {
    const out = execFileSync(
      process.execPath,
      [
        path.resolve(process.cwd(), 'node_modules/wrangler/bin/wrangler.js'),
        'd1', 'execute', 'my-naishin-leads', '--remote', '--json', '--command', sql,
      ],
      {
        encoding: 'utf8',
        env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' },
        stdio: ['ignore', 'pipe', 'ignore'],
        timeout: 60_000,
      }
    );
    const jsonStart = out.indexOf('[');
    if (jsonStart === -1) return null;
    const parsed = JSON.parse(out.slice(jsonStart));
    const row = parsed?.[0]?.results?.[0];
    if (!row) return null;
    return {
      statsSubmissions7d: Number(row.s7 ?? 0),
      statsSubmissionsTotal: Number(row.stotal ?? 0),
      leads7d: Number(row.l7 ?? 0),
    };
  } catch {
    // 認証切れ・ネットワーク不調等。監視自体は続行し、判定は保留（🟡）にする。
    return null;
  }
}

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
  const ga4 = await fetchYesterdayCounts(date);
  const truth = fetchTruthCounts();
  const section = buildHealthSection({ ga4, truth }, date);

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
