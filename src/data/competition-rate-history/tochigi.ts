/**
 * 栃木県 多年度アーカイブ（Λ-4・46県目）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度県立高等学校入学者選抜一般選抜出願変更状況
 * （全日制課程）」。
 * https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf
 *
 * Y-6のtochigi.tsと同一資料のPDF末尾「全日制計」合計行をそのまま転記（同一年度・現在年度分
 * のみのためgranularity='grand-total-only'）。quotaは募集定員そのものではなく「一般選抜定員」
 * （募集定員から特色選抜等の内定者数を控除した値）である点、他県と定義が異なるため注記する
 * （Y-6側の定義をそのまま踏襲・詳細はcompetition-rates/tochigi.ts参照）。Y-6側で57校107
 * レコードの機械集計がこの合計行（quota7,259・applicants7,602・倍率1.05）と完全一致することを
 * 確認済み。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl:
    'https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf',
  sourceTitle: '栃木県教育委員会 令和8（2026）年度県立高等学校入学者選抜一般選抜出願変更状況（全日制課程）',
  fetchedAt: '2026-07-25',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース）', schoolCount: 57, quota: 7259, applicants: 7602, rate: 1.05 },
};

/**
 * 令和7年度（2025年度）: R8の「出願変更状況（変更後）」PDFに対応するR7版のハブページ
 * （r07shutugannhennkoujoukyoufurekkusushutugannjoukyou.html）は現在404で削除済みのため、
 * 同一年度の「出願状況（2/20時点・出願変更前）」一次PDF（全58校・No.1〜3）を代わりに採用
 * （⚠️R8が「変更後」なのに対しR7は「変更前」でスコープが厳密には異なる点に注意。ただし
 * 教委の別資料「令和7(2025)年度県立高等学校入学者選抜の結果について」に掲載の最終確定
 * 受検倍率（受検人員8,287÷一般選抜定員7,486=1.1069…≈1.11）が本PDFの出願倍率1.11と一致
 * しており、変更前後で総数がほぼ変動していないことを確認済み）。全日制「合計」行を転記:
 * 一般選抜定員=7,486・出願人員=8,338・出願倍率=1.11（8338/7486=1.1138…≈1.11で整合）。
 */
const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r07/documents/r7zennitiseiippansennbatsusyutuganjokyo.pdf',
  sourceTitle:
    '栃木県教育委員会 令和7（2025）年度県立高等学校入学者選抜一般選抜出願状況（全日制課程・2/20時点）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース・出願変更前2/20時点）', schoolCount: 58, quota: 7486, applicants: 8338, rate: 1.11 },
};

/**
 * 令和6年度（2024年度）: R6の「出願変更後」版ハブページは発見できなかったため、R7と同じ理由で
 * 「出願状況（2/21時点・出願変更前）」一次PDF（全58校・No.1〜3）を採用（R7と同じスコープの
 * 揺れ）。全日制「合計」行を転記: 一般選抜定員=7,679・出願人員=8,479・出願倍率=1.10
 * （8479/7679=1.1042…≈1.10で印字済み値と整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r06/documents/r6ippansyutsuganjyokyo.pdf',
  sourceTitle:
    '栃木県教育委員会 令和6（2024）年度県立高等学校入学者選抜一般選抜出願状況（全日制課程・2/21時点）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース・出願変更前2/21時点）', schoolCount: 58, quota: 7679, applicants: 8479, rate: 1.1 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同じ理由（変更後版ハブページ未発見）で「出願状況（2/21時点・
 * 出願変更前）」一次PDF（全58校・No.1〜3）をRead toolで直読み。3頁目末尾の「合計」行を転記:
 * 一般選抜定員=8,017・出願人員=8,715・出願倍率=1.09（8715/8017=1.0871…≈1.09で印字済み値と整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r03/documents/3zennichiippansenbatusyutugannjyokyo.pdf',
  sourceTitle:
    '栃木県教育委員会 令和5（2023）年度県立高等学校入学者選抜一般選抜出願状況（全日制課程・2/21時点）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース・出願変更前2/21時点）', schoolCount: 58, quota: 8017, applicants: 8715, rate: 1.09 },
};

/**
 * 令和4年度（2022年度）: 5年目横展開。教委のR4年度ハブページ（m04/r03/r04_kokonyuosirase.html）
 * 経由で「一般選抜出願変更状況」PDF（全3頁）を発見・Read toolで直読み。R5/R6/R7と同じ理由で
 * 出願変更前（2/21時点）の列を採用（出願変更後2/25の変更後出願人員8,949/倍率1.12も併記されて
 * いるが、R5/R6/R7が同じ「出願変更前2/21時点」列を採用しているためスコープを揃える）。3頁目
 * 末尾の「合計」行を転記: 一般選抜定員=7,986・出願人員(2/21)=9,021・出願倍率(2/21)=1.13
 * （9021/7986=1.1296…≈1.13で印字済み値と整合）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.tochigi.lg.jp/m04/r03/documents/r04ippanbkaigaisyutuganhenkou_1.pdf',
  sourceTitle:
    '栃木県教育委員会 令和4（2022）年度県立高等学校入学者選抜一般選抜出願変更状況（全日制課程・2/21時点）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース・出願変更前2/21時点）', schoolCount: 58, quota: 7986, applicants: 9021, rate: 1.13 },
};

/**
 * 令和3年度（2021年度）: 5年→6年横展開。教委のR3年度ハブページ（h32koukounyuusi/r03kokonyushi/
 * r03oshirase.html・年度表記がh32フォルダである点に注意）経由で「一般選抜出願変更状況」PDF
 * （全3頁）を発見・Read toolで直読み。R4〜R7と同じ理由で出願変更前（2/22時点）の列を採用。
 * 3頁目末尾の「合計」行を転記: 一般選抜定員=8,093・出願人員(2/22)=9,102・出願倍率(2/22)=1.12
 * （9102/8093=1.1247…≈1.12で印字済み値と整合）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl:
    'https://www.pref.tochigi.lg.jp/m04/h32koukounyuusi/r03kokonyushi/documents/r03ippanbkaigaisyutuganhenkou.pdf',
  sourceTitle:
    '栃木県教育委員会 令和3（2021）年度県立高等学校入学者選抜一般選抜出願変更状況（全日制課程・2/22時点）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース・出願変更前2/22時点）', schoolCount: 59, quota: 8093, applicants: 9102, rate: 1.12 },
};

export const TOCHIGI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tochigi',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
