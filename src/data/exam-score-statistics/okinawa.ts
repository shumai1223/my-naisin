/**
 * 沖縄県公立高等学校入学者選抜 学力検査 教科別平均点（Λ-12・全受検者平均）。
 * 沖縄県教育委員会公式サイトに得点状況PDFへの直接リンクが見当たらず、学習塾サイト
 * (bengal.okinawa・教育開発出版の資料より作成と明記)が8年分をまとめて掲載しているのを
 * 発見。各教科60点満点・5教科合計300点満点(令和7年度分はリセマム記事で「各教科60点満点の
 * 合計300点満点」「合計平均162.5点」と独立に確認できクロス検証済み)。
 *
 * 平成31年度分は独立した別サイト(e-seishin.jp)の教科別数値(国語35.0/社会31.6/数学28.9/
 * 理科25.0/英語26.7)と完全一致することを確認済み(クロスチェック2重)。
 *
 * 【重要な発見】令和4年度分は教科別平均点の単純合計(157.1)が公表合計(158.1)と1.0点
 * 乖離しており、他の7年度分(全て合計との差0.5点以内)と比べて明らかに大きい不一致を検知した。
 * 転記ミスの可能性が高くどの数値が誤りかを特定できないため、捏造ゼロ優先で令和4年度分は
 * 収録を見送り、確度の高い7年度分(平成30・31年度、令和2・3・5・6・7年度)のみ収録する。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://bengal.okinawa/%E6%B2%96%E7%B8%84%E7%9C%8C%E3%81%AE%E9%AB%98%E6%A0%A1%E5%85%A5%E8%A9%A6%E3%81%AE%E5%B9%B3%E5%9D%87%E7%82%B9%E6%8E%A8%E7%A7%BB/',
  docTitle: '高校入試｜過去8年分の平均点推移（学習塾ベンガル・教育開発出版の資料より作成）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_OKINAWA: ExamScoreStatisticsFile = {
  prefectureCode: 'okinawa',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '平成30年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.5, maxScore: 60 },
        { subject: '社会', averageScore: 29.1, maxScore: 60 },
        { subject: '数学', averageScore: 31.6, maxScore: 60 },
        { subject: '理科', averageScore: 24.3, maxScore: 60 },
        { subject: '英語', averageScore: 27.5, maxScore: 60 },
      ],
      totalAverage: 146.0,
      totalMaxScore: 300,
    },
    {
      fiscalYearLabel: '平成31年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 35.0, maxScore: 60 },
        { subject: '社会', averageScore: 31.6, maxScore: 60 },
        { subject: '数学', averageScore: 28.9, maxScore: 60 },
        { subject: '理科', averageScore: 25.0, maxScore: 60 },
        { subject: '英語', averageScore: 26.7, maxScore: 60 },
      ],
      totalAverage: 147.2,
      totalMaxScore: 300,
      source: {
        url: 'https://www.e-seishin.jp/guidance/kako-nyusiheikin.html',
        docTitle: '誠伸社 沖縄県立高校入試 過去の平均点（独立サイト・平成31年度分の数値がbengal.okinawaと完全一致しクロス検証済み）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 34.8, maxScore: 60 },
        { subject: '社会', averageScore: 32.4, maxScore: 60 },
        { subject: '数学', averageScore: 33.5, maxScore: 60 },
        { subject: '理科', averageScore: 24.2, maxScore: 60 },
        { subject: '英語', averageScore: 33.7, maxScore: 60 },
      ],
      totalAverage: 158.6,
      totalMaxScore: 300,
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 33.2, maxScore: 60 },
        { subject: '社会', averageScore: 32.1, maxScore: 60 },
        { subject: '数学', averageScore: 29.9, maxScore: 60 },
        { subject: '理科', averageScore: 32.9, maxScore: 60 },
        { subject: '英語', averageScore: 30.2, maxScore: 60 },
      ],
      totalAverage: 158.3,
      totalMaxScore: 300,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 35.5, maxScore: 60 },
        { subject: '社会', averageScore: 32.0, maxScore: 60 },
        { subject: '数学', averageScore: 30.5, maxScore: 60 },
        { subject: '理科', averageScore: 29.7, maxScore: 60 },
        { subject: '英語', averageScore: 32.1, maxScore: 60 },
      ],
      totalAverage: 159.9,
      totalMaxScore: 300,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 30.7, maxScore: 60 },
        { subject: '社会', averageScore: 29.8, maxScore: 60 },
        { subject: '数学', averageScore: 30.3, maxScore: 60 },
        { subject: '理科', averageScore: 25.4, maxScore: 60 },
        { subject: '英語', averageScore: 28.3, maxScore: 60 },
      ],
      totalAverage: 144.6,
      totalMaxScore: 300,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 34.3, maxScore: 60 },
        { subject: '社会', averageScore: 30.6, maxScore: 60 },
        { subject: '数学', averageScore: 31.4, maxScore: 60 },
        { subject: '理科', averageScore: 35.8, maxScore: 60 },
        { subject: '英語', averageScore: 29.9, maxScore: 60 },
      ],
      totalAverage: 162.5,
      totalMaxScore: 300,
      source: {
        url: 'https://s.resemom.jp/pages/public-highschool-exam/47okinawa/index.html',
        docTitle: 'リセマム（令和7年度の学力検査制度=各教科60点満点・合計300点満点と明記）',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
