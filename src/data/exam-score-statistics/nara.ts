/**
 * 奈良県公立高等学校入学者一般選抜 学力検査の結果（Λ-12・全受検者+合格者の両建て）。
 * 奈良県教育委員会公表資料(令和7年度分・令和5〜7年度の3年分推移表を含む)は珍しく、
 * 教科別平均点(全受検者のみ)に加えて総合平均点を「全受検者」「合格者」の両方で
 * 併記している。教科別内訳は全受検者分のみ公表されているため、合格者側は
 * 総合平均点のみ(subjects=[])として正直に記録する（独自に教科別へ按分しない）。
 * 各教科50点満点・5教科合計250点満点（5教科型受検者のみのデータ）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.nara.lg.jp/documents/5984/__p3-5_gakuryokukensakekka3_202507804pdf.pdf',
  docTitle: '令和7年度奈良県公立高等学校入学者一般選抜学力検査の結果について（奈良県教育委員会）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_NARA: ExamScoreStatisticsFile = {
  prefectureCode: 'nara',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.5, maxScore: 50 },
        { subject: '社会', averageScore: 28.8, maxScore: 50 },
        { subject: '数学', averageScore: 24.4, maxScore: 50 },
        { subject: '理科', averageScore: 27.5, maxScore: 50 },
        { subject: '英語', averageScore: 32.7, maxScore: 50 },
      ],
      totalAverage: 147.2,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'passers',
      subjects: [],
      totalAverage: 152.2,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 37.3, maxScore: 50 },
        { subject: '社会', averageScore: 31.2, maxScore: 50 },
        { subject: '数学', averageScore: 24.5, maxScore: 50 },
        { subject: '理科', averageScore: 27.6, maxScore: 50 },
        { subject: '英語', averageScore: 33.6, maxScore: 50 },
      ],
      totalAverage: 154.5,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [],
      totalAverage: 155.6,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 35.8, maxScore: 50 },
        { subject: '社会', averageScore: 32.1, maxScore: 50 },
        { subject: '数学', averageScore: 26.0, maxScore: 50 },
        { subject: '理科', averageScore: 27.3, maxScore: 50 },
        { subject: '英語', averageScore: 36.7, maxScore: 50 },
      ],
      totalAverage: 158.3,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [],
      totalAverage: 160.4,
      totalMaxScore: 250,
    },
  ],
};
