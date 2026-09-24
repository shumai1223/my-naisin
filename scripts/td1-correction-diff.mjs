#!/usr/bin/env node
/**
 * T-TD1 TD-9: 県が公表資料を訂正したとき、前回納品した抽出結果と訂正版の抽出結果の差分(訂正履歴)を作る。
 *
 * 使い方: node scripts/td1-correction-diff.mjs <前回のparsed.json> <訂正版のparsed.json> [--out <訂正履歴.csv>]
 *   parsed.json = scripts/bairitsu-ingest/harvest-prefecture.ts --emit の出力({prefectureCode, rows})
 *
 * 出力(CSV・BOM付きUTF-8・CRLF): 学校名,学科,項目,変更前,変更後 ／ 項目は 募集人員/出願者数/倍率/追加/削除
 * 差分が0件なら「訂正による変更なし」と表示してexit 0（再納品は不要）。
 */
import fs from 'node:fs';

const args = process.argv.slice(2);
const oi = args.indexOf('--out');
const out = oi >= 0 ? args[oi + 1] : null;
const [oldPath, newPath] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1] === '--out'));
if (!oldPath || !newPath) {
  console.error('使い方: node scripts/td1-correction-diff.mjs <前回のparsed.json> <訂正版のparsed.json> [--out <訂正履歴.csv>]');
  process.exit(2);
}
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8')).rows;
const key = (r) => `${r.schoolName}\u0000${r.department}`;
const oldMap = new Map(load(oldPath).map((r) => [key(r), r]));
const newMap = new Map(load(newPath).map((r) => [key(r), r]));
const cell = (v) => (/[",\r\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const rows = [];
for (const [k, n] of newMap) {
  const o = oldMap.get(k);
  if (!o) {
    rows.push([n.schoolName, n.department, '追加', '', `募集${n.quota}/出願${n.finalApplicants}/倍率${n.finalRate}`]);
    continue;
  }
  if (o.quota !== n.quota) rows.push([n.schoolName, n.department, '募集人員', o.quota, n.quota]);
  if (o.finalApplicants !== n.finalApplicants) rows.push([n.schoolName, n.department, '出願者数', o.finalApplicants, n.finalApplicants]);
  if (o.finalRate !== n.finalRate) rows.push([n.schoolName, n.department, '倍率', o.finalRate, n.finalRate]);
}
for (const [k, o] of oldMap) if (!newMap.has(k)) rows.push([o.schoolName, o.department, '削除', `募集${o.quota}/出願${o.finalApplicants}/倍率${o.finalRate}`, '']);
if (rows.length === 0) {
  console.log('訂正による変更なし（再納品は不要）。');
  process.exit(0);
}
const csv = '\uFEFF' + [['学校名', '学科', '項目', '変更前', '変更後'].join(',')].concat(rows.map((r) => r.map(cell).join(','))).join('\r\n') + '\r\n';
if (out) {
  fs.writeFileSync(out, csv, 'utf8');
  console.log(`訂正履歴 ${rows.length}件 → ${out}`);
} else {
  process.stdout.write(csv);
}
