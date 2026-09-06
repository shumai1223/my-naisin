#!/usr/bin/env node
/**
 * T-Y11E E-2: 47県の公表ページ取得層の第一歩。
 *
 * `src/data/competition-rates/<pref>.ts`は各県のPDF一次ソースをすでに`sources`配列として
 * 記録している（過去のY-2/T-Y11B作業の副産物）。このスクリプトはネットワークに一切触れず、
 * その既存記録から令和8年度分のURLだけを機械的に抜き出してマニフェスト化する
 * （`ops/raw/bairitsu-r8-source-urls.json`）。
 *
 * 次段階（実際の定期取得スクリプト）はこのマニフェストを起点にする。ここではURLの妥当性
 * （404でないか等）の検証や実取得は行わない（1県1日1回・900ms間隔等の礼儀正しい取得ルールは
 * 実取得スクリプト側で守る）。
 */
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'src', 'data', 'competition-rates');
const outPath = join(__dirname, '..', '..', 'ops', 'raw', 'bairitsu-r8-source-urls.json');

const files = readdirSync(dataDir).filter((f) => f.endsWith('.ts') && f !== 'index.ts' && !f.includes('__tests__'));

// sourcesエントリを1件ずつブロック単位（`{`〜次の`}`）で切り出し、ブロック内で
// url/docTitle/fiscalYear/fetchedAtを個別に探す（コメント行や改行された長いdocTitleの
// 折り返しがブロック内に混在してもよいように、フィールド単体の正規表現にする）。
function extractSourceEntries(text) {
  const sourcesIdx = text.indexOf('sources:');
  if (sourcesIdx === -1) return [];
  const arrayStart = text.indexOf('[', sourcesIdx);
  const arrayEnd = text.indexOf('],', arrayStart);
  const sourcesBlock = text.slice(arrayStart, arrayEnd === -1 ? undefined : arrayEnd);

  const entries = [];
  let depth = 0;
  let blockStart = -1;
  for (let i = 0; i < sourcesBlock.length; i++) {
    const ch = sourcesBlock[i];
    if (ch === '{') {
      if (depth === 0) blockStart = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && blockStart !== -1) {
        entries.push(sourcesBlock.slice(blockStart, i + 1));
        blockStart = -1;
      }
    }
  }

  return entries.map((block) => {
    const field = (name) => {
      const m = block.match(new RegExp(`${name}:\\s*'([^']*)'`));
      return m ? m[1] : '';
    };
    return { url: field('url'), docTitle: field('docTitle'), fiscalYear: field('fiscalYear'), fetchedAt: field('fetchedAt') };
  });
}

const manifest = {};
const missing = [];

for (const file of files) {
  const prefectureCode = file.replace(/\.ts$/, '');
  const text = readFileSync(join(dataDir, file), 'utf-8');
  const entries = extractSourceEntries(text);
  const r8Entry = entries.find((e) => e.fiscalYear.includes('令和8年度'));
  if (r8Entry && r8Entry.url) {
    manifest[prefectureCode] = r8Entry;
  } else {
    missing.push(prefectureCode);
  }
}

writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');

console.log(`manifest written: ${outPath}`);
console.log(`prefectures with R8 source URL: ${Object.keys(manifest).length}/${files.length}`);
if (missing.length) {
  console.log(`missing R8 source URL (needs manual follow-up): ${missing.join(', ')}`);
}
