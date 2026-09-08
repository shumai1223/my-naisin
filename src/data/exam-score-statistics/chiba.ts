/**
 * 千葉県公立高等学校入学者選抜 学力検査結果の概要（Λ-12・全受検者平均）。
 * 千葉県教育委員会「令和4年度千葉県公立高等学校入学者選抜学力検査結果の概要」に
 * 令和2〜4年度の教科別平均点推移表が掲載されていた（各教科100点満点・受検者平均）。
 *
 * 【重要】一次ソースの「令和4年度追検査」行は、教科別平均点の単純合計(231.5点)と
 * 公表された5教科合計点(197.6点)が約34点も乖離する内部矛盾を検知したため、
 * 収録を見送った（isPlausibleSubjectSumで機械検出・捏造ゼロ優先で正直にスキップ）。
 * 転記ミスか原資料側の誤りかを切り分けられなかったための保留であり、断定はしない。
 *
 * ⚠️令和8年度分（T-Y11F §5順序#3）: 一次ソース「令和8年度千葉県公立高等学校入学者選抜
 * 学力検査結果の概要」（フォント欠落PDF・p.3「5 結果の概要」表）
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/syuseir8kekka.pdf
 * pdftoppm+ビジョン解析で表を直接転記。本検査（全日制・2/17-18実施）のみを収録し、追検査は
 * R4分と同じ方針で対象外（一次資料自体も「追検査は受検者が少ないため平均点等を記していない」と
 * 明記）。市進(ko-jukennavi)・複数の学習塾ブログの独立した二次情報源（英語60.1点・社会60.0点・
 * 5教科合計281.9点＝前年比+19.1点）と完全一致を確認済み（2026-09-08）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2022/koukou/documents/r4kekka.pdf',
  docTitle: '令和4年度千葉県公立高等学校入学者選抜学力検査結果の概要（千葉県教育委員会）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_CHIBA: ExamScoreStatisticsFile = {
  prefectureCode: 'chiba',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '令和2年度（前期）',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 46.0, maxScore: 100 },
        { subject: '社会', averageScore: 60.7, maxScore: 100 },
        { subject: '数学', averageScore: 51.4, maxScore: 100 },
        { subject: '理科', averageScore: 48.8, maxScore: 100 },
        { subject: '英語', averageScore: 54.6, maxScore: 100 },
      ],
      totalAverage: 261.6,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和2年度（後期）',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.7, maxScore: 100 },
        { subject: '社会', averageScore: 62.1, maxScore: 100 },
        { subject: '数学', averageScore: 59.0, maxScore: 100 },
        { subject: '理科', averageScore: 59.7, maxScore: 100 },
        { subject: '英語', averageScore: 51.5, maxScore: 100 },
      ],
      totalAverage: 287.2,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和3年度（本検査）',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 52.8, maxScore: 100 },
        { subject: '社会', averageScore: 57.7, maxScore: 100 },
        { subject: '数学', averageScore: 59.3, maxScore: 100 },
        { subject: '理科', averageScore: 54.6, maxScore: 100 },
        { subject: '英語', averageScore: 61.7, maxScore: 100 },
      ],
      totalAverage: 286.2,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和4年度（本検査）',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 47.7, maxScore: 100 },
        { subject: '社会', averageScore: 56.3, maxScore: 100 },
        { subject: '数学', averageScore: 51.5, maxScore: 100 },
        { subject: '理科', averageScore: 52.7, maxScore: 100 },
        { subject: '英語', averageScore: 58.7, maxScore: 100 },
      ],
      totalAverage: 266.7,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和8年度（本検査）',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 54.0, maxScore: 100 },
        { subject: '社会', averageScore: 60.0, maxScore: 100 },
        { subject: '数学', averageScore: 52.6, maxScore: 100 },
        { subject: '理科', averageScore: 55.3, maxScore: 100 },
        { subject: '英語', averageScore: 60.1, maxScore: 100 },
      ],
      totalAverage: 281.9,
      totalMaxScore: 500,
      source: {
        url: 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/syuseir8kekka.pdf',
        docTitle: '令和8年度千葉県公立高等学校入学者選抜学力検査結果の概要（千葉県教育委員会）',
        fetchedAt: '2026-09-08',
      },
    },
  ],
};
