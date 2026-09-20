// R9の学校別PDFテキストを学科ごとの節に分け、学校・学科・課程・募集人員・日程・県外・選抜の方法及び割合を抽出する
import fs from 'fs';
const list = fs.readFileSync('sch/list.txt', 'utf8').split('\n').filter(Boolean).map((l) => { const [p, ...r] = l.split(' '); return { file: p.split('/').pop().replace('.pdf', '.txt'), title: r.join(' ') }; });
const z = (t) => t.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const out = [];
for (const f of list) {
  const lines = fs.readFileSync('sch/' + f.file, 'utf8').split('\n');
  const idx = lines.map((l, i) => (/^県立\S+高等学校/.test(l.trim()) ? i : -1)).filter((i) => i >= 0);
  idx.forEach((s, k) => {
    const e = idx[k + 1] ?? lines.length; const sec = lines.slice(s, e);
    const school = sec[0].trim().replace(/^県立/, '').replace(/高等学校.*$/, '');
    const ne = sec.slice(1).filter((l) => l.trim());
    const dept = ne[0]?.trim().replace(/\s+/g, ' ');
    const course = ne.find((l) => /^\s*(全日制|定時制)\s*$/.test(l))?.trim();
    const qi = ne.findIndex((l) => /募集人員/.test(l));
    const qline = ne[qi + 1]?.replace(/\s+/g, ' ').trim();
    const ratioI = sec.findIndex((l) => /選抜の方法及び割合/.test(l));
    const ratio = ratioI >= 0 ? sec.slice(ratioI + 1, ratioI + 6).map((l) => l.trim()).filter(Boolean).join(' ') : '';
    out.push({ file: f.file, school, dept, course, q: z(qline ?? ''), ratio: z(ratio) });
  });
}
for (const o of out) console.log([o.school, o.course, o.dept, o.q, o.ratio].join(' | '));
console.log(out.length);
