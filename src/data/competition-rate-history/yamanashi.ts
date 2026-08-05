/**
 * 山梨県 多年度アーカイブ（Λ-4・39県目）。
 *
 * 一次ソース: 山梨県教育委員会「令和7年度山梨県公立高等学校入学者選抜 全日制後期募集の最終志願
 * 状況について」（2025年2月27日発表・確定）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/27/81028.html
 *
 * 既存Y-6 yamanashi.tsのURL（documents/7061/r8saisyuusigansyasuu1.pdf）は年度prefix置換
 * （r8→r7）が404となり原本PDFへの直接発見には至らなかった。**教訓**: WebSearch要約が最初に
 * 返した「3,228人」は志願変更前（出願当初）の暫定値であり、実際の最終確定値は「3,227人」
 * （2/27付リセモム記事で確定と明記）だったため、記事本文への直接WebFetchで再確認して訂正した
 * （志願変更前後で1名差があり、単一のWebSearch要約だけに頼ると暫定値を確定値と誤認するリスクを
 * 再確認）。全日制課程「26校48学科の募集定員3,395人に対し、最終志願者数3,227人。志願倍率は
 * 0.95倍」を直接引用（3227/3395=0.9505…≈0.95で整合）。Y-6と同じ「全日制後期募集」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/yamanashi.tsが確定済みのofficialSubtotals「全日制課程計」行をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.yamanashi.jp/documents/7061/r8saisyuusigansyasuu1.pdf',
  sourceTitle: '山梨県教育委員会 令和8年度山梨県公立高等学校入学者選抜 全日制後期募集及び定時制課程の最終志願状況について',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程計', quota: 3356, applicants: 3037, rate: 0.9 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/27/81028.html',
  sourceTitle:
    'リセモム「山梨県公立高、後期選抜の志願状況（確定）」（山梨県教育委員会 令和7年度全日制後期募集の最終志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集（26校48学科）', quota: 3395, applicants: 3227, rate: 0.95 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年2月29日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用（R7ファイルで発見済みの「暫定値と確定値
 * の1名差」の教訓を踏まえ、確定記事本文へ直接WebFetchして裏取り）。全日制後期募集「26校48学科」
 * 全体: 募集人員3,537・最終志願者数3,374・志願倍率0.95（3374/3537=0.9539…≈0.95で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/29/76190.html',
  sourceTitle:
    'リセモム「山梨県公立高、後期選抜の志願状況（確定）」（山梨県教育委員会 令和6年度全日制後期募集の最終志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集（26校48学科）', quota: 3537, applicants: 3374, rate: 0.95 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム確定記事（2023年2月28日発表・タイトル
 * 本文双方に「確定」と明記）を2回のWebFetchで再確認して採用。全日制後期募集「26校48学科」
 * 全体: 募集定員3,601・最終志願者数3,489・志願倍率0.96（教委発表の印字済み値をそのまま採用）。
 * ⚠️注記: 3489/3601を単純計算すると0.97となり印字済み倍率0.96とは小数第2位で一致しない
 * （既存のR6/R7エントリはこの自己整合性が取れているのに対しR5のみ不一致）。同一記事を独立に
 * 2回WebFetchしても同じ3数値が再現されたため転記ミスの可能性は低く、教委発表側の倍率算出方法
 * （学科別倍率の単純平均等、単純な総志願者数÷総募集定員とは異なる算出方式である可能性）に
 * 起因すると推測し、印字済みの確定値をそのまま正直に転記した（自前で丸め直して0.97に補正する
 * ことはしていない）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/28/71154.html',
  sourceTitle:
    'リセモム「【高校受験2023】山梨県公立高、後期選抜の志願状況（確定）甲府南（理数）1.36倍」（山梨県教育委員会 令和5年度全日制後期募集の最終志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集（26校48学科）', quota: 3601, applicants: 3489, rate: 0.96 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのリセモム確定記事（2022年2月28日発表）を
 * WebFetchで直接引用。全日制後期募集全体: 募集人員3,692・志願者数3,538・志願倍率0.95
 * （教委発表の印字済み値をそのまま採用）。⚠️注記: 3538/3692を単純計算すると0.9583…となり
 * 通常の四捨五入では0.96になるが印字済み倍率は0.95（R5エントリで既知の「単純計算と印字値の
 * 不一致」パターンが本年度も再現。R5と同じ理由=教委側の倍率算出方式が単純な総志願者数÷総
 * 募集人員とは異なる可能性）と推測し、自前で丸め直さず印字済みの確定値をそのまま正直に転記した。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/28/66012.html',
  sourceTitle:
    'リセモム「【高校受験2022】山梨県公立高、後期選抜の志願状況（確定）甲府南（理数）1.46倍」（山梨県教育委員会 令和4年度全日制後期募集の最終志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集', quota: 3692, applicants: 3538, rate: 0.95 },
};

/**
 * 令和3年度（2021年度）: R4-R7と同一シリーズのリセモム確定記事（2021年2月26日発表・タイトルに
 * 「確定」と明記）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制後期
 * 募集全体: 募集定員3,684・志願者数3,606・志願倍率0.98（3606/3684=0.9788…≈0.98で印字済み値と
 * 整合・R4/R5と異なりこの年度は単純計算と印字値の不一致は発生していない）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/02/26/60670.html',
  sourceTitle:
    'リセモム「【高校受験2021】山梨県公立高、後期募集の志願状況（確定）甲府南（理数）1.36倍」（山梨県教育委員会 令和3年度全日制後期募集の最終志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集', quota: 3684, applicants: 3606, rate: 0.98 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。教委公式サイト「過去の入試状況」ページ経由で一次PDF
 * 「令和2年度山梨県公立高等学校入学者選抜 全日制後期募集及び定時制課程の最終志願状況」
 * （令和2年2月27日発表・全7頁）を発見・Read toolで直読み成功。1頁目サマリーの「(1) 全日制
 * 後期募集」計行（後期募集人員3,865・最終志願者数3,947・倍率1.02）を転記
 * （3947/3865=1.0212…≈1.02で印字済み値と整合）。3頁目「全日制課程計」行（県立高校計3,785＋
 * 市立高校計162＝3,947）とも完全一致し、資料内二重検証が取れている。R3〜R7と同じ「全日制
 * 後期募集」スコープ。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://www.pref.yamanashi.jp/documents/7061/r2_nyushi_saishushigansha.pdf',
  sourceTitle: '山梨県教育委員会 令和2年度山梨県公立高等学校入学者選抜 全日制後期募集及び定時制課程の最終志願状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集', quota: 3865, applicants: 3947, rate: 1.02 },
};

export const YAMANASHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'yamanashi',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
