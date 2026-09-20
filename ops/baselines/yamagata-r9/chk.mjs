// data.mjs(令和8年度転記)の各行の detail から 時間(分)・字数・人数の数値を取り出し、R9の学校別PDFテキストに現れるか照合する
import fs from 'fs';
import { D } from '../yamagata-transcription/data.mjs';
const list = fs.readFileSync('sch/list.txt', 'utf8').split('\n').filter(Boolean).map((l) => { const [p, ...r] = l.split(' '); return { file: p.split('/').pop().replace('.pdf', '.txt'), title: r.join(' ') }; });
const norm = (t) => t.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[\s　]+/g, '').replace(/,/g, '');
const texts = new Map(list.map((x) => [x.file, norm(fs.readFileSync('sch/' + x.file, 'utf8'))]));
const find = (e) => {
  const cand = list.filter((x) => x.title.startsWith(e.name + '高等学校') || (x.title.startsWith(e.name) && !/[校]/.test(e.name.replace(/最上校|金山校|真室川校/, '')) && false));
  const c2 = list.filter((x) => x.title.replace(/（PDF.*$/, '').replace(/【[^】]*】/, '').replace(/高等学校/, '') === e.name);
  const pick = c2.filter((x) => !/【/.test(x.title) || x.title.includes(e.course));
  return (pick.length ? pick : c2)[0];
};
let miss = 0;
for (const e of D) {
  const f = find(e);
  if (!f) { console.log('PDFなし', e.name, e.course, e.dept); miss++; continue; }
  const t = texts.get(f.file);
  const nums = [...new Set((e.detail.match(/\d+(?=分|字|人)/g) ?? []))];
  const bad = nums.filter((n) => !new RegExp('(^|[^0-9])' + n + '(分|字|人|名)').test(t) && !new RegExp('(^|[^0-9])' + n).test(t));
  const quota = e.quota.replace(/[^0-9]/g, '');
  if (bad.length) { console.log(`${e.name}|${e.course}|${e.dept}: 数値なし ${bad.join(',')}  (${f.file})`); miss++; }
}
console.log('不一致行', miss, '/', D.length);
