/**
 * 滋賀県立高等学校入学者選抜「結果のまとめ」（Λ-12・一般選抜学力検査・全受検者平均）。
 * 滋賀県教育委員会が毎年5月頃に公表するPDFの「Ⅲ 一般選抜学力検査」節に、
 * 検査教科ごとの受検者平均点が直接明記されている。令和8年度版は令和7年度の数値も
 * 比較列として併記しており(表7参照)、令和7年度版本体の数値とも完全一致することを
 * 確認済み(クロスチェック2重)。各教科100点満点が標準(膳所高校理数科・米原高校理数科は
 * 数学・理科を120点満点、伊吹高校普通科は国語・社会を120点満点とする傾斜配点だが、
 * 原資料はこの区別をせず全体の受検者平均点として1つの数値にまとめている)。
 * 原資料が「傾斜配点や面接を実施した学校があり、学校ごとに満点値が異なるため、全体としての
 * まとめは行わなかった」と明記しているため、5教科合計(totalAverage)は意図的に未設定。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_SHIGA: ExamScoreStatisticsFile = {
  prefectureCode: 'shiga',
  source: {
    url: 'https://www.pref.shiga.lg.jp/file/attachment/5614086.pdf',
    docTitle: '令和8年度滋賀県立高等学校入学者選抜結果のまとめ（滋賀県教育委員会・令和7年度分の比較列を含む）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 57.7, maxScore: 100 },
        { subject: '数学', averageScore: 45.4, maxScore: 100 },
        { subject: '社会', averageScore: 45.9, maxScore: 100 },
        { subject: '理科', averageScore: 41.1, maxScore: 100 },
        { subject: '英語', averageScore: 43.1, maxScore: 100 },
      ],
      source: {
        url: 'https://www.pref.shiga.lg.jp/file/attachment/5543598.pdf',
        docTitle: '令和7年度滋賀県立高等学校入学者選抜結果のまとめ（滋賀県教育委員会）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 44.3, maxScore: 100 },
        { subject: '数学', averageScore: 34.6, maxScore: 100 },
        { subject: '社会', averageScore: 43.9, maxScore: 100 },
        { subject: '理科', averageScore: 47.0, maxScore: 100 },
        { subject: '英語', averageScore: 35.1, maxScore: 100 },
      ],
    },
  ],
};
