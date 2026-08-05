/**
 * 鳥取県 多年度アーカイブ（Λ-4・34県目）。
 *
 * 一次ソース: 鳥取県教育委員会「令和7年度鳥取県立高等学校入学者選抜 一般選抜志願状況（確定・
 * 志願変更後）」（2025年2月21日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/21/80931.html
 *
 * 既存Y-6 tottori.tsのURL（.../R08_ippan_saisyuu_shigansya.pdf）は年度桁数の単純置換
 * （R08→R07）が404となり原本PDFへの直接アクセスには至らなかった。教委発表を報じたリセモム記事
 * から「一般選抜の実質募集定員2,936人に対し、志願変更後の志願者数は2,586人」を直接引用
 * （2586/2936=0.8807…≈0.88で整合）。Y-6と同じ「一般選抜（特色選抜等を除く）」のスコープ。
 * 令和6年度は鳥取県公式サイトの一次PDF（4頁・R6saisyu.pdf）を直接発見できたため一次ソースで転記。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/tottori.tsが一次ソースPDF
 * (R08_ippan_saisyuu_shigansya.pdf)から確定済みのofficialSubtotals「全日制計」行
 * (募集定員2,937・志願者数2,334・倍率0.79)をそのまま転記（新規リサーチ不要・R7の二次情報源
 * =リセモムより信頼度の高い一次PDFが直接使える・2026-08-05発見）。quota2,937はR7の
 * 「実質募集定員」2,936とほぼ同水準で同一スコープと確認。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.tottori.lg.jp/secure/1418417/R08_ippan_saisyuu_shigansya.pdf',
  sourceTitle: '鳥取県教育委員会 令和８年度鳥取県立高等学校入学者選抜最終志願者数一覧（全日制課程）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 2937, applicants: 2334, rate: 0.79 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/21/80931.html',
  sourceTitle:
    'リセモム「鳥取県立高、一般選抜の志願状況（確定）」（鳥取県教育委員会 令和7年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 2936, applicants: 2586, rate: 0.88 },
};

/**
 * 令和6年度（2024年度）: 鳥取県教育委員会高等学校課の一次資料「令和6年度県立高等学校一般
 * 入学者選抜最終志願者数等について」（2024年2月22日資料提供）を直接発見（PDFは4頁で
 * pdftoppm不要のRead可）。全日制課程の「計」行（実質募集定員3,048・志願変更締切後の
 * 最終志願者数2,648・競争率0.87）を転記。同資料内の県計行（学校別一覧表側）とも完全一致。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.tottori.lg.jp/secure/1347424/R6saisyu.pdf',
  sourceTitle: '鳥取県教育委員会高等学校課 令和6年度県立高等学校一般入学者選抜最終志願者数等について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 3048, applicants: 2648, rate: 0.87 },
};

/**
 * 令和5年度（2023年度）: 鳥取県教育委員会高等学校課の一次資料「令和5年度県立高等学校一般
 * 入学者選抜最終志願者数等について」（2023年2月24日資料提供・全8頁）を教委の年度別ハブページ
 * (295710.htm)経由でWebSearchにより発見。Read toolで全頁直読み成功。全日制課程「県計」行
 * （実質募集定員3,040・志願変更締切後の最終志願者数2,757・競争率0.91）を転記
 * （2757/3040=0.9069…≈0.91で印字済み値と整合）。R6/R7と同じ「一般選抜（特色選抜等を除く）」
 * のスコープ。定時制課程はR6/R7と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.tottori.lg.jp/secure/1311267/R5ippannsaisyuushigan.pdf',
  sourceTitle: '鳥取県教育委員会高等学校課 令和5年度県立高等学校一般入学者選抜最終志願者数等について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 3040, applicants: 2757, rate: 0.91 },
};

/**
 * 令和4年度（2022年度）: R4年度の一次資料への直接アクセスは失効していたが、令和5年度資料
 * （R5ippannsaisyuushigan.pdf・本ファイルREIWA_5と同一PDF）の県計行に「R4年度」列が並記
 * されており、そこから抽出（東京都等と同じ「当年度＋前年度併記」形式）: 一般入試実質募集定員
 * 3,381・志願変更締切後の最終志願者数3,139・競争率0.93（3139/3381=0.9284…≈0.93で印字済み値
 * と整合）。R5/R6/R7と同じ「一般選抜（特色選抜等を除く）」のスコープ。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.tottori.lg.jp/secure/1311267/R5ippannsaisyuushigan.pdf',
  sourceTitle: '鳥取県教育委員会高等学校課 令和5年度県立高等学校一般入学者選抜最終志願者数等について（前年度＝令和4年度欄）',
  fetchedAt: '2026-08-03',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 3381, applicants: 3139, rate: 0.93 },
};

/**
 * 令和3年度（2021年度）: 鳥取県教育委員会が2021年2月26日に発表した確定志願状況（志願変更後）を
 * 報じたリセモム記事から直接引用: 全日制課程・一般選抜の実質募集定員3,419人に対し志願者数は
 * 3,194人、競争率0.93倍（3194/3419=0.9342…≈0.93で印字済み値と整合）。WebFetchで記事本文を
 * 直接取得し「一般選抜の実質募集定員3,419人に対し志願者数は3,194人で、競争率（倍率）は0.93倍」
 * の引用文を確認済み。独立した第2ソース（教委一次PDF・他媒体記事）は複数回のWebSearchで発見
 * できなかったため、正直にリセモム単一ソースとして収録（捏造なし・R5/R6/R7と同じ「一般選抜
 * （特色選抜等を除く）」のスコープ）。これでtottoriは5年連続（R3〜R7）収録で満了。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/02/60729.html',
  sourceTitle:
    'リセモム「鳥取県立高、一般選抜の志願状況（確定）」（鳥取県教育委員会 令和3年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 3419, applicants: 3194, rate: 0.93 },
};

export const TOTTORI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tottori',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
