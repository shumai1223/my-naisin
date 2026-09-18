// T-Y14 oita: data.mjs の全行を検算する。使い方: node ops/baselines/oita-transcription/check.mjs
//  ・比重の合計が100%(端数丸めの±0.2まで許容)
//  ・alt(志望学科等で比重が異なる場合)も同様
//  ・通番が01〜88で重複・欠番なし
import { ROWS } from './data.mjs';
let bad = 0;
const sum = (h) => Math.round(h.reduce((a, x) => a + x[1], 0) * 10) / 10;
for (const r of ROWS) {
  const s = sum(r.hijuu);
  if (Math.abs(s - 100) > 0.2) { bad++; console.log('比重合計NG', r.no, r.school, r.dept, s); }
  if (r.alt) {
    const a = sum(r.alt.hijuu);
    if (Math.abs(a - 100) > 0.2) { bad++; console.log('alt比重合計NG', r.no, r.school, r.dept, a); }
  }
}
const nos = ROWS.map((r) => r.no);
for (let i = 1; i <= 88; i++) {
  const k = String(i).padStart(2, '0');
  const c = nos.filter((n) => n === k).length;
  if (c !== 1) { bad++; console.log('通番NG', k, c); }
}
const schools = new Set(ROWS.map((r) => r.school));
console.log('rows', ROWS.length, 'schools', schools.size, 'bad', bad);
