/**
 * 愛知県 多年度アーカイブ（Λ-4・43県目）。
 *
 * 一次ソース: 愛知県教育委員会高等学校教育課「令和8年度愛知県公立高等学校入学者選抜（全日制課程）
 * における一般選抜等の志願変更後の志願者数（最終）について」。
 * https://www.pref.aichi.jp/uploaded/attachment/600212.pdf
 *
 * Y-6のaichi.tsと同一資料の「合計」行をそのまま転記（同一年度・現在年度分のみのため
 * granularity='grand-total-only'）。Y-6側で機械集計240レコードとの突合を行い、初回転記で
 * 西尾1校の抜け落ちを発見・追記して合計行（quota30,789・applicants53,196・倍率1.73）と
 * 完全一致することを確認済み（詳細はcompetition-rates/aichi.ts参照）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.aichi.jp/uploaded/attachment/600212.pdf',
  sourceTitle:
    '愛知県教育委員会高等学校教育課 令和8年度愛知県公立高等学校入学者選抜（全日制課程）における一般選抜等の志願変更後の志願者数（最終）について',
  fetchedAt: '2026-07-25',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', schoolCount: 156, quota: 30789, applicants: 53196, rate: 1.73 },
};

/**
 * 令和7年度（2025年度）: 教委の一次PDF（549739.pdf・全日制一般選抜等志願変更後の志願者数・
 * 全14頁）はこの環境のpoppler未導入によりpages指定読み込みが不可（14頁は一括読み込みの上限
 * 20頁以内だが個別ページ指定が必須で失敗）。二次資料として①WebSearch要約と②manalabo.jp記事
 * への直接WebFetchの2つの独立ソースで志願者総数56,928人を確認（両者一致）。募集人員30,781人は
 * WebSearch要約のみで直接WebFetch確認は取れなかったが、①既存R8の募集人員30,789人と近似（愛知県
 * 全体の募集容量は年度間でほぼ変動しない）、②56928/30781=1.8497…≈1.85が独立して報じられている
 * 確定倍率1.85と一致、の2点の内部整合性で妥当性を確認した上で採用（Y-0憲法に沿い、単一の未検証
 * 数値のみに依拠しない）。
 */
const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.aichi.jp/uploaded/attachment/549739.pdf',
  sourceTitle:
    '愛知県教育委員会 令和7年度愛知県公立高等学校入学者選抜（全日制課程）における一般選抜等の志願変更後の志願者数（最終）について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', quota: 30781, applicants: 56928, rate: 1.85 },
};

/**
 * 令和6年度（2024年度）: 教委の一次PDF（497269.pdf・全日制一般選抜等志願変更後の志願者数・
 * 全11頁・学校別内訳のみで合計行なし）はOsaka型の手動合算リスクに該当するため使わず、R7と
 * 同じ二次資料クロスチェック方針を採用。WebSearch要約とmgk-komaki.com記事(2024-02-15付
 * 「令和6年度愛知県公立高校入試最終倍率徹底分析」)の2つの独立ソースで募集人員31,417・
 * 志願者総数59,007が完全一致することを確認（59007/31417=1.8785…≈1.88）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://mgk-komaki.com/2024/02/15/2024-aichi-bairitsu/',
  sourceTitle: '未来義塾小牧校「令和6年度(2024年度)愛知県公立高校入試 最終倍率徹底分析」（愛知県教育委員会発表を引用）',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', quota: 31417, applicants: 59007, rate: 1.88 },
};

export const AICHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'aichi',
  years: [REIWA_8, REIWA_7, REIWA_6],
};
