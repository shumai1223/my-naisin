import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// ops/THREATS.md 脅威6(TH-4)「ASPプログラムの終了・条件変更」への予防策として新設。
// affiliates.ts の live 案件(status !== 'pending')のhrefを巡回し、ASPが案件を終了して
// デッドリンク化していないかを検知する。読み取り専用・D1は一切触らない。
// 月次実行を想定(cronではなく手動 or T-R1月次確認のタイミングで `npm run check:affiliate-links`)。
//
// 壊れを検知しても自動でstatus変更はしない(コード変更のデプロイは👤ゲート)。
// 検知したらops/THREATS.mdまたはworklogに記録し、該当案件のstatusを'pending'へ戻すかは
// 別途判断する。
//
// ⚠️ 会社ネットワーク環境ではTLS傍受により素のNode fetchが「fetch failed」で全滅することがある
// (memory: wrangler-corporate-network-workaround / next buildの既知の罠と同根)。
// その場合はローカル実行時のみ `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run check:affiliate-links` で
// 回避できる(CI環境ではこの問題は起きないため、package.json側には常時は仕込まない)。

const AFFILIATES_FILE = resolve('src/lib/affiliates.ts');
const TIMEOUT_MS = 20000;
const UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

function extractLiveAffiliates(content) {
  const start = content.indexOf('export const AFFILIATES');
  if (start === -1) throw new Error('AFFILIATES定義が見つからない(affiliates.tsの構造が変わった可能性)');
  const body = content.slice(start);

  const entryRe = / {2}'([^']+)':\s*\{([\s\S]*?)\n {2}\},\n/g;
  const results = [];
  let match;
  while ((match = entryRe.exec(body)) !== null) {
    const [, key, block] = match;
    const isPending = /status:\s*'pending'/.test(block);
    if (isPending) continue;
    const hrefMatch = block.match(/href:\s*'([^']+)'/);
    if (!hrefMatch || hrefMatch[1] === '#') continue;
    results.push({ id: key, href: hrefMatch[1] });
  }
  return results;
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
    return { status: res.status, finalUrl: res.url };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * ASPトラッキングpixel URL(a8.net等)の生存確認。
 * check-source-links.mjsと同じ分類方針: 404/410/DNS不能のみ「壊れ」、それ以外は警告に留める
 * (ASP側のトラッキングエンドポイントはHEAD拒否・bot弾き・一時障害が多く、CIを常時赤くしないため)。
 */
async function checkAffiliate({ id, href }) {
  try {
    let status, finalUrl;
    try {
      ({ status, finalUrl } = await fetchStatus(href, 'HEAD'));
      if (status === 403 || status === 405 || status === 501 || status >= 500) {
        ({ status, finalUrl } = await fetchStatus(href, 'GET'));
      }
    } catch {
      ({ status, finalUrl } = await fetchStatus(href, 'GET'));
    }
    if (status === 404 || status === 410) {
      return { id, href, ok: false, error: `HTTP ${status}` };
    }
    if (status >= 400) {
      return { id, href, ok: true, warn: `HTTP ${status}（bot弾き/一時障害の可能性・到達はしている）` };
    }
    return { id, href, ok: true, finalUrl };
  } catch (error) {
    const msg = error?.message ?? 'Unknown error';
    if (/ENOTFOUND|getaddrinfo|ECONNREFUSED|ERR_NAME_NOT_RESOLVED/i.test(msg)) {
      return { id, href, ok: false, error: msg };
    }
    return { id, href, ok: true, warn: `到達確認できず（${msg}）` };
  }
}

async function main() {
  const raw = await readFile(AFFILIATES_FILE, 'utf-8');
  const affiliates = extractLiveAffiliates(raw);
  if (affiliates.length === 0) {
    console.log('No live affiliate entries found.');
    return;
  }

  const results = await Promise.all(affiliates.map(checkAffiliate));
  const failures = results.filter((r) => !r.ok);
  const warnings = results.filter((r) => r.ok && r.warn);

  if (warnings.length > 0) {
    console.warn(`⚠ 到達は確認できたが応答が通常でない案件 ${warnings.length}件（CIは落としません）:`);
    warnings.forEach((w) => console.warn(`- ${w.id}: ${w.warn}`));
  }

  if (failures.length > 0) {
    console.error('✗ デッドリンク化した疑いのある案件（404/410 または DNS解決不可）:');
    failures.forEach((f) => console.error(`- ${f.id} (${f.href}): ${f.error}`));
    console.error('\n対応: ops/tasks/またはworklogに記録し、該当案件のstatusを\'pending\'へ戻すかを検討（affiliates.tsのコード変更→デプロイは👤ゲート）。');
    process.exit(1);
  }

  console.log(`✅ ${affiliates.length}件のlive affiliate hrefを確認（デッドリンクなし／警告${warnings.length}件）。`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
