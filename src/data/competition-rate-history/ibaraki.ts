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

/**
 * 令和8年度（2026年度）: 教委公式ハブページ（highschool/page-38831）経由でR8版
 * （shigansha20260218.pdf・全5頁）を発見・Read toolで直読み。R6/R7と同じ「全日制計」行を
 * 直接転記（募集定員16,647・志願者数15,211・倍率0.91・15211/16647=0.9137…≈0.91で整合）。
 * 「全日制総計」（附属中学校からの入学予定者503名を外数加算した17,150／15,714）はR5-R7と
 * 同じ理由で不採用。定時制課程・連携型入学者選抜はR5-R7と同じ理由でスコープ外。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2026/02/shigansha20260218.pdf',
  sourceTitle: '茨城県教育委員会 令和8年度茨城県立高等学校第1学年入学志願者数等（志願先変更後）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 16647, applicants: 15211, rate: 0.91 },
};

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

/**
 * 令和4年度（2022年度）: R5-R8と同じ「志願先変更後」shigansha系PDFの当該年度版は教委サイトに
 * 現存せず（2026-08-06調査時点）、代わりに教委「令和4年度茨城県立高等学校入学者選抜実施状況
 * 報告書」（令和4年5月公表・全45頁）を発見（kyoiku.pref.ibaraki.jp/wp-content/uploads/2023/02/
 * 0610houkoku.pdf）。P2の「一般入学」計行は募集定員17,750・志願者数18,033・倍率1.02だが、
 * P1脚注3「募集定員には、日立第一高校への入学志願者のうち附属中学校からの入学予定者80人を含む」
 * およびP2脚注1により、この計行はR5-R8の「全日制計」（附属中学校分を除いた値）とはスコープが
 * 異なり、R5-R8の「全日制総計」（附属中学校分を外数加算した値）に相当すると判明。P4「学校別の
 * 状況」の日立第一高校の行で、一般入学志願者数が上段224・下段80（脚注2「下段の数は附属中学校
 * からの入学者を示している」）と明記されており、この80が計行に含まれる附属中学校分と正確に
 * 特定できた。R5-R8と同じ「全日制計」相当に揃えるため80を機械的に減算（募集定員17,750-80=
 * 17,670・志願者数18,033-80=17,953・倍率17953/17670=1.0160…≈1.02）。リセマム記事
 * （2022-02-21・「志願先変更後の確定値」と明記）が独立に報じた募集定員17,750・志願者数18,031
 * （報告書と2名差・時点差による軽微な後日修正の可能性）でも同一のスコープ（附属中80人を含む
 * 総計相当）と整合しており、内部整合性を確認済み。
 * https://resemom.jp/article/2022/02/21/65882.html
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2023/02/0610houkoku.pdf',
  sourceTitle: '茨城県教育委員会 令和4年度茨城県立高等学校入学者選抜実施状況報告書',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（報告書の計17,750/18,033から日立第一附属中学校分80人を除いた値）', quota: 17670, applicants: 17953, rate: 1.02 },
};

export const IBARAKI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'ibaraki',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
