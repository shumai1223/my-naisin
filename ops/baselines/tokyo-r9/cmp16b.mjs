// tokyo R9 別表16(文化・スポーツ等特別推薦)を学校名/種目名に依存せず、(募集人数表記, 調査書, 個人面接, 集団討論, 小論文, 実技, 学校設定) の多重集合で R8 と突合する。
// 縦書きセル(学校名・種目名)の連結が崩れる問題を避けるため、アンカー行(男女・N)と満点列のみを使う。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, 'r9_16.bbox.html'), 'utf8').split('<page ').slice(1);
const COL = [['cho', 525, 547], ['kojin', 547, 571], ['shoron', 571, 595], ['jitsu', 595, 615], ['gakko', 615, 645]];
const colOf = (x) => COL.find((c) => x >= c[1] && x < c[2])?.[0];
const sig = (cnt, p) => [cnt, p.cho ?? '-', p.kojin ?? '-', p.shudan ?? '-', p.shoron ?? '-', p.jitsu ?? '-', p.gakko ?? '-'].join('|');
const r9 = new Map();
let n9 = 0;
pages.forEach((pg) => {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: z(m[5]) }));
  const anchors = ws.filter((w) => w.x >= 205 && w.x < 245 && /^(男女|男|女)・\d+$/.test(w.t)).sort((a, b) => a.y - b.y);
  for (const a of anchors) {
    const pts = {};
    for (const w of ws.filter((w) => w.x >= 500 && w.x < 700 && w.y >= a.y - 10 && w.y <= a.y + 30 && /^\d+$/.test(w.t))) {
      const c = colOf(w.x);
      if (c && pts[c] == null) pts[c] = +w.t;
    }
    const k = sig(a.t, pts);
    r9.set(k, (r9.get(k) || 0) + 1);
    n9++;
  }
});
const ts = fs.readFileSync(path.join(dir, '../../../src/data/school-selection-methods/tokyo.ts'), 'utf8');
const r8 = new Map();
let n8 = 0;
for (const p of ts.split('    {\n      schoolName: ').slice(1)) {
  const dept = (p.match(/department: '([^']*)'/) || [])[1];
  const cat = (p.match(/selectionCategory: '([^']*)'/) || [])[1];
  const ratio = (p.match(/ratioType: '([^']*)'/) || [])[1];
  if (cat !== '文化・スポーツ等特別推薦') continue;
  const m = dept.match(/\((男女|男|女)・(\d+)\)/);
  const num = (re) => { const q = (ratio || '').match(re); return q ? +q[1] : undefined; };
  const k = sig(m ? `${m[1]}・${m[2]}` : '?', { cho: num(/調査書(\d+)点/), kojin: (num(/個人面接(\d+)点/) ?? 0) + (num(/集団討論(\d+)点/) ?? 0) || undefined, shoron: num(/小論文(\d+)点/), jitsu: num(/実技検査(\d+)点/), gakko: num(/学校設定検査(\d+)点/) });
  r8.set(k, (r8.get(k) || 0) + 1);
  n8++;
}
console.log('R9 行', n9, 'R8 行', n8);
const keys = new Set([...r9.keys(), ...r8.keys()]);
let same = 0;
const only9 = [], only8 = [];
for (const k of keys) {
  const a = r9.get(k) || 0, b = r8.get(k) || 0;
  same += Math.min(a, b);
  if (a > b) only9.push(`${k} x${a - b}`);
  if (b > a) only8.push(`${k} x${b - a}`);
}
console.log('多重集合で一致', same, '/ R9のみ', only9.length, '種 / R8のみ', only8.length, '種');
console.log('-- R9のみ'); only9.forEach((s) => console.log('  +', s));
console.log('-- R8のみ'); only8.forEach((s) => console.log('  -', s));
