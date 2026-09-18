// T-Y14 nagasaki: data.mjs の各学科行を検算する。使い方: node ops/baselines/nagasaki-transcription/check.mjs
//  ①特別選抜の各行 調査書+面接+プレゼン=10(値が無い項目は0)  ②一般選抜 調査書+学力検査+面接=10  ③特別選抜募集定員+一般選抜募集定員=募集定員(併設中学以外の数があればそれ)
import { NG } from './data.mjs';
let bad = 0;
const near = (a, b) => Math.abs(a - b) < 1e-9;
for (const r of NG) {
  if (r.skip) continue;
  const id = r.school + ' ' + r.dept;
  for (const t of r.tk || []) {
    if (t[2] == null && t[3] == null && t[4] == null) continue; // 実施なし(-)の行
    const s = (t[2] || 0) + (t[3] || 0) + (t[4] || 0);
    if (!near(s, 10)) { bad++; console.log('特別選抜の比重NG', id, t[0], s); }
  }
  if (r.chal && !near(r.chal[0] + r.chal[1], 10)) { bad++; console.log('チャレンジ選抜の比重NG', id, r.chal); }
  if (r.gen) {
    const s = r.gen.cho + r.gen.gaku + r.gen.itv;
    if (!near(s, 10)) { bad++; console.log('一般選抜の比重NG', id, s); }
  }
}
// ③ 募集定員の検算(結合セルは grp でまとめて合計する)
const groups = new Map();
for (const r of NG) {
  if (r.skip) continue;
  const k = r.grp || r.school + '|' + r.dept;
  const g = groups.get(k) || { want: 0, have: 0, id: k };
  g.want += r.koko != null ? r.koko : r.teiin;
  g.have += (r.tkN || 0) + (r.gen && r.gen.n ? r.gen.n : 0) + (r.extra || 0);
  groups.set(k, g);
}
for (const g of groups.values()) {
  if (g.want !== g.have) { bad++; console.log('募集定員NG', g.id, '特別+一般=' + g.have, '期待' + g.want); }
}
console.log('rows', NG.length, 'schools', new Set(NG.map((r) => r.school)).size, 'bad', bad);

// --- 頁32-36 ---
import { TEI, TSUSHIN, TOTALS, RITO } from './data.mjs';
let bad4 = 0;
for (const r of RITO) {
  const s = Object.values(r.w).reduce((a, b) => a + (b || 0), 0);
  if (s !== 10) { bad4++; console.log('離島留学/美術工芸の比重NG', r.school, r.dept, s); }
}
const sumT = (a) => a.reduce((s, r) => s + r.teiin, 0);
const zenRows = NG.filter((r) => !r.skip && !r.course);
const kenritsu = sumT(zenRows.filter((r) => !r.school.includes('(市立)')));
const shiritsu = sumT(zenRows.filter((r) => r.school.includes('(市立)')));
// 括弧付き(20)の離島留学3件(壱岐東アジア・五島スポーツ・五島南夢トライ)は募集定員の合計に数えない。対馬 国際文化交流40は数える
const tsushima = NG.find((r) => r.school === '対馬' && r.dept === '国際文化交流').teiin;
const checks = [
  ['全日制 県立', kenritsu + tsushima, TOTALS.kenritsu],
  ['全日制 公立', kenritsu + tsushima + shiritsu, TOTALS.koritsu],
  ['定時制 昼間部', sumT(NG.filter((r) => r.course)), TOTALS.teijiChukan],
  ['定時制 夜間部', TEI.reduce((s, r) => s + r.teiin, 0), TOTALS.teijiYakan],
  ['定時制 夜間部Ⅰ期', TEI.reduce((s, r) => s + r.n1, 0), TOTALS.teijiYakanI],
  ['通信制', TSUSHIN.reduce((s, r) => s + r[2], 0), TOTALS.tsushin],
];
for (const [n, have, want] of checks) {
  const ok = have === want;
  if (!ok) bad4++;
  console.log(ok ? 'OK ' : 'NG ', n, '転記=' + have, '資料=' + want);
}
console.log('離島留学/美術工芸', RITO.length, '件 bad', bad4);
if (bad4) process.exitCode = 1;
