/**
 * 和歌山県立高等学校入学者選抜「学力検査結果の概要」（Λ-12・一般選抜）。
 * 和歌山県教育委員会が年度ごとに公表するPDFの各教科セクション冒頭に
 * 「本年度の平均点は◯◯点（満点100点）であった」という文が直接明記されており、
 * 令和6・7年度の2本から2年度分を取得できた。各教科100点満点・一般選抜区分。
 *
 * 【注意】PDF内の「調査人数」欄(3各問題別結果の表)は年度・教科によって値が大きく異なる
 * (令和7年度=約5,000人台/令和6年度=538人)。前者は一般選抜受検者全体、後者は詳細な
 * 設問別分析のための抽出サンプルとみられ、どちらが平均点算出の母集団かを原資料が明記して
 * いないため、誤解を避けるべくtestTakerCountは記録しない。5教科合計もPDFに明記が無いため
 * totalAverageは意図的に未設定。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_WAKAYAMA: ExamScoreStatisticsFile = {
  prefectureCode: 'wakayama',
  source: {
    url: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00219965_d/fil/r7_kekkatogaiyou.pdf',
    docTitle: '令和7年度県立高等学校入学者選抜学力検査結果の概要（和歌山県教育委員会・一般選抜）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.1, maxScore: 100 },
        { subject: '社会', averageScore: 41.3, maxScore: 100 },
        { subject: '数学', averageScore: 47.7, maxScore: 100 },
        { subject: '理科', averageScore: 51.9, maxScore: 100 },
        { subject: '英語', averageScore: 58.1, maxScore: 100 },
      ],
      source: {
        url: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00217752_d/fil/r6_kekkatogaiyou.pdf',
        docTitle: '令和6年度県立高等学校入学者選抜学力検査結果の概要（和歌山県教育委員会・一般選抜）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 58.4, maxScore: 100 },
        { subject: '社会', averageScore: 45.8, maxScore: 100 },
        { subject: '数学', averageScore: 46.5, maxScore: 100 },
        { subject: '理科', averageScore: 46.3, maxScore: 100 },
        { subject: '英語', averageScore: 52.3, maxScore: 100 },
      ],
    },
  ],
};
