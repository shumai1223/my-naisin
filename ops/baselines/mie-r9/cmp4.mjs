// mie R9: R8転記(補足文)がR9別表4の本文に(空白・句読点を除いて)そのまま現れるかを確認する。現れない文言=R9で文言が変わった候補。
import fs from 'fs';
import { B4 } from '../mie-transcription/data-b4.mjs';
const nn = (s) => s.normalize('NFKC').replace(/[\s「」、。,.]/g, '');
const pages = fs.readFileSync('betsu4.bbox.html', 'utf8').split('<page ').slice(1);
let all = '';
for (const pg of pages) {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)]
    .map((m) => ({ x: +m[1], y: +m[2], t: m[5] }))
    .filter((w) => w.x >= 375 && w.y > 105);
  all += ws.sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join('');
}
const hay = nn(all);
const miss = [];
const seen = new Set();
for (const [i, r] of B4.entries()) {
  const t = nn(r.txt);
  if (!t || seen.has(t)) continue;
  seen.add(t);
  if (!hay.includes(t)) miss.push(`#${i} ${r.school}/${r.dept.slice(0, 10)}: ${r.txt.slice(0, 80)}`);
}
console.log('R8の補足文がR9に見つからない(ユニーク文言)', miss.length, '/', seen.size);
miss.forEach((x) => console.log(' ', x));
