import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 東京都 定時制課程・チャレンジスクール・在京外国人生徒等対象選抜（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）」
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/03-3-v2
 * （全8頁のうち7〜8頁目が定時制課程・チャレンジスクール・在京外国人生徒等対象選抜。
 * 1〜6頁目の専門学科13学科・総合学科は`src/data/competition-rates/tokyo.ts`の全日制データに収録済み）。
 *
 * ⚠️対象範囲=①定時制課程（単位制の学校）6校（新宿山吹のみ普通科1〜4部＋情報科2・4部の
 * 2学科構成のため7レコード）②定時制課程単位制総合学科（チャレンジスクール）7校＋定時制課程
 * 単位制普通科（チャレンジ枠・八王子拓真）1校の計8レコード③在京外国人生徒等対象入学者選抜
 * （国際高校）1レコード。合計16レコード。
 *
 * ⚠️各校とも「1学年相当」「2学年相当以上」の内訳行が付随する（3部制・単位制の性質上、
 * 転入学等により学年をまたぐ募集があるため）。本データは学校（新宿山吹は学科）ごとの「計」行を
 * 1レコードとして採用し、内訳行はSUM対象外とした（他県の学科内訳と同型の扱い）。
 *
 * 機械集計は3セクションそれぞれの印字済み合計と完全一致した:
 * ①「定時制課程単位制計」1,120／987／0.88 ②「チャレンジスクール及びチャレンジ枠 計」
 * 1,565／1,973／1.26 ③「在京外国人生徒等対象入学者選抜（国際高校）計」25／80／3.20。
 *
 * ToUnicode欠落は無く`pdftoppm 200dpi`のビジョン解析1回の読み取りで全16レコードを判読できた
 * （既存の全日制tokyoデータと異なりこの2頁は文字・罫線とも明瞭）。
 */

export const TOKYO_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tokyo',
  sources: [
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/03-3-v2',
      docTitle:
        '東京都教育委員会 令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）23[定時制課程（単位制の学校）]・24[定時制課程単位制総合学科（チャレンジスクール）及び定時制課程単位制普通科（チャレンジ枠）]・25[在京外国人生徒等対象入学者選抜（国際高校）]',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '定時制課程（単位制の学校）',
      '定時制課程単位制総合学科（チャレンジスクール）',
      '定時制課程単位制普通科（チャレンジ枠）',
      '在京外国人生徒等対象入学者選抜（国際高校）',
    ],
    pendingDepartments: [],
    note: '7〜8頁目に掲載された定時制・チャレンジスクール・在京外国人枠の全16レコードを完全収録。',
  },
  records: [
    // ===== 23[定時制課程（単位制の学校）] =====
    { schoolName: '一橋', area: '千代田', department: '普通科', quota: 187, finalApplicants: 144, finalRate: 0.77 },
    { schoolName: '新宿山吹', area: '新宿', department: '普通科1〜4部', quota: 150, finalApplicants: 199, finalRate: 1.33 },
    { schoolName: '新宿山吹', area: '新宿', department: '情報科2・4部', quota: 46, finalApplicants: 72, finalRate: 1.57 },
    { schoolName: '浅草', area: '台東', department: '普通科', quota: 188, finalApplicants: 135, finalRate: 0.72 },
    { schoolName: '荻窪', area: '杉並', department: '普通科', quota: 197, finalApplicants: 80, finalRate: 0.41 },
    { schoolName: '八王子拓真', area: '八王子', department: '普通科', quota: 207, finalApplicants: 198, finalRate: 0.96 },
    { schoolName: '砂川', area: '立川', department: '普通科1〜3部', quota: 145, finalApplicants: 159, finalRate: 1.1 },

    // ===== 24[チャレンジスクール及びチャレンジ枠] =====
    { schoolName: '六本木', area: '港', department: '総合学科1〜3部', quota: 215, finalApplicants: 371, finalRate: 1.73 },
    { schoolName: '大江戸', area: '江東', department: '総合学科1〜3部', quota: 215, finalApplicants: 275, finalRate: 1.28 },
    { schoolName: '世田谷泉', area: '世田谷', department: '総合学科1〜3部', quota: 185, finalApplicants: 205, finalRate: 1.11 },
    { schoolName: '稔ヶ丘', area: '中野', department: '総合学科1〜3部', quota: 245, finalApplicants: 296, finalRate: 1.21 },
    { schoolName: '桐ヶ丘', area: '北', department: '総合学科1〜3部', quota: 185, finalApplicants: 174, finalRate: 0.94 },
    { schoolName: '小台橋', area: '足立', department: '総合学科1〜3部', quota: 275, finalApplicants: 214, finalRate: 0.78 },
    { schoolName: '立川緑', area: '立川', department: '総合学科1〜3部', quota: 185, finalApplicants: 364, finalRate: 1.97 },
    { schoolName: '八王子拓真', area: '八王子', department: '普通科1・2部（チャレンジ枠）', quota: 60, finalApplicants: 74, finalRate: 1.23 },

    // ===== 25[在京外国人生徒等対象入学者選抜（国際高校）] =====
    { schoolName: '国際', area: '目黒', department: '国際', quota: 25, finalApplicants: 80, finalRate: 3.2 },
  ],
  officialSubtotals: [
    { label: '定時制課程単位制計', quota: 1120, finalApplicants: 987, finalRate: 0.88 },
    { label: 'チャレンジスクール及びチャレンジ枠 計', quota: 1565, finalApplicants: 1973, finalRate: 1.26 },
    { label: '在京外国人生徒等対象入学者選抜（国際高校）計', quota: 25, finalApplicants: 80, finalRate: 3.2 },
  ],
};
