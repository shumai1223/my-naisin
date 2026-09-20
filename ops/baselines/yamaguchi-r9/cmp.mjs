// r9rows.mjs の転記表と yamaguchi.ts(R8)の各(学校,学科)のnoteを比較し、差のある行だけ出す
import fs from 'fs';
import { ROWS } from './r9rows.mjs';
const s = fs.readFileSync('C:/Users/E24054/my-naisin/src/data/school-selection-methods/yamaguchi.ts', 'utf8').split('\r\n').join('\n');
const re = /schoolName: '([^']*)',\n      department: '([^']*)',\n      selectionCategory: '([^']*)',\n      interviewRequired: (\w+),\n      note: '([^']*)'/g;
let m; const pairs = []; const map = new Map();
while ((m = re.exec(s))) { const k = m[1] + '|' + m[2]; if (!map.has(k)) { map.set(k, {}); pairs.push(k); } map.get(k)[m[3]] = { iv: m[4], note: m[5] }; }
console.log('pairs', pairs.length, 'rows', ROWS.length);
pairs.forEach((k, i) => {
  const r = ROWS[i]; const d = map.get(k); const t = d['特色選抜']?.note ?? ''; const f = d['第一次募集']?.note ?? '';
  const oldPct = /募集人員(\d+)%/.exec(t)?.[1] ?? null;
  const oldMark = /面接\((◎|○)/.exec(t)?.[1] ?? null;
  const oldTest = /学校独自検査:([^。]+)/.exec(t)?.[1] ?? null;
  const oldS2 = f.startsWith('面接を実施') ? '○' : '';
  const oldChosa = /調査書等による選抜(\d+)%/.exec(f)?.[1] ?? null;
  const diffs = [];
  if ((r.pct ? String(r.pct) : null) !== oldPct) diffs.push(`募集${oldPct}→${r.pct}`);
  if ((r.iv ?? null) !== oldMark) diffs.push(`面接${oldMark}→${r.iv}`);
  if ((r.test ?? null) !== oldTest) diffs.push(`独自${oldTest}→${r.test}`);
  if (r.s2 !== oldS2) diffs.push(`一次面接${oldS2 || '-'}→${r.s2 || '-'}`);
  if ((r.chosa ? String(r.chosa) : null) !== oldChosa) diffs.push(`調査書${oldChosa}→${r.chosa}`);
  if (diffs.length) console.log(`${i + 1} ${k}: ${diffs.join(' / ')}`);
});
