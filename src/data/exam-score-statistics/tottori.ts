/**
 * 鳥取県立高等学校入学者選抜学力検査における得点状況（Λ-12・全日制課程受検者平均）。
 * 鳥取県教育委員会の令和8年度PDF「学力検査結果（得点状況等）」の表1に「(参考)過去16年間」
 * として平成22〜令和8年度の17年度分が1つの表にまとめて掲載されており、1つの資料から
 * これまでで最多となる17年度分を一括収録できた（香川7年度分・大分11年度分を大きく更新）。
 * 各教科50点満点・5教科合計250点満点。令和8年度分のみ受検者数(2,223人)が明記。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.tottori.lg.jp/secure/1425005/r8kenritukoutougakkougaku.pdf',
  docTitle: '令和8年度鳥取県立高等学校入学者選抜学力検査結果（得点状況等）（鳥取県教育委員会・過去16年間の推移表を含む）',
  fetchedAt: '2026-07-30',
};

function year(
  fiscalYearLabel: string,
  kokugo: number,
  shakai: number,
  sugaku: number,
  rika: number,
  eigo: number,
  total: number,
  testTakerCount?: number
) {
  return {
    fiscalYearLabel,
    averageType: 'test-takers' as const,
    subjects: [
      { subject: '国語', averageScore: kokugo, maxScore: 50 },
      { subject: '社会', averageScore: shakai, maxScore: 50 },
      { subject: '数学', averageScore: sugaku, maxScore: 50 },
      { subject: '理科', averageScore: rika, maxScore: 50 },
      { subject: '英語', averageScore: eigo, maxScore: 50 },
    ],
    totalAverage: total,
    totalMaxScore: 250,
    ...(testTakerCount ? { testTakerCount } : {}),
  };
}

export const EXAM_SCORE_STATISTICS_TOTTORI: ExamScoreStatisticsFile = {
  prefectureCode: 'tottori',
  source: SOURCE,
  years: [
    year('平成22年度', 29.1, 30.2, 26.5, 25.4, 22.2, 133.3),
    year('平成23年度', 24.9, 29.1, 23.2, 29.1, 26.8, 133.1),
    year('平成24年度', 25.3, 30.0, 22.8, 29.2, 26.6, 133.9),
    year('平成25年度', 23.5, 27.1, 27.5, 25.2, 27.1, 130.5),
    year('平成26年度', 25.6, 24.9, 28.5, 26.7, 30.7, 136.3),
    year('平成27年度', 29.6, 33.4, 26.4, 27.2, 28.9, 145.5),
    year('平成28年度', 27.9, 27.4, 25.2, 30.6, 30.3, 141.3),
    year('平成29年度', 28.3, 27.6, 27.4, 31.4, 29.1, 143.8),
    year('平成30年度', 29.9, 30.4, 24.6, 28.6, 27.7, 141.2),
    year('平成31年度', 26.9, 30.1, 27.3, 31.3, 24.6, 140.3),
    year('令和2年度', 27.7, 28.5, 25.7, 27.0, 28.4, 137.3),
    year('令和3年度', 29.0, 35.3, 24.4, 27.0, 28.7, 144.4),
    year('令和4年度', 31.8, 24.7, 26.7, 28.2, 25.8, 137.1),
    year('令和5年度', 30.9, 31.8, 26.9, 26.0, 28.2, 143.8),
    year('令和6年度', 31.5, 23.9, 23.8, 27.0, 25.4, 131.5),
    year('令和7年度', 26.8, 28.7, 26.6, 23.7, 27.2, 133.0),
    year('令和8年度', 27.7, 24.7, 27.1, 28.5, 27.6, 135.6, 2223),
  ],
};
