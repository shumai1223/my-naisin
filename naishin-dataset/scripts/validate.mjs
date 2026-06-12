#!/usr/bin/env node
/**
 * データセットの整合性チェック（依存ゼロ・Node標準のみ）。
 * CI（.github/workflows/validate.yml）から実行し、壊れたデータがmainに入るのを防ぐ。
 *
 * 実行: node scripts/validate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'naishin-prefectures.json');
const CSV_PATH = path.join(ROOT, 'data', 'naishin-prefectures.csv');

const errors = [];
const REQUIRED = ['code', 'name', 'region', 'targetGrades', 'gradeMultipliers', 'coreMultiplier', 'practicalMultiplier', 'maxScore', 'toolUrl', 'apiUrl'];

if (!fs.existsSync(JSON_PATH)) {
  console.error(`❌ ${path.relative(ROOT, JSON_PATH)} がありません。\`npx tsx scripts/build-dataset-repo.ts\` で生成してください。`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const prefs = Array.isArray(data.prefectures) ? data.prefectures : [];

if (prefs.length !== 47) errors.push(`都道府県の件数が47ではありません: ${prefs.length}`);
if (data?.meta?.count !== prefs.length) errors.push(`meta.count(${data?.meta?.count}) と件数(${prefs.length})が不一致`);

const seen = new Set();
for (const p of prefs) {
  const tag = p?.code ?? '(no code)';
  for (const f of REQUIRED) {
    if (p[f] === undefined || p[f] === null) errors.push(`${tag}: 必須フィールド欠落 "${f}"`);
  }
  if (typeof p.maxScore === 'number' && p.maxScore <= 0) errors.push(`${tag}: maxScore が不正 (${p.maxScore})`);
  if (!Array.isArray(p.targetGrades) || p.targetGrades.length === 0) errors.push(`${tag}: targetGrades が空`);
  if (seen.has(p.code)) errors.push(`code が重複: ${p.code}`);
  seen.add(p.code);
}

if (!fs.existsSync(CSV_PATH)) errors.push('CSV が見つかりません');
else {
  const lines = fs.readFileSync(CSV_PATH, 'utf8').trim().split(/\r?\n/);
  // ヘッダ + 47行
  if (lines.length < 48) errors.push(`CSV の行数が不足: ${lines.length}（ヘッダ+47行を想定）`);
}

if (errors.length > 0) {
  console.error('❌ データセット検証に失敗しました:');
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}

console.log(`✅ データセット検証OK（${prefs.length}都道府県・必須フィールド充足・重複なし）`);
