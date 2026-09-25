// T-JUKU1 Step3: targets-parts/*.csv を TARGETS.csv に統合し、機械的に検査する。
// 検査: 列数・県コード・メール形式・お断り表記=有 なのに状態が未着手・運営会社の重複・使えないアドレス(個人名gmail等)
import fs from 'node:fs';
const D = 'ops/deliverables/juku1';
const HEAD = ['id', '県', '塾名', '運営会社', '窓口種別', '宛先', '確認したページURL', '営業お断り表記の有無', '中学生コースの有無', '教室数', '一言メモ', '状態'];
function parseCsv(t) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}
const esc = (v) => (/[",\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v);
const all = []; const problems = [];
for (const f of fs.readdirSync(`${D}/targets-parts`).filter((x) => x.endsWith('.csv')).sort()) {
  const rows = parseCsv(fs.readFileSync(`${D}/targets-parts/${f}`, 'utf8').replace(/^\uFEFF/, ''));
  const h = rows[0];
  if (h.join(',') !== HEAD.join(',')) problems.push(`${f}: ヘッダが違う: ${h.join(',')}`);
  for (const r of rows.slice(1)) {
    if (r.length !== HEAD.length) { problems.push(`${f}: 列数${r.length} ${r[0]}`); continue; }
    all.push(Object.fromEntries(HEAD.map((k, i) => [k, r[i].trim()])));
  }
}
const seenCompany = new Map(); const seenDest = new Map();
const PERSONAL = /@(gmail|yahoo|icloud|hotmail|outlook)\./i;
for (const t of all) {
  const live = t['状態'] === '未着手';
  if (live && t['窓口種別'] === 'mail' && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(t['宛先'])) problems.push(`${t.id}: メール形式が不正 ${t['宛先']}`);
  if (live && t['窓口種別'] === 'form' && !/^https?:\/\//.test(t['宛先'])) problems.push(`${t.id}: フォームURLが不正 ${t['宛先']}`);
  if (live && t['営業お断り表記の有無'] !== '無') problems.push(`${t.id}: お断り表記が「無」と確認されていないのに未着手`);
  if (live && PERSONAL.test(t['宛先'])) problems.push(`${t.id}: フリーメール宛先(個人アドレスの可能性) ${t['宛先']}`);
  if (live && !t['一言メモ']) problems.push(`${t.id}: 一言メモが空`);
  if (/思学舎|イー・エス・ティ|ベネッセ|旺文社/.test(t['塾名'] + t['運営会社']) && live) problems.push(`${t.id}: 除外対象の運営会社`);
  const ck = (t['運営会社'] || t['塾名']).replace(/\s|株式会社|有限会社|\(株\)|（株）/g, '');
  if (live) {
    if (seenCompany.has(ck)) problems.push(`${t.id}: 運営会社重複(${seenCompany.get(ck)}と) ${ck}`); else seenCompany.set(ck, t.id);
    if (seenDest.has(t['宛先'])) problems.push(`${t.id}: 宛先重複(${seenDest.get(t['宛先'])}と) ${t['宛先']}`); else seenDest.set(t['宛先'], t.id);
  }
}
fs.writeFileSync(`${D}/TARGETS.csv`, '\uFEFF' + [HEAD.join(',')].concat(all.map((t) => HEAD.map((k) => esc(t[k])).join(','))).join('\r\n') + '\r\n', 'utf8');
const cnt = {};
for (const t of all) { const k = `${t['県']}|${t['状態']}`; cnt[k] = (cnt[k] || 0) + 1; }
const byPref = {};
for (const t of all) { (byPref[t['県']] ??= { 未着手: 0, 除外: 0, 要確認: 0, mail: 0, form: 0 }); byPref[t['県']][t['状態']] = (byPref[t['県']][t['状態']] || 0) + 1; if (t['状態'] === '未着手') byPref[t['県']][t['窓口種別']]++; }
console.log('rows', all.length); console.table(byPref);
console.log(problems.length ? problems.join('\n') : '問題なし');
