// T-Y14 mie: data-b4.mjs の各行の印(5文字)の形式と、◎が1つ以上あること(=最終段階で特に重視する資料が示されていること)を検算する。
// 使い方: node ops/baselines/mie-transcription/check.mjs
import { B4 } from './data-b4.mjs';
let bad = 0;
for (const r of B4) {
  if (![...r.marks].every((c) => '◎○-'.includes(c)) || [...r.marks].length !== 5) { bad++; console.log('形式NG', r.school, r.dept, r.marks); }
  if (!r.marks.includes('◎')) { bad++; console.log('◎なし', r.school, r.dept); }
  if (!r.txt) { bad++; console.log('補足文なし', r.school, r.dept); }
}
const schools = new Set(B4.map((r) => r.school));
console.log('rows', B4.length, 'schools', schools.size, '全日制', B4.filter((r) => r.course === '全日制').length, '定時制', B4.filter((r) => r.course === '定時制').length, 'bad', bad);
