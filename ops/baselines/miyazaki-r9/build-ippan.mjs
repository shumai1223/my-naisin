// T-Y14 miyazaki R9: 一般入学者選抜の検査発表事項(ippan.pdf・4頁)を pdftotext -bbox の座標から data-ippan-r9.mjs(R8のdata.mjsと同じr()形式)へ機械抽出する。
// 行=数値10個(定員・国社数理英・面接・適性検査等・調査書・計)を持つy行。学科=x74〜170の文字をy近傍で連結、学校=x<70の文字を近接連結し最寄りの行へ。
// 使い方: pdftotext -bbox ippan.pdf ippan.bbox.html && node build-ippan.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, 'ippan.bbox.html'), 'utf8').split('<page ').slice(1);
const DASH = /^[-ー―－]$/;
const rowsOut = [];
let course = '全日制';
pages.forEach((pg, pi) => {
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], t: z(m[5]) }));
  // 課程見出し
  const titles = ws.filter((w) => /^(全日制課程|定時制課程)/.test(w.t) && w.x < 80).map((w) => ({ y: w.y, c: w.t.startsWith('定時制') ? '定時制' : '全日制' }));
  // 数値行: y近傍で x>=170 の数値/ダッシュ10個
  const cand = ws.filter((w) => w.x >= 170 && w.x < 410 && (/^\d+$/.test(w.t) || DASH.test(w.t)));
  const rows = [];
  for (const w of cand.sort((a, b) => a.y - b.y || a.x - b.x)) {
    const r = rows.find((r) => Math.abs(r.y - w.y) < 4);
    if (r) r.w.push(w); else rows.push({ y: w.y, w: [w] });
  }
  const R = rows.filter((r) => r.w.length === 10).map((r) => {
    const v = r.w.sort((a, b) => a.x - b.x).map((w) => (DASH.test(w.t) ? null : +w.t));
    return { y: r.y, v, dept: [], memo: [], school: '' };
  });
  if (!R.length) return;
  const gys = ws.filter((w) => w.t === '国語' && w.x > 190 && w.x < 215).map((w) => w.y);
  const blocks = titles.map((t) => ({ a: t.y - 3, b: (gys.filter((g) => g > t.y).sort((p, q) => p - q)[0] ?? t.y) + 6 }));
  const okY = (y) => !blocks.some((bl) => y >= bl.a && y <= bl.b) && y > 60;
  const nearRow = (y) => R.reduce((b, r) => (Math.abs(r.y - y) < Math.abs(b.y - y) ? r : b), R[0]);
  for (const w of ws) {
    if (w.x >= 70 && w.x < 172 && okY(w.y) && !/^※/.test(w.t)) nearRow(w.y).dept.push(w);
    else if (w.x >= 405 && okY(w.y) && !/^※/.test(w.t)) {
      const same = R.find((r) => Math.abs(r.y - w.y) < 4);
      (same || nearRow(w.y)).memo.push(w);
    }
  }
  // 学校名(x<70)を近接連結
  const names = [];
  for (const w of ws.filter((w) => w.x < 70 && okY(w.y) && !/^(学|校|名|全日制課程|定時制課程|※)/.test(w.t)).sort((a, b) => a.y - b.y)) {
    const l = names[names.length - 1];
    if (l && w.y - l.y2 <= 14) { l.t += w.t; l.y2 = w.y; l.ys.push(w.y); } else names.push({ t: w.t, y2: w.y, ys: [w.y] });
  }
  names.forEach((n) => (n.c = n.ys.reduce((a, b) => a + b, 0) / n.ys.length));
  // 学校名の中心yと各群の行y平均が最も合うように、行を連続群へ分割(名前の数=群の数)するDP
  if (names.length) {
    names.sort((p, q) => p.c - q.c);
    const n = R.length, k = names.length;
    const INF = 1e18;
    const cost = (i, j, g) => { let m = 0; for (let t = i; t < j; t++) m += R[t].y; m /= j - i; return (m - names[g].c) ** 2; };
    const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(INF));
    const bk = Array.from({ length: k + 1 }, () => Array(n + 1).fill(-1));
    dp[0][0] = 0;
    for (let g = 1; g <= k; g++) for (let j = g; j <= n; j++) for (let i = g - 1; i < j; i++) {
      if (dp[g - 1][i] >= INF) continue;
      const c = dp[g - 1][i] + cost(i, j, g - 1);
      if (c < dp[g][j]) { dp[g][j] = c; bk[g][j] = i; }
    }
    let j = n;
    for (let g = k; g >= 1; g--) { const i = bk[g][j]; for (let t = i; t < j; t++) R[t].school = names[g - 1].t; j = i; }
  }
  for (const r of R) {
    const t = titles.filter((x) => x.y <= r.y).pop();
    r.course = t ? t.c : course;
  }
  if (titles.length) course = titles[titles.length - 1].c;
  rowsOut.push(...R.map((r) => ({ ...r, dept: r.dept.sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''), memo: r.memo.sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''), page: pi + 1 })));
});
const q = (s) => "'" + s.replace(/'/g, '') + "'";
const lines = rowsOut.map((r) => {
  const [teiin, ...rest] = r.v;
  const subj = rest.slice(0, 5);
  const [itv, tek, cho, kei] = rest.slice(5);
  const itvType = /個人/.test(r.memo) ? '個人' : /集団/.test(r.memo) ? '集団' : '';
  let extra = r.memo.replace(/面接は(集団|個人)面接(\(質問\))?/g, '').replace(/^\(質問\)/, '').replace(/適正検査/g, '適性検査').trim();
  if (subj.every((x) => x == null)) extra = '学力検査は実施しない。' + extra;
  const sj = subj.every((x) => x == null) ? 'null' : '[' + subj.map((x) => (x == null ? 'null' : x)).join(', ') + ']';
  const N = (x) => (x == null ? 'null' : x);
  return `r(${q(r.course)}, ${q(r.school)}, ${q(r.dept.replace(/[（(]/g, '(').replace(/[）)]/g, ')'))}, ${teiin}, ${sj}, ${N(itv)}, ${N(tek)}, ${N(cho)}, ${kei}, ${q(itvType)}${extra ? ', ' + q(extra) : ''}); // p${r.page}`;
});
const head = `// T-Y14 miyazaki: 令和9年度宮崎県立高等学校 一般入学者選抜 募集定員及び検査内容(令和8年8月6日発表・全4頁)を pdftotext -bbox の座標から機械抽出(build-ippan.mjs)。
// 元PDF: https://www.pref.miyazaki.lg.jp/documents/109134/109134_20260718165834-1.pdf (県ページ https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20260519170532.html)
export const ROWS = [];
const r = (course, school, dept, teiin, subj, itv, tek, cho, kei, itvType, memo) =>
  ROWS.push({ course, school, dept, teiin, subj, itv, tek, cho, kei, itvType, memo: memo || '' });
`;
fs.writeFileSync(path.join(dir, 'data-ippan-r9.mjs'), head + lines.join('\n') + '\n');
console.log(rowsOut.length + ' rows');
console.log([...new Set(rowsOut.map((r) => r.course + '|' + r.school))].join(' / '));

