/**
 * 青森県公立高等学校入学者選抜 学力検査結果（Λ-12・全受検者平均・各教科100点満点）。
 *
 * 教委公式PDF(pref.aomori.lg.jp)は11頁でこの環境のpoppler未導入制約により読み取れなかったため、
 * 教委発表を報じた学習塾サイト・報道記事を出典とする。**令和7年度分は独立した2つの記事間で
 * クロス検証済み**: 令和7年度時点の記事本文(58.7/58.1/48.8/47.6/53.1・合計266.3)と、令和8年度
 * 記事に記載の「前年度比」から逆算した値(令和8年度の実測値から前年度比を引き戻した5教科分)が
 * 5教科・合計とも完全一致した。令和6年度分の合計(289.6)も、令和7年度記事が明記する「前年度比
 * -23.3点」から逆算(266.3+23.3=289.6)した値と完全一致し、独立した2記事間の整合を確認済み。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_R6 = {
  url: 'https://juku.educreation.co.jp/high-exam-information/9464/',
  docTitle: '令和6年度青森県立高校入試 平均点など最終結果(勉強ナビ個別指導進学塾)',
  fetchedAt: '2026-07-30',
};

const SOURCE_R7 = {
  url: 'https://juku.educreation.co.jp/high-exam-information/11620/',
  docTitle: '【県立高校入試平均点】令和7年度青森県立高等学校入学者選抜学力検査の結果(勉強ナビ個別指導進学塾)',
  fetchedAt: '2026-07-30',
};

const SOURCE_R8 = {
  url: 'https://resemom.jp/article/2026/05/27/86195.html',
  docTitle: '【高校受験2026】青森県立高入試、国語の平均点が大幅増(リセマム)',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_AOMORI: ExamScoreStatisticsFile = {
  prefectureCode: 'aomori',
  source: SOURCE_R8,
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 64.8, maxScore: 100 },
        { subject: '社会', averageScore: 57.1, maxScore: 100 },
        { subject: '数学', averageScore: 54.3, maxScore: 100 },
        { subject: '理科', averageScore: 58.9, maxScore: 100 },
        { subject: '英語', averageScore: 54.5, maxScore: 100 },
      ],
      totalAverage: 289.6,
      totalMaxScore: 500,
      source: SOURCE_R6,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 58.7, maxScore: 100 },
        { subject: '社会', averageScore: 58.1, maxScore: 100 },
        { subject: '数学', averageScore: 48.8, maxScore: 100 },
        { subject: '理科', averageScore: 47.6, maxScore: 100 },
        { subject: '英語', averageScore: 53.1, maxScore: 100 },
      ],
      totalAverage: 266.3,
      totalMaxScore: 500,
      source: SOURCE_R7,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 71.7, maxScore: 100 },
        { subject: '社会', averageScore: 51.6, maxScore: 100 },
        { subject: '数学', averageScore: 48.0, maxScore: 100 },
        { subject: '理科', averageScore: 50.1, maxScore: 100 },
        { subject: '英語', averageScore: 54.7, maxScore: 100 },
      ],
      totalAverage: 276.1,
      totalMaxScore: 500,
      testTakerCount: 6535,
      source: SOURCE_R8,
    },
  ],
};
