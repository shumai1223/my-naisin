// R8 tokyo.ts から指定学校の推薦に基づく選抜レコード(学科・ratioType)を出す: node r8peek.mjs 園芸 科学技術
import fs from 'fs';
const ts = fs.readFileSync(new URL('../../../src/data/school-selection-methods/tokyo.ts', import.meta.url), 'utf8');
const names = process.argv.slice(2);
const parts = ts.split('    {\n      schoolName: ').slice(1);
for (const p of parts) {
  const school = (p.match(/^'([^']*)'/) || [])[1];
  if (!names.includes(school)) continue;
  const dept = (p.match(/department: '([^']*)'/) || [])[1];
  const cat = (p.match(/selectionCategory: '([^']*)'/) || [])[1];
  const ratio = (p.match(/ratioType: '([^']*)'/) || [])[1];
  if (cat === '推薦に基づく選抜') console.log(school, '|', dept, '|', cat, '|', ratio);
}
