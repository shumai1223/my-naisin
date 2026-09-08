/**
 * 埼玉県公立高等学校入学者選抜 学力検査の結果分析（Λ-12・全受検者平均）。
 * 埼玉県教育委員会が公表した「令和4年度埼玉県公立高等学校入学者選抜の結果分析について」に、
 * 平成30〜令和4年度の5年分の教科別平均点推移表が掲載されていた。
 *
 * 埼玉県の学力検査は各教科100点満点（高知県の各50点満点とは満点が異なる点に注意）。
 * 一次ソースは「学校選択問題」（数学・英語の発展的な選択問題、実施校のみ）の平均点も
 * 別掲しているが、標準的な5教科（学力検査問題）とは別建ての試験のため今回は収録対象外とし、
 * 標準5教科（国語・社会・数学・理科・英語）のみを収録する。ソース自体が5教科の合計点を
 * 明記していないため、totalAverage/totalMaxScoreは独自に合算せず未設定のままとする
 * （Y-0憲法: 一次ソースをそのまま再掲・独自集計はしない）。
 *
 * ⚠️令和8年度分（T-Y11F §5順序#3）: 一次ソース「令和8年度埼玉県公立高等学校入学者選抜
 * 実施状況について」（HTML本文に直接記載・PDF化不要）
 * https://www.pref.saitama.lg.jp/documents/281615/news2026042101.pdf
 * 「3 学力検査」セクションの「学力検査問題の受検者平均点」欄をそのまま転記（学校選択問題は
 * R4分と同じ方針で対象外）。梅野弘之オフィシャルブログの独立した二次情報源と前年度比較値も
 * 含め完全一致を確認済み（2026-09-08）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE = {
  url: 'https://www.pref.saitama.lg.jp/documents/220507/040728_h.pdf',
  docTitle: '令和4年度埼玉県公立高等学校入学者選抜の結果分析について（埼玉県教育委員会）',
  fetchedAt: '2026-07-30',
};

export const EXAM_SCORE_STATISTICS_SAITAMA: ExamScoreStatisticsFile = {
  prefectureCode: 'saitama',
  source: SOURCE,
  years: [
    {
      fiscalYearLabel: '平成30年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 52.8, maxScore: 100 },
        { subject: '社会', averageScore: 55.9, maxScore: 100 },
        { subject: '数学', averageScore: 44.0, maxScore: 100 },
        { subject: '理科', averageScore: 51.7, maxScore: 100 },
        { subject: '英語', averageScore: 55.9, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '平成31年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 58.3, maxScore: 100 },
        { subject: '社会', averageScore: 60.3, maxScore: 100 },
        { subject: '数学', averageScore: 42.3, maxScore: 100 },
        { subject: '理科', averageScore: 44.5, maxScore: 100 },
        { subject: '英語', averageScore: 47.7, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和2年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 57.2, maxScore: 100 },
        { subject: '社会', averageScore: 55.4, maxScore: 100 },
        { subject: '数学', averageScore: 67.9, maxScore: 100 },
        { subject: '理科', averageScore: 51.1, maxScore: 100 },
        { subject: '英語', averageScore: 52.2, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 68.7, maxScore: 100 },
        { subject: '社会', averageScore: 62.6, maxScore: 100 },
        { subject: '数学', averageScore: 62.2, maxScore: 100 },
        { subject: '理科', averageScore: 56.2, maxScore: 100 },
        { subject: '英語', averageScore: 51.4, maxScore: 100 },
      ],
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 62.9, maxScore: 100 },
        { subject: '社会', averageScore: 52.9, maxScore: 100 },
        { subject: '数学', averageScore: 48.0, maxScore: 100 },
        { subject: '理科', averageScore: 52.5, maxScore: 100 },
        { subject: '英語', averageScore: 52.6, maxScore: 100 },
      ],
      testTakerCount: 40812,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語', averageScore: 60.9, maxScore: 100 },
        { subject: '社会', averageScore: 66.8, maxScore: 100 },
        { subject: '数学', averageScore: 50.4, maxScore: 100 },
        { subject: '理科', averageScore: 63.2, maxScore: 100 },
        { subject: '英語', averageScore: 52.1, maxScore: 100 },
      ],
      source: {
        url: 'https://www.pref.saitama.lg.jp/documents/281615/news2026042101.pdf',
        docTitle: '令和8年度埼玉県公立高等学校入学者選抜実施状況について（埼玉県教育委員会）',
        fetchedAt: '2026-09-08',
      },
    },
  ],
};
