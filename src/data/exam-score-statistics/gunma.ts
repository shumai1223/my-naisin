/**
 * 群馬県公立高等学校入学者選抜 学力検査結果（Λ-12・全受検者+合格者の両建て）。
 * 群馬県教育委員会は年度ごとの結果ページで、①5教科合計(500点満点)の受検者平均点/
 * 合格者平均点 ②教科別平均点(受検者のみ)の両方を公表している。
 *
 * 【重要な発見・既知の不一致】教科別平均点5科目の単純合計は、公表された受検者合計
 * (５教科合計)と一致しない（例: 令和8年度は 68.6+53.3+51.1+59.8+56.4=289.2 だが
 * 公表された受検者平均点は291.5・約2.3点の乖離。令和7年度も同様に約2.1点の乖離を
 * R7専用ページとR8ページの前年度列の両方で再確認済み＝転記ミスではなく構造的な差）。
 * 公式ページの注記「各教科間で傾斜配点を行った場合も100点満点で集計」のとおり、
 * 志望校ごとに異なる傾斜配点（学校別の教科重み付け）を適用した個人ごとの合計を
 * 平均しているため、単純な教科別平均点の合計とは一致しない構造だと考えられる。
 * そのため、教科別平均点(subjects)と5教科合計平均点(totalAverage)は「同じ受検者
 * 集団の別々の集計方法による値」として両方正直に記録し、isPlausibleSubjectSumが
 * falseを返すことを許容する（バグではなく既知の構造的差異）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.gunma.jp/site/kyouiku/754285.html',
  docTitle:
    '令和8年度群馬県公立高等学校入学者選抜結果について（群馬県教育委員会高校教育課・令和7年度分は同教委の専用ページで独立確認済み）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_GUNMA: ExamScoreStatisticsFile = {
  prefectureCode: 'gunma',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 60.1, maxScore: 100 },
        { subject: '数学', averageScore: 55.6, maxScore: 100 },
        { subject: '英語', averageScore: 55.1, maxScore: 100 },
        { subject: '社会', averageScore: 60.1, maxScore: 100 },
        { subject: '理科', averageScore: 54.5, maxScore: 100 },
      ],
      totalAverage: 287.5,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [],
      totalAverage: 288.6,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 68.6, maxScore: 100 },
        { subject: '数学', averageScore: 53.3, maxScore: 100 },
        { subject: '英語', averageScore: 51.1, maxScore: 100 },
        { subject: '社会', averageScore: 59.8, maxScore: 100 },
        { subject: '理科', averageScore: 56.4, maxScore: 100 },
      ],
      totalAverage: 291.5,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'passers',
      subjects: [],
      totalAverage: 292.3,
      totalMaxScore: 500,
    },
  ],
};
