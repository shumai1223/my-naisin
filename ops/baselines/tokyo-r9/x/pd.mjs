import { execFileSync } from 'child_process';
const pages = (pdf) => Array.from({ length: 39 }, (_, i) => execFileSync('pdftotext', ['-enc', 'UTF-8', '-layout', '-f', String(i + 1), '-l', String(i + 1), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 }).split('\n').map((l) => l.replace(/\s+/g, '')).filter(Boolean));
const a = pages('r8_16.pdf'), b = pages('r9_16.pdf');
const ms = (arr) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return m; };
a.forEach((x, i) => {
  const y = b[i]; const c = ms(x); const o9 = []; for (const t of y) { const n = c.get(t) || 0; if (n > 0) c.set(t, n - 1); else o9.push(t); }
  const o8 = []; for (const [t, n] of c) for (let k = 0; k < n; k++) o8.push(t);
  console.log(`p${i + 1}: R8のみ${o8.length}/R9のみ${o9.length}  (行数 ${x.length}/${y.length})`);
});
