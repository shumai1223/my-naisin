// TARGETS.csv(正本)の状態を id 指定で更新する。使い方: node scripts/juku1-set-status.mjs "<新しい状態>" id,id,...
// 改行コードは元のファイルに合わせる(対話セッションが LF で書き直すことがあるため)。
import fs from 'node:fs';

const f = 'ops/deliverables/juku1/TARGETS.csv';
const status = process.argv[2];
const ids = new Set(process.argv[3].split(','));
const raw = fs.readFileSync(f, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
const lines = raw.replace(/^﻿/, '').split(/\r?\n/);
let n = 0;
const out = lines.map((line) => {
  const id = line.split(',')[0];
  if (!ids.has(id)) return line;
  const cut = line.lastIndexOf(',');
  n++;
  return line.slice(0, cut + 1) + status;
});
fs.writeFileSync(f, '﻿' + out.join(eol), 'utf8');
console.log(`updated ${n}/${ids.size}`);
