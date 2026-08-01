/**
 * 富山県公立高等学校入学者選抜 学力検査結果（Λ-12・「教育長談話」参考表）。
 *
 * 富山県教育委員会が合格発表当日に公表する「教育長談話」に、参考資料として
 * 全日制の課程学力検査成績一覧（教科別平均点・100点満点換算）が令和7・8年度の
 * 2カ年分並記されている。談話本文は「学力検査受検者は4,471名」の直後にこの表を
 * 掲載しており、合格者限定ではなく受検者全体の平均点と判断した。
 * WebSearchで得た令和7年度の要約値（英語51.5/数学37.6/国語68.2/理科54.0/社会51.1）が
 * この一次PDFの令和7年度列と完全一致することも確認済み。
 *
 * 原資料の「総平均点」は5教科の相加平均（100点満点）であり合計(500点満点)ではないため、
 * 広島/徳島と同じ理由でtotalAverage/totalMaxScoreは独自に格納しない(捏造ゼロ)。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.toyama.jp/documents/47208/080313.pdf',
  docTitle: '教育長談話（令和8年3月13日・富山県立高等学校全日制の課程入学者選抜）参考:全日制の課程学力検査成績一覧',
  fetchedAt: '2026-08-01',
};

export const EXAM_SCORE_STATISTICS_TOYAMA: ExamScoreStatisticsFile = {
  prefectureCode: 'toyama',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 69.8, maxScore: 100 },
        { subject: '社会', averageScore: 63.0, maxScore: 100 },
        { subject: '数学', averageScore: 48.5, maxScore: 100 },
        { subject: '理科', averageScore: 55.9, maxScore: 100 },
        { subject: '英語', averageScore: 57.0, maxScore: 100 },
      ],
      testTakerCount: 4471,
      source: SOURCE,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 68.2, maxScore: 100 },
        { subject: '社会', averageScore: 51.1, maxScore: 100 },
        { subject: '数学', averageScore: 37.6, maxScore: 100 },
        { subject: '理科', averageScore: 54.0, maxScore: 100 },
        { subject: '英語', averageScore: 51.5, maxScore: 100 },
      ],
      source: SOURCE,
    },
  ],
};
