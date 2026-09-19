// T-Y14 oita R9: 推薦入学者選抜の学校・学科別PDF(88本)を bbox 座標で読み、学校・学科・調査書点基準・募集人員・比重(%)を抽出して R8転記と突合する。
// 頁1=推薦要件/調査書点に係る基準/募集人員(値はx>=160)、頁2=選抜の資料と比重(資料名 x70-130・比重 x175-205・評価の観点 x>=230)。
// 使い方: 各PDFを NN.pdf として置き pdftotext -bbox で NN.bbox.html を作る(pdf-list.tsv=通番→URL→ラベル) → node build2.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROWS as R8 } from '../oita-transcription/data.mjs';
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
for (const [no, , label] of list) {
  const n = String(no).padStart(2, '0');
  const pgs = load(n);
  const p1 = pgs[0], p2 = pgs[1] || [];
  const school = (p1.map((w) => w.t).join('').match(/大分県立(.+?)高等学校/) || [])[1] || '';
  const deptTok = p1.filter((w) => w.y > 100 && w.y < 125 && w.x > 440).map((w) => w.t).join('');
  // 頁1: ラベル位置(調査書点に=y, 募集人員=y)。値は x>=160。最初の2ブロック(推薦型/自己推薦型)を分けて拾う
  const lab = (t) => p1.filter((w) => w.x > 80 && w.x < 140 && w.t === t).sort((a, b) => a.y - b.y);
  const kLab = lab('調査書点に'), nLab = lab('募集人員');
  const val = (y0, y1) => rowsOf(p1.filter((w) => w.x >= 160 && w.y >= y0 && w.y < y1)).map((r) => r.w.map((w) => w.t).join('')).join(' ');
  const blocks = [];
  for (let i = 0; i < Math.max(kLab.length, nLab.length); i++) {
    const ky = kLab[i]?.y, ny = nLab[i]?.y;
    if (ny == null) continue;
    const nextK = kLab[i + 1]?.y ?? 9999;
    blocks.push({ kijun: ky != null ? val(ky - 12, ny - 8) : '', nin: val(ny - 12, Math.min(nextK - 40, ny + 90, 780)) });
  }
  // 頁2: 比重の行(資料名の後ろのNN) — 上のブロック(自己推薦を必要としない側)と下のブロックを y で分ける(下は y>350)
  const hij = [];
  const LAB = /^(調査書・推薦書|推薦書・調査書|調査書|面接の結果|面接|小論文の結果|小論文|適性検査の結果|適性検査|作文の結果|作文|実技検査の結果|実技検査|活動報告書|推薦書)$/;
  const labs = p2.filter((w) => w.x > 70 && w.x < 140 && LAB.test(w.t));
  const nums = p2.filter((w) => w.x > 165 && w.x < 220 && /^\d+(\.\d+)?$/.test(w.t));
  for (const l of labs.sort((p, q) => p.y - q.y)) {
    const cand = nums.filter((w) => Math.abs(w.y - l.y) <= 8).sort((p, q) => Math.abs(p.y - l.y) - Math.abs(q.y - l.y))[0];
    if (cand) hij.push([l.t.replace(/の結果$/, ''), +cand.t, Math.round(l.y)]);
  }
  out.push({ no: n, label, school, dept: deptTok, blocks, hij, sum: Math.round(hij.reduce((a, b) => a + b[1], 0) * 10) / 10 });
}
fs.writeFileSync(path.join(dir, 'rows-r9.json'), JSON.stringify(out, null, 1));
console.log('R9', out.length, '/ 比重合計≠100', out.filter((r) => Math.abs(r.sum - 100) > 0.3).map((r) => r.no + ':' + r.sum).join(', ') || 'なし');
const nk = (s) => (s || '').normalize('NFKC').replace(/[\s()（）]/g, '');
let same = 0;
const diffs = [];
for (const r of out) {
  const o = R8.find((x) => x.no === r.no);
  if (!o) { diffs.push(`${r.no} R8に該当番号なし ${r.school}/${r.dept}`); continue; }
  const msgs = [];
  const h8 = JSON.stringify(o.hijuu.map((h) => [h[0].replace(/の結果$/, ''), h[1]]));
  const h9 = JSON.stringify(r.hij.map((h) => [h[0], h[1]]));
  if (h8 !== h9) msgs.push(`比重 R8=${h8} R9=${h9}`);
  const nums = (s) => (nk(s).match(/\d+/g) || []).join(',');
  const b0 = r.blocks[0] || { kijun: '', nin: '' };
  if (nums(o.nin) !== nums(b0.nin)) msgs.push(`募集人員 R8=${o.nin} R9=${b0.nin}`);
  if (nums(o.kijun) !== nums(b0.kijun)) msgs.push(`基準 R8=${o.kijun} R9=${b0.kijun}`);
  if (msgs.length) diffs.push(`${r.no} ${r.school}/${r.dept}: ` + msgs.join(' | ')); else same++;
}
console.log('一致', same, '差分', diffs.length);
diffs.slice(0, 60).forEach((d) => console.log(' ', d.slice(0, 400)));
