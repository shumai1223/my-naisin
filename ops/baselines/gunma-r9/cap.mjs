// 募集人員の変更(R9で募集人員が変わった校)を注記に反映する
import fs from 'fs';
const F = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/gunma.ts';
let s = fs.readFileSync(F, 'utf8'); const crlf = s.includes('\r\n'); s = s.split('\r\n').join('\n');
const chg = [['前橋西', 160, 120], ['渋川女子', 200, 160], ['藤岡中央', 160, 120], ['富岡', 200, 160], ['安中総合学園', 200, 160]];
for (const [sch, a, b] of chg) {
  const re = new RegExp("(schoolName: '" + sch + "', department: '[^']*', selectionCategory: '[^']*', interviewRequired: \\w+, ratioType: '[^']*', note: ')募集人員" + a + '(?!\\d)', 'g');
  let n = 0; s = s.replace(re, (m0, p1) => { n++; return p1 + '募集人員' + b + '(令和9年度版で' + a + 'から変更)'; });
  console.log(sch, n);
}
fs.writeFileSync(F, crlf ? s.split('\n').join('\r\n') : s);
