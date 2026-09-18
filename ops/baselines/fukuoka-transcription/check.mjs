// T-Y14 fukuoka: data.mjs の各行を検算する。使い方: node ops/baselines/fukuoka-transcription/check.mjs
//  ①推薦入学の募集人員+特色化選抜の内定者上限人数 ≦ 入学定員(併設中学からの人数を含む☆は除く) ②人数が正の整数 ③実施方法の略が 面/作/実 のみ ④学校×学科の重複なし
import { FK } from './data.mjs';
let bad = 0;
const seen = new Set();
for (const r of FK) {
  const id = r.school + '|' + r.dept + '|' + r.sec;
  if (seen.has(id)) { bad++; console.log('重複', id); }
  seen.add(id);
  if (!(r.teiin > 0)) { bad++; console.log('定員NG', id); }
  const sum = (r.sN || 0) + (r.tN || 0);
  if (sum > r.teiin) { bad++; console.log('推薦+特色化が定員超過', id, sum, r.teiin); }
  for (const [n, m] of [[r.sN, r.sM], [r.tN, r.tM]]) {
    if (n != null && !/^(面|面\(自己表現\)|面・作|面・実|面又は面・作)$/.test(m)) { bad++; console.log('実施方法NG', id, m); }
    if (n == null && m) { bad++; console.log('実施なしなのに方法あり', id); }
  }
}
const sums = { teiin: FK.reduce((a, r) => a + r.teiin, 0), suisen: FK.reduce((a, r) => a + (r.sN || 0), 0), toku: FK.reduce((a, r) => a + (r.tN || 0), 0) };
console.log('rows', FK.length, 'schools', new Set(FK.map((r) => r.school)).size, '入学定員合計', sums.teiin, '推薦募集人員合計', sums.suisen, '特色化上限人数合計', sums.toku, 'bad', bad);
if (bad) process.exitCode = 1;
