/**
 * 愛媛県公立高等学校入学者選抜 学力検査の教科別平均点（Λ-12・全受検者平均）。
 * 愛媛県教育委員会の公式サイトには学力検査の得点状況PDFへの直接リンクが見当たらず、
 * 松山市の学習塾サイト(ably.net)が5年分(令和4〜8年度)をまとめて掲載しているのを発見。
 * 令和6年度分は独立した別記事(keep-smiling8.com)の数値(国語25.8/数学23.1/社会29.0/
 * 理科27.8/英語23.9/合計129.6)と完全一致することを確認済み(クロスチェック2重)。
 * 残り4年度分は単一ソース(ably.net)のみだが、全5年度とも教科別平均点の単純合計が
 * 公表された合計点と1点の誤差もなく完全一致しており(丸め誤差ゼロ)、正確な転記である
 * 確度が高いと判断し収録する。各教科50点満点・5教科合計250点満点。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.ably-net.com/smp/kawara/kawara_hs5.html',
  docTitle: '県立高校入試平均点（塾のably.NET・愛媛県公立高校入試の教科別平均点まとめ）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_EHIME: ExamScoreStatisticsFile = {
  prefectureCode: 'ehime',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 31.3, maxScore: 50 },
        { subject: '数学', averageScore: 26.1, maxScore: 50 },
        { subject: '英語', averageScore: 27.7, maxScore: 50 },
        { subject: '理科', averageScore: 25.6, maxScore: 50 },
        { subject: '社会', averageScore: 29.6, maxScore: 50 },
      ],
      totalAverage: 140.3,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 30.3, maxScore: 50 },
        { subject: '数学', averageScore: 26.5, maxScore: 50 },
        { subject: '英語', averageScore: 28.8, maxScore: 50 },
        { subject: '理科', averageScore: 25.7, maxScore: 50 },
        { subject: '社会', averageScore: 29.1, maxScore: 50 },
      ],
      totalAverage: 140.4,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 25.8, maxScore: 50 },
        { subject: '数学', averageScore: 23.1, maxScore: 50 },
        { subject: '英語', averageScore: 23.9, maxScore: 50 },
        { subject: '理科', averageScore: 27.8, maxScore: 50 },
        { subject: '社会', averageScore: 29.0, maxScore: 50 },
      ],
      totalAverage: 129.6,
      totalMaxScore: 250,
      source: {
        url: 'https://keep-smiling8.com/ehime-hsexam/',
        docTitle: '愛媛県公立高校入試2025の平均点は？難易度はやや高めか？（独立記事・令和6年度分の数値がably.netと完全一致しクロス検証済み）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 27.7, maxScore: 50 },
        { subject: '数学', averageScore: 27.7, maxScore: 50 },
        { subject: '英語', averageScore: 25.4, maxScore: 50 },
        { subject: '理科', averageScore: 22.8, maxScore: 50 },
        { subject: '社会', averageScore: 27.7, maxScore: 50 },
      ],
      totalAverage: 131.3,
      totalMaxScore: 250,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 27.6, maxScore: 50 },
        { subject: '数学', averageScore: 27.7, maxScore: 50 },
        { subject: '英語', averageScore: 27.5, maxScore: 50 },
        { subject: '理科', averageScore: 28.1, maxScore: 50 },
        { subject: '社会', averageScore: 28.9, maxScore: 50 },
      ],
      totalAverage: 139.8,
      totalMaxScore: 250,
    },
  ],
};
