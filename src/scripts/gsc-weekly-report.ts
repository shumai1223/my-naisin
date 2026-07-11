#!/usr/bin/env node

/**
 * GSC週次オポチュニティ監視スクリプト
 *
 * 直近7日 vs 前7日でクエリ/ページを比較し、「収益・成長の取りこぼし」を自動検出する。
 * 目的＝サイトに張り付かなくても、毎週「次に手を打つべき場所」が向こうからやってくる状態を作る。
 *
 * 検出カテゴリ:
 *  1. striking distance … 掲載順位 5〜15位 かつ 表示回数が多い ＝ あと一押しで1ページ目/クリック増
 *  2. 高imp・低CTR       … 露出はあるのにクリックされていない ＝ タイトル/スニペット改善の余地
 *  3. 順位下落           … 主要クエリの掲載順位が悪化 ＝ テコ入れ対象
 *  4. 急上昇             … クリックが伸びたクエリ ＝ 追い風に追加投資すべき領域
 *  5. 新規流入           … 前週になく今週現れた高表示クエリ ＝ 新コンテンツの芽
 *
 * 認証: サービスアカウント（GSCプロパティに「制限付き」で共有）を環境変数 GSC_SA_KEY(JSON文字列) で渡す。
 * 実行: npx tsx src/scripts/gsc-weekly-report.ts
 * 運用: GitHub Actions の cron で週1実行し、結果を Issue で受け取る（.github/workflows/gsc-weekly.yml）。
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { findUncoveredOpportunityQueries, formatMiningCandidatesMarkdown } from '../lib/query-mining';
import { findCtrUnderperformers, formatCtrUnderperformersMarkdown } from '../lib/ctr-improvement';
import { findRoutesDueForMeasurement, type CtrChangeLogEntry } from '../lib/ctr-improvement-log';
import { LAUNCH_BATCHES, evaluateLaunchBatchStatus, formatLaunchBatchMarkdown, evaluateBatchGoStopVerdict } from '../lib/new-page-launch-tracker';

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:my-naishin.com';
const SA_KEY = process.env.GSC_SA_KEY;

// GSCは集計に約2〜3日の遅延があるため、終端を3日前に置く
const LAG_DAYS = 3;
const WINDOW = 7;

interface Row {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function ymd(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function pct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}

function fmtDelta(n: number, digits = 0): string {
  const v = n.toFixed(digits);
  return n > 0 ? `+${v}` : `${v}`;
}

async function fetchQueries(
  client: ReturnType<typeof google.searchconsole>,
  startDate: string,
  endDate: string,
): Promise<Row[]> {
  const res = await client.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: ['query'], rowLimit: 1000 },
  });
  return (res.data.rows as Row[]) || [];
}

// ページ次元（面＝URL別）。勝ち面/負け面の自動検出に使う。
async function fetchPages(
  client: ReturnType<typeof google.searchconsole>,
  startDate: string,
  endDate: string,
): Promise<Row[]> {
  const res = await client.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 1000 },
  });
  return (res.data.rows as Row[]) || [];
}

// 表示用にURLをパスへ短縮（origin を除去）。
function shortPath(url: string): string {
  return url.replace(/^https?:\/\/[^/]+/, '') || '/';
}

// 全体集計（dimensions無し＝匿名化クエリも含む正確な総数）。サマリのWoWに使う。
async function fetchTotals(
  client: ReturnType<typeof google.searchconsole>,
  startDate: string,
  endDate: string,
): Promise<{ clicks: number; impressions: number }> {
  const res = await client.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, rowLimit: 1 },
  });
  const row = (res.data.rows as Array<{ clicks?: number; impressions?: number }> | undefined)?.[0];
  return { clicks: row?.clicks ?? 0, impressions: row?.impressions ?? 0 };
}

async function main() {
  if (!SA_KEY) {
    console.error(
      '❌ GSC_SA_KEY が未設定です。\n' +
        '  1) Google Cloudでサービスアカウントを作成しJSONキーを発行\n' +
        '  2) Search Consoleの設定→ユーザーと権限 で、そのサービスアカウントのメールを「制限付き」で追加\n' +
        '  3) JSONの中身をまるごと GitHub Secrets の GSC_SA_KEY に登録（ローカル実行時は環境変数で）',
    );
    process.exit(1);
  }

  const creds = JSON.parse(SA_KEY);
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  const client = google.searchconsole({ version: 'v1', auth });

  const recentStart = ymd(LAG_DAYS + WINDOW - 1);
  const recentEnd = ymd(LAG_DAYS);
  const prevStart = ymd(LAG_DAYS + WINDOW * 2 - 1);
  const prevEnd = ymd(LAG_DAYS + WINDOW);

  console.log(`🔍 GSC週次レポート: ${SITE_URL}`);
  console.log(`   今週: ${recentStart} 〜 ${recentEnd}`);
  console.log(`   前週: ${prevStart} 〜 ${prevEnd}`);

  const [recent, prev, recentTot, prevTot, recentPages, prevPages] = await Promise.all([
    fetchQueries(client, recentStart, recentEnd),
    fetchQueries(client, prevStart, prevEnd),
    fetchTotals(client, recentStart, recentEnd),
    fetchTotals(client, prevStart, prevEnd),
    fetchPages(client, recentStart, recentEnd),
    fetchPages(client, prevStart, prevEnd),
  ]);

  const prevByQuery = new Map<string, Row>();
  for (const r of prev) prevByQuery.set(r.keys[0], r);

  const prevPageByUrl = new Map<string, Row>();
  for (const r of prevPages) prevPageByUrl.set(r.keys[0], r);

  // 勝ち面：クリック上位の面（評価を集約すべき稼ぎ頭）
  const winnerPages = recentPages
    .slice()
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 12);

  // 負け面：露出は十分なのにクリックされない面（タイトル/内部リンク/CTAのテコ入れ対象）
  const loserPages = recentPages
    .filter((r) => r.impressions >= 150 && r.ctr < 0.01)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 12);

  // サマリは全体集計を使う（per-queryの合計は匿名化クエリ分が欠落し過少になるため）
  const recentClicks = recentTot.clicks;
  const recentImp = recentTot.impressions;
  const prevClicks = prevTot.clicks;
  const prevImp = prevTot.impressions;
  const wow = (now: number, before: number) => (before === 0 ? 0 : (now - before) / before);

  // 1. striking distance（5〜15位 × 表示多）
  const striking = recent
    .filter((r) => r.position >= 5 && r.position <= 15 && r.impressions >= 50)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  // 2. 高imp・低CTR（露出あるのにクリックされていない）
  const lowCtr = recent
    .filter((r) => r.impressions >= 100 && r.ctr < 0.02 && r.position <= 15)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);

  // 3. 順位下落（前週10位以内 → 2以上悪化）
  const dropped = recent
    .map((r) => {
      const p = prevByQuery.get(r.keys[0]);
      return p ? { r, deltaPos: r.position - p.position, prevPos: p.position } : null;
    })
    .filter((x): x is { r: Row; deltaPos: number; prevPos: number } => !!x && x.prevPos <= 10 && x.deltaPos >= 2)
    .sort((a, b) => b.deltaPos - a.deltaPos)
    .slice(0, 10);

  // 4. 急上昇（クリック増）
  const rising = recent
    .map((r) => {
      const p = prevByQuery.get(r.keys[0]);
      return { r, deltaClicks: r.clicks - (p?.clicks ?? 0) };
    })
    .filter((x) => x.deltaClicks >= 5)
    .sort((a, b) => b.deltaClicks - a.deltaClicks)
    .slice(0, 10);

  // 5. 新規流入（前週になく今週出現した高表示クエリ）
  const newcomers = recent
    .filter((r) => !prevByQuery.has(r.keys[0]) && r.impressions >= 50)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  // 6. 新面候補（TIER L-1）：表示回数はあるのに専用ページが無いクエリ
  const uncoveredCandidates = findUncoveredOpportunityQueries(recent);

  // 7. CTR自動改善ループ（TIER L-3）：掲載順位から見て明らかにCTRが低い面（流入上位5面は除外済み）
  const ctrUnderperformers = findCtrUnderperformers(recentPages);

  // 変更履歴ログ（TIER L-3）：3週間経過し未測定の変更があれば「効果測定して」と促す
  const changeLogPath = path.join(__dirname, '..', '..', 'data', 'ctr-improvement-log.json');
  let ctrChangeLog: CtrChangeLogEntry[] = [];
  try {
    ctrChangeLog = JSON.parse(fs.readFileSync(changeLogPath, 'utf8'));
  } catch {
    ctrChangeLog = [];
  }
  const dueForMeasurement = findRoutesDueForMeasurement(ctrChangeLog, new Date());

  // 新面インデックス監視（TIER I-7）：直近バッチの離陸/未発見状況＋GO/STOP判定（O-6）
  const launchBatchStatuses = LAUNCH_BATCHES.map((batch) => {
    const statuses = evaluateLaunchBatchStatus(batch.routes, recentPages);
    return { label: batch.label, statuses, verdict: evaluateBatchGoStopVerdict(batch, statuses) };
  });

  // --- Markdownレポート組み立て ---
  const L: string[] = [];
  L.push(`# 📊 GSC週次レポート（${recentEnd} 時点）`);
  L.push('');
  L.push(`対象: \`${SITE_URL}\` ／ 今週 ${recentStart}〜${recentEnd} vs 前週 ${prevStart}〜${prevEnd}`);
  L.push('');
  L.push('## サマリ（WoW）');
  L.push('| 指標 | 今週 | 前週 | 増減 |');
  L.push('|---|--:|--:|--:|');
  L.push(`| クリック | ${recentClicks} | ${prevClicks} | ${fmtDelta(recentClicks - prevClicks)} (${pct(wow(recentClicks, prevClicks))}) |`);
  L.push(`| 表示回数 | ${recentImp} | ${prevImp} | ${fmtDelta(recentImp - prevImp)} (${pct(wow(recentImp, prevImp))}) |`);
  L.push(`| CTR | ${pct(recentImp ? recentClicks / recentImp : 0)} | ${pct(prevImp ? prevClicks / prevImp : 0)} | - |`);
  L.push('');

  const table = (rows: string[][], head: string[]) => {
    L.push('| ' + head.join(' | ') + ' |');
    L.push('|' + head.map(() => '---').join('|') + '|');
    for (const r of rows) L.push('| ' + r.join(' | ') + ' |');
    L.push('');
  };

  L.push('## 🎯 striking distance（あと一押し：5〜15位×表示多）');
  L.push('> 順位を少し上げる/CTRを上げると最もクリックが増える候補。内部リンク強化・見出し最適化の最優先ターゲット。');
  L.push('');
  if (striking.length)
    table(
      striking.map((r) => [r.keys[0], String(r.impressions), pct(r.ctr), r.position.toFixed(1)]),
      ['クエリ', '表示', 'CTR', '順位'],
    );
  else L.push('_該当なし_\n');

  L.push('## ✍️ 高imp・低CTR（タイトル/スニペット改善余地）');
  L.push('> 露出は十分なのにクリックされていない。タイトル・description・FAQの見直しでクリックを拾える。');
  L.push('');
  if (lowCtr.length)
    table(
      lowCtr.map((r) => [r.keys[0], String(r.impressions), pct(r.ctr), r.position.toFixed(1)]),
      ['クエリ', '表示', 'CTR', '順位'],
    );
  else L.push('_該当なし_\n');

  L.push('## 📉 順位下落（前週10位以内→悪化）');
  L.push('');
  if (dropped.length)
    table(
      dropped.map((x) => [x.r.keys[0], x.prevPos.toFixed(1), x.r.position.toFixed(1), fmtDelta(x.deltaPos, 1)]),
      ['クエリ', '前週順位', '今週順位', '悪化'],
    );
  else L.push('_該当なし（安定）_\n');

  L.push('## 🚀 急上昇（クリック増）');
  L.push('> 追い風が吹いている領域。関連コンテンツ追加・内部リンクで伸びを加速できる。');
  L.push('');
  if (rising.length)
    table(
      rising.map((x) => [x.r.keys[0], String(x.r.clicks), fmtDelta(x.deltaClicks), x.r.position.toFixed(1)]),
      ['クエリ', '今週click', '増減', '順位'],
    );
  else L.push('_該当なし_\n');

  L.push('## 🌱 新規流入クエリ（前週になし）');
  L.push('');
  if (newcomers.length)
    table(
      newcomers.map((r) => [r.keys[0], String(r.impressions), String(r.clicks), r.position.toFixed(1)]),
      ['クエリ', '表示', 'click', '順位'],
    );
  else L.push('_該当なし_\n');

  L.push('## 🆕 新面候補（表示回数はあるが専用ページが無いクエリ）');
  L.push('> imp>=50 かつ 順位>8位（1ページ目未満）かつ 既存トピック外＝面の空白地帯。ここに出ても即面化はせず、決定論的に答えられるもの（自社エンジン・検証済みデータで正しい値を返せるもの）だけを選んで着手する（TIER L-1）。');
  L.push('');
  L.push(formatMiningCandidatesMarkdown(uncoveredCandidates));

  L.push('## 🏆 勝ち面（クリック上位ページ＝評価を集約すべき稼ぎ頭）');
  L.push('> 内部リンクのハブにして評価を流す／換金CTAの最適配置を優先する面。');
  L.push('');
  if (winnerPages.length)
    table(
      winnerPages.map((r) => {
        const p = prevPageByUrl.get(r.keys[0]);
        return [shortPath(r.keys[0]), String(r.clicks), pct(r.ctr), fmtDelta(r.clicks - (p?.clicks ?? 0))];
      }),
      ['ページ', '今週click', 'CTR', 'WoW'],
    );
  else L.push('_該当なし_\n');

  L.push('## 🩹 負け面（高imp・低CTRページ＝タイトル/内部リンク/CTAのテコ入れ対象）');
  L.push('> 露出はあるのにクリックされていない面。タイトル・description・内部リンク・CTA位置を見直す。');
  L.push('');
  if (loserPages.length)
    table(
      loserPages.map((r) => [shortPath(r.keys[0]), String(r.impressions), pct(r.ctr), r.position.toFixed(1)]),
      ['ページ', '表示', 'CTR', '順位'],
    );
  else L.push('_該当なし_\n');

  L.push('## 🛬 新面インデックス監視（TIER I-7）＋バッチGO/STOP判定（TIER O-6）');
  L.push('> 直近に新設したバッチが発見（GSCに表示回数が計測）されているかの一覧。未発見が多い場合はsitemap再送信・内部リンク経路を再確認する。GO/STOPは離陸率と経過日数（14日未満は判定保留）から機械判定。');
  L.push('');
  const VERDICT_ICON: Record<string, string> = { go: '🟢 GO', wait: '⏳ 保留', 'stop-investigate': '🔴 STOP・要調査' };
  for (const { label, statuses, verdict } of launchBatchStatuses) {
    const batch = LAUNCH_BATCHES.find((b) => b.label === label)!;
    L.push(formatLaunchBatchMarkdown(batch, statuses));
    L.push(`**判定: ${VERDICT_ICON[verdict.verdict] ?? verdict.verdict}** — ${verdict.detail}`);
    L.push('');
  }

  L.push('## 🔁 CTR自動改善ループ（掲載順位から見て明らかにCTRが低い面・TIER L-3）');
  L.push('> 順位帯別の期待CTR目安を大きく下回る面（流入上位5面は除外済み）。ガード: 同一面の変更は3週間隔・変更はdata/ctr-improvement-log.jsonに記録して3週後に効果測定する。');
  L.push('');
  L.push(formatCtrUnderperformersMarkdown(ctrUnderperformers));
  if (dueForMeasurement.length) {
    L.push('**⏰ 3週間経過し効果測定が必要な変更:**');
    for (const e of dueForMeasurement) L.push(`- ${e.route}（変更日: ${e.changedAt}）`);
    L.push('');
  }

  L.push('---');
  L.push('_このレポートは GitHub Actions により自動生成されています（src/scripts/gsc-weekly-report.ts）。_');

  const md = L.join('\n');
  fs.writeFileSync('gsc-weekly-report.md', md);
  fs.writeFileSync(
    'gsc-weekly-report.json',
    JSON.stringify(
      { generatedAt: new Date().toISOString(), recentEnd, striking, lowCtr, dropped, rising, newcomers, uncoveredCandidates, winnerPages, loserPages, ctrUnderperformers, dueForMeasurement, launchBatchStatuses },
      null,
      2,
    ),
  );

  console.log('\n' + md + '\n');
  console.log('📄 gsc-weekly-report.md / .json を出力しました');

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `report_date=${recentEnd}\n`);
  }
}

main().catch((e) => {
  console.error('❌ レポート生成に失敗:', e?.message || e);
  process.exit(1);
});
