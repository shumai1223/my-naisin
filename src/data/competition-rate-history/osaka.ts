/**
 * 大阪府 多年度アーカイブ（Λ-4・44県目）。
 *
 * 一次ソース: 大阪府教育委員会「令和8年度大阪府公立高等学校 一般入学者選抜（全日制の課程）
 * の志願者数（令和8年3月6日午後2時（締切数））」。
 * https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx
 *
 * Y-6のosaka.tsと同一資料の表1〜6全体合計行をそのまま転記（同一年度・現在年度分のみのため
 * granularity='grand-total-only'）。Y-6側でxlsx原本の自前パースにより転記精度を確保済み
 * （詳細はcompetition-rates/osaka.ts参照）。
 *
 * **2026-08-05追記(令和7年度追加)**: 2026-08-05朝のセッションでPDF版
 * (r07_ippan_sigansya_0307.pdf)をRead toolのビジョン解析で読んだ際「表3(専門学科のみ設置校)に
 * 県全体の合計行が印字されていない」と誤判定し手動合算リスクを理由に見送っていたが、これは
 * PDFのレイアウト崩れによる見落としだった。R8と同じくxlsx版
 * (r07_ippan_sigansya_0307.xlsx)をNode標準zlib+自前XMLパースで直読みしたところ、5つの表すべてに
 * 「合計」行が実在することを確認できた（①普通科(単位制除く)=20075/20271 ②普通科単位制=1040/1035
 * ③専門学科のみ設置校(文理探究科相当を含む)=8441/9368 ④総合学科(除くクリエイティブ)=3460/3140
 * ⑤総合学科クリエイティブ=234/189）。5表合計quota33250・applicants34003・rate1.02（手動での学校別
 * 積み上げは一切していない＝各表の「合計」印字行をそのまま転記）。表3・表4相当が1つの表に
 * 統合されている点はR8と表構成が異なるが（春日丘・狭山がR7時点ではまだ「文理探究科」化されておらず
 * 表1の普通科に含まれていた）、5表全てを合算しているため「一般選抜（全日制の課程）」という
 * スコープ自体はR8と同一（定時制は別シート=対象外）。WebSearch経由のリセマム記事
 * (2025-03-10「大阪府公立高、一般選抜の出願倍率（確定）」)が独立に報じた表1・表3相当の数値
 * (20075/20271・8441/9368)と完全一致することも確認済み。
 *
 * **2026-08-05追記(令和6年度追加)**: 同じxlsx直読み手法で令和6年度
 * (r06_ippan_sigansya_0306.xlsx)も収録。5表構成はR7と同型（①普通科(単位制除く)=20884/21612
 * ②普通科単位制=1080/1093 ③専門学科のみ設置校=9006/9947 ④総合学科(除くクリエイティブ)=3585/3505
 * ⑤総合学科クリエイティブ=234/222）。5表合計quota34789・applicants36379・rate1.05。
 *
 * **2026-08-05追記(令和5年度追加)**: 同じxlsx直読み手法で令和5年度
 * (r05_ippan_sigansya_0307_2.xlsx・「令和5年3月9日訂正」版=最終確定版)も収録。5表構成は
 * R6/R7と同型（①普通科(単位制除く)=20567/23347 ②普通科単位制=1080/1217
 * ③専門学科のみ設置校=8895/10070 ④総合学科(除くクリエイティブ)=3504/3864
 * ⑤総合学科クリエイティブ=234/256）。5表合計quota34280・applicants38754・rate1.13。
 *
 * **2026-08-06追記(令和4年度追加・5年満了)**: 令和4年度分のxlsxは公式サイト（現行/Wayback
 * Machineとも）で発見できず未発見のままだが、教委が公表したPDF版（Wayback Machine経由で
 * 取得: web.archive.org/web/2022id_/https://www.pref.osaka.lg.jp/attach/6221/00420647/
 * R04_ippan_sigansya_0304.pdf・全5頁・令和4年3月4日午後2時締切数）をRead toolで直読みした
 * ところ、xlsx版と全く同じ5表構成で各表末尾に印字済み「合計」行が存在することを確認できた
 * （①普通科(単位制除く)=20896/23380 ②普通科単位制=1040/1272 ③専門学科のみ設置校=8963/10079
 * ④総合学科(除くクリエイティブ)=3519/3809 ⑤総合学科クリエイティブ=234/237）。R5-R8と同じく
 * 各表の印字済み合計行をそのまま転記しただけで、学校別の手動積み上げは一切行っていない。
 * 5表合計quota34652・applicants38777・rate1.12（38777/34652=1.1190…≈1.12で整合）。
 * これでosakaはR4〜R8の5年度分＝Λ-4の5年満了目標を達成。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx',
  sourceTitle:
    '大阪府教育委員会 令和8年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和8年3月6日午後2時（締切数））表1〜6全体',
  fetchedAt: '2026-07-24',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全体合計（表1+表2+表3+表4+表5+表6）', quota: 31847, applicants: 33422, rate: 1.05 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.osaka.lg.jp/documents/102859/r07_ippan_sigansya_0307.xlsx',
  sourceTitle:
    '大阪府教育委員会 令和7年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和7年3月7日午後2時（締切数））表1〜5全体',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全体合計（表1+表2+表3+表4+表5）', quota: 33250, applicants: 34003, rate: 1.02 },
};

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.osaka.lg.jp/documents/62075/r06_ippan_sigansya_0306.xlsx',
  sourceTitle:
    '大阪府教育委員会 令和6年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和6年3月6日午後2時（締切数））表1〜5全体',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全体合計（表1+表2+表3+表4+表5）', quota: 34789, applicants: 36379, rate: 1.05 },
};

const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.osaka.lg.jp/documents/9170/r05_ippan_sigansya_0307_2.xlsx',
  sourceTitle:
    '大阪府教育委員会 令和5年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和5年3月7日午後2時（締切数）・令和5年3月9日訂正版）表1〜5全体',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全体合計（表1+表2+表3+表4+表5）', quota: 34280, applicants: 38754, rate: 1.13 },
};

const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://web.archive.org/web/2022id_/https://www.pref.osaka.lg.jp/attach/6221/00420647/R04_ippan_sigansya_0304.pdf',
  sourceTitle:
    '大阪府教育委員会 令和4年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和4年3月4日午後2時（締切数））表1〜5全体（Wayback Machine経由・原本ページは現行サイトから削除済み）',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全体合計（表1+表2+表3+表4+表5）', quota: 34652, applicants: 38777, rate: 1.12 },
};

export const OSAKA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'osaka',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
