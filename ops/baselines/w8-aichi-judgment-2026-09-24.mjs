import { searchconsole } from '@googleapis/searchconsole';
import { getAuthedClient } from '../../scripts/lib/gsc-client.mjs';
const c = searchconsole({ version: 'v1', auth: getAuthedClient() });
const site = 'sc-domain:my-naishin.com';
const COH = 'fukuoka kyoto tochigi nagano gifu okayama miyagi mie kagoshima gunma niigata kumamoto shizuoka nagasaki ehime akita yamagata tokushima kagawa kochi fukui yamanashi okinawa'.split(' ');
async function pull(s, e, mobileJp) {
  const rows = []; let start = 0;
  const filters = [{ dimension: 'page', operator: 'contains', expression: '/school/' }];
  if (mobileJp) filters.push({ dimension: 'device', operator: 'equals', expression: 'MOBILE' }, { dimension: 'country', operator: 'equals', expression: 'jpn' });
  for (;;) {
    const r = await c.searchanalytics.query({ siteUrl: site, requestBody: { startDate: s, endDate: e, dimensions: ['page'], dimensionFilterGroups: [{ filters }], rowLimit: 25000, startRow: start } });
    const got = r.data.rows || []; rows.push(...got); if (got.length < 25000) break; start += 25000;
  }
  const agg = { aichi: [0, 0, 0], coh: [0, 0, 0], other46: [0, 0, 0] };
  for (const r of rows) {
    const pref = r.keys[0].split('/pref/')[1].split('/')[0];
    const add = (k) => { agg[k][0] += r.clicks; agg[k][1] += r.impressions; agg[k][2]++; };
    if (pref === 'aichi') add('aichi'); else { add('other46'); if (COH.includes(pref)) add('coh'); }
  }
  return agg;
}
const W = [
  ['前 8/10-8/23(デプロイ前14日)', '2026-08-10', '2026-08-23'],
  ['後A 9/01-9/14', '2026-09-01', '2026-09-14'],
  ['後B 9/07-9/20', '2026-09-07', '2026-09-20'],
];
for (const mj of [true, false]) {
  console.log(`\n##### ${mj ? 'JP×MOBILE(判定用)' : '全デバイス(参考)'}`);
  const res = [];
  for (const [n, s, e] of W) { const a = await pull(s, e, mj); res.push(a);
    const f = (x) => `${String(x[0]).padStart(4)}cl ${String(x[1]).padStart(6)}imp ${(x[0] / Math.max(x[1], 1) * 100).toFixed(2)}% (${x[2]}URL)`;
    console.log(`${n.padEnd(26)} aichi ${f(a.aichi)} | 23県 ${f(a.coh)} | 他46 ${f(a.other46)}`); }
  const [b, ...afters] = res;
  afters.forEach((a, i) => {
    const d = (k) => ({ cl: (a[k][0] / b[k][0] - 1) * 100, ctr: (a[k][0] / a[k][1] - b[k][0] / b[k][1]) * 100 });
    const A = d('aichi'), C = d('coh'), O = d('other46');
    console.log(`  [${W[i + 1][0]}] 条件②クリック増減率差 aichi ${A.cl.toFixed(1)}% − 23県 ${C.cl.toFixed(1)}% = ${(A.cl - C.cl).toFixed(1)}pt (要≧−10) ／ 対46県 ${(A.cl - O.cl).toFixed(1)}pt`);
    console.log(`  [${W[i + 1][0]}] 条件①CTR差 aichi ${A.ctr.toFixed(2)}pt − 23県 ${C.ctr.toFixed(2)}pt = ${(A.ctr - C.ctr).toFixed(2)}pt (要≧+0.30)`);
  });
}
