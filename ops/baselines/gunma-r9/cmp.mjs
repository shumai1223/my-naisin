// node cmp.mjs r8|r9 : gunma.ts の全レコードを、PDF(r8|r9)を頁パースした選抜段階列と学校ごとに順番照合し、割合・得点の不一致を出す
import fs from 'fs';
import { execFileSync } from 'child_process';
const ver = process.argv[2];
const pages = JSON.parse(execFileSync('node', ['stage.mjs', ver], { encoding: 'utf8', maxBuffer: 1 << 27 }));
const s = fs.readFileSync('C:/Users/E24054/my-naisin/src/data/school-selection-methods/gunma.ts', 'utf8').split('\r\n').join('\n');
const re = /schoolName: '([^']*)', department: '([^']*)', selectionCategory: '([^']*)', interviewRequired: (\w+), ratioType: '([^']*)', note: '([^']*)' \}/g;
let m; const recs = [];
while ((m = re.exec(s))) recs.push({ school: m[1], dept: m[2], cat: m[3], ratio: m[5], note: m[6] });
const strip = (x) => x.replace(/^(群馬県立|前橋市立|高崎市立|桐生市立|太田市立|伊勢崎市立|館林市立|利根沼田学校組合立)/, '').replace(/(高等学校|中等教育学校)$/, '');
const bySchool = new Map();
for (const pg of pages) { if (!pg.school) continue; const k = strip(pg.school); const st = pg.stages.filter((x) => x.total); if (!bySchool.has(k)) bySchool.set(k, []); bySchool.get(k).push(...st.map((x) => ({ ...x, p: pg.p }))); }
const dbBy = new Map();
for (const r of recs) { if (!dbBy.has(r.school)) dbBy.set(r.school, []); dbBy.get(r.school).push(r); }
let bad = 0;
for (const [k, rs] of dbBy) {
  const st = bySchool.get(k) ?? bySchool.get(k.replace(/^高崎経済大学附属$/, '高崎経済大学附属')) ?? [];
  if (st.length !== rs.length) { console.log(`件数差 ${k}: DB${rs.length} / PDF${st.length} (頁${[...new Set(st.map((x) => x.p))]})`); bad++; continue; }
  rs.forEach((r, i) => {
    const x = st[i]; const want = x.ratio ? `学力検査${x.ratio.split(':')[0]}:面接等${x.ratio.split(':')[1]}:調査書${x.ratio.split(':')[2]}` : null;
    const d = [];
    if (want && want !== r.ratio) d.push(`割合 ${r.ratio} → ${want}`);
    const mm = /面接等\([^)]*\)(\d+)点・調査書(\d+)点/.exec(r.note);
    if (mm && (mm[1] !== x.mensetsu || mm[2] !== x.chosa)) d.push(`点 面接${mm[1]}/調査書${mm[2]} → ${x.mensetsu}/${x.chosa}`);
    const tt = /学力検査(?:計)?(\d+)/.exec(r.note);
    if (tt && tt[1] !== x.total) d.push(`学力検査計 ${tt[1]} → ${x.total}`);
    if (d.length) { bad++; console.log(`${k} | ${r.dept.slice(0, 12)} | ${r.cat} (頁${x.p}): ${d.join(' ; ')}`); }
  });
}
console.log('不一致', bad, '/ DB校', dbBy.size, 'レコード', recs.length);
