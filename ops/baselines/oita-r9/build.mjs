// T-Y14 oita R9: 推薦入学者選抜の学校・学科別PDF(88本・第2期公表分2026-08-31)をpdftotextで読み、比重(%)・募集人員・調査書点基準を抽出してR8転記(../oita-transcription/data.mjs)と突合する。
// 使い方: 各PDFを NN.pdf として置く(pdf-list.tsv=通番→URL→ラベル) → pdftotext -layout NN.pdf NN.txt → node build.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ROWS as R8 } from '../oita-transcription/data.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const list = fs.readFileSync(path.join(dir, 'pdf-list.tsv'), 'utf8').split(/\r?\n/).filter(Boolean).map((l) => l.split('\t'));
const rows = [];
for (const [no, , label] of list) {
  const n = String(no).padStart(2, '0');
  const f = path.join(dir, n + '.txt');
  if (!fs.existsSync(f)) { console.error('no txt', n); continue; }
  const txt = z(fs.readFileSync(f, 'utf8'));
  const lines = txt.split(/\r?\n/);
  const school = (txt.match(/大分県立(\S+?)高等学校/) || [])[1] || '';
  const dept = (txt.match(/学科名\s+(.+?)\s*$/m) || [])[1]?.trim() || '';
  // 比重: 「選抜の資料・評価の観点」以降で『資料名 数字』
  const i0 = lines.findIndex((l) => /選抜の資料・評価の観点/.test(l));
  const body = i0 >= 0 ? lines.slice(i0) : lines;
  const hij = [];
  for (const l of body) {
    const m = l.match(/(調査書・推薦書|調査書|面接の結果|面接|小論文の結果|小論文|適性検査の結果|適性検査|実技検査の結果|実技検査|作文の結果|作文)\s+(\d+(?:\.\d+)?)(?:\s|$)/);
    if (m) hij.push([m[1].replace(/の結果$/, ''), +m[2]]);
  }
  // 募集人員: 「募集人員」〜「（次のページに続く）」/「【選抜の資料」
  const j0 = lines.findIndex((l) => /募集人員/.test(l));
  const j1 = lines.findIndex((l, i) => i > j0 && /(次のページに続く|【選抜の資料)/.test(l));
  const nin = j0 >= 0 ? lines.slice(j0, j1 > 0 ? j1 : j0 + 8).join(' ').replace(/\s+/g, ' ').replace(/^.*?募集人員\s*/, '').trim() : '';
  const k0 = lines.findIndex((l) => /係る基準/.test(l));
  const kijun = k0 >= 0 ? lines.slice(k0, j0 > k0 ? j0 : k0 + 6).join(' ').replace(/\s+/g, ' ').replace(/^.*?係る基準\s*/, '').trim() : '';
  rows.push({ no: n, label, school, dept, kijun, nin, hij, sum: Math.round(hij.reduce((a, b) => a + b[1], 0) * 10) / 10 });
}
fs.writeFileSync(path.join(dir, 'rows-r9.json'), JSON.stringify(rows, null, 1));
console.log('R9 rows', rows.length, '/ 比重合計が100でない行', rows.filter((r) => Math.abs(r.sum - 100) > 0.3).map((r) => r.no + ':' + r.sum).join(', ') || 'なし');
// R8との突合(通番一致 → school/dept 名の一致も確認)
const nk = (s) => (s || '').normalize('NFKC').replace(/[\s()（）]/g, '');
let same = 0;
const diffs = [];
for (const r of rows) {
  const o = R8.find((x) => x.no === r.no);
  if (!o) { diffs.push(`${r.no} R8に該当番号なし (${r.school}/${r.dept})`); continue; }
  const nameOk = nk(o.school).replace(/高等学校|\(.*?\)/g, '').startsWith(nk(r.school).slice(0, 3)) || nk(r.school).startsWith(nk(o.school).slice(0, 3));
  const h8 = JSON.stringify(o.hijuu.map((h) => [h[0].replace(/の結果$/, ''), h[1]]));
  const h9 = JSON.stringify(r.hij);
  const msgs = [];
  if (!nameOk) msgs.push(`学校名相違 R8=${o.school} R9=${r.school}`);
  if (nk(o.dept) !== nk(r.dept) && !nk(r.dept).includes(nk(o.dept)) && !nk(o.dept).includes(nk(r.dept))) msgs.push(`学科名相違 R8=${o.dept} R9=${r.dept}`);
  if (h8 !== h9) msgs.push(`比重 R8=${h8} R9=${h9}`);
  const nums = (s) => (nk(s).match(/\d+/g) || []).join(',');
  if (nums(o.nin) !== nums(r.nin)) msgs.push(`募集人員 R8=${o.nin} R9=${r.nin}`);
  if (nums(o.kijun) !== nums(r.kijun)) msgs.push(`基準 R8=${o.kijun} R9=${r.kijun}`);
  if (msgs.length) diffs.push(`${r.no} ${r.school}/${r.dept}: ` + msgs.join(' | ')); else same++;
}
console.log('一致', same, '差分あり', diffs.length);
diffs.forEach((d) => console.log(' ', d));
