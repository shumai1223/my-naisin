// oita R9: 指定PDFの指定頁の行(y近傍)ごとにx座標付きトークンを出す。 node rows.mjs 01 1 [ymin ymax]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const [n, pn, y0, y1] = process.argv.slice(2);
const pages = fs.readFileSync(path.join(dir, n + '.bbox.html'), 'utf8').split('<page ').slice(1);
console.log('pages', pages.length, pages[0].match(/width="([\d.]+)" height="([\d.]+)"/).slice(1).join('x'));
const ws = [...pages[+pn - 1].matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: m[5] }));
const rows = [];
for (const w of ws.sort((a, b) => a.y - b.y || a.x - b.x)) {
  const r = rows.find((r) => Math.abs(r.y - w.y) < 2.5);
  if (r) r.w.push(w); else rows.push({ y: w.y, w: [w] });
}
for (const r of rows.filter((r) => r.y >= (+y0 || 0) && r.y < (+y1 || 9999))) console.log(Math.round(r.y), r.w.sort((a, b) => a.x - b.x).map((w) => Math.round(w.x) + ':' + w.t).join(' ').slice(0, 260));
