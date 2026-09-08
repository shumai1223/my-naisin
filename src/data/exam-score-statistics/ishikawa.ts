/**
 * 石川県公立高等学校入学者選抜 学力検査の教科別平均点（Λ-12・合格者平均）。
 * 石川県教育委員会公表値を集約する学習塾サイト(jyuku-goodjob.com・進学塾グッジョブ)が
 * 過去10年分(平成28〜令和7年度)をまとめて掲載しているのを発見。「合格者平均点」と
 * 明記されているためaverageType='passers'。各教科100点満点・5教科合計500点満点。
 *
 * 【重要な発見】令和2年度分は教科別平均点の単純合計(227.3)が公表合計(228)と0.7点
 * 乖離しており、他の9年度分(全て差0.4点以内)と比べて明らかに大きい不一致を検知した。
 * 沖縄県の令和4年度分と同様のパターンで転記ミスの可能性が高いため、捏造ゼロ優先で
 * 令和2年度分は収録を見送り、確度の高い9年度分のみ収録する。
 *
 * ⚠️令和8年度分（T-Y11F §5順序#3）: 一次集約元の学習塾サイトはまだR8未掲載だったため、
 * 独立した2媒体（家庭教師のあすなろ系WebSearch要約・学習塾ブログonejuku55.com）から
 * 数値を取得した。国語53.8・社会38.2・数学48.3・理科45.7・英語53.4（単純合計239.4、
 * 記事側の総計239とは0.4点差で許容範囲内）。両媒体で完全一致を確認済み（2026-09-09）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

export const EXAM_SCORE_STATISTICS_ISHIKAWA: ExamScoreStatisticsFile = {
  prefectureCode: 'ishikawa',
  source: {
    url: 'https://jyuku-goodjob.com/kouritsu_average/',
    docTitle: '石川県公立高校入試 過去10年の平均点（進学塾グッジョブ・石川県教育委員会公表値の集約）',
    fetchedAt: '2026-07-30',
  },
  years: [
    {
      fiscalYearLabel: '平成28年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 53.8, maxScore: 100 },
        { subject: '数学', averageScore: 48.0, maxScore: 100 },
        { subject: '英語', averageScore: 50.5, maxScore: 100 },
        { subject: '理科', averageScore: 52.9, maxScore: 100 },
        { subject: '社会', averageScore: 47.8, maxScore: 100 },
      ],
      totalAverage: 253,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '平成29年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 56.6, maxScore: 100 },
        { subject: '数学', averageScore: 48.5, maxScore: 100 },
        { subject: '英語', averageScore: 53.2, maxScore: 100 },
        { subject: '理科', averageScore: 50.9, maxScore: 100 },
        { subject: '社会', averageScore: 47.8, maxScore: 100 },
      ],
      totalAverage: 257,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '平成30年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 52.9, maxScore: 100 },
        { subject: '数学', averageScore: 51.7, maxScore: 100 },
        { subject: '英語', averageScore: 52.0, maxScore: 100 },
        { subject: '理科', averageScore: 56.2, maxScore: 100 },
        { subject: '社会', averageScore: 50.6, maxScore: 100 },
      ],
      totalAverage: 263,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '平成31年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 54.5, maxScore: 100 },
        { subject: '数学', averageScore: 49.6, maxScore: 100 },
        { subject: '英語', averageScore: 48.7, maxScore: 100 },
        { subject: '理科', averageScore: 55.6, maxScore: 100 },
        { subject: '社会', averageScore: 57.9, maxScore: 100 },
      ],
      totalAverage: 266,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和3年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 60.1, maxScore: 100 },
        { subject: '数学', averageScore: 48.6, maxScore: 100 },
        { subject: '英語', averageScore: 46.1, maxScore: 100 },
        { subject: '理科', averageScore: 51.2, maxScore: 100 },
        { subject: '社会', averageScore: 48.0, maxScore: 100 },
      ],
      totalAverage: 254,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和4年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 54.7, maxScore: 100 },
        { subject: '数学', averageScore: 47.2, maxScore: 100 },
        { subject: '英語', averageScore: 39.9, maxScore: 100 },
        { subject: '理科', averageScore: 53.5, maxScore: 100 },
        { subject: '社会', averageScore: 39.9, maxScore: 100 },
      ],
      totalAverage: 235,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和5年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 59.3, maxScore: 100 },
        { subject: '数学', averageScore: 44.4, maxScore: 100 },
        { subject: '英語', averageScore: 50.2, maxScore: 100 },
        { subject: '理科', averageScore: 50.8, maxScore: 100 },
        { subject: '社会', averageScore: 41.9, maxScore: 100 },
      ],
      totalAverage: 247,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和6年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 67.2, maxScore: 100 },
        { subject: '数学', averageScore: 51.1, maxScore: 100 },
        { subject: '英語', averageScore: 48.0, maxScore: 100 },
        { subject: '理科', averageScore: 52.0, maxScore: 100 },
        { subject: '社会', averageScore: 41.1, maxScore: 100 },
      ],
      totalAverage: 259,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和7年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 54.7, maxScore: 100 },
        { subject: '数学', averageScore: 46.9, maxScore: 100 },
        { subject: '英語', averageScore: 51.6, maxScore: 100 },
        { subject: '理科', averageScore: 47.4, maxScore: 100 },
        { subject: '社会', averageScore: 46.3, maxScore: 100 },
      ],
      totalAverage: 247,
      totalMaxScore: 500,
    },
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'passers',
      subjects: [
        { subject: '国語', averageScore: 53.8, maxScore: 100 },
        { subject: '数学', averageScore: 48.3, maxScore: 100 },
        { subject: '英語', averageScore: 53.4, maxScore: 100 },
        { subject: '理科', averageScore: 45.7, maxScore: 100 },
        { subject: '社会', averageScore: 38.2, maxScore: 100 },
      ],
      totalAverage: 239,
      totalMaxScore: 500,
      source: {
        url: 'https://onejuku55.com/2026/05/09/%E3%80%90%E7%9F%B3%E5%B7%9D%E7%9C%8C%E5%85%AC%E7%AB%8B%E9%AB%98%E6%A0%A1%E5%85%A5%E8%A9%A6%E3%80%80%E5%B9%B3%E5%9D%87%E7%82%B92026%E3%80%91%EF%BC%88%E6%9B%B4%E6%96%B0%E4%B8%AD%EF%BC%89/',
        docTitle: '【2026】石川県公立高校入試 合格者平均点＆得点分布',
        fetchedAt: '2026-09-09',
      },
    },
  ],
};
