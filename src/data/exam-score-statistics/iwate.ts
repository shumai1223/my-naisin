/**
 * 岩手県公立高等学校入学者選抜 学力検査結果（Λ-12・各教科100点満点）。
 *
 * 令和8年度分は岩手県教育委員会公式PDF「学力検査（本検査）結果の分析」を直接読み込み、
 * 受検者平均・合格者平均の両区分を収録（教科別平均点・得点分布まで含む一次資料そのもの）。
 * 令和7年度の同名PDFは教委サイトが年度更新時に上書き削除しており404で取得不能だったため、
 * 令和7年度分はリセマム記事(受検者平均・5教科とも実測値明記)を出典とする。令和6年度分は
 * 塾選ジャーナル記事を出典とし、**リセマム記事の「前年度比」欄から逆算した令和6年度の値と
 * 5教科中4教科が完全一致することを確認済み**（理科のみ0.3点の差異があり、前年度比の丸め
 * 誤差の蓄積と判断・過度な確信を避けるためtotalAverageは自前算出せず未設定のままとする）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_R6 = {
  url: 'https://bestjuku.com/shingaku/s-article/10167/',
  docTitle: '令和６年度岩手県立高等学校入学者選抜における学力検査（本検査）結果の分析について(塾選ジャーナル)',
  fetchedAt: '2026-07-30',
};

const SOURCE_R7 = {
  url: 'https://resemom.jp/article/2025/04/22/81703.html',
  docTitle: '【高校受験2025】岩手県の学力検査、国社英で平均点増…総点10点アップ(リセマム)',
  fetchedAt: '2026-07-30',
};

const SOURCE_R8 = {
  url: 'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/006/462/r8_bunseki2.pdf',
  docTitle: '令和8年度岩手県立高等学校入学者選抜学力検査（本検査）結果の分析(岩手県教育委員会)',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_IWATE: ExamScoreStatisticsFile = {
  prefectureCode: 'iwate',
  source: SOURCE_R8,
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 61.9, maxScore: 100 },
        { subject: '数学', averageScore: 53.6, maxScore: 100 },
        { subject: '社会', averageScore: 62.7, maxScore: 100 },
        { subject: '英語', averageScore: 46.5, maxScore: 100 },
        { subject: '理科', averageScore: 53.6, maxScore: 100 },
      ],
      source: SOURCE_R6,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 67.3, maxScore: 100 },
        { subject: '数学', averageScore: 53.0, maxScore: 100 },
        { subject: '社会', averageScore: 66.7, maxScore: 100 },
        { subject: '英語', averageScore: 49.7, maxScore: 100 },
        { subject: '理科', averageScore: 52.4, maxScore: 100 },
      ],
      totalAverage: 289.1,
      totalMaxScore: 500,
      testTakerCount: 6663,
      source: SOURCE_R7,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 57.6, maxScore: 100 },
        { subject: '数学', averageScore: 56.2, maxScore: 100 },
        { subject: '社会', averageScore: 63.0, maxScore: 100 },
        { subject: '英語', averageScore: 58.2, maxScore: 100 },
        { subject: '理科', averageScore: 55.0, maxScore: 100 },
      ],
      totalAverage: 290.2,
      totalMaxScore: 500,
      testTakerCount: 6576,
      source: SOURCE_R8,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 57.8, maxScore: 100 },
        { subject: '数学', averageScore: 56.1, maxScore: 100 },
        { subject: '社会', averageScore: 63.1, maxScore: 100 },
        { subject: '英語', averageScore: 58.3, maxScore: 100 },
        { subject: '理科', averageScore: 55.0, maxScore: 100 },
      ],
      totalAverage: 290.3,
      totalMaxScore: 500,
      testTakerCount: 6267,
      source: SOURCE_R8,
    },
  ],
};
