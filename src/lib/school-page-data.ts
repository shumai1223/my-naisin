/**
 * 個別学校ページ(Λ-2)のデータ層＝1県パイロット第一歩。
 *
 * 👤裁定(2026-08-01・47県展開・fable5-fullaccel-backlog-2026-07のΛ-2行参照)に基づく設計:
 *  - ①今季倍率＝学校固有の一次データ(competition-rates)をページの主役に置く
 *  - ④**今季倍率が無い学校(=学校名がschool-masterと突合できない学校を含む)はページを
 *    作らずスキップする**（school-name-match.tsの'no-match'/'ambiguous'は安全側に倒し
 *    誤った学校にデータを紐付けない・ここは緩めない）
 *  - 学科(department)別の複数レコードを持つ学校は、募集人員/応募者数を合算した
 *    「学校全体の今季倍率」を併せて算出する(表示側でどちらを使うか選べるようにする)
 *
 * ②(県内区分の多年度推移)は`getSchoolCategoryTrends`で実装済み(department→Λ-4カテゴリの
 * 対応表はschool-department-category.tsに分離・都道府県ごとに個別検証が必要)。
 * ③(近隣校リンク3本)は`selectNearbySchools`で実装済み(area=学区が全学科レコードで一致する
 * ことを東京都167校の実データで確認済み・2026-08-01)。
 */
import type { SchoolRecord } from '@/lib/school-master';
import type { CompetitionRateRecord } from '@/lib/competition-rate';
import type { PrefectureRateHistoryFile } from '@/lib/competition-rate-history';
import { matchSchoolNames, type SchoolCodeMatchResult } from '@/lib/school-name-match';
import { resolveCategoryLabel } from '@/lib/school-department-category';

export interface SchoolPageData {
  schoolCode: string;
  schoolName: string;
  address: string;
  /** この学校の今季倍率レコード(学科別・複数あり得る)。 */
  departmentRates: CompetitionRateRecord[];
  /** 学科別の募集人員・応募者数を合算した学校全体の値。 */
  totalQuota: number;
  totalApplicants: number;
  /** totalApplicants / totalQuota（小数第2位までの参考値。公式倍率は各departmentRates.finalRateを優先表示すること）。 */
  overallRate: number;
  /** 学区(市区町村等)。一次資料にareaが無い県ではundefined（近隣校選定は同区分の学校が対象外になる）。 */
  area?: string;
}

export interface SchoolPageDataSkipEntry {
  schoolName: string;
  reason: 'no-match' | 'ambiguous';
}

export interface PrefectureSchoolPageDataResult {
  schools: SchoolPageData[];
  skipped: SchoolPageDataSkipEntry[];
}

/**
 * 1県分の学校マスターと今季倍率レコードから、個別学校ページに必要なデータを組み立てる（純粋関数）。
 * 学校名→schoolCodeの突合ができない学校は正直にskippedへ回す（誤った紐付けをしない）。
 * nameAliases: 県独自の略称慣習（miyagiの「工業→工」等・school-name-aliases.ts参照）を
 * 明示的な対応表として適用する。表示・レコード紐付けは常に元のschoolName(競争率データ側の
 * 生の表記)を使い、aliasは突合のためだけに使う（結果が壊れないよう突合後に元名へ戻す）。
 */
