/**
 * 大阪府公立高等学校入学者選抜学力検査（一般入学者選抜全日制の課程）合格者の学力実態調査（Λ-12）。
 * 大阪府教育センター（大阪府の教育行政機関・一次ソース）が毎年公表するPDF。
 *
 * **調査方法の重要な注記**: この調査は全合格者の集計ではなく、「合格者を母集団とする
 * 無作為抽出標本調査」（母集団を学校選択の倍率で5段階に層化し、各層から抽出・標本数700）
 * である。他県の全数集計とは性質が異なる点を明記した上で、教育センターが一次資料として
 * 公表した値をそのまま再掲する（Y-0憲法：独自推定はしない・公表値をそのまま転記）。
 *
 * **A/B/Cの構造**: 国語・数学・英語の3教科は、それぞれ大問A/B/Cの3グループに分けて
 * 平均得点(100点満点換算)が公表されている（教科全体の単一平均点は公表されていない）。
 * 理科・社会は分割なし。各グループの受検者数（重み）が原資料に無いため、3教科について
 * 単純平均や合算した「教科平均点」「総点」を独自に算出することはしない（捏造ゼロ）。
 * 原資料の項目名をそのままsubjectラベルとして転記する。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_BASE_URL = 'https://www.osaka-c.ed.jp/category/forteacher/investigate/publication';

export const EXAM_SCORE_STATISTICS_OSAKA: ExamScoreStatisticsFile = {
  prefectureCode: 'osaka',
  source: {
    url: `${SOURCE_BASE_URL}/r07/R7_gakuryoku_jittai_tyousa.pdf`,
    docTitle:
      '令和7年度大阪府公立高等学校入学者選抜学力検査（一般入学者選抜全日制の課程）における府立高等学校合格者の学力実態調査（大阪府教育センター）',
    fetchedAt: '2026-08-01',
  },
  years: [
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語A', averageScore: 57.2, maxScore: 100 },
        { subject: '国語B', averageScore: 62.6, maxScore: 100 },
        { subject: '国語C', averageScore: 67.6, maxScore: 100 },
        { subject: '数学A', averageScore: 52.3, maxScore: 100 },
        { subject: '数学B', averageScore: 49.0, maxScore: 100 },
        { subject: '数学C', averageScore: 45.4, maxScore: 100 },
        { subject: '英語A', averageScore: 35.6, maxScore: 100 },
        { subject: '英語B', averageScore: 41.9, maxScore: 100 },
        { subject: '英語C', averageScore: 65.7, maxScore: 100 },
        { subject: '理科', averageScore: 61.7, maxScore: 100 },
        { subject: '社会', averageScore: 58.2, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語A', averageScore: 60.9, maxScore: 100 },
        { subject: '国語B', averageScore: 53.3, maxScore: 100 },
        { subject: '国語C', averageScore: 58.2, maxScore: 100 },
        { subject: '数学A', averageScore: 50.8, maxScore: 100 },
        { subject: '数学B', averageScore: 57.6, maxScore: 100 },
        { subject: '数学C', averageScore: 56.4, maxScore: 100 },
        { subject: '英語A', averageScore: 41.5, maxScore: 100 },
        { subject: '英語B', averageScore: 46.7, maxScore: 100 },
        { subject: '英語C', averageScore: 57.0, maxScore: 100 },
        { subject: '理科', averageScore: 57.5, maxScore: 100 },
        { subject: '社会', averageScore: 54.1, maxScore: 100 },
      ],
      source: {
        url: `${SOURCE_BASE_URL}/r06/R6_gakuryoku_jittai_tyousa.pdf`,
        docTitle:
          '令和6年度大阪府公立高等学校入学者選抜学力検査（一般入学者選抜全日制の課程）における府立高等学校合格者の学力実態調査（大阪府教育センター）',
        fetchedAt: '2026-08-01',
      },
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語A', averageScore: 55.0, maxScore: 100 },
        { subject: '国語B', averageScore: 66.7, maxScore: 100 },
        { subject: '国語C', averageScore: 64.3, maxScore: 100 },
        { subject: '数学A', averageScore: 48.9, maxScore: 100 },
        { subject: '数学B', averageScore: 55.2, maxScore: 100 },
        { subject: '数学C', averageScore: 51.2, maxScore: 100 },
        { subject: '英語A', averageScore: 36.2, maxScore: 100 },
        { subject: '英語B', averageScore: 53.2, maxScore: 100 },
        { subject: '英語C', averageScore: 67.3, maxScore: 100 },
        { subject: '理科', averageScore: 61.0, maxScore: 100 },
        { subject: '社会', averageScore: 53.2, maxScore: 100 },
      ],
      source: {
        url: `${SOURCE_BASE_URL}/r05/R5_gakuryoku_jittai_tyousa.pdf`,
        docTitle:
          '令和5年度大阪府公立高等学校入学者選抜学力検査（一般入学者選抜全日制の課程）における府立高等学校合格者の学力実態調査（大阪府教育センター）',
        fetchedAt: '2026-08-01',
      },
    },
  ],
};
