// 広島 頁3(全日制本校): R8(r8.pdf)/R9(r9list.pdf) の pdftotext -bbox から、学科ラベルを中心とした帯ごとに ●/2倍/数値/- のトークン列を作って比較する。
// R9は入学定員・人数が『-』(未定)なので、R9が『-』の位置に対応するR8のトークンは比較対象から外す(長さが揃わない帯は『要目視』)。
// node banddiff.mjs
import { execFileSync } from 'child_process';
const NAMES = /^(普通|機械|電気|建築|土木|化学工学|総合学科|体育|衛生看護|みらい商業|情報ビジネス|自動車|情報工学・デザイン工学|機械・電気・建築|情報電子|環境設備|普通【[^】]*】)$/;
const TOK = /^(●|2倍|\d+|-)$/;
const words = (pdf, p) => {
  const html = execFileSync('pdftotext', ['-bbox', '-f', String(p), '-l', String(p), pdf, '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 1 << 26 });
  return [...html.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: (+m[2] + +m[4]) / 2, t: m[5].normalize('NFKC') }));
};
const bands = (pdf, p) => {
  const ws = words(pdf, p);
  const labels = ws.filter((w) => NAMES.test(w.t.replace(/※[１-３1-3]/, ''))).sort((a, b) => a.y - b.y);
  // 同じ行の重複(学科名が2度出る等)を避けるため、y差が小さいものは先頭のみ
  const uniq = [];
  for (const l of labels) if (!uniq.length || l.y - uniq[uniq.length - 1].y > 8) uniq.push(l);
  return uniq.map((l, i) => {
    const y0 = i ? (uniq[i - 1].y + l.y) / 2 : l.y - 24;
    const y1 = i < uniq.length - 1 ? (l.y + uniq[i + 1].y) / 2 : l.y + 24;
    const toks = ws.filter((w) => w.y >= y0 && w.y < y1 && w.x > l.x + 20 && TOK.test(w.t)).sort((a, b) => Math.round(a.y / 6) - Math.round(b.y / 6) || a.x - b.x).map((w) => w.t);
    return { name: l.t, y: Math.round(l.y), toks };
  });
};
const b8 = bands('r8.pdf', 3), b9 = bands('r9list.pdf', 3);
console.log('帯 R8', b8.length, 'R9', b9.length);
const nums = (a) => a.filter((t) => /^\d+$/.test(t));
const show = (b) => `${b.name} 数値[${nums(b.toks).join(' ')}] ●${b.toks.filter((t) => t === '●').length} 2倍${b.toks.filter((t) => t === '2倍').length}`;
const map = [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[11,11],[12,12],[13,13],[14,14],[15,15],[16,16],[17,17],[16,18],[22,19],[23,20],[24,21],[25,22],[26,23],[27,24],[28,25],[29,26]];
const ms = (a) => { const m = new Map(); for (const t of a) m.set(t, (m.get(t) || 0) + 1); return m; };
for (const [i8, i9] of map) {
  const a = ms(nums(b8[i8].toks)), b = ms(nums(b9[i9].toks));
  const extra9 = [], extra8 = [];
  for (const k of new Set([...a.keys(), ...b.keys()])) { const d = (b.get(k) || 0) - (a.get(k) || 0); if (d > 0) extra9.push(k + 'x' + d); if (d < 0) extra8.push(k + 'x' + -d); }
  const flag = extra9.length ? ' ★R9に新規の数値' : '';
  console.log(String(i8).padStart(2), '->', String(i9).padStart(2), b8[i8].name, '/', b9[i9].name, '| R9のみ:', extra9.join(',') || '-', '| R8のみ:', extra8.join(',') || '-', flag);
}