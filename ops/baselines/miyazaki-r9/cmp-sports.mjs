// sports.txt(スポーツ推薦方式の実施校・指定部活動・募集人員)を、miyazaki.ts の『スポーツ推薦方式』レコード(学校・部活動・募集人員の記述)と突合する
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const zen = (s) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
const lines = fs.readFileSync(path.join(dir, 'sports.txt'), 'utf8').split('\n');
const rows = [];
let school = '', kind = '';
for (const raw of lines) {
  if (/【指定部活動】/.test(raw)) kind = '指定';
  if (/【推進部活動】/.test(raw)) kind = '推進';
  if (/\(2\) 出願資格/.test(raw)) break;
  const l = raw.replace(/\s+$/, '');
  const m = l.match(/^\s+(?:(\S(?:\s?\S)*?)\s{2,})?(\S+)\s{2,}(男女|男|女)\s+(.+)$/);
  if (!m) continue;
  if (/学\s*校\s*名/.test(l) || /部\s*活\s*動/.test(m[2]) && /男女の別/.test(l)) continue;
  if (m[1]) school = m[1].replace(/\s/g, '');
  rows.push({ kind, school, club: m[2], g: m[3], cap: zen(m[4]).replace(/\s/g, '') });
}
console.log('sports.txt 行', rows.length, '(指定', rows.filter((r) => r.kind === '指定').length, '/推進', rows.filter((r) => r.kind === '推進').length, ')');
const ts = fs.readFileSync(path.join(dir, '../../../src/data/school-selection-methods/miyazaki.ts'), 'utf8');
const recs = [];
for (const p of ts.split('    {\n      schoolName: ').slice(1)) {
  if (!/selectionCategory: '推薦入学者選抜\(スポーツ推薦方式\)'/.test(p)) continue;
  const school = (p.match(/^'([^']*)'/) || [])[1];
  const club = (p.match(/department: '([^']*)'/) || [])[1];
  const cap = (p.match(/募集人員は([^(]*?)(?:\(|。)/) || [])[1] || '';
  recs.push({ school, club, cap });
}
console.log('miyazaki.ts スポーツ推薦レコード', recs.length);
const nk = (s) => s.replace(/高等学校$/, '').replace(/[\s　]/g, '');
const used = new Set();
let ok = 0;
const diffs = [];
for (const r of rows) {
  const i = recs.findIndex((x, ix) => !used.has(ix) && x.school === nk(r.school) && x.club === r.club);
  if (i < 0) { diffs.push(`R9のみ: ${r.school}/${r.club}/${r.g}/${r.cap}`); continue; }
  used.add(i);
  // 募集人員表記の比較: 数字列と『合わせて』の有無
  const nums = (s) => (s.match(/\d+/g) || []).join(',');
  const a = nums(r.cap), b = nums(recs[i].cap);
  const gw = /合わせて/.test(r.cap) === /合わせて|計/.test(recs[i].cap);
  if (a !== b && !(r.g === '男女' && /各/.test(r.cap))) diffs.push(`人数差: ${r.school}/${r.club}: 原資料=${r.g}${r.cap} / ts=${recs[i].cap}`);
  else if (!gw) diffs.push(`合わせて表記差: ${r.school}/${r.club}: 原資料=${r.g}${r.cap} / ts=${recs[i].cap}`);
  else ok++;
}
recs.forEach((x, ix) => { if (!used.has(ix)) diffs.push(`tsのみ: ${x.school}/${x.club}/${x.cap}`); });
console.log('一致', ok, '差分', diffs.length);
diffs.forEach((d) => console.log('  ', d));
