/**
 * 福岡県公立高等学校入学者選抜 学力検査結果（Λ-12・全受検者平均）。
 *
 * 福岡県教育委員会が公表する「学力検査結果の概要について」PDFは教科別の得点率(%)のみを
 * 掲載し、点数そのものの平均点は明記していない。福岡県の学力検査は他県で多い100点満点では
 * なく各教科60点満点という特有の配点体系のため、点数ベースの平均点は受験情報サイト2媒体
 * (katacoto.com、uicc1070.main.jp)を出典とする。
 *
 * 令和5・6年度は両媒体の数値が一致（丸め方の違いのみ）し、さらに令和6年度分は公式PDF
 * (令和7年度版に記載された「前年度比◯ポイント」の得点率差分)から逆算した推定値
 * （国語≈39.5点・社会≈36.0点・数学≈31.6点・理科≈37.6点・英語≈36.7点、60点満点仮定）とも
 * 近似一致することを確認済み。
 *
 * 【令和7年度は収録見送り】上記2媒体の令和7年度の数値のうち理科(38点)・英語(39点)は、
 * 公式PDFの得点率(理科48.4%・英語51.1%、いずれも前年度比マイナス2桁ポイントの急落と明記)
 * から逆算した推定値(理科≈29.0点・英語≈30.7点)と大きく乖離し、内部矛盾を検知した。
 * 転記ミスか出典側の誤りかを切り分けられないため、令和7年度分は捏造ゼロ優先で収録を見送る。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_FUKUOKA: ExamScoreStatisticsFile = {
  prefectureCode: 'fukuoka',
  source: {
    url: 'https://fukuoka.katacoto.com/fukuoka-heikin/',
    docTitle: '福岡県公立高校入試（一般）平均点推移【過去10年分】',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 30.6, maxScore: 60 },
        { subject: '社会', averageScore: 33.3, maxScore: 60 },
        { subject: '数学', averageScore: 29.7, maxScore: 60 },
        { subject: '理科', averageScore: 37.8, maxScore: 60 },
        { subject: '英語', averageScore: 33.6, maxScore: 60 },
      ],
      totalAverage: 165.0,
      totalMaxScore: 300,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 39, maxScore: 60 },
        { subject: '社会', averageScore: 36, maxScore: 60 },
        { subject: '数学', averageScore: 32, maxScore: 60 },
        { subject: '理科', averageScore: 38, maxScore: 60 },
        { subject: '英語', averageScore: 37, maxScore: 60 },
      ],
      source: {
        url: 'https://uicc1070.main.jp/fukuoka-heikin/',
        docTitle: '福岡県公立高校入試の教科別平均点推移を徹底分析（独立の2媒体で数値が一致）',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
