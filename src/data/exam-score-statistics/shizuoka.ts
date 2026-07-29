/**
 * 静岡県公立高等学校入学者選抜 学力検査の結果（Λ-12・全日制の課程・全受検者平均）。
 *
 * 静岡県教育委員会は年度ごとに「学力検査結果等の報告書」PDFを公表しており、東京都・長野県の
 * 総括表と同型の当年度+前年度併記形式（表3）のため、令和8・7・6年度の3資料から令和5〜8年度
 * の4年分を収録できた。令和6年度の数値は令和6年度報告書本体と令和7年度報告書の前年度欄の
 * 双方に、令和7年度の数値も令和7年度報告書本体と令和8年度報告書の前年度欄の双方に独立して
 * 現れ、いずれも完全一致することを確認済み（クロスチェック2重×2組）。
 *
 * 静岡県の学力検査は各教科50点満点（5教科合計250点満点体系・高知県・福島県と同型）。
 * 一次ソースは5教科合計点を明記していないため、totalAverage/totalMaxScoreは独自に合算せず
 * 未設定のままとする（Y-0憲法: 一次ソースをそのまま再掲・独自集計はしない）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_SHIZUOKA: ExamScoreStatisticsFile = {
  prefectureCode: 'shizuoka',
  source: {
    url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/031/870/r7gakuryokukennsakekka.pdf',
    docTitle: '令和7年度静岡県公立高等学校入学者選抜学力検査結果等の報告書（静岡県教育委員会）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.55, maxScore: 50 },
        { subject: '数学', averageScore: 26.15, maxScore: 50 },
        { subject: '英語', averageScore: 27.25, maxScore: 50 },
        { subject: '社会', averageScore: 30.33, maxScore: 50 },
        { subject: '理科', averageScore: 25.64, maxScore: 50 },
      ],
      testTakerCount: 19146,
      source: {
        url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/031/870/r6gakuryokukensakekka.pdf',
        docTitle: '令和6年度静岡県公立高等学校入学者選抜学力検査結果等の報告書（前年度=令和5年度欄）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.81, maxScore: 50 },
        { subject: '数学', averageScore: 24.16, maxScore: 50 },
        { subject: '英語', averageScore: 30.26, maxScore: 50 },
        { subject: '社会', averageScore: 27.19, maxScore: 50 },
        { subject: '理科', averageScore: 25.64, maxScore: 50 },
      ],
      testTakerCount: 18605,
      source: {
        url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/031/870/r6gakuryokukensakekka.pdf',
        docTitle: '令和6年度静岡県公立高等学校入学者選抜学力検査結果等の報告書',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 35.05, maxScore: 50 },
        { subject: '数学', averageScore: 24.36, maxScore: 50 },
        { subject: '英語', averageScore: 31.71, maxScore: 50 },
        { subject: '社会', averageScore: 27.94, maxScore: 50 },
        { subject: '理科', averageScore: 27.60, maxScore: 50 },
      ],
      testTakerCount: 18104,
      source: {
        url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/031/870/r7gakuryokukennsakekka.pdf',
        docTitle: '令和7年度静岡県公立高等学校入学者選抜学力検査結果等の報告書',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 32.61, maxScore: 50 },
        { subject: '数学', averageScore: 24.66, maxScore: 50 },
        { subject: '英語', averageScore: 32.95, maxScore: 50 },
        { subject: '社会', averageScore: 31.60, maxScore: 50 },
        { subject: '理科', averageScore: 23.26, maxScore: 50 },
      ],
      testTakerCount: 16794,
      source: {
        url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/031/870/r8gakuryokukennsakekka.pdf',
        docTitle: '令和8年度静岡県公立高等学校入学者選抜学力検査結果等の報告書',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
