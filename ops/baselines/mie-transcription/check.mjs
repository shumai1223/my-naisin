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

// --- スポーツ特別枠(data-b5.mjs・別表5) ---
import { B5 } from './data-b5.mjs';
const b5Total = B5.reduce((a, e) => a + e.depts.reduce((b, d) => b + d[1], 0), 0);
console.log('スポーツ特別枠 行', B5.length, '校', new Set(B5.map((e) => e.school)).size, '募集人数合計(人以内)', b5Total, '空欄', B5.filter((e) => !e.depts.length || e.depts.some((d) => !(d[1] > 0))).length);
