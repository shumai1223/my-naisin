// T-Y14 ehime R9: pdftotext -bbox の座標から、頁ごとに「募集定員/割合/人数の3つ組」「検査項目等の比重(列付き)」を抽出する。
// 列はヘッダ語(調査書/作文/小論文/面接/集団討論/実技テスト/プレゼン)のx座標で確定。文スポ選抜の人数は人程度の左の数字。
// 使い方: pdftotext -bbox file2829.pdf bbox.html && node parse-bbox.mjs > pages.txt
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(dir, 'bbox.html'), 'utf8');
const zen = (s) => s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
const COLS = [
  ['調', 650.5], ['作', 672], ['小', 693], ['面', 714.5], ['集', 736], ['実', 757.5], ['プ', 780],
];
const pages = html.split('<page ').slice(1);
const out = [];
pages.forEach((pg, pi) => {
  const words = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({
    x: +m[1], y: +m[2], x2: +m[3], t: zen(m[5]),
  }));
  const nums = words.filter((w) => /^\d+$/.test(w.t));
  const W = nums.filter((w) => w.x >= 640 && w.x <= 800);
  const T = nums.filter((w) => w.x >= 230 && w.x <= 345 && w.y > 100);
  const S = nums.filter((w) => w.x >= 540 && w.x < 640);
  // W行=y近傍でグルーピング
  const rows = [];
  for (const w of W.sort((a, b) => a.y - b.y)) {
    const r = rows.find((r) => Math.abs(r.y - w.y) < 4);
    if (r) r.items.push(w); else rows.push({ y: w.y, items: [w] });
  }
  const wrow = rows.map((r) => `y${Math.round(r.y)}[` + r.items.sort((a, b) => a.x - b.x).map((w) => {
    const c = COLS.reduce((best, c) => (Math.abs(c[1] - w.x) < Math.abs(best[1] - w.x) ? c : best));
    return c[0] + w.t;
  }).join(' ') + ']').join(' ');
  const trow = [];
  for (const w of T.sort((a, b) => a.y - b.y || a.x - b.x)) {
    const r = trow.find((r) => Math.abs(r.y - w.y) < 4);
    if (r) r.v.push(w.t); else trow.push({ y: w.y, v: [w.t] });
  }
  out.push(`p${pi + 1}\tT: ${trow.map((r) => `y${Math.round(r.y)}(${r.v.join('/')})`).join(' ')}\tW: ${wrow}\tS: ${S.map((w) => `y${Math.round(w.y)}:${w.t}`).join(' ')}`);
});
console.log(out.join('\n'));
