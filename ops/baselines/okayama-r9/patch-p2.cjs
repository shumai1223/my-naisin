const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/okayama.ts';
let s = fs.readFileSync(f, 'utf8');
const from = '検査概要:作文(与えられたテーマについて、400字程度で自分の考えを書く)。募集人員80%。';
const n = s.split(from).length - 1;
if (n !== 1) throw new Error('n=' + n);
s = s.split(from).join('検査概要:作文(与えられた2つのテーマについて、それぞれ200字程度で自分の考えを書く)。募集人員80%。');
fs.writeFileSync(f, s);
console.log('patched p2');
