// node rec.mjs <校名> : fukushima.ts の該当校レコードを短く表示
import fs from 'fs';
const s = fs.readFileSync('C:/Users/E24054/my-naisin/src/data/school-selection-methods/fukushima.ts', 'utf8').split('\r\n').join('\n');
const re = /    \{\n      schoolName: '([^']*)',\n      department: '([^']*)',\n      selectionCategory: '([^']*)',\n      interviewRequired: (\w+),\n      ratioType: '([^']*)',\n      note: '([^']*)',\n    \},/g;
let m;
while ((m = re.exec(s))) if (m[1] === process.argv[2]) console.log(`## ${m[2]} / ${m[3]} / 面接${m[4]}\n  R: ${m[5]}\n  N: ${m[6]}`);
