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
 *
 * **令和6年度（2026-08-04追加）**: 一次ソースは「令和6年度神奈川県公立高等学校入学者
 * 選抜一般募集共通選抜等の志願者数集計結果の概要」（別紙1・県公式ページr6shigansyasu.htmlの
 * リンク先PDF、1月31日時点）で募集人員39,947人/志願者数47,349人/倍率1.19倍（自己記載の
 * 丸め値）。この1/31時点値は志願変更前の速報であり、確定値は令和7年度版別紙1に埋め込まれた
 * 「前年度」列（2月7日・志願変更締切時点）の39,947人/47,330人（倍率47330/39947=1.1848≈
 * 1.18で、R7版PDF本文の「前年度 1.18倍」表記とも一致）。募集人員は両ソースで完全一致（誤読
 * リスクなし）。**確定値として2/7時点（志願変更締切時）の47,330人を採用**し、1/31速報値
 * 47,349人は不採用（R7年度の記録方針＝志願変更締切時データに統一するため）。学校数は
 * 両ソースとも全日制145校[県立131 市立14]で一致。
 *
 * **令和5年度（2026-08-04追加）**: 県公式ページの令和5年度専用ページ（r1913978.html・
 * r5.html）は404（chiba/ibaraki/miyazaki/kagoshimaのR4版と同型の、教委が旧年度ページを
 * 整理・削除するパターン）。そのため①令和6年度別紙1に埋め込まれた「前年度」列（2月1日
 * 時点・募集人員40,930人/志願者数48,133人）と②リセマム確定記事（2023-02-08付「神奈川県
 * 公立高、志願倍率（確定）」・募集人員4万930人/出願者数4万8,082人/倍率1.17倍）の独立2
 * ソースでクロスチェック。募集人員は両ソースで完全一致（誤読リスクなし）。志願者数は
 * 48,133人（2/1速報）と48,082人（確定・リセマムの明言する「確定」版）の差51人は志願変更
 * による減少で説明可能。**リセマムが明示的に「確定」と明記する48,082人を採用**し、R6/R7と
 * 同じ「最終確定値を採録する」方針を維持。学校数はリセマム記事に県全体の記載が無く、
 * 令和6年度別紙1の前年度注記「（前年度146校）」により全日制146校のみ確認（県立/市立
 * 内訳は不明のため未記載）。
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

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.kanagawa.jp/documents/134289/bessi---1.pdf',
  sourceTitle: '神奈川県教育委員会 令和7年度神奈川県公立高等学校入学者選抜一般募集共通選抜等の志願者数（志願変更締切時）集計結果の概要（別紙1）前年度列（令和6年度・2月7日時点）',
  fetchedAt: '2026-08-04',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（特別募集・中途退学者募集を除く）', schoolCount: 145, quota: 39947, applicants: 47330, rate: 1.18 },
};

const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/08/70817.html',
  sourceTitle: 'リセマム「【高校受験2023】神奈川県公立高、志願倍率（確定）横浜翠嵐1.98倍」（2023-02-08付・県公式ページ404のため二次ソース採用）',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（特別募集・中途退学者募集を除く）', schoolCount: 146, quota: 40930, applicants: 48082, rate: 1.17 },
};

export const KANAGAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kanagawa',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
