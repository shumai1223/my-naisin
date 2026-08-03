/**
 * 富山県 多年度アーカイブ（Λ-4・35県目）。
 *
 * 一次ソース: 富山県教育委員会「令和7年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜
 * 志願状況（令和7年2月25日正午現在）」（全3ページ）。
 * https://www.pref.toyama.jp/documents/41799/070225.pdf
 *
 * 既存Y-6 toyama.tsと同一資料シリーズ。教委の年度別ハブページ（07senbatsu.html）経由でR7版を
 * 発見（ファイル名の日付コード080224→070225はY-6と同一パターンだがドキュメントIDも41799→
 * 47208と変わるため単純置換は不発）。「合計 34校82学科」行を直接転記: 推薦入学内定者数等を
 * 除いた募集人数(quota)=5,097・志願者数(applicants)=5,044・倍率(rate)=0.99（5044/5097=
 * 0.9896…≈0.99で印字済み値と整合。Y-6と同じ列定義）。定時制・通信制課程はY-6と同じ理由で
 * スコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.toyama.jp/documents/41799/070225.pdf',
  sourceTitle: '富山県教育委員会 令和7年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜志願状況（令和7年2月25日正午現在）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（34校82学科）', quota: 5097, applicants: 5044, rate: 0.99 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズの一次PDF（060227.pdf・令和6年2月27日正午現在・
 * 全3頁）を教委の年度別ハブページ（06senbatsu.html）経由でWebSearchにより発見。Read toolで
 * 全頁直読み成功。「合計 34校82学科」行（推薦入学内定者数を除いた募集人数5,188・志願者数
 * 5,248・倍率1.01）を転記（5248/5188=1.0116…≈1.01で印字済み値と整合）。3頁目の大学科別
 * 内訳表の合計行（募集定員6,106/推薦内定918/募集人数5,188/志願者数5,248/倍率1.01）とも
 * 完全一致し、同一資料内の二重検証が取れている。定時制・通信制課程はR7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.toyama.jp/documents/34772/060227.pdf',
  sourceTitle: '富山県教育委員会 令和6年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜志願状況（令和6年2月27日正午現在）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（34校82学科）', quota: 5188, applicants: 5248, rate: 1.01 },
};

/**
 * 令和5年度（2023年度）: 教委旧サイト（kengaku.tym.ed.jp）のR5アーカイブページ経由で
 * 同一シリーズの一次PDF（r050227.pdf・令和5年2月27日正午現在・全3頁）を発見・Read toolで
 * 直読み成功。「合計 34校82学科」行（推薦入学内定者数を除いた募集人数5,226・志願者数5,327・
 * 倍率1.02）を転記（5327/5226=1.0193…≈1.02で印字済み値と整合）。3頁目の大学科別内訳表の
 * 合計行（募集定員6,188/推薦内定962/募集人数5,226/志願者数5,327/倍率1.02）とも完全一致し、
 * 同一資料内の二重検証が取れている。定時制・通信制課程はR6/R7と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.kengaku.tym.ed.jp/wp-content/uploads/2023/04/r050227.pdf',
  sourceTitle: '富山県教育委員会 令和5年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜志願状況（令和5年2月27日正午現在）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（34校82学科）', quota: 5226, applicants: 5327, rate: 1.02 },
};

/**
 * 令和4年度（2022年度）: 教委旧サイト（kengaku.tym.ed.jp）のR4発表資料アーカイブページ
 * （archives/401）経由で同一シリーズの一次PDF（r040225.pdf・令和4年2月25日正午現在・全3頁）
 * を発見・Read toolで直読み成功。「合計 34校82学科」行（推薦入学内定者数1,019を除いた
 * 募集人数5,359・志願者数5,594・倍率1.04）を転記（5594/5359=1.0439…≈1.04で印字済み値と
 * 整合）。3頁目の大学科別内訳表の合計行（募集定員6,378/推薦内定1,019/募集人数5,359/
 * 志願者数5,594/倍率1.04）とも完全一致し、同一資料内の二重検証が取れている。定時制・
 * 通信制課程はR5/R6/R7と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.kengaku.tym.ed.jp/wp-content/uploads/2022/03/r040225.pdf',
  sourceTitle: '富山県教育委員会 令和4年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜志願状況（令和4年2月25日正午現在）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（34校82学科）', quota: 5359, applicants: 5594, rate: 1.04 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委旧サイト（kengaku.tym.ed.jp）のR3発表資料
 * アーカイブページ（archives/400）経由で同一シリーズの一次PDF（r030226.pdf・令和3年2月26日
 * 正午現在・全3頁）を発見・Read toolで直読み成功。「合計 34校82学科」行（推薦入学内定者数
 * 1,030を除いた募集人数5,440・志願者数5,842・倍率1.07）を転記（5842/5440=1.0739…≈1.07で
 * 印字済み値と整合）。3頁目の大学科別内訳表の合計行（募集定員6,470/推薦内定1,030/募集人数
 * 5,440/志願者数5,842/倍率1.07）とも完全一致し、同一資料内の二重検証が取れている。定時制・
 * 通信制課程はR4/R5/R6/R7と同じ理由でスコープ外。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.kengaku.tym.ed.jp/wp-content/uploads/2021/03/r030226.pdf',
  sourceTitle: '富山県教育委員会 令和3年度富山県立高等学校入学者選抜 全日制の課程一般入学者選抜志願状況（令和3年2月26日正午現在）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（34校82学科）', quota: 5440, applicants: 5842, rate: 1.07 },
};

export const TOYAMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'toyama',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
