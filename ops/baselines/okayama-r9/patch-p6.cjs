const fs = require('fs');
const f = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/okayama.ts';
let s = fs.readFileSync(f, 'utf8');
const from = '校外における文化・体育活動の実績(4系列で共通)';
const n = s.split(from).length - 1;
if (n !== 4) throw new Error('n=' + n);
s = s.split(from).join('校外における文化・体育・社会貢献活動の実績(4系列で共通)');
fs.writeFileSync(f, s);
console.log('patched p6');
