// tokyo R9 別表5-1(文化・スポーツ等特別推薦・r9_16.pdf 39頁)を bbox から (学校, 種目, 男女・人数, 調査書/個人面接/集団討論/小論文/実技/学校設定 の満点) に抽出し、
// R8(tokyo.ts の『文化・スポーツ等特別推薦』レコード)と突合する。アンカー=『男女・N』『男・N』『女・N』トークン(x210-240)。学校名は最初の行にだけ現れるので下方へ引き継ぐ。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, 'r9_16.bbox.html'), 'utf8').split('<page ').slice(1);
const COL = [['cho', 520, 548], ['kojin', 548, 572], ['shudan', 572, 596], ['shoron', 596, 619], ['jitsu', 619, 645], ['gakko', 645, 690]];
const colOf = (x) => COL.find((c) => x >= c[1] && x < c[2])?.[0];
const r9 = [];
let curSchool = '';
pages.forEach((pg, pi) => {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: z(m[5]) }));
  const anchors = ws.filter((w) => w.x >= 205 && w.x < 245 && /^(男女|男|女)・\d+$/.test(w.t)).sort((a, b) => a.y - b.y);
  // 学校名: x80-135のトークンをy近接で連結
  const nameToks = ws.filter((w) => w.x >= 80 && w.x < 135 && !/^\d+$/.test(w.t)).sort((a, b) => a.y - b.y);
  const names = [];
  for (const w of nameToks) {
    const l = names[names.length - 1];
    if (l && w.y - l.y2 <= 16) { l.t += w.t; l.y2 = w.y; } else names.push({ t: w.t, y: w.y, y2: w.y });
  }
  for (const a of anchors) {
    // 同じ行のy±10にある学校名 → 更新
    const nm = names.find((n) => n.y - 12 <= a.y && a.y <= n.y2 + 12);
    if (nm) curSchool = nm.t;
    // 種目名: x140-210のトークン(行y±10)を連結
    const sport = ws.filter((w) => w.x >= 140 && w.x < 212 && Math.abs(w.y - a.y) <= 10).sort((p, q) => p.y - q.y || p.x - q.x).map((w) => w.t).join('');
    const pts = {};
    for (const w of ws.filter((w) => w.x >= 500 && w.x < 700 && w.y >= a.y - 10 && w.y <= a.y + 30 && /^\d+$/.test(w.t))) {
      const c = colOf(w.x);
      if (c && pts[c] == null) pts[c] = +w.t;
    }
    r9.push({ page: pi + 1, y: Math.round(a.y), school: curSchool, sport, cnt: a.t, pts });
  }
});
console.log('R9 種目行', r9.length);
// R8
const ts = fs.readFileSync(path.join(dir, '../../../src/data/school-selection-methods/tokyo.ts'), 'utf8');
const r8 = [];
for (const p of ts.split('    {\n      schoolName: ').slice(1)) {
  const school = (p.match(/^'([^']*)'/) || [])[1];
  const dept = (p.match(/department: '([^']*)'/) || [])[1];
  const cat = (p.match(/selectionCategory: '([^']*)'/) || [])[1];
  const ratio = (p.match(/ratioType: '([^']*)'/) || [])[1];
  if (cat !== '文化・スポーツ等特別推薦') continue;
  const m = dept.match(/^(.*?)\((男女|男|女)・(\d+)\)/);
  const num = (re) => { const q = (ratio || '').match(re); return q ? +q[1] : null; };
  r8.push({ school, dept, sport: m ? m[1] : dept, cnt: m ? `${m[2]}・${m[3]}` : '', cho: num(/調査書(\d+)点/), kojin: num(/個人面接(\d+)点/), shudan: num(/集団討論(\d+)点/), shoron: num(/小論文(\d+)点/), jitsu: num(/実技検査(\d+)点/), gakko: num(/学校設定検査(\d+)点/), ratio });
}
console.log('R8 特別推薦レコード', r8.length);
const nk = (s) => (s || '').replace(/[\s　]/g, '');
const key = (school, sport, cnt) => nk(school) + '|' + nk(sport) + '|' + cnt;
const m8 = new Map();
for (const r of r8) { const k = key(r.school, r.sport, r.cnt); if (!m8.has(k)) m8.set(k, []); m8.get(k).push(r); }
let same = 0;
const diffs = [], add = [];
for (const a of r9) {
  const cnt = z(a.cnt).replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
  const cands = m8.get(key(a.school, a.sport, cnt));
  if (!cands || !cands.length) { add.push(`${a.school}/${a.sport}/${cnt} ${JSON.stringify(a.pts)} (p${a.page})`); continue; }
  const o = cands.shift();
  const ne = ['cho', 'kojin', 'shudan', 'shoron', 'jitsu', 'gakko'].filter((k) => (o[k] ?? null) !== (a.pts[k] ?? null));
  if (ne.length) diffs.push(`${a.school}/${a.sport}/${cnt}: ` + ne.map((k) => `${k} R8=${o[k]} R9=${a.pts[k] ?? null}`).join(', ')); else same++;
}
const left8 = [...m8.values()].flat().filter(Boolean);
console.log('一致', same, '点数差', diffs.length, 'R9のみ', add.length, 'R8のみ', left8.length);
diffs.slice(0, 40).forEach((d) => console.log('  ~', d));
console.log('-- R9のみ(先頭25)'); add.slice(0, 25).forEach((d) => console.log('  +', d));
console.log('-- R8のみ(先頭25)'); left8.slice(0, 25).forEach((r) => console.log('  -', r.school, r.dept, '|', r.ratio));

