// cmp.mjs で差が出た行だけ yamaguchi.ts の note を令和9年度版に書き換える
import fs from 'fs';
import { ROWS } from './r9rows.mjs';
const FILE = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/yamaguchi.ts';
const raw = fs.readFileSync(FILE, 'utf8');
const crlf = raw.includes('\r\n');
let s = raw.split('\r\n').join('\n');
const re = /schoolName: '([^']*)',\n      department: '([^']*)',\n      selectionCategory: '([^']*)',\n      interviewRequired: (\w+),\n      note: '([^']*)'/g;
let m; const pairs = []; const map = new Map();
while ((m = re.exec(s))) { const k = m[1] + '|' + m[2]; if (!map.has(k)) { map.set(k, {}); pairs.push(k); } map.get(k)[m[3]] = { iv: m[4], note: m[5] }; }
const edits = [];
pairs.forEach((k, i) => {
  const r = ROWS[i]; const d = map.get(k); const t = d['特色選抜']?.note ?? ''; const f = d['第一次募集']?.note ?? '';
  const oldPct = /募集人員(\d+)%/.exec(t)?.[1] ?? null;
  const oldMark = /面接\((◎|○)/.exec(t)?.[1] ?? null;
  const oldTest = /学校独自検査:([^。]+)/.exec(t)?.[1] ?? null;
  const oldS2 = f.startsWith('面接を実施') ? '○' : '';
  const oldChosa = /調査書等による選抜(\d+)%/.exec(f)?.[1] ?? null;
  const tokuChanged = (r.pct ? String(r.pct) : null) !== oldPct || (r.iv ?? null) !== oldMark || (r.test ?? null) !== oldTest;
  const s2Changed = r.s2 !== oldS2 || (r.chosa ? String(r.chosa) : null) !== oldChosa;
  const [school, dept] = k.split('|');
  if (tokuChanged) {
    // くくり募集などの学校独自検査の後ろの説明文を引き継ぐ
    const suffix = /学校独自検査:[^。]+(。[^。]*くくり募集[^。]*)?/.exec(t)?.[1] ?? '';
    let n = `募集人員${r.pct}%。面接(${r.iv === '◎' ? '◎・備考欄に詳細あり' : '○'})。学校独自検査:${r.test}${suffix}`;
    if (r.iv === '◎' && r.rem) n += `。備考: ${r.rem}`;
    n += '(令和9年度版)';
    edits.push({ school, dept, cat: '特色選抜', old: t, neu: n });
  }
  if (s2Changed) {
    const n = `${r.s2 ? '面接を実施。' : ''}調査書等による選抜${r.chosa}%。${r.s2 ? '' : '面接・'}小論文・実技検査の実施なし(令和9年度版)`;
    edits.push({ school, dept, cat: '第一次募集', old: f, neu: n, iv: r.s2 ? 'true' : 'false' });
  }
});
for (const e of edits) {
  const head = `      schoolName: '${e.school}',\n      department: '${e.dept}',\n      selectionCategory: '${e.cat}',\n`;
  const i = s.indexOf(head); if (i < 0) throw new Error('nf ' + e.school + e.dept + e.cat);
  const j = s.indexOf('\n    },', i);
  let blk = s.slice(i, j);
  const o = `note: '${e.old}'`; if (!blk.includes(o)) throw new Error('old nf ' + e.school + e.dept);
  blk = blk.replace(o, () => `note: '${e.neu}'`);
  if (e.iv) blk = blk.replace(/interviewRequired: \w+/, `interviewRequired: ${e.iv}`);
  s = s.slice(0, i) + blk + s.slice(j);
}
fs.writeFileSync(FILE, crlf ? s.split('\n').join('\r\n') : s);
console.log('edited records', edits.length);
