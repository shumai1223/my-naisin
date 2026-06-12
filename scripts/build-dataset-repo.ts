#!/usr/bin/env tsx
/**
 * naishin-dataset 公開リポジトリの data/ を、サイト本体の正準ソース（src/lib/naishin-dataset.ts）
 * から生成する。データが本体と絶対にズレない＝「信頼の堀」を外部リポでも保つための単一生成口。
 *
 * 実行: npx tsx scripts/build-dataset-repo.ts
 * 出力: naishin-dataset/data/naishin-prefectures.json / .csv
 *
 * README / LICENSE / CI ワークフローは静的（人が編集）なのでここでは触らない。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildDatasetIndex, buildDatasetCsv } from '@/lib/naishin-dataset';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'naishin-dataset', 'data');

fs.mkdirSync(OUT_DIR, { recursive: true });

const index = buildDatasetIndex();
// 生成時刻はリポのノイズになるため、データ配布物では日付（YYYY-MM-DD）に丸める。
index.meta.generatedAt = new Date().toISOString().slice(0, 10);

const jsonPath = path.join(OUT_DIR, 'naishin-prefectures.json');
fs.writeFileSync(jsonPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

const csvPath = path.join(OUT_DIR, 'naishin-prefectures.csv');
fs.writeFileSync(csvPath, buildDatasetCsv(), 'utf8');

console.log('✅ naishin-dataset 生成完了');
console.log(`   - ${path.relative(ROOT, jsonPath)}（${index.prefectures.length}件）`);
console.log(`   - ${path.relative(ROOT, csvPath)}`);
