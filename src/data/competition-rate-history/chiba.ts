/**
 * 千葉県 多年度アーカイブ（Λ-4・3県目）。
 *
 * 千葉県教育委員会は総括表PDFを公表するが（Y-2のchiba.ts参照）、県全体の集計値
 * （募集人員・志願者確定数・倍率）は報道発表本文にのみ明記され、PDF内の学校別一覧は
 * 東京都・神奈川県のような区分別小計を持たない1行=1校×1学科のフラットな形式のため、
 * 全県集計にはA/B判定を伴う突合ロジックが必要（大阪府と同種の理由でgrand-total-only
 * 方針とスコープが合わない）。そのため本ファイルは**教委発表を報じる独立した報道記事
 * （よみうり進学メディア）1件から令和7・令和6年度の両方を同時に取得**し、
 * さらに令和6年度分は別の独立記事でも同じ数値(34,478人・1.12倍・125校201学科)を
 * クロスチェック済み（[[fable5-loop-protocol]]の「総括表PDFのビジョン解析は誤読しうる」
 * 教訓を踏まえ、そもそもビジョン解析を経由しない報道記事引用のみで構成した）。
 *
 * 一次ソース: 千葉県教育委員会「令和7年度千葉県公立高等学校入学者選抜...入学志願者確定数
 * について」の報道発表（2025-02-14公表）を報じたよみうり進学メディアの記事。
 * https://ysmedia.jp/admissions/24240/
 * 教委自身の一次配布資料ページ:
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/r7sigakakuitiran.html
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 教委公式ページ(r8kakuteiitiran.html)経由でPDF
 * (documents/r8kakutei.pdf・2026年2月13日公表・全7頁)を発見しRead toolで直読み。
 * 「全体的な実施状況」注記に「募集人員、志願者数及び志願者確定数には特別入学者選抜及び
 * 地域連携アクティブスクールの入学者選抜のものも含みます」と明記されており、これはR5-R7の
 * 既存収録スコープ（quota/applicantsの実測値がR7=29,720/33,854で完全一致）と同一と確認済み。
 * 全日制の課程「志願者確定数〔2/12〕」=32,008・募集人員=28,880・志願確定倍率〔2/12〕=1.11倍
 * を転記（32008/28880=1.1084…≈1.11で印字済み値と整合）。同PDF内の令和7年度比較値
 * （29,720人・33,854人）も既存REIWA_7の値と完全一致し内部整合性を確認済み。なお同時期に
 * 公表された2/5時点の「入学志願状況」PDF(訂正版)は特別選抜等を含む広いスコープの初期値
 * （未確定）であり、今回は使用していない（確定数のみ採用）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/r8kakutei.pdf',
  sourceTitle: '千葉県教育委員会 令和8年度千葉県公立高等学校入学者選抜「一般入学者選抜」等 入学志願者確定数について',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（一般入学者選抜・志願者確定数）', quota: 28880, applicants: 32008, rate: 1.11 },
};

const SOURCE = {
  sourceUrl: 'https://ysmedia.jp/admissions/24240/',
  sourceTitle: 'よみうり進学メディア「〈2025年度〉千葉県 公立高校「志願者確定数（2月14日付）」倍率1.14倍-令和7年度」（千葉県教育委員会 令和7年度入学志願者確定数の報道発表を引用）',
  fetchedAt: '2026-07-29',
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  ...SOURCE,
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（一般入学者選抜・志願者確定数）', quota: 29720, applicants: 33854, rate: 1.14 },
};

/**
 * 令和6年度分は同記事内の「前年度」比較記述（quota/applicants）に加え、令和6年度発表時点の
 * 別の独立記事（よみうり進学メディア「志願者確定数（2月16日付）倍率1.12倍-令和6年度」・
 * 125校201学科・志願者確定数34,478人・倍率1.12倍）とも完全一致することを確認済み。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  ...SOURCE,
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（一般入学者選抜・志願者確定数）', quota: 30680, applicants: 34478, rate: 1.12 },
};

/**
 * 令和5年度（2023年度）: 千葉県教育委員会の公式ページ2件（PDFではなくHTML本文・ビジョン解析なし）
 * から同一の数値（募集人員30,960・志願者確定数34,793）を確認。
 *  - 一次発表（2023-02-17公表）: https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2022/koukou/r050217sigannsyakakutei.html
 *  - 選抜結果まとめ（2023-05-17公表・独立した後発ページで同数値を再掲）:
 *    https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2023/koukou/050517nyuushikekka.html
 * 倍率1.12は34,793÷30,960の算出値（教委発表に倍率の直接記載はないが、R6/R7と同じ「志願者数÷募集人員」
 * の定義で計算した値・小数第3位を四捨五入）。2026-08-03取得。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2022/koukou/r050217sigannsyakakutei.html',
  sourceTitle:
    '千葉県教育委員会 令和5年度千葉県公立高等学校「一般入学者選抜」等の入学志願者確定数について（結果まとめページで再確認済み）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（一般入学者選抜・志願者確定数）', quota: 30960, applicants: 34793, rate: 1.12 },
};

export const CHIBA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'chiba',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5],
};
