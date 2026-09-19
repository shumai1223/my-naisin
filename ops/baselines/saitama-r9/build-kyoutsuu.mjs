// T-Y14 saitama R9: 概要一覧(共通選抜のみ・1_r9_kyoutsuu.pdf 8頁)を pdftotext -bbox の座標から学校別に機械抽出する。
// 各学校は「募集割合(第1次%・第2次%)」を持つy行(=主行)を1つ持つ。名前/課程/学科/学学校選択問題/面接方法/配点/第2志望/その他を、主行±150pxの窓から列のx範囲で拾う。
// 使い方: pdftotext -bbox 1_r9_kyoutsuu.pdf 1.bbox.html && node build-kyoutsuu.mjs > rows-kyoutsuu.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, process.argv[2] || '1.bbox.html'), 'utf8').split('<page ').slice(1);
const out = [];
pages.forEach((pg, pi) => {
  const pageRows = [];
  const hdrY0 = (pgws) => Math.max(0, ...pgws.filter((w) => w.t === '学検' && w.y < 2200).map((w) => w.y)) + 20;
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], x2: +m[3], t: z(m[5]) }));
  const hdrY = hdrY0(ws);
  // 主行: 第1次募集割合(x3200-3450)の "NN%"
  const mains = ws.filter((w) => w.x >= 3200 && w.x < 3450 && /^\d+%$/.test(w.t)).sort((a, b) => a.y - b.y);
  for (const m of mains) {
    const win = ws.filter((w) => w.y >= m.y - 150 && w.y <= m.y + 150);
    const near = (lo, hi, dy = 40) => win.filter((w) => w.x >= lo && w.x < hi && Math.abs(w.y - m.y) <= dy).sort((a, b) => a.y - b.y || a.x - b.x);
    const nameToks = win.filter((w) => w.x < 1800 && Math.abs(w.y - m.y) <= 60).sort((a, b) => a.y - b.y);
    const course = win.find((w) => w.x >= 1900 && w.x < 2200 && /^[全定]$/.test(w.t) && Math.abs(w.y - m.y) <= 60)?.t || '';
    const nearestMain = (y) => mains.reduce((b, x) => (Math.abs(x.y - y) < Math.abs(b.y - y) ? x : b), mains[0]);
    const deptToks = ws.filter((w) => w.x >= 2100 && w.x < 3100 && w.y > hdrY && nearestMain(w.y) === m && !/^(全|定)$/.test(w.t) && !/%$/.test(w.t)).sort((a, b) => a.y - b.y || a.x - b.x);
    const num = (lo, hi) => { const t = near(lo, hi, 60).find((w) => /^\d+$/.test(w.t)); return t ? +t.t : null; };
    const ratio = (lo, hi) => near(lo, hi, 30).map((w) => w.t).join('').replace(/\s/g, '');
    const r = {
      page: pi + 1, y: Math.round(m.y),
      school: nameToks.map((w) => w.t).join(''),
      course, dept: deptToks.map((w) => w.t).join(''),
      pct1: m.t, pct2: near(3450, 3800, 30).find((w) => /%$/.test(w.t))?.t || null,
      gakkoSentaku: near(3850, 4100, 80).some((w) => w.t === '○'),
      ratio1: ratio(4150, 4700), ch1: (() => { const t = near(4700, 4950, 30).find((w) => /^\d+$/.test(w.t)); return t ? +t.t : null; })(),
      ratio2: ratio(5000, 5550), ch2: (() => { const t = near(5550, 5800, 30).find((w) => /^\d+$/.test(w.t)); return t ? +t.t : null; })(),
      itvType: near(5850, 6150, 30).map((w) => w.t).join(''),
      itvOwn: near(6200, 6600, 60).map((w) => w.t).join(''),
      s1: { gaku: num(6550, 6800), cho: num(6820, 7100), itv: num(7120, 7400), total: num(7420, 7700) },
      s2: { gaku: num(7800, 8100), cho: num(8110, 8450), itv: num(8460, 8800), total: num(8810, 9100) },
      second: win.filter((w) => w.x >= 9100 && w.x < 10300 && Math.abs(w.y - m.y) <= 130).sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''),
      other: win.filter((w) => w.x >= 10300 && Math.abs(w.y - m.y) <= 130).sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''),
    };
    pageRows.push(r);
    out.push(r);
  }
  // 学校名: 名前の中心yと各群の行y平均が合うように行を連続群へ分割するDP(学科が複数行に分かれる学校で名前が行から離れる場合の救済)
  const hdrBottom = Math.max(0, ...ws.filter((w) => /^(1年|2年|３年|3年|合計)$/.test(w.t) && w.x > 4000 && w.x < 9000 && w.y < 1600).map((w) => w.y)) + 20;
  const names = [];
  for (const w of ws.filter((w) => w.x < 1800 && w.y > hdrBottom && w.t !== '学校名' && !/^[※\d]/.test(w.t)).sort((a, b) => a.y - b.y)) {
    const l = names[names.length - 1];
    if (l && w.y - l.y2 <= 60) { l.t += w.t; l.ys.push(w.y); l.y2 = w.y; } else names.push({ t: w.t, ys: [w.y], y2: w.y });
  }
  names.forEach((n) => (n.c = n.ys.reduce((a, b) => a + b, 0) / n.ys.length));
  const R = pageRows.sort((a, b) => a.y - b.y);
  if (names.length && names.length <= R.length) {
    const n = R.length, k = names.length, INF = 1e18;
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
    for (let g = k; g >= 1; g--) { const i = bk[g][j]; for (let t = i; t < j; t++) R[t].schoolDP = names[g - 1].t; j = i; }
  } else console.error('page', pi + 1, 'names', names.length, 'rows', R.length);
});
fs.writeFileSync(path.join(dir, process.argv[3] || 'rows-kyoutsuu.json'), JSON.stringify(out, null, 1));
console.error('rows', out.length);


