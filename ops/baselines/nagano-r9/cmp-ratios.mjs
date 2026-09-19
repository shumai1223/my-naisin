// T-Y14 nagano R9 差分検出: R9 PDF(pdftotext -layout済み .txt)の「比重」行から比重列を抽出し、
// 現行nagano.ts(R8)のratioType列と順序で突合する。学科の増減・比重の変更がある区画を絞り込むための補助。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const ts = fs.readFileSync(path.join(dir, '../../../src/data/school-selection-methods/nagano.ts'), 'utf8');
const r8 = [...ts.matchAll(/\{ schoolName: '([^']*)', department: '([^']*)', selectionCategory: '([^']*)', interviewRequired: (true|false), ratioType: '([^']*)'/g)].map((m) => ({
  school: m[1], dept: m[2], cat: m[3], ratio: m[5],
}));
console.log('R8 records:', r8.length);

for (const f of ['r9-2-01', 'r9-2-02', 'r9-2-03', 'r9-2-04', 'r9-2-05', 'r9-2-06']) {
  const lines = fs.readFileSync(path.join(dir, f + '.txt'), 'utf8').split('\n');
  const rows = [];
  lines.forEach((ln, i) => {
    if (!/比重/.test(ln)) return;
    if (/^\s*番号/.test(ln)) return;
    let after = ln.slice(ln.indexOf('比重') + 2);
    let toks = after.trim().split(/\s+/).filter((t) => /^(\d+|-|―|ー)$/.test(t));
    // 数値が「比重」行より上の行に単独で現れる版面(スポーツ科学の40等)
    if (toks.length < 5) {
      const prev = lines[i - 1] ?? '';
      const pt = prev.trim().split(/\s+/).filter((t) => /^(\d+|-)$/.test(t));
      if (pt.length && pt.length + toks.length <= 5) toks = [...pt, ...toks];
    }
    rows.push({ line: i + 1, toks });
  });
  console.log(f, 'rows:', rows.length);
  console.log(rows.map((r) => `${r.line}:${r.toks.join('/')}`).join('  '));
}
