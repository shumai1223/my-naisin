// R9の学校別PDF(sch/)から、data.mjsの各行に対応する節を選び、選抜の割合と差分パッチ(募集人員・県外)を返す
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const list = fs.readFileSync(path.join(dir, 'sch/list.txt'), 'utf8').split('\n').filter(Boolean).map((l) => { const [p, ...r] = l.split(' '); return { file: p.split('/').pop().replace('.pdf', '.txt'), title: r.join(' ') }; });
const z = (t) => t.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
const secsByFile = new Map();
for (const f of list) {
  const lines = fs.readFileSync(path.join(dir, 'sch/' + f.file), 'utf8').split('\n');
  const idx = lines.map((l, i) => (/^(県立)?\S{2,14}高等学校/.test(l.trim()) ? i : -1)).filter((i) => i >= 0);
  const arr = idx.map((s, k) => {
    const sec = lines.slice(s, idx[k + 1] ?? lines.length);
    const ne = sec.slice(1).filter((l) => l.trim());
    const qi = ne.findIndex((l) => /募集人員/.test(l)); const q = z(ne[qi + 1] ?? '').replace(/\s+/g, ' ');
    const ri = sec.findIndex((l) => /選抜の方法及び割合/.test(l));
    const ratio = z(sec.slice(ri + 1, ri + 6).join('')).replace(/\s+/g, '').replace(/^(.*?)(?=(県立|$))/, '$1').replace(/県立.*$/, '');
    return { dept: ne[0]?.trim().replace(/\s+/g, ' '), q, ratio };
  });
  secsByFile.set(f.file, arr);
}
const fileFor = (e) => {
  const byName = { '新庄志誠館最上校': '18r9mogami.txt', '新庄神室産業金山校': '20r9kaneyama.txt', '新庄神室産業真室川校': '20r9mamurokawa.txt', '山形市立商業': '51r9ichiritsusho.txt' };
  if (byName[e.name]) return byName[e.name];
  const c = list.filter((x) => x.title.replace(/（PDF.*$/, '').replace(/【[^】]*】/, '').replace(/高等学校/, '') === e.name);
  const pick = c.filter((x) => x.title.includes(e.course === '定時制' ? '定時制' : '全日制'));
  return (pick.length ? pick : c)[0]?.file;
};
const counters = new Map();
export function R9(e) {
  const f = fileFor(e); if (!f) return null;
  const arr = secsByFile.get(f); const key = f;
  const i = counters.get(key) ?? 0;
  // 同じ校でも学科が複数行(長井の一般/探究コース等)で節が1つだけの時は同じ節を使う
  const sec = arr.length >= 1 ? arr[Math.min(i, arr.length - 1)] : null;
  counters.set(key, i + 1);
  if (!sec) return null;
  const patch = {};
  const qq = /(\d+)％(程度|以内)/.exec(sec.q);
  if (qq && !e.quota.includes('総合ビジネス')) { const nq = qq[1] + '%' + qq[2]; if (nq !== e.quota && !(e.name === '長井')) patch.quota = nq; }
  if (/あり/.test(sec.q) && !e.outF) { patch.outF = true; }
  if (e.name === '置賜農業') patch.outG = true; // R9概要表で後期の県外志願者受入れも○(学校別PDFは前期の県外あり)
  return { patch, ratio: sec.ratio.replace(/、/g, '・').replace(/調査書情報/g, '調査書'), file: f, q: sec.q };
}
