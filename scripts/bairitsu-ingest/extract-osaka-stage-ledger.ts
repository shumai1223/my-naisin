#!/usr/bin/env -S npx tsx
/**
 * T-Y11F §5順序#7・段階台帳8県目=osaka。
 *
 * 「入学状況概要」xlsx(r08nyugakujokyogaiyo.xlsx)のsheet16(一般選抜・全日制)から
 * 学校×学科粒度でquota(A)/志願者数(C・第1志望)/受験者数(第1志望)/合格者数(D・第1志望)を
 * 抽出し、既存 competition-rates/osaka.ts のR8レコード(165件・quota+finalApplicantsまで
 * 検証済み)と(schoolNameRaw正規化, quota, applicants)の3つ組で突合する。
 */
import { parseXlsxFile } from '@/lib/xlsx-parse';
import { OSAKA_COMPETITION_RATES } from '@/data/competition-rates/osaka';

const path = process.argv[2];
if (!path) {
  console.error('usage: npx tsx scripts/bairitsu-ingest/extract-osaka-stage-ledger.ts <xlsx path>');
  process.exit(1);
}

function normalizeSchoolName(raw: string): string {
  // "府立　東淀川" -> "東淀川" / "東大阪市立　日新" -> "東大阪市立日新"
  const parts = raw.split('　'); // fullwidth space
  if (parts[0] === '府立') return parts.slice(1).join('');
  return parts.join('');
}

interface RawRow {
  schoolName: string;
  departmentRaw: string;
  quota: number;
  applicants1st: number | null;
  testTakers1st: number | null;
  finalPassers1st: number | null;
}

const wb = parseXlsxFile(path);
const rows = wb.sheets['sheet16'];
if (!rows) {
  console.error('sheet16 not found');
  process.exit(1);
}

const rawRows: RawRow[] = [];
let currentSchool: string | null = null;
for (const row of rows) {
  if (!row) continue;
  const col0 = row[0];
  const quota = row[3];
  const deptRaw = row[1];
  if (typeof quota !== 'number' || !deptRaw || col0 === '合計' || col0 === '総計') continue;
  if (row[2]) continue; // 設置者(府立/市立/計)が入っている行は小計行
  if (String(deptRaw).includes('計')) continue; // 「〇〇の計」小計ラベル行
  // データ行そのものにschoolNameが入っていれば、そのschoolNameが新しい学校の開始
  // (「府立」「市立」という文字列パターンに依存しない: 大阪府教育センター附属のような
  // 例外校名にも対応するため)
  if (typeof col0 === 'string' && col0.length > 0) {
    currentSchool = col0;
  }
  if (!currentSchool) continue;
  const toNum = (v: unknown): number | null => (typeof v === 'number' ? v : null);
  rawRows.push({
    schoolName: normalizeSchoolName(currentSchool),
    departmentRaw: String(deptRaw),
    quota,
    applicants1st: toNum(row[13]),
    testTakers1st: toNum(row[14]),
    finalPassers1st: toNum(row[15]),
  });
}

console.log(`抽出行数: ${rawRows.length}`);
const sumQuota = rawRows.reduce((s, r) => s + r.quota, 0);
const sumApplicants = rawRows.reduce((s, r) => s + (r.applicants1st ?? 0), 0);
const sumTestTakers = rawRows.reduce((s, r) => s + (r.testTakers1st ?? 0), 0);
const sumFinalPassers = rawRows.reduce((s, r) => s + (r.finalPassers1st ?? 0), 0);
console.log(`合計 quota=${sumQuota} applicants1st=${sumApplicants} testTakers1st=${sumTestTakers} finalPassers1st=${sumFinalPassers}`);
console.log('資料本文の総計行: quota=31847 志願者数(C計)=33422 受験者数計=33363 合格者数(D計)=29697');

// R8レコードのみ抽出(fiscalYearフィールドを持たないもの)
const r8Records = OSAKA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear);
console.log(`\n既存パイプラインR8レコード数: ${r8Records.length}`);

// ⚠️xlsxはCJK互換漢字(例: 塚のU+FA10異体字)を使う場合があり、パイプライン側の標準字体
// (U+585A)と文字コードが一致しないことがある。NFKCで正規化して突合する
// (出力するschoolNameは常にパイプライン側の正規表記を採用するため実害なし)。
const norm = (s: string) => s.normalize('NFKC');
const matched: Array<RawRow & { pipelineDept: string; pipelineSchoolName: string }> = [];
const unmatched: RawRow[] = [];
for (const raw of rawRows) {
  const candidates = r8Records.filter(
    (r) => norm(r.schoolName) === norm(raw.schoolName) && r.quota === raw.quota && r.finalApplicants === raw.applicants1st
  );
  if (candidates.length === 1) {
    matched.push({ ...raw, pipelineDept: candidates[0].department, pipelineSchoolName: candidates[0].schoolName });
  } else {
    unmatched.push(raw);
  }
}
console.log(`\n一致: ${matched.length}件 / 不一致: ${unmatched.length}件`);
if (unmatched.length > 0) {
  console.log('不一致の内訳:');
  for (const u of unmatched) {
    console.log(
      `  [${u.schoolName}](len=${u.schoolName.length}) / ${u.departmentRaw} / quota=${u.quota} / applicants1st=${u.applicants1st} / testTakers1st=${u.testTakers1st} / finalPassers1st=${u.finalPassers1st}`
    );
    console.log('    codepoints:', [...u.schoolName].map((c) => c.codePointAt(0)!.toString(16)).join(' '));
    const cands = r8Records.filter((r) => r.schoolName === u.schoolName && r.quota === u.quota);
    console.log(`    school+quota候補: ${cands.length}件`, cands.map((c) => `[${c.schoolName}](len=${c.schoolName.length})/${c.department}/applicants=${c.finalApplicants}`));
  }
}

// 既存パイプライン側でマッチしなかったレコードも表示(抽出漏れの可能性)
const matchedKeys = new Set(matched.map((m) => `${m.schoolName}|${m.quota}|${m.applicants1st}`));
const pipelineUnmatched = r8Records.filter((r) => !matchedKeys.has(`${r.schoolName}|${r.quota}|${r.finalApplicants}`));
console.log(`\nパイプライン側で対応する抽出行が見つからなかったレコード: ${pipelineUnmatched.length}件`);
for (const p of pipelineUnmatched) {
  console.log(`  ${p.schoolName} / ${p.department} / quota=${p.quota} / finalApplicants=${p.finalApplicants}`);
}

// 出力用JSON (matched分のみ)
if (process.argv[3] === '--dump') {
  const out = matched.map((m) => ({
    schoolName: m.pipelineSchoolName,
    department: m.pipelineDept,
    quota: m.quota,
    applicantsConfirmed: m.applicants1st,
    testTakersConfirmed: m.testTakers1st,
    finalPassers: m.finalPassers1st,
  }));
  console.log('\n===DUMP_START===');
  console.log(JSON.stringify(out, null, 2));
  console.log('===DUMP_END===');
}
