// miyazaki R9 推薦・連携型: rows-suisen-r9.json(build-suisen.mjs)とR8転記(../miyazaki-transcription/data-suisen.mjs)の差分を出す。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JIKO, SPORTS, RENKEI } from '../miyazaki-transcription/data-suisen.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const o = JSON.parse(fs.readFileSync(path.join(dir, 'rows-suisen-r9.json'), 'utf8'));
const nk = (s) => (s || '').normalize('NFKC').replace(/[\s()（）]/g, '');
const N = (v) => (v == null || v === '' ? null : /^\d+$/.test(v) ? +v : v);
const sig = (r) => JSON.stringify([r.teiin ?? null, r.pct ?? null, r.nin ?? null, r.g, r.itv ?? null, r.sho ?? null, r.saku ?? null, r.jitsu ?? null, r.gaku ?? null, r.jiko ?? null, r.cho ?? null, r.kei ?? null, r.itvType || '']);
const itvType = (m) => (/個人/.test(m) ? '個人' : /集団/.test(m) ? '集団' : '');
const r9j = o.jiko.map((r) => ({ key: r.course + '|' + nk(r.school) + '|' + nk(r.dept), v: { teiin: N(r.cells.teiin), pct: N(r.cells.pct), nin: N(r.cells.nin), g: [N(r.cells.g0), N(r.cells.g1), N(r.cells.g2)], itv: N(r.cells.itv), sho: N(r.cells.sho), saku: N(r.cells.saku), jitsu: N(r.cells.jitsu), gaku: N(r.cells.gaku), jiko: N(r.cells.jiko), cho: N(r.cells.cho), kei: N(r.cells.kei), itvType: itvType(r.memo) }, memo: r.memo }));
const r8j = JIKO.map((r) => ({ key: r.course + '|' + nk(r.school) + '|' + nk(r.dept), v: r }));
function cmp(label, a8, a9, show) {
  const m8 = new Map(a8.map((r) => [r.key, r]));
  let same = 0;
  const chg = [], add = [];
  for (const r of a9) {
    const o8 = m8.get(r.key);
    m8.delete(r.key);
    if (!o8) { add.push(r.key + ' ' + sig(r.v)); continue; }
    if (sig(o8.v) !== sig(r.v)) chg.push(`${r.key}\n    R8 ${sig(o8.v)}\n    R9 ${sig(r.v)}`); else same++;
  }
  console.log(`== ${label}: 同一 ${same} / 変更 ${chg.length} / R9のみ ${add.length} / R8のみ ${m8.size}`);
  if (show) { chg.forEach((x) => console.log('  ~', x)); add.forEach((x) => console.log('  +R9', x)); [...m8.values()].forEach((r) => console.log('  -R8', r.key, sig(r.v))); }
}
cmp('自己推薦', r8j, r9j, true);
// スポーツ
const ninStr = (c) => (c.nMF ? '男女合わせて' + c.nMF : [c.nM ? '男' + c.nM : '', c.nF ? '女' + c.nF : ''].filter(Boolean).join('・'));
const r9s = o.sports.map((r) => ({ key: r.course + '|' + nk(r.school) + '|' + nk(r.dept), v: { nin: ninStr(r.cells), g: [N(r.cells.g0), N(r.cells.g1), N(r.cells.g2)], itv: N(r.cells.itv), sho: N(r.cells.sho), saku: N(r.cells.saku), jitsu: N(r.cells.jitsu), gaku: N(r.cells.gaku), jiko: N(r.cells.jiko), cho: N(r.cells.cho), kei: N(r.cells.kei), itvType: itvType(r.memo) }, memo: r.memo }));
const r8s = SPORTS.map((r) => ({ key: '全日制|' + nk(r.school) + '|' + nk(r.act), v: { ...r, teiin: null, pct: null } }));
const sigS = (r) => JSON.stringify([r.nin ?? null, r.g, r.itv ?? null, r.sho ?? null, r.saku ?? null, r.jitsu ?? null, r.gaku ?? null, r.jiko ?? null, r.cho ?? null, r.kei ?? null, r.itvType || '']);
{
  const m8 = new Map(r8s.map((r) => [r.key, r]));
  let same = 0; const chg = [], add = [];
  for (const r of r9s) {
    const o8 = m8.get(r.key); m8.delete(r.key);
    if (!o8) { add.push(r.key + ' ' + sigS(r.v)); continue; }
    if (sigS(o8.v) !== sigS(r.v)) chg.push(`${r.key}\n    R8 ${sigS(o8.v)}\n    R9 ${sigS(r.v)}`); else same++;
  }
  console.log(`== スポーツ推薦: 同一 ${same} / 変更 ${chg.length} / R9のみ ${add.length} / R8のみ ${m8.size}`);
  chg.forEach((x) => console.log('  ~', x)); add.forEach((x) => console.log('  +R9', x)); [...m8.values()].forEach((r) => console.log('  -R8', r.key, sigS(r.v)));
}
console.log('== 連携型 R9', JSON.stringify(o.renkei.map((r) => [r.school, r.dept, r.cells])), '\n   R8', JSON.stringify(RENKEI));
