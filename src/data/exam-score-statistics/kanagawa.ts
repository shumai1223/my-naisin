/**
 * 神奈川県公立高等学校入学者選抜 学力検査の結果（Λ-12・全日制の課程・合格者平均）。
 *
 * 神奈川県教育委員会が年度ごとに公表する「学力検査の結果」PDFから令和6〜8年度の3年分を
 * 収録。3資料とも独立した公式PDF(r6/r7/r8gakuryokukensakekka.pdf)から直接収録しており、
 * 年度重複によるクロス検証は無いが、いずれも同一の教育委員会公式資料シリーズ。
 *
 * 【重要】神奈川県の公表値は他県で多い「全受検者平均」ではなく「合格者平均点」
 * （追検査を含む・満点は100点）である点に注意。既存のprefecture-exam-systems-verifiedでも
 * 神奈川県は合格者平均点のみ公表と記録済み。averageType='passers'で明示し、他県のtest-takers
 * 平均と同列比較しないようにする。定時制の課程は別建て公表のため今回は全日制のみ収録する。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_KANAGAWA: ExamScoreStatisticsFile = {
  prefectureCode: 'kanagawa',
  source: {
    url: 'https://www.pref.kanagawa.jp/docs/dc4/nyusen/nyusen/gakuryokukensa/kekka.html',
    docTitle: '神奈川県公立高等学校入学者選抜学力検査の結果（神奈川県教育委員会・年度別PDF集）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 64.0, maxScore: 100 },
        { subject: '社会', averageScore: 54.8, maxScore: 100 },
        { subject: '数学', averageScore: 55.6, maxScore: 100 },
        { subject: '理科', averageScore: 57.3, maxScore: 100 },
        { subject: '英語', averageScore: 47.0, maxScore: 100 },
      ],
      source: {
        url: 'https://www.pref.kanagawa.jp/documents/46164/r6gakuryokukensakekka.pdf',
        docTitle: '令和6年度神奈川県公立高等学校入学者選抜学力検査の結果',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 73.8, maxScore: 100 },
        { subject: '社会', averageScore: 57.9, maxScore: 100 },
        { subject: '数学', averageScore: 51.3, maxScore: 100 },
        { subject: '理科', averageScore: 51.7, maxScore: 100 },
        { subject: '英語', averageScore: 51.4, maxScore: 100 },
      ],
      source: {
        url: 'https://www.pref.kanagawa.jp/documents/46164/r7gakuryokukensakekka.pdf',
        docTitle: '令和7年度神奈川県公立高等学校入学者選抜学力検査の結果',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 64.1, maxScore: 100 },
        { subject: '社会', averageScore: 62.3, maxScore: 100 },
        { subject: '数学', averageScore: 56.7, maxScore: 100 },
        { subject: '理科', averageScore: 60.0, maxScore: 100 },
        { subject: '英語', averageScore: 56.0, maxScore: 100 },
      ],
      source: {
        url: 'https://www.pref.kanagawa.jp/documents/46164/r8gakuryokukensakekka.pdf',
        docTitle: '令和8年度神奈川県公立高等学校入学者選抜学力検査の結果',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
