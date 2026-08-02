/**
 * 東京都 多年度アーカイブ（Λ-4パイロット・1県目）。
 *
 * 一次ソース: 東京都教育委員会「令和7年度東京都立高等学校入学者選抜応募状況総括表（全日制）」
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2025-02-13-001
 * 公表日: 2025-02-13（令和7年度・最終応募）
 *
 * このPDFは「（　）は昨年度の数値である」の注記どおり、令和7年度（当該年度・非括弧）と
 * 令和6年度（前年度・括弧内）の2年分を区分別（学科・課程区分）に併記している。
 * 1回の一次ソース取得で2年度分を取り込める（Y-2の学校粒度個票と異なり総括表は
 * 区分粒度だが、教委自身の集計値をそのまま転記するため転記ミスのリスクが低い）。
 *
 * 全日制合計（167校・令和7年度: 募集30,078・応募38,718・倍率1.29）は
 * 報道発表の集計値（WebSearch実測）とも完全一致を確認済み。
 * 令和8年度（当年度）の学校粒度データはsrc/data/competition-rates/tokyo.tsを参照
 * （本ファイルとは粒度が異なるため二重管理ではなく相互補完の関係）。
 *
 * 区分の内訳合計→上位合計（普通科合計／専門学科合計／全日制合計）は令和7・令和6
 * 両年度ともsumCategories()で完全一致することを確認済み（__tests__/tokyo.test.ts）。
 * 定時制課程（チャレンジスクール等）はsrc/data/competition-rates/tokyo.tsと同じ理由で
 * スコープ外（全日制合計に含まれない別集計のため）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const SOURCE = {
  sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2025-02-13-001',
  sourceTitle: '東京都教育委員会 令和7年度東京都立高等学校入学者選抜応募状況総括表（全日制）',
  fetchedAt: '2026-07-29',
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  ...SOURCE,
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計', schoolCount: 102, quota: 21255, applicants: 28843, rate: 1.36 },
    { label: '普通科(島しょ)計', schoolCount: 6, quota: 307, applicants: 110, rate: 0.36 },
    { label: 'コース制計', schoolCount: 4, quota: 224, applicants: 276, rate: 1.23 },
    { label: '単位制計', schoolCount: 11, quota: 2151, applicants: 2883, rate: 1.34 },
    { label: '海外帰国生徒対象計', schoolCount: 0, quota: 62, applicants: 65, rate: 1.05 },
    { label: '商業科', schoolCount: 7, quota: 792, applicants: 777, rate: 0.98 },
    { label: 'ビジネスコミュニケーション科', schoolCount: 2, quota: 231, applicants: 245, rate: 1.06 },
    { label: '工業科(単位制以外)', schoolCount: 15, quota: 1575, applicants: 1231, rate: 0.78 },
    { label: '工業科(単位制)', schoolCount: 1, quota: 96, applicants: 68, rate: 0.71 },
    { label: '科学技術科', schoolCount: 2, quota: 252, applicants: 319, rate: 1.27 },
    { label: '農業科', schoolCount: 5, quota: 413, applicants: 536, rate: 1.30 },
    { label: '水産科', schoolCount: 1, quota: 42, applicants: 46, rate: 1.10 },
    { label: '家庭科(単位制以外)', schoolCount: 1, quota: 222, applicants: 193, rate: 0.87 },
    { label: '家庭科(単位制)', schoolCount: 0, quota: 49, applicants: 44, rate: 0.90 },
    { label: '福祉科', schoolCount: 0, quota: 50, applicants: 32, rate: 0.64 },
    { label: '理数科', schoolCount: 0, quota: 72, applicants: 230, rate: 3.19 },
    { label: '芸術科', schoolCount: 1, quota: 112, applicants: 200, rate: 1.79 },
    { label: '体育科', schoolCount: 0, quota: 52, applicants: 85, rate: 1.63 },
    { label: '国際科', schoolCount: 1, quota: 138, applicants: 243, rate: 1.76 },
    { label: '併合科', schoolCount: 0, quota: 105, applicants: 11, rate: 0.10 },
    { label: '産業科', schoolCount: 2, quota: 252, applicants: 245, rate: 0.97 },
    { label: '総合学科', schoolCount: 10, quota: 1626, applicants: 2036, rate: 1.25 },
  ],
  grandTotal: { label: '全日制合計', schoolCount: 167, quota: 30078, applicants: 38718, rate: 1.29 },
};

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  ...SOURCE,
  origin: 'prior-year-parenthetical',
  granularity: 'category-detail',
  categories: [
    { label: '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計', quota: 21481, applicants: 31551, rate: 1.47 },
    { label: '普通科(島しょ)計', quota: 306, applicants: 91, rate: 0.30 },
    { label: 'コース制計', quota: 224, applicants: 364, rate: 1.63 },
    { label: '単位制計', quota: 2146, applicants: 3131, rate: 1.46 },
    { label: '海外帰国生徒対象計', quota: 62, applicants: 67, rate: 1.08 },
    { label: '商業科', quota: 795, applicants: 812, rate: 1.02 },
    { label: 'ビジネスコミュニケーション科', quota: 231, applicants: 256, rate: 1.11 },
    { label: '工業科(単位制以外)', quota: 1584, applicants: 1252, rate: 0.79 },
    { label: '工業科(単位制)', quota: 108, applicants: 87, rate: 0.81 },
    { label: '科学技術科', quota: 252, applicants: 383, rate: 1.52 },
    { label: '農業科', quota: 413, applicants: 477, rate: 1.15 },
    { label: '水産科', quota: 42, applicants: 45, rate: 1.07 },
    { label: '家庭科(単位制以外)', quota: 222, applicants: 216, rate: 0.97 },
    { label: '家庭科(単位制)', quota: 49, applicants: 55, rate: 1.12 },
    { label: '福祉科', quota: 53, applicants: 14, rate: 0.26 },
    { label: '理数科', quota: 68, applicants: 169, rate: 2.49 },
    { label: '芸術科', quota: 112, applicants: 219, rate: 1.96 },
    { label: '体育科', quota: 52, applicants: 59, rate: 1.13 },
    { label: '国際科', quota: 138, applicants: 302, rate: 2.19 },
    { label: '併合科', quota: 105, applicants: 18, rate: 0.17 },
    { label: '産業科', quota: 274, applicants: 294, rate: 1.07 },
    { label: '総合学科', quota: 1626, applicants: 2155, rate: 1.33 },
  ],
  grandTotal: { label: '全日制合計', quota: 30343, applicants: 42017, rate: 1.38 },
};

/**
 * 令和5年度総括表PDF（https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/01_teisei_2）は
 * 「※令和5年2月21日に数字を一部訂正しました」との訂正注記付きで、訂正箇所が原本PDF上に
 * 手書き風の取消線・訂正数値として重ねて表示されている（例: 全日制合計の最終応募人員が
 * 42,236→42,238等）。訂正前後どちらが最終値か学科区分ごとに1件ずつ確実に判別する自信が
 * 持てなかったため、区分別内訳（categories）の転記は見送り、全日制合計のみを収録する
 * （granularity='grand-total-only'）。全日制合計の数値自体は教委発表を報じる独立した二次情報源
 * 2件（よみうり進学メディア・jyuken-ex.jp、いずれも訂正後の最終値と一致）でクロスチェック済み。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/01_teisei_2',
  sourceTitle: '東京都教育委員会 令和5年度東京都立高等学校入学者選抜応募状況総括表（全日制）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', schoolCount: 167, quota: 30825, applicants: 42238, rate: 1.37 },
};

/** 同PDFの前年度欄（括弧内）由来。全日制合計のみ、二次情報源でクロスチェック済み（理由はREIWA_5コメント参照）。 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/01_teisei_2',
  sourceTitle: '東京都教育委員会 令和5年度東京都立高等学校入学者選抜応募状況総括表（全日制）',
  fetchedAt: '2026-07-29',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', quota: 30306, applicants: 41489, rate: 1.37 },
};

/**
 * 令和3年度（2021年度）: 令和4年度総括表PDF（documents/d/kyoiku/01_90・教委公式サイトの
 * 「過去の応募状況（過去5年分）」ページ経由でWebSearchにより発見・Read toolで直読み成功）の
 * 「（　）は昨年度の数値である」括弧内欄（前年度＝令和3年度）から抽出。全日制合計:
 * 募集人員29,509・最終応募人員39,785・最終応募倍率1.35（39785/29509=1.3483…≈1.35で
 * 印字済み値と整合）。R4/R5と同じ理由で区分別内訳（categories）は省略しgrand-total-onlyとした。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/01_90',
  sourceTitle: '東京都教育委員会 令和4年度東京都立高等学校入学者選抜応募状況総括表（全日制）',
  fetchedAt: '2026-08-03',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', schoolCount: 168, quota: 29509, applicants: 39785, rate: 1.35 },
};

export const TOKYO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tokyo',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
