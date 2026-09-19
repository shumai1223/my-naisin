// bbox抽出(rows.json)を、独立に pdftotext -layout(joho.txt)の各行から取った数値列と突合する。全日制(頁1〜3)のみ。
import fs from 'fs';
const rows = JSON.parse(fs.readFileSync('rows.json', 'utf8')).filter((r) => r.school !== '学校名');
const lines = fs.readFileSync('joho.txt', 'utf8').split('\n');
const end = lines.findIndex((l) => /定時制課程/.test(l) && /入試情報/.test(l));
const seqs = [];
for (const l of lines.slice(0, end < 0 ? lines.length : end)) {
  const m = l.match(/(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)%/);
  if (m) seqs.push(m.slice(1, 7).map(Number));
}
console.log('bbox行', rows.length, 'layout行', seqs.length);
let ng = 0;
rows.forEach((r, i) => {
  const a = [r.tokuGaku, r.tokuCho, r.tokuDoku, r.ippanGaku, r.ippanCho, r.ratio];
  const b = seqs[i];
  if (!b || a.join() !== b.join()) { ng++; console.log('不一致', i, r.school, r.dept, a.join('/'), '|', b && b.join('/')); }
});
console.log('数値列の不一致', ng);
// ○の個数: layout行の ○ の数と比較
let ngc = 0;
let k = 0;
for (const l of lines.slice(0, end < 0 ? lines.length : end)) {
  if (!/\d+\s+\d+\s+\d+\s+\d+\s+\d+\s+\d+%/.test(l)) continue;
  const c = (l.match(/○/g) || []).length;
  const r = rows[k++];
  if (r && r.circles.length !== c) { ngc++; console.log('○個数の不一致', r.school, r.dept, 'bbox', r.circles.join(','), 'layout', c); }
}
console.log('○個数の不一致', ngc);
// 学校ごとの学科数
const by = new Map();
for (const r of rows) by.set(r.school, (by.get(r.school) || 0) + 1);
console.log('学校数', by.size, '学科数', rows.length);
