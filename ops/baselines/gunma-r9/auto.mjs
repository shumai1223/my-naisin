// node auto.mjs [--write] : gunma.ts の各レコードを R9 PDF の頁パース結果で数値だけ更新する(割合・面接等点・調査書点・学力検査の配点・選抜比率)。
// 段階数/学科分割が合わない校は更新せず「要手作業」として列挙する。--write なしはドライラン。
import fs from 'fs';
import { execFileSync } from 'child_process';
const FILE = 'C:/Users/E24054/my-naisin/src/data/school-selection-methods/gunma.ts';
const WRITE = process.argv.includes('--write');
const pages = JSON.parse(execFileSync('node', ['stage.mjs', 'r9'], { encoding: 'utf8', maxBuffer: 1 << 27 }));
const raw = fs.readFileSync(FILE, 'utf8'); const crlf = raw.includes('\r\n');
let s = raw.split('\r\n').join('\n');
const re = /( *\{ schoolName: '([^']*)', department: '([^']*)', selectionCategory: '([^']*)', interviewRequired: (\w+), ratioType: ')([^']*)(', note: ')([^']*)(' \},?)/g;
const recs = []; let m;
while ((m = re.exec(s))) recs.push({ idx: m.index, len: m[0].length, pre: m[1], school: m[2], dept: m[3], cat: m[4], ratio: m[6], mid: m[7], note: m[8], post: m[9], full: m[0] });
const strip = (x) => x.replace(/^(群馬県立|高崎市立|利根沼田学校組合立)/, '').replace(/(高等学校|中等教育学校)$/, '');
const bySchool = new Map();
for (const pg of pages) { if (!pg.school) continue; const k = strip(pg.school); const st = pg.stages.filter((x) => x.total); if (!bySchool.has(k)) bySchool.set(k, []); bySchool.get(k).push(...st.map((x) => ({ ...x, p: pg.p }))); }
const dbBy = new Map();
for (const r of recs) { if (!dbBy.has(r.school)) dbBy.set(r.school, []); dbBy.get(r.school).push(r); }
const norm = (c) => c.replace(/[①②]/g, '');
const scorePhrase = (x) => { const sb = x.subj.split(','); return sb.every((v) => v === sb[0]) ? `学力検査計${x.total}(各${sb[0]}点)` : `学力検査国数英各${sb[0]}点・社理各${sb[3]}点(計${x.total})`; };
const todo = []; const done = [];
for (const [k, rs] of dbBy) {
  const st = bySchool.get(k) ?? [];
  if (k === '高崎経済大学附属') { todo.push('手作業 高崎経済大学附属(芸術コースの実技検査割合が独自書式)'); continue; }
  if (st.length !== rs.length) { todo.push(`件数差 ${k}: DB${rs.length}/PDF${st.length}`); continue; }
  // 同一学科の連続グループ内でラベル照合(順序入れ替わりに対応)
  let i = 0; let ok = true; const plan = [];
  while (i < rs.length) {
    let j = i; while (j < rs.length && rs[j].dept === rs[i].dept) j++;
    const grp = rs.slice(i, j); const sg = st.slice(i, j);
    const used = new Set(); const pairs = [];
    for (const r of grp) {
      const c = sg.findIndex((x, q) => !used.has(q) && x.label === r.cat);
      const c2 = c >= 0 ? c : sg.findIndex((x, q) => !used.has(q) && norm(x.label) === norm(r.cat) && (x.label.match(/[①②]/) == null || r.cat.match(/[①②]/) == null) === false);
      const pick = c >= 0 ? c : c2;
      if (pick < 0) { ok = false; break; } used.add(pick); pairs.push([r, sg[pick]]);
    }
    if (!ok) break; plan.push(...pairs); i = j;
  }
  if (!ok) { todo.push(`段階名不一致 ${k}`); continue; }
  // 学科ごとの選抜比率の合計が100%になる時だけ比率を信用する
  const shareOk = (() => { const byDept = new Map(); for (const [r, x] of plan) { const v = byDept.get(r.dept) ?? 0; byDept.set(r.dept, v + (x.share ? parseInt(x.share) : 1000)); } return [...byDept.values()].every((v) => v === 100); })();
  for (const [r, x] of plan) {
    let note = r.note; const ch = [];
    // 割合と点数が整合しない抽出は信用せず手作業へ
    { const T = +x.total, M = +x.mensetsu, C = +x.chosa, sum = T + M + C; const rr = (x.ratio ?? '').split(':').map((v) => parseInt(v)); if (rr.length === 3 && (Math.abs(Math.round(100 * T / sum) - rr[0]) > 1 || Math.abs(Math.round(100 * M / sum) - rr[1]) > 1)) { todo.push(`抽出不整合 ${k}|${r.dept.slice(0, 10)}|${r.cat} (頁${x.p}) 点${x.total}/${x.mensetsu}/${x.chosa} 割合${x.ratio}`); continue; } }
    const ratio = x.ratio ? x.ratio.split(':') : null;
    const newRatio = ratio ? `学力検査${ratio[0]}:面接等${ratio[1]}:調査書${ratio[2]}` : r.ratio;
    if (ratio && newRatio.match(/[0-9]+/g).join() !== r.ratio.match(/[0-9]+/g).join()) ch.push(`割合${r.ratio}→${newRatio}`);
    const mm = /面接等\(([^)]*)\)(\d+)点・調査書(\d+)点/.exec(note);
    if (mm && (mm[2] !== x.mensetsu || mm[3] !== x.chosa)) { note = note.replace(mm[0], `面接等(${mm[1]})${x.mensetsu}点・調査書${x.chosa}点`); ch.push(`点${mm[2]}/${mm[3]}→${x.mensetsu}/${x.chosa}`); }
    const sm = /学力検査.*?・面接等\(/.exec(note);
    if (sm && !sm[0].includes(scorePhrase(x))) {
      // 総計が変わった時だけ書き換える(配点の書式違いだけの差は触らない)
      const tot = /(?:計|\(計)(\d+)/.exec(sm[0])?.[1];
      if (tot && tot !== x.total) { note = note.replace(sm[0], scorePhrase(x) + '・面接等('); ch.push(`学力検査計${tot}→${x.total}`); }
    }
    const sh = /(総合型選抜|特色型選抜[①②]?)(\d+)%/.exec(note);
    if (sh && x.share && shareOk && sh[2] + '%' !== x.share) { note = note.replace(sh[0], sh[1] + x.share.replace('%', '') + '%'); ch.push(`比率${sh[2]}%→${x.share}`); }
    if (ch.length) { r.newRatio = newRatio; r.newNote = note + '(令和9年度版)'; done.push(`${k}|${r.dept.slice(0, 10)}|${r.cat}: ${ch.join(' ; ')}`); }
  }
}
console.log(done.join('\n')); console.log('--- 要手作業'); console.log(todo.join('\n'));
console.log('自動更新', done.length, '要手作業', todo.length);
if (WRITE) {
  let out = ''; let pos = 0;
  for (const r of recs) {
    out += s.slice(pos, r.idx);
    out += r.newNote ? `${r.pre}${r.newRatio}${r.mid}${r.newNote}${r.post}` : r.full;
    pos = r.idx + r.len;
  }
  out += s.slice(pos);
  fs.writeFileSync(FILE, crlf ? out.split('\n').join('\r\n') : out);
  console.log('written');
}
