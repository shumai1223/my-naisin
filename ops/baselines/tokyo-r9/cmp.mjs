// T-Y14 tokyo R9(令和9年度 普通教育を主とする学科・r9_10.pdf・7頁)を pdftotext -bbox の座標で学校別に読み、R8(tokyo.ts)の
// 『推薦枠割合』『第一次募集の学力検査:調査書の比率と満点』『第二次募集の同』と突合する(R8のratioTypeを正規表現で解析)。
// 使い方: pdftotext -bbox r9_10.pdf r9_10.bbox.html && node cmp.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, 'r9_10.bbox.html'), 'utf8').split('<page ').slice(1);
const r9 = new Map();
pages.forEach((pg, pi) => {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: z(m[5]) }));
  // 学校行: 第一次募集の比率トークン(N:M)を x455-500 に持つ行
  const ratioToks = ws.filter((w) => w.x >= 450 && w.x < 500 && /^\d+:\d+$/.test(w.t));
  for (const rt of ratioToks) {
    const row = ws.filter((w) => Math.abs(w.y - rt.y) < 3);
    const name = row.filter((w) => w.x >= 70 && w.x < 125).sort((a, b) => a.x - b.x).map((w) => w.t).join('');
    const pct = row.find((w) => w.x >= 120 && w.x < 145 && /^\d+$/.test(w.t))?.t ?? null;
    const p1 = row.filter((w) => w.x >= 498 && w.x < 600 && /^\d+$/.test(w.t)).sort((a, b) => a.x - b.x).map((w) => w.t);
    const r2 = row.find((w) => w.x >= 700 && w.x < 745 && /^\d+:\d+$/.test(w.t))?.t ?? null;
    const p2 = row.filter((w) => w.x >= 742 && w.x < 850 && /^\d+$/.test(w.t)).sort((a, b) => a.x - b.x).map((w) => w.t);
    const rec = { page: pi + 1, name, pct, r1: rt.t, p1, r2, p2 };
    const k = name;
    if (!r9.has(k)) r9.set(k, []);
    r9.get(k).push(rec);
  }
});
console.log('R9 schools(rows)', [...r9.values()].reduce((a, b) => a + b.length, 0));
// R8
const ts = fs.readFileSync(path.join(dir, '../../../src/data/school-selection-methods/tokyo.ts'), 'utf8');
const re = /schoolName: '([^']*)',\s+department: '([^']*)',\s+selectionCategory: '([^']*)',(?:\s+interviewRequired: (?:true|false),)?\s+ratioType: '([^']*)'/g;
let m;
const r8 = new Map();
while ((m = re.exec(ts))) {
  const [, school, dept, cat, ratio] = m;
  const k = school;
  if (!r8.has(k)) r8.set(k, { pct: null, first: null, second: null });
  const o = r8.get(k);
  if (cat === '推薦に基づく選抜') { const p = ratio.match(/推薦枠割合(\d+)%/); if (p && o.pct == null) o.pct = p[1]; }
  if (cat === '第一次募集') { const q = ratio.match(/学力検査(\d+):調査書(\d+)\((\d+)点:(\d+)点\)/); if (q && !o.first) o.first = q.slice(1); }
  if (cat === '第二次募集') { const q = ratio.match(/学力検査(\d+):調査書(\d+)\((\d+)点:(\d+)点\)/); if (q && !o.second) o.second = q.slice(1); }
}
console.log('R8 schools', r8.size);
let same = 0;
const diffs = [];
const nk = (s) => s.replace(/[\s　]/g, '');
const r9names = new Map([...r9.entries()].map(([k, v]) => [nk(k), v]));
for (const [school, o] of r8) {
  const v = r9names.get(nk(school));
  if (!v) { diffs.push(`R8のみ(R9に学校行なし) ${school}`); continue; }
  const a = v[0];
  const msgs = [];
  if (o.pct != null && a.pct !== o.pct) msgs.push(`推薦枠 R8=${o.pct} R9=${a.pct}`);
  if (o.first) {
    const [x, y, px, py] = o.first;
    if (a.r1 !== `${x}:${y}` && a.r1 !== `${x}:${y}`.replace(':', '：') ) msgs.push(`第一次比率 R8=${x}:${y} R9=${a.r1}`);
    if (a.p1[0] !== px || a.p1[1] !== py) msgs.push(`第一次満点 R8=${px}/${py} R9=${a.p1.slice(0, 3).join('/')}`);
  }
  if (o.second && a.r2) {
    const [x, y, px, py] = o.second;
    if (a.r2 !== `${x}:${y}`) msgs.push(`第二次比率 R8=${x}:${y} R9=${a.r2}`);
    if (a.p2[0] !== px || a.p2[1] !== py) msgs.push(`第二次満点 R8=${px}/${py} R9=${a.p2.slice(0, 3).join('/')}`);
  }
  if (msgs.length) diffs.push(`${school}: ${msgs.join(' | ')}`); else same++;
}
for (const [k] of r9names) if (![...r8.keys()].some((s) => nk(s) === k)) diffs.push(`R9のみ ${k}`);
console.log('一致', same, '差分', diffs.length);
diffs.forEach((d) => console.log(' ', d));

