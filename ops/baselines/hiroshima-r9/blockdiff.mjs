// 広島 頁3(全日制本校)を R8/R9 の pdftotext -layout から『学科ごとのブロック(直前の記号行+学科行+直後の合計行)』に切り出し、
// 記号(●/2倍)と数値のトークン列を比べる。R9は入学定員・人数が『-』(未定)なので、R9が『-』の位置はR8側も無視する。
// node blockdiff.mjs   (r8p3.txt / r9p3.txt が必要)
import fs from 'fs';
const NAMES = /^(普通|機械|電気|建築|土木|化学工学|総合学科|体育|衛生看護|みらい商業|情報ビジネス|自動車|情報工学・デザイン工学|機械・電気・建築|情報電子|環境設備|普通【[^】]*】)$/;
const isSym = (l) => /^\s*(●|2倍)(\s+(●|2倍))*\s*$/.test(l.replace(/\s+/g, ' '));
const load = (f) => fs.readFileSync(f, 'utf8').split('\n');
const blocks = (lines) => {
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const toks = lines[i].trim().split(/\s+/).filter(Boolean);
    // 学科行: 学校名(漢字)や※を含みうる。学科名らしいトークンがあれば学科行
    const nameTok = toks.find((t) => NAMES.test(t));
    if (!nameTok) continue;
    const prev = i > 0 && isSym(lines[i - 1]) ? lines[i - 1] : '';
    const next = lines[i + 1] || '';
    const val = (l) => l.trim().split(/\s+/).filter((t) => /^(●|2倍|\d+|-)$/.test(t));
    // 学科行のうち、学科名より後ろのトークンだけを使う(学校名の断片を除く)
    const idx = toks.indexOf(nameTok);
    const rest = toks.slice(idx + 1).filter((t) => /^(●|2倍|\d+|-)$/.test(t));
    const nextIsTotal = /^\s*[\d\s]+$/.test(next) && next.trim() !== '';
    out.push({ name: nameTok, sym: val(prev), row: rest, total: nextIsTotal ? val(next) : [] });
  }
  return out;
};
const b8 = blocks(load('r8p3.txt')), b9 = blocks(load('r9p3.txt'));
console.log('R8ブロック', b8.length, 'R9ブロック', b9.length);
const show = (b) => `${b.name} sym[${b.sym.join(' ')}] row[${b.row.join(' ')}] total[${b.total.join(' ')}]`;
console.log('--- R8'); b8.forEach((b, i) => console.log(String(i).padStart(2), show(b)));
console.log('--- R9'); b9.forEach((b, i) => console.log(String(i).padStart(2), show(b)));
