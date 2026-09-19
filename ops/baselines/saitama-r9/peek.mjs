// 指定学科の周辺トークン(x<3200)を出す: node peek.mjs <rows.json> <bbox.html> <dept>
import fs from 'fs';
const [rowsFile, bboxFile, dept] = process.argv.slice(2);
const r = JSON.parse(fs.readFileSync(rowsFile, 'utf8'));
const x = r.find((x) => x.dept === dept);
console.log(x.page, x.y, x.schoolDP || x.school);
const pg = fs.readFileSync(bboxFile, 'utf8').split('<page ').slice(1)[x.page - 1];
const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)"[^>]*>([^<]*)<\/word>/g)]
  .map((m) => ({ x: +m[1], y: +m[2], t: m[3] }))
  .filter((w) => w.x < 3200 && Math.abs(w.y - x.y) < 260)
  .sort((a, b) => a.y - b.y || a.x - b.x);
console.log(ws.map((w) => Math.round(w.y) + ':' + Math.round(w.x) + ':' + w.t).join('  '));
