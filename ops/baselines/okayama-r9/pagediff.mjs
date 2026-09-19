// R8/R9 の各頁を pdftotext -raw で取り、空白除去した行の多重集合差を頁別に出す: node pagediff.mjs
import { execFileSync } from 'child_process';
const get = (pdf, p) => execFileSync('pdftotext', ['-raw', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split('\n').map((l) => l.replace(/\s+/g, '')).filter(Boolean);
for (let p = 1; p <= 7; p++) {
  const a = get('r8.pdf', p), b = get('r9.pdf', p);
  const cnt = new Map();
  for (const l of a) cnt.set(l, (cnt.get(l) || 0) + 1);
  const only9 = [];
  for (const l of b) { const c = cnt.get(l) || 0; if (c > 0) cnt.set(l, c - 1); else only9.push(l); }
  const only8 = [];
  for (const [l, c] of cnt) for (let i = 0; i < c; i++) only8.push(l);
  console.log(`== 頁${p}: R8のみ ${only8.length} / R9のみ ${only9.length}`);
  if (process.argv[2] === String(p)) { console.log('-- R8のみ'); only8.forEach((l) => console.log('  <', l)); console.log('-- R9のみ'); only9.forEach((l) => console.log('  >', l)); }
}
