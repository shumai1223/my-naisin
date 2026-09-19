// nara R9: 全日制(学力検査3教科+学校独自検査)表の『口頭試問』列(x≈244)に数値が入る学校があるか走査する。
// R8転記(data.mjs)には口頭試問のフィールドが無いため、R9で口頭試問を課す学科があれば取りこぼしになる。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
for (const f of ['31_r9gaiyou_ichiji_ichiran_dai1', '32_r9gaiyou_ichiji_ichiran_dai2', '33_r9gaiyou_niji_ichiran']) {
  const pages = fs.readFileSync(path.join(dir, f + '.bbox.html'), 'utf8').split('<page ').slice(1);
  pages.forEach((pg, pi) => {
    const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)"[^>]*>([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: m[3].normalize('NFKC') }));
    const hit = ws.filter((w) => w.x > 238 && w.x < 252 && /^\d+$/.test(w.t) && w.y > 150);
    console.log(f, 'p' + (pi + 1), '口頭試問列の数値:', hit.length ? hit.map((h) => h.t + '@' + Math.round(h.y)).join(' ') : 'なし');
  });
}
