// T-Y14 ehime: data.mjs の各行を検算する。使い方: node ops/baselines/ehime-r9/check.mjs
//  ①比重の和=10(本選抜・各「文化・スポーツ活動を重視した選抜」) ②募集割合×募集定員≒募集人数(±1) ③文スポ選抜の人数表記が定員を超えない
import { EH } from './data-r9.mjs';
let bad = 0;
const sum = (w) => w.cho + w.saku + w.sho + w.men + w.shu + w.jit + w.pre;
for (const r of EH) {
  const id = r.school + ' ' + r.dept;
  if (sum(r.w) !== 10) { bad++; console.log('比重和NG', id, sum(r.w)); }
  for (const s of r.subs) if (sum(s[2]) !== 10) { bad++; console.log('文スポ比重和NG', id, sum(s[2])); }
  const exp = (r.teiin * r.wari) / 100;
  if (Math.abs(exp - r.n) > 1) { bad++; console.log('割合×定員≠人数', id, r.teiin, r.wari, r.n, '期待', exp); }
  const m = (r.subs[0]?.[1] || '').match(/(?:計)?([0-9]+)人程度/);
  if (m && Number(m[1]) > r.n) { bad++; console.log('文スポ人数が募集人数超過', id, m[1], r.n); }
}
const dupe = EH.map((r) => r.school + '|' + r.dept);
if (new Set(dupe).size !== dupe.length) { bad++; console.log('重複あり'); }
console.log('rows', EH.length, 'schools', new Set(EH.map((r) => r.school.replace(/\(.*\)/, ''))).size, '定員合計', EH.reduce((a, r) => a + r.teiin, 0), '募集人数合計', EH.reduce((a, r) => a + r.n, 0), 'bad', bad);
if (bad) process.exitCode = 1;

