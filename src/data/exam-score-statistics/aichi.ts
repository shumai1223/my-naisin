/**
 * 愛知県公立高等学校入学者選抜 学力検査結果（Λ-12・全日制課程・全受検者平均）。
 *
 * 愛知県教育委員会は「学力検査得点の平均点（全日制課程）」を毎年公表しているが、公式PDFへの
 * 直接アクセスに至らなかったため、受験情報を専門に扱う学習塾ブログ複数媒体を出典とする。
 * 令和7年度分は独立した3媒体（個別指導塾CLOVER・次世代型個別指導塾幸明・WebSearch要約）で
 * 数値が完全一致、令和8年度分も独立した2媒体（個別指導塾CLOVER・愛知県公立高校入試まとめ
 * ブログ）で5教科合計(60.1点)まで完全一致することを確認済み（クロスチェック2重以上）。
 * 令和5・6年度分は個別指導さくら予備校の単独記事だが、いずれも「教科別平均点の単純合計」が
 * 記事内の5科合計表記と完全一致しており、転記の内部整合性は高い。
 *
 * 【重要】愛知県の学力検査は他県で一般的な100点満点ではなく、各教科22点満点（5教科合計
 * 110点満点）という特有のスケーリング方式（採点者間のばらつきを補正するための素点変換）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_AICHI: ExamScoreStatisticsFile = {
  prefectureCode: 'aichi',
  source: {
    url: 'https://clover-school.net/r7koukouheikin/',
    docTitle: '令和8年度愛知県公立高校入試学力検査得点の平均点（全日制課程）（個別指導塾CLOVER）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 14.8, maxScore: 22 },
        { subject: '数学', averageScore: 15.2, maxScore: 22 },
        { subject: '社会', averageScore: 11.5, maxScore: 22 },
        { subject: '理科', averageScore: 12.3, maxScore: 22 },
        { subject: '英語', averageScore: 12.7, maxScore: 22 },
      ],
      totalAverage: 66.5,
      totalMaxScore: 110,
      source: {
        url: 'https://sakura-yobiko.com/2023/05/18/what-can-be-seen-from-the-average-score-of-the-aichi-prefecture-public-high-school-entrance-examination/',
        docTitle: '令和5年度の愛知県公立高校入試の平均点から何が言えるのか（個別指導塾さくら予備校）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 11.2, maxScore: 22 },
        { subject: '数学', averageScore: 12.3, maxScore: 22 },
        { subject: '社会', averageScore: 12.9, maxScore: 22 },
        { subject: '理科', averageScore: 11.3, maxScore: 22 },
        { subject: '英語', averageScore: 14.8, maxScore: 22 },
      ],
      totalAverage: 62.5,
      totalMaxScore: 110,
      source: {
        url: 'https://sakura-yobiko.com/2024/05/13/2024-aichi-prefecture-public-high-school-entrance-exam-average-score/',
        docTitle: '2024年度の愛知県公立高校入試の平均点が愛知県教育委員会より公表されました（個別指導塾さくら予備校）',
        fetchedAt: '2026-07-30',
      },
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 15.6, maxScore: 22 },
        { subject: '数学', averageScore: 13.2, maxScore: 22 },
        { subject: '社会', averageScore: 12.2, maxScore: 22 },
        { subject: '理科', averageScore: 10.9, maxScore: 22 },
        { subject: '英語', averageScore: 13.8, maxScore: 22 },
      ],
      totalAverage: 65.7,
      totalMaxScore: 110,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 13.2, maxScore: 22 },
        { subject: '数学', averageScore: 11.8, maxScore: 22 },
        { subject: '社会', averageScore: 13.4, maxScore: 22 },
        { subject: '理科', averageScore: 9.9, maxScore: 22 },
        { subject: '英語', averageScore: 11.8, maxScore: 22 },
      ],
      totalAverage: 60.1,
      totalMaxScore: 110,
      source: {
        url: 'https://aichi-kokonyushi.hatenablog.com/entry/2026koritsuheikin',
        docTitle: '【2026年度(令和8年度)】愛知県公立高校入試の平均点が発表！合計60.1点は「大幅下落」の衝撃',
        fetchedAt: '2026-07-30',
      },
    },
  ],
};
