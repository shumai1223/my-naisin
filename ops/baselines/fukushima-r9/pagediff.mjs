// node pagediff.mjs [キー(NN校名)の一部]  福島 R8/R9 を学校番号+校名ごと(全頁連結)に、数値トークン多重集合と行多重集合で比較
import { execFileSync } from 'child_process';
const KEYRE = /(\d\d)_?([^\d\/／（(【]+(?:[（(【][^）)】]*[）)】])?)\d[\/／]\d$/;
const load = (pdf) => {
  const n = +/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [pdf], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'] }))[1];
  const out = new Map();
  for (let p = 1; p <= n; p++) {
    const t = execFileSync('pdftotext', ['-enc','UTF-8','-layout','-f',String(p),'-l',String(p),pdf,'-'], { encoding: 'utf8', stdio: ['ignore','pipe','ignore'], maxBuffer: 1<<26 }).split('\n');
    const lines = t.map(l => l.replace(/\s+/g,'')).filter(l => l && !KEYRE.test(l) && !/^[0-9０-９]{1,2}$/.test(l) && !/^学校番号/.test(l));
    let key = null;
    for (const l of t) { const m = KEYRE.exec(l.replace(/\s+/g,'')); if (m) { key = m[2].replace(/（[^）]*）|【[^】]*】|\([^)]*\)/g,'').replace(/^郡山北工$/,'郡山北工業').replace(/^11月変更）$/,''); if (!key) continue; break; } }
    if (!key) continue;
    const cur = out.get(key);
    if (cur) { cur.lines.push(...lines); cur.text += lines.join(''); cur.pages.push(p); } else out.set(key, { pages:[p], lines, text: lines.join('') });
  }
  return out;
};
const a = load('r8.pdf'), b = load('r9.pdf');
const want = process.argv[2];
const ms = (arr) => { const m = new Map(); for (const x of arr) m.set(x,(m.get(x)||0)+1); return m; };
const diff = (x, y) => { const c = ms(x); const o9 = []; for (const t of y) { const n = c.get(t)||0; if (n>0) c.set(t,n-1); else o9.push(t); } const o8 = []; for (const [t,n] of c) for (let i=0;i<n;i++) o8.push(t); return [o8,o9]; };
let changed = 0;
for (const [k, v] of b) {
  const u = a.get(k);
  if (!u) continue;
  const [n8, n9] = diff(u.text.match(/\d+/g)||[], v.text.match(/\d+/g)||[]);
  const [l8, l9] = diff(u.lines, v.lines);
  if (n8.length || n9.length) changed++;
  if (true) console.log(`[${k}] R8頁${u.pages} R9頁${v.pages} 数値 R8のみ[${n8}] R9のみ[${n9}] 行差 ${l8.length}/${l9.length}`);
  if (true) { l8.forEach(l=>console.log('  <', l.slice(0,220))); l9.forEach(l=>console.log('  >', l.slice(0,220))); }
}
console.log('R8校', a.size, 'R9校', b.size, '数値差あり', changed);
console.log('R9のみ:', [...b.keys()].filter(k=>!a.has(k)).join(' ')); console.log('R8のみ:', [...a.keys()].filter(k=>!b.has(k)).join(' '));
