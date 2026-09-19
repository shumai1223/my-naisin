// T-Y14 miyazaki R9: 推薦・連携型入学者選抜(suisen.pdf・6頁)を pdftotext -bbox の座標から行オブジェクトへ機械抽出し、R8転記(../miyazaki-transcription/data-suisen.mjs)と突合する。
// 表=自己推薦(全日制/定時制)・スポーツ推薦・連携型。列はxMin範囲で確定(3桁は左寄りに始まるため範囲に余裕を持たせる)。
// 使い方: pdftotext -bbox suisen.pdf suisen.bbox.html && node build-suisen.mjs   (出力: rows-suisen-r9.json と差分)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JIKO, SPORTS, RENKEI } from '../miyazaki-transcription/data-suisen.mjs';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, 'suisen.bbox.html'), 'utf8').split('<page ').slice(1);
const NUM = /^\d+$/;
// 列(xMin範囲): 自己推薦 [定員,割合,募集人員,国,数,英,面接,小論,作文,実技,学校独自,自己推薦書,調査書,計]
const JCOL = [['teiin', 128, 152], ['pct', 152, 169], ['nin', 169, 189], ['g0', 189, 206], ['g1', 206, 226], ['g2', 226, 245], ['itv', 245, 264], ['sho', 264, 283], ['saku', 283, 302], ['jitsu', 302, 322], ['gaku', 322, 343], ['jiko', 343, 362], ['cho', 362, 380], ['kei', 380, 400]];
// スポーツ: 募集人員は男/女/男女合算(x範囲)
const SCOL = [['nM', 150, 165], ['nMF', 165, 173], ['nF', 173, 189], ['g0', 189, 206], ['g1', 206, 226], ['g2', 226, 245], ['itv', 245, 264], ['sho', 264, 283], ['saku', 283, 302], ['jitsu', 302, 322], ['gaku', 322, 343], ['jiko', 343, 362], ['cho', 362, 380], ['kei', 380, 400]];
const colOf = (cols, x) => cols.find((c) => x >= c[1] && x < c[2])?.[0];

// 頁ごとのテーブル区間(y範囲)を見出しから決める
function segments() {
  const segs = [];
  let cur = null;
  pages.forEach((pg, pi) => {
    const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], x2: +m[3], t: z(m[5]) }));
    const heads = ws.filter((w) => w.x < 140 && /^(推薦入学者選抜|連携型入学者選抜|全日制課程|定時制課程|\[自己推薦方式\]|\[スポーツ推薦方式\])/.test(w.t)).sort((a, b) => a.y - b.y);
    let kind = cur ? cur.kind : 'jiko', course = cur ? cur.course : '全日制';
    const evs = [];
    for (const h of heads) {
      if (/自己推薦/.test(h.t)) kind = 'jiko';
      else if (/スポーツ/.test(h.t)) kind = 'sports';
      else if (/連携型/.test(h.t)) kind = 'renkei';
      else if (/^全日制/.test(h.t)) course = '全日制';
      else if (/^定時制/.test(h.t)) course = '定時制';
      evs.push({ y: h.y, kind, course });
    }
    // 連携型見出しは『連携型入学者選抜』単独語(x<140)
    const startKind = cur ? cur.kind : 'jiko';
    const startCourse = cur ? cur.course : '全日制';
    segs.push({ pi, ws, evs, startKind, startCourse });
    if (evs.length) cur = { kind: evs[evs.length - 1].kind, course: evs[evs.length - 1].course };
  });
  return segs;
}

