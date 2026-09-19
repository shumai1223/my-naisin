// T-Y14 oita R9: 推薦入学者選抜88PDF → rows-r9.json(build3の改良版)。
// 比重の列位置はPDFごとに違う(見出し『比重(%)』のxを基準にx-30〜x+110の数字を拾う)。『【活動指定あり】40』『【活動指定なし・志望学科】50』のように
// 活動指定別に比重が分かれる行は [prefix, 値] を併記し、prefixごとに 共通の行+そのprefixの行 の合計が100になることを検算する。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const list = fs.readFileSync(path.join(dir, 'pdf-list.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('\t'));
const load = (n) => fs.readFileSync(path.join(dir, n + '.bbox.html'), 'utf8').split('<page ').slice(1).map((pg) => [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: z(m[5]) })));
const rowsOf = (ws) => {
  const rows = [];
  for (const w of [...ws].sort((a, b) => a.y - b.y || a.x - b.x)) {
    const r = rows.find((r) => Math.abs(r.y - w.y) < 2.5);
    if (r) r.w.push(w); else rows.push({ y: w.y, w: [w] });
  }
  return rows.map((r) => ({ y: r.y, w: r.w.sort((a, b) => a.x - b.x) }));
};
const out = [];
const bad = [];
for (const [no, , label] of list) {
  const n = String(no).padStart(2, '0');
  const pgs = load(n);
  const p1 = pgs[0], p2 = pgs[1] || [];
  // 頁1: 学校名・学科名
  const p1text = rowsOf(p1.filter((w) => w.y < 130)).map((r) => r.w.map((w) => w.t).join(''));
  const school = ((p1text.join('\n').match(/大分県立(.+?)高等学校(?!入学)/) || [])[1] || '').replace(/^.*入学者選抜について/, '');
  const dl = p1.find((w) => w.t === '学科名' && w.y < 130);
  const dept = dl ? p1.filter((w) => Math.abs(w.y - dl.y) < 3 && w.x > dl.x + 20).sort((a, b) => a.x - b.x).map((w) => w.t).join('') : '';
  const lab = (t) => p1.filter((w) => w.x > 80 && w.x < 140 && w.t === t).sort((a, b) => a.y - b.y);
  const kLab = lab('調査書点に'), nLab = lab('募集人員');
  const val = (y0, y1) => rowsOf(p1.filter((w) => w.x >= 160 && w.y >= y0 && w.y < y1)).map((r) => r.w.map((w) => w.t).join('')).join(' ');
  const blocks = [];
  for (let i = 0; i < nLab.length; i++) {
    const ny = nLab[i].y, ky = kLab[i]?.y;
    const nextK = kLab[i + 1]?.y ?? 9999;
    blocks.push({ kijun: ky != null ? val(ky - 12, ny - 8) : '', nin: val(ny - 12, Math.min(nextK - 40, ny + 90, 780)) });
  }
  // 頁2: 比重
  const hd = p2.find((w) => /^比重/.test(w.t) && w.y < 110);
  const hx = hd ? hd.x : 187, hy = hd ? hd.y : 60;
  const NUMRE = /^(\d+(?:\.\d+)?)$/;
  const PREF = /^【[^】]*】$/;
  const PREFNUM = /^(【[^】]*】)(\d+(?:\.\d+)?)$/;
  const normP = (t) => t.replace(/のみ】$/, '】');
  const cells = [];
  for (const w of p2.filter((w) => w.y > hy + 10 && w.x > hx - 60 && w.x < hx + 110)) {
    let m;
    const far = w.x >= hx + 50;
    if (far && !p2.some((q) => PREF.test(q.t) && q.x < w.x && q.x > hx - 60 && Math.abs(q.y - w.y) <= 12) && !PREFNUM.test(w.t)) continue;
    if (NUMRE.test(w.t)) cells.push({ y: w.y, x: w.x, v: +w.t, prefix: '' });
    else if ((m = w.t.match(PREFNUM))) cells.push({ y: w.y, x: w.x, v: +m[2], prefix: normP(m[1]) });
  }
  // 数字の直前にある『【…】』トークン(別トークン)を prefix として付与
  for (const c of cells) {
    if (c.prefix) continue;
    const pf = p2.filter((w) => PREF.test(w.t) && w.x < c.x && w.x > hx - 40 && Math.abs(w.y - c.y) <= 12).sort((a, b) => Math.abs(a.y - c.y) - Math.abs(b.y - c.y))[0];
    if (pf) c.prefix = normP(pf.t);
    else {
      // 『及び』等で折り返した prefix(【志望学科】が別行)も拾う
      const pf2 = p2.filter((w) => PREF.test(w.t) && w.x < c.x && w.x > hx - 60 && w.y < c.y && c.y - w.y <= 40).sort((a, b) => b.y - a.y)[0];
      if (pf2 && cells.filter((k) => k !== c && Math.abs(k.y - c.y) < 30).length >= 0 && /指定|志望/.test(pf2.t)) c.prefix = normP(pf2.t);
    }
  }
  // 資料名(x70-140)のクラスタ
  const labToks = p2.filter((w) => w.x > 70 && w.x < 145 && w.y > hy + 10 && !/^[中学校長の推薦を必要とする自己型入者選抜な]$/.test(w.t)).sort((a, b) => a.y - b.y);
  const clus = [];
  for (const w of labToks) {
    const l = clus[clus.length - 1];
    if (l && w.y - l.y2 <= 14) { l.t += w.t; l.y2 = w.y; l.ys.push(w.y); } else clus.push({ t: w.t, y2: w.y, ys: [w.y] });
  }
  clus.forEach((c) => (c.c = c.ys.reduce((a, b) => a + b, 0) / c.ys.length));
  const tabs = [[]];
  let firstLab = null, firstY = null;
  for (const c of [...cells].sort((p, q) => p.y - q.y || p.x - q.x)) {
    const cl = clus.reduce((bb, x) => (Math.abs(x.c - c.y) < Math.abs(bb.c - c.y) ? x : bb), clus[0]);
    if (!cl) continue;
    if (firstLab == null) { firstLab = cl.t; firstY = c.y; }
    else if (cl.t === firstLab && c.y - firstY > 60 && !tabs[tabs.length - 1].some((e) => e.lab === cl.t && e.y > firstY + 60)) { tabs.push([]); }
    tabs[tabs.length - 1].push({ lab: cl.t, y: c.y, prefix: c.prefix, v: c.v });
  }
  const hij = tabs.map((t) => { const m = new Map(); for (const e of t) { if (!m.has(e.lab)) m.set(e.lab, []); m.get(e.lab).push([e.prefix, e.v]); } return [...m.entries()]; });
  const sums = [];
  for (const tb of hij) {
    const prefixes = [...new Set(tb.flatMap(([, v]) => v.map((x) => x[0]).filter(Boolean)))];
    const total = (P) => Math.round(tb.reduce((acc, [, v]) => acc + (v.find((x) => x[0] === P)?.[1] ?? v.find((x) => !x[0])?.[1] ?? 0), 0) * 10) / 10;
    (prefixes.length ? prefixes : ['']).forEach((P) => sums.push(total(P)));
  }
  const okSum = sums.length > 0 && sums.every((v) => Math.abs(v - 100) < 0.3);
  if (!okSum || !hij.length) bad.push(`${n}:${sums.join('/')}`);
  out.push({ no: n, label, school, dept, kijun: blocks[0]?.kijun ?? '', nin: blocks[0]?.nin ?? '', kijun2: blocks[1]?.kijun ?? '', nin2: blocks[1]?.nin ?? '', hijuu: hij[0] ?? [], hijuu2: hij[1] ?? [] });
}
fs.writeFileSync(path.join(dir, 'rows-r9.json'), JSON.stringify(out, null, 1));
console.log('R9', out.length, '/ 比重の合計が100(or 200)でない:', bad.join(', ') || 'なし');
console.log('学校名空:', out.filter((r) => !r.school).map((r) => r.no).join(',') || 'なし', '/ 学科名空:', out.filter((r) => !r.dept).map((r) => r.no + '(' + r.label.split('_')[2] + ')').join(',') || 'なし', '/ 募集人員空:', out.filter((r) => !r.nin).map((r) => r.no).join(',') || 'なし', '/ 基準空:', out.filter((r) => !r.kijun).map((r) => r.no).join(',') || 'なし');

