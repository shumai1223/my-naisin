// T-SC1 学校ページSERP実験の読み出し（差の差・学校単位ブートストラップ）。
//
// 使い方:
//   1) 実験期間のページ別GSCを取る:
//      node --use-system-ca scripts/gsc-pull.mjs --start YYYY-MM-DD --end YYYY-MM-DD --dimensions page --limit 25000 --out <exp.json>
//   2) node scripts/school-serp-readout.mjs <exp.json> [--out ops/baselines/weekly/school-serp-readout-YYYY-MM-DD.md]
//
// 基準期間 = ops/baselines/school-serp-baseline-2026-11.json（10/8〜11/3）。
// 判断ルール = ops/baselines/school-serp-decision-rules-2026-11.md（結果を見る前に固定済み。ここでは変えない）。
import fs from 'node:fs';

const args = process.argv.slice(2);
const expPath = args.find((a) => !a.startsWith('--'));
const outIdx = args.indexOf('--out');
const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
if (!expPath) {
  console.error('usage: node scripts/school-serp-readout.mjs <exp.json> [--out file.md]');
  process.exit(2);
}

const assign = JSON.parse(fs.readFileSync('src/data/school-serp-experiment-2026-11.json', 'utf8'));
const base = JSON.parse(fs.readFileSync('ops/baselines/school-serp-baseline-2026-11.json', 'utf8'));
const exp = JSON.parse(fs.readFileSync(expPath, 'utf8'));

const baseBy = new Map(base.pages.map((p) => [`${p.code}/${p.schoolCode}`, p]));
const expBy = new Map();
for (const r of exp.rows) {
  const m = r.page.match(/^https:\/\/my-naishin\.com\/pref\/([a-z]+)\/school\/([^/?#]+)$/);
  if (m) expBy.set(`${m[1]}/${m[2]}`, r);
}

const schools = { A: [], B: [], C: [] };
for (const [key, arm] of Object.entries(assign.assignment)) {
  const b = baseBy.get(key);
  const e = expBy.get(key);
  schools[arm].push({
    bi: b?.impressions ?? 0,
    bc: b?.clicks ?? 0,
    bp: b?.position ?? 0,
    ei: e?.impressions ?? 0,
    ec: e?.clicks ?? 0,
    ep: e?.position ?? 0,
  });
}

const agg = (list) => {
  const s = list.reduce((a, x) => ({ bi: a.bi + x.bi, bc: a.bc + x.bc, ei: a.ei + x.ei, ec: a.ec + x.ec }), { bi: 0, bc: 0, ei: 0, ec: 0 });
  return { ...s, ctrBase: s.bc / s.bi, ctrExp: s.ec / s.ei };
};
// 基準期間と実験期間の日数が違っても比較できるよう、表示1回あたりのCTRで見る。
const ratio = (a) => a.ctrExp / a.ctrBase;

function mulberry(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry(20261106);
const resample = (list) => Array.from({ length: list.length }, () => list[Math.floor(rand() * list.length)]);

const N = 2000;
const result = {};
const aggA = agg(schools.A);
for (const arm of ['B', 'C']) {
  const aggX = agg(schools[arm]);
  const point = ratio(aggX) / ratio(aggA) - 1;
  const draws = [];
  for (let i = 0; i < N; i++) {
    const rx = agg(resample(schools[arm]));
    const ra = agg(resample(schools.A));
    draws.push(ratio(rx) / ratio(ra) - 1);
  }
  draws.sort((a, b) => a - b);
  // 2比較(B vs A, C vs A)なので 97.5% 区間（両側1.25%）
  const lo = draws[Math.floor(N * 0.0125)];
  const hi = draws[Math.floor(N * 0.9875)];
  const posOf = (list, k) => {
    const w = list.reduce((s, x) => s + x[k === 'b' ? 'bi' : 'ei'], 0);
    return list.reduce((s, x) => s + x[k === 'b' ? 'bp' : 'ep'] * x[k === 'b' ? 'bi' : 'ei'], 0) / w;
  };
  const dPos = posOf(schools[arm], 'e') - posOf(schools[arm], 'b') - (posOf(schools.A, 'e') - posOf(schools.A, 'b'));
  const impShare = (aggX.ei / aggX.bi) / (aggA.ei / aggA.bi) - 1;
  result[arm] = { point, lo, hi, dPos, impShare, agg: aggX };
}

const pct = (x) => (x * 100).toFixed(1) + '%';
const lines = [];
lines.push(`# 学校ページSERP実験 読み出し（実験期間データ: ${expPath}）`);
lines.push('');
lines.push(`基準期間: ${base.period.start}〜${base.period.end}／対象 ${assign.eligibleSchools} 校（A/B/C = ${schools.A.length}/${schools.B.length}/${schools.C.length}）`);
lines.push('');
lines.push('| 群 | 基準 表示 | 基準 クリック | 基準CTR | 実験 表示 | 実験 クリック | 実験CTR |');
lines.push('|---|---|---|---|---|---|---|');
for (const arm of ['A', 'B', 'C']) {
  const a = agg(schools[arm]);
  lines.push(`| ${arm} | ${a.bi} | ${a.bc} | ${(a.ctrBase * 100).toFixed(2)}% | ${a.ei} | ${a.ec} | ${(a.ctrExp * 100).toFixed(2)}% |`);
}
lines.push('');
lines.push('| 比較 | CTRの差の差（A比・相対） | 97.5%区間 | 順位の差の差（正=悪化） | 表示数の差の差（A比・相対） |');
lines.push('|---|---|---|---|---|');
for (const arm of ['B', 'C']) {
  const r = result[arm];
  lines.push(`| ${arm} vs A | ${pct(r.point)} | ${pct(r.lo)} 〜 ${pct(r.hi)} | ${r.dPos.toFixed(2)} | ${pct(r.impShare)} |`);
}
lines.push('');
lines.push('判定は ops/baselines/school-serp-decision-rules-2026-11.md に従う（このスクリプトは数字を出すだけ）。');
const text = lines.join('\n') + '\n';
console.log(text);
if (outPath) fs.writeFileSync(outPath, text);
