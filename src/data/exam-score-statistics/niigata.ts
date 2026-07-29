/**
 * 新潟県公立高等学校入学者選抜 学力検査の概況（Λ-12・全日制課程受検者の抽出調査）。
 * 新潟県教育委員会が毎年公表する「学力検査の概況」（令和8年度実施分・令和4〜8年度の
 * 5年分の教科別平均点推移表を含む）。全日制課程受検者からの抽出調査（令和8年度は
 * 約5.1%・593人）に基づく値である点に注意。各教科100点満点。
 *
 * 【設計上の注意】一次ソースは「5教科の合計得点の平均点（100点満点換算）」という
 * 数値も公表しているが、これは5教科の合計(500点満点)を100点満点に単純比例換算した
 * ものではなく、実際には5教科平均点の相加平均（sum/5）に等しい（例: 令和8年度は
 * 49.9+58.3+42.8+46.4+50.3=247.7、247.7/5=49.54≈49.5と一致確認済み）。他県の
 * totalAverage（5教科の合計点=sum）とは尺度が異なるため、混同を避けるためこの値は
 * totalAverage欄には格納しない（独自に変換・按分もしない。原資料の脚注のとおり
 * 正直に「教科別平均点のみ」を記録する）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.niigata.lg.jp/uploaded/attachment/495921.pdf',
  docTitle: '令和8年度高等学校入学者選抜 学力検査の概況（新潟県教育委員会 高等学校教育課・義務教育課）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_NIIGATA: ExamScoreStatisticsFile = {
  prefectureCode: 'niigata',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 52.0, maxScore: 100 },
        { subject: '社会', averageScore: 55.2, maxScore: 100 },
        { subject: '数学', averageScore: 45.4, maxScore: 100 },
        { subject: '理科', averageScore: 55.6, maxScore: 100 },
        { subject: '英語', averageScore: 41.3, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 50.4, maxScore: 100 },
        { subject: '社会', averageScore: 50.6, maxScore: 100 },
        { subject: '数学', averageScore: 39.7, maxScore: 100 },
        { subject: '理科', averageScore: 58.4, maxScore: 100 },
        { subject: '英語', averageScore: 41.1, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 55.3, maxScore: 100 },
        { subject: '社会', averageScore: 46.6, maxScore: 100 },
        { subject: '数学', averageScore: 40.6, maxScore: 100 },
        { subject: '理科', averageScore: 44.6, maxScore: 100 },
        { subject: '英語', averageScore: 50.7, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 61.9, maxScore: 100 },
        { subject: '社会', averageScore: 60.2, maxScore: 100 },
        { subject: '数学', averageScore: 45.3, maxScore: 100 },
        { subject: '理科', averageScore: 49.8, maxScore: 100 },
        { subject: '英語', averageScore: 49.6, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 49.9, maxScore: 100 },
        { subject: '社会', averageScore: 58.3, maxScore: 100 },
        { subject: '数学', averageScore: 42.8, maxScore: 100 },
        { subject: '理科', averageScore: 46.4, maxScore: 100 },
        { subject: '英語', averageScore: 50.3, maxScore: 100 },
      ],
      testTakerCount: 593,
    },
  ],
};
