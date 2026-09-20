// 青森 R8/R9 の地区別分割版PDF(1校1頁)を pdftotext -raw で頁ごとに取り、先頭行(校名+学科)をキーに R8/R9 を突合。
// 空白除去した行の多重集合差を校ごとに出す。node schooldiff.mjs [校名の一部]  (指定すると差分行を全部出す)
import { execFileSync } from 'child_process';
const AREAS = ['tosei', 'seihokugo', 'chuunan', 'kamitosan', 'shimokita', 'sanpachi'];
const pages = (pdf) => {
  const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))[1];
  const out = [];
  for (let p = 1; p <= n; p++) {
    const t = execFileSync('pdftotext', ['-raw', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').map((l) => l.replace(/\s+/g, '')).filter(Boolean);
    out.push({ p, key: (t[0] || '').replace(/[　]/g, ''), lines: t });
  }
  return out;
};
const want = process.argv[2];
let total = 0, changed = 0;
for (const a of AREAS) {
  const p8 = pages(`r8-${a}.pdf`), p9 = pages(`r9-${a}.pdf`);
  const m8 = new Map(p8.map((x) => [x.key, x]));
  const m9 = new Map(p9.map((x) => [x.key, x]));
  console.log(`== ${a}: R8 ${p8.length}頁 / R9 ${p9.length}頁`);
  for (const [k, y] of m9) {
    total++;
    const x = m8.get(k);
    if (!x) { console.log(`  [R9のみ] ${k} (p${y.p})`); changed++; continue; }
    const cnt = new Map();
    for (const l of x.lines) cnt.set(l, (cnt.get(l) || 0) + 1);
    const only9 = [];
    for (const l of y.lines) { const c = cnt.get(l) || 0; if (c > 0) cnt.set(l, c - 1); else only9.push(l); }
    const only8 = [];
    for (const [l, c] of cnt) for (let i = 0; i < c; i++) only8.push(l);
    if (only8.length || only9.length) {
      changed++;
      console.log(`  [差分] ${k}: R8のみ${only8.length}行 / R9のみ${only9.length}行`);
      if (want && k.includes(want)) { only8.forEach((l) => console.log('     <', l)); only9.forEach((l) => console.log('     >', l)); }
    }
  }
  for (const [k, x] of m8) if (!m9.has(k)) { console.log(`  [R8のみ] ${k} (p${x.p})`); changed++; }
}
console.log('校(頁)', total, '差分あり', changed);
