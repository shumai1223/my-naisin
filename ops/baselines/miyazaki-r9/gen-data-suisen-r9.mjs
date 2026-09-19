// miyazaki R9: rows-suisen-r9.json(build-suisen.mjs)から data-suisen-r9.mjs(R8のdata-suisen.mjsと同じJIKO/SPORTS/RENKEI形)を生成し、計=各点数の和 と 定員×割合=募集人員 を検算する。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const o = JSON.parse(fs.readFileSync(path.join(dir, 'rows-suisen-r9.json'), 'utf8'));
const N = (v) => (v == null || v === '' ? null : /^\d+$/.test(v) ? +v : v);
const itvType = (m) => (/個人/.test(m) ? '個人' : /集団/.test(m) ? '集団' : '');
const clean = (m) => m.replace(/面接は(集団|個人)面接(\(質問\))?/g, '').replace(/^\(質問\)/, '').replace(/適正検査/g, '適性検査').trim();
const base = (c) => ({ g: [N(c.g0), N(c.g1), N(c.g2)], itv: N(c.itv), sho: N(c.sho), saku: N(c.saku), jitsu: N(c.jitsu), gaku: N(c.gaku), jiko: N(c.jiko), cho: N(c.cho), kei: N(c.kei) });
const JIKO = o.jiko.map((r) => ({ course: r.course, school: r.school, dept: r.dept, teiin: N(r.cells.teiin), pct: N(r.cells.pct), nin: N(r.cells.nin), ...base(r.cells), itvType: itvType(r.memo), memo: clean(r.memo) }));
const ninStr = (c) => (c.nMF ? '男女合わせて' + c.nMF : [c.nM ? '男' + c.nM : '', c.nF ? '女' + c.nF : ''].filter(Boolean).join('・'));
const SPORTS = o.sports.map((r) => ({ school: r.school, act: r.dept, nin: ninStr(r.cells), ...base(r.cells), itvType: itvType(r.memo), memo: clean(r.memo) }));
const RENKEI = o.renkei.map((r) => ({ school: '福島', dept: '普通', teiin: N(r.cells.pct), ...base(r.cells), itvType: itvType(r.memo), memo: clean(r.memo) }));
const bad = [];
const chk = (label, r) => {
  const s = (r.g || []).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0) + [r.itv, r.sho, r.saku, r.jitsu, r.gaku, r.jiko, r.cho].reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
  if (typeof r.kei === 'number' && s !== r.kei) bad.push(`計不一致 ${label}: 和${s} / 計${r.kei}`);
  if (typeof r.kei !== 'number') bad.push(`計が数値でない ${label}: ${r.kei}`);
  if (r.teiin != null && r.pct != null && typeof r.nin === 'number' && Math.abs((r.teiin * r.pct) / 100 - r.nin) > 1) bad.push(`定員×割合≠人数 ${label}: ${r.teiin}×${r.pct}% vs ${r.nin}`);
};
JIKO.forEach((r) => chk('自己推薦 ' + r.course + '/' + r.school + '/' + r.dept, r));
SPORTS.forEach((r) => chk('スポーツ ' + r.school + '/' + r.act, r));
RENKEI.forEach((r) => chk('連携型 ' + r.school, r));
fs.writeFileSync(path.join(dir, 'data-suisen-r9.mjs'), `// 令和9年度 推薦・連携型(自動抽出・gen-data-suisen-r9.mjs)\nexport const JIKO = ${JSON.stringify(JIKO, null, 1)};\nexport const SPORTS = ${JSON.stringify(SPORTS, null, 1)};\nexport const RENKEI = ${JSON.stringify(RENKEI, null, 1)};\n`);
console.log('JIKO', JIKO.length, 'SPORTS', SPORTS.length, 'RENKEI', RENKEI.length, '/ 検算NG', bad.length);
bad.forEach((b) => console.log(' ', b));
