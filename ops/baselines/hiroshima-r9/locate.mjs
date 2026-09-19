// 指定した語(学校名)の頁3内の座標を出す: node locate.mjs r9list.pdf 安西
import { execFileSync } from 'child_process';
const [pdf, ...names] = process.argv.slice(2);
const h = execFileSync('pdftotext', ['-bbox', '-f', '3', '-l', '3', pdf, '-'], { encoding: 'utf8', maxBuffer: 1 << 26 });
const ws = [...h.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: m[5] }));
for (const n of names) console.log(n, ws.filter((w) => w.t === n).map((w) => `${Math.round(w.x)},${Math.round(w.y)}`).join(' | '));
console.log('ヘッダ語', ws.filter((w) => /次選抜|特色枠|一般枠/.test(w.t)).map((w) => `${w.t}@${Math.round(w.x)},${Math.round(w.y)}`).join(' | '));
