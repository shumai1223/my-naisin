#!/usr/bin/env node
/**
 * T-TD1 TD-10: ops/baselines/td1-funnel-2026-10.md の送信記録から、撤退条件(a)(b)を判定する。
 * 使い方: node scripts/td1-funnel-judge.mjs [--file <md>] [--today YYYY-MM-DD]
 */
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(n);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const file = opt('--file', 'ops/baselines/td1-funnel-2026-10.md');
const today = opt('--today', new Date().toISOString().slice(0, 10));
const text = fs.readFileSync(file, 'utf8');
const start = text.indexOf('## 送信記録');
const end = text.indexOf('## 判定式');
const rows = text
  .slice(start, end)
  .split('\n')
  .filter((l) => l.trim().startsWith('|'))
  .slice(2) // ヘッダ行と区切り行
  .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
  .filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c[0] ?? ''));

const sent = rows.length;
const replies = rows.filter((c) => /^\d{4}-\d{2}-\d{2}$/.test(c[3] ?? '')).length;
const conv = rows.filter((c) => c[5] === '1').length;
const intent = rows.filter((c) => c[6] === '1').length;
const orders = rows.filter((c) => c[7] === '1').length;
console.log(`基準日 ${today}`);
console.log(`送信 ${sent} / 返信 ${replies} / 会話 ${conv} / 購入意向 ${intent} / 発注 ${orders}`);
console.log(`返信率 ${sent ? ((replies / sent) * 100).toFixed(1) : '-'}%`);

let a;
if (sent < 11) a = '判定保留（送り先11組織のうち送信済みが11未満）';
else if (sent >= 100) a = replies / sent < 0.01 ? '中止（返信率1%未満）' : '継続';
else a = replies === 0 ? '中止（送信100未満・返信0件）' : '継続（送信100未満・返信1件以上）';
const aDue = today >= '2026-10-31' ? '' : '（期日 2026-10-31 前の暫定）';
console.log(`反証(a) 10/31: ${a}${aDue}`);
const b = sent < 11 ? '判定保留（送信済みが11未満）' : intent === 0 ? '中止（購入意向0社）' : '継続';
const bDue = today >= '2026-11-30' ? '' : '（期日 2026-11-30 前の暫定）';
console.log(`反証(b) 11/30: ${b}${bDue}`);
