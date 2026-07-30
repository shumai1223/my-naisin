/**
 * 大分県公立高等学校入学者選抜（第一次）学力検査 教科別平均点（Λ-12・全受検者平均）。
 * 大分県教育委員会高校教育課の公表値を引用する集約サイト(find-school.info)が
 * 平成28〜令和7年度の10年分をまとめて掲載しているのを発見(令和8年度分はリセマム記事で別途補完・合計11年度分)。
 *
 * 【重要な検証】令和7年度分は独立記事(tosemi.jp・末尾に「引用：大分県教育委員会
 * 高校教育課」と明記)の数値(国語33.7/社会27.2/数学28.9/理科26.5/英語26.9/
 * 合計143.2)と完全一致。さらにtosemi.jp記事が併記する「前年度比」から令和6年度の
 * 教科別数値を逆算すると、find-school.infoの令和6年度分(27.5/30.8/38.6/32.3/27.0)
 * と5教科全てで完全一致した。令和8年度分はリセマム記事(「前年度比+4.1点」等)から同様に
 * 逆算すると令和7年度の確定値と5教科全てで一致した。この二重の逆算クロス検証により
 * 令和6〜8年度の3年分は特に確度が高いと判断した。
 *
 * 各教科50点満点。5教科合計は令和7・8年度のみ公式記事が直接明記しており
 * (143.2点・147.3点)、他の年度は独自に合算せずtotalAverage未設定のままとする
 * （find-school.infoが誤って「300点満点」と記載しているが、各教科50点満点×5教科=250点満点
 * が正しく、令和7年度の合計143.2点(教科別合計と完全一致)からも250点満点体系と確認できる）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://find-school.info/%E5%A4%A7%E5%88%86%E7%9C%8C%E5%85%AC%E7%AB%8B%E9%AB%98%E6%A0%A1%E5%85%A5%E8%A9%A6%E3%81%AE%E5%90%84%E5%B9%B4%E5%BA%A6%E3%81%AE%E5%B9%B3%E5%9D%87%E7%82%B9',
  docTitle: '大分県公立高校入試の各年度の平均点（find-school.info・大分県教育委員会公表値の集約）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_OITA: ExamScoreStatisticsFile = {
  prefectureCode: 'oita',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '平成28年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 26.0, maxScore: 50 },
        { subject: '数学', averageScore: 25.5, maxScore: 50 },
        { subject: '理科', averageScore: 26.9, maxScore: 50 },
        { subject: '社会', averageScore: 31.5, maxScore: 50 },
        { subject: '英語', averageScore: 24.8, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '平成29年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 34.9, maxScore: 50 },
        { subject: '数学', averageScore: 28.4, maxScore: 50 },
        { subject: '理科', averageScore: 26.4, maxScore: 50 },
        { subject: '社会', averageScore: 32.8, maxScore: 50 },
        { subject: '英語', averageScore: 30.1, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '平成30年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 25.7, maxScore: 50 },
        { subject: '数学', averageScore: 23.8, maxScore: 50 },
        { subject: '理科', averageScore: 27.5, maxScore: 50 },
        { subject: '社会', averageScore: 33.0, maxScore: 50 },
        { subject: '英語', averageScore: 26.9, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '平成31年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 32.2, maxScore: 50 },
        { subject: '数学', averageScore: 24.7, maxScore: 50 },
        { subject: '理科', averageScore: 31.8, maxScore: 50 },
        { subject: '社会', averageScore: 30.8, maxScore: 50 },
        { subject: '英語', averageScore: 31.0, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.1, maxScore: 50 },
        { subject: '数学', averageScore: 31.9, maxScore: 50 },
        { subject: '理科', averageScore: 31.4, maxScore: 50 },
        { subject: '社会', averageScore: 26.9, maxScore: 50 },
        { subject: '英語', averageScore: 34.9, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 29.8, maxScore: 50 },
        { subject: '数学', averageScore: 33.0, maxScore: 50 },
        { subject: '理科', averageScore: 33.9, maxScore: 50 },
        { subject: '社会', averageScore: 35.1, maxScore: 50 },
        { subject: '英語', averageScore: 25.8, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.4, maxScore: 50 },
        { subject: '数学', averageScore: 27.3, maxScore: 50 },
        { subject: '理科', averageScore: 34.0, maxScore: 50 },
        { subject: '社会', averageScore: 28.5, maxScore: 50 },
        { subject: '英語', averageScore: 35.2, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.3, maxScore: 50 },
        { subject: '数学', averageScore: 29.6, maxScore: 50 },
        { subject: '理科', averageScore: 29.2, maxScore: 50 },
        { subject: '社会', averageScore: 25.1, maxScore: 50 },
        { subject: '英語', averageScore: 27.4, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 27.5, maxScore: 50 },
        { subject: '数学', averageScore: 30.8, maxScore: 50 },
        { subject: '理科', averageScore: 38.6, maxScore: 50 },
        { subject: '社会', averageScore: 32.3, maxScore: 50 },
        { subject: '英語', averageScore: 27.0, maxScore: 50 },
      ],
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.7, maxScore: 50 },
        { subject: '数学', averageScore: 28.9, maxScore: 50 },
        { subject: '理科', averageScore: 26.5, maxScore: 50 },
        { subject: '社会', averageScore: 27.2, maxScore: 50 },
        { subject: '英語', averageScore: 26.9, maxScore: 50 },
      ],
      totalAverage: 143.2,
      totalMaxScore: 250,
      source: {
        url: 'https://tosemi.jp/neweduinfo/19209',
        docTitle: '【令和7年度】大分県立高校入試 平均点は143.2点！（東セミ・末尾に大分県教育委員会高校教育課からの引用と明記）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 32.0, maxScore: 50 },
        { subject: '数学', averageScore: 28.2, maxScore: 50 },
        { subject: '理科', averageScore: 26.4, maxScore: 50 },
        { subject: '社会', averageScore: 32.3, maxScore: 50 },
        { subject: '英語', averageScore: 28.5, maxScore: 50 },
      ],
      totalAverage: 147.3,
      totalMaxScore: 250,
      source: {
        url: 'https://resemom.jp/article/2026/05/27/86197.html',
        docTitle: '【高校受験2026】大分県立高入試、5教科平均点は4.1点上昇（リセマム）',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
