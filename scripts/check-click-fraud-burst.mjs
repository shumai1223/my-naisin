#!/usr/bin/env node
/**
 * check-click-fraud-burst.mjs — clicks テーブル(内部referer付き=人間クリックの唯一の正しい数え方)に
 * ops/THREATS.md 脅威13(TH-13・2026-08-20発見)と同型のクリック不正の疑いが無いか機械検知する。
 *
 * 判定ロジックは scripts/lib/click-fraud-detector.mjs（daily-brief-healthと共有）を使う。
 *
 * 使い方: node scripts/check-click-fraud-burst.mjs [--days N]（既定14日）
 * 読み取り専用(d1q.mjs経由)。異常日があれば exit 1・詳細を表示。無ければ exit 0。
 */
import { spawnSync } from 'node:child_process';
import {
  analyzeClickFraudByDay,
  analyzeClickBursts,
  isImplausibleReferer,
  analyzeMobileRatioByDay,
  analyzeMobileAnomalyByDay,
} from './lib/click-fraud-detector.mjs';

const args = process.argv.slice(2);
const daysIdx = args.indexOf('--days');
const days = daysIdx >= 0 ? Number(args[daysIdx + 1]) : 14;

// ⚠️2026-08-29の是正: 以前は `referer LIKE 'https://my-naishin.com/_%'` で
// **既に人間と分類済みの行だけ**を検査していた。第3波のbotは referer を
// オリジンだけ(`https://my-naishin.com`)にしていたためこの絞り込みに掛からず、
// **検査対象にすら入らなかった**（実際に「疑いなし」と誤報した）。
// 新種のbotは必ず既存の分類の外側から来る。**全行を検査する。**
const sql =
  "SELECT id, created_at, date(created_at) as d, ip_hash, user_agent, affiliate_id, referer FROM clicks " +
  `WHERE created_at >= datetime('now','-${days} days')`;

const res = spawnSync(process.execPath, ['scripts/d1q.mjs', sql], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

if (res.status !== 0) {
  console.error('d1q.mjs failed:');
  console.error(res.stdout);
  console.error(res.stderr);
  process.exit(1);
}

let rows;
try {
  rows = JSON.parse(res.stdout);
} catch {
  console.error('d1q.mjs の出力をJSONとして解釈できなかった:', res.stdout.slice(0, 500));
  process.exit(1);
}

const flagged = analyzeClickFraudByDay(rows).filter((r) => r.flagged);
const { bursts, flaggedIds, byDate } = analyzeClickBursts(rows);
const implausible = rows.filter((r) => isImplausibleReferer(r.referer));

// T-M2 M2-4: 直近7日のモバイル比率が異常に低い日を警告(実トラフィックは80%前後がモバイル)。
const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const last7dRows = rows.filter((r) => r.d >= sevenDaysAgo);
const mobileFlagged = analyzeMobileRatioByDay(last7dRows).filter((r) => r.flagged);

// ★2026-09-02追加: 全期間でモバイル比率が極端に低い日(15%未満)を、二項確率つきで抽出する。
// 既存の日次シグネチャ(analyzeClickFraudByDay)はdistinct IP比率に依存するため、
// 2026-08-04(40件中モバイル0)・08-06(36件中1)・08-25(30件中1)を取りこぼしていた実績がある。
const mobileAnomaly = analyzeMobileAnomalyByDay(rows).filter((r) => r.flagged);

if (implausible.length > 0) {
  const byDay = {};
  for (const r of implausible) byDay[r.d] = (byDay[r.d] ?? 0) + 1;
  console.log(
    `⚠️ ブラウザが送らない形のreferer(オリジンのみ)を${implausible.length}件検知` +
      `(distinct IP ${new Set(implausible.map((r) => r.ip_hash)).size} / distinct UA ${new Set(implausible.map((r) => r.user_agent)).size}):`
  );
  for (const [d, n] of Object.entries(byDay).sort()) console.log(`  ${d}: ${n}件`);
}

if (flagged.length === 0 && bursts.length === 0 && implausible.length === 0 && mobileFlagged.length === 0 && mobileAnomaly.length === 0) {
  console.log(`OK: 過去${days}日間にクリック不正の疑いは無し(${rows.length}件を検査)`);
  process.exit(0);
}

if (flagged.length > 0) {
  console.log(`⚠️ 日次シグネチャに合致する日が${flagged.length}件(TH-13型・規模の大きい攻撃):`);
  for (const f of flagged) {
    console.log(
      `  ${f.date}: 総クリック${f.total} / distinct IP${f.distinctIp}(比率${f.ipRatio.toFixed(3)}) / distinct UA${f.distinctUa}`
    );
  }
}

if (mobileFlagged.length > 0) {
  console.log(`⚠️ 直近7日でモバイル比率が50%を下回った日が${mobileFlagged.length}件(実トラフィックは通常74-80%がモバイル):`);
  for (const m of mobileFlagged) {
    console.log(`  ${m.date}: 総クリック${m.total} / モバイル${m.mobile}(比率${(m.mobileRatio * 100).toFixed(1)}%)`);
  }
}

if (mobileAnomaly.length > 0) {
  console.log(
    `⚠️ モバイル比率が15%未満の日が${mobileAnomaly.length}件(全期間・偶然そうなる確率つき):`
  );
  for (const m of mobileAnomaly) {
    console.log(
      `  ${m.date}: 総クリック${m.total} / モバイル${m.mobile}(${(m.mobileRatio * 100).toFixed(1)}%)` +
        ` / 偶然の確率 ${m.chanceProbability.toExponential(1)}`
    );
  }
  console.log('  ※この日の非モバイル行は削除候補。実行はC7ゲート(👤承認＋事前バックアップ)。');
}

if (bursts.length > 0) {
  console.log(
    `⚠️ プロキシ回転型のバーストを${bursts.length}件検知(該当クリック${flaggedIds.size}件・件数によらず検知する主検知器):`
  );
  for (const [date, n] of [...byDate.entries()].sort()) console.log(`  ${date}: ${n}件`);
  console.log('  例:');
  for (const b of bursts.slice(0, 5)) {
    console.log(`    ${b.startedAt} ${b.affiliateId} へ${b.size}連続クリック(全て別IP)`);
  }
}

console.log('詳細はops/THREATS.md 脅威13(TH-13)を参照。D1書き換えはC7ゲートのためこのスクリプトは検知のみ行う。');
process.exit(1);
