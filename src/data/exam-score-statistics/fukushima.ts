/**
 * 福島県公立高等学校入学者選抜 学力検査結果（Λ-12・前期選抜・連携型選抜合格者平均・各教科50点満点）。
 *
 * 福島県教育委員会公式サイトのPDFは個別URLの特定に至らなかったため、教委公表値を長期集計している
 * 「駿英家庭教師学院」の37年分アーカイブページと「福島県高校受験情報サイト」の年度別ページを出典と
 * する。**令和3年度分は別の独立サイト(数学館.com)の教科別内訳と完全一致、令和7年度分は上記2サイト
 * 間で教科別内訳・合計とも完全一致することを確認済み**（クロスチェック2重）。全て「前期選抜・連携型
 * 選抜合格者」の平均点であり、他県のtest-takers(全受検者)平均とは母集団が異なる点に注意。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_SHUNEI = {
  url: 'https://shunei.com/kennyusi-heikin37/',
  docTitle: '福島県立一般入試 年度別平均点過去37年間(平成元年〜令和7年)集計(駿英家庭教師学院)',
  fetchedAt: '2026-07-30',
};

const SOURCE_FUKUSHIMA_KOKO_JYUKEN = {
  url: 'https://www.fukushima-koko-jyuken.com/result/2026/',
  docTitle: '福島県公立高校入試結果(令和8年度・2026年3月実施)(福島県高校受験情報サイト)',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_FUKUSHIMA: ExamScoreStatisticsFile = {
  prefectureCode: 'fukushima',
  source: SOURCE_SHUNEI,
  years: [
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 27.0, maxScore: 50 },
        { subject: '数学', averageScore: 24.2, maxScore: 50 },
        { subject: '英語', averageScore: 23.2, maxScore: 50 },
        { subject: '理科', averageScore: 25.5, maxScore: 50 },
        { subject: '社会', averageScore: 25.7, maxScore: 50 },
      ],
      totalAverage: 125.5,
      totalMaxScore: 250,
      source: SOURCE_SHUNEI,
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 25.8, maxScore: 50 },
        { subject: '数学', averageScore: 24.2, maxScore: 50 },
        { subject: '英語', averageScore: 24.2, maxScore: 50 },
        { subject: '理科', averageScore: 22.4, maxScore: 50 },
        { subject: '社会', averageScore: 27.1, maxScore: 50 },
      ],
      totalAverage: 123.8,
      totalMaxScore: 250,
      source: SOURCE_SHUNEI,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 29.8, maxScore: 50 },
        { subject: '数学', averageScore: 22.4, maxScore: 50 },
        { subject: '英語', averageScore: 22.3, maxScore: 50 },
        { subject: '理科', averageScore: 27.4, maxScore: 50 },
        { subject: '社会', averageScore: 25.3, maxScore: 50 },
      ],
      totalAverage: 126.7,
      totalMaxScore: 250,
      source: SOURCE_SHUNEI,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 24.6, maxScore: 50 },
        { subject: '数学', averageScore: 23.9, maxScore: 50 },
        { subject: '英語', averageScore: 25.7, maxScore: 50 },
        { subject: '理科', averageScore: 22.5, maxScore: 50 },
        { subject: '社会', averageScore: 24.0, maxScore: 50 },
      ],
      totalAverage: 120.8,
      totalMaxScore: 250,
      source: SOURCE_SHUNEI,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 30.2, maxScore: 50 },
        { subject: '数学', averageScore: 24.5, maxScore: 50 },
        { subject: '英語', averageScore: 23.2, maxScore: 50 },
        { subject: '理科', averageScore: 25.9, maxScore: 50 },
        { subject: '社会', averageScore: 24.7, maxScore: 50 },
      ],
      totalAverage: 128.5,
      totalMaxScore: 250,
      source: SOURCE_SHUNEI,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 26.0, maxScore: 50 },
        { subject: '社会', averageScore: 25.8, maxScore: 50 },
        { subject: '数学', averageScore: 22.4, maxScore: 50 },
        { subject: '理科', averageScore: 19.9, maxScore: 50 },
        { subject: '英語', averageScore: 23.4, maxScore: 50 },
      ],
      totalAverage: 117.4,
      totalMaxScore: 250,
      testTakerCount: 9538,
      source: SOURCE_FUKUSHIMA_KOKO_JYUKEN,
    },
  ],
};
