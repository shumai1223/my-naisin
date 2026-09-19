// tokyo R9: 別表10/11/12(/14)の学校行を bbox から汎用抽出(比の値 N:M の行=学校行)し、R8(tokyo.ts)の 推薦枠割合・第一次/第二次の比率と満点 と突合する。
// 名前=行頭の非数字トークン(x>=70)、推薦枠=最初の数字トークン、第一次=最初の比のトークン(x<600)、第二次=2つ目(x>=600)。満点=各比のトークン直後の数字2個。
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const files = process.argv.slice(2).length ? process.argv.slice(2) : ['r9_10', 'r9_11', 'r9_12'];
const r9 = [];
for (const f of files) {
  const pages = fs.readFileSync(path.join(dir, f + '.bbox.html'), 'utf8').split('<page ').slice(1);
  pages.forEach((pg, pi) => {
    const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: z(m[5]) }));
    const rt = ws.filter((w) => /^\d+:\d+$/.test(w.t) && w.x > 300);
    const ys = [...new Set(rt.map((w) => Math.round(w.y)))];
    for (const y of ys) {
      const row = ws.filter((w) => Math.abs(w.y - y) < 3).sort((a, b) => a.x - b.x);
      const ratios = row.filter((w) => /^\d+:\d+$/.test(w.t) && w.x > 300);
      const first = ratios.find((w) => w.x < 600), second = ratios.find((w) => w.x >= 600);
      const lead = row.filter((w) => w.x >= 70 && w.x < 300);
      let name = '';
      let pct = null;
      const extra = [];
      for (const w of lead) {
        if (/^\d+$/.test(w.t)) { if (pct == null) pct = w.t; else extra.push(w.t); }
        else if (pct == null) name += w.t;
      }
      const after = (r, lo, hi) => row.filter((w) => r && w.x > r.x && w.x < hi && /^\d+$/.test(w.t)).slice(0, 2).map((w) => w.t);
      r9.push({ file: f, page: pi + 1, y, name, pct, r1: first?.t ?? null, p1: first ? after(first, 0, second ? second.x : 900) : [], r2: second?.t ?? null, p2: second ? after(second, 0, 900) : [] });
    }
  });
}
console.log('R9 学校行', r9.length, '/', files.join(','));
const ts = fs.readFileSync(path.join(dir, '../../../src/data/school-selection-methods/tokyo.ts'), 'utf8');
const re = /schoolName: '([^']*)',\s+department: '([^']*)',\s+selectionCategory: '([^']*)',(?:\s+interviewRequired: (?:true|false),)?\s+ratioType: '([^']*)'/g;
let m;
const r8 = new Map();
while ((m = re.exec(ts))) {
  const [, school, dept, cat, ratio] = m;
  const k = school + '|' + dept;
  if (!r8.has(k)) r8.set(k, { school, dept, pct: null, first: null, second: null });
  const o = r8.get(k);
  if (cat === '推薦に基づく選抜') { const p = ratio.match(/推薦枠割合(\d+)%/); if (p) o.pct = p[1]; }
  const q = ratio.match(/学力検査(\d+):調査書(\d+)\((\d+)点:(\d+)点\)/);
  if (cat === '第一次募集' && q) o.first = q.slice(1);
  if (cat === '第二次募集' && q) o.second = q.slice(1);
}
const nk = (s) => s.replace(/[\s　]/g, '');
const bySchool = new Map();
for (const o of r8.values()) { const k = nk(o.school); if (!bySchool.has(k)) bySchool.set(k, []); bySchool.get(k).push(o); }
let same = 0, unmatched = 0;
const diffs = [];
for (const a of r9) {
  const an = nk(a.name); let cands = bySchool.get(an); if (!cands) { const ks = [...bySchool.keys()].filter((k) => an.startsWith(k)).sort((p, q) => q.length - p.length); if (ks.length) cands = bySchool.get(ks[0]); }
  if (cands) cands = cands.filter((o) => o.first || o.second || o.pct != null); if (!cands || !cands.length) { unmatched++; diffs.push(`R9行がR8に無い(学校名不一致の可能性) ${a.file} p${a.page} 「${a.name}」`); continue; }
  const msgs = [];
  // 学科が複数あるR8学校は、比率・満点が一致する候補があればOKとする
  const okOne = cands.some((o) => {
    if (o.pct != null && a.pct != null && a.pct !== o.pct) return false;
    if (o.first && a.r1 && (`${o.first[0]}:${o.first[1]}` !== a.r1 || o.first[2] !== a.p1[0] || o.first[3] !== a.p1[1])) return false;
    if (o.second && a.r2 && (`${o.second[0]}:${o.second[1]}` !== a.r2 || o.second[2] !== a.p2[0] || o.second[3] !== a.p2[1])) return false;
    return true;
  });
  if (okOne) same++;
  else {
    const o = cands[0];
    if (o.pct != null && a.pct != null && a.pct !== o.pct) msgs.push(`推薦枠 R8=${o.pct} R9=${a.pct}`);
    if (o.first && a.r1) msgs.push(`第一次 R8=${o.first[0]}:${o.first[1]}(${o.first[2]}/${o.first[3]}) R9=${a.r1}(${a.p1.join('/')})`);
    if (o.second && a.r2) msgs.push(`第二次 R8=${o.second[0]}:${o.second[1]}(${o.second[2]}/${o.second[3]}) R9=${a.r2}(${a.p2.join('/')})`);
    diffs.push(`${a.name}(${a.file} p${a.page}${cands.length > 1 ? ',R8学科' + cands.length : ''}): ${msgs.join(' | ')}`);
  }
}
console.log('一致', same, '差分/不明', diffs.length, '(うち学校名不一致', unmatched, ')');
diffs.forEach((d) => console.log(' ', d));


