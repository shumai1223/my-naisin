// T-Y14 wakayama: data-b1.mjs の各行で 調査書+学力検査+面接実技 = 100% を検算する。使い方: node ops/baselines/wakayama-transcription/check.mjs
import { B1 } from './data-b1.mjs';
let bad = 0;
for (const r of B1) {
  const s = r.cho + r.gaku + (r.itv || 0);
  if (s !== 100) { bad++; console.log('NG', r.school, r.dept, s); }
}
const schools = new Set(B1.map((r) => r.school));
console.log('rows', B1.length, 'schools', schools.size, '全日制', B1.filter((r) => r.course === '全日制').length, '定時制', B1.filter((r) => r.course === '定時制').length, 'bad', bad);
