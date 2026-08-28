#!/usr/bin/env node
/**
 * T-S1 DoD①: sitemap漏れ333校の診断スクリプト。
 *
 * 47都道府県それぞれについて buildSchoolPageDataForPrefecture の skipped（学校名突合に失敗した
 * 今季倍率データ）を集計し、「県 / 倍率データ側の学校名 / reason(no-match|ambiguous) / マスタ側の
 * 近い候補（前方一致・部分一致）」を出力する。エイリアス追加の判断材料にするための読み取り専用診断。
 *
 * 実行: npx tsx scripts/check-school-name-gaps.mjs [県コード…] （省略時は全47県）
 *
 * ⚠️ この環境ではtsxが静的importで.tsファイルをCJS変換する際、named exportの静的検出が
 * ファイルによって不安定になる（同じファイルでも単独読込では通り、複数importの組み合わせでは
 * defaultに畳み込まれることがある）ため、全moduleを動的importで読み込みnamed→default両対応の
 * フォールバックを付ける。
 */
async function importModule(path, exportName) {
  const mod = await import(path);
  return exportName in mod ? mod[exportName] : mod.default[exportName];
}

const SCHOOL_MASTER_BY_PREFECTURE = await importModule('../src/data/schools/index.ts', 'SCHOOL_MASTER_BY_PREFECTURE');
const COMPETITION_RATE_BY_PREFECTURE = await importModule(
  '../src/data/competition-rates/index.ts',
  'COMPETITION_RATE_BY_PREFECTURE'
);
const buildSchoolPageDataForPrefecture = await importModule(
  '../src/lib/school-page-data.ts',
  'buildSchoolPageDataForPrefecture'
);
const SCHOOL_NAME_ALIASES_BY_PREFECTURE = await importModule(
  '../src/lib/school-name-aliases.ts',
  'SCHOOL_NAME_ALIASES_BY_PREFECTURE'
);
const PREFECTURES = await importModule('../src/lib/prefectures.ts', 'PREFECTURES');

/** マスタ側の学校名から、突合失敗した学校名に近い候補を探す（前方一致・部分一致のみ・断定はしない）。 */
function findCandidates(schoolName, masterRecords) {
  const stripped = schoolName.replace(/立|県|市|町|村|高等学校|高校/g, '');
  const hits = masterRecords
    .filter((m) => {
      const mStripped = m.name.replace(/立|県|市|町|村|高等学校|高校/g, '');
      return mStripped.includes(stripped.slice(0, 3)) || stripped.includes(mStripped.slice(0, 3));
    })
    .map((m) => m.name)
    .slice(0, 5);
  return hits;
}

const argCodes = process.argv.slice(2);
const targetCodes = argCodes.length > 0 ? argCodes : PREFECTURES.map((p) => p.code);

let totalSkipped = 0;
const byPrefecture = [];

for (const code of targetCodes) {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  if (!master || !rates) continue;
  const currentYearRecords = rates.records.filter((r) => !r.fiscalYear);
  const nameAliases = SCHOOL_NAME_ALIASES_BY_PREFECTURE[code] ?? {};
  const { schools, skipped } = buildSchoolPageDataForPrefecture(master.schools, currentYearRecords, nameAliases);

  if (skipped.length === 0) continue;
  totalSkipped += skipped.length;
  byPrefecture.push({ code, matched: schools.length, skippedCount: skipped.length, skipped });
}

byPrefecture.sort((a, b) => b.skippedCount - a.skippedCount);

console.log(`# 学校名突合の漏れ診断（${targetCodes.length}県対象・漏れ合計${totalSkipped}件）\n`);
for (const { code, matched, skippedCount, skipped } of byPrefecture) {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  console.log(`## ${code}（一致${matched}校・漏れ${skippedCount}件）`);
  for (const s of skipped) {
    const candidates = findCandidates(s.schoolName, master.schools);
    console.log(`  - [${s.reason}] "${s.schoolName}"  近い候補: ${candidates.length > 0 ? candidates.join(' / ') : '(候補なし)'}`);
  }
  console.log('');
}
console.log(`合計: ${byPrefecture.length}県で${totalSkipped}件の漏れ`);
