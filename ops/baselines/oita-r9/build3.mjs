// T-Y14 oita R9: 推薦入学者選抜88PDFを bbox 座標から R8 の ROWS 形式(no, school, dept, kijun, nin, hijuu, memo, alt)へ抽出し data-r9.mjs を書く。
// 頁1: 学校名(大分県立◯◯高等学校)・学科名・『調査書点に係る基準』『募集人員』(値はx>=160)。頁2: 比重(x165-220の数字)とその左(x70-135)の資料名。
// 比重の合計が100(自己推薦型を別表で持つ学校は100+100)になることを検算する。
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
  const head = p1.filter((w) => w.y > 80 && w.y < 100).map((w) => w.t).join('');
  const school = (head.match(/大分県立(.+?)高等学校/) || [])[1] || '';
  const dept = p1.filter((w) => w.y > 100 && w.y < 125 && w.x > 440).map((w) => w.t).join('');
  const lab = (t) => p1.filter((w) => w.x > 80 && w.x < 140 && w.t === t).sort((a, b) => a.y - b.y);
  const kLab = lab('調査書点に'), nLab = lab('募集人員');
  const val = (y0, y1) => rowsOf(p1.filter((w) => w.x >= 160 && w.y >= y0 && w.y < y1)).map((r) => r.w.map((w) => w.t).join('')).join(' ');
  const blocks = [];
  for (let i = 0; i < nLab.length; i++) {
    const ny = nLab[i].y, ky = kLab[i]?.y;
    const nextK = kLab[i + 1]?.y ?? 9999;
    blocks.push({ kijun: ky != null ? val(ky - 12, ny - 8) : '', nin: val(ny - 12, Math.min(nextK - 40, ny + 90, 780)) });
  }
  // 比重: 数字(x165-220・y>90)ごとに、左(x70-135)で前の数字のyより下〜今の数字のy+12までの資料名を連結
  const nums = p2.filter((w) => w.x > 165 && w.x < 220 && w.y > 90 && /^\d+(\.\d+)?$/.test(w.t)).sort((a, b) => a.y - b.y);
  const hij = [];
  nums.forEach((nm, i) => {
    const prevY = i ? nums[i - 1].y : 80;
    const labels = p2.filter((w) => w.x > 70 && w.x < 140 && w.y > prevY + 8 && w.y <= nm.y + 12).sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join('');
    hij.push([labels, +nm.t]);
  });
  // 合計100ごとに表を分割
  const groups = [];
  let cur = [], acc = 0;
  for (const h of hij) {
    cur.push(h); acc += h[1];
    if (Math.abs(acc - 100) < 0.3) { groups.push(cur); cur = []; acc = 0; }
  }
  if (cur.length) groups.push(cur);
  const sums = groups.map((g) => Math.round(g.reduce((a, b) => a + b[1], 0) * 10) / 10);
  if (sums.some((s) => Math.abs(s - 100) > 0.3) || !groups.length) bad.push(`${n}:${sums.join('+') || 'なし'}`);
  out.push({ no: n, label, school, dept, kijun: blocks[0]?.kijun ?? '', nin: blocks[0]?.nin ?? '', kijun2: blocks[1]?.kijun ?? '', nin2: blocks[1]?.nin ?? '', hijuu: groups[0] ?? [], hijuu2: groups[1] ?? [] });
}
fs.writeFileSync(path.join(dir, 'rows-r9.json'), JSON.stringify(out, null, 1));
console.log('R9', out.length, '/ 比重表の合計が100でない:', bad.join(', ') || 'なし');
console.log('学校名が空:', out.filter((r) => !r.school).map((r) => r.no).join(',') || 'なし', '/ 学科名が空:', out.filter((r) => !r.dept).map((r) => r.no).join(',') || 'なし', '/ 募集人員が空:', out.filter((r) => !r.nin).map((r) => r.no).join(',') || 'なし', '/ 基準が空:', out.filter((r) => !r.kijun).map((r) => r.no).join(',') || 'なし', '/ 第2ブロックあり:', out.filter((r) => r.nin2 || r.hijuu2.length).map((r) => r.no).join(',') || 'なし');
