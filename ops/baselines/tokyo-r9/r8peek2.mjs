// R8 tokyo.ts から指定学校の全レコード(学科・区分・ratioType)を出す: node r8peek2.mjs 大崎
import fs from 'fs';
const ts = fs.readFileSync(new URL('../../../src/data/school-selection-methods/tokyo.ts', import.meta.url), 'utf8');
const names = process.argv.slice(2);
for (const p of ts.split('    {\n      schoolName: ').slice(1)) {
  const school = (p.match(/^'([^']*)'/) || [])[1];
  if (!names.includes(school)) continue;
  const dept = (p.match(/department: '([^']*)'/) || [])[1];
  const cat = (p.match(/selectionCategory: '([^']*)'/) || [])[1];
  const ratio = (p.match(/ratioType: '([^']*)'/) || [])[1];
  console.log(school, '|', dept, '|', cat, '|', ratio);
}
