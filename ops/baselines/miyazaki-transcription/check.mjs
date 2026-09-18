// T-Y14 miyazaki: data.mjs の各行で 学力検査+面接+適性検査等+調査書 = 計 を検算する。使い方: node ops/baselines/miyazaki-transcription/check.mjs
import { ROWS } from './data.mjs';
let bad = 0;
for (const r of ROWS) {
  const s = (r.subj ? r.subj.reduce((a, b) => a + b, 0) : 0) + r.itv + (r.tek || 0) + r.cho;
  if (s !== r.kei) {
    bad++;
    console.log('MISMATCH', r.school, r.dept, s, r.kei);
  }
}
const sum = (c) => ROWS.filter((r) => r.course === c).reduce((a, r) => a + r.teiin, 0);
console.log('rows', ROWS.length, 'bad', bad, 'schools', new Set(ROWS.map((r) => r.school)).size, '全日制定員', sum('全日制'), '定時制定員', sum('定時制'));

// --- 推薦・連携型(data-suisen.mjs) ---
import { JIKO, SPORTS, RENKEI } from './data-suisen.mjs';
const pts = (r) => (r.g ? r.g.reduce((a, b) => a + (b || 0), 0) : 0) + (r.itv || 0) + (r.sho || 0) + (r.saku || 0) + (r.jitsu || 0) + (r.gaku || 0) + (r.jiko || 0) + (r.cho || 0);
let bad2 = 0;
for (const [label, list] of [['自己推薦', JIKO], ['スポーツ', SPORTS], ['連携型', RENKEI]]) {
  for (const r of list) {
    if (r.kei == null) continue;
    if (pts(r) !== r.kei) { bad2++; console.log('SUISEN MISMATCH', label, r.school, r.dept || r.act, pts(r), r.kei); }
  }
}
// 定員: 一般選抜表と一致 / 募集人員=定員×割合(附属中設置の理数科は資料の注記による算出のため除外)
let bad3 = 0;
const key = (c, s, d) => `${c}|${s}|${d.replace(/(昼間部|夜間部)/, (m) => (m === '昼間部' ? '昼間' : '夜間'))}`;
const gen = new Map(ROWS.map((r) => [key(r.course, r.school, r.dept), r]));
for (const r of JIKO) {
  const g = gen.get(key(r.course, r.school, r.dept));
  if (!g) { bad3++; console.log('NO GENERAL ROW', r.course, r.school, r.dept); continue; }
  if (g.teiin !== r.teiin) { bad3++; console.log('TEIIN DIFF', r.school, r.dept, g.teiin, r.teiin); }
  const special = r.dept === '理数';
  if (!special && Math.round((r.teiin * r.pct) / 100) !== r.nin) { bad3++; console.log('NIN DIFF', r.school, r.dept, r.teiin, r.pct, r.nin); }
}
const sumN = (l) => l.reduce((a, r) => a + r.nin, 0);
console.log('自己推薦', JIKO.length, 'スポーツ', SPORTS.length, '連携型', RENKEI.length, '合計不一致', bad2, '定員/割合不一致', bad3, '自己推薦の募集人員 全日制', sumN(JIKO.filter((r) => r.course === '全日制')), '定時制', sumN(JIKO.filter((r) => r.course === '定時制')));
