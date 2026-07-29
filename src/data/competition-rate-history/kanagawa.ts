/**
 * 神奈川県 多年度アーカイブ（Λ-4・2県目）。
 *
 * 一次ソース: 神奈川県教育委員会「令和7年度神奈川県公立高等学校入学者選抜一般募集共通選抜等
 * の志願者数（志願変更締切時）集計結果の概要」（別紙1）
 * https://www.pref.kanagawa.jp/documents/118051/bessi1.pdf
 * 公表日: 2025-02-07（令和7年度・志願変更締切時）
 *
 * この別紙1は学科別の学校数のみを記載し、募集人員/志願者数/倍率は「全日制の課程」
 * （特別募集・中途退学者募集を除く）の全体集計のみを記載する。学科別の内訳数値は
 * 別紙3（学校別）にのみ存在し、県全体の学科別集計表は公表されていないため、
 * 東京都のようなcategory-detail粒度は原理的に不可能（grand-total-onlyのみ）。
 *
 * **転記精度の教訓（2026-07-29）**: このPDFをRead toolでビジョン解析した際、
 * 令和7年度の志願者数を「46,075人」と誤読した（正しくは46,104人）。神奈川新聞
 * （カナロコ）の報道記事「39395人募集し、46104人が志願」、および令和8年度版
 * 別紙1に埋め込まれた「前年度」列（39,395人/46,104人）の両方と突合して誤読を検知・
 * 修正した。**総括表の複雑な表組みは1件のPDF読み取りだけで確定させず、必ず
 * 独立した二次情報源（報道・翌年度版PDFの前年度列等）で数値をクロスチェックすること**。
 * 令和6年度分は独立した二次情報源での確証が取れなかったため、捏造ゼロ原則により
 * 今回は収録を見送った（正直にスキップ・次回以降の再挑戦候補）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.kanagawa.jp/documents/118051/bessi1.pdf',
  sourceTitle: '神奈川県教育委員会 令和7年度神奈川県公立高等学校入学者選抜一般募集共通選抜等の志願者数（志願変更締切時）集計結果の概要（別紙1）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（特別募集・中途退学者募集を除く）', schoolCount: 142, quota: 39395, applicants: 46104, rate: 1.17 },
};

export const KANAGAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kanagawa',
  years: [REIWA_7],
};
