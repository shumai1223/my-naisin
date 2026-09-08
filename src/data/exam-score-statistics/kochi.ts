/**
 * 高知県公立高等学校入学者選抜 学力検査の結果分析（Λ-12第一段・全受検者平均）。
 * 高知県教育委員会が毎年公表する「学力検査の結果分析」PDFに、当該年度を含む過去5年分の
 * 教科別平均点推移表が掲載されており、1つの一次ソースから5年度分を収録できた。
 *
 * ⚠️令和7・8年度分（T-Y11F §5順序#3）: 一次ソース「令和8年度高知県公立高等学校入学者選抜
 * における学力検査の結果分析」（フォント欠落PDF・24頁・p.1「平均点の推移」表）
 * https://www.pref.kochi.lg.jp/doc/r8_kekkabunseki/file_contents/r8_bunseki_honsatsu.pdf
 * pdftoppm+ビジョン解析で表を直接転記。R6年度分の数値（国語21.7・社会19.0・数学18.3・
 * 理科19.9・英語22.9）が既存の令和6年度エントリと完全一致し、新規転記と既存データ双方の
 * クロス検証になった。この表にR7年度分（既存ファイル未収録の空白年度）も併記されていたため
 * 合わせて収録した。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.kochi.lg.jp/doc/r6_bunseki/file_contents/R6_bunseki_honsatsu.pdf',
  docTitle: '令和6年度 高知県公立高等学校入学者選抜における学力検査の結果分析（高知県教育委員会・令和6年7月）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_KOCHI: ExamScoreStatisticsFile = {
  prefectureCode: 'kochi',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 20.4, maxScore: 50 },
        { subject: '社会', averageScore: 19.4, maxScore: 50 },
        { subject: '数学', averageScore: 19.0, maxScore: 50 },
        { subject: '理科', averageScore: 23.3, maxScore: 50 },
        { subject: '英語', averageScore: 24.7, maxScore: 50 },
      ],
      totalAverage: 106.8,
      totalMaxScore: 250,
      testTakerCount: 3836,
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 22.6, maxScore: 50 },
        { subject: '社会', averageScore: 24.9, maxScore: 50 },
        { subject: '数学', averageScore: 21.1, maxScore: 50 },
        { subject: '理科', averageScore: 22.0, maxScore: 50 },
        { subject: '英語', averageScore: 23.6, maxScore: 50 },
      ],
      totalAverage: 114.2,
      totalMaxScore: 250,
      testTakerCount: 3632,
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 22.4, maxScore: 50 },
        { subject: '社会', averageScore: 23.4, maxScore: 50 },
        { subject: '数学', averageScore: 16.2, maxScore: 50 },
        { subject: '理科', averageScore: 19.9, maxScore: 50 },
        { subject: '英語', averageScore: 20.6, maxScore: 50 },
      ],
      totalAverage: 102.5,
      totalMaxScore: 250,
      testTakerCount: 3696,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 21.3, maxScore: 50 },
        { subject: '社会', averageScore: 25.1, maxScore: 50 },
        { subject: '数学', averageScore: 19.2, maxScore: 50 },
        { subject: '理科', averageScore: 20.5, maxScore: 50 },
        { subject: '英語', averageScore: 24.6, maxScore: 50 },
      ],
      totalAverage: 110.7,
      totalMaxScore: 250,
      testTakerCount: 3543,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 21.7, maxScore: 50 },
        { subject: '社会', averageScore: 19.0, maxScore: 50 },
        { subject: '数学', averageScore: 18.3, maxScore: 50 },
        { subject: '理科', averageScore: 19.9, maxScore: 50 },
        { subject: '英語', averageScore: 22.9, maxScore: 50 },
      ],
      totalAverage: 101.6,
      totalMaxScore: 250,
      testTakerCount: 3673,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 23.4, maxScore: 50 },
        { subject: '社会', averageScore: 22.2, maxScore: 50 },
        { subject: '数学', averageScore: 18.8, maxScore: 50 },
        { subject: '理科', averageScore: 14.0, maxScore: 50 },
        { subject: '英語', averageScore: 18.6, maxScore: 50 },
      ],
      totalAverage: 97.0,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.kochi.lg.jp/doc/r8_kekkabunseki/file_contents/r8_bunseki_honsatsu.pdf',
        docTitle: '令和8年度高知県公立高等学校入学者選抜における学力検査の結果分析（高知県教育委員会・前年度比較表より）',
        fetchedAt: '2026-09-09',
      },
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 25.0, maxScore: 50 },
        { subject: '社会', averageScore: 23.1, maxScore: 50 },
        { subject: '数学', averageScore: 24.4, maxScore: 50 },
        { subject: '理科', averageScore: 22.3, maxScore: 50 },
        { subject: '英語', averageScore: 21.9, maxScore: 50 },
      ],
      totalAverage: 116.8,
      totalMaxScore: 250,
      source: {
        url: 'https://www.pref.kochi.lg.jp/doc/r8_kekkabunseki/file_contents/r8_bunseki_honsatsu.pdf',
        docTitle: '令和8年度高知県公立高等学校入学者選抜における学力検査の結果分析（高知県教育委員会）',
        fetchedAt: '2026-09-09',
      },
    },
  ],
};
