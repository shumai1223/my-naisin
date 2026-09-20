// R9学校別PDFの「選抜の方法及び割合」「募集人員/日程/県外」と data.mjs(R8転記)のフラグを突合
import fs from 'fs';
import { D } from '../yamagata-transcription/data.mjs';
const list = fs.readFileSync('sch/list.txt', 'utf8').split('\n').filter(Boolean).map((l) => { const [p, ...r] = l.split(' '); return { file: p.split('/').pop().replace('.pdf', '.txt'), title: r.join(' ') }; });
const z = (t) => t.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const secs = [];
for (const f of list) {
  const lines = fs.readFileSync('sch/' + f.file, 'utf8').split('\n');
  const idx = lines.map((l, i) => (/^県立\S+高等学校/.test(l.trim()) ? i : -1)).filter((i) => i >= 0);
  idx.forEach((s, k) => {
    const sec = lines.slice(s, idx[k + 1] ?? lines.length); const txt = sec.join('\n');
    const school = sec[0].trim().replace(/^県立/, '').replace(/高等学校.*$/, '');
    const ne = sec.slice(1).filter((l) => l.trim());
    const dept = ne[0]?.trim().replace(/\s+/g, ' ');
    const qi = ne.findIndex((l) => /募集人員/.test(l)); const q = z(ne[qi + 1] ?? '').replace(/\s+/g, ' ');
    const ri = sec.findIndex((l) => /選抜の方法及び割合/.test(l)); const ratio = z(sec.slice(ri + 1, ri + 6).join('')).replace(/\s+/g, '');
    secs.push({ school, dept, q, ratio, title: f.title, txt, file: f.file });
  });
}
const kindOf = (d) => d.replace(/^全日制\s*/, '').slice(0, 2);
let bad = 0;
for (const e of D) {
  const cand = secs.filter((s) => s.school === e.name || s.school === e.name.replace(/校$/, ''));
  const c1 = cand.filter((s) => kindOf(s.dept) === e.dept.slice(0, 2) || (e.dept.startsWith('普通') && s.dept.startsWith('普通')) || s.dept.startsWith(e.dept.slice(0, 2)));
  const c2 = c1.filter((s) => /定時制/.test(s.title + s.dept) === (e.course === '定時制') || cand.length === 1);
  const s = (c2.length ? c2 : c1)[0];
  if (!s) { console.log('節なし', e.name, e.course, e.dept, 'cands', cand.map((x) => x.dept).join('/')); bad++; continue; }
  const flags = { ind: /個人面接/.test(s.ratio), grp: /集団面接/.test(s.ratio), essay: /作文/.test(s.ratio), pres: /発表/.test(s.ratio) };
  const d = [];
  for (const k of ['ind', 'grp', 'essay', 'pres']) if (Boolean(e[k]) !== flags[k]) d.push(`${k} DB${e[k] ? '○' : '-'}→R9${flags[k] ? '○' : '-'}`);
  const day = /B日程|Ｂ日程/.test(s.q) ? 'B' : 'A'; if (day !== e.day) d.push(`日程 ${e.day}→${day}`);
  const qq = /(\d+)％(程度|以内)/.exec(s.q); if (qq && !e.quota.startsWith(qq[1] + '%' + qq[2]) && !e.quota.includes('総合ビジネス')) d.push(`募集 ${e.quota}→${qq[1]}%${qq[2]}`);
  const out = /あり/.test(s.q); if (out !== Boolean(e.outF)) d.push(`県外前期 ${e.outF ? 'あり' : 'なし'}→${out ? 'あり' : 'なし'}`);
  if (d.length) { bad++; console.log(`${e.name}|${e.course}|${e.dept}: ${d.join(' ; ')}   [${s.dept.slice(0, 12)}]`); }
}
console.log('不一致', bad, '/', D.length);
