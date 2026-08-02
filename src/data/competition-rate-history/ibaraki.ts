/**
 * 茨城県 多年度アーカイブ（Λ-4・19県目）。
 *
 * 一次ソース: 茨城県教育委員会「令和7年度茨城県立高等学校第1学年入学志願者数等
 * （志願先変更後）」（2月18日公表・全5ページ）。
 * https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2025/02/shigansha2025.pdf
 *
 * 既存Y-6 ibaraki.tsと同一資料シリーズ。教委の年度別記事ページ(post-33940)経由でR7版を発見
 * （URLは年月ディレクトリ+ファイル名とも年度依存で単純置換不可）。全日制「計」行を直接転記:
 * 募集定員16,723・志願者数16,548・倍率0.99。Y-6と同じ理由で「全日制総計」（附属中学校からの
 * 入学予定者507名を外数加算した17,230／17,055）は不採用、学校別表に記載の募集定員・志願者数の
 * みを対象とする「全日制計」を採用。定時制課程・連携型入学者選抜はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2025/02/shigansha2025.pdf',
  sourceTitle: '茨城県教育委員会 令和7年度茨城県立高等学校第1学年入学志願者数等（志願先変更後）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 16723, applicants: 16548, rate: 0.99 },
};

/**
 * 令和6年度（2024年度）: 教委の年度別記事ページ(post-28783)から同一資料シリーズのR6版を発見。
 * R7と同じ「全日制計」行を直接転記（募集定員17,040・志願者数16,742・倍率0.98）。
 * 「全日制総計」（附属中学校からの入学予定者430名を外数加算した17,470／17,172）は
 * R7と同じ理由で不採用。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2024/02/shigansha0220.pdf',
  sourceTitle: '茨城県教育委員会 令和6年度茨城県立高等学校第1学年入学志願者数等（志願先変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 17040, applicants: 16742, rate: 0.98 },
};

/**
 * 令和5年度（2023年度）: 教委の年度別記事ページ(post-24145)から同一資料シリーズのR5版を発見
 * （全5頁・Read toolで直読み成功）。R6/R7と同じ「全日制計」行を直接転記（募集定員17,443・
 * 志願者数17,246・倍率0.99・17246/17443=0.9887…≈0.99で印字済み値と整合）。「全日制総計」
 * （附属中学校からの入学予定者267名を外数加算した17,710／17,513）はR6/R7と同じ理由で不採用。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2023/04/d9dec4444017129c95ed8f3cdd9062e4.pdf',
  sourceTitle: '茨城県教育委員会 令和5年度茨城県立高等学校第1学年入学志願者数等（志願先変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 17443, applicants: 17246, rate: 0.99 },
};

export const IBARAKI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'ibaraki',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
