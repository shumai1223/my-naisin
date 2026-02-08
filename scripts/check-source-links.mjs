import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const PREFECTURE_FILE = resolve('src/lib/prefectures.ts');
const TIMEOUT_MS = 12000;

function extractUrls(content) {
  const urls = new Set();
  const regex = /sourceUrl:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.add(match[1]);
  }
  return [...urls];
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return { url, ok: true };
  } catch (error) {
    return { url, ok: false, error: error?.message ?? 'Unknown error' };
  } finally {
    clearTimeout(timer);
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

  if (failures.length > 0) {
    console.error('Broken sourceUrl links found:');
    failures.forEach((fail) => console.error(`- ${fail.url}: ${fail.error}`));
    process.exit(1);
  }

  console.log(`All ${urls.length} sourceUrl links are reachable.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