export function buildSchoolPageDataForPrefecture(
  masterRecords: SchoolRecord[],
  rateRecords: CompetitionRateRecord[],
  nameAliases: Record<string, string> = {}
): PrefectureSchoolPageDataResult {
  const schoolNames = rateRecords.map((r) => r.schoolName);
  const aliasedNames = schoolNames.map((n) => nameAliases[n] ?? n);
  const matchSummary = matchSchoolNames(aliasedNames, masterRecords);

  const matchByAliasedName = new Map<string, SchoolCodeMatchResult>();
  for (const result of matchSummary.results) matchByAliasedName.set(result.inputName, result);

  const matchByName = new Map<string, SchoolCodeMatchResult>();
  for (const original of new Set(schoolNames)) {
    const aliased = nameAliases[original] ?? original;
    const result = matchByAliasedName.get(aliased);
    if (result) matchByName.set(original, { ...result, inputName: original });
  }

  const recordsByName = new Map<string, CompetitionRateRecord[]>();
  for (const rec of rateRecords) {
    const list = recordsByName.get(rec.schoolName) ?? [];
    list.push(rec);
    recordsByName.set(rec.schoolName, list);
  }

  const schools: SchoolPageData[] = [];
  const skipped: SchoolPageDataSkipEntry[] = [];

  for (const [schoolName, match] of matchByName) {
    if (match.reason !== 'matched' || !match.matchedCode || !match.matchedFullName) {
      skipped.push({ schoolName, reason: match.reason === 'ambiguous' ? 'ambiguous' : 'no-match' });
      continue;
    }
    const departmentRates = recordsByName.get(schoolName) ?? [];
    const totalQuota = departmentRates.reduce((acc, r) => acc + r.quota, 0);
    const totalApplicants = departmentRates.reduce((acc, r) => acc + r.finalApplicants, 0);
    const overallRate = totalQuota > 0 ? Math.round((totalApplicants / totalQuota) * 100) / 100 : 0;
    // area(学区)は全学科レコードで一致する前提(東京都167校の実データで確認済み)。
    // 念のため先頭レコードの値を採用し、無ければundefined(近隣校選定の対象外になるだけで安全)。
    const area = departmentRates[0]?.area;

    schools.push({
      schoolCode: match.matchedCode,
      schoolName: match.matchedFullName,
      address: masterRecords.find((m) => m.code === match.matchedCode)?.address ?? '',
      departmentRates,
      totalQuota,
      totalApplicants,
      overallRate,
      area,
    });
  }

  return { schools, skipped };
}

export interface NearbySchool {
  schoolCode: string;
  schoolName: string;
  area?: string;
  overallRate: number;
}

export interface NearbySchoolResult {
  schools: NearbySchool[];
  /** 'area'=同一学区で選出／'rate-fallback'=学区で選べず同一県内の倍率近似でフォールバック。 */
  matchType: 'area' | 'rate-fallback';
}

/**
 * 近隣校リンク（③・同一県かつ同一学区(area)の他校、または学区で選べない場合は同一県内で
 * 倍率が近い他校）を最大maxCount件選ぶ（純粋関数）。
 *
 * まず同一area内で候補を探す。1件も無い場合（targetにareaが無い／同じareaの他校がいない）は
 * 同一県内で今季倍率が近い順にフォールバックする。フォールバックは学区の一致を主張せず、
 * 事実として存在する「倍率が近い他校」を返すのみのためY-0憲法（捏造ゼロ）に抵触しない。
 * 呼び出し側は`matchType`でどちらが実際に使われたかを判別し、見出し文言を出し分けること
 * （「同じ学区」と表示しながら実際は県内フォールバックの結果、という誤表示を避けるため）。
 *
 * 2026-08-02発見：`school-page-wave-readiness.ts`でwave2候補41県を機械採点した結果、実に39県が
 * area情報0%だった。さらに、area情報がある稼働中のtokyo/kanagawaでも「同じ学区に他校が1つも無い」
 * 学校が実在し、旧実装（area不在時のみフォールバック）では0件のままだった＝既にindex解禁済みの
 * ページで「①今季倍率②多年度推移③近隣校リンク3本以上」という1ページの下限品質に違反していた。
 * 選定順は「今季倍率が近い順」（受験生にとって併願候補として比較しやすいため）。
 * 同率の場合はschoolCodeの昇順で決定論を保つ（テスト可能性・表示の安定性のため）。
 */
