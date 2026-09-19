// 各頁で満点列(x525-645)に数字が1つも無いアンカー行の数を数え、最初の1件のトークンを出す
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const pages = fs.readFileSync(path.join(dir, 'r9_16.bbox.html'), 'utf8').split('<page ').slice(1);
let shown = 0;
pages.forEach((pg, i) => {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: m[5].normalize('NFKC') }));
  const anchors = ws.filter((w) => w.x >= 205 && w.x < 245 && /^(男女|男|女)・\d+$/.test(w.t));
  let empty = 0, first = null;
  for (const a of anchors) {
    const has = ws.some((w) => w.x >= 525 && w.x < 645 && w.y >= a.y - 10 && w.y <= a.y + 30 && /^\d+$/.test(w.t));
    if (!has) { empty++; if (!first) first = a; }
  }
  console.log('p' + (i + 1), 'anchors', anchors.length, 'empty', empty);
  if (first && shown < 2) {
    shown++;
    console.log('  ANCHOR', first.t, Math.round(first.y), ws.filter((w) => Math.abs(w.y - first.y) < 16 && w.x > 400).sort((p, r) => p.x - r.x).map((w) => Math.round(w.x) + ':' + w.t + '@' + Math.round(w.y)).join(' '));
  }
});