const out = { jiko: [], sports: [], renkei: [] };
for (const sg of segments()) {
  const { ws, evs } = sg;
  // 数値行: 計列(x 380-400)に数値または＊を持つ行
  const keiTok = ws.filter((w) => w.x >= 380 && w.x < 400 && (NUM.test(w.t) || /^＊/.test(w.t) || /^\*/.test(w.t)));
  const stateAt = (y) => {
    let k = sg.startKind, c = sg.startCourse;
    for (const e of evs) if (e.y <= y) { k = e.kind; c = e.course; }
    return { k, c };
  };
  // ヘッダブロック: 各見出しyから『学校独自』トークン行までを除外
  const hdrBlocks = evs.map((e) => {
    const g = ws.filter((w) => w.t === '学校独自' && w.y > e.y).sort((a, b) => a.y - b.y)[0];
    return { a: e.y - 3, b: (g ? g.y : e.y + 80) + 8 };
  });
  // 連携型見出しだけ (evsは見出し由来)。ページ先頭のヘッダ(頁継続時)も同様に evs に含まれる。
  const inHdr = (y) => hdrBlocks.some((b) => y >= b.a && y <= b.b);
  const rows = [];
  for (const w of keiTok.sort((a, b) => a.y - b.y)) {
    if (inHdr(w.y)) continue;
    if (!rows.find((r) => Math.abs(r.y - w.y) < 4)) rows.push({ y: w.y });
  }
  const near = (y) => rows.reduce((b, r) => (Math.abs(r.y - y) < Math.abs(b.y - y) ? r : b), rows[0]);
  if (!rows.length) continue;
  for (const r of rows) { Object.assign(r, stateAt(r.y)); r.cells = {}; r.dept = []; r.memo = []; r.raw = []; }
  for (const w of ws) {
    if (inHdr(w.y) || w.y < 60) continue;
    const r = rows.find((r) => Math.abs(r.y - w.y) < 4);
    if (w.x >= 128 && w.x < 400) {
      if (!r) continue;
      const cols = r.k === 'sports' ? SCOL : JCOL;
      const c = colOf(cols, w.x);
      if (c) r.cells[c] = (r.cells[c] ? r.cells[c] + ' ' : '') + w.t;
      r.raw.push(Math.round(w.x) + ':' + w.t);
    } else if (w.x >= 62 && w.x < 128) {
      if (!/^※/.test(w.t)) near(w.y).dept.push(w);
    } else if (w.x >= 405) {
      (r || near(w.y)).memo.push(w);
    }
  }
  // 学校名(x<60): 名前の中心と群の行y平均を合わせる連続分割DP(表ごと)
  const names = [];
  for (const w of ws.filter((w) => w.x < 60 && w.y > 60 && !inHdr(w.y) && !/^(学|校|名|全日制課程|定時制課程|推薦入学者選抜|連携型入学者選抜|※|＊)/.test(w.t)).sort((a, b) => a.y - b.y)) {
    const l = names[names.length - 1];
    if (l && w.y - l.y2 <= 14) { l.t += w.t; l.y2 = w.y; l.ys.push(w.y); } else names.push({ t: w.t, y2: w.y, ys: [w.y] });
  }
  names.forEach((n) => (n.c = n.ys.reduce((a, b) => a + b, 0) / n.ys.length));
  // 表(kind|course)ごとに行と名前を分けてDP
  const groups = new Map();
  rows.forEach((r) => { const k = r.k + '|' + r.c; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); });
  for (const [, R] of groups) {
    const y0 = R[0].y - 25, y1 = R[R.length - 1].y + 25;
    const nm = names.filter((n) => n.c >= y0 && n.c <= y1).sort((p, q) => p.c - q.c);
    if (!nm.length) continue;
    const n = R.length, k = nm.length;
    if (k > n) { R.forEach((r) => (r.school = nm.reduce((b, x) => (Math.abs(x.c - r.y) < Math.abs(b.c - r.y) ? x : b)).t)); continue; }
    const INF = 1e18;
    const cost = (i, j, g) => { let m = 0; for (let t = i; t < j; t++) m += R[t].y; m /= j - i; return (m - nm[g].c) ** 2; };
    const dp = Array.from({ length: k + 1 }, () => Array(n + 1).fill(INF));
    const bk = Array.from({ length: k + 1 }, () => Array(n + 1).fill(-1));
    dp[0][0] = 0;
    for (let g = 1; g <= k; g++) for (let j = g; j <= n; j++) for (let i = g - 1; i < j; i++) {
      if (dp[g - 1][i] >= INF) continue;
      const c = dp[g - 1][i] + cost(i, j, g - 1);
      if (c < dp[g][j]) { dp[g][j] = c; bk[g][j] = i; }
    }
    let j = n;
    for (let g = k; g >= 1; g--) { const i = bk[g][j]; for (let t = i; t < j; t++) R[t].school = nm[g - 1].t; j = i; }
  }
  for (const r of rows) {
    const item = {
      page: sg.pi + 1, course: r.c, school: r.school || '', dept: r.dept.sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join('').replace(/[（(]/g, '(').replace(/[）)]/g, ')'),
      cells: r.cells, memo: r.memo.sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''),
    };
    out[r.k].push(item);
  }
}
fs.writeFileSync(path.join(dir, 'rows-suisen-r9.json'), JSON.stringify(out, null, 1));
console.log('R9 jiko', out.jiko.length, 'sports', out.sports.length, 'renkei', out.renkei.length, '/ R8 jiko', JIKO.length, 'sports', SPORTS.length, 'renkei', RENKEI.length);
