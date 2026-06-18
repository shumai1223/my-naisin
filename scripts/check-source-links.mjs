import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PREFECTURE_FILE = resolve('src/lib/prefectures.ts');
const TIMEOUT_MS = 15000;
// 教育委員会などの公的サイトはUA無しのbotを弾くことがあるため、通常ブラウザ相当のUAを送る。
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function extractUrls(content) {
  const urls = new Set();
  const regex = /sourceUrl:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.add(match[1]);
  }
  return [...urls];
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

/**
 * リンクの生存確認。
 * 「壊れ」とみなすのは 404/410（消滅）と DNS/接続不能だけ。
 * 403/405/429/5xx・タイムアウトは「bot弾き／HEAD非対応／一時障害」で到達自体はしているので警告に留める
 * （公的サイトは HEAD拒否・bot拒否・低速が多く、それを CI 失敗にすると偽陽性で常に赤くなるため）。
 */
async function checkUrl(url) {
  try {
    let status;
    try {
      status = await fetchStatus(url, 'HEAD');
      // HEAD を受け付けないサーバーは GET で再確認
      if (status === 403 || status === 405 || status === 501 || status >= 500) {
        status = await fetchStatus(url, 'GET');
      }
    } catch {
      // HEAD 自体が例外（メソッド非対応・中断）→ GET で再試行
      status = await fetchStatus(url, 'GET');
    }
    if (status === 404 || status === 410) return { url, ok: false, error: `HTTP ${status}` };
    if (status >= 400) return { url, ok: true, warn: `HTTP ${status}（bot弾き/一時障害の可能性・到達はしている）` };
    return { url, ok: true };
  } catch (error) {
    const msg = error?.message ?? 'Unknown error';
    // DNS不明・接続拒否は本当に壊れ。タイムアウト等は警告（公的サイトは遅いだけのことが多い）。
    if (/ENOTFOUND|getaddrinfo|ECONNREFUSED|ERR_NAME_NOT_RESOLVED/i.test(msg)) {
      return { url, ok: false, error: msg };
    }
    return { url, ok: true, warn: `到達確認できず（${msg}）` };
  }
}

async function main() {
  const raw = await readFile(PREFECTURE_FILE, 'utf-8');
  const urls = extractUrls(raw);
  if (urls.length === 0) {
    console.log('No sourceUrl entries found.');
    return;
  }

  const results = await Promise.all(urls.map(checkUrl));
  const failures = results.filter((r) => !r.ok);
  const warnings = results.filter((r) => r.ok && r.warn);

  if (warnings.length > 0) {
    console.warn(`⚠ 到達は確認できたが応答が通常でないURL ${warnings.length}件（CIは落としません）:`);
    warnings.forEach((w) => console.warn(`- ${w.url}: ${w.warn}`));
  }

  if (failures.length > 0) {
    console.error('✗ 壊れたsourceUrl（404/410 または DNS解決不可）:');
    failures.forEach((fail) => console.error(`- ${fail.url}: ${fail.error}`));
    process.exit(1);
  }

  console.log(`✅ ${urls.length}件のsourceUrlを確認（壊れリンクなし／警告${warnings.length}件）。`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
