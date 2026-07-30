/**
 * 徳島県公立高等学校入学学力検査（一般選抜）の成績結果（Λ-12・受検者平均点）。
 * 徳島県教育委員会教育創生課「令和5年度徳島県公立高等学校入学学力検査集計結果について」
 * PDF(報告事項1)の後半(一般選抜セクション)に、令和5年度成績表として平成30年度〜
 * 令和5年度の6年度分の推移が併記されている(同PDF前半の「育成型選抜」は受検者数812名の
 * 別選抜区分のため対象外・混同しないよう注意)。各教科100点満点・5教科合計500点満点。
 *
 * 【重要な注意】原資料が「5教科総合」として明記する値(例:令和5年度58.1点)は5教科の
 * 単純合計ではなく相加平均(新潟県・広島県と同型の様式・本文に「100点満点に換算して」と
 * 明記)であるため、totalAverageには意図的に格納しない。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_TOKUSHIMA: ExamScoreStatisticsFile = {
  prefectureCode: 'tokushima',
  source: {
    url: 'https://www.pref.tokushima.lg.jp/file/attachment/846416.pdf',
    docTitle: '令和5年度徳島県公立高等学校入学学力検査集計結果について（徳島県教育委員会教育創生課・一般選抜成績表に平成30〜令和4年度分の推移を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '平成30年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.0, maxScore: 100 },
        { subject: '数学', averageScore: 40.4, maxScore: 100 },
        { subject: '社会', averageScore: 53.3, maxScore: 100 },
        { subject: '理科', averageScore: 51.9, maxScore: 100 },
        { subject: '英語', averageScore: 59.0, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '平成31年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 62.6, maxScore: 100 },
        { subject: '数学', averageScore: 46.1, maxScore: 100 },
        { subject: '社会', averageScore: 54.8, maxScore: 100 },
        { subject: '理科', averageScore: 54.5, maxScore: 100 },
        { subject: '英語', averageScore: 57.4, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 57.5, maxScore: 100 },
        { subject: '数学', averageScore: 46.0, maxScore: 100 },
        { subject: '社会', averageScore: 61.2, maxScore: 100 },
        { subject: '理科', averageScore: 60.6, maxScore: 100 },
        { subject: '英語', averageScore: 55.8, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 60.8, maxScore: 100 },
        { subject: '数学', averageScore: 46.9, maxScore: 100 },
        { subject: '社会', averageScore: 57.6, maxScore: 100 },
        { subject: '理科', averageScore: 58.0, maxScore: 100 },
        { subject: '英語', averageScore: 52.3, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 58.9, maxScore: 100 },
        { subject: '数学', averageScore: 42.9, maxScore: 100 },
        { subject: '社会', averageScore: 60.2, maxScore: 100 },
        { subject: '理科', averageScore: 55.2, maxScore: 100 },
        { subject: '英語', averageScore: 53.0, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 64.6, maxScore: 100 },
        { subject: '数学', averageScore: 46.0, maxScore: 100 },
        { subject: '社会', averageScore: 58.4, maxScore: 100 },
        { subject: '理科', averageScore: 60.1, maxScore: 100 },
        { subject: '英語', averageScore: 61.0, maxScore: 100 },
      ],
      testTakerCount: 4302,
    },
  ],
};
