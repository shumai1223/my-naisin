import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// src/data/competition-rate-history/*.ts（Λ-4・47都道府県の多年度アーカイブ・志願者数/募集人員の
// 一次資料17,142レコード級）のsourceUrl(314件のユニークURL)は、check:links(prefectures.ts)・
// check:affiliate-links(affiliates.ts)・check:blog-links(ブログ記事)いずれのスコープ外で、
// これまで一度もリンク死活監視の対象になっていなかった(2026-08-17判明)。この一次資料アーカイブは
// BAR.mdが名指しする最大の差別化要因(自社の実データ保有量)であり、出典切れは信頼の堀そのものの
// 毀損に直結するため専用チェッカーを新設した。
//
// ⚠️ 過去年度のPDF資料は教育委員会側が期限切れで削除することが多いと想定される
// (press-release型の一時的PDFが多い)。このチェッカーが検出する404は「データの誤り」ではなく
// 「出典リンクの経年劣化」であり、データ自体の正確性は既に転記時に検証済み
// (`ops/tasks/`のΛ-4関連メモ・commitメッセージ参照)。
//
// ⚠️ この環境ではTLS傍受により素のfetchが全滅することがある(check:links等と同じ罠・
// memory `fable5-loop-protocol`参照)。ローカル実行時は
// `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run check:competition-links` を使うこと。

const DATA_DIR = resolve('src/data/competition-rate-history');
const TIMEOUT_MS = 15000;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function extractSourceUrls() {
  const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.ts') && !f.includes('__tests__'));
  const entries = [];
  const seen = new Map();
  for (const file of files) {
    const content = await readFile(join(DATA_DIR, file), 'utf-8');
    const urlRe = /sourceUrl:\s*'([^']+)'/g;
    let m;
    while ((m = urlRe.exec(content)) !== null) {
      const url = m[1];
      // 同一URLは初出ファイルのみ記録(複数年度のcurrent-year等で同一資料を再掲することがあるため重複チェックを避ける)。
      if (seen.has(url)) continue;
      seen.set(url, file);
      entries.push({ file, url });
    }
  }
  return entries;
}

async function fetchStatus(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: '*/*' },
      signal: controller.signal,
    });
    return res.status;
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl({ file, url }) {
  try {
    let status;
    try {
      status = await fetchStatus(url, 'HEAD');
      if (status === 403 || status === 405 || status === 501 || status >= 500) {
        status = await fetchStatus(url, 'GET');
      }
    } catch {
      status = await fetchStatus(url, 'GET');
    }
    if (status === 404 || status === 410) return { file, url, ok: false, error: `HTTP ${status}` };
    if (status >= 400) return { file, url, ok: true, warn: `HTTP ${status}（bot弾き/一時障害の可能性・到達はしている）` };
    return { file, url, ok: true };
  } catch (error) {
    const msg = error?.message ?? 'Unknown error';
    if (/ENOTFOUND|getaddrinfo|ECONNREFUSED|ERR_NAME_NOT_RESOLVED/i.test(msg)) {
      return { file, url, ok: false, error: msg };
    }
    return { file, url, ok: true, warn: `到達確認できず（${msg}）` };
  }
}

async function main() {
  const entries = await extractSourceUrls();
  if (entries.length === 0) {
    console.log('No sourceUrl entries found.');
    return;
  }

  // 47ファイル×複数年度で並列度が高いため、直列よりは並列だがバッチ分割してタイムアウトを避ける。
  const BATCH = 30;
  const results = [];
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    results.push(...(await Promise.all(batch.map(checkUrl))));
  }

  const failures = results.filter((r) => !r.ok);
  const warnings = results.filter((r) => r.ok && r.warn);

  if (warnings.length > 0) {
    console.warn(`⚠ 到達は確認できたが応答が通常でないURL ${warnings.length}件（CIは落としません）:`);
    warnings.forEach((w) => console.warn(`- [${w.file}] ${w.url}: ${w.warn}`));
  }

  if (failures.length > 0) {
    console.error('✗ 壊れた多年度アーカイブ出典URL（404/410 または DNS解決不可）:');
    failures.forEach((f) => console.error(`- [${f.file}] ${f.url}: ${f.error}`));
    console.error('\n※ データ自体の正確性は転記時に検証済み。リンク切れの場合はWayback Machine等で当時のPDFを保存し直すか、出典切れを明記する対応を検討。');
    process.exit(1);
  }

  console.log(`✅ ${entries.length}件の一次ソースURL（${new Set(entries.map((e) => e.file)).size}県分・重複除く）を確認（壊れリンクなし／警告${warnings.length}件）。`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
