// 一次ソースの鮮度チェック（E-E-A-T／信頼の堀の保守）。
//
// total-score・education-cost・prefecture-sources の各データに付けた lastChecked（最終確認日）を走査し、
// 古くなった出典を検出する。入試・学費データは年度で更新されるため、毎年の再確認が信頼の前提。
//
// 使い方:
//   npm run check:freshness            # レポート表示（180日超を警告／365日超で exit 1）
//   node scripts/check-freshness.mjs --days 270   # しきい値を変更
//
// CI/週次儀式で実行し、stale な出典を一次情報で再確認→lastChecked を更新する運用。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--days') { a.days = Number(argv[i + 1]); i++; }
  }
  return a;
}
const args = parseArgs(process.argv.slice(2));
const WARN_DAYS = Number.isFinite(args.days) ? args.days : 180; // 半年で警告
const FAIL_DAYS = 365; // 1年超は失敗（年度データとして確実に古い）

/** src 配下の .ts を再帰列挙。 */
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === '__tests__' || e.name === 'node_modules') continue;
      out.push(...walk(p));
    } else if (e.name.endsWith('.ts') && !e.name.endsWith('.d.ts')) {
      out.push(p);
    }
  }
  return out;
}

const LAST_CHECKED_RE = /lastChecked:\s*'(\d{4}-\d{2}-\d{2})'/g;
const DOC_TITLE_RE = /docTitle:\s*'([^']+)'/;

const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;

const findings = [];
for (const file of walk(SRC)) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    LAST_CHECKED_RE.lastIndex = 0;
    const m = LAST_CHECKED_RE.exec(line);
    if (!m) return;
    const date = m[1];
    const ageDays = Math.floor((now - new Date(date + 'T00:00:00Z').getTime()) / DAY);
    // 近傍（上下3行）から docTitle を拾って文脈を付ける
    let label = '';
    for (let d = -3; d <= 3; d++) {
      const t = lines[i + d];
      if (t) {
        const dm = DOC_TITLE_RE.exec(t);
        if (dm) { label = dm[1]; break; }
      }
    }
    findings.push({ file: path.relative(ROOT, file), line: i + 1, date, ageDays, label });
  });
}

findings.sort((a, b) => b.ageDays - a.ageDays);

const stale = findings.filter((f) => f.ageDays >= WARN_DAYS);
const failed = findings.filter((f) => f.ageDays >= FAIL_DAYS);

console.log(`🗓️  一次ソース鮮度チェック（${findings.length}件の lastChecked）`);
console.log(`   しきい値: 警告 ${WARN_DAYS}日 / 失敗 ${FAIL_DAYS}日　基準日: ${new Date().toISOString().slice(0, 10)}\n`);

if (findings.length === 0) {
  console.log('   lastChecked が見つかりませんでした。');
  process.exit(0);
}

const oldest = findings[0];
console.log(`   最古: ${oldest.date}（${oldest.ageDays}日前）${oldest.label ? ' — ' + oldest.label : ''}  [${oldest.file}:${oldest.line}]`);

if (stale.length === 0) {
  console.log(`\n✅ すべての出典が ${WARN_DAYS}日以内に確認済みです。`);
  process.exit(0);
}

console.log(`\n⚠️  ${WARN_DAYS}日以上 未確認の出典: ${stale.length}件`);
for (const f of stale.slice(0, 40)) {
  const flag = f.ageDays >= FAIL_DAYS ? '❌' : '⚠️ ';
  console.log(`   ${flag} ${f.date}（${f.ageDays}日）${f.label ? ' — ' + f.label : ''}  [${f.file}:${f.line}]`);
}

if (failed.length > 0) {
  console.log(`\n❌ ${FAIL_DAYS}日超の出典が ${failed.length}件あります。一次情報で再確認し lastChecked を更新してください。`);
  process.exit(1);
}
console.log('\n（警告のみ。年度替わりに合わせて再確認を推奨）');
process.exit(0);
