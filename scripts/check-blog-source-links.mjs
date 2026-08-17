import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

// ブログ記事(src/lib/blog/posts/*.ts)の`sources`配列(記事末尾に表示する出典リンク)は、
// prefectures.tsのsourceUrlを対象とするcheck:links(scripts/check-source-links.mjs)の
// スコープ外で、これまで一度もリンク死活監視の対象になっていなかった(2026-08-17判明)。
// 51記事・157件のURLを同じ寛容な分類方針(404/410/DNS不能のみ壊れ)で巡回する。
//
// ⚠️ この環境ではTLS傍受により素のfetchが全滅することがある(check:links/check:affiliate-linksと
// 同じ罠・memory `fable5-loop-protocol`参照)。ローカル実行時は
// `NODE_TLS_REJECT_UNAUTHORIZED=0 npm run check:blog-links` を使うこと。

const POSTS_DIR = resolve('src/lib/blog/posts');
const TIMEOUT_MS = 15000;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

async function extractSourceUrls() {
  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith('.ts'));
  const entries = [];
  for (const file of files) {
    const content = await readFile(join(POSTS_DIR, file), 'utf-8');
    const sourcesMatch = content.match(/sources:\s*\[([\s\S]*?)\]\s*,\s*\n\s*content:/);
    if (!sourcesMatch) continue;
    const urlRe = /url:\s*'([^']+)'/g;
    let m;
    while ((m = urlRe.exec(sourcesMatch[1])) !== null) {
      entries.push({ file, url: m[1] });
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
    console.log('No blog source URLs found.');
    return;
  }

  const results = await Promise.all(entries.map(checkUrl));
  const failures = results.filter((r) => !r.ok);
  const warnings = results.filter((r) => r.ok && r.warn);

  if (warnings.length > 0) {
    console.warn(`⚠ 到達は確認できたが応答が通常でないURL ${warnings.length}件（CIは落としません）:`);
    warnings.forEach((w) => console.warn(`- [${w.file}] ${w.url}: ${w.warn}`));
  }

  if (failures.length > 0) {
    console.error('✗ 壊れたブログ出典URL（404/410 または DNS解決不可）:');
    failures.forEach((f) => console.error(`- [${f.file}] ${f.url}: ${f.error}`));
    process.exit(1);
  }

  console.log(`✅ ${entries.length}件のブログ出典URL（${new Set(entries.map((e) => e.file)).size}記事分）を確認（壊れリンクなし／警告${warnings.length}件）。`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
