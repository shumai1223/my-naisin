// suisen.bbox.html の各頁で見出し(推薦入学者選抜/連携型/課程)のy位置を出す
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] || 'suisen';
const pages = fs.readFileSync(path.join(dir, file + '.bbox.html'), 'utf8').split('<page ').slice(1);
pages.forEach((pg, pi) => {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)"[^>]*>([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: m[3] }));
  for (const w of ws) if (/推薦入学者選抜|連携型|方式\]|全日制課程|定時制課程/.test(w.t) && w.x < 140) console.log('p' + (pi + 1), Math.round(w.y), Math.round(w.x), w.t);
});
