// 栃木 令和9年度「入試情報」等(全日制・頁1〜3)を pdftotext -bbox から (学校・学科・男女・特色の比重3値・一般の比重2値・特色定員割合・学校独自検査の○・自己表現シート・傾斜配点) に抽出する。
// node extract.mjs > rows.json   (joho.pdf が必要)。検証結果は stderr。
import { execFileSync } from 'child_process';
import fs from 'fs';
const z = (s) => s.normalize('NFKC');
const pageWords = (p) => {
  const h = execFileSync('pdftotext', ['-bbox', '-f', String(p), '-l', String(p), 'joho.pdf', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 });
  return [...h.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x0: +m[1], x1: +m[3], x: (+m[1] + +m[3]) / 2, y: (+m[2] + +m[4]) / 2, t: z(m[5]) }));
};
const NUMCOL = [['tokuGaku', 175], ['tokuCho', 203], ['tokuDoku', 231], ['ippanGaku', 260], ['ippanCho', 288]];
const CIRCLE = [['kojin', 349], ['shudan', 371], ['presen', 393], ['group', 414], ['jiko', 458]];
const nearest = (cols, x, tol) => { let best = null; for (const [k, cx] of cols) { const d = Math.abs(cx - x); if (d <= tol && (!best || d < best.d)) best = { k, d }; } return best && best.k; };
const rows = [];
let school = '';
for (const p of [1, 2, 3]) {
  const ws = pageWords(p);
  const anchors = ws.filter((w) => /^(男女|男|女)$/.test(w.t) && w.x > 138 && w.x < 162).sort((a, b) => a.y - b.y);
  for (const a of anchors) {
    const band = ws.filter((w) => Math.abs(w.y - a.y) < 9);
    const nameWs = band.filter((w) => w.x > 62 && w.x < 114).sort((p1, p2) => p1.x - p2.x);
    if (nameWs.length) school = nameWs.map((w) => w.t).join('').replace(/\s/g, '');
    const dept = band.filter((w) => w.x >= 114 && w.x < 140).sort((p1, p2) => p1.x - p2.x).map((w) => w.t).join('').replace(/\s/g, '');
    const r = { page: p, y: Math.round(a.y), school, dept, gender: a.t, circles: [] };
    for (const w of band) {
      if (/^\d+%$/.test(w.t) && w.x > 300 && w.x < 340) { r.ratio = +w.t.replace('%', ''); continue; }
      if (/^\d+$/.test(w.t) && w.x > 150 && w.x < 300) { const k = nearest(NUMCOL, w.x, 18); if (k) r[k] = +w.t; continue; }
      if (w.t === '○') { const k = nearest(CIRCLE, w.x, 12); if (k) r.circles.push(k); continue; }
      if (w.x > 490 && /[国数英社理]/.test(w.t)) r.keihai = w.t;
    }
    rows.push(r);
  }
}
// 検証
const bad = [];
for (const r of rows) {
  const miss = ['tokuGaku', 'tokuCho', 'tokuDoku', 'ippanGaku', 'ippanCho', 'ratio'].filter((k) => r[k] == null);
  if (miss.length) bad.push(`${r.school}/${r.dept} 欠落: ${miss.join(',')}`);
  if (r.tokuGaku !== 500 || r.ippanGaku !== 500) bad.push(`${r.school}/${r.dept} 学力点が500でない: ${r.tokuGaku}/${r.ippanGaku}`);
  if (!r.school || !r.dept) bad.push(`p${r.page} y${r.y} 学校/学科名が空`);
}
console.error('行数', rows.length, '学校数', new Set(rows.map((r) => r.school)).size, '問題', bad.length);
bad.forEach((b) => console.error('  !', b));
fs.writeFileSync('rows.json', JSON.stringify(rows, null, 1));
