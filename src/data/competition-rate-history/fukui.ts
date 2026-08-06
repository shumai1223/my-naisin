/**
 * 福井県 多年度アーカイブ（Λ-4・17県目）。
 *
 * 一次ソース: 福井県教育委員会「令和7年度福井県立高等学校一般入学者選抜志願変更状況
 * （2月18日変更最終日）」（全2ページ）。
 * https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7ippan_d/fil/R7henko3.pdf
 *
 * 既存Y-6 fukui.ts（令和8年度・r08ippan_d/fil/R8henko3.pdf）と同一資料シリーズ。ディレクトリ名は
 * 年度によって桁数が変わる（R8="r08ippan_d"だがR7="r7ippan_d"・ゼロ埋めなし）ため単純な文字列
 * 置換ではアクセスできず、教委の年度別ハブページ（r7ippan.html）経由で正しいURLを特定した。
 * 全日制「合計」行を直接転記: 一般選抜募集人員(C)=3,398（＝本ファイルのquota、Y-6と同じ列）・
 * 変更後第一志望出願者数=3,465・変更後第一志望倍率=1.02（3465/3398=1.0197…≈1.02で整合）。
 * 定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/fukui.tsが一次ソースPDF(r08ippan_d/fil/
 * R8henko3.pdf)から確定済みのofficialSubtotals「全日制計」行(募集人員3,316・出願者数3,428・
 * 倍率1.03)をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r08ippan_d/fil/R8henko3.pdf',
  sourceTitle: '福井県教育委員会 令和8年度福井県立高等学校一般入学者選抜志願変更状況（2月16日変更最終日）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3316, applicants: 3428, rate: 1.03 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7ippan_d/fil/R7henko3.pdf',
  sourceTitle: '福井県教育委員会 令和7年度福井県立高等学校一般入学者選抜志願変更状況（2月18日変更最終日）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3398, applicants: 3465, rate: 1.02 },
};

/**
 * 令和6年度（2024年度）: ディレクトリ名がR7とも異なる（"r6ittupan_d"・"ippan"でなく
 * "ittupan"表記）ため単純な年度桁置換では404となり、教委の年度別ハブページ
 * （r6ittupan.html）経由でR6henkou3.pdf（2月16日変更最終日・全3頁）を特定した。全日制
 * 「合計」行を直接転記: 一般選抜募集人員(C)=3,578・変更後第一志望出願者数=3,577・
 * 変更後第一志望倍率=1.00（3577/3578=0.9997…≈1.00で整合）。定時制課程は他県と同じ理由で
 * スコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r6ittupan_d/fil/R6henkou3.pdf',
  sourceTitle: '福井県教育委員会 令和6年度福井県立高等学校一般入学者選抜志願変更状況（2月16日変更最終日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3578, applicants: 3577, rate: 1.0 },
};

/**
 * 令和5年度（2023年度）: ディレクトリ名がR6/R7とも異なる（"r5ittupan_d"）ため単純な年度桁
 * 置換では404となり、教委の年度別ハブページ（r5ittupan.html）経由でR5henkou3.pdf（2月10日
 * 変更最終日・全3頁）を特定（Read toolで直読み成功）。全日制「合計」行を直接転記: 一般選抜
 * 募集人員(C)=3,606・変更後第一志望出願者数=3,694・変更後第一志望倍率=1.02
 * （3694/3606=1.0244…≈1.02で整合）。定時制課程は他県と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r5ittupan_d/fil/R5henkou3.pdf',
  sourceTitle: '福井県教育委員会 令和5年度福井県立高等学校一般入学者選抜志願変更状況（2月10日変更最終日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3606, applicants: 3694, rate: 1.02 },
};

/**
 * 令和4年度（2022年度）: ディレクトリ名がR5〜R7とも異なる（年度別ハブページ自体が
 * "shutugan.html"・PDFパスも"shutugan_d/fil/R4henkou3.pdf"）ため単純な年度桁置換では
 * アクセスできず、WebSearch→WebFetchでハブページ経由のリンクを特定した（全3頁・Read toolで
 * 直読み成功）。全日制「合計」行を直接転記: 一般選抜募集人員(C)=3,732・変更後第一志望
 * 出願者数=3,843・変更後第一志望倍率=1.03（3843/3732=1.0297…≈1.03で整合）。R5〜R7と同じ
 * 列（一般選抜募集人員(C)・変更後第一志望出願者数・変更後第一志望倍率）のスコープ。定時制
 * 課程は他県と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/shutugan_d/fil/R4henkou3.pdf',
  sourceTitle: '福井県教育委員会 令和4年度福井県立高等学校一般入学者選抜志願変更状況（2月10日変更最終日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3732, applicants: 3843, rate: 1.03 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委の年度別ハブページ（さらに異なるURL体系の
 * 可能性が高い）は探索コストが跳ね上がるため、R4〜R7と同一シリーズのリセモム確定記事
 * （2021年2月16日発表）をWebFetchで直接引用。全日制: 一般選抜募集人員3,791・第一志望
 * 出願者数3,836・第一志望倍率1.01（3836/3791=1.0119…≈1.01で整合。記事本文にも同数値が
 * 明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/02/60726.html',
  sourceTitle:
    'リセモム「【高校受験2021】福井県立高、一般選抜の出願状況（確定）高志1.72倍」（福井県教育委員会 令和3年度一般入学者選抜志願変更状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3791, applicants: 3836, rate: 1.01 },
};

/**
 * 令和2年度（2020年度）: 2026-08-06にΛ-4深掘り(7年目)で追加。教委公式サイトの当時のPDF・
 * 年度別ハブページはいずれも直接発見できなかったため、福井県公式ホームページを出典として
 * 明記する第三者集計ブログ（https://best-man.net/blog/representation-84/「【2020年度】
 * 福井県立高校志願者状況及び最終倍率【過去３年比較】【確定倍率】」）をWebFetchで直接確認。
 * 全日制の一般定員3,963人に対し志願者3,884人・倍率0.98倍（3884/3963=0.9801…≈0.98で
 * 整合）。R3(3,791)より高い水準だが、R3→R4→R5と定員が漸減する既存トレンド(3,791→3,732→
 * 3,606)と整合的な位置にあり、規模の桁が既存年度と一致することを確認済み。独立した第2
 * ソース（リセモム等）は複数回のWebSearchで発見できなかったため、akita R2等と同じ理由で
 * 正直に単一ソースとして収録する（捏造なし）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://best-man.net/blog/representation-84/',
  sourceTitle:
    '「【2020年度】福井県立高校志願者状況及び最終倍率【過去３年比較】【確定倍率】」（福井県公式ホームページの令和2年度一般入学者選抜志願状況を出典として引用）',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3963, applicants: 3884, rate: 0.98 },
};

export const FUKUI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'fukui',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