export function selectNearbySchools(
  target: SchoolPageData,
  allSchools: SchoolPageData[],
  maxCount = 3
): NearbySchoolResult {
  const sameAreaPool = target.area
    ? allSchools.filter((s) => s.schoolCode !== target.schoolCode && s.area === target.area)
    : [];
  const usingFallback = sameAreaPool.length === 0;
  const pool = usingFallback ? allSchools.filter((s) => s.schoolCode !== target.schoolCode) : sameAreaPool;

  const sorted = [...pool].sort((a, b) => {
    const diff = Math.abs(a.overallRate - target.overallRate) - Math.abs(b.overallRate - target.overallRate);
    if (diff !== 0) return diff;
    return a.schoolCode.localeCompare(b.schoolCode);
  });
  return {
    schools: sorted.slice(0, maxCount).map((s) => ({
      schoolCode: s.schoolCode,
      schoolName: s.schoolName,
      area: s.area,
      overallRate: s.overallRate,
    })),
    matchType: usingFallback ? 'rate-fallback' : 'area',
  };
}

export interface CategoryTrendPoint {
  fiscalYear: string;
  rate: number;
}

export interface CategoryTrend {
  categoryLabel: string;
  points: CategoryTrendPoint[];
  /** 'category-detail'=同じ学科区分の高校のみを集計。'grand-total-only'=県内の全日制高校全体の合計(区分別データが原資料に無い県)。 */
  granularity: 'category-detail' | 'grand-total-only';
}

/**
 * 学校の学科(departmentRates)からΛ-4カテゴリを解決し、県内区分の多年度推移を組み立てる（純粋関数）。
 * ②「その学校の学科が属する県内区分の多年度推移を『県全体の傾向』として粒度を明示して併記する」
 * (👤裁定2026-08-01)の実装。**これは学校固有のデータではなく県全体の傾向**であることを
 * 呼び出し側(表示コンポーネント)が必ず明示すること（誤解を招かないため）。
 * 対応表が無い都道府県・学科は正直に何も返さない（あいまいな推測はしない）。
 * 1つの学校が複数学科を持つ場合、解決できたカテゴリを重複排除してすべて返す。
 *
 * **grand-total-only県のフォールバック(Λ+1・2026-08-01)**: 神奈川/千葉/兵庫のように、
 * 原資料自体が学科区分別集計を公表しておらず全県合計(grandTotal)のみを記録している県は、
 * department→category対応表(school-department-category.ts)を作りようがない（区分自体が
 * 存在しないため、対応表が「無い」のではなく元データにそもそも区分が無い）。この場合は
 * 学科によらず全県合計の推移をそのまま「県全体の傾向」として提示する（これは推測ではなく
 * 原資料の構造そのものであり、Y-0憲法の「1データ点1出典」に反しない）。
 */
export function getSchoolCategoryTrends(
  prefectureCode: string,
  school: SchoolPageData,
  history: PrefectureRateHistoryFile | undefined
): CategoryTrend[] {
  if (!history || history.years.length === 0) return [];

  const departments = [...new Set(school.departmentRates.map((r) => r.department))];
  const categoryLabels = [...new Set(departments.map((d) => resolveCategoryLabel(prefectureCode, d)).filter((l): l is string => l !== null))];

  if (categoryLabels.length > 0) {
    return categoryLabels
      .map((categoryLabel) => {
        const points: CategoryTrendPoint[] = [];
        for (const year of history.years) {
          const entry = year.categories.find((c) => c.label === categoryLabel);
          if (entry) points.push({ fiscalYear: year.fiscalYear, rate: entry.rate });
        }
        return { categoryLabel, points, granularity: 'category-detail' as const };
      })
      .filter((trend) => trend.points.length > 0);
  }

  const allGrandTotalOnly = history.years.every((y) => y.granularity === 'grand-total-only');
  if (!allGrandTotalOnly) return [];

  const label = history.years[0].grandTotal.label;
  const points: CategoryTrendPoint[] = history.years.map((y) => ({ fiscalYear: y.fiscalYear, rate: y.grandTotal.rate }));
  return [{ categoryLabel: label, points, granularity: 'grand-total-only' as const }];
}
