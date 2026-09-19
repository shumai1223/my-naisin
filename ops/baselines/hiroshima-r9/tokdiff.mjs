// R8(r8.pdf)とR9(r9list.pdf)の実施内容一覧表を頁別に pdftotext -raw → 空白区切りトークンの多重集合で比較する
// node tokdiff.mjs [頁]  (頁を指定するとトークン差を全部出す)
import { execFileSync } from 'child_process';
const get = (pdf, p) => execFileSync('pdftotext', ['-raw', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).split(/\s+/).filter(Boolean);
const norm = (t) => t.replace('令和８年度', '令和X年度').replace('令和９年度', '令和X年度');
for (let p = 1; p <= 8; p++) {
  const a = get('r8.pdf', p).map(norm), b = get('r9list.pdf', p).map(norm);
  const cnt = new Map();
  for (const t of a) cnt.set(t, (cnt.get(t) || 0) + 1);
  const cnt9 = new Map();
  for (const t of b) cnt9.set(t, (cnt9.get(t) || 0) + 1);
  const keys = new Set([...cnt.keys(), ...cnt9.keys()]);
  const diffs = [];
  for (const k of keys) { const x = cnt.get(k) || 0, y = cnt9.get(k) || 0; if (x !== y) diffs.push(`${k}: R8=${x} R9=${y}`); }
  console.log(`== 頁${p}: R8トークン ${a.length} / R9トークン ${b.length} / 種別差 ${diffs.length}`);
  if (process.argv[2] === String(p)) diffs.forEach((d) => console.log('   ', d));
}
