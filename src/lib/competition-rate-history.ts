/**
 * 多年度アーカイブ（Λ-4・X-14本格化）の型・純関数群。
 *
 * Y-2の競争率（単年度・学校粒度）とは別に、教委が毎年公表する「総括表」
 * （学科区分ごとの校数・募集人員・応募人員・倍率の集計）を年度別に蓄積する。
 *
 * 設計判断（なぜ学校粒度でないか）: 総括表PDFは「（　）は昨年度の数値である」の
 * 注記どおり、1枚のPDFに当該年度と前年度の2年分の区分別集計が同時に載っている
 * ケースが多い（東京都で実測確認済み）。学校粒度の個票を年度ごとに1から転記する
 * （Y-6と同等の労力）より、教委が既に集計した区分別データを年度分あわせて拾う方が
 * 転記ミスのリスクが低く、5年分×47都道府県という規模に対して現実的にスケールする。
 * 学校粒度の推移が必要になった場合はY-2と同じ設計（PrefectureCompetitionRateFile）を
 * 年度別に拡張する形で別途対応する（本モジュールのスコープ外）。
 */

export interface CategoryRateEntry {
  /** 公表資料の区分ラベル（例: '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計'）。 */
  label: string;
  /** 当該区分の学校数。原資料に記載が無い年度はundefined（正直に欠測扱い）。 */
  schoolCount?: number;
  quota: number;
  applicants: number;
  rate: number;
}

export interface YearSnapshot {
  /** 例: '令和7年度（2025年度）'。 */
  fiscalYear: string;
  /** この年度分の数値がどのPDFから来たか（当該年度分・前年度分どちらの表記由来かを問わず記録）。 */
  sourceUrl: string;
  sourceTitle: string;
  fetchedAt: string;
  /** 原資料が「今年度実数／（前年度実数）」の形で2年分を併記している場合、この年度分がどちら由来かを記録する。 */
  origin: 'current-year-column' | 'prior-year-parenthetical';
  categories: CategoryRateEntry[];
  /** 全日制合計等、原資料の最上位集計行（突合対象）。 */
  grandTotal: CategoryRateEntry;
}

export interface PrefectureRateHistoryFile {
  prefectureCode: string;
  years: YearSnapshot[];
}

/** categoriesのquota/applicantsを積み上げる（都道府県非依存の純粋集計）。 */
export function sumCategories(categories: CategoryRateEntry[]): { quota: number; applicants: number } {
  return categories.reduce(
    (acc, c) => ({ quota: acc.quota + c.quota, applicants: acc.applicants + c.applicants }),
    { quota: 0, applicants: 0 }
  );
}

export interface GrandTotalCheckResult {
  fiscalYear: string;
  expectedQuota: number;
  actualQuota: number;
  expectedApplicants: number;
  actualApplicants: number;
  matches: boolean;
}

/**
 * 1年度分のスナップショットについて、指定したpredicateで絞り込んだcategoriesの合計が
 * grandTotal（またはpredicate対象の上位集計行）と一致するかを確認する。
 */
export function checkYearTotal(
  snapshot: YearSnapshot,
  target: CategoryRateEntry,
  predicate: (c: CategoryRateEntry) => boolean
): GrandTotalCheckResult {
  const matched = snapshot.categories.filter(predicate);
  const sums = sumCategories(matched);
  return {
    fiscalYear: snapshot.fiscalYear,
    expectedQuota: target.quota,
    actualQuota: sums.quota,
    expectedApplicants: target.applicants,
    actualApplicants: sums.applicants,
    matches: sums.quota === target.quota && sums.applicants === target.applicants,
  };
}
