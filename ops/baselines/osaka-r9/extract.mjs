// T-Y14 osaka: pdftotext -bbox の座標から (学校名, 問題種類3字, 倍率タイプ, 選抜区分) を頁ごとに抽出する。
// 使い方: node extract.mjs <r8|r9>  (事前に MiKTeX の pdftotext -bbox で <v>.html を作る)
import fs from 'fs';
const v = process.argv[2];
const html = fs.readFileSync(`${v}.html`, 'utf8');
const pages = html.split('<page ').slice(1);
const out = [];
pages.forEach((pg, pi) => {
  const words = [...pg.matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g)]
    .map(m => ({ x: +m[1], y: +m[2], x2: +m[3], y2: +m[4], t: m[5] }));
  const isNameCh = w => w.x < 58 && w.t.length === 1 && !'学校名'.includes(w.t) || (w.x < 58 && w.y > 100 && w.t.length === 1);
  const names = words.filter(w => w.x < 58 && w.t.length === 1 && w.y > 95 || (w.x < 58 && w.t.length === 1 && w.y <= 95 && !'学校名'.includes(w.t))).sort((a, b) => a.y - b.y);
  // 縦書き名を y の連続(次の文字が 22pt 以内)でクラスタ化
  const clusters = [];
  for (const w of names) {
    const last = clusters[clusters.length - 1];
    if (last && w.y - last.ys[last.ys.length - 1] < 22) { last.s += w.t; last.ys.push(w.y); }
    else clusters.push({ s: w.t, ys: [w.y] });
  }
  clusters.forEach(c => { c.c = (c.ys[0] + c.ys[c.ys.length - 1] + 9) / 2; });
  const nums = words.filter(w => w.x > 535 && /^[ⅠⅡⅢⅣⅤ]$/.test(w.t));
  for (const n of nums) {
    const row = words.filter(w => Math.abs(w.y - n.y) < 3 && w.x > 490 && w.x < 535 && /^[ＡＢＣ]$/.test(w.t)).sort((a, b) => a.x - b.x).map(w => w.t).join('');
    // 選抜区分の縦文字 (x 483-494) を n.y 付近から集める
    const cat = words.filter(w => w.x > 480 && w.x < 496 && w.t.length === 1 && w.y > n.y - 30 && w.y < n.y + 20 && /[一般特別帰国日本語指導]/.test(w.t)).sort((a, b) => a.y - b.y).map(w => w.t).join('');
    let best = null;
    for (const c of clusters) { const d = Math.abs(c.c - (n.y + 5)); if (!best || d < best.d) best = { d, s: c.s }; }
    out.push({ p: pi + 1, name: best ? best.s : '?', d: best ? Math.round(best.d) : -1, triple: row, type: n.t, cat, y: Math.round(n.y) });
  }
});
fs.writeFileSync(`${v}-rows.json`, JSON.stringify(out, null, 0));
console.log(v, 'rows', out.length, 'far(d>25)', out.filter(o => o.d > 25).length, 'noTriple', out.filter(o => o.triple.length !== 3).length);
