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
 *
 * ⚠️令和8年度分（T-Y11F §5順序#3）: R5〜R7の一次資料は「府立高等学校合格者の学力実態調査」
 * （母集団を合格者とした層化無作為抽出・標本数700）だったが、R8の一次資料は表題・調査方法とも
 * 異なる別調査「一般入学者選抜学力検査受験者の学力実態調査」（デジタル採点システムに入力された
 * 得点データの**全数調査**・母集団は合格者でなく全受験者）に変更されていた。このためR8のみ
 * `averageType: 'test-takers'`（R5〜R7は`'passers'`）とし、原資料の調査方法の違いをコメントで
 * 明記した上でそのまま転記する（Y-0: 異なる調査を同一系列であるかのように混同しない）。
 * 入試自体は90点満点だが、原資料が「100点満点換算」の値として教科別平均点を公表しており、
 * R5〜R7と同じ100点満点表記のため直接比較可能。数値はよどきかく(note)のブログ記事の要約
 * （「数学Cと社会の平均点が50点を下回っている」）と矛盾しないことを確認済み（2026-09-08）。
 */
import type { ExamScoreStatisticsFile } from '@/lib/exam-score-statistics';

const SOURCE_BASE_URL = 'https://www.osaka-c.ed.jp/category/forteacher/investigate/publication';

export const EXAM_SCORE_STATISTICS_OSAKA: ExamScoreStatisticsFile = {
  prefectureCode: 'osaka',
  source: {
    url: `${SOURCE_BASE_URL}/r08/R8_gakuryoku_jittai_tyousa.pdf`,
    docTitle:
      '令和8年度大阪府公立高等学校一般入学者選抜学力検査受験者の学力実態調査（大阪府教育センター）',
    fetchedAt: '2026-09-08',
  },
  years: [
    {
      fiscalYearLabel: '令和8年度',
      averageType: 'test-takers',
      subjects: [
        { subject: '国語A', averageScore: 51.7, maxScore: 100 },
        { subject: '国語B', averageScore: 56.1, maxScore: 100 },
        { subject: '国語C', averageScore: 51.8, maxScore: 100 },
        { subject: '数学A', averageScore: 50.2, maxScore: 100 },
        { subject: '数学B', averageScore: 50.7, maxScore: 100 },
        { subject: '数学C', averageScore: 49.9, maxScore: 100 },
        { subject: '英語A', averageScore: 43.4, maxScore: 100 },
        { subject: '英語B', averageScore: 54.7, maxScore: 100 },
        { subject: '英語C', averageScore: 64.4, maxScore: 100 },
        { subject: '理科', averageScore: 62.7, maxScore: 100 },
        { subject: '社会', averageScore: 46.7, maxScore: 100 },
      ],
    },
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
      source: {
        url: `${SOURCE_BASE_URL}/r07/R7_gakuryoku_jittai_tyousa.pdf`,
        docTitle:
          '令和7年度大阪府公立高等学校入学者選抜学力検査（一般入学者選抜全日制の課程）における府立高等学校合格者の学力実態調査（大阪府教育センター）',
        fetchedAt: '2026-08-01',
      },
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
