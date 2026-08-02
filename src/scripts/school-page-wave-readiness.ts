/**
 * Λ-2 学校ページ横展開の「次の波」候補を機械的に採点するレポート（Y-0憲法: 推測をせず実データのみで判定）。
 *
 * INDEXED_SCHOOL_PAGE_PREFECTURE_CODES(school-page-lookup.ts)に未収録の都道府県について、
 * competition-rate-history(Λ-4)のgranularityと、school-name-match(Λ-2)の突合精度・area(学区)
 * フィールドの有無を機械的に集計する。department→category対応表(school-department-category.ts)
 * の追加なしに品質ゲート②を満たせるのは granularity==='grand-total-only' の県のみ（getSchoolCategoryTrends
 * のフォールバックが自動的に効くため）。category-detail県は対応表が別途必要（未対応ならtrendsSatisfiedはfalse）。
 *
 * 実行: npx tsx src/scripts/school-page-wave-readiness.ts
 */
import { SCHOOL_MASTER_BY_PREFECTURE } from '@/data/schools';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { COMPETITION_RATE_HISTORY_BY_PREFECTURE } from '@/data/competition-rate-history';
import { matchSchoolNames } from '@/lib/school-name-match';
import { DEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTURE } from '@/lib/school-department-category';
import { INDEXED_SCHOOL_PAGE_PREFECTURE_CODES } from '@/lib/school-page-lookup';
import { SCHOOL_NAME_ALIASES_BY_PREFECTURE } from '@/lib/school-name-aliases';
import { PREFECTURES } from '@/lib/prefectures';

interface ReadinessRow {
  code: string;
  name: string;
  hasHistory: boolean;
  granularity: 'grand-total-only' | 'category-detail' | 'mixed' | 'n/a';
  trendsSatisfied: boolean;
  totalSchools: number;
  matched: number;
  noMatch: number;
  ambiguous: number;
  matchRate: number;
  areaCoverage: number;
}

function evaluate(code: string): ReadinessRow | null {
  const master = SCHOOL_MASTER_BY_PREFECTURE[code];
  const rates = COMPETITION_RATE_BY_PREFECTURE[code];
  const name = PREFECTURES.find((p) => p.code === code)?.name ?? code;
  if (!master || !rates) return null;

  const aliases = SCHOOL_NAME_ALIASES_BY_PREFECTURE[code] ?? {};
  const schoolNames = rates.records.map((r) => aliases[r.schoolName] ?? r.schoolName);
  const summary = matchSchoolNames(schoolNames, master.schools);
  const matchRate = summary.results.length > 0 ? summary.matchedCount / summary.results.length : 0;

  const withArea = rates.records.filter((r) => r.area && r.area.trim().length > 0).length;
  const areaCoverage = rates.records.length > 0 ? withArea / rates.records.length : 0;

  const history = COMPETITION_RATE_HISTORY_BY_PREFECTURE[code];
  const hasHistory = !!history && history.years.length > 0;
  let granularity: ReadinessRow['granularity'] = 'n/a';
  if (hasHistory) {
    const set = new Set(history!.years.map((y) => y.granularity));
    granularity = set.size > 1 ? 'mixed' : ([...set][0] as 'grand-total-only' | 'category-detail');
  }
  const hasMappingTable = !!DEPARTMENT_TO_CATEGORY_LABEL_BY_PREFECTURE[code];
  const trendsSatisfied = hasHistory && (granularity === 'grand-total-only' || granularity === 'mixed' || hasMappingTable);

  return {
    code,
    name,
    hasHistory,
    granularity,
    trendsSatisfied,
    totalSchools: summary.results.length,
    matched: summary.matchedCount,
    noMatch: summary.noMatchCount,
    ambiguous: summary.ambiguousCount,
    matchRate,
    areaCoverage,
  };
}

function main() {
  const candidates = Object.keys(COMPETITION_RATE_BY_PREFECTURE).filter(
    (code) => !INDEXED_SCHOOL_PAGE_PREFECTURE_CODES.includes(code)
  );

  const rows = candidates.map(evaluate).filter((r): r is ReadinessRow => r !== null);

  // 品質ゲート①(突合精度)②(推移データ)を両方満たすものを「即座にindex解禁可能」として選抜。
  // wave1の選定基準(大市場県=学校数の多い県)を踏襲し、準備できている県の中から学校数の多い順に並べる。
  const ready = rows
    .filter((r) => r.trendsSatisfied && r.matchRate >= 0.95)
    .sort((a, b) => b.totalSchools - a.totalSchools);

  const blocked = rows.filter((r) => !r.trendsSatisfied || r.matchRate < 0.95);

  console.log(`\n=== Λ-2 次波候補レポート（既収録${INDEXED_SCHOOL_PAGE_PREFECTURE_CODES.length}県を除く${rows.length}県を評価） ===\n`);
  console.log(`即座に解禁可能(trendsSatisfied && matchRate>=95%): ${ready.length}県`);
  for (const r of ready) {
    console.log(
      `  ${r.code}(${r.name}): 学校${r.totalSchools} match=${(r.matchRate * 100).toFixed(1)}% area=${(r.areaCoverage * 100).toFixed(0)}% granularity=${r.granularity}`
    );
  }

  console.log(`\n未準備・要対応: ${blocked.length}県`);
  for (const r of blocked) {
    const reasons: string[] = [];
    if (!r.hasHistory) reasons.push('Λ-4履歴なし');
    else if (!r.trendsSatisfied) reasons.push(`category-detailだが対応表未整備(granularity=${r.granularity})`);
    if (r.matchRate < 0.95) reasons.push(`match率低い(${(r.matchRate * 100).toFixed(1)}%・no-match${r.noMatch}/ambiguous${r.ambiguous})`);
    console.log(`  ${r.code}(${r.name}): ${reasons.join(' / ')}`);
  }
  console.log('');
}

main();
