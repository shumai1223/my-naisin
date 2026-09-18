// T-Y14 miyazaki: data.mjs の各行で 学力検査+面接+適性検査等+調査書 = 計 を検算する。使い方: node ops/baselines/miyazaki-transcription/check.mjs
import { ROWS } from './data.mjs';
let bad = 0;
for (const r of ROWS) {
  const s = (r.subj ? r.subj.reduce((a, b) => a + b, 0) : 0) + r.itv + (r.tek || 0) + r.cho;
  if (s !== r.kei) {
    bad++;
    console.log('MISMATCH', r.school, r.dept, s, r.kei);
  }
}
const sum = (c) => ROWS.filter((r) => r.course === c).reduce((a, r) => a + r.teiin, 0);
console.log('rows', ROWS.length, 'bad', bad, 'schools', new Set(ROWS.map((r) => r.school)).size, '全日制定員', sum('全日制'), '定時制定員', sum('定時制'));
