/**
 * Y-11（冬の倍率速報体制）フェーズ2: 速報データの取込ロジック（純関数のみ・I/Oなし）。
 *
 * `src/data/interim-rate-bulletin-registry.ts`（フェーズ1・栃木を除く全46都道府県の
 * 「先行速報公表パターン」台帳）を安全弁として使う。教委が速報段階で倍率を公表していない県
 * （`interimIncludesRate: false`）に対しては、このモジュールは**倍率を一切計算・出力しない**
 * （Y-0憲法「捏造ゼロ」）。台帳が`unconfirmed`/`not-investigated`の県（先行速報の実在自体が
 * 未確認の県）は`null`を返し機能させない（安全側に倒す設計）。
 *
 * 前年同時期比（`yearOverYearApplicants`）は「確定数どうしの単純な差分・比率計算」であり、
 * 教委非公表の値を推測するものではないため、台帳の状態によらず常に計算してよい。
 *
 * 実際のライブ速報データの取得（スクレイピング等）は本モジュールのスコープ外。速報面
 * フロントエンド（「未確定・参考値」の明示UI）は次フェーズで扱う。
 */
import type { InterimBulletinPrefectureEntry } from '@/data/interim-rate-bulletin-registry';
import type { CompetitionRateRecord } from '@/lib/competition-rate';

/** 速報データ1件の入力（教委が発表した「当初出願状況」等の中間公表値を転記する想定）。 */
export interface InterimRateSubmission {
  schoolName: string;
  department: string;
  quota: number;
  /** 速報段階の出願者数（教委公表値をそのまま転記）。 */
  interimApplicants: number;
  /**
   * 速報段階で倍率が公表されている場合のみ渡す（教委公表値をそのまま転記・独自計算はしない）。
   * 台帳の`interimIncludesRate`が`false`の県では、渡しても`ingestInterimBulletin`が破棄する。
   */
  interimRate?: number;
  /** この速報を観測・記録した日付（ISO 8601等）。 */
  observedAt: string;
}

/** 前年同時期比の算出結果（確定数どうしの単純な差分・比率であり、倍率の推測ではない）。 */
export interface YearOverYearApplicants {
  priorYearFinalApplicants: number;
  diff: number;
  /** priorYearFinalApplicantsが0の場合はnull（0除算を推測値で埋めない）。 */
  ratio: number | null;
}

/** 取込結果1件（「未確定・参考値」であることをstatusで明示する）。 */
export interface InterimRateBulletinRecord {
  prefectureCode: string;
  schoolName: string;
  department: string;
  quota: number;
  interimApplicants: number;
  /** 台帳がinterimIncludesRate:trueの県のみ値が入る。それ以外は必ずnull。 */
  interimRate: number | null;
  yearOverYearApplicants?: YearOverYearApplicants;
  /** 速報値であり確定値ではないことを示す固定ステータス（フロントエンドのUI分岐に使う）。 */
  status: 'preliminary';
  observedAt: string;
}

function submissionKey(schoolName: string, department: string): string {
  return `${schoolName}|${department}`;
}

/**
 * 確定済み過去データ（`CompetitionRateRecord[]`）から、前年同時期比の算出に使う
 * 「学校名+学科名→最終応募人員」のマップを作る。同一キーが複数回出現する場合は
 * 最後に見つかった値で上書きする（呼び出し側で単一年度分のrecordsに絞ってから渡す想定）。
 */
export function buildPriorYearFinalMap(records: CompetitionRateRecord[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of records) {
    map.set(submissionKey(r.schoolName, r.department), r.finalApplicants);
  }
  return map;
}

/**
 * 速報データ群を取り込み、公開可能な「速報値レコード」に変換する（純関数）。
 *
 * - 台帳に存在しない県、または`status`が`'unconfirmed'`/`'not-investigated'`の県は`null`を返す
 *   （先行速報の実在自体が確認できていない県で機能させない）。
 * - `interimIncludesRate`が`true`の県のみ`interimRate`を転記する。それ以外は常に`null`
 *   （送信元が誤ってrateを渡してきても、教委非公表の県では出力しない＝安全側の実装）。
 * - `priorYearFinalMap`が渡された場合、キーが一致する提出について前年同時期比を計算する。
 */
export function ingestInterimBulletin(
  prefectureCode: string,
  submissions: InterimRateSubmission[],
  registry: InterimBulletinPrefectureEntry[],
  priorYearFinalMap?: Map<string, number>
): InterimRateBulletinRecord[] | null {
  const entry = registry.find((e) => e.prefectureCode === prefectureCode);
  if (!entry) return null;
  if (entry.status === 'unconfirmed' || entry.status === 'not-investigated') return null;

  return submissions.map((s) => {
    const key = submissionKey(s.schoolName, s.department);
    const prior = priorYearFinalMap?.get(key);
    const yearOverYearApplicants: YearOverYearApplicants | undefined =
      prior === undefined
        ? undefined
        : {
            priorYearFinalApplicants: prior,
            diff: s.interimApplicants - prior,
            ratio: prior === 0 ? null : s.interimApplicants / prior,
          };

    return {
      prefectureCode,
      schoolName: s.schoolName,
      department: s.department,
      quota: s.quota,
      interimApplicants: s.interimApplicants,
      interimRate: entry.interimIncludesRate === true ? s.interimRate ?? null : null,
      yearOverYearApplicants,
      status: 'preliminary',
      observedAt: s.observedAt,
    };
  });
}
