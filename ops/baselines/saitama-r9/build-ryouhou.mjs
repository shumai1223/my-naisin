// T-Y14 saitama R9: 概要一覧(共通選抜のみ・1_r9_kyoutsuu.pdf 8頁)を pdftotext -bbox の座標から学校別に機械抽出する。
// 各学校は「募集割合(第1次%・第2次%)」を持つy行(=主行)を1つ持つ。名前/課程/学科/学学校選択問題/面接方法/配点/第2志望/その他を、主行±150pxの窓から列のx範囲で拾う。
// 使い方: pdftotext -bbox 1_r9_kyoutsuu.pdf 1.bbox.html && node build-kyoutsuu.mjs > rows-kyoutsuu.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const z = (s) => s.normalize('NFKC');
const pages = fs.readFileSync(path.join(dir, '3.bbox.html'), 'utf8').split('<page ').slice(1);
const out = [];
pages.forEach((pg, pi) => {
  const pageRows = [];
  const hdrY0 = (pgws) => Math.max(0, ...pgws.filter((w) => w.t === '学検' && w.y < 2200).map((w) => w.y)) + 20;
  const ws = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)].map((m) => ({ x: +m[1], y: +m[2], x2: +m[3], t: z(m[5]) }));
  const hdrY = hdrY0(ws);
  // 主行: 第1次募集割合(x3200-3450)の "NN%"
  const mains = ws.filter((w) => w.x >= 2050 && w.x < 2400 && /^\d+%$/.test(w.t)).sort((a, b) => a.y - b.y);
  for (const m of mains) {
    const win = ws.filter((w) => w.y >= m.y - 150 && w.y <= m.y + 150);
    const near = (lo, hi, dy = 40) => win.filter((w) => w.x >= lo && w.x < hi && Math.abs(w.y - m.y) <= dy).sort((a, b) => a.y - b.y || a.x - b.x);
    const nameToks = win.filter((w) => w.x < 1100 && Math.abs(w.y - m.y) <= 100).sort((a, b) => a.y - b.y);
    const course = win.find((w) => w.x >= 1100 && w.x < 1400 && /^[全定]$/.test(w.t) && Math.abs(w.y - m.y) <= 60)?.t || '';
    const nearestMain = (y) => mains.reduce((b, x) => (Math.abs(x.y - y) < Math.abs(b.y - y) ? x : b), mains[0]);
    const deptToks = ws.filter((w) => w.x >= 1300 && w.x < 2000 && w.y > hdrY && nearestMain(w.y) === m && !/^(全|定)$/.test(w.t) && !/%$/.test(w.t)).sort((a, b) => a.y - b.y || a.x - b.x);
    const num = (lo, hi) => { const t = near(lo, hi, 60).find((w) => /^\d+$/.test(w.t)); return t ? +t.t : null; };
    const ratio = (lo, hi) => near(lo, hi, 30).map((w) => w.t).join('').replace(/\s/g, '');
    const r = {
      page: pi + 1, y: Math.round(m.y),
      school: nameToks.map((w) => w.t).join(''),
      course, dept: deptToks.map((w) => w.t).join(''),
      pct1: m.t, pct2: near(2450, 2800, 30).find((w) => /%$/.test(w.t))?.t || null,
      keisha: win.filter((w) => w.x >= 2850 && w.x < 3750 && Math.abs(w.y - m.y) <= 160).sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''),
      gakkoSentaku: near(3850, 4100, 80).some((w) => w.t === '○'),
      ratio1: ratio(4250, 4650), ch1: (() => { const t = near(4650, 4900, 30).find((w) => /^\d+$/.test(w.t)); return t ? +t.t : null; })(),
      ratio2: ratio(4950, 5450), ch2: (() => { const t = near(5450, 5700, 30).find((w) => /^\d+$/.test(w.t)); return t ? +t.t : null; })(),
      itvType: near(5750, 6000, 30).map((w) => w.t).join(''),
      itvOwn: near(6100, 6400, 60).map((w) => w.t).join(''),
      tokusyokuKensa: near(6350, 6650, 60).map((w) => w.t).join(''),
      s1: { gaku: num(6650, 6900), cho: num(6900, 7150), itv: num(7150, 7400), toku: num(7400, 7700), total: num(7700, 7950) },
      s2: { gaku: num(8000, 8250), cho: num(8250, 8500), itv: num(8500, 8750), toku: null, total: num(8750, 9000) },
      second: win.filter((w) => w.x >= 9000 && w.x < 9900 && Math.abs(w.y - m.y) <= 130).sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''),
      other: win.filter((w) => w.x >= 9900 && Math.abs(w.y - m.y) <= 130).sort((a, b) => a.y - b.y || a.x - b.x).map((w) => w.t).join(''),
    };
    pageRows.push(r);
    out.push(r);
  }
  // 学校名: 名前の中心yと各群の行y平均が合うように行を連続群へ分割するDP(学科が複数行に分かれる学校で名前が行から離れる場合の救済)
  const hdrBottom = Math.max(0, ...ws.filter((w) => /^(1年|2年|３年|3年|合計)$/.test(w.t) && w.x > 4000 && w.x < 9000 && w.y < 1800).map((w) => w.y)) + 20;
  const names = [];
  for (const w of ws.filter((w) => w.x < 1100 && w.y > hdrBottom && w.t !== '学校名' && !/^[※\d]/.test(w.t)).sort((a, b) => a.y - b.y)) {
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
fs.writeFileSync(path.join(dir, process.argv[3] || 'rows-ryouhou.json'), JSON.stringify(out, null, 1));
console.error('rows', out.length);



