// diff-report.txt から『求める生徒像』の文言変更を除き、DBが持つ内容(募集人員・配点・面接・選抜方法)に関わる差分だけを校ごとに出す。
import fs from 'fs';
const KEEP = /(\d|面接|配点|選抜|調査書|学力検査|評価|作文|小論文|実技|群|募集人員|評定|得点|順位)/;
const lines = fs.readFileSync('diff-report.txt', 'utf8').split(/\r?\n/);
let cur = null; const blocks = [];
for (const l of lines) {
  if (/^==|^校\(頁\)/.test(l)) { cur = null; continue; }
  if (/^\s+\[(差分|R9のみ|R8のみ)\]/.test(l)) { cur = { head: l.trim(), items: [] }; blocks.push(cur); continue; }
  const m = /^\s+([<>])\s(.*)$/.exec(l);
  if (m && cur) cur.items.push({ side: m[1], t: m[2] });
}
let shown = 0;
for (const b of blocks) {
  const items = b.items.filter((i) => KEEP.test(i.t) && !/求め(る|て)いま?す|を求めます|生徒を求めて/.test(i.t));
  if (!items.length && /\[差分\]/.test(b.head)) continue;
  shown++;
  console.log(b.head);
  items.forEach((i) => console.log('   ' + i.side + ' ' + i.t));
}
console.log('校数', shown);
