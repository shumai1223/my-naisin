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

export const OSAKA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'osaka',
  years: [REIWA_8, REIWA_7],
};
