/**
 * 岡山県公立高等学校入学者選抜「学力検査の概要」（Λ-12・一般入学者選抜・完全受検者）。
 * 岡山県教育委員会が毎年公表するPDFの「第1表」に当年度の教科別最高・最低・平均点
 * （100点法換算）に加え、「（参考）最近5年間の平均点」として過去5年度分の推移表が
 * 併記されており、令和8年度版1本から令和3〜8年度の6年度分を一括収録できた
 * （高知県・奈良県と同型の「1つの公表資料に複数年度分が既に整理されている」高効率パターン）。
 * 各教科100点法換算(100点満点)。5教科合計は原資料に明記が無いためtotalAverageは未設定。
 * 令和8年度分のみ受検者数(5,586人・県立全日制学科別受検状況の完全受検者合計)が明記。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_OKAYAMA: ExamScoreStatisticsFile = {
  prefectureCode: 'okayama',
  source: {
    url: 'https://www.pref.okayama.jp/uploaded/life/993558_10155464_misc.pdf',
    docTitle: '令和8年度岡山県公立高等学校入学者選抜のための学力検査の結果等について「学力検査の概要」（岡山県教育委員会・最近5年間の推移表を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 59.7, maxScore: 100 },
        { subject: '社会', averageScore: 58.3, maxScore: 100 },
        { subject: '数学', averageScore: 60.3, maxScore: 100 },
        { subject: '理科', averageScore: 50.7, maxScore: 100 },
        { subject: '英語', averageScore: 50.5, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.9, maxScore: 100 },
        { subject: '社会', averageScore: 59.4, maxScore: 100 },
        { subject: '数学', averageScore: 59.7, maxScore: 100 },
        { subject: '理科', averageScore: 62.0, maxScore: 100 },
        { subject: '英語', averageScore: 51.4, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 68.4, maxScore: 100 },
        { subject: '社会', averageScore: 62.9, maxScore: 100 },
        { subject: '数学', averageScore: 63.6, maxScore: 100 },
        { subject: '理科', averageScore: 59.6, maxScore: 100 },
        { subject: '英語', averageScore: 66.3, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 64.0, maxScore: 100 },
        { subject: '社会', averageScore: 56.6, maxScore: 100 },
        { subject: '数学', averageScore: 53.2, maxScore: 100 },
        { subject: '理科', averageScore: 62.5, maxScore: 100 },
        { subject: '英語', averageScore: 47.1, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 64.6, maxScore: 100 },
        { subject: '社会', averageScore: 55.4, maxScore: 100 },
        { subject: '数学', averageScore: 56.2, maxScore: 100 },
        { subject: '理科', averageScore: 63.3, maxScore: 100 },
        { subject: '英語', averageScore: 54.6, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 68.2, maxScore: 100 },
        { subject: '社会', averageScore: 60.4, maxScore: 100 },
        { subject: '数学', averageScore: 57.4, maxScore: 100 },
        { subject: '理科', averageScore: 62.1, maxScore: 100 },
        { subject: '英語', averageScore: 61.8, maxScore: 100 },
      ],
      testTakerCount: 5586,
    },
  ],
};
